# ThisIsTheLaw v6.0 — Complete SND Taxonomy
**Date:** February 11, 2026
**Version:** v6.0
**Authority:** TJL
**Authors:** TJL, Claude (Opus 4.6)
**Status:** DEFINITIVE MASTER DOCUMENT — supersedes all prior versions

**This document is the single source of truth for the entire SND taxonomy.**
**Every section has: source file path, date, and implementation status [LIVE / DESIGNED / FUTURE].**

**Document Sources:**
- Document 47: THIS IS THE SND LAW v1.0 — `/taxonomy.shopnet/ThisIsTheLaw.md` (Feb 6, 2026)
- Document 46: Future Deathstar v2.0 — `/shopnet-deathstar/46-FUTURE-DEATHSTAR.md` (Feb 6, 2026)
- Document 26: THIS IS THE LAW v4.0, Part VI — `/shopnet-deathstar/26-THIS-IS-THE-LAW.md` (Feb 5-6, 2026)
- Document 43: Assist Shopnet Agent Architecture — `/shopnet-deathstar/43-ASSIST-SHOPNET-AGENT-ARCHITECTURE.md`
- `DATABASE-DESIGN.md` — `/assist.shopnet/docs/DATABASE-DESIGN.md` (Feb 5-6, 2026)
- `002_shopnet_crm.sql` — `/connect.shopnet/backend/sql/002_shopnet_crm.sql` (Feb 6, 2026)
- `003_shopnet_registry.sql` — `/connect.shopnet/backend/sql/003_shopnet_registry.sql` (Feb 6, 2026)
- `console.js` PLATFORM_OPTIONS — `/shopnet.network-console/static/js/console.js:3783-3827` (Feb 4-7, 2026)
- `update-taxonomy-v3.5.sql` — `/shopnet.network-console/scripts/update-taxonomy-v3.5.sql` (Feb 4-7, 2026)
- `endpoint-taxonomy-update.MD` — `/taxonomy.shopnet/endpoint-taxonomy-update.MD` (Feb 7, 2026) — documents the move from hardcoded to dynamic validation
- `AgentTaxonomy_v1.0_2026-02-11.MD` — `/taxonomy.shopnet/AgentTaxonomy_v1.0_2026-02-11.MD` (Feb 11, 2026) — Agent Platform/Instance taxonomy
- `uid_generator.py` — `/connect.shopnet/backend/snd/uid_generator.py` (Feb 6, 2026)
- `uid_registry.py` — `/connect.shopnet/backend/snd/uid_registry.py` (Feb 6, 2026)
- `snd_monitor.py` — `/connect.shopnet/backend/snd/snd_monitor.py` (Feb 6, 2026)
- `crm.py` — `/connect.shopnet/backend/snd/crm.py` (Feb 6, 2026)
- `registry.py` — `/connect.shopnet/backend/snd/registry.py` (Feb 6, 2026)
- `taxonomy_definition` table — `shopnet_sites` RDS database (Feb 4-7, 2026)
- `endpoint_taxonomy` table — `shopnet_sites` RDS database
- `validate_platform_type()` trigger — `shopnet_sites` RDS database (dynamic v3.5.1, Feb 7, 2026)

**Supersedes:** ThisIsTheLaw v5.0 (Feb 7, 2026), ThisIsTheLaw3.MD (v3.5), FixingTheLaw.MD, endpoint-taxonomy-update.MD

