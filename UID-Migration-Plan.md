# SND Namespace Switchover — UID v1→v2 Migration Plan

**Document:** UID-Migration-Plan.md
**Created:** February 7, 2026
**Status:** APPROVED FOR PLANNING — awaiting execution
**Author:** Claude Code + Tim
**Depends on:** [UID-Migration-Scope.md](UID-Migration-Scope.md) (audit data)

---

## Objective

Switch the entire SND namespace to v2 format. ONE standard everywhere:

| Prefix | Purpose | Status Today | After Migration |
|--------|---------|-------------|-----------------|
| `sn_` | Sites/endpoints | 86 x `SN-XXXXXXXX` (v1) | **CONVERT** to `sn_xxxxxxxxxxxx` |
| `sa_` | Agents | 8 x `SA-XXXXXXXX` (v1) | **CONVERT** to `sa_xxxxxxxxxxxx` |
| `su_` | Users | Database not deployed | Born v2 (no conversion needed) |
| `sl_` | Lists | Database not deployed | Born v2 (no conversion needed) |
| `sp_` | Payments | Database not designed | Born v2 (no conversion needed) |

After this migration: no v1 UIDs remain anywhere. All future databases (CRM, registry, payments) are born v2.

## v2 Format

```
Format:  {prefix}_{timestamp}{random}
         sn_     1m3k7a4  e5f2q
         ──      ───────  ─────
         2 char  7 char   5 char    = 15 chars total
         prefix  base36   base36
                 seconds  crypto
                 since    random
                 epoch
```

Generator: `connect.shopnet/backend/snd/uid_generator.py` → `generate_uid_v2(prefix)`
Already written, tested, and deployed.

## Duplicate Protection

Three layers in `uid_registry.py` (lines 51-77):

1. **Math** — timestamp changes every second + 5-char random = 60,466,176 possibilities per second per prefix
2. **PRIMARY KEY** — `uid_registry.uid` is PK, INSERT fails on duplicate
3. **Retry loop** — 5 attempts with fresh UID each time on `IntegrityError`

At current scale (~100 UIDs), collision is effectively impossible.

---

## What Exists Today (Live Production, Feb 7 2026)

### uid_registry (shopnet_connect, RDS Instance 1)

| Type | Count | Format | Version |
|------|-------|--------|---------|
| sn | 86 | `SN-00000001` … `SN-00000094` + 1 x `sn_0ta1w62d0tii` | 85 v1 + 1 v2 |
| sa | 8 | `SA-00000001` … `SA-00000008` | all v1 |
| su | 3 | `su_0ta1vg4rvvdz`, `su_0ta1w62wwkxt`, `su_0ta1w63d8iah` | all v2 (test data) |
| sl | 2 | `sl_0ta1vggy3g1m`, `sl_0ta1w62707b6` | all v2 (test data) |
| **Total** | **99** | | **93 v1, 6 v2** |

### Databases to Migrate

#### RDS Instance 1: amazon-products-db-1754023596...us-east-1.rds.amazonaws.com

| Database | Table | Column | Type | CHECK | Rows | Action |
|----------|-------|--------|------|-------|------|--------|
| shopnet_sites | `endpoint_taxonomy` | `site_uid` | VARCHAR(**12**) | `^SN-[0-9]{8}$` | 82 | Widen + convert |
| shopnet_sites | `website_data` | `site_uid` | VARCHAR(**12**) | none | ~82 | Widen + convert |
| shopnet_sites | `json_backup` | `site_uid` | VARCHAR(**12**) | none | ~82 | Widen + convert |
| shopnet_sites | `sites` | `site_uid` | VARCHAR(**50**) | none | 47 | Convert only |
| shopnet_sites | `sites` | `s3_folder` | VARCHAR | none | 47 | Convert (stores SN- as S3 path) |
| shopnet_connect | `secrets` | `site_uid` | VARCHAR(**20**) | none | 1 (NULL) | No conversion needed now |
| shopnet_assist | `agents` | `agent_uid` | VARCHAR(**12**) | none | 8 | Widen + convert |
| shopnet_assist | `agents` | `site_uid` | VARCHAR(**12**) | none | 8 | Widen + convert |
| shopnet_connect | `uid_registry` | `uid` | VARCHAR(**30**) | PK | 99 | Convert v1 entries, set uid_version=2 |
| shopnet_connect | `uid_issuance_log` | `uid` | VARCHAR(**30**) | none | ~99 | Convert v1 entries |

