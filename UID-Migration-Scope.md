# UID v1→v2 Migration Scope

**Created:** February 7, 2026
**Status:** SCOPING — Not yet approved for implementation
**Goal:** ONE standard. `sn_` for sites, `sa_` for agents. Eliminate `SN-`/`SA-` v1 format entirely.

---

## Current State (v1)

| Item | Format | Example | Width |
|------|--------|---------|-------|
| site_uid | `SN-XXXXXXXX` | SN-00000047 | 11 chars |
| agent_uid | `SA-XXXXXXXX` | SA-00000003 | 11 chars |
| Counter | Sequential integer | `next_site_uid: 92` in JSON | — |

## Target State (v2)

| Item | Format | Example | Width |
|------|--------|---------|-------|
| site_uid | `sn_xxxxxxxxxxxx` | sn_1m3k7a4e5f2q | 15 chars |
| agent_uid | `sa_xxxxxxxxxxxx` | sa_0b9r2t1w8k4p | 15 chars |
| Generator | Timestamp(7) + Random(5), base36 | No counter needed | — |

v2 generator already exists: `connect.shopnet/backend/snd/uid_generator.py` → `generate_uid_v2(prefix)`

---

## Live Database Audit (Feb 7 2026)

### shopnet_sites (RDS Instance 1)

| Table | Column | Type | CHECK Constraint | Rows |
|-------|--------|------|-----------------|------|
| `endpoint_taxonomy` | `site_uid` | VARCHAR(**12**) | `^SN-[0-9]{8}$` | **82** (SN-00000001 → SN-00000102) |
| `website_data` | `site_uid` | VARCHAR(**12**) | none | joins to endpoint_taxonomy |
| `json_backup` | `site_uid` | VARCHAR(**12**) | none | joins to endpoint_taxonomy |
| `sites` | `site_uid` | VARCHAR(**50**) | none | 47 rows (legacy table) |
| `sites` | `s3_folder` | VARCHAR | none | 47 rows — stores SN- as S3 folder path |

**Also on shopnet_connect:** `secrets.site_uid` VARCHAR(20) — 1 row, currently NULL. No conversion needed but column exists.

**No foreign key constraints** — all joins are in application code (app.py SQL queries).

### shopnet_assist (RDS Instance 1)

| Table | Column | Type | CHECK | Rows |
|-------|--------|------|-------|------|
| `agents` | `agent_uid` | VARCHAR(**12**) | none | **8** (SA-00000001 → SA-00000008) |
| `agents` | `site_uid` | VARCHAR(**12**) | none | references endpoint_taxonomy |

### shopnet_connect (RDS Instance 1)

| Table | Column | Type | Notes |
|-------|--------|------|-------|
| `uid_registry` | `uid` | VARCHAR(**30**) | Already fits v2. Has `uid_version` column (1 or 2) |
| `uid_issuance_log` | `uid` | VARCHAR(**30**) | Already fits v2 |

### shopnet_crm (RDS Instance 2)

| Table | Column | Type | Notes |
|-------|--------|------|-------|
| `user_taxonomy` | `uid` | VARCHAR(**30**) | Already uses v2 (su_ prefix) |
| `user_site_registrations` | `site_uid` | VARCHAR(**30**) | Already fits v2 |
| `user_site_registrations` | `user_uid` | VARCHAR(**30**) | Already fits v2 |
| `user_delegations` | `user_uid` | VARCHAR(**30**) | Already fits v2 |
| `user_delegations` | `agent_uid` | VARCHAR(**30**) | Already fits v2 |

### shopnet_registry (RDS Instance 2)

No uid columns affected — uses `list_uid` (sl_ prefix, already v2).

### S3 (shopnet-domain-images bucket)

- **37 folders** with SN- prefix (SN-00000001/ through SN-00000041/)
- 51 folders with legacy domain-name prefix (pre-migration)
- Each SN- folder contains: `.site-info`, `images/`, `assets/`

### network-endpoints.json (Connect Gateway)

- `metadata.next_site_uid`: 92 (integer counter)
- `metadata.last_site_uid_assigned`: "SN-00000091"
- **91 component entries** with `"site_uid": "SN-XXXXXXXX"` values scattered across section objects