**v6.0 Changes (Feb 11, 2026):**
- **PART III rewritten:** Agent taxonomy now uses Platform (PL) / Instance (IN) architecture per AgentTaxonomy v1.0
- **Site type "A" relabeled:** "Agent" → "Agent Engine" throughout
- **Two-level identity removed for agents:** Agents no longer require `sn_` UIDs. Agent Engine gets `sn_` (it's infrastructure). Agent Platforms and Instances get `sa_` only.
- **New source:** `AgentTaxonomy_v1.0_2026-02-11.MD` — `/taxonomy.shopnet/AgentTaxonomy_v1.0_2026-02-11.MD`

**Conflict Resolution:** Most recent version wins. `taxonomy_definition` table on production RDS is highest authority for site_uid taxonomy. For any conflicting values, see OLD VERSION ARCHIVE at end of document.

---
---

# PART I — SND NAMESPACE

**Source:** Document 47: THIS IS THE SND LAW v1.0 — `/taxonomy.shopnet/ThisIsTheLaw.md`
**Date:** February 6, 2026
**Authority:** TJL
**Implementation Status:** [LIVE] — uid_generator.py, uid_registry.py, snd_monitor.py all deployed

---

## 1.1 The Namespace [LIVE]

**Source:** Document 47, Part VII.1 (lines 82-106)
**Date:** February 6, 2026

```
+-----------------------------------------------------------------------+
|                                                                       |
|                          snd.shopnet                                  |
|                                                                       |
|   "DNS Backwards" -- the Shopnet Network Deathstar namespace          |
|                                                                       |
|   DNS resolves names to addresses.                                    |
|   SND resolves UIDs to entities.                                      |
|                                                                       |
|   DNS has a zone file.                                                |
|   SND has uid_registry.                                               |
|                                                                       |
|   DNS has ICANN.                                                      |
|   SND has Connect Gateway.                                            |
|                                                                       |
+-----------------------------------------------------------------------+
```

The SND namespace is **flat, not hierarchical**. Every UID exists at the same level. There are no parent-child relationships embedded in the identifier itself. Relationships between entities are expressed through junction tables and foreign keys, never through UID structure.

---

## 1.2 v2 UID Format [LIVE]

**Source:** Document 47, Part VII.2 (lines 109-152)
**Date:** February 6, 2026
**Implementation:** `/connect.shopnet/backend/snd/uid_generator.py` — `generate_uid_v2()`

| Attribute | Value |
|-----------|-------|
| **Format** | `xx_xxxxxxxxxxxx` |
| **Total Length** | 15 characters |
| **Prefix** | 2-character type code |
| **Separator** | Underscore `_` |
| **Body** | 12 base36 characters |
| **Body Structure** | 7 timestamp chars + 5 random chars |
| **Character Set** | `0-9`, `a-z` (lowercase, 36 symbols) |
| **Assigned By** | Connect Gateway ONLY |
| **Mutable** | NO — NEVER CHANGES |
| **Reusable** | NO — NEVER REUSED |

```
+-----------------------------------------------------------------------+
|                          v2 UID FORMAT                                 |
+-----------------------------------------------------------------------+
|                                                                       |
|       s n _ a 1 b 2 c 3 d 4 e 5 f 6                                  |
|       -+-   ------+------  ---+-+--                                   |
|        |          |            |                                       |
|        |          |            +-- 5 random base36 chars               |
|        |          |                (collision avoidance)               |
|        |          |                                                    |
|        |          +-- 7 timestamp base36 chars                         |
|        |              (second precision, sortable)                    |
|        |                                                               |
|        +-- 2-char prefix                                              |
|            (entity type: sn, sa, su, sl, sp)                          |
|                                                                       |
+-----------------------------------------------------------------------+
```

### v2 Capacity

**Source:** Document 47, Part VII.3 (lines 154-178)
**Date:** February 6, 2026

```
+-----------------------------------------------------------------------+
|                        v2 CAPACITY ANALYSIS                           |
+-----------------------------------------------------------------------+
|                                                                       |
|   Timestamp component (7 base36 chars):                               |
|     36^7 = 78,364,164,096 unique second slots                         |
|     Duration: ~2,484 years from epoch                                 |
|                                                                       |
|   Random component (5 base36 chars):                                  |
|     36^5 = 60,466,176 unique values per second                        |
|                                                                       |
|   Per-second capacity:        60,466,176 UIDs                         |
|   Total capacity per prefix:  ~4.7 QUINTILLION UIDs                   |
|                                                                       |
|   For comparison:                                                     |
|     v1 (SX-XXXXXXXX):   99,999,999 total per prefix                  |
|     v2 (xx_xxxxxxxxxxxx): 4,738,381,338,321,616,896 total per prefix  |
|                                                                       |
|   The IPv4 problem will not occur in our lifetimes.                   |
|                                                                       |
+-----------------------------------------------------------------------+
```

---

## 1.3 The Five Prefixes [LIVE]

**Source:** Document 47, Part VIII.1-VIII.6 (lines 237-350)
**Date:** February 6, 2026
**Implementation:** `/connect.shopnet/backend/snd/uid_generator.py` — `PREFIX_ROUTES` dict

| Prefix | Full Name | Entity Type | Target Database | Domain |
|--------|-----------|-------------|-----------------|--------|
| `sn_` | Shopnet Network | Sites / Endpoints | `shopnet_sites` | Network |
| `sa_` | Shopnet Assist | Agents | `shopnet_assist` | Network |
| `su_` | Shopnet User | Users | `shopnet_crm` | Identity |
| `sl_` | Shopnet List | Lists / Registries | `shopnet_registry` | Content |
| `sp_` | Shopnet Payment | Payments / Transactions | `shopnet_payments` | Transactions |

```
+-----------------------------------------------------------------------+
|                       THE FIVE PREFIXES                                |
+-----------------------------------------------------------------------+
|                                                                       |
|   sn_    sa_    su_    sl_    sp_                                      |
|    |      |      |      |      |                                      |
|    v      v      v      v      v                                      |
|  Sites  Agents Users  Lists  Payments                                 |
|    |      |      |      |      |                                      |
|    v      v      v      v      v                                      |
|  shopnet shopnet shopnet shopnet shopnet                              |
|  _sites  _assist _crm    _registry _payments                         |
|                                                                       |
|  [--- Instance 1 ---]  [- Instance 2 -]  [Future]                     |
|                                                                       |
+-----------------------------------------------------------------------+
```

### sn_ (Sites) [LIVE]

| Attribute | Value |
|-----------|-------|
| **Prefix** | `sn_` |
| **Full Name** | Shopnet Network |
| **Entity Type** | Sites, endpoints, network infrastructure |
| **Target Database** | `shopnet_sites` |
| **v1 Equivalent** | `SN-XXXXXXXX` (site_uid) |
| **Examples** | `sn_a1b2c3d4e5f6`, `sn_000000000001` |

Every network endpoint receives a site UID. Websites, databases, nodes, infrastructure components -- anything that exists as an addressable endpoint on the Shopnet network gets an `sn_` identifier.

### sa_ (Agents) [LIVE]

| Attribute | Value |
|-----------|-------|
| **Prefix** | `sa_` |
| **Full Name** | Shopnet Assist |
| **Entity Type** | AI agents, automated assistants |
| **Target Database** | `shopnet_assist` |
| **v1 Equivalent** | `SA-XXXXXXXX` (agent_uid) |
| **Examples** | `sa_a1b2c3d4e5f6`, `sa_000000000001` |

Every AI agent receives an agent UID (`sa_`). Agent Platforms define the agent concept (handler, personality, prompts). Agent Instances are licensed deployments of a Platform to a specific endpoint. The Agent Engine hosting service gets an `sn_` UID (site type A) — agents themselves live in the `sa_` taxonomy only. See PART III for the full Agent Taxonomy.

### su_ (Users) [DESIGNED]

| Attribute | Value |
|-----------|-------|
| **Prefix** | `su_` |
| **Full Name** | Shopnet User |
| **Entity Type** | Human users, customer accounts |
| **Target Database** | `shopnet_crm` |
| **v1 Equivalent** | None (new in SND) |
| **Examples** | `su_a1b2c3d4e5f6`, `su_000000000001` |

Every human user who interacts with the Shopnet ecosystem receives a user UID. This is the cross-site identity. A user authenticates once (via OAuth or future blockchain identity) and their `su_` UID follows them across every Shopnet endpoint.

**THE FIRST LAW applies here.** The `su_` UID has ultimate authority. See Section 1.6.

### sl_ (Lists) [DESIGNED]

| Attribute | Value |
|-----------|-------|
| **Prefix** | `sl_` |
| **Full Name** | Shopnet List |
| **Entity Type** | Lists, registries, wishlists, collections |
| **Target Database** | `shopnet_registry` |
| **v1 Equivalent** | None (new in SND) |
| **Examples** | `sl_a1b2c3d4e5f6`, `sl_000000000001` |

Every list or registry created in the Shopnet ecosystem receives a list UID. Gift registries, wishlists, domain wishlists, to-do lists, curated collections -- any structured list a user creates gets an `sl_` identifier. Lists are owned by users (linked via `su_` UID) and may be shared via share links.

Lists reference external products and domains using the **Pointer Pattern** (see Section 1.5).

### sp_ (Payments) [FUTURE]

| Attribute | Value |
|-----------|-------|
| **Prefix** | `sp_` |
| **Full Name** | Shopnet Payment |
| **Entity Type** | Payments, transactions, wallet operations |
| **Target Database** | `shopnet_payments` |
| **v1 Equivalent** | None (new in SND) |
| **Examples** | `sp_a1b2c3d4e5f6`, `sp_000000000001` |

Every payment or transaction in the Shopnet ecosystem receives a payment UID. This covers wallet-to-wallet transfers, domain-based payments (via Freename/.uid), and any future transaction types.

---

## 1.4 UID Routing [LIVE]

**Source:** Document 47, Part VII.4 (lines 182-205)
**Date:** February 6, 2026
**Implementation:** `/connect.shopnet/backend/snd/uid_generator.py` — `PREFIX_ROUTES` dict, `get_routes_for_prefix()`

Every v2 UID is self-routing. The 2-character prefix tells any system exactly which domain the entity belongs to and which database to query. No lookup table is needed to determine where a UID lives.

```
                          UID ROUTING TABLE
                          -----------------

    Prefix      Domain              Target Database
    ------      ------              ---------------
    sn_         Network             shopnet_sites
    sa_         Network             shopnet_assist
    su_         Identity            shopnet_crm
    sl_         Content             shopnet_registry
    sp_         Transactions        shopnet_payments

    Given: sn_a1b2c3d4e5f6
    Route: prefix "sn_" --> shopnet_sites --> query by UID

    Given: su_x9y8z7w6v5u4
    Route: prefix "su_" --> shopnet_crm --> query by UID
```

Any service receiving a UID can parse the first two characters and route to the correct database without consulting a central directory. The `uid_registry` table exists for validation and audit, not for routing.

---

## 1.5 The Pointer Pattern [DESIGNED]

**Source:** Document 47, Part VIII.7 (lines 353-389)
**Date:** February 6, 2026
**Implementation:** `/connect.shopnet/backend/snd/registry.py` — `add_item()` uses external_ref + ref_system pattern

```
+-----------------------------------------------------------------------+
|                       THE POINTER PATTERN                              |
+-----------------------------------------------------------------------+
|                                                                       |
|   Lists (sl_) reference external products and domains by their        |
|   NATURAL IDENTIFIERS, not by proprietary UIDs.                       |
|                                                                       |
|   Amazon products  -->  referenced by ASIN (e.g., B08N5WRWNW)        |
|   Shopnet domains  -->  referenced by domain name (e.g., foo.shop)    |
|   Custom items     -->  referenced by user-supplied description       |
|                                                                       |
|   WHY: We cannot and should not assign proprietary UIDs to entities   |
|   we do not control. Amazon owns the ASIN namespace. Domain           |
|   registrars own the domain namespace. Wrapping them in our own       |
|   UIDs creates a mapping layer that adds complexity without value.    |
|                                                                       |
|   RULE: If we did not create the entity, we do not UID the entity.   |
|   We POINT to it using its natural identifier.                        |
|                                                                       |
+-----------------------------------------------------------------------+
```

### Example: A Wishlist

```
    sl_a1b2c3d4e5f6   (the list itself -- we own this, we UID it)
        |
        +-- item 1: ASIN B08N5WRWNW    (Amazon product -- pointer)
        +-- item 2: ASIN B09V3KXJPB    (Amazon product -- pointer)
        +-- item 3: domain "cool.shop"  (Shopnet domain -- pointer)
        +-- item 4: "Blue running shoes size 10"  (custom -- text)
```

The list has a UID. The items inside are pointers.

---

## 1.6 The First Law [DESIGNED]

**Source:** Document 47, Part IX.1-IX.3 (lines 393-490)
**Date:** February 6, 2026
**Implementation:** `/connect.shopnet/backend/snd/crm.py` — `delegate_to_agent()`, `revoke_delegation()`

```
+-----------------------------------------------------------------------+
|                                                                       |
|                         THE FIRST LAW                                 |
|                                                                       |
|   The user_uid (su_) has ULTIMATE AUTHORITY.                          |
|                                                                       |
|   1. A user owns their data                                           |
|   2. A user owns their lists                                          |
|   3. A user owns their transaction history                            |
|   4. A user can revoke any agent's access at any time                 |
|   5. An agent CANNOT act without user delegation                      |
|   6. An agent CANNOT override user decisions                          |
|   7. An agent CANNOT access user data without permission              |
|                                                                       |
|   Agents are platforms. Users have authority.                          |
|   This is THE FIRST LAW.                                              |
|                                                                       |
+-----------------------------------------------------------------------+
```

### Authority Chain

**Source:** Document 47, Part IX.3 (lines 464-490)
**Date:** February 6, 2026

```
+-----------------------------------------------------------------------+
|                       AUTHORITY CHAIN                                  |
+-----------------------------------------------------------------------+
|                                                                       |
|   Level 1: THE LAW (this document)                                    |
|     |   Defines what UIDs exist and how they are governed             |
|     |                                                                 |
|   Level 2: Connect Gateway (sole issuer)                              |
|     |   Enforces THE LAW through code                                 |
|     |                                                                 |
|   Level 3: User (su_)                                                 |
|     |   Has authority over their own data and delegations             |
|     |                                                                 |
|   Level 4: Agent (sa_)                                                |
|         Acts only by delegation from Level 3                          |
|         Cannot escalate to Level 2 or Level 1                         |
|                                                                       |
|   An agent cannot modify THE LAW.                                     |
|   An agent cannot bypass Connect Gateway.                             |
|   An agent cannot override a user.                                    |
|   An agent can only do what a user has permitted.                     |
|                                                                       |
+-----------------------------------------------------------------------+
```

---

## 1.7 Sole Issuer [LIVE]

**Source:** Document 47, Part VII.5 (lines 209-233)
**Date:** February 6, 2026
**Implementation:** `/connect.shopnet/backend/snd/uid_registry.py` — `create_uid()` is the ONLY function that issues UIDs

```
+-----------------------------------------------------------------------+
|                                                                       |
|                            THE LAW                                    |
|                                                                       |
|   Connect Gateway is the SOLE ISSUER of ALL UIDs.                     |
|                                                                       |
|   1. No other service may generate a UID                              |
|   2. No other service may assign a UID                                |
|   3. No other service may predict the next UID                        |
|   4. All UID requests go through Connect Gateway                      |
|   5. Connect Gateway records every issuance in uid_issuance_log       |
|   6. Connect Gateway writes every UID to uid_registry                 |
|                                                                       |
|   This is not a suggestion. This is not a best practice.              |
|   This is THE LAW.                                                    |
|                                                                       |
+-----------------------------------------------------------------------+
```

---

## 1.8 Identity Hierarchy [LIVE]

**Source:** Document 46: Future Deathstar v2.0, Section 8 (lines 455-470)
**Date:** February 6, 2026
**Decision:** Option B — Federated UIDs, Unified Master Registry (Section 7, lines 354-400)

```
SHOPNET NETWORK IDENTITY HIERARCHY

Level 0: Endpoints          SN-XXXXXXXX  (site_uid)
  Level 1: Agents           SA-XXXXXXXX  (agent_uid)     [independent — see PART III v6.0]
  Level 1: Users            SU-XXXXXXXX  (user_uid)      [independent]
  Level 1: Lists            SL-XXXXXXXX  (list_uid)      [requires user_uid owner]
  Level 1: Payments         SP-XXXXXXXX  (payment_uid)   [requires user_uid payer]

Note (v6.0): Agents no longer require a site_uid. Agent Platforms (sa_ type PL) reference
an Agent Engine (sn_ type A) but are in the sa_ taxonomy. Agent Instances (sa_ type IN) may
reference a deployment site (sn_) but can also be standalone.

External References (NOT owned by Shopnet):
  Products:                 ASIN / ISBN / UPC  (Amazon, books, retail)
  Domains:                  domain_name        (already unique in tlds table)
  Wallets:                  0x...              (blockchain address)
```

### The Taxonomy Parallel — site_uid Mirrors user_uid

**Source:** Document 46, Section 6 (lines 257-311)
**Date:** February 6, 2026

**Site Side (LIVE):**
```
Connect Gateway issues SN-XXXXXXXX (site_uid)
  → stored in endpoint_taxonomy table
    → branches to: website_data (content)
    → branches to: agent_data (SA-XXXXXXXX)
    → branches to: pulse_data (monitoring)
```

**User Side (DESIGNED):**
```
Connect Gateway issues SU-XXXXXXXX (user_uid)
  → stored in user_taxonomy table
    → branches to: user_profiles (CRM data)
    → branches to: user_site_registrations (which sites)
    → branches to: user_delegations (which agents authorized)
    → branches to: user_wallets (Web3 addresses)
    → branches to: user_oauth (auth provider tokens)
```

### Federated UIDs with Unified Master Registry [LIVE]

**Source:** Document 46, Section 7 — Option B (lines 354-400)
**Date:** February 6, 2026
**Implementation:** `/connect.shopnet/backend/sql/001_uid_registry.sql`

```sql
-- Actual implementation (as deployed) — from 001_uid_registry.sql
CREATE TABLE IF NOT EXISTS uid_registry (
    uid             VARCHAR(30) PRIMARY KEY,
    uid_version     SMALLINT NOT NULL DEFAULT 1,
    uid_type        VARCHAR(10) NOT NULL,
    display_name    VARCHAR(255),
    routes_to       VARCHAR(50) NOT NULL,
    issued_at       TIMESTAMP NOT NULL DEFAULT NOW(),
    active          BOOLEAN NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS uid_issuance_log (
    id              SERIAL PRIMARY KEY,
    uid             VARCHAR(30) NOT NULL,
    requested_by    VARCHAR(100),
    request_context VARCHAR(255),
    issued_at       TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### UID Prefix Alphabet

**Source:** Document 46, Section 7 (lines 385-398)
**Date:** February 6, 2026

```
SHOPNET UID PREFIX ALPHABET (THE LAW v6.0)

  SN-  Site/Endpoint     Connect Gateway issues         [LIVE]
  SA-  Agent             Connect Gateway issues         [LIVE]
  SU-  User              Connect Gateway issues         [DESIGNED]
  SL-  List              Connect Gateway issues         [DESIGNED]
  SP-  Payment           Connect Gateway issues         [FUTURE]

  Reserved:
  SD-  (future)
  SE-  (future)
  ...
```

---

## 1.9 Database Topology [LIVE]

**Source:** Document 47, Part XI.1-XI.4 (lines 617-732)
**Date:** February 6, 2026

```
+-----------------------------------------------------------------------+
|                       DATABASE TOPOLOGY                                |
+-----------------------------------------------------------------------+
|                                                                       |
|   INSTANCE 1: amazon-products-db                                      |
|   +-------------------------------------------------------------+    |
|   |                                                             |    |
|   |   shopnet_data       General platform data                  |    |
|   |   shopnet_sites      Sites, endpoints, taxonomy       [sn_]|    |
|   |   shopnet_assist     Agents, configurations            [sa_]|    |
|   |   amazon_products    Product catalog, domain inventory      |    |
|   |   KPI_Source         Analytics, dashboards                  |    |
|   |   shopnet_connect    Connect Gateway, uid_registry,         |    |
|   |                      uid_issuance_log, metadata             |    |
|   |                                                             |    |
|   +-------------------------------------------------------------+    |
|                                                                       |
|   INSTANCE 2: shopnet-crm-registry                                    |
|   +-------------------------------------------------------------+    |
|   |                                                             |    |
|   |   shopnet_crm        Users, profiles, history          [su_]|    |
|   |   shopnet_registry   Lists, registries, wishlists      [sl_]|    |
|   |                                                             |    |
|   +-------------------------------------------------------------+    |
|                                                                       |
|   FUTURE: shopnet_payments [sp_] -- instance TBD                      |
|                                                                       |
+-----------------------------------------------------------------------+
```

| Instance | Database | Purpose | UID Prefix | Status |
|----------|----------|---------|------------|--------|
| 1 | `shopnet_data` | General platform data, shared resources | -- | **LIVE** |
| 1 | `shopnet_sites` | Sites, endpoints, endpoint taxonomy, domain configs | `sn_` | **LIVE** |
| 1 | `shopnet_assist` | Agent configurations, agent registry, agent platforms | `sa_` | **LIVE** |
| 1 | `amazon_products` | Amazon product catalog, domain inventory | -- | **LIVE** |
| 1 | `KPI_Source` | Analytics dashboards, KPI data, reporting | -- | **LIVE** |
| 1 | `shopnet_connect` | Connect Gateway state, uid_registry, uid_issuance_log | -- | **LIVE** |
| 2 | `shopnet_crm` | User accounts, profiles, delegations | `su_` | **DESIGNED** — SQL ready, tables not yet created |
| 2 | `shopnet_registry` | Lists, gift registries, wishlists | `sl_` | **DESIGNED** — SQL ready, tables not yet created |
| TBD | `shopnet_payments` | Payments, transactions, wallet mappings | `sp_` | **FUTURE** — no schema exists |

### The Master Index [LIVE]

**Source:** Document 47, Part XI.4 (lines 684-732)
**Date:** February 6, 2026
**Implementation:** `/connect.shopnet/backend/snd/uid_registry.py` — CRUD operations for uid_registry

```
+-----------------------------------------------------------------------+
|                       uid_registry                                     |
|                (shopnet_connect database)                              |
+-----------------------------------------------------------------------+
|                                                                       |
|   The uid_registry table is the ZONE FILE of SND.                     |
|                                                                       |
|   Every UID that exists in the namespace has a row here.              |
|   This is the single source of truth for "what UIDs exist."           |
|                                                                       |
|   uid_registry does NOT store entity data.                            |
|   It stores the FACT that a UID was issued.                           |
|   Entity data lives in the target database.                           |
|                                                                       |
+-----------------------------------------------------------------------+
|                                                                       |
|                       uid_issuance_log                                 |
|                (shopnet_connect database)                              |
+-----------------------------------------------------------------------+
|                                                                       |
|   Every issuance event is recorded here. This is the audit trail.     |
|                                                                       |
|   uid_issuance_log is APPEND-ONLY.                                    |
|   Records are NEVER updated or deleted.                               |
|   This is the blockchain-equivalent audit trail for SND.              |
|                                                                       |
+-----------------------------------------------------------------------+
```

---

## 1.10 SND Validation Layer — SND Monitor [LIVE]

**Source:** Document 47, Part X.1-X.3 (lines 494-613)
**Date:** February 6, 2026
**Implementation:** `/connect.shopnet/backend/snd/snd_monitor.py` — `run_all_checks()`

```
+-----------------------------------------------------------------------+
|                         SND MONITOR                                    |
+-----------------------------------------------------------------------+
|                                                                       |
|   Purpose: Continuous validation of the entire SND namespace          |
|                                                                       |
|   The SND Monitor performs 4 validation checks against every UID      |
|   in the system. It runs continuously. It is the immune system        |
|   of the namespace.                                                   |
|                                                                       |
|   If a UID fails any check, the Monitor flags it. Flagged UIDs        |
|   are quarantined for investigation. No flagged UID is silently       |
|   ignored.                                                            |
|                                                                       |
+-----------------------------------------------------------------------+
```

### The Four Checks

**Source:** Document 47, Part X.2 (lines 527-574)
**Date:** February 6, 2026
**Implementation:** `snd_monitor.py` — `check_uniqueness()`, `check_consistency()`, `check_immutability()`, `check_audit()`

| # | Check | What It Validates | Failure Means |
|---|-------|-------------------|---------------|
| 1 | **Uniqueness** | No two entities share the same UID across the entire namespace | Collision detected -- critical failure |
| 2 | **Consistency** | Every UID in a target database also exists in uid_registry (and vice versa) | Orphan UID -- issued outside Connect Gateway |
| 3 | **Immutability** | No UID has been modified after issuance | UID tampering -- integrity violation |
| 4 | **Audit** | Every UID in uid_registry has a corresponding entry in uid_issuance_log | Missing audit trail -- issuance not recorded |

The consistency check validates across both RDS instances:
- Instance 1: `sn_` UIDs vs `endpoint_taxonomy`, `sa_` UIDs vs `agents`
- Instance 2: `su_` UIDs vs `user_taxonomy`, `sl_` UIDs vs `list_taxonomy` (graceful skip if databases not yet created)

---

## 1.11 Governance Hierarchy [LIVE]

**Source:** Document 47, Part XII.1-XII.4 (lines 736-845)
**Date:** February 6, 2026

```
+-----------------------------------------------------------------------+
|                    GOVERNANCE HIERARCHY                                 |
+-----------------------------------------------------------------------+
|                                                                       |
|   LEVEL 1: NAMESPACE                                                  |
|   ==================                                                  |
|   Scope: snd.shopnet (the entire namespace)                           |
|   Governs: UID format, issuance rules, sole issuer principle,         |
|            uid_registry, uid_issuance_log, SND Monitor                |
|   Authority: THE LAW (this document)                                  |
|                                                                       |
|       |                                                               |
|       +-- LEVEL 2: DOMAINS                                            |
|       |   ================                                            |
|       |   Scope: Functional areas within the namespace                |
|       |   4 domains:                                                  |
|       |     Network       (sn_, sa_)                                  |
|       |     Identity      (su_)                                       |
|       |     Content       (sl_)                                       |
|       |     Transactions  (sp_)                                       |
|       |                                                               |
|       |       |                                                       |
|       |       +-- LEVEL 3: ENTITY TYPES                               |
|       |           ====================                                |
|       |           Scope: Individual entity types within domains       |
|       |                                                               |
+-----------------------------------------------------------------------+
```

### Domain Rules

| Domain | Prefixes | Scope | Instance |
|--------|----------|-------|----------|
| **Network** | `sn_`, `sa_` | Infrastructure, endpoints, agents | Instance 1 |
| **Identity** | `su_` | Users, authentication, profiles | Instance 2 |
| **Content** | `sl_` | Lists, registries, user-created data | Instance 2 |
| **Transactions** | `sp_` | Payments, wallet operations | TBD |

- **Network**: Agent Engines get `sn_` UIDs (site type A). Agent Platforms and Instances get `sa_` UIDs only. See PART III.
- **Identity**: `su_` data is subject to privacy rules; user has ultimate authority (First Law)
- **Content**: Lists reference external entities by pointer, not by UID (Pointer Pattern)
- **Transactions**: `sp_` records are append-only; no transaction is ever deleted

### Governance Flows Downward

```
    GOVERNANCE FLOWS DOWNWARD. NEVER UPWARD.

    Level 1 (Namespace)
        |
        |  constrains
        v
    Level 2 (Domains)
        |
        |  constrains
        v
    Level 3 (Entity Types)

    A Level 3 schema change cannot violate Level 2 domain rules.
    A Level 2 domain rule cannot violate Level 1 namespace rules.
    Level 1 namespace rules can only be changed by updating THE LAW.
    THE LAW can only be changed per the Zeroth Law (to improve and evolve).
```

---

## 1.12 v1 Coexistence [LIVE]

**Source:** Document 47, Appendix A (lines 849-926)
**Date:** February 6, 2026
**Implementation:** `/connect.shopnet/backend/snd/uid_generator.py` — `validate_uid()` handles both v1 and v2

| Attribute | v1 Format | v2 Format |
|-----------|-----------|-----------|
| **Pattern** | `SX-XXXXXXXX` | `xx_xxxxxxxxxxxx` |
| **Length** | 11 characters | 15 characters |
| **Prefix** | 2 uppercase + hyphen | 2 lowercase + underscore |
| **Body** | 8-digit zero-padded integer | 12 base36 characters |
| **Generation** | Sequential counter | Timestamp + random |
| **Capacity** | 99,999,999 per prefix | ~4.7 quintillion per prefix |
| **Prefixes** | 2 (SN, SA) | 5 (sn, sa, su, sl, sp) |
| **Sortable** | By sequence number | By creation timestamp |

```
+-----------------------------------------------------------------------+
|                                                                       |
|                    v1 IS STILL VALID                                   |
|                                                                       |
|   v1 UIDs (SN-XXXXXXXX, SA-XXXXXXXX) are NEVER retired.              |
|   They are NEVER re-issued. They are NEVER migrated.                  |
|                                                                       |
|   Entities issued a v1 UID keep that UID forever.                     |
|   New entities receive v2 UIDs.                                       |
|   Both formats coexist in the same namespace.                         |
|                                                                       |
+-----------------------------------------------------------------------+
```

Migration rules:
1. **No forced migration.** Existing v1 UIDs are permanent.
2. **New issuance uses v2.** All new UIDs issued by Connect Gateway use v2 format.
3. **uid_registry stores both.** `VARCHAR(30)` accommodates both formats.
4. **Routing handles both.** Services must recognize both `SN-`/`sn_` and `SA-`/`sa_`.
5. **SND Monitor validates both.** The four checks apply equally to v1 and v2 UIDs.
6. **No version hierarchy.** A v2 UID is not "better" than a v1 UID.

---
---

# PART II — SITE UID TAXONOMY (sn_ / SN-)

**Source:** `update-taxonomy-v3.5.sql` — `/shopnet.network-console/scripts/update-taxonomy-v3.5.sql` (Feb 4-7, 2026)
**Source:** `console.js` PLATFORM_OPTIONS — `/shopnet.network-console/static/js/console.js:3783-3827` (Feb 4-7, 2026)
**Source:** `endpoint-taxonomy-update.MD` — `/taxonomy.shopnet/endpoint-taxonomy-update.MD` (Feb 7, 2026)
**Source:** `taxonomy_definition` table — `shopnet_sites` RDS database
**Source:** `endpoint_taxonomy` table — `shopnet_sites` RDS database
**Source:** `validate_platform_type()` trigger — `shopnet_sites` RDS database (dynamic v3.5.1)
**Date:** February 7, 2026 (THE LAW v5.0)
**Authority:** TJL
**Implementation Status:** [LIVE] — deployed to production Feb 7, 2026

---

## 2.0 Taxonomy Implementation — How It Works [LIVE]

**Source:** `endpoint-taxonomy-update.MD` — `/taxonomy.shopnet/endpoint-taxonomy-update.MD` (Feb 7, 2026)
**Date:** February 7, 2026

The `taxonomy_definition` table in the `shopnet_sites` database is the **source of truth** for the taxonomy of the entire endpoint network. It defines every valid value for every taxonomy level.

**As of February 7, 2026, the system moved from hardcoded to dynamic validation.**

### Before (Hardcoded — Three Independent Copies)

```
taxonomy_definition table          → Source of truth (74 rows)
                                      ↑ NOBODY READ FROM THIS

validate_platform_type() trigger   → Hardcoded IF/ELSE lists (copy #1)
PLATFORM_OPTIONS in console.js     → Hardcoded const object (copy #2)
Flask app.py                       → No validation at all (passthrough)
```

Adding a new platform_type required editing all three places.

### After (Dynamic — Single Source of Truth) [LIVE as of Feb 7, 2026]

```
taxonomy_definition table           → Source of truth (79 rows live, 35 platform_types)
        │                                ↑ EVERYTHING READS FROM THIS
        ├──→ validate_platform_type()    → Dynamic SELECT against table
        ├──→ PLATFORM_OPTIONS            → Fetched from API on wizard open
        └──→ Flask API endpoint          → Serves table data to frontend
```

Adding a new platform_type requires **one INSERT into `taxonomy_definition`**. The trigger and UI pick it up automatically.

### How to Add a New Platform Type

One INSERT. Example — adding a new Infrastructure type for "ECS Cluster":

```sql
INSERT INTO taxonomy_definition (level, parent_code, code, name, description)
VALUES ('platform_type', 'I', 'ECS', 'ECS Cluster', 'Amazon ECS container cluster');
```

No other changes needed. The trigger and console wizard pick it up automatically.

### The Three Enforcement Points

| # | Component | Location | What It Does | Status |
|---|-----------|----------|-------------|--------|
| 1 | **Dynamic Trigger** | `validate_platform_type()` on `endpoint_taxonomy` | SELECTs from `taxonomy_definition` on every INSERT/UPDATE — rejects invalid platform_types | **LIVE** |
| 2 | **Flask API** | `GET /api/brochure/taxonomy-definitions/platform-options` in `app.py` (~line 803) | Serves taxonomy_definition data to console wizard in PLATFORM_OPTIONS shape | **LIVE** |
| 3 | **Console Loader** | `loadPlatformOptions()` in `console.js` (~line 3834) | Fetches from Flask API on wizard open, overwrites hardcoded fallback | **LIVE** |

### Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        taxonomy_definition TABLE                             │
│                    (shopnet_sites DB on RDS)                                  │
│                    79 rows live, 35 platform_types                           │
└──────────────┬──────────────────────────────┬────────────────────────────────┘
               │                              │
               │ SELECT on INSERT/UPDATE      │ SELECT on wizard open
               ▼                              ▼
┌──────────────────────────┐    ┌──────────────────────────────────────────────┐
│  validate_platform_type()│    │  GET /api/brochure/taxonomy-definitions/     │
│  (PL/pgSQL trigger)      │    │      platform-options                        │
│                          │    │  (Flask route in app.py)                     │
│  IF code NOT in table    │    │                                              │
│    → RAISE EXCEPTION     │    │  Returns JSON grouped by endpoint_type       │
│  IF table empty          │    │                                              │
│    → WARN + ALLOW        │    │                                              │
└──────────────────────────┘    └──────────────────┬───────────────────────────┘
               │                                   │
               │ Enforces on                       │ Fetched by
               ▼                                   ▼
┌──────────────────────────┐    ┌──────────────────────────────────────────────┐
│  endpoint_taxonomy TABLE │    │  console.js: loadPlatformOptions()           │
│                          │    │                                              │
│  Used by:                │    │  → PLATFORM_OPTIONS = response               │
│  - Add Endpoint wizard   │    │  → Fallback to hardcoded if API fails        │
│  - Change Endpoint wizard│    │                                              │
│  - Claude CLI process    │    │  Called by:                                  │
│                          │    │  - openEndpointAdderWizard()                 │
│                          │    │  - openEndpointEditorWizard()                │
└──────────────────────────┘    └──────────────────────────────────────────────┘
```

**Note on taxonomy_definition pattern:** This dynamic lookup table pattern is currently **unique to shopnet_sites** (sn_ taxonomy). The CRM (su_), assist (sa_), and registry (sl_) databases do NOT have equivalent taxonomy_definition tables — their valid values are hardcoded as column defaults, ENUM constraints, or unconstrained. See TODO items S15-S17 for future work.

---

## 2.1 Level 0 — Identity [LIVE]

**Source:** `endpoint_taxonomy` table, `shopnet_sites` RDS — `site_uid VARCHAR(15) PRIMARY KEY`
**Date:** Feb 4, 2026

| Field | Type | Values | Required | Mutable |
|-------|------|--------|----------|---------|
| `site_uid` | VARCHAR(15) | v1: `SN-XXXXXXXX`, v2: `sn_xxxxxxxxxxxx` | YES | **NO** |

Issued by Connect Gateway ONLY. Never changes. Never reused.

---

## 2.2 Level 1 — Endpoint Type [LIVE]

**Source:** `taxonomy_definition` table, `level = 'endpoint_type'` — `shopnet_sites` RDS
**Constraint:** `endpoint_taxonomy.chk_endpoint_type CHECK (endpoint_type IN ('W','A','D','N','I','O','ND'))` — includes ND for backward compatibility
**Date:** Feb 4-7, 2026

| Field | Type | Required | Mutable |
|-------|------|----------|---------|
| `endpoint_type` | CHAR(2) | YES | **NO** — set at creation, immutable |

| Code | Name | Description | Active |
|------|------|-------------|--------|
| `W` | Website | Web-accessible sites (brochure, store, portal, console) | TRUE |
| `A` | Agent Engine | Application that hosts agent platforms (v6.0: relabeled from "Agent") | TRUE |
| `D` | Database | Data stores (RDS, DynamoDB, S3, GitHub) | TRUE |
| `N` | Node | Network service nodes (gateways, APIs, hubs) | TRUE |
| `I` | Infrastructure | Infrastructure components (Lambda, queues, topics) | TRUE |
| `O` | Other | Uncategorized endpoints | TRUE |
| `ND` | Non-Domain (LEGACY) | Legacy — split into N, I, O on Feb 4 2026 | **FALSE** — CHECK constraint still allows it for backward compatibility until migration (S9 in TODO) |

---

## 2.3 Level 2 — Platform Type [LIVE]

**Source:** `taxonomy_definition` table, `level = 'platform_type'` — `shopnet_sites` RDS (79 rows live, 35 platform_types)
**Enforcement:** `validate_platform_type()` dynamic trigger on `endpoint_taxonomy`
**Date:** Feb 7, 2026 (v3.5.1 — dynamic)

| Field | Type | Required | Mutable |
|-------|------|----------|---------|
| `platform_type` | VARCHAR(3) | YES | **YES** — via migration workflow |

### W (Website) — 9 types [LIVE]

**Source:** `taxonomy_definition` table, `parent_code = 'W'` — `shopnet_sites` RDS

| Code | Name | Description |
|------|------|-------------|
| `CO` | CloudFront On-Demand | Lambda-backed, scales to zero |
| `CP` | CloudFront Persistent | nginx on EC2, always running |
| `WP` | WordPress | PHP on EC2 with WordPress |
| `SH` | Shopify | External Shopify store |
| `WW` | WooCommerce | WordPress with WooCommerce |
| `CL` | Custom Lambda | Custom Lambda function |
| `S3` | S3 Static | Static files on S3 |
| `LM` | Lightsail | Amazon Lightsail instance |
| `L3` | Layer3 Web3 | Lambda@Edge with IP certs for emoji TLDs |

### A (Agent Engine) — 5 types [LIVE]

**Source:** `taxonomy_definition` table, `parent_code = 'A'` — `shopnet_sites` RDS
**v6.0 Note:** Site type "A" relabeled from "Agent" to "Agent Engine". The Agent Engine is the hosting application (e.g., FastAPI Assist Engine), not an agent itself. Agents live in the `sa_` taxonomy (see PART III). Platform subtypes below describe the LLM provider of the Agent Engine.

| Code | Name | Description | In Wizard |
|------|------|-------------|-----------|
| `CL` | Claude Engine | Anthropic Claude-based agent engine | YES |
| `GP` | GPT Engine | OpenAI GPT-based agent engine | YES |
| `GM` | Gemini Engine | Google Gemini-based agent engine | YES — added to fallback Feb 7 |
| `CA` | Custom Engine | Custom agent engine implementation | YES |
| `OT` | Other Engine | Other agent engine | YES — added to fallback Feb 7 |

### D (Database) — 5 types [LIVE]

**Source:** `taxonomy_definition` table, `parent_code = 'D'` — `shopnet_sites` RDS

| Code | Name | Description |
|------|------|-------------|
| `RD` | RDS PostgreSQL | Amazon RDS PostgreSQL |
| `DY` | DynamoDB | Amazon DynamoDB |
| `S3` | S3 Data Lake | S3 as data store |
| `GIT` | GitHub Repository | GitHub code repository |
| `TPD` | Third Party DB API | External database API |

### N (Node) — 6 types [LIVE]

**Source:** `taxonomy_definition` table, `parent_code = 'N'` — `shopnet_sites` RDS

| Code | Name | Description |
|------|------|-------------|
| `W3G` | Web3 Gateway | Web3 domain resolution gateway |
| `API` | API Hub | API service endpoint |
| `RDH` | Redirect Hub | URL redirect service |
| `W3S` | Web3 DAAS | Web3 decentralized service |
| `LLM` | LLM Service | Large language model service |
| `OTH` | Other Node | Other network node |

### I (Infrastructure) — 9 types [LIVE]

**Source:** `taxonomy_definition` table, `parent_code = 'I'` — `shopnet_sites` RDS
**Updated:** February 7, 2026 — 5 new types added (LS, EC2, RDS, CF, AGW) via `endpoint-taxonomy-update.MD`

| Code | Name | Description | Added |
|------|------|-------------|-------|
| `S3B` | S3 Bucket | S3 storage bucket | Feb 4 |
| `LMB` | Lambda Function | Standalone Lambda | Feb 4 |
| `SQS` | SQS Queue | Message queue | Feb 4 |
| `SNS` | SNS Topic | Notification topic | Feb 4 |
| `LS` | Lightsail Instance | Amazon Lightsail virtual server | **Feb 7** |
| `EC2` | EC2 Instance | Amazon EC2 instance | **Feb 7** |
| `RDS` | RDS Instance | Amazon RDS database instance | **Feb 7** |
| `CF` | CloudFront Distribution | Amazon CloudFront CDN distribution | **Feb 7** |
| `AGW` | API Gateway | AWS API Gateway | **Feb 7** |

### O (Other) — 1 type [LIVE]

**Source:** `taxonomy_definition` table, `parent_code = 'O'` — `shopnet_sites` RDS

| Code | Name | Description |
|------|------|-------------|
| `OTH` | Other | Uncategorized endpoint |

### Platform Type Summary

| endpoint_type | Count | Codes |
|---------------|-------|-------|
| W (Website) | 9 | CL, CO, CP, L3, LM, S3, SH, WP, WW |
| A (Agent Engine) | 5 | CA, CL, GM, GP, OT |
| D (Database) | 5 | DY, GIT, RD, S3, TPD |
| N (Node) | 6 | API, LLM, OTH, RDH, W3G, W3S |
| I (Infrastructure) | 9 | AGW, CF, EC2, LMB, LS, RDS, S3B, SNS, SQS |
| O (Other) | 1 | OTH |
| **Total** | **35** | |

---

## 2.4 Universal Fields [LIVE]

**Source:** `endpoint_taxonomy` table, `shopnet_sites` RDS
**Date:** Feb 4, 2026

| Field | Type | Values | Required | Mutable |
|-------|------|--------|----------|---------|
| `site_uid` | VARCHAR(15) | `SN-XXXXXXXX` or `sn_xxxxxxxxxxxx` | YES | **NO** |
| `domain_name` | VARCHAR(255) | any | YES | YES |
| `endpoint_type` | CHAR(2) | W, A, D, N, I, O | YES | **NO** |
| `platform_type` | VARCHAR(3) | varies by endpoint_type | YES | YES |
| `web_protocol` | CHAR(2) | W2, W3 | YES | **NO** |
| `status` | VARCHAR(10) | planned, wip, live | YES | YES |
| `runtime` | VARCHAR(20) | nginx, lambda, php, node, python, external | NO | YES |
| `host` | VARCHAR(20) | ec2, api_gateway, s3, cloudfront, external | NO | YES |
| `created_at` | TIMESTAMP | — | YES | NO |
| `updated_at` | TIMESTAMP | — | YES | YES |
| `notes` | TEXT | — | NO | YES |
| `created_by` | VARCHAR(100) | default 'system' | NO | YES |
| `deleted_at` | TIMESTAMP | — | NO | YES |

---

## 2.5 Website-Specific Fields (endpoint_type = 'W' only) [LIVE]

**Source:** `endpoint_taxonomy` table + `taxonomy_definition` table, `shopnet_sites` RDS
**Date:** Feb 4, 2026

### managed_by

| Code | Name | Description |
|------|------|-------------|
| `L` | Lambda | Managed by AWS Lambda (On-Demand) |
| `R` | Radius | Managed by Radius site builder (Persistent) |
| `M` | Manual | Manually managed |
| `E` | External | Externally managed (third-party) — added Feb 4 |
| `null` | None | No automated management |

### persistence

| Code | Name | Description |
|------|------|-------------|
| `P` | Persistent | Always running |
| `D` | On-Demand | Scales to zero when not in use |

### website_purpose

| Code | Name | Description | Active |
|------|------|-------------|--------|
| `brochure` | Brochure Site | Brochure/marketing site | TRUE |
| `product_store` | Product Store | Product store (e.g., Shopify) | TRUE |
| `domain_store` | Domain Store | Domain store (e.g., WooCommerce) | TRUE |
| `portal` | Portal | Client portal | TRUE |
| `console` | Console | Console/Admin interface | TRUE |
| `other` | Other | Other purpose | TRUE |
| `gateway` | Web3 Gateway (LEGACY) | Legacy — use endpoint_type=N, platform_type=W3G | **FALSE** |

### store_checkout

| Code | Description |
|------|-------------|
| `Y` | Has shopping cart and checkout |
| `N` | No e-commerce transaction capability |

**OPEN QUESTION (Q1):** Document 26 says Y/N. Deathstar Master says affiliate/checkout/both/none. Resolution needed — see TODO.

---

## 2.6 Agent-Specific Fields [LIVE]

### endpoint_taxonomy.agent_type

**Source:** `endpoint_taxonomy` table, `agent_type` column — `shopnet_sites` RDS
**Type:** VARCHAR(20), nullable, **unconstrained** (no trigger, no CHECK, no taxonomy_definition lookup)
**Purpose:** Tracks which client-facing chatbot is installed on a Website endpoint.

| Value | Description | Usage |
|-------|-------------|-------|
| `product_assist` | Product recommendation chatbot | Assigned to e-commerce sites |
| `domain_assist` | Domain recommendation chatbot | Assigned to domain search sites |
| `status_agent` | Status monitoring chatbot | 1 site: SN-00000067 bestbird.com |
| NULL | No chatbot installed | 75 of 76 endpoints |

**Read by:** `content_assist/handler.py` (line 449), `dashboard.js` (lines 443-446), `app.py` (line 801).

**Note (v6.0):** In shopnet_assist, the `agent_type` column has been repurposed. Old values (`internal`/`client`/`both`) moved to `agent_class`. New `agent_type` = `'PL'` (Platform) or `'IN'` (Instance). The `endpoint_taxonomy.agent_type` column (described above) is a separate field on the site taxonomy side — it tracks which chatbot is installed on a Website endpoint. See S18c in TODO.md for full investigation.

**Note:** 7 taxonomy_definition rows for `agent_type` (domain, product, content, kpi, site, choice, custom) were designed in `update-taxonomy-v3.5.sql` but **never deployed** — the codes didn't match actual values. Removed from SQL on Feb 8, 2026 (S20).

---

## 2.7 Console Display Fields [LIVE]

### console_section

**Source:** `taxonomy_definition` table, `level = 'console_section'` — `shopnet_sites` RDS

| Code | Name | Description |
|------|------|-------------|
| `brochure` | Brochure Sites | Marketing and brochure websites |
| `products` | Product Stores | E-commerce product stores |
| `domains` | Domain Stores | Domain marketplace stores |
| `data.shopnet` | Data Layer | Databases and data stores |
| `assist.shopnet` | AI Agents | AI assistants and agents |
| `network-nodes` | Network Nodes | Network service nodes (non-W3G) |
| `web3-gateways` | Web3 Gateways | Web3 domain resolution gateways |
| `infrastructure` | Infrastructure | AWS infrastructure components |
| `shopnet.network` | Core Platform | Core platform services and consoles |
| `connect.shopnet` | Connect Services | Connect API and services |

### Console Card Fields

| Field | Type | Purpose |
|-------|------|---------|
| `console_section` | VARCHAR(50) | Primary allocation — determines which console page displays the card |
| `card_label` | VARCHAR(255) | Display name on card. Defaults to domain_name if not set |
| `show_on_map` | BOOLEAN | If false, card is hidden from console pages but remains in registry |

### Auto-Assignment Rules

**Source:** `console.js` `submitEndpointWizard()` (line 4213) and `prefillEditorConsoleSectionForm()` (line 4575)

| endpoint_type | website_purpose / platform_type | Auto-assigned console_section |
|---------------|--------------------------------|-------------------------------|
| `D` (Database) | any | `data.shopnet` |
| `A` (Agent Engine) | any | `assist.shopnet` |
| `N` (Node) | platform_type = `W3G` | `web3-gateways` |
| `N` (Node) | platform_type != `W3G` | `network-nodes` |
| `I` (Infrastructure) | any | `infrastructure` |
| `O` (Other) | any | `shopnet.network` |
| `W` (Website) | website_purpose = `product_store` | `products` |
| `W` (Website) | website_purpose = `domain_store` | `domains` |
| `W` (Website) | website_purpose = `portal` | `shopnet.network` |
| `W` (Website) | website_purpose = `console` | `shopnet.network` |
| `W` (Website) | default / `brochure` | `brochure` |

---

## 2.8 status [LIVE]

**Source:** `taxonomy_definition` table, `level = 'status'` — `shopnet_sites` RDS

| Code | Name | Description | Console Display |
|------|------|-------------|-----------------|
| `planned` | Planned | Placeholder — not health checked | Grey dot |
| `wip` | Work in Progress | Building | Orange dot |
| `live` | Live | Active — health checked | Green/red based on Pulse |

---

## 2.9 web_protocol [LIVE]

| Code | Name | Description |
|------|------|-------------|
| `W2` | Web2 | Traditional DNS-based web (ICANN TLDs: .com, .net, .io) |
| `W3` | Web3 | Blockchain/decentralized web (.domains, emoji TLDs) |

**Immutable** — set at creation, never changes.

---

## 2.10 runtime [LIVE]

| Code | Name | Description |
|------|------|-------------|
| `nginx` | nginx | nginx web server |
| `lambda` | Lambda | AWS Lambda function |
| `php` | PHP | PHP runtime |
| `node` | Node.js | Node.js runtime |
| `python` | Python | Python runtime |
| `external` | External | External/third-party runtime |

---

## 2.11 host [LIVE]

| Code | Name | Description |
|------|------|-------------|
| `ec2` | EC2 | Amazon EC2 instance |
| `api_gateway` | API Gateway | AWS API Gateway |
| `s3` | S3 | Amazon S3 |
| `cloudfront` | CloudFront | Amazon CloudFront CDN |
| `external` | External | External/third-party host |

---

## 2.12 Pulse Health Check Method Mapping [LIVE]

**Source:** `taxonomy_definition` table `pulse_method` column + `console.js` `getPulseMethod()`
**Date:** Feb 7, 2026 (updated: tcp for I/RDS, http_ip for I/LS+EC2, dynamic Infrastructure)

| endpoint_type | platform_type | Pulse Method | Notes |
|---------------|---------------|-------------|-------|
| W | L3 | `http_web3` | Web3 gateway resolution via web3.sn |
| W | CO, CL | `http_ondemand` | Lambda invocation (cost-tracked) |
| W | SH, WP, WW | `http_store` | External stores (any response = alive) |
| W | CP, S3, LM (default) | `http` | Standard HTTP HEAD |
| A (Agent Engine) | (all) | `agent` | POST test prompt to LLM |
| D | RD | `db` | SELECT 1 on database connection |
| D | GIT | `github` | GitHub API repo check |
| D | S3 | `fileserver` | GET pulse.json + site_uid match |
| D | DY, TPD (default) | `api` | HTTP GET, any response = alive |
| N | (all) | `api` | HTTP GET, any response = alive |
| I | LS, EC2 | `http_ip` | Direct IP check, bypasses DNS |
| I | RDS | `tcp` | TCP socket connect to host:port |
| I | RDS | `rds` | boto3 resolves instance ID → TCP connect |
| I | S3B | `fileserver` | GET pulse.json + site_uid match |
| I | default (LMB, SQS, SNS, CF, AGW) | `api` | HTTP GET, any response = alive |

### Single Endpoint Check API [LIVE]

The `/api/v1/pulse/check` endpoint supports on-demand single checks (used by Infrastructure page):

Supported methods: `http`, `http_ip`, `http_store`, `http_web3`, `api`, `tcp`, `rds`

**Not supported** in single check: `db`, `agent`, `github`, `fileserver` (these require DB connections or special auth — use full pulse run instead).

### Pulse Module — Full Documentation

The Pulse health check system is documented in **[PULSE.md](connect.shopnet/docs/PULSE.md)** (v2.0, Feb 7 2026). That document is the authoritative reference for:

- **13 check types:** http, http_ondemand, http_store, http_ip, http_web3, tcp, rds, db, agent, api, github, fileserver, none
- **8 pulse columns** on `endpoint_taxonomy`: pulse_url, pulse_method, pulse_enabled, pulse_auth_ref, last_pulse_status, last_pulse_latency_ms, last_pulse_error, last_pulse_at
- **Pulse API routes:** `/api/v1/pulse/run`, `/api/v1/pulse/config`, `/api/v1/pulse/status`, `/api/v1/pulse/status/db`, `/api/v1/pulse/check`
- **Pulse controller GUI:** pulse.html (standalone), console.js pulse functions (Live Status + Endpoint Registry panels)
- **Infrastructure pulse:** Dynamic from `endpoint_taxonomy` (type I), per-endpoint `pulse_method` — no hardcoded servers
- **Live CHECK constraint** `chk_health_method` on production RDS

---

## 2.13 RDS Schema — The Four Tables [LIVE]

**Source:** `shopnet_sites` RDS database + `schema_the_law.sql`
**Date:** Feb 7, 2026

The `shopnet_sites` database contains four tables (the "No Redundancy" Principle — each field exists in exactly one table):

| # | Table | Purpose | Scope |
|---|-------|---------|-------|
| 1 | `endpoint_taxonomy` | Source of truth for ALL endpoint classifications | All endpoints (W, A, D, N, I, O) |
| 2 | `website_data` | Operational data for websites only | endpoint_type = 'W' only |
| 3 | `json_backup` | Backup of `network-endpoints.json` fields (disaster recovery) | All endpoints |
| 4 | `github_cards` | GitHub-stored modules/templates for Console Cards | External GitHub resources (no site_uid) |

Plus the dynamically-created lookup table:

| 5 | `taxonomy_definition` | Valid taxonomy values — source of truth for all taxonomy levels | Created by `update-taxonomy-v3.5.sql` |

### endpoint_taxonomy

**Source:** `shopnet_sites` RDS database
**Date:** Feb 7, 2026

```sql
CREATE TABLE endpoint_taxonomy (
    site_uid         VARCHAR(15)   PRIMARY KEY,
    domain_name      VARCHAR(255)  NOT NULL UNIQUE,
    endpoint_type    CHAR(2)       NOT NULL,
    platform_type    VARCHAR(3)    NOT NULL,
    web_protocol     CHAR(2)       NOT NULL DEFAULT 'W2',
    status           VARCHAR(10)   NOT NULL DEFAULT 'planned',
    runtime          VARCHAR(20),
    host             VARCHAR(20),
    managed_by       CHAR(1),
    persistence      CHAR(1),
    website_purpose  VARCHAR(20),
    store_checkout   CHAR(1),
    agent_type       VARCHAR(20),
    console_section  VARCHAR(50),
    card_label       VARCHAR(255),
    show_on_map      BOOLEAN       DEFAULT TRUE,
    created_at       TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMP     NOT NULL DEFAULT NOW(),
    notes            TEXT,
    created_by       VARCHAR(100)  DEFAULT 'system',
    deleted_at       TIMESTAMP,
    CONSTRAINT chk_endpoint_type CHECK (endpoint_type IN ('W','A','D','N','I','O','ND')),
    CONSTRAINT chk_managed_by CHECK (managed_by IS NULL OR managed_by IN ('L','R','M','E'))
);
```

### website_data

```sql
CREATE TABLE website_data (
    site_uid              VARCHAR(15)   PRIMARY KEY REFERENCES endpoint_taxonomy(site_uid),
    template_id           VARCHAR(50),
    site_content          JSONB,
    html_s3_path          VARCHAR(255),
    build_status          VARCHAR(20)   DEFAULT 'pending',
    build_error           TEXT,
    dns_status            VARCHAR(20)   DEFAULT 'pending',
    ssl_status            VARCHAR(20)   DEFAULT 'pending',
    cloudfront_id         VARCHAR(50),
    cloudfront_domain     VARCHAR(255),
    route53_zone_id       VARCHAR(50),
    acm_cert_arn          VARCHAR(255),
    route53_nameservers   TEXT[],
    ssl_expiry_date       TIMESTAMP,
    ssl_issued_at         TIMESTAMP,
    cloudfront_status     VARCHAR(20),
    cloudfront_deployed_at TIMESTAMP,
    provisioning_status   VARCHAR(50),
    provisioning_started_at TIMESTAMP,
    provisioning_completed_at TIMESTAMP,
    provisioning_error    TEXT,
    last_build_at         TIMESTAMP,
    last_deploy_at        TIMESTAMP
);
```

### taxonomy_definition

```sql
CREATE TABLE taxonomy_definition (
    id SERIAL PRIMARY KEY,
    level VARCHAR(30) NOT NULL,
    parent_code VARCHAR(10),
    code VARCHAR(30) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(level, parent_code, code)
);
```

---

## 2.14 Console Wizard Flow [LIVE]

**Source:** `endpoint-taxonomy-update.MD`, Section 6 — `/taxonomy.shopnet/endpoint-taxonomy-update.MD`
**Date:** February 7, 2026

### Add Endpoint Wizard

```
User clicks "Add Endpoint" button
    → calls openEndpointAdderWizard()                   [console.js line ~3955]
        → await loadPlatformOptions()                    [fetches from taxonomy_definition API]
        → loadSecretsIntoDropdowns()                     [fetches auth secrets]
        → shows modal

Step 1: Select endpoint_type (W/A/D/N/I/O)
Step 2: Select platform_type                             [from PLATFORM_OPTIONS]
Step 3: Enter details (domain, managed_by, etc.)
Step 4: Configure card (section, status)
Step 5: Confirm and submit
    → POST to Connect Gateway: /api/v1/site-uid/create  [issues SN-XXXXXXXX]
    → POST to Flask: /api/brochure/taxonomy              [creates taxonomy record]
    → DB trigger validates platform_type against taxonomy_definition
```

### Change Endpoint Wizard

```
User clicks "Change Endpoint" button
    → calls openEndpointEditorWizard(siteUid)            [console.js line ~4366]
        → fetch(`/api/brochure/taxonomy/${siteUid}`)     [loads current record]
        → await loadPlatformOptions()                    [fetches from taxonomy_definition API]
        → pre-selects current values in form
        → shows modal

Step 1: endpoint_type (pre-selected, editable)
Step 2: platform_type (pre-selected, editable)
Step 3: Edit details
Step 4: Edit card config
Step 5: Review changes and submit
    → PUT /api/brochure/taxonomy/{site_uid}              [updates taxonomy record]
    → DB trigger validates platform_type against taxonomy_definition
```

---
---

# PART III — AGENT UID TAXONOMY (sa_ / SA-)

**Source:** `AgentTaxonomy_v1.0_2026-02-11.MD` — `/taxonomy.shopnet/AgentTaxonomy_v1.0_2026-02-11.MD` (Feb 11, 2026) — **PRIMARY SOURCE**
**Source:** Document 26: THIS IS THE LAW v4.0, Part VI — `/shopnet-deathstar/26-THIS-IS-THE-LAW.md` (superseded by AgentTaxonomy v1.0)
**Source:** `DATABASE-DESIGN.md` — `/assist.shopnet/docs/DATABASE-DESIGN.md` (Feb 5-6, 2026) (partially superseded)
**Date:** February 11, 2026 (v6.0 rewrite)
**Authority:** TJL
**Implementation Status:** [LIVE] — Database `shopnet_assist` created on Instance 1. 9 tables + prompt_library + prompt_assignments. 12 seed rules inserted. 8 agents registered (SA-00000001 through SA-00000008) as Platforms. Backend engine built (Assist Engine on 13.219.217.59).

**v6.0 REWRITE:** This entire section was rewritten in v6.0 to implement the Platform (PL) / Instance (IN) agent taxonomy. The canonical source is `AgentTaxonomy_v1.0_2026-02-11.MD`. Key changes:
- Agents no longer require `sn_` UIDs (two-level identity removed)
- Agent taxonomy has two types: Platform (PL) and Instance (IN)
- `agent_type` column repurposed: old values (internal/client/both) → `agent_class`, new `agent_type` = PL or IN
- Prompt library stored in database (TEXT fields), not S3
- Licensing is per Instance (per endpoint deployment)

---

## 3.1 Two Independent Taxonomies [LIVE — v6.0]

**Source:** `AgentTaxonomy_v1.0_2026-02-11.MD`, Section 1
**Date:** February 11, 2026

The Shopnet network has two independent taxonomies. They never overlap.

| Taxonomy | UID Prefix | Issued by | DB | Purpose |
|---|---|---|---|---|
| **Site** | `sn_` | Connect Gateway | shopnet_sites | Infrastructure, websites, services, hosting |
| **Agent** | `sa_` | Connect Gateway | assist_shopnet | Agent platforms and licensed deployments |

A single endpoint (e.g., shopnet.domains) can have BOTH a `sn_` (the website) and one or more `sa_` (agents deployed there). They coexist independently.

**Rule:** Agents do NOT get site_uids. Sites do NOT get agent_uids. Each lives in its own taxonomy.

**v6.0 change:** The old two-level identity (site_uid + agent_uid required together) is replaced. Agent Engines get `sn_` UIDs (they are infrastructure). Agent Platforms and Instances get `sa_` UIDs only.

---

## 3.2 Agent Taxonomy Types [LIVE — v6.0]

**Source:** `AgentTaxonomy_v1.0_2026-02-11.MD`, Section 3
**Date:** February 11, 2026

Agents are registered via the **Add Agent** wizard. All registrations are Level 2 (L2) on the network.

| Type Code | Name | What it is | Example |
|---|---|---|---|
| **PL** | **Platform** | The agent concept — handler code, personality, prompts, branding | Domain Assist |
| **IN** | **Instance** | A licensed deployment of a platform to a specific endpoint | Domain Assist on shopnet.domains |

### Platform (PL)

Defines **WHAT** the agent is. One per agent concept.

- Handler code (e.g., `handlers/domain_assist.py`)
- Personality, system prompt, catchphrase
- Default model tier (haiku/sonnet/opus)
- Branding (icon, color, portraits)
- Task definitions and prompt library
- References which Agent Engine (`sn_` type A) hosts it

### Instance (IN)

Defines **WHERE** the agent is deployed. One per licensed endpoint.

- References the Platform (`sa_` type PL) it belongs to
- References the site (`sn_`) it's deployed on — or NULL if standalone (e.g., phone app)
- Each Instance is a **separate license**
- 20 sites x Domain Assist = 20 Instances = 20 licenses = 20 `sa_` UIDs

### Version

**Version is NOT a taxonomy type.** It is a database column on the Instance record — which version of the platform's configuration this Instance runs. Versions are also tracked on prompt records.

---

## 3.3 The Full Stack [v6.0]

**Source:** `AgentTaxonomy_v1.0_2026-02-11.MD`, Section 4

| Step | What | Taxonomy | Level | Type | Wizard | UID |
|---|---|---|---|---|---|---|
| EC2 server | The box | Site | L2 | I (Infrastructure) | **Add Endpoint** | `sn_xxxx` |
| Assist Engine app | Agent hosting service | Site | L2 | A (Agent Engine) | **Add Endpoint** | `sn_yyyy` |
| Domain Assist | Agent platform | Agent | L2 | PL (Platform) | **Add Agent** | `sa_xxxx` |
| DA on shopnet.domains | Licensed deployment | Agent | L2 | IN (Instance) | **Add Agent** | `sa_yyyy` |

Two wizards. Two taxonomies. Everything is L2.

---

## 3.4 Registration Process (THE LAW) [v6.0]

**Source:** `AgentTaxonomy_v1.0_2026-02-11.MD`, Section 6

### 3.4a. Registering an Agent Engine

**Prerequisite:** An Infrastructure server (`sn_` type I) must already exist.

1. **Add Endpoint** wizard → select type: **A (Agent Engine)**
2. Connect Gateway issues `sn_xxxxxxxxxxxx`
3. DB record created in `shopnet_sites`
4. S3 folder created: `s3://bucket/sn_xxxxxxxxxxxx/`

### 3.4b. Registering an Agent Platform

**Prerequisite:** An Agent Engine (`sn_` type A) must already exist.

1. **Add Agent** wizard → select type: **PL (Platform)**
2. Select which Agent Engine hosts it
3. Connect Gateway issues `sa_xxxxxxxxxxxx`
4. DB record created in `assist_shopnet.agents` with `agent_type = 'PL'`
5. S3 folder created: `s3://bucket/sa_xxxxxxxxxxxx/`
6. Populate platform fields: name, personality, model_tier, branding, handler reference

### 3.4c. Registering an Agent Instance

**Prerequisite:** The Agent Platform (`sa_` type PL) must already exist.

1. **Add Agent** wizard → select type: **IN (Instance)**
2. Select which Platform this is an instance of
3. Select which site (`sn_`) it's deployed to — or "standalone" for no site
4. Connect Gateway issues `sa_xxxxxxxxxxxx`
5. DB record created in `assist_shopnet.agents` with `agent_type = 'IN'`
6. S3 folder created: `s3://bucket/sa_xxxxxxxxxxxx/`
7. **This is a licensed deployment — one license per Instance**

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/agent-uid/create` | POST | Issue new SA-XXXXXXXX |
| `/api/v1/agent-uid/next` | GET | Preview next agent_uid |
| `/api/v1/agent-platforms` | GET | List registered platforms |
| `/api/v1/agents` | GET/POST | List/Create agents |
| `/api/v1/agents/{agent_uid}` | GET/PUT/DELETE | CRUD operations |
| `/api/v1/agents/by-platform/{site_uid}` | GET | Agents for a site_uid |

---

## 3.5 Agent Subtypes [LIVE — v6.0]

**Source:** `AgentTaxonomy_v1.0_2026-02-11.MD`, Section 7

**v6.0 change:** The old `agent_type` ENUM ('internal', 'client') is renamed to `agent_class` (with new option 'both'). The `agent_type` column now means PL or IN.

- `agent_type`: VARCHAR(2) — `'PL'` (Platform) or `'IN'` (Instance)
- `agent_class`: VARCHAR(10) — `'internal'` / `'client'` / `'both'`
- `agent_skill`: VARCHAR(50) — values: 'code', 'chat', 'content', 'data', 'documents', 'promotion'

---

## 3.6 Rules [LIVE — v6.0]

1. Agent Platforms reference an Agent Engine (`sn_` type A) — they do NOT get their own `sn_` UID
2. Agent Instances reference a Platform (`sa_` type PL) and optionally a deployment site (`sn_`)
3. Deleting an Instance does NOT delete the Platform
4. agent_uid is NEVER reused, even after deletion
5. All UIDs are generated ONLY by Connect Gateway

---

## 3.7 Registered Agent Platforms [LIVE — v6.0]

**Source:** `AgentTaxonomy_v1.0_2026-02-11.MD`, Section 12
**Date:** February 11, 2026

All 8 existing registrations are **Platforms (PL)**. No Instances exist yet — they'll be created when we deploy to specific endpoints.

| agent_uid | agent_id | Formal Name | Persona Name | Class | Skill | Status |
|-----------|----------|-------------|--------------|-------|-------|--------|
| SA-00000001 | product_assist | Product Assist | ProductBot | client | chat | live |
| SA-00000002 | domain_assist | Domain Assist | DomainBot | client | chat | wip |
| SA-00000003 | content_assist | Content Assist | ContentBot | both | content | wip |
| SA-00000004 | kpi_assist | KPI Assist | KPIBot | both | data | wip |
| SA-00000005 | site_assist | Site Assist | Claudius | internal | code | wip |
| SA-00000006 | cao_assist | CAO Assist | Claudelia | internal | documents | wip |
| SA-00000007 | cto_assist | CTO Assist | Claudnet | internal | code | wip |
| SA-00000008 | cio_assist | CIO Assist | Claudi | internal | data | future |

**Not yet registered (needs THE LAW):**
- `claudeax` → will become PL, "Taxonomy Assist" / "Claudeax", internal

**Merged:**
- `ai_assistant` → folded into `site_assist` (SA-00000005). Handler renamed from `ai_assistant.py` to `site_assist.py`.

**v6.0 changes:** Removed `site_uid` column (agents no longer require site_uids). Added `Persona Name` and `Class` columns. Content Assist and KPI Assist changed from `internal`/`client` to `both`.

Additional defined (not yet registered):

| agent_id | Agent Name | Class | Skill | Status |
|----------|------------|-------|-------|--------|
| gift_assist | Gift Assist | client | chat | future |
| customer_assist | Customer Assist | client | chat | future |
| security_assist | Security Assist | internal | code | future |
| marketing_assist | Marketing Assist | internal | promotion | future |
| fun_assist | Fun Assist | internal | content | future |

---

## 3.8 shopnet_assist Database Schema [LIVE — v6.0]

**Source:** `AgentTaxonomy_v1.0_2026-02-11.MD`, Section 7
**Source:** `DATABASE-DESIGN.md` (lines 710-723)

```
shopnet_assist (Instance 1: amazon-products-db)
├── agents                  Unified PL/IN records, agent_uid as PK, discriminated by agent_type
├── agent_tasks             Task definitions per Platform agent_uid
├── invocation_history      Full invocation log — per Instance agent_uid
├── agent_learnings         Behavioral learning — per Platform agent_uid
├── agent_memory            Factual memory — per Instance agent_uid
├── agent_permissions       Fine-grained access control — per Platform agent_uid
├── agent_rules             Self-policing rules (12 seed rules) — per Platform agent_uid
├── rule_violations         Rule violation log — per Instance agent_uid
├── prompt_library          Prompt records (TEXT fields, not S3) — NEW v6.0
└── prompt_assignments      Many-to-many: prompt_id ↔ agent_uid — NEW v6.0
```

**11 tables total (9 original + 2 new).** `prompt_templates` replaced by `prompt_library` + `prompt_assignments`.

### agents table — unified, discriminated by agent_type (v6.0)

**Shared fields (all records):**

| Field | Type | Purpose |
|---|---|---|
| agent_uid | VARCHAR(15) **PK** | `sa_xxxxxxxxxxxx` — issued by THE LAW |
| agent_type | VARCHAR(2) NOT NULL | `'PL'` (Platform) or `'IN'` (Instance) |
| agent_id | VARCHAR(50) UNIQUE | Slug for handler lookup — `"domain_assist"` |
| agent_name | VARCHAR(100) | Formal name — "Domain Assist" |
| status | VARCHAR(20) | `live` / `wip` / `disabled` / `archived` |
| created_at | TIMESTAMP | Registration date |
| updated_at | TIMESTAMP | Last modified |

**Platform-only fields (agent_type = 'PL'):**

| Field | Type | Purpose |
|---|---|---|
| engine_uid | VARCHAR(15) | FK → `sn_` of the Agent Engine that hosts this platform |
| agent_user_name | VARCHAR(50) | Persona name — "DomainBot", "Claudius", "Claudeax" |
| agent_class | VARCHAR(10) | `internal` / `client` / `both` |
| agent_skill | VARCHAR(50) | `chat` / `data` / `code` / `content` |
| personality | TEXT | Full personality definition |
| system_prompt | TEXT | Base system prompt |
| model_tier | VARCHAR(20) | Default model — `haiku` / `sonnet` / `opus` |
| max_tokens_output | INT | Default max tokens |
| agent_ui_icon | VARCHAR(10) | Emoji for cards/chat |
| agent_ui_color | VARCHAR(7) | Hex color for branding |
| portrait_url | VARCHAR(500) | S3 path to portrait image |
| icon_url | VARCHAR(500) | S3 path to icon |
| catchphrase | VARCHAR(200) | Persona catchphrase |

**Instance-only fields (agent_type = 'IN'):**

| Field | Type | Purpose |
|---|---|---|
| platform_uid | VARCHAR(15) | FK → `sa_` of the parent Platform |
| site_uid | VARCHAR(15) | FK → `sn_` of deployment site (NULL if standalone) |
| version | VARCHAR(20) | Which version of the platform config this instance runs |
| date_deployed | TIMESTAMP | When this instance went live |
| license_status | VARCHAR(20) | `active` / `suspended` / `trial` / `internal` |
| config_overrides | JSON | Endpoint-specific config (model tier override, custom settings) |
| daily_invocation_limit | INT | Rate limit for this specific instance |

### prompt_library table (v6.0)

Prompts are database records, NOT S3 documents. PostgreSQL TEXT fields handle long structured prompts with no size issues.

| Field | Type | Purpose |
|---|---|---|
| prompt_id | SERIAL **PK** | Auto-increment |
| prompt_name | VARCHAR(200) | Human label — "Domain suggestion system prompt" |
| use_case | VARCHAR(100) | Task identifier — `"suggest_domains"`, `"diagnose_error"` |
| method | VARCHAR(50) | Technique — `"system_prompt"`, `"few_shot"`, `"chain_of_thought"` |
| prompt_text | TEXT | **The actual prompt content** — full text, can be very long |
| version | INT | Version number within this prompt |
| is_active | BOOLEAN | Is this the current active version for this use_case? |
| author | VARCHAR(100) | Who wrote or last edited it |
| created_at | TIMESTAMP | When created |
| updated_at | TIMESTAMP | Last modified |

### prompt_assignments table (v6.0) — many-to-many

Links prompts to Platforms and/or Instances.

| Field | Type | Purpose |
|---|---|---|
| id | SERIAL **PK** | Auto-increment |
| prompt_id | INT | FK → `prompt_library.prompt_id` |
| agent_uid | VARCHAR(15) | FK → `agents.agent_uid` — can be Platform OR Instance |

**Inheritance rule:**
- Prompt assigned to a **Platform** → ALL Instances of that Platform inherit it
- Prompt assigned to a specific **Instance** → overrides the Platform default for that Instance only

**Runtime query — how the handler gets a prompt:**

```sql
SELECT pl.prompt_text
FROM prompt_library pl
JOIN prompt_assignments pa ON pl.prompt_id = pa.prompt_id
WHERE pl.use_case = 'suggest_domains'
  AND pl.is_active = TRUE
  AND pa.agent_uid IN (:instance_uid, :platform_uid)
ORDER BY CASE WHEN pa.agent_uid = :instance_uid THEN 0 ELSE 1 END
LIMIT 1;
```

### Existing tables — how they map (v6.0)

| Existing table | Links to | Change needed |
|---|---|---|
| `agent_tasks` | Platform agent_uid | Tasks are platform-level (shared across instances) |
| `invocation_history` | Instance agent_uid | Each invocation comes from a specific deployment |
| `agent_permissions` | Platform agent_uid | Permissions are platform-level |
| `agent_learnings` | Platform agent_uid | Learnings apply across all instances |
| `agent_memory` | Instance agent_uid | Conversation memory is per-deployment |
| `agent_rules` | Platform agent_uid | Rules are platform-level |
| `rule_violations` | Instance agent_uid | Violations happen at specific deployments |
| `prompt_templates` | **Replaced by** `prompt_library` + `prompt_assignments` | New architecture |

### S3 Storage (v6.0)

When ANY UID is issued (site or agent), an S3 folder is created keyed by that UID.

**Site:** `s3://bucket/sn_xxxxxxxxxxxx/` — site assets
**Agent:** `s3://bucket/sa_xxxxxxxxxxxx/` — agent assets (both Platform and Instance)

**Prompts are NOT in S3.** Prompt text lives in the database (`prompt_library` table). S3 is for binary assets only (images, icons, logos).

### Endpoint Registry (v6.0)

The Endpoint Registry in the Console shows BOTH taxonomies side by side. An endpoint can have a `sn_`, one or more `sa_`, or both.

| Endpoint | site_uid | agent_uid(s) | What's there |
|---|---|---|---|
| shopnet.domains | `sn_XXXX` (W) | `sa_YYYY` (IN) | Website + Domain Assist instance |
| Console test GUI | `sn_AAAA` (W) | `sa_BBBB` (IN), `sa_CCCC` (IN) | Website + 2 agent instances |
| Assist Engine | `sn_DDDD` (A) | — | Agent Engine only (no agent instances here) |
| Domain Assist | — | `sa_EEEE` (PL) | Platform definition (no site) |
| Phone app | — | `sa_FFFF` (IN) | Standalone agent instance (no website) |

### Relationships (v6.0)

```
sn_ type I  (Infrastructure — the box)
  └── hosts → sn_ type A  (Agent Engine — the hosting app)
                └── hosts → sa_ type PL  (Platform — the agent concept)
                              ├── has prompts → prompt_library (via prompt_assignments)
                              ├── has tasks → agent_tasks
                              └── has instances → sa_ type IN  (Instance — licensed deployment)
                                                    ├── deployed on → sn_ type W/L (website/lambda)
                                                    ├── may override → prompt_library (via prompt_assignments)
                                                    ├── logs to → invocation_history
                                                    └── license tracked here
```

### How Invocation Works at Runtime (v6.0)

1. Client request arrives at Agent Engine: `POST /invoke {"agent_id": "domain_assist", "instance_uid": "sa_YYYY"}`
2. `invoke.py` looks up handler by `agent_id` slug → routes to `handle_domain_assist()`
3. Handler queries `prompt_library` for active prompts assigned to this Platform (or Instance override)
4. Handler calls LLM via `provider.py` (Ollama or Bedrock)
5. Response logged to `invocation_history` with the Instance's `agent_uid`
6. Response returned to client

The `agent_id` slug is used for **code routing** (which handler to call). The `agent_uid` is used for **identity** (which specific deployment made the call, for logging, licensing, and metrics).

### agent_rules (12 seed rules)

| Rule Code | Category | Severity | Name |
|-----------|----------|----------|------|
| RULE-001 | security | critical | Never expose secrets |
| RULE-002 | security | critical | Read-only by default |
| RULE-003 | data | critical | Stay within data boundaries |
| RULE-004 | data | critical | Client data isolation |
| RULE-005 | cost | warning | Token budget awareness |
| RULE-006 | cost | warning | Minimize tool calls |
| RULE-007 | quality | warning | Structured output |
| RULE-008 | quality | warning | Cite your sources |
| RULE-009 | behavior | warning | Escalation protocol |
| RULE-010 | compliance | critical | Human approval for changes |
| RULE-011 | quality | warning | Declare uncertainty |
| RULE-012 | compliance | critical | THE LAW compliance |

---

## 3.9 Prompt Assembly Pipeline [DESIGNED]

**Source:** `DATABASE-DESIGN.md`, Section 8 (lines 547-631)

10-step pipeline:
1. LOAD AGENT from agents table
2. LOAD TASK from agent_tasks table
3. LOAD PROMPT TEMPLATE from prompt_templates table
4. INJECT RULES from agent_rules table
5. INJECT MEMORY from agent_memory table (top 20 by priority)
6. INJECT LEARNINGS from agent_learnings table (top 10 by confidence > 0.30)
7. INJECT HISTORY from invocation_history (last N runs with outcomes)
8. INJECT CONTEXT (live data from the request)
9. ASSEMBLE FINAL PROMPT
10. TOKEN CHECK (trim history/memory/learnings if over budget)

---

## 3.10 Self-Policing Mechanism [DESIGNED]

**Source:** `DATABASE-DESIGN.md`, Section 9 (lines 635-706)

```
Gateway enforces:
  PRE-FLIGHT:   Permissions valid? Rate limit? Circuit closed? Budget?
  RULES INJECT: Rules injected into prompt (agent sees them, self-polices)
  POST-FLIGHT:  Output contains secrets? Write without approval? Cross-site data?
  VIOLATION:    Log to rule_violations, notify operator, block if critical
```

---
---

# PART IV — USER UID TAXONOMY (su_ / SU-)

**Source:** Document 46: Future Deathstar v2.0 — `/shopnet-deathstar/46-FUTURE-DEATHSTAR.md`
**Source:** `002_shopnet_crm.sql` — `/connect.shopnet/backend/sql/002_shopnet_crm.sql` (Feb 6, 2026)
**Source:** `crm.py` — `/connect.shopnet/backend/snd/crm.py` (Feb 6, 2026)
**Date:** February 6, 2026
**Authority:** TJL
**Implementation Status:** [DESIGNED] — SQL ready (`002_shopnet_crm.sql`), Python CRUD ready (`crm.py`), tables not yet created on RDS Instance 2

**Note:** shopnet_crm has NO `taxonomy_definition` equivalent table. Valid values for auth_provider, status, role, scope are hardcoded as column defaults or completely unconstrained. See TODO S15 for future work.

---

## 4.1 user_uid Format [DESIGNED]

| Attribute | Value |
|-----------|-------|
| **Prefix** | `su_` |
| **v1 Format** | `SU-XXXXXXXX` |
| **v2 Format** | `su_xxxxxxxxxxxx` |
| **Target Database** | `shopnet_crm` (Instance 2) |
| **Mutable** | NO — NEVER CHANGES |
| **Assigned By** | Connect Gateway ONLY — via `crm.py` `register_user()` → `uid_registry.create_uid(uid_type="su")` |

---

## 4.2 User Subtypes (Level 3) [DESIGNED]

**Source:** Document 46, Section 18 (lines 1161-1176)
**Decision:** One prefix, type field (not separate prefixes per user type)

| Type Code | Name | Description |
|-----------|------|-------------|
| `I` | Individual | Natural person |
| `C` | Company | Legal person, registered business |
| `G` | Group | Informal collection — soccer team, family, club |

### Future Type Values

```
Current types:   I=Individual, C=Company, G=Group
Future types:    I=Individual, C=Company, G=Group, A=AI Entity, K=K-9
```

---

## 4.3 The First Law — User Authority Over Agents [DESIGNED]

Implemented via `user_delegations` table: user_uid ↔ agent_uid junction with scope (read/write/purchase) and revocable access.

**Python implementation:** `crm.py` — `delegate_to_agent()`, `revoke_delegation()`, `get_user_delegations()`

---

## 4.4 Authentication Strategy [FUTURE]

**Phase 1 (near-term):** OAuth 2.0 proxy with Google as first provider. Add Apple, Microsoft later.
**Phase 2 (far-future):** Blockchain-based `.uid` identity.

---

## 4.5 shopnet_crm Database Schema [DESIGNED]

**Source:** `002_shopnet_crm.sql` — `/connect.shopnet/backend/sql/002_shopnet_crm.sql`
**Python CRUD:** `/connect.shopnet/backend/snd/crm.py`
**Date:** February 6, 2026
**Status:** SQL ready, Python CRUD ready. Tables NOT yet created on RDS Instance 2 (see TODO S10).

```
shopnet_crm (Instance 2: shopnet-crm-registry)
├── user_taxonomy              su_ UIDs, email, display_name, auth_provider, status
├── user_site_registrations    su_ ↔ sn_ junction (which user on which site, role)
├── user_delegations           su_ ↔ sa_ junction (First Law implementation)
├── org_memberships            org_name ↔ su_ junction
├── user_profiles              Extended profile data (GDPR isolation)
├── user_wallets               Web3 wallet addresses
└── user_oauth                 OAuth provider tokens
```

**7 tables total.**

---
---

# PART V — LIST UID TAXONOMY (sl_ / SL-)

**Source:** Document 46: Future Deathstar v2.0
**Source:** `003_shopnet_registry.sql` — `/connect.shopnet/backend/sql/003_shopnet_registry.sql` (Feb 6, 2026)
**Source:** `registry.py` — `/connect.shopnet/backend/snd/registry.py` (Feb 6, 2026)
**Date:** February 6, 2026
**Authority:** TJL
**Implementation Status:** [DESIGNED] — SQL ready (`003_shopnet_registry.sql`), Python CRUD ready (`registry.py`), tables not yet created on RDS Instance 2

**Note:** shopnet_registry has NO `taxonomy_definition` equivalent table. list_type and status values are unconstrained. See TODO S17 for future work.

---

## 5.1 list_uid Format [DESIGNED]

| Attribute | Value |
|-----------|-------|
| **Prefix** | `sl_` |
| **v2 Format** | `sl_xxxxxxxxxxxx` |
| **Target Database** | `shopnet_registry` (Instance 2) |
| **Assigned By** | Connect Gateway ONLY — via `registry.py` `create_list()` → `uid_registry.create_uid(uid_type="sl")` |
| **Requires** | user_uid owner (lists are owned by users) |

---

## 5.2 List Types [DESIGNED]

**Source:** `003_shopnet_registry.sql` line 16 — `list_type VARCHAR(50) DEFAULT 'wishlist'`

| list_type | Name | Description |
|-----------|------|-------------|
| `wishlist` | Wishlist | Amazon/product wishlists (default) |
| `registry` | Gift Registry | Gift registries (birthday, wedding, baby shower) |
| `cart` | Cart | Shopping cart |
| `collection` | Collection | Curated collection |

---

## 5.3 The Pointer Pattern [DESIGNED]

**Implementation:** `registry.py` — `add_item(list_uid, item_type, external_ref, ref_system, ...)`

- `external_ref`: ASIN, ISBN, domain name, or free text
- `ref_system`: amazon_asin, isbn, shopnet_tld, custom
- ON CONFLICT: increments quantity instead of duplicating

---

## 5.4 Sharing Model [DESIGNED]

**Implementation:** `registry.py` — `create_share_token()`, `resolve_share_token()`

- Cryptographic random tokens (`secrets.token_urlsafe(32)`)
- Permissions: view, comment, contribute
- Expiry: optional timestamp
- Max uses: optional limit
- Use count: incremented on each resolution

---

## 5.5 shopnet_registry Database Schema [DESIGNED]

**Source:** `003_shopnet_registry.sql`
**Python CRUD:** `registry.py`
**Status:** SQL ready, Python CRUD ready. Tables NOT yet created on RDS Instance 2 (see TODO S11).

```
shopnet_registry (Instance 2: shopnet-crm-registry)
├── list_taxonomy              sl_ UIDs, owner su_ ref, list_type, status
├── list_items                 Pointer pattern: external_ref + ref_system
└── sharing_tokens             Anonymous access tokens
```

**3 tables total.**

---
---

# PART VI — PAYMENT UID TAXONOMY (sp_ / SP-)

**Source:** Document 46: Future Deathstar v2.0
**Date:** February 6, 2026
**Authority:** TJL
**Implementation Status:** [FUTURE] — no schema, no code, no RDS instance

---

## 6.1 payment_uid Format [FUTURE]

| Attribute | Value |
|-----------|-------|
| **Prefix** | `sp_` |
| **v2 Format** | `sp_xxxxxxxxxxxx` |
| **Target Database** | `shopnet_payments` (FUTURE — separate RDS instance required) |
| **Append-Only** | Transaction records are NEVER deleted |

---

## 6.2 Payment Subtypes [FUTURE]

| Type Code | Name | Description |
|-----------|------|-------------|
| `WT` | Wallet Transfer | Wallet-to-wallet crypto transfer |
| `SB` | Subscription | Recurring payment |
| `RF` | Refund | Refund transaction |

---

## 6.3 DomainPay Concept [FUTURE]

Payment service using Web3 domain wallet-to-wallet transfers via Freename domains. "pay tim.uid" resolves to a wallet address. Shopnet never touches funds — resolver and facilitator only.

### TLD Ownership (Freename)

| TLD | Purpose |
|-----|---------|
| `.uid` | Identity namespace |
| `.pmt` | Payment namespace |
| `.domainpay` | Payment branding |

---

## 6.4 Honest Concerns [FUTURE]

1. **Regulatory minefield** — MSB (US), MiCA (EU), FCA (UK) registration may be required
2. **Freename dependency** — entire concept rests on a startup's infrastructure
3. **Adoption barrier** — both parties need crypto wallets
4. **Irreversibility** — blockchain transactions cannot be reversed

---

## 6.5 Recommended Phasing [FUTURE]

| Phase | Scope | Legal Risk |
|-------|-------|------------|
| **Phase 1** | Domain resolution only — map .uid/.pmt to wallet addresses | Cleanest |
| **Phase 2** | Add "pay" button — wallet-to-wallet, Shopnet never touches funds | Moderate |
| **Phase 3** | Proprietary .uid identity with recovery mechanisms | Highest |

---

## 6.6 shopnet_payments Database Schema [FUTURE]

```
shopnet_payments (FUTURE Instance 3 — MUST be separate)
├── payment_taxonomy           sp_ UIDs, type, payer/payee su_ refs
├── transaction_log            Timestamps, amounts, wallet addresses
├── wallet_mappings            Domain → wallet address resolution cache
└── compliance_records         KYC data (Phase 3+)
```

**4 tables conceptual.** MUST be separate RDS instance for compliance.

---
---

# PART VII — CODE SOURCES OF TRUTH (Cross-Reference)

**Source:** Code exploration of all HMCG repos — Claude Code, February 7, 2026
**Purpose:** This section cross-references every code file that defines taxonomy values against the canonical taxonomy. It IS the verification.

---

## 7.1 Complete File Inventory

| # | File | Repo | What It Defines | Current Version | Status |
|---|------|------|----------------|----------------|--------|
| 1 | `update-taxonomy-v3.5.sql` | shopnet.network-console | taxonomy_definition seed data, dynamic trigger | v3.5.1 (Feb 7) | **CURRENT** — highest authority |
| 2 | `console.js` PLATFORM_OPTIONS | shopnet.network-console | Wizard dropdown options, pulse methods | v3.5.1 (Feb 7) | **CURRENT** — dynamic via API |
| 3 | `app.py` Flask route | shopnet.network-console | `/api/brochure/taxonomy-definitions/platform-options` | Feb 7 | **CURRENT** — serves taxonomy_definition |
| 4 | `uid_generator.py` | connect.shopnet | PREFIX_ROUTES, v1/v2 patterns, UID generation | Feb 6 | **CURRENT** |
| 5 | `uid_registry.py` | connect.shopnet | UID CRUD, issuance logging | Feb 6 | **CURRENT** |
| 6 | `snd_monitor.py` | connect.shopnet | 4 validation checks | Feb 6 | **CURRENT** |
| 7 | `crm.py` | connect.shopnet | User CRM operations | Feb 6 | **CURRENT** |
| 8 | `registry.py` | connect.shopnet | List/registry operations | Feb 6 | **CURRENT** |
| 9 | `001_uid_registry.sql` | connect.shopnet | uid_registry + issuance_log schema | Feb 6 | **CURRENT** |
| 10 | `002_shopnet_crm.sql` | connect.shopnet | CRM schema (7 tables) | Feb 6 | **CURRENT** |
| 11 | `003_shopnet_registry.sql` | connect.shopnet | Registry schema (3 tables) | Feb 6 | **CURRENT** |
| 12 | `DATABASE-DESIGN.md` | assist.shopnet | Agent schema (9 tables — partially superseded by AgentTaxonomy v1.0) | Feb 5-6 | **SUPERSEDED** (schema) |
| 12a | `AgentTaxonomy_v1.0_2026-02-11.MD` | taxonomy.shopnet | Agent PL/IN taxonomy, prompt_library, registration process | Feb 11 | **CURRENT** — v6.0 |
| 13 | `platform-types.js` | connect.shopnet/client-module | Client-side taxonomy constants | v3.1 (Jan 25) | **OUTDATED** — see S1 |
| 14 | `platform-types.js` | search.shopnet-module | Client-side taxonomy constants (copy) | v3.1 (Jan 25) | **OUTDATED** — see S2 |
| 15 | `schema_the_law.sql` | shopnet.network-console/radius | Radius schema + old hardcoded trigger | v3.1 (Jan 25) | **OUTDATED** — see S3 |
| 16 | `seed_the_law.py` | shopnet.network-console/radius | Radius seeder with old type mappings | v3.1 (Jan 25) | **OUTDATED** — see S4 |

---

## 7.2 Authority Chain

```
TAXONOMY AUTHORITY CHAIN (highest to lowest):

1. taxonomy_definition TABLE on production RDS     [79 rows live, 35 platform_types]
   └── The database IS the truth

2. validate_platform_type() TRIGGER on RDS          [dynamic, reads from #1]
   └── Enforces #1 on every INSERT/UPDATE

3. Flask API: /api/brochure/taxonomy-definitions/   [reads from #1]
   └── Serves #1 to the console wizard

4. console.js PLATFORM_OPTIONS                      [fetched from #3 at runtime]
   └── Fallback hardcoded values if #3 unreachable

5. Everything else                                  [must conform to #1]
   └── platform-types.js, schema_the_law.sql, seed_the_law.py, governance docs
```

---

## 7.3 Discrepancy Matrix

Files #13-16 are on v3.1 (Jan 25) and have the following discrepancies vs the canonical v3.5.1 taxonomy:

| Value | Canonical (v3.5.1) | platform-types.js (v3.1) | schema_the_law.sql (v3.1) | seed_the_law.py (v3.1) |
|-------|-------------------|-------------------------|--------------------------|----------------------|
| endpoint_type | W, A, D, N, I, O | W, A, D, **ND** | W, A, D, **ND** | **ND** default |
| Custom Agent | **CA** | **CU** | — | — |
| Website types | 9 (CO,CP,WP,SH,WW,CL,S3,LM,L3) | 5 (CO,CP,WP,WW,SH) | 5 (CO,CP,WP,WW,SH) | — |
| Agent types | 5 (CL,GP,GM,CA,OT) | 5 (CL,GP,GM,**CU**,OT) | 5 (CL,GP,GM,**CU**,OT) | — |
| Database types | 5 (RD,DY,S3,GIT,TPD) | 2 (S3,RD) | 2 (S3,RD) | — |
| Node types | 6 (W3G,API,RDH,W3S,LLM,OTH) | 5 (**R53,FN,LM,CF,OT**) | 5 (**R53,FN,LM,CF,OT**) | **FN** used |
| Infra types | 9 (S3B,LMB,SQS,SNS,LS,EC2,RDS,CF,AGW) | N/A (no I type) | N/A (no I type) | — |
| managed_by | L, R, M, **E** | L, R, M | L, R, M | — |
| site_uid size | VARCHAR(15) | — | **VARCHAR(12)** | — |

---

## 7.4 Connect Gateway API Surface [LIVE]

**Source:** `/connect.shopnet/backend/shopnet_connect_api.py` — FastAPI application (5,715 lines)
**Date:** February 6-7, 2026

### v1 Routes (Legacy — site/agent UID issuance via sequential counters)

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/v1/site-uid/create` | POST | Issue new SN-XXXXXXXX |
| `/api/v1/site-uid/next` | GET | Preview next site_uid |
| `/api/v1/site-uid/{domain}` | GET | Look up site_uid by domain |
| `/api/v1/site-uid/verify` | POST | Verify a site_uid |
| `/api/v1/agent-uid/create` | POST | Issue new SA-XXXXXXXX |
| `/api/v1/agent-uid/next` | GET | Preview next agent_uid |
| `/api/v1/agent-platforms` | GET | List registered agent platforms |
| `/api/v1/agents` | GET/POST | List/Create agents |
| `/api/v1/agents/{agent_uid}` | GET/PUT/DELETE | Agent CRUD |
| `/api/v1/agents/by-platform/{site_uid}` | GET | Agents for a site |

### v2 Routes (SND — UID issuance via uid_generator v2 + uid_registry)

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/v2/uid/create` | POST | Issue any v2 UID (sn_, sa_, su_, sl_, sp_) |
| `/api/v2/uid/resolve/{uid}` | GET | Resolve a UID to its registry entry |
| `/api/v2/uid/validate/{uid}` | GET | Validate UID format (v1 or v2) |
| `/api/v2/uid/list` | GET | List UIDs from registry (filtered) |
| `/api/v2/uid/stats` | GET | UID registry statistics |

### SND Monitor Routes

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/v2/snd/monitor` | GET | Run all 4 validation checks |
| `/api/v2/snd/monitor/{check_name}` | GET | Run a specific check |
| `/api/v2/snd/status` | GET | Quick namespace health status |

### CRM Routes (su_ — shopnet_crm)

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/v2/crm/users` | POST | Register new user (issues su_ UID) |
| `/api/v2/crm/users/{user_uid}` | GET | Look up user by UID |
| `/api/v2/crm/users/by-email/{email}` | GET | Look up user by email |
| `/api/v2/crm/registrations` | POST | Register user to site (su_ ↔ sn_ link) |
| `/api/v2/crm/users/{user_uid}/sites` | GET | Get user's registered sites |
| `/api/v2/crm/delegations` | POST | Grant agent delegation (First Law) |
| `/api/v2/crm/delegations` | DELETE | Revoke agent delegation |
| `/api/v2/crm/users/{user_uid}/delegations` | GET | Get user's active delegations |

### Registry Routes (sl_ — shopnet_registry)

| Route | Method | Purpose |
|-------|--------|---------|
| `/api/v2/registry/lists` | POST | Create new list (issues sl_ UID) |
| `/api/v2/registry/lists/{list_uid}` | GET | Get list by UID |
| `/api/v2/registry/users/{owner_uid}/lists` | GET | Get user's lists |
| `/api/v2/registry/items` | POST | Add item to list (Pointer Pattern) |
| `/api/v2/registry/lists/{list_uid}/items` | GET | Get items in list |
| `/api/v2/registry/items/{item_id}/purchased` | PUT | Mark item purchased |
| `/api/v2/registry/share` | POST | Create share token |
| `/api/v2/registry/share/{token}` | GET | Resolve share token |

---
---

# PART VIII — IMPLEMENTATION STATUS

**Source:** Code exploration — Claude Code, February 7, 2026

## 8.1 What's LIVE in Production

| Component | Database | Tables | Code | Notes |
|-----------|----------|--------|------|-------|
| **Site taxonomy** | shopnet_sites | endpoint_taxonomy, website_data, taxonomy_definition | app.py, console.js | Dynamic validation since Feb 7 |
| **UID Registry** | shopnet_connect | uid_registry, uid_issuance_log | uid_generator.py, uid_registry.py | Sole issuer, audit trail |
| **Agent registry** | shopnet_assist | agents (+ 10 more tables, incl. prompt_library, prompt_assignments) | Assist Engine (13.219.217.59) | v6.0: PL/IN taxonomy, backend engine LIVE |
| **SND Monitor** | Reads from all | — | snd_monitor.py | 4 checks: uniqueness, consistency, immutability, audit |
| **Console wizard** | — | — | console.js loadPlatformOptions() | Dynamic from taxonomy_definition API |

## 8.2 What's DESIGNED but Not Implemented

| Component | SQL File | Python Code | What's Missing |
|-----------|----------|-------------|---------------|
| **shopnet_crm** | `002_shopnet_crm.sql` (7 tables) | `crm.py` (full CRUD) | Tables not created on RDS Instance 2 (S10) |
| **shopnet_registry** | `003_shopnet_registry.sql` (3 tables) | `registry.py` (full CRUD) | Tables not created on RDS Instance 2 (S11) |
| **Agent backend** | `DATABASE-DESIGN.md` (9→11 tables) + `AgentTaxonomy_v1.0` | Assist Engine (FastAPI) | v6.0: Backend engine LIVE. PL/IN taxonomy, prompt_library, prompt_assignments. Prompt pipeline partially coded. |

## 8.3 What's FUTURE / Planned

| Component | Status | What Exists |
|-----------|--------|-------------|
| **shopnet_payments** | No schema | PREFIX_ROUTES entry in uid_generator.py only (S13) |
| **taxonomy_definition for CRM** | Not designed | No equivalent lookup table (S15) |
| **taxonomy_definition for assist** | v6.0: Agent_uid Taxonomy table created | PL/IN type system + prompt_library (S16 — partially resolved) |
| **taxonomy_definition for registry** | Not designed | No equivalent lookup table (S17) |
| **assist.shopnet backend** | v6.0: LIVE on 13.219.217.59 | Assist Engine running, handlers for product_assist + domain_assist coded, AgentTaxonomy v1.0 defines PL/IN (S14 — in progress) |

## 8.4 Known Discrepancies Between Code and Governance

| Discrepancy | Files Affected | Priority | TODO |
|-------------|---------------|----------|------|
| platform-types.js still on v3.1 | 2 files (connect.shopnet + search.shopnet) | CRITICAL | S1, S2 |
| schema_the_law.sql still on v3.1 | 1 file (would re-break prod if re-run) | CRITICAL | S3 |
| seed_the_law.py still on v3.1 | 1 file | HIGH | S4 |
| Console GUI "This Is The Law" panel incomplete | index.html | HIGH | S6 |
| Existing ND records need migration | RDS endpoint_taxonomy | HIGH | S9 |
| Governance docs (26, Master, LITE) still have ND | 3 documents | HIGH | D1-D3 |

---
---

# OLD VERSION ARCHIVE — DISREGARD

**These values are NO LONGER CORRECT. They are preserved here for historical reference only.**
**The canonical values are in Parts I-VI above.**

---

## v3.1 Values (Jan 25, 2026) — SUPERSEDED

**Source:** `schema_the_law.sql`, `platform-types.js` — both v3.1

### endpoint_type (v3.1 — WRONG)
```
CHECK (endpoint_type IN ('W', 'A', 'D', 'ND'))   ← WRONG: should be W, A, D, N, I, O
```

### platform-types.js (v3.1 — WRONG)
```javascript
// ENDPOINT_TYPES — WRONG (only 4 types, uses ND)
const ENDPOINT_TYPES = {
    'W': 'Website', 'A': 'Agent', 'D': 'Database', 'ND': 'Node'   // v6.0: 'A' relabeled to 'Agent Engine'
};

// WEBSITE_PLATFORMS — WRONG (missing CL, S3, LM, L3)
const WEBSITE_PLATFORMS = { CO, CP, WP, WW, SH };    // should have 9, has 5

// AGENT_PLATFORMS — WRONG (uses CU instead of CA)
const AGENT_PLATFORMS = { CL, GP, GM, CU, OT };       // CU should be CA (count is correct at 5, code is wrong)

// DATABASE_PLATFORMS — WRONG (missing DY, GIT, TPD)
const DATABASE_PLATFORMS = { S3, RD };                 // should have 5, has 2

// NODE_PLATFORMS — WRONG (completely wrong codes)
const NODE_PLATFORMS = { R53, FN, LM, CF, OT };       // should be W3G, API, RDH, W3S, LLM, OTH

// MANAGED_BY — WRONG (missing E)
const MANAGED_BY = { L, R, M };                        // should have L, R, M, E
```

### seed_the_law.py (v3.1 — WRONG)
```
DEFAULT_TYPE = ("ND", "OT")           ← WRONG: ND is legacy
SECTION_MAPPINGS uses FN, R53, CF     ← WRONG: not in current taxonomy
```

### Superseded Platform Type Codes

| Old Code | Old Name | Replaced By | New Code |
|----------|----------|-------------|----------|
| `ND` | Non-Domain | Split into 3 types | `N`, `I`, `O` |
| `CU` | Custom (Agent) | Renamed | `CA` |
| `W3` | Web3 Domain (Website) | Renamed | `L3` |
| `R53` | Route53 (Node) | Removed | Use `I` infrastructure types |
| `FN` | Freename (Node) | Removed | Use `W3G` or `W3S` |
| `LM` | Lambda (Node) | Removed | Use `LMB` (Infrastructure) |
| `CF` | CloudFront (Node) | Removed | Use `CF` (Infrastructure) |

### v3.5 I (Infrastructure) Types (Feb 4 — SUPERSEDED by v3.5.1)

The original Feb 4 implementation had only 4 Infrastructure types:
```
S3B, LMB, SQS, SNS   ← Feb 4 (v3.5)
```

This was expanded to 9 on Feb 7 (v3.5.1):
```
S3B, LMB, SQS, SNS, LS, EC2, RDS, CF, AGW   ← Feb 7 (v3.5.1)
```

---
---

# APPENDIX A — Full endpoint_taxonomy CREATE TABLE

**Source:** `shopnet_sites` RDS database (as deployed)
**Date:** February 7, 2026

```sql
CREATE TABLE endpoint_taxonomy (
    site_uid         VARCHAR(15)   PRIMARY KEY,
    domain_name      VARCHAR(255)  NOT NULL UNIQUE,
    endpoint_type    CHAR(2)       NOT NULL,
    platform_type    VARCHAR(3)    NOT NULL,
    web_protocol     CHAR(2)       NOT NULL DEFAULT 'W2',
    status           VARCHAR(10)   NOT NULL DEFAULT 'planned',
    runtime          VARCHAR(20),
    host             VARCHAR(20),
    managed_by       CHAR(1),
    persistence      CHAR(1),
    website_purpose  VARCHAR(20),
    store_checkout   CHAR(1),
    agent_type       VARCHAR(20),
    console_section  VARCHAR(50),
    card_label       VARCHAR(255),
    show_on_map      BOOLEAN       DEFAULT TRUE,
    created_at       TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMP     NOT NULL DEFAULT NOW(),
    notes            TEXT,
    created_by       VARCHAR(100)  DEFAULT 'system',
    deleted_at       TIMESTAMP,
    CONSTRAINT chk_endpoint_type CHECK (endpoint_type IN ('W','A','D','N','I','O','ND')),
    CONSTRAINT chk_managed_by CHECK (managed_by IS NULL OR managed_by IN ('L','R','M','E'))
);
```

---

# APPENDIX B — Full taxonomy_definition Seed Data

**Source:** `update-taxonomy-v3.5.sql` + production RDS (Feb 7, 2026)
**Total rows on production:** 79 (35 platform_types + 44 other taxonomy values)
**Note:** 7 agent_type rows were removed from the SQL file on Feb 8, 2026 (S20) — codes didn't match actual values. 1 inactive website_purpose row ('gateway') remains in SQL as documentation but is not deployed. SQL file now defines 80 rows (79 active + 1 inactive).

### endpoint_type (6 rows)

| code | name | active |
|------|------|--------|
| W | Website | TRUE |
| A | Agent Engine (v6.0: relabeled from "Agent") | TRUE |
| D | Database | TRUE |
| N | Node | TRUE |
| I | Infrastructure | TRUE |
| O | Other | TRUE |

**Note:** ND (Non-Domain) was intentionally excluded. Not in SQL file. Not on production. Dynamic trigger rejects ND.

### platform_type — W (9 rows)

| code | name | description |
|------|------|-------------|
| CO | CloudFront On-Demand | Lambda-backed, scales to zero |
| CP | CloudFront Persistent | nginx on EC2, always running |
| WP | WordPress | PHP on EC2 with WordPress |
| SH | Shopify | External Shopify store |
| WW | WooCommerce | WordPress with WooCommerce |
| CL | Custom Lambda | Custom Lambda function |
| S3 | S3 Static | Static files on S3 |
| LM | Lightsail | Amazon Lightsail instance |
| L3 | Layer3 Web3 | Lambda@Edge with IP certs for emoji TLDs |

### platform_type — A (Agent Engine) (5 rows)

| code | name | description |
|------|------|-------------|
| CL | Claude Engine | Anthropic Claude-based agent engine (v6.0: relabeled) |
| GP | GPT Engine | OpenAI GPT-based agent engine (v6.0: relabeled) |
| GM | Gemini Engine | Google Gemini-based agent engine (v6.0: relabeled) |
| CA | Custom Engine | Custom agent engine implementation (v6.0: relabeled) |
| OT | Other Engine | Other agent engine (v6.0: relabeled) |

### platform_type — D (5 rows)

| code | name | description |
|------|------|-------------|
| RD | RDS PostgreSQL | Amazon RDS PostgreSQL |
| DY | DynamoDB | Amazon DynamoDB |
| S3 | S3 Data Lake | S3 as data store |
| GIT | GitHub Repository | GitHub code repository |
| TPD | Third Party DB API | External database API |

### platform_type — N (6 rows)

| code | name | description |
|------|------|-------------|
| W3G | Web3 Gateway | Web3 domain resolution gateway |
| API | API Hub | API service endpoint |
| RDH | Redirect Hub | URL redirect service |
| W3S | Web3 DAAS | Web3 decentralized service |
| LLM | LLM Service | Large language model service |
| OTH | Other Node | Other network node |

### platform_type — I (9 rows)

| code | name | description |
|------|------|-------------|
| S3B | S3 Bucket | S3 storage bucket |
| LMB | Lambda Function | Standalone Lambda |
| SQS | SQS Queue | Message queue |
| SNS | SNS Topic | Notification topic |
| LS | Lightsail Instance | Amazon Lightsail virtual server |
| EC2 | EC2 Instance | Amazon EC2 instance |
| RDS | RDS Instance | Amazon RDS database instance |
| CF | CloudFront Distribution | Amazon CloudFront CDN distribution |
| AGW | API Gateway | AWS API Gateway |

### platform_type — O (1 row)

| code | name | description |
|------|------|-------------|
| OTH | Other | Uncategorized endpoint |

### website_purpose (7 rows, 1 inactive)

| code | name | active |
|------|------|--------|
| brochure | Brochure Site | TRUE |
| product_store | Product Store | TRUE |
| domain_store | Domain Store | TRUE |
| portal | Portal | TRUE |
| console | Console | TRUE |
| other | Other | TRUE |
| gateway | Web3 Gateway (LEGACY) | FALSE |

### managed_by (4 rows)

| code | name |
|------|------|
| L | Lambda |
| R | Radius |
| M | Manual |
| E | External |

### persistence (2 rows)

| code | name |
|------|------|
| P | Persistent |
| D | On-Demand |

### status (3 rows)

| code | name |
|------|------|
| planned | Planned |
| wip | Work in Progress |
| live | Live |

### web_protocol (2 rows)

| code | name |
|------|------|
| W2 | Web2 |
| W3 | Web3 |

### console_section (10 rows)

| code | name |
|------|------|
| brochure | Brochure Sites |
| products | Product Stores |
| domains | Domain Stores |
| data.shopnet | Data Layer |
| assist.shopnet | AI Agents |
| network-nodes | Network Nodes |
| web3-gateways | Web3 Gateways |
| infrastructure | Infrastructure |
| shopnet.network | Core Platform |
| connect.shopnet | Connect Services |

### runtime (6 rows)

| code | name |
|------|------|
| nginx | nginx |
| lambda | Lambda |
| php | PHP |
| node | Node.js |
| python | Python |
| external | External |

### host (5 rows)

| code | name |
|------|------|
| ec2 | EC2 |
| api_gateway | API Gateway |
| s3 | S3 |
| cloudfront | CloudFront |
| external | External |

### agent_type — REMOVED from taxonomy_definition (Feb 8, 2026, S20)

7 rows (domain, product, content, kpi, site, choice, custom) were in the SQL file but never deployed. Codes didn't match actual `endpoint_taxonomy.agent_type` values (`product_assist`, `domain_assist`, `status_agent`). Removed from `update-taxonomy-v3.5.sql`. See Section 2.6 for the real agent_type documentation.

---

# APPENDIX C — validate_platform_type() Dynamic Trigger (v3.5.1)

**Source:** `update-taxonomy-v3.5.sql` (lines 258-299) — deployed to production Feb 7, 2026
**This is the LIVE trigger on production RDS.**

```sql
CREATE OR REPLACE FUNCTION validate_platform_type()
RETURNS trigger LANGUAGE plpgsql AS $function$
DECLARE
    valid_count INTEGER;
    valid_codes TEXT;
BEGIN
    -- Dynamic validation against taxonomy_definition (THE LAW source of truth)
    SELECT COUNT(*) INTO valid_count
    FROM taxonomy_definition
    WHERE level = 'platform_type'
      AND parent_code = NEW.endpoint_type
      AND code = NEW.platform_type
      AND active = TRUE;

    IF valid_count = 0 THEN
        SELECT string_agg(code, ', ' ORDER BY code) INTO valid_codes
        FROM taxonomy_definition
        WHERE level = 'platform_type'
          AND parent_code = NEW.endpoint_type
          AND active = TRUE;

        -- SAFETY NET: If taxonomy_definition is empty/corrupt, allow operation
        IF valid_codes IS NULL THEN
            RAISE WARNING 'taxonomy_definition has no platform_types for endpoint_type %.
                Allowing as safety fallback.', NEW.endpoint_type;
            RETURN NEW;
        END IF;

        RAISE EXCEPTION 'Invalid platform_type % for endpoint_type %. Valid: %',
            NEW.platform_type, NEW.endpoint_type, valid_codes;
    END IF;

    RETURN NEW;
END;
$function$;

CREATE TRIGGER trg_validate_platform_type
    BEFORE INSERT OR UPDATE ON endpoint_taxonomy
    FOR EACH ROW EXECUTE FUNCTION validate_platform_type();
```

---

# APPENDIX D — UID Generator Code

**Source:** `/connect.shopnet/backend/snd/uid_generator.py`
**Date:** February 6, 2026

```python
"""
SND UID v2 Generator.

Format: {prefix}_{base36_timestamp}{base36_random}
  - Prefix: variable length (sn, sa, su, sl, sp)
  - Separator: underscore
  - Timestamp: 7 chars base36 (seconds since epoch, ~2,484 years)
  - Random: 5 chars base36 (60.5M possibilities per second)

Total capacity per prefix: 4.7 quintillion UIDs.
"""
import time
import secrets
import re

BASE36 = "0123456789abcdefghijklmnopqrstuvwxyz"

PREFIX_ROUTES = {
    "sn": "shopnet_sites",
    "sa": "shopnet_assist",
    "su": "shopnet_crm",
    "sl": "shopnet_registry",
    "sp": "shopnet_payments",
}

V1_PATTERN = re.compile(r"^S[A-Z]-\d{8}$")
V2_PATTERN = re.compile(r"^[a-z]{2}_[0-9a-z]{12}$")


def _to_base36(number: int, length: int) -> str:
    if number < 0:
        raise ValueError("Cannot convert negative number to base36")
    result = []
    while number > 0:
        result.append(BASE36[number % 36])
        number //= 36
    while len(result) < length:
        result.append("0")
    return "".join(reversed(result))


def _random_base36(length: int) -> str:
    result = []
    for _ in range(length):
        result.append(BASE36[secrets.randbelow(36)])
    return "".join(result)


def generate_uid_v2(prefix: str) -> str:
    if prefix not in PREFIX_ROUTES:
        raise ValueError(f"Invalid prefix: {prefix}. Must be one of: {list(PREFIX_ROUTES.keys())}")
    timestamp = int(time.time())
    ts_b36 = _to_base36(timestamp, 7)
    rand_b36 = _random_base36(5)
    return f"{prefix}_{ts_b36}{rand_b36}"


def validate_uid(uid: str) -> dict:
    if V1_PATTERN.match(uid):
        prefix_letter = uid[1].lower()
        uid_type_map = {"n": "sn", "a": "sa"}
        uid_type = uid_type_map.get(prefix_letter, f"s{prefix_letter}")
        routes_to = PREFIX_ROUTES.get(uid_type, "unknown")
        return {"valid": True, "version": 1, "uid": uid, "uid_type": uid_type, "routes_to": routes_to}
    if V2_PATTERN.match(uid):
        prefix = uid[:2]
        routes_to = PREFIX_ROUTES.get(prefix, "unknown")
        return {"valid": True, "version": 2, "uid": uid, "uid_type": prefix, "routes_to": routes_to}
    return {"valid": False, "version": None, "uid": uid, "uid_type": None, "routes_to": None,
            "error": "UID does not match v1 or v2 format"}
```

---

# APPENDIX E — SND Monitor Checks

**Source:** `/connect.shopnet/backend/snd/snd_monitor.py`
**Date:** February 6, 2026

The SND Monitor runs 4 validation checks:

1. **check_uniqueness()** — Scans uid_registry for duplicate UIDs (PK enforces, but verify for corruption)
2. **check_consistency()** — Cross-references uid_registry against target databases:
   - `sn_` UIDs vs `endpoint_taxonomy.site_uid` (Instance 1)
   - `sa_` UIDs vs `agents.agent_uid` (Instance 1)
   - `su_` UIDs vs `user_taxonomy.uid` (Instance 2 — graceful skip if unavailable)
   - `sl_` UIDs vs `list_taxonomy.uid` (Instance 2 — graceful skip if unavailable)
   - Reports "ghosts" (in registry, not in target) and "orphans" (in target, not in registry)
3. **check_immutability()** — Verifies every uid_registry entry has a matching uid_issuance_log entry
4. **check_audit()** — Reports total UIDs, total logs, coverage percentage, and breakdown by source/context

Returns overall_status: `HEALTHY` (all pass) | `WARNING` (some warnings) | `CRITICAL` (any fail)

---

**END OF DOCUMENT**

**Version History:**
| Version | Date | Changes |
|---------|------|---------|
| v3.1 | Jan 25, 2026 | Initial taxonomy (W, A, D, ND) |
| v3.5 | Feb 4, 2026 | Split ND→N/I/O, added platform_types, taxonomy_definition table |
| v3.5.1 | Feb 7, 2026 | Dynamic trigger, Flask API, loadPlatformOptions(), 5 new I types, W3→L3 fix |
| **v5.0** | **Feb 7, 2026** | **This document — definitive master. Merged all sources. Full code verification.** |