#### RDS Instance 2: shopnet-crm-registry...us-east-1.rds.amazonaws.com

CRM and Registry are **LIVE** with real data. su_/sl_ UIDs are already v2. But they contain **cross-references to v1 SN-/SA- UIDs** that must be converted.

| Database | Table | Column | Type | Rows | Current Value | Action |
|----------|-------|--------|------|------|---------------|--------|
| shopnet_crm | `user_site_registrations` | `site_uid` | VARCHAR(**30**) | 2 | `SN-00000047`, `SN-00000068` | Convert to sn_ |
| shopnet_crm | `user_delegations` | `agent_uid` | VARCHAR(**30**) | 1 | `SA-00000001` | Convert to sa_ |

Already v2 (no change needed):
| Database | Table | Column | Rows | Format |
|----------|-------|--------|------|--------|
| shopnet_crm | `user_taxonomy` | `uid` | 2 | `su_` v2 |
| shopnet_crm | `user_site_registrations` | `user_uid` | 2 | `su_` v2 |
| shopnet_crm | `user_delegations` | `user_uid` | 1 | `su_` v2 |
| shopnet_registry | `list_taxonomy` | `uid` | 2 | `sl_` v2 |
| shopnet_registry | `list_taxonomy` | `owner_uid` | 2 | `su_` v2 |
| shopnet_registry | `list_items` | `added_by` | 2 | `su_` v2 |
| shopnet_registry | `sharing_tokens` | `created_by` | 1 | `su_` v2 |

**No foreign keys** — all joins are in application code.

#### Not Yet Created

| Database | Status | Notes |
|----------|--------|-------|
| shopnet_payments | Not designed | sp_ prefix reserved — will be born v2 |

### S3 (shopnet-domain-images)

- **37 folders** with SN- prefix (SN-00000001/ through SN-00000041/)
- 51 folders with legacy domain-name prefix (pre-UID migration, not affected)
- Each SN- folder contains: `.site-info` (JSON), `images/`, `assets/`

### network-endpoints.json (Connect Gateway)

- `metadata.next_site_uid`: 92 (integer counter — being eliminated)
- **91 component entries** with `"site_uid": "SN-XXXXXXXX"` values

---

## Detailed Steps

### PHASE A: BACKUP

#### Step 1 — Dump all databases (both RDS instances)

```bash
ssh -i ~/.ssh/TLemmon.pem ubuntu@34.234.121.248
mkdir -p /home/ubuntu/backups/uid-migration

# RDS Instance 1
pg_dump -h amazon-products-db-1754023596.cenq4au2o7vl.us-east-1.rds.amazonaws.com \
  -U postgres -d shopnet_sites --no-owner -F c \
  -f /home/ubuntu/backups/uid-migration/shopnet_sites_pre-v2.dump

pg_dump -h amazon-products-db-1754023596.cenq4au2o7vl.us-east-1.rds.amazonaws.com \
  -U postgres -d shopnet_assist --no-owner -F c \
  -f /home/ubuntu/backups/uid-migration/shopnet_assist_pre-v2.dump

pg_dump -h amazon-products-db-1754023596.cenq4au2o7vl.us-east-1.rds.amazonaws.com \
  -U postgres -d shopnet_connect --no-owner -F c \
  -f /home/ubuntu/backups/uid-migration/shopnet_connect_pre-v2.dump

# RDS Instance 2
pg_dump -h shopnet-crm-registry.cenq4au2o7vl.us-east-1.rds.amazonaws.com \
  -U postgres -d shopnet_crm --no-owner -F c \
  -f /home/ubuntu/backups/uid-migration/shopnet_crm_pre-v2.dump

pg_dump -h shopnet-crm-registry.cenq4au2o7vl.us-east-1.rds.amazonaws.com \
  -U postgres -d shopnet_registry --no-owner -F c \
  -f /home/ubuntu/backups/uid-migration/shopnet_registry_pre-v2.dump
```

**Verify:** All 5 .dump files are non-zero size.

#### Step 2 — Backup network-endpoints.json