---

## What Needs Changing

### Phase 1: Database Schema — Widen Columns + Drop CHECK

**Must change (v1 width blocks v2):**

```sql
-- shopnet_sites
ALTER TABLE endpoint_taxonomy ALTER COLUMN site_uid TYPE VARCHAR(15);
ALTER TABLE endpoint_taxonomy DROP CONSTRAINT chk_site_uid_format;
ALTER TABLE endpoint_taxonomy ADD CONSTRAINT chk_site_uid_format
  CHECK (site_uid ~ '^sn_[0-9a-z]{12}$');

ALTER TABLE website_data ALTER COLUMN site_uid TYPE VARCHAR(15);
ALTER TABLE json_backup ALTER COLUMN site_uid TYPE VARCHAR(15);
-- sites table already VARCHAR(50), no change needed

-- shopnet_assist
ALTER TABLE agents ALTER COLUMN agent_uid TYPE VARCHAR(15);
ALTER TABLE agents ALTER COLUMN site_uid TYPE VARCHAR(15);
```

**Already wide enough (no schema change):**
- `uid_registry.uid` — VARCHAR(30)
- `uid_issuance_log.uid` — VARCHAR(30)
- All shopnet_crm tables — VARCHAR(30)
- All shopnet_registry tables — VARCHAR(30)

### Phase 2: Batch Convert Existing UIDs

Generate a mapping table, then UPDATE in a transaction:

```
SN-00000001 → sn_xxxxxxxxxxxx  (new v2 UID)
SN-00000002 → sn_xxxxxxxxxxxx  (new v2 UID)
...82 site UIDs
SA-00000001 → sa_xxxxxxxxxxxx  (new v2 UID)
...8 agent UIDs
```

**Tables to UPDATE (in a single transaction):**

| # | Database | Table | Column | Rows |
|---|----------|-------|--------|------|
| 1 | shopnet_sites | `endpoint_taxonomy` | `site_uid` | 82 |
| 2 | shopnet_sites | `website_data` | `site_uid` | ~82 |
| 3 | shopnet_sites | `json_backup` | `site_uid` | ~82 |
| 4 | shopnet_sites | `sites` | `site_uid` | 47 |
| 5 | shopnet_assist | `agents` | `agent_uid` | 8 |
| 6 | shopnet_assist | `agents` | `site_uid` | 8 |
| 7 | shopnet_connect | `uid_registry` | `uid` + set `uid_version=2` | ~89 |
| 8 | shopnet_connect | `uid_issuance_log` | `uid` | ~89 |
| 9 | shopnet_crm | `user_site_registrations` | `site_uid` | 2 |
| 10 | shopnet_crm | `user_delegations` | `agent_uid` | 1 |

**Total: ~490 cell updates across 10 tables, 2 databases, 2 RDS instances.**

### Phase 3: Rename S3 Folders

37 folder renames:
```
s3://shopnet-domain-images/SN-00000001/ → s3://shopnet-domain-images/sn_xxxxxxxxxxxx/
...
```

Each rename = copy all objects to new prefix + delete old prefix. S3 has no native rename.

Also update `.site-info` JSON inside each folder (contains `"site_uid": "SN-..."` field).

### Phase 4: Update network-endpoints.json

- Replace all `"site_uid": "SN-XXXXXXXX"` values with v2 equivalents (91 entries)
- Remove `next_site_uid` integer counter from metadata (no longer needed)
- Remove `last_site_uid_assigned`, `last_site_uid`, `last_site_uid_at`
- Optionally keep `last_uid_assigned` for audit (but with v2 format)

### Phase 5: Switch Connect Gateway to v2 Generation

**`shopnet_connect_api.py`:**