```bash
cp /home/ubuntu/shopnet-connect/backend/data/network-endpoints.json \
   /home/ubuntu/backups/uid-migration/network-endpoints_pre-v2.json
```

#### Step 3 — Snapshot S3 folder listing

```bash
aws s3 ls s3://shopnet-domain-images/ --recursive > \
  /home/ubuntu/backups/uid-migration/s3-full-listing_pre-v2.txt
```

#### Step 4 — Git commit all local code

```bash
cd /home/ubuntu/shopnet-console && git add -A && git commit -m "Pre-UID-v2-migration snapshot"
cd /home/ubuntu/shopnet-connect && git add -A && git commit -m "Pre-UID-v2-migration snapshot"
```

**CHECKPOINT A:** 5 DB dumps (3 Instance 1 + 2 Instance 2) + JSON backup + S3 listing + git commits all exist. Do NOT proceed without all of them.

---

### PHASE B: SCHEMA PREPARATION (safe, zero-downtime, can be done live)

#### Step 5 — Widen VARCHAR columns (shopnet_sites)

```sql
ALTER TABLE endpoint_taxonomy ALTER COLUMN site_uid TYPE VARCHAR(15);
ALTER TABLE website_data      ALTER COLUMN site_uid TYPE VARCHAR(15);
ALTER TABLE json_backup       ALTER COLUMN site_uid TYPE VARCHAR(15);
-- sites table already VARCHAR(50), no change needed
```

#### Step 6 — Widen VARCHAR columns (shopnet_assist)

```sql
ALTER TABLE agents ALTER COLUMN agent_uid TYPE VARCHAR(15);
ALTER TABLE agents ALTER COLUMN site_uid  TYPE VARCHAR(15);
```

#### Step 7 — Drop the v1-only CHECK constraint

```sql
ALTER TABLE endpoint_taxonomy DROP CONSTRAINT chk_site_uid_format;
```

**Verify:** Columns now accept 15-char values. Existing v1 data still intact.

Do NOT add v2 CHECK yet — that happens after batch conversion (Step 14).

**CHECKPOINT B:** Schema ready. System still works normally with v1 UIDs in wider columns.

---

### PHASE C: BUILD MIGRATION SCRIPT (local, before maintenance window)

#### Step 8 — Write `migrate_uids_v1_to_v2.py`

Location: `/home/ubuntu/shopnet-connect/backend/scripts/migrate_uids_v1_to_v2.py`

The script must:

1. Connect to RDS Instance 1 (shopnet_sites, shopnet_assist, shopnet_connect)
2. Connect to RDS Instance 2 (shopnet_crm, shopnet_registry)
3. Query all distinct SN- site_uids from `endpoint_taxonomy`
4. Query all distinct SA- agent_uids from `agents`
5. Call `generate_uid_v2("sn")` / `generate_uid_v2("sa")` for each
6. Write mapping to `uid_migration_mapping.json`:

```json
{
  "generated_at": "2026-02-XX",
  "site_mappings": {
    "SN-00000001": "sn_1m3k7a4e5f2q",
    "SN-00000002": "sn_0b2r8t4w1k9p"
  },
  "agent_mappings": {
    "SA-00000001": "sa_2n5j8c1d6g3h"
  }
}
```

**Flags:**
- `--dry-run` — generate mapping, print it, don't touch DB
- `--execute` — run all UPDATEs on Instance 1 (shopnet_sites, shopnet_assist, shopnet_connect)
- `--execute --instance-2` — run UPDATEs on Instance 2 (shopnet_crm cross-references)
- `--s3` — rename S3 folders using mapping
- `--s3-cleanup` — delete old SN- folders (only after verification)
- `--json` — update network-endpoints.json using mapping

Each flag is independent — can run one at a time or all together.

#### Step 9 — Dry run

```bash
python3 migrate_uids_v1_to_v2.py --dry-run
```

**Verify:**
- Mapping has 85 site entries (86 minus the 1 already v2) + 8 agent entries
- All new UIDs are 15 chars, match `^sn_[0-9a-z]{12}$` / `^sa_[0-9a-z]{12}$`
- No duplicates in the mapping
- Every v1 UID has exactly one mapping entry

**CHECKPOINT C:** Script written, dry-run verified, mapping file saved.

---

### PHASE D: MAINTENANCE WINDOW (~30 minutes)

#### Step 10 — Stop services

```bash
sudo systemctl stop shopnet-connect
sudo systemctl stop shopnet-console
```

#### Step 11 — Switch Connect Gateway to v2 generation

**File: `shopnet_connect_api.py`**

`create_site_uid()` (~line 4238):
```python
# BEFORE:
next_uid = get_next_site_uid_from_json()
site_uid = f"SN-{next_uid:08d}"

# AFTER:
from snd.uid_generator import generate_uid_v2
site_uid = generate_uid_v2("sn")
```

`create_agent_uid()` (~line 5037):
```python
# BEFORE:
next_uid = get_next_agent_uid_from_json()
agent_uid = f"SA-{next_uid:08d}"

# AFTER:
from snd.uid_generator import generate_uid_v2
agent_uid = generate_uid_v2("sa")
```

Comment out (delete later in Phase F):
- `get_next_site_uid_from_json()` (~lines 3963-4014)
- `increment_site_uid_in_json()` (~lines 4017-4045)
- `get_max_site_uid_from_database()` (~lines 3935-3960)
- `get_next_agent_uid_from_json()` (~lines 4928-4960)
- `increment_agent_uid_in_json()` (~lines 4984-5008)
- `get_max_agent_uid_from_database()` (~lines 4963-4981)

Update `get_next_site_uid()` endpoint:
```python
@app.get("/api/v1/site-uid/next")
async def get_next_site_uid():
    preview = generate_uid_v2("sn")
    return {
        "preview_site_uid": preview,
        "note": "v2 UIDs are generated on-demand. This preview is NOT reserved."
    }
```

Same pattern for `get_next_agent_uid()`.

**~200 lines of counter code eliminated.**

#### Step 12 — Batch convert databases

```bash
python3 migrate_uids_v1_to_v2.py --execute
```

Executes per database in transactions:

**shopnet_sites** (single transaction):
```sql
BEGIN;
UPDATE endpoint_taxonomy SET site_uid = 'sn_xxxxxxxxxxxx' WHERE site_uid = 'SN-00000001';
UPDATE website_data      SET site_uid = 'sn_xxxxxxxxxxxx' WHERE site_uid = 'SN-00000001';
UPDATE json_backup       SET site_uid = 'sn_xxxxxxxxxxxx' WHERE site_uid = 'SN-00000001';
UPDATE sites             SET site_uid = 'sn_xxxxxxxxxxxx' WHERE site_uid = 'SN-00000001';
UPDATE sites             SET s3_folder = 'sn_xxxxxxxxxxxx' WHERE s3_folder = 'SN-00000001';
-- ... repeat for all 85 v1 site UIDs (site_uid + s3_folder)
COMMIT;
```

**shopnet_assist** (single transaction):
```sql
BEGIN;
UPDATE agents SET agent_uid = 'sa_xxxxxxxxxxxx' WHERE agent_uid = 'SA-00000001';
UPDATE agents SET site_uid  = 'sn_xxxxxxxxxxxx' WHERE site_uid  = 'SN-00000085';
-- ... repeat for all 8 agents (agent_uid + site_uid)
COMMIT;
```

**shopnet_connect** (single transaction):
```sql
BEGIN;
UPDATE uid_registry SET uid = 'sn_xxxxxxxxxxxx', uid_version = 2 WHERE uid = 'SN-00000001';
-- ... repeat for all 85 SN- entries
UPDATE uid_registry SET uid = 'sa_xxxxxxxxxxxx', uid_version = 2 WHERE uid = 'SA-00000001';
-- ... repeat for all 8 SA- entries
UPDATE uid_issuance_log SET uid = 'sn_xxxxxxxxxxxx' WHERE uid = 'SN-00000001';
-- ... repeat for all SN- and SA- entries
COMMIT;
```