| Function | Line | Current | Change To |
|----------|------|---------|-----------|
| `get_next_site_uid()` | 4171 | Returns `f"SN-{next_uid:08d}"` | Call `generate_uid_v2("sn")` |
| `create_site_uid()` | 4238-4239 | `next_uid = get_next_site_uid_from_json()` + `f"SN-{next_uid:08d}"` | Call `generate_uid_v2("sn")` directly |
| `increment_site_uid_in_json()` | 4017-4045 | Increments integer counter | **Remove entirely** (no counter in v2) |
| `get_next_site_uid_from_json()` | 3963-4014 | Reads integer counter + DB safeguard | **Remove entirely** |
| `get_max_site_uid_from_database()` | ~3940 | `MAX(CAST(SUBSTRING(site_uid FROM 4) AS INTEGER))` | **Remove entirely** |
| `get_next_agent_uid()` | 5057 | Returns `f"SA-{next_uid:08d}"` | Call `generate_uid_v2("sa")` |
| `create_agent_uid()` | 5011+ | Same v1 pattern | Call `generate_uid_v2("sa")` directly |
| `increment_agent_uid_in_json()` | 4984-5008 | Increments integer counter | **Remove entirely** |
| `get_next_agent_uid_from_json()` | 4928-4960 | Reads integer counter | **Remove entirely** |
| `get_max_agent_uid_from_database()` | 4963-4981 | `SUBSTRING(agent_uid FROM 4) AS INTEGER` WHERE `LIKE 'SA-%'` | **Remove entirely** |

**Summary: ~200 lines of counter management code deleted, replaced by 1-line calls to `generate_uid_v2()`.**

### Phase 6: Update Console Code

**`app.py` (shopnet-console):** No format changes needed — all SQL uses `site_uid` as a string value. Queries like `WHERE site_uid = %s` work regardless of format. **Zero code changes.**

**`console.js`:**

| What | Lines | Change |
|------|-------|--------|
| Demo/fallback data | ~6123, ~6434 | Replace `SN-00000048` etc. with v2 examples |
| Regex parsers (if any) | — | **None found** — site_uid is treated as opaque string |
| Display formatting | ~1510, ~1515 | Already data-driven, no format assumption |

**Verdict: console.js is mostly format-agnostic. Only demo data needs updating (~4 lines).**

### Phase 7: Update Documentation & GUI

#### Documentation Files

| # | File | What | Scope |
|---|------|------|-------|
| 7a | `ThisIsTheLaw_v5.0_2026-02-07.MD` | Remove v1/v2 coexistence language, update all examples to v2 only. **Add new section**: how SND namespace works, UID creation, dedup prevention. | ~20 edits |
| 7b | `Shopnet-Deathstar-Master_v5.0_2026-02-07.MD` | Update UID assignment flow, format examples, timeline entries, server references | ~10 edits |
| 7c | `Shopnet-Deathstar-LITE_v2.2_2026-02-07.md` | Update UID level table, agent registry table (all 8 agents), format examples | ~15 edits |
| 7d | `SHOPNET-NETWORK-ARCHITECTURE.md` | Update identity hierarchy table, agent examples | ~8 edits |
| 7e | `Endpoint-Wizards.MD` | Update API response examples | ~6 edits |
| 7f | `content_assist/DESIGN.md` | Update S3 path examples | ~2 edits |
| 7g | `site_registry/README.md` | Update return format examples | ~3 edits |
| 7h | `card-test.html` | Update test UID generator | 1 line |

#### GUI Panels (index.html)

| # | Panel | Line | What | Scope |
|---|-------|------|------|-------|
| 7i | `panel-the-law` | ~3874 | Update hardcoded agent table (8 rows SN-/SA-), format patterns, remove v1/v2 coexistence text, update ~12 SN-/SA- references. Add SND namespace section. | ~25 edits |
| 7j | `panel-agents` | ~1340 | Update format examples (SN-/SA-/SW- → sn_/sa_/sw_), description text | ~6 edits |
| 7k | `panel-servers` | ~6094 | Replace 3 hardcoded SN-00000095 references with v2 equivalent | ~3 edits |
| 7l | `panel-deathstar` | ~3613 | Verify/update any UID format references (mostly data-driven) | ~2 edits |

#### GUI Display Verification (no code changes — format-agnostic)