**Verify:**
```sql
-- All should return 0:
SELECT COUNT(*) FROM endpoint_taxonomy WHERE site_uid LIKE 'SN-%';
SELECT COUNT(*) FROM agents WHERE agent_uid LIKE 'SA-%';
SELECT COUNT(*) FROM uid_registry WHERE uid LIKE 'SN-%' OR uid LIKE 'SA-%';

-- Should match expected counts:
SELECT COUNT(*) FROM endpoint_taxonomy WHERE site_uid ~ '^sn_[0-9a-z]{12}$';  -- 82
SELECT COUNT(*) FROM agents WHERE agent_uid ~ '^sa_[0-9a-z]{12}$';             -- 8
SELECT COUNT(*) FROM uid_registry WHERE uid_version = 2;                        -- 99
```

#### Step 13 — Batch convert Instance 2 cross-references

```bash
python3 migrate_uids_v1_to_v2.py --execute --instance-2
```

**shopnet_crm** (Instance 2, single transaction):
```sql
BEGIN;
-- user_site_registrations: 2 rows with v1 site_uid
UPDATE user_site_registrations SET site_uid = 'sn_xxxxxxxxxxxx' WHERE site_uid = 'SN-00000047';
UPDATE user_site_registrations SET site_uid = 'sn_xxxxxxxxxxxx' WHERE site_uid = 'SN-00000068';

-- user_delegations: 1 row with v1 agent_uid
UPDATE user_delegations SET agent_uid = 'sa_xxxxxxxxxxxx' WHERE agent_uid = 'SA-00000001';
COMMIT;
```

Uses same mapping file from Step 9 — SN-00000047 and SN-00000068 map to their v2 equivalents.

**shopnet_registry**: No v1 UIDs to convert (all su_/sl_ already v2).

**Verify:**
```sql
SELECT COUNT(*) FROM user_site_registrations WHERE site_uid LIKE 'SN-%';  -- 0
SELECT COUNT(*) FROM user_delegations WHERE agent_uid LIKE 'SA-%';        -- 0
```

#### Step 14 — Add v2-only CHECK constraint

```sql
ALTER TABLE endpoint_taxonomy ADD CONSTRAINT chk_site_uid_format
  CHECK (site_uid ~ '^sn_[0-9a-z]{12}$');
```

**Verify:** `INSERT INTO endpoint_taxonomy (site_uid, ...) VALUES ('SN-00000999', ...)` → fails.

#### Step 15 — Rename S3 folders

```bash
python3 migrate_uids_v1_to_v2.py --s3
```

For each of 37 SN- folders:
1. List all objects under `SN-XXXXXXXX/`
2. Copy each to `sn_xxxxxxxxxxxx/` (new key prefix, same suffix)
3. Update `.site-info` JSON: change `"site_uid"` value to v2
4. Upload updated `.site-info` to new path
5. Old folder left intact (deleted in Step 22 after verification)

**Verify:** `aws s3 ls s3://shopnet-domain-images/ | grep sn_` → 37 new folders.

#### Step 16 — Update network-endpoints.json

```bash
python3 migrate_uids_v1_to_v2.py --json
```

This:
1. Loads JSON
2. Replaces all `"site_uid": "SN-..."` with mapped v2 value (91 entries)
3. Removes from metadata: `next_site_uid`, `last_site_uid`, `last_site_uid_assigned`, `last_site_uid_at`
4. Adds to metadata: `"uid_format": "v2"`, `"migrated_at": "<timestamp>"`
5. Atomic write via temp file + rename

**Verify:** `grep -c 'SN-' network-endpoints.json` → 0.

#### Step 17 — Restart services

```bash
sudo systemctl start shopnet-connect
sudo systemctl start shopnet-console
```

**CHECKPOINT D:** All databases converted, S3 copied, JSON updated, services running. Maintenance window ends.

---

### PHASE E: VERIFICATION (~30 minutes)

#### Step 18 — Console smoke test

1. Hard refresh browser (Ctrl+Shift+R)
2. Site Registry: all cards show `sn_` UIDs
3. Click a card: detail panel shows `sn_` UID
4. Agents section: cards show `sa_` UIDs

#### Step 19 — Pulse health check

1. Wait for next Pulse cycle (or trigger manually)
2. Pulse reads site_uid from DB — should use new v2 values
3. Console pulse indicators should populate correctly

#### Step 20 — SND Monitor

```bash
curl http://localhost:8001/api/v1/snd/health
```

All checks should pass: uniqueness, consistency, immutability, audit.

#### Step 21 — Endpoint creation wizard

1. Open wizard, create a test endpoint
2. Must receive `sn_xxxxxxxxxxxx` (not SN-)
3. Verify it appears in uid_registry with `uid_version=2`
4. Delete the test endpoint

#### Step 22 — Delete old S3 folders (only after Steps 18-21 all pass)

```bash
python3 migrate_uids_v1_to_v2.py --s3-cleanup
```

Removes 37 old `SN-XXXXXXXX/` prefixes from S3.

**CHECKPOINT E:** Migration verified. Old S3 folders cleaned up. System is fully v2.

---

### PHASE F: CLEANUP (no rush, anytime after Phase E)

#### Step 23 — Delete counter management code from Connect Gateway

Delete these functions from `shopnet_connect_api.py`:
- `get_next_site_uid_from_json()` (lines 3963-4014)
- `increment_site_uid_in_json()` (lines 4017-4045)
- `get_max_site_uid_from_database()` (lines ~3935-3960)
- `get_next_agent_uid_from_json()` (lines 4928-4960)
- `increment_agent_uid_in_json()` (lines 4984-5008)
- `get_max_agent_uid_from_database()` (lines 4963-4981)

Also remove `increment_site_uid_in_json()` call from `create_site_uid()` and `add_component_to_json_section()` counter logic.

#### Step 24 — Update console.js demo data

Replace hardcoded v1 examples (~4 lines):
- Line ~6123: `SN-00000048` → v2 example
- Line ~6434: `SN-00000048`, `SN-00000052` → v2 examples

#### Step 25 — Remove v1 validation from uid_generator.py (optional, after 30-day safety period)

```python
# Delete V1_PATTERN and v1 detection block from validate_uid()
# Keep only V2_PATTERN
```

#### Step 26 — Delete import_existing_uids.py

Legacy one-time script, already run. No longer needed.

#### Step 27 — Update documentation and GUI pages

##### 27a — `ThisIsTheLaw_v5.0_2026-02-07.MD`

Remove v1/v2 coexistence language — v2 is THE ONLY format. Update all SN-/SA- examples to sn_/sa_. **Add new section** covering:
- How the SND namespace works (5 prefixes, routing table, uid_registry as zone file)
- How UIDs are created (timestamp + crypto random, base36, `generate_uid_v2()`)
- How deduplication is prevented (3 layers: math, PK constraint, retry loop)

~20 edits.

##### 27b — `index.html` panel-the-law (line 3874)

| Line | Current | Change |
|------|---------|--------|
| 3751-3758 | Hardcoded agent table: `SN-00000085`/`SA-00000001` through `SN-00000094`/`SA-00000008` | Replace all 8 site_uid + 8 agent_uid with v2 equivalents from mapping |
| 3771-3772 | `SN-XXXXXXXX — sites/endpoints`, `SA-XXXXXXXX — agents` | `sn_xxxxxxxxxxxx — sites/endpoints`, `sa_xxxxxxxxxxxx — agents` |
| 3830 | `THIS IS THE SND LAW v1.0 — 5 UID types, v2 format, First Law` | Keep as-is (already says v2) |
| 3943 | `v2 format: 15 characters total` | Keep as-is (already v2) |
| 3962-3963 | v1 pattern example `SX-XXXXXXXX` alongside v2 | Remove v1 pattern — v2 only |
| 3993 | `v1/v2 Coexistence: v1 UIDs (SN-/SA-) remain valid forever` | **Remove entirely** — no coexistence, v2 only |
| 7023 | `Gateway issues site_uid (SN-XXXXXXXX)` | `Gateway issues site_uid (sn_xxxxxxxxxxxx)` |
| 7055 | `agent_uid (SA-XXXXXXXX)` | `agent_uid (sa_xxxxxxxxxxxx)` |
| 7067 | `POST /api/v1/agent-uid/create (gets SA-XXXXXXXX)` | `(gets sa_xxxxxxxxxxxx)` |
| 7086-7087 | `agent_uid (SA-XXXXXXXX)` | `agent_uid (sa_xxxxxxxxxxxx)` |
| 7128 | `Gateway issues agent_uid (SA-XXXXXXXX)` | `(sa_xxxxxxxxxxxx)` |
| 12343 | `agent_uid (SA-XXXXXXXX)` | `(sa_xxxxxxxxxxxx)` |