| Display Point | File | Line | Check |
|---------------|------|------|-------|
| Network card badge | `console.js` | 1520 | `card-id-badge` renders 15-char v2 UID — check CSS overflow |
| Site registry table | `console.js` | 2732 | `site_uid` + `s3_folder` columns display v2 |
| Endpoint registry | `console.js` | 2767 | Sortable `site_uid` column renders v2 |
| Agent cards | `console.js` | 7687 | `agent_uid` and `site_uid` in agent card display |
| Agent detail modal | `console.js` | 7622 | Delete confirmation shows v2 UIDs |
| Site card detail | `console.js` | 48-67 | `showSiteCardDetails()` lookup works with v2 |

**Documentation totals: ~100 edits across 11 files + 4 GUI panels. ~7 display points to verify.**

### Phase 8: Update Validators & Monitor

**`uid_generator.py`:** Already handles both v1 and v2. After migration, can optionally remove v1 support.

**`snd_monitor.py`:** Already format-agnostic (queries uid_registry by uid value).

**`import_existing_uids.py`:** Legacy import script — update or delete (one-time use, already run).

---

## What You Lose

- **Human-readable sequential numbering** — can't eyeball "SN-00000047 = 47th site"
- **`/api/v1/site-uid/next` preview** — v2 UIDs are generated on-demand (no "next" to preview)
- **Counter-based debugging** — "how many sites?" requires a COUNT query, not reading the counter

## What You Gain

- **ONE format everywhere** — sites, agents, users, lists, payments all `xx_xxxxxxxxxxxx`
- **No counter bottleneck** — no JSON file locking, no DB safeguard queries
- **Timestamp-sortable** — creation time baked into first 7 chars
- **No collision risk** — 60.5M possibilities per second per prefix
- **Simpler code** — ~200 lines of counter management deleted from Connect Gateway

---

## Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|------------|
| S3 folder rename fails mid-way | HIGH | Build idempotent script with mapping file; run in dry-run first |
| Cross-database transaction (2 RDS instances) | MEDIUM | Run Instance 1 first, verify, then Instance 2. Keep mapping table for rollback |
| network-endpoints.json corruption | MEDIUM | Full backup before; atomic write with temp file |
| Console displaying old cached UIDs | LOW | Cache-bust via version query param or hard refresh |
| Pulse checks reference old site_uid | MEDIUM | Pulse runs from DB data — once DB updated, next pulse cycle uses new UIDs |
| Connect Gateway serves old UIDs during migration | LOW | Brief maintenance window; switch generation first, then batch convert |

---

## Execution Order

```
1. BACKUP everything (DB dumps, S3 listing, JSON copy)
2. ALTER TABLE — widen columns (non-breaking, can be done live)
3. DROP old CHECK constraint (non-breaking)
4. Switch Connect Gateway to v2 generation (new UIDs are v2 from this point)
5. Generate mapping table (old → new for all 90 UIDs)
6. Batch UPDATE all DB tables using mapping (both RDS instances)
7. ADD new CHECK constraint (v2 only)
8. Rename S3 folders using mapping
9. Rebuild network-endpoints.json with v2 UIDs
10. Update documentation and demo data
11. Remove counter management code from Connect Gateway
12. Verify: SND Monitor health check passes
```

Steps 2-3 can be done ahead of time with zero downtime.
Steps 4-9 should be done in a maintenance window (~30 min).
Steps 10-12 can be done afterward.

---

## Estimated Effort

| Phase | Work | Time |
|-------|------|------|
| Schema widen + CHECK | 5 ALTER statements | 2 min |
| Migration script (batch convert) | Generate mapping, update 10 tables (~490 cells), rename 37 S3 folders | 15 min |
| Connect Gateway v2 switch | Swap 2 create functions, delete counter code | 10 min |
| Documentation + GUI updates | ~100 edits across 11 files + 4 GUI panels | 20 min |
| Verification | Smoke test, SND Monitor, display check | 10 min |
| **Total** | | **~1 hour** |

Reality check: 93 v1 UIDs, ~490 cell updates, 37 S3 folders, 91 JSON entries. This is a small dataset. The migration script does the heavy lifting — everything else is find-and-replace.