Add new SND Namespace section to the panel explaining UID creation and dedup (same content as 27a).

~25 edits total.

##### 27c — `index.html` panel-agents (line 1340)

| Line | Current | Change |
|------|---------|--------|
| 1390-1391 | `agent_uid (SA-XXXXXXXX)`, `site_uid (SN-XXXXXXXX)` | `(sa_xxxxxxxxxxxx)`, `(sn_xxxxxxxxxxxx)` |
| 1421 | `SN-XXXXXXXX` format example | `sn_xxxxxxxxxxxx` |
| 1427 | `SA-XXXXXXXX` format example | `sa_xxxxxxxxxxxx` |
| 1433 | `SW-XXXXXXXX` format example | `sw_xxxxxxxxxxxx` (future) |
| 1495 | `Format: SA-XXXXXXXX (8-digit zero-padded sequential number)` | `Format: sa_xxxxxxxxxxxx (15-char v2 UID)` |
| 1502 | `Issues new SA-XXXXXXXX` | `Issues new sa_xxxxxxxxxxxx` |

~6 edits.

##### 27d — `index.html` panel-servers / Infrastructure (line 6094)

| Line | Current | Change |
|------|---------|--------|
| 6393 | `Web3 Multisite Server (SN-00000095)` | Replace with v2 equivalent from mapping |
| 6440 | `SN-00000095 — Bitnami WordPress Multisite on AWS Lightsail` | Replace with v2 equivalent |
| 6448 | `Taxonomy record created (SN-00000095, LS)` | Replace with v2 equivalent |

~3 edits.

##### 27e — `Shopnet-Deathstar-Master_v5.0_2026-02-07.MD`

| Line | Current | Change |
|------|---------|--------|
| 129 | `Site UID format standardized: SN-XXXXXXXX (8-digit sequential)` | Add timeline entry: v2 migration completed |
| 143 | `SA-XXXXXXXX UIDs, 8 agents` | `sa_ UIDs, 8 agents` |
| 586 | `SN-00000095 — Bitnami WordPress Multisite` | Replace with v2 equivalent |
| 801 | `Connect Gateway is the ONLY authority for issuing site_uid values` | Keep (still true) |
| 813-814 | `site_uid assignments` references | Keep (still true, format-agnostic) |
| 827-838 | Site UID Assignment Flow: `SN-XXXXXXXX`, `S3 folder created: SN-XXXXXXXX/` | Update format to v2, update S3 path |
| 1226 | API endpoint table | Format-agnostic, keep |
| 1526 | `Get SN-XXXXXXXX from Connect Gateway` | `Get sn_xxxxxxxxxxxx from Connect Gateway` |

~10 edits.

##### 27f — `Shopnet-Deathstar-LITE_v2.2_2026-02-07.md`

| Line | Current | Change |
|------|---------|--------|
| 59 | `Every endpoint gets a site_uid (SN-XXXXXXXX)` | `(sn_xxxxxxxxxxxx)` |
| 60 | `Every agent also gets an agent_uid (SA-XXXXXXXX)` | `(sa_xxxxxxxxxxxx)` |
| 72 | `SN- │ SN-XXXXXXXX` | `sn_ │ sn_xxxxxxxxxxxx` |
| 73 | `SA- │ SA-XXXXXXXX` | `sa_ │ sa_xxxxxxxxxxxx` |
| 80 | `SN-XXXXXXXX (v1) / sn_xxxxxxxxxxxx (v2)` | `sn_xxxxxxxxxxxx` (v2 only) |
| 160 | `SN-00000095 — Bitnami WordPress Multisite` | Replace with v2 equivalent |
| 210-219 | Agent registry table with SN-/SA- UIDs (all 8 agents) | Replace with v2 equivalents from mapping |
| 224-225 | `site_uid (SN-XXXXXXXX)`, `agent_uid (SA-XXXXXXXX)` | `(sn_xxxxxxxxxxxx)`, `(sa_xxxxxxxxxxxx)` |
| 280-285 | API endpoint table | Format-agnostic, keep |
| 317-321 | Wizard descriptions | Format-agnostic, keep |

~15 edits.

##### 27g — `SHOPNET-NETWORK-ARCHITECTURE.md`

Update identity hierarchy table, agent examples. ~8 edits.

##### 27h — `Endpoint-Wizards.MD`

Update API response examples. ~6 edits.

##### 27i — `content_assist/DESIGN.md`

Update S3 path examples. ~2 edits.

##### 27j — `site_registry/README.md`

Update return format examples. ~3 edits.

##### 27k — `card-test.html`

Update test UID generator. 1 edit.

**Documentation totals: ~100 edits across 11 files.**

#### Step 28 — Verify GUI display of v2 UIDs

No code changes needed — the GUI is format-agnostic. But verify these display points work correctly with the longer v2 format:

| Display Point | File | Line | What to Check |
|---------------|------|------|---------------|
| Network card badge | `console.js` | 1520 | `card-id-badge` renders `sn_xxxxxxxxxxxx` (15 chars vs 11) — check for CSS overflow |
| Site registry table | `console.js` | 2732 | `site_uid` and `s3_folder` columns display v2 values |
| Endpoint registry table | `console.js` | 2767 | `site_uid` sortable column renders correctly |
| Agent card display | `console.js` | 7687 | `agent_uid` and `site_uid` display in agent cards |
| Agent detail modal | `console.js` | 7622-7623 | `agent_uid` and `site_uid` in delete confirmation |
| Site card detail modal | `console.js` | 48-67 | `showSiteCardDetails()` lookup and display |
| Wizard agent platform | `console.js` | 7187 | Agent platform selection shows v2 site_uid |

**Test:** Create 1 test endpoint + 1 test agent via wizard, verify all display points render v2 UIDs without truncation or overflow.

#### Step 29 — Update TODO.md

Mark S22 as **RESOLVED** — site_uid now VARCHAR(15) with v2 CHECK.
Mark S21 as **RESOLVED** — chk_site_uid_format now enforces v2.

---

## Rollback Procedure

If anything fails during Phase D:

**Database:** Restore from dumps
```bash
# Drop new CHECK if added
psql -h <host> -U postgres -d shopnet_sites \
  -c "ALTER TABLE endpoint_taxonomy DROP CONSTRAINT IF EXISTS chk_site_uid_format;"

# Restore
pg_restore -h <host> -U postgres -d shopnet_sites --clean --if-exists \
  /home/ubuntu/backups/uid-migration/shopnet_sites_pre-v2.dump
# Repeat for shopnet_assist, shopnet_connect
```

**S3:** Old SN- folders not deleted until Step 22. Just delete new sn_ folders.

**JSON:** `cp backups/uid-migration/network-endpoints_pre-v2.json backend/data/network-endpoints.json`

**Code:** `git checkout -- .` in both repos.

**Restart:** `sudo systemctl restart shopnet-connect && sudo systemctl restart shopnet-console`

**Total rollback time: ~10 minutes.**

---

## Summary

| Metric | Value |
|--------|-------|
| **Scope** | SND namespace switchover — v1 eliminated, v2 only |
| Prefixes converted | `sn_` (85 conversions), `sa_` (8 conversions) |
| Prefixes already v2 | `su_` (3 UIDs), `sl_` (2 UIDs) — no conversion needed |
| Prefixes future | `sp_` (payments — will be born v2) |
| RDS instances touched | 2 (Instance 1 + Instance 2) |
| Databases touched | 5 (shopnet_sites, shopnet_assist, shopnet_connect, shopnet_crm, shopnet_registry) |
| Tables touched | 10 (8 on Instance 1 + 2 on Instance 2) |
| Total cell updates | ~493 |
| S3 folder renames | 37 |
| JSON entries updated | 91 |
| Code deleted | ~200 lines (counter management) |
| Code changed | ~20 lines (2 create functions + 2 preview endpoints) |
| console.js demo data | ~4 lines (hardcoded SN- examples) |
| Documentation files | 11 (27a-27k) |
| Documentation edits | ~100 total |
| GUI panels to update | 4 (panel-the-law, panel-agents, panel-servers, panel-deathstar) |
| GUI display verification | 7 display points (Step 28) |
| Downtime | ~10 minutes (Phase D) |
| Rollback time | ~5 minutes |
| **Total effort** | **~1 hour** |
