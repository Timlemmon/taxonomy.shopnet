# THIS IS THE LAW v3.5 — Complete Taxonomy
**Date:** February 7, 2026
**Authority:** TJL
**Status:** As implemented in system (code + RDS) + governance documents

**Document Sources:**
- Document 47: THIS IS THE SND LAW v1.0 — `/taxonomy.shopnet/ThisIsTheLaw.md` (Feb 6, 2026)
- Document 46: Future Deathstar v2.0 — `/shopnet-deathstar/46-FUTURE-DEATHSTAR.md` (Feb 6, 2026)
- Document 26: THIS IS THE LAW v4.0, Part VI — `/shopnet-deathstar/26-THIS-IS-THE-LAW.md` (Feb 5-6, 2026)
- Document 43: Assist Shopnet Agent Architecture — `/shopnet-deathstar/43-ASSIST-SHOPNET-AGENT-ARCHITECTURE.md`
- `DATABASE-DESIGN.md` — `/assist.shopnet/docs/DATABASE-DESIGN.md` (Feb 5-6, 2026)
- `002_shopnet_crm.sql` — `/connect.shopnet/backend/sql/002_shopnet_crm.sql` (Feb 6, 2026)
- `console.js` PLATFORM_OPTIONS — `/shopnet.network-console/static/js/console.js:3783-3824` (Feb 4, 2026)
- `update-taxonomy-v3.5.sql` — `/shopnet.network-console/scripts/update-taxonomy-v3.5.sql` (Feb 4, 2026)
- `taxonomy_definition` table — `shopnet_sites` RDS database
- `endpoint_taxonomy` table — `shopnet_sites` RDS database
- `validate_platform_type()` trigger — `shopnet_sites` RDS database

---

# SECTION 1 — SND Namespace (The Top Level)

**Source:** Document 47: THIS IS THE SND LAW v1.0 — `/taxonomy.shopnet/ThisIsTheLaw.md`
**Date:** February 6, 2026
**Authority:** TJL

---

## 1.1 The Namespace

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

## 1.2 v2 UID Format

**Source:** Document 47, Part VII.2 (lines 109-152)
**Date:** February 6, 2026

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

## 1.3 The Five Prefixes

**Source:** Document 47, Part VIII.1-VIII.6 (lines 237-350)
**Date:** February 6, 2026

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

### sn_ (Sites)

**Source:** Document 47, Part VIII.2 (lines 274-286)
**Date:** February 6, 2026

| Attribute | Value |
|-----------|-------|
| **Prefix** | `sn_` |
| **Full Name** | Shopnet Network |
| **Entity Type** | Sites, endpoints, network infrastructure |
| **Target Database** | `shopnet_sites` |
| **v1 Equivalent** | `SN-XXXXXXXX` (site_uid) |
| **Examples** | `sn_a1b2c3d4e5f6`, `sn_000000000001` |

Every network endpoint receives a site UID. Websites, databases, nodes, infrastructure components -- anything that exists as an addressable endpoint on the Shopnet network gets an `sn_` identifier.

### sa_ (Agents)

**Source:** Document 47, Part VIII.3 (lines 289-300)
**Date:** February 6, 2026

| Attribute | Value |
|-----------|-------|
| **Prefix** | `sa_` |
| **Full Name** | Shopnet Assist |
| **Entity Type** | AI agents, automated assistants |
| **Target Database** | `shopnet_assist` |
| **v1 Equivalent** | `SA-XXXXXXXX` (agent_uid) |
| **Examples** | `sa_a1b2c3d4e5f6`, `sa_000000000001` |

Every AI agent receives an agent UID in addition to its site UID. An agent is both a network endpoint (it gets an `sn_` UID) and an operational agent (it gets an `sa_` UID).

### su_ (Users)

**Source:** Document 47, Part VIII.4 (lines 304-317)
**Date:** February 6, 2026

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

### sl_ (Lists)

**Source:** Document 47, Part VIII.5 (lines 321-334)
**Date:** February 6, 2026

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

### sp_ (Payments)

**Source:** Document 47, Part VIII.6 (lines 338-350)
**Date:** February 6, 2026

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

## 1.4 UID Routing

**Source:** Document 47, Part VII.4 (lines 182-205)
**Date:** February 6, 2026

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

## 1.5 The Pointer Pattern

**Source:** Document 47, Part VIII.7 (lines 353-389)
**Date:** February 6, 2026

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

## 1.6 The First Law

**Source:** Document 47, Part IX.1-IX.3 (lines 393-490)
**Date:** February 6, 2026

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

## 1.7 Sole Issuer

**Source:** Document 47, Part VII.5 (lines 209-233)
**Date:** February 6, 2026

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

## 1.8 Identity Hierarchy

**Source:** Document 46: Future Deathstar v2.0, Section 8 (lines 455-470) — `/shopnet-deathstar/46-FUTURE-DEATHSTAR.md`
**Date:** February 6, 2026
**Decision:** Option B — Federated UIDs, Unified Master Registry (Section 7, lines 354-400)

```
SHOPNET NETWORK IDENTITY HIERARCHY

Level 0: Endpoints          SN-XXXXXXXX  (site_uid)
  Level 1: Agents           SA-XXXXXXXX  (agent_uid)     [requires Level 0]
  Level 1: Users            SU-XXXXXXXX  (user_uid)      [independent]
  Level 1: Lists            SL-XXXXXXXX  (list_uid)      [requires user_uid owner]
  Level 1: Payments         SP-XXXXXXXX  (payment_uid)   [requires user_uid payer]

External References (NOT owned by Shopnet):
  Products:                 ASIN / ISBN / UPC  (Amazon, books, retail)
  Domains:                  domain_name        (already unique in tlds table)
  Wallets:                  0x...              (blockchain address)
```

### The Taxonomy Parallel — site_uid Mirrors user_uid

**Source:** Document 46, Section 6 (lines 257-311)
**Date:** February 6, 2026

**Site Side (existing):**
```
Connect Gateway issues SN-XXXXXXXX (site_uid)
  → stored in endpoint_taxonomy table
    → branches to: website_data (content)
    → branches to: agent_data (SA-XXXXXXXX)
    → branches to: pulse_data (monitoring)
```

**User Side (proposed):**
```
uid.shopnet issues SU-XXXXXXXX (user_uid)
  → stored in user_taxonomy table
    → branches to: user_profiles (CRM data)
    → branches to: user_lists (SL-XXXXXXXX)
    → branches to: user_payments (SP-XXXXXXXX)
```

### Federated UIDs with Unified Master Registry

**Source:** Document 46, Section 7 — Option B (lines 354-400)
**Date:** February 6, 2026

```sql
-- Master index (lightweight, just UIDs and types)
CREATE TABLE uid_registry (
    uid         VARCHAR(15) PRIMARY KEY,
    uid_type    CHAR(2),        -- SN, SA, SU, SL, SP
    issued_by   VARCHAR(50),    -- 'connect_gateway', 'uid_shopnet'
    issued_at   TIMESTAMP,
    active      BOOLEAN DEFAULT true
);

-- Existing (unchanged)
endpoint_taxonomy   → SN-XXXXXXXX details
agent_taxonomy      → SA-XXXXXXXX details (in shopnet_assist)

-- New (separate databases)
user_taxonomy       → SU-XXXXXXXX details (in shopnet_crm)
list_taxonomy       → SL-XXXXXXXX details (in shopnet_registry)
payment_taxonomy    → SP-XXXXXXXX details (in shopnet_payments)
```

### UID Prefix Alphabet

**Source:** Document 46, Section 7 (lines 385-398)
**Date:** February 6, 2026

```
SHOPNET UID PREFIX ALPHABET (THE LAW v5.0)

  SN-  Site/Endpoint     Connect Gateway issues
  SA-  Agent             Connect Gateway issues
  SU-  User              uid.shopnet issues (or Connect Gateway extended)
  SL-  List              registry.shopnet issues (or Connect Gateway extended)
  SP-  Payment           domainpay.shopnet issues (or Connect Gateway extended)

  Reserved:
  SD-  (future)
  SE-  (future)
  ...
```

---

## 1.9 Database Topology

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
| 1 | `shopnet_data` | General platform data, shared resources | -- | Active |
| 1 | `shopnet_sites` | Sites, endpoints, endpoint taxonomy, domain configs | `sn_` | Active |
| 1 | `shopnet_assist` | Agent configurations, agent registry, agent platforms | `sa_` | Active |
| 1 | `amazon_products` | Amazon product catalog, domain inventory (domains_unused) | -- | Active |
| 1 | `KPI_Source` | Analytics dashboards, KPI data, reporting | -- | Active |
| 1 | `shopnet_connect` | Connect Gateway state, uid_registry, uid_issuance_log | -- | Active |
| 2 | `shopnet_crm` | User accounts, profiles, shopping history, preferences, consent | `su_` | New |
| 2 | `shopnet_registry` | Lists, gift registries, wishlists, curated collections | `sl_` | New |

### The Master Index

**Source:** Document 47, Part XI.4 (lines 684-732)
**Date:** February 6, 2026

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
|   Columns:                                                            |
|     uid            VARCHAR(15)   PRIMARY KEY                          |
|     prefix         CHAR(2)       NOT NULL                             |
|     entity_type    VARCHAR(20)   NOT NULL                             |
|     target_db      VARCHAR(50)   NOT NULL                             |
|     created_at     TIMESTAMP     NOT NULL                             |
|     created_by     VARCHAR(50)   NOT NULL  (always Connect Gateway)   |
|     status         VARCHAR(10)   NOT NULL  (active/retired)           |
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
|   Columns:                                                            |
|     log_id          BIGINT        PRIMARY KEY AUTO_INCREMENT          |
|     uid             VARCHAR(15)   NOT NULL                            |
|     prefix          CHAR(2)       NOT NULL                            |
|     issued_at       TIMESTAMP     NOT NULL                            |
|     issued_by       VARCHAR(50)   NOT NULL  (Connect Gateway)         |
|     requested_by    VARCHAR(100)  NOT NULL  (which service asked)     |
|     request_context TEXT          (optional metadata)                 |
|                                                                       |
|   uid_issuance_log is APPEND-ONLY.                                    |
|   Records are NEVER updated or deleted.                               |
|   This is the blockchain-equivalent audit trail for SND.              |
|                                                                       |
+-----------------------------------------------------------------------+
```

---

## 1.10 SND Validation Layer — SND Monitor

**Source:** Document 47, Part X.1-X.3 (lines 494-613)
**Date:** February 6, 2026

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

| # | Check | What It Validates | Failure Means |
|---|-------|-------------------|---------------|
| 1 | **Uniqueness** | No two entities share the same UID across the entire namespace | Collision detected -- critical failure |
| 2 | **Consistency** | Every UID in a target database also exists in uid_registry | Orphan UID -- issued outside Connect Gateway |
| 3 | **Immutability** | No UID has been modified after issuance | UID tampering -- integrity violation |
| 4 | **Audit** | Every UID in uid_registry has a corresponding entry in uid_issuance_log | Missing audit trail -- issuance not recorded |

---

## 1.11 Governance Hierarchy

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
|       |   Governs: Domain-specific rules, access patterns,            |
|       |            data retention, privacy policies                   |
|       |                                                               |
|       |       |                                                       |
|       |       +-- LEVEL 3: ENTITY TYPES                               |
|       |           ====================                                |
|       |           Scope: Individual entity types within domains       |
|       |           Entity types:                                       |
|       |             sn_: sites, endpoints, nodes, databases           |
|       |             sa_: agents, assistants                           |
|       |             su_: users, accounts                              |
|       |             sl_: lists, registries, wishlists                  |
|       |             sp_: payments, transactions, transfers             |
|       |           Governs: Entity-specific schemas, validation        |
|       |                    rules, business logic                      |
|       |                                                               |
+-----------------------------------------------------------------------+
```

### Domain Rules

**Source:** Document 47, Part XII.3 (lines 805-818)
**Date:** February 6, 2026

| Domain | Prefixes | Scope | Instance |
|--------|----------|-------|----------|
| **Network** | `sn_`, `sa_` | Infrastructure, endpoints, agents | Instance 1 |
| **Identity** | `su_` | Users, authentication, profiles | Instance 2 |
| **Content** | `sl_` | Lists, registries, user-created data | Instance 2 |
| **Transactions** | `sp_` | Payments, wallet operations | TBD |

- **Network**: Agents require both `sn_` and `sa_` UIDs (two-level identity)
- **Identity**: `su_` data is subject to privacy rules; user has ultimate authority (First Law)
- **Content**: Lists reference external entities by pointer, not by UID (Pointer Pattern)
- **Transactions**: `sp_` records are append-only; no transaction is ever deleted

### Governance Flows Downward

**Source:** Document 47, Part XII.4 (lines 822-845)
**Date:** February 6, 2026

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

## 1.12 v1 Coexistence

**Source:** Document 47, Appendix A (lines 849-926)
**Date:** February 6, 2026

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
3. **uid_registry stores both.** `VARCHAR(15)` accommodates both formats.
4. **Routing handles both.** Services must recognize both `SN-`/`sn_` and `SA-`/`sa_`.
5. **SND Monitor validates both.** The four checks apply equally to v1 and v2 UIDs.
6. **No version hierarchy.** A v2 UID is not "better" than a v1 UID.

---
---

# SECTION 2 — Site UID Taxonomy (sn_ / SN-)

**Source:** `update-taxonomy-v3.5.sql` — `/shopnet.network-console/scripts/update-taxonomy-v3.5.sql` (Feb 4, 2026)
**Source:** `console.js` PLATFORM_OPTIONS — `/shopnet.network-console/static/js/console.js:3783-3824` (Feb 4, 2026)
**Source:** `taxonomy_definition` table — `shopnet_sites` RDS database
**Source:** `endpoint_taxonomy` table — `shopnet_sites` RDS database
**Source:** `validate_platform_type()` trigger — `shopnet_sites` RDS database
**Date:** February 4, 2026 (THE LAW v3.5, as implemented in code + RDS)
**Authority:** TJL

### Taxonomy Implementation — How It Works

**Source:** Claude session, February 7, 2026
**Date:** February 7, 2026

For the site_uid taxonomy, the **`taxonomy_definition` table** in the `shopnet_sites` database is the **source of truth** for the taxonomy of the entire endpoint network.

This table defines every valid value for every taxonomy level — endpoint_type, platform_type, website_purpose, managed_by, persistence, status, web_protocol, console_section, runtime, host, and agent_type.

The `taxonomy_definition` table is referenced and implemented by two systems:

1. **`validate_platform_type()` trigger** — PostgreSQL trigger on the `endpoint_taxonomy` table that enforces valid Level 1 → Level 2 (endpoint_type → platform_type) combinations at the database level. Any INSERT or UPDATE that violates the valid combinations is rejected with an exception. This is the **server-side enforcement**.

2. **`PLATFORM_OPTIONS` constant in `console.js`** — JavaScript constant that populates the dropdown options in the Add/Edit Endpoint wizard in the Console GUI. When a user selects an endpoint_type, the wizard shows only the valid platform_type options for that type. This is the **client-side enforcement**.

```
taxonomy_definition table (source of truth)
        │
        ├──→ validate_platform_type() trigger (RDS enforcement)
        │    └── Rejects invalid endpoint_type → platform_type combinations
        │
        └──→ PLATFORM_OPTIONS in console.js (GUI enforcement)
             └── Shows only valid dropdown options per endpoint_type
```

Both systems must stay in sync. When a new taxonomy value is added to `taxonomy_definition`, it must also be added to both the trigger function AND the console.js PLATFORM_OPTIONS constant. The SQL script `update-taxonomy-v3.5.sql` handles the trigger and seed data; the console.js must be updated manually.

---

## 2.1 Level 0 — Identity

**Source:** `endpoint_taxonomy` table, `shopnet_sites` RDS — `site_uid VARCHAR(15) PRIMARY KEY`
**Date:** Feb 4, 2026

| Field | Type | Values | Required | Mutable |
|-------|------|--------|----------|---------|
| `site_uid` | VARCHAR(15) | v1: `SN-XXXXXXXX`, v2: `sn_xxxxxxxxxxxx` | YES | **NO** |

Issued by Connect Gateway ONLY. Never changes. Never reused.

---

## 2.2 Level 1 — Endpoint Type

**Source:** `taxonomy_definition` table, `level = 'endpoint_type'` — `shopnet_sites` RDS
**Constraint:** `endpoint_taxonomy.chk_endpoint_type CHECK (endpoint_type IN ('W','A','D','N','I','O'))` — updated Feb 4, 2026
**Date:** Feb 4, 2026

| Field | Type | Required | Mutable |
|-------|------|----------|---------|
| `endpoint_type` | CHAR(2) | YES | **NO** — set at creation, immutable |

| Code | Name | Description | Active |
|------|------|-------------|--------|
| `W` | Website | Web-accessible sites (brochure, store, portal, console) | TRUE |
| `A` | Agent | AI agents and assistants | TRUE |
| `D` | Database | Data stores (RDS, DynamoDB, S3, GitHub) | TRUE |
| `N` | Node | Network service nodes (gateways, APIs, hubs) | TRUE |
| `I` | Infrastructure | Infrastructure components (Lambda, queues, topics) | TRUE |
| `O` | Other | Uncategorized endpoints | TRUE |
| `ND` | Non-Domain (LEGACY) | Legacy — split into N, I, O on Feb 4 2026 | **FALSE** |

---

## 2.3 Level 2 — Platform Type

**Source:** `taxonomy_definition` table, `level = 'platform_type'` — `shopnet_sites` RDS
**Enforcement:** `validate_platform_type()` trigger on `endpoint_taxonomy` — `shopnet_sites` RDS
**Date:** Feb 4, 2026

| Field | Type | Required | Mutable |
|-------|------|----------|---------|
| `platform_type` | VARCHAR(3) | YES | **YES** — via migration workflow |

### W (Website)

**Trigger valid values:** `CO, CP, WP, WW, SH, CL, S3, LM, L3` — `validate_platform_type()`, `shopnet_sites` RDS
**Console wizard shows:** `CO, CP, WP, SH, WW, CL, S3, LM, W3` — `console.js:3783-3794`, Feb 4, 2026

| Code | Name | Description | Source |
|------|------|-------------|--------|
| `CO` | CloudFront On-Demand | Lambda-backed, scales to zero | SQL + JS |
| `CP` | CloudFront Persistent | nginx on EC2, always running | SQL + JS |
| `WP` | WordPress | PHP on EC2 with WordPress | SQL + JS |
| `SH` | Shopify | External Shopify store | SQL + JS |
| `WW` | WooCommerce | WordPress with WooCommerce | SQL + JS |
| `CL` | Custom Lambda | Custom Lambda function | SQL + JS |
| `S3` | S3 Static | Static files on S3 | SQL + JS |
| `LM` | Lightsail | Amazon Lightsail instance | SQL + JS |
| `L3` | Layer3 Web3 | Lambda@Edge with IP certs for emoji TLDs | SQL only |
| `W3` | Web3 Domain | Web3 blockchain domain (Freename, ENS) | JS only |

### A (Agent)

**Trigger valid values:** `CL, GP, GM, CA, OT` — `validate_platform_type()`, `shopnet_sites` RDS
**Console wizard shows:** `CL, GP, CA` — `console.js:3795-3799`, Feb 4, 2026

| Code | Name | Description | Source |
|------|------|-------------|--------|
| `CL` | Claude Agent | Anthropic Claude-based agent | SQL + JS |
| `GP` | GPT Agent | OpenAI GPT-based agent | SQL + JS |
| `GM` | Gemini Agent | Google Gemini-based agent | SQL only |
| `CA` | Custom Agent | Custom AI agent implementation | SQL + JS |
| `OT` | Other Agent | Other AI agent | SQL only |

### D (Database)

**Trigger valid values:** `RD, DY, S3, GIT, TPD` — `validate_platform_type()`, `shopnet_sites` RDS
**Console wizard shows:** `RD, DY, S3, GIT, TPD` — `console.js:3800-3806`, Feb 4, 2026

| Code | Name | Description | Source |
|------|------|-------------|--------|
| `RD` | RDS PostgreSQL | Amazon RDS PostgreSQL | SQL + JS |
| `DY` | DynamoDB | Amazon DynamoDB | SQL + JS |
| `S3` | S3 Data Lake | S3 as data store | SQL + JS |
| `GIT` | GitHub Repository | GitHub code repository | SQL + JS |
| `TPD` | Third Party DB API | External database API | SQL + JS |

### N (Node)

**Trigger valid values:** `W3G, API, RDH, W3S, LLM, OTH` — `validate_platform_type()`, `shopnet_sites` RDS
**Console wizard shows:** `W3G, API, RDH, W3S, LLM, OTH` — `console.js:3807-3814`, Feb 4, 2026

| Code | Name | Description | Source |
|------|------|-------------|--------|
| `W3G` | Web3 Gateway | Web3 domain resolution gateway | SQL + JS |
| `API` | API Hub | API service endpoint | SQL + JS |
| `RDH` | Redirect Hub | URL redirect service | SQL + JS |
| `W3S` | Web3 DAAS | Web3 decentralized service | SQL + JS |
| `LLM` | LLM Service | Large language model service | SQL + JS |
| `OTH` | Other Node | Other network node | SQL + JS |

### I (Infrastructure)

**Trigger valid values (current):** `S3B, LMB, SQS, SNS` — `validate_platform_type()`, `shopnet_sites` RDS
**Console wizard shows (current):** `S3B, LMB, SQS, SNS` — `console.js:3815-3820`, Feb 4, 2026

| Code | Name | Description | Source | Status |
|------|------|-------------|--------|--------|
| `S3B` | S3 Bucket | S3 storage bucket | SQL + JS | Exists |
| `LMB` | Lambda Function | Standalone Lambda | SQL + JS | Exists |
| `SQS` | SQS Queue | Message queue | SQL + JS | Exists |
| `SNS` | SNS Topic | Notification topic | SQL + JS | Exists |

#### Revised PLATFORM_OPTIONS for endpoint_type "I" (Infrastructure)

**Source:** TJL directive + Claude session, February 7, 2026
**Date:** February 7, 2026
**Authority:** TJL
**Status:** APPROVED — to be implemented in `taxonomy_definition` table, `validate_platform_type()` trigger, and `console.js` PLATFORM_OPTIONS

These values are being added to the `taxonomy_definition` table as the new complete set of Infrastructure platform_types. The existing 4 values remain; 5 new values are added to represent the actual AWS infrastructure in the network.

| Code | Name | Description | Count on GUI | Status |
|------|------|-------------|:------------:|--------|
| `LS` | Lightsail Instance | Amazon Lightsail instance | 20 | **NEW** |
| `EC2` | EC2 Instance | Amazon EC2 instance | 5 | **NEW** |
| `RDS` | RDS Instance | Amazon RDS instance | 3 | **NEW** |
| `CF` | CloudFront Distribution | Amazon CloudFront distribution | 6 | **NEW** |
| `AGW` | API Gateway | AWS API Gateway | 3 | **NEW** |
| `S3B` | S3 Bucket | S3 storage bucket | 11 | Exists |
| `LMB` | Lambda Function | Standalone Lambda | 23 | Exists |
| `SQS` | SQS Queue | Message queue | 0 | Exists |
| `SNS` | SNS Topic | Notification topic | 0 | Exists |

Implementation required in three places (per Taxonomy Implementation above):
1. `taxonomy_definition` table — INSERT new rows for LS, EC2, RDS, CF, AGW with `level = 'platform_type'`, `parent_code = 'I'`
2. `validate_platform_type()` trigger — UPDATE to include LS, EC2, RDS, CF, AGW in the 'I' validation
3. `console.js` PLATFORM_OPTIONS — ADD new entries to the 'I' array

### O (Other)

**Trigger valid values:** `OTH` — `validate_platform_type()`, `shopnet_sites` RDS
**Console wizard shows:** `OTH` — `console.js:3821-3823`, Feb 4, 2026

| Code | Name | Description | Source |
|------|------|-------------|--------|
| `OTH` | Other | Uncategorized endpoint | SQL + JS |

---

## 2.4 Universal Fields

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

## 2.5 Website-Specific Fields (endpoint_type = 'W' only)

**Source:** `endpoint_taxonomy` table + `taxonomy_definition` table, `shopnet_sites` RDS
**Date:** Feb 4, 2026

### managed_by

**Source:** `taxonomy_definition` table, `level = 'managed_by'` — `shopnet_sites` RDS
**Constraint:** `endpoint_taxonomy.chk_managed_by CHECK (managed_by IS NULL OR managed_by IN ('L','R','M','E'))` — Feb 4, 2026

| Code | Name | Description |
|------|------|-------------|
| `L` | Lambda | Managed by AWS Lambda (On-Demand) |
| `R` | Radius | Managed by Radius site builder (Persistent) |
| `M` | Manual | Manually managed |
| `E` | External | Externally managed (third-party) |
| `null` | None | No automated management |

### persistence

**Source:** `taxonomy_definition` table, `level = 'persistence'` — `shopnet_sites` RDS
**Date:** Feb 4, 2026

| Code | Name | Description |
|------|------|-------------|
| `P` | Persistent | Always running |
| `D` | On-Demand | Scales to zero when not in use |

### website_purpose

**Source:** `taxonomy_definition` table, `level = 'website_purpose'`, `parent_code = 'W'` — `shopnet_sites` RDS
**Date:** Feb 4, 2026

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

**Source:** `endpoint_taxonomy` table, `store_checkout CHAR(1)` — `shopnet_sites` RDS
**Date:** Feb 4, 2026

| Code | Description |
|------|-------------|
| `Y` | Has shopping cart and checkout |
| `N` | No e-commerce transaction capability |

---

## 2.6 Agent-Specific Fields (endpoint_type = 'A' only)

**Source:** `taxonomy_definition` table, `level = 'agent_type'` — `shopnet_sites` RDS
**Date:** Feb 4, 2026

### agent_type

| Code | Name | Description |
|------|------|-------------|
| `domain` | Domain Assist | Domain recommendation agent |
| `product` | Product Assist | Product recommendation agent |
| `content` | Content Assist | Content generation agent |
| `kpi` | KPI Assist | KPI analysis agent |
| `site` | Site Assist | Site management agent |
| `choice` | Choice Assist | General choice helper |
| `custom` | Custom | Custom agent type |

---

## 2.7 Console Display Fields

**Source:** `endpoint_taxonomy` table + `taxonomy_definition` table, `shopnet_sites` RDS
**Date:** Feb 4, 2026

### console_section

**Source:** `taxonomy_definition` table, `level = 'console_section'` — `shopnet_sites` RDS
**Date:** Feb 4, 2026

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

**Source:** `endpoint_taxonomy` table — `shopnet_sites` RDS
**Date:** Feb 4, 2026

| Field | Type | Purpose |
|-------|------|---------|
| `console_section` | VARCHAR(50) | Primary allocation — determines which console page displays the card |
| `card_label` | VARCHAR(255) | Display name on card. Defaults to domain_name if not set |
| `show_on_map` | BOOLEAN | If false, card is hidden from console pages but remains in registry |

### Auto-Assignment Rules

**Source:** `console.js` `submitEndpointWizard()` (line 4213) and `prefillEditorConsoleSectionForm()` (line 4575)
**Date:** Feb 4, 2026

| endpoint_type | website_purpose / platform_type | Auto-assigned console_section |
|---------------|--------------------------------|-------------------------------|
| `D` (Database) | any | `data.shopnet` |
| `A` (Agent) | any | `assist.shopnet` |
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

## 2.8 status

**Source:** `taxonomy_definition` table, `level = 'status'` — `shopnet_sites` RDS
**Date:** Feb 4, 2026

| Code | Name | Description | Console Display |
|------|------|-------------|-----------------|
| `planned` | Planned | Placeholder — not health checked | Grey dot |
| `wip` | Work in Progress | Building | Orange dot |
| `live` | Live | Active — health checked | Green/red based on Pulse |

---

## 2.9 web_protocol

**Source:** `taxonomy_definition` table, `level = 'web_protocol'` — `shopnet_sites` RDS
**Date:** Feb 4, 2026

| Code | Name | Description |
|------|------|-------------|
| `W2` | Web2 | Traditional DNS-based web (ICANN TLDs: .com, .net, .io) |
| `W3` | Web3 | Blockchain/decentralized web (.domains, emoji TLDs) |

**Immutable** — set at creation, never changes.

---

## 2.10 runtime

**Source:** `taxonomy_definition` table, `level = 'runtime'` — `shopnet_sites` RDS
**Date:** Feb 4, 2026

| Code | Name | Description |
|------|------|-------------|
| `nginx` | nginx | nginx web server |
| `lambda` | Lambda | AWS Lambda function |
| `php` | PHP | PHP runtime |
| `node` | Node.js | Node.js runtime |
| `python` | Python | Python runtime |
| `external` | External | External/third-party runtime |

---

## 2.11 host

**Source:** `taxonomy_definition` table, `level = 'host'` — `shopnet_sites` RDS
**Date:** Feb 4, 2026

| Code | Name | Description |
|------|------|-------------|
| `ec2` | EC2 | Amazon EC2 instance |
| `api_gateway` | API Gateway | AWS API Gateway |
| `s3` | S3 | Amazon S3 |
| `cloudfront` | CloudFront | Amazon CloudFront CDN |
| `external` | External | External/third-party host |

---

## 2.12 Pulse Health Check Method Mapping

**Source:** `console.js` `getPulseMethod()` (line 3828) — `/shopnet.network-console/static/js/console.js`
**Date:** Feb 4, 2026

| endpoint_type | platform_type | Pulse Method |
|---------------|---------------|-------------|
| W | W3 | `http_web3` |
| W | CO, CL | `http_ondemand` |
| W | SH, WP, WW | `http_store` |
| W | CP, S3, LM (default) | `http` |
| A | (all) | `agent` |
| D | RD | `db` |
| D | GIT | `github` |
| D | S3 | `fileserver` |
| D | DY, TPD (default) | `api` |
| N | (all) | `api` |
| I | (all) | `api` |

---

## 2.13 RDS Schema

### endpoint_taxonomy

**Source:** `shopnet_sites` RDS database
**Date:** Feb 4, 2026

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
    CONSTRAINT chk_endpoint_type CHECK (endpoint_type IN ('W','A','D','N','I','O')),
    CONSTRAINT chk_managed_by CHECK (managed_by IS NULL OR managed_by IN ('L','R','M','E'))
);
```

### website_data

**Source:** `shopnet_sites` RDS database
**Date:** Feb 4, 2026

```sql
CREATE TABLE website_data (
    site_uid              VARCHAR(15)   PRIMARY KEY REFERENCES endpoint_taxonomy(site_uid),
    template_id           VARCHAR(50),
    site_content          JSONB,
    html_s3_path          VARCHAR(255),
    build_status          VARCHAR(20),
    build_error           TEXT,
    dns_status            VARCHAR(20),
    ssl_status            VARCHAR(20),
    cloudfront_id         VARCHAR(50),
    cloudfront_domain     VARCHAR(255),
    route53_zone_id       VARCHAR(50),
    acm_cert_arn          VARCHAR(255),
    last_build_at         TIMESTAMP,
    last_deploy_at        TIMESTAMP
);
```

### taxonomy_definition

**Source:** `shopnet_sites` RDS database (created by `update-taxonomy-v3.5.sql`, Feb 4, 2026)
**Date:** Feb 4, 2026

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
---

# SECTION 3 — Agent UID Taxonomy (sa_ / SA-)

**Source:** Document 26: THIS IS THE LAW v4.0, Part VI — `/shopnet-deathstar/26-THIS-IS-THE-LAW.md` (lines 2967-3110)
**Source:** Document 43: Assist Shopnet Agent Architecture — `/shopnet-deathstar/43-ASSIST-SHOPNET-AGENT-ARCHITECTURE.md`
**Source:** `DATABASE-DESIGN.md` — `/assist.shopnet/docs/DATABASE-DESIGN.md` (Feb 5-6, 2026)
**Source:** Document 46: Future Deathstar v2.0, Section 17 — `/shopnet-deathstar/46-FUTURE-DEATHSTAR.md` (lines 1315-1322)
**Date:** February 5-6, 2026
**Authority:** TJL
**RDS Status:** Database `shopnet_assist` created on Instance 1 (amazon-products-db). All 9 tables created. 12 seed rules inserted. 8 agents registered (SA-00000001 through SA-00000008).

---

## 3.1 Two-Level Identity System

**Source:** Document 26, Part VI.1 (lines 2975-3000)
**Date:** February 5-6, 2026

Every AI agent in the Shopnet network receives BOTH a `site_uid` (as a network endpoint) AND an `agent_uid` (as an operational agent). This is THE LAW.

```
Level 0 (Endpoint):  site_uid   SN-XXXXXXXX
  - Fundamental network identity
  - Every endpoint gets one (websites, agents, databases, nodes)
  - Stored in: endpoint_taxonomy (PK)
  - Counter: metadata.next_site_uid

Level 1 (Instance):  agent_uid  SA-XXXXXXXX
  - Agent-specific operational identity
  - Only agents get one (subset of endpoints)
  - Stored in: shopnet_assist.agents (UNIQUE)
  - Counter: metadata.next_agent_uid
  - REQUIRES site_uid first (cannot exist without Level 0)

Level 2 (Assignment): Future
  - Maps agent instances to specific endpoints
  - e.g., "SA-00000001 serves SN-00000001 through SN-00000048"
```

---

## 3.2 agent_uid Format

**Source:** Document 26, Part VI.2 (lines 3004-3031)
**Date:** February 5-6, 2026

| Attribute | Value |
|-----------|-------|
| **Field Name** | `agent_uid` |
| **Type** | VARCHAR(12) |
| **v1 Format** | `SA-XXXXXXXX` (8-digit zero-padded sequential) |
| **v2 Format** | `sa_xxxxxxxxxxxx` (12 base36: 7 timestamp + 5 random) |
| **Required** | YES (for agents) |
| **Mutable** | NO — NEVER CHANGES |
| **Assigned By** | Connect Gateway ONLY |
| **Never Reused** | Even after agent deletion |

---

## 3.3 Issuance Process — Two-Step Registration

**Source:** Document 26, Part VI.3 (lines 3035-3063)
**Date:** February 5-6, 2026

```
STEP 1: Add Endpoint Wizard (site_uid)
  └── Registers agent as Endpoint Type 'A' in endpoint_taxonomy
  └── Assigns site_uid (SN-XXXXXXXX) via Connect Gateway
  └── Creates S3 folder SN-XXXXXXXX/
  └── Agent is now a NETWORK ENDPOINT

STEP 2: Add Agent Wizard (agent_uid)
  └── REQUIRES site_uid from Step 1 (will not run without it)
  └── Assigns agent_uid (SA-XXXXXXXX) via Connect Gateway
  └── Adds agent config to shopnet_assist.agents table
  └── Uploads portrait image and round icon to S3
  └── Agent is now an OPERATIONAL AGENT
```

### API Endpoints

**Source:** Document 26, Part VI.3 (lines 3055-3063)
**Date:** February 5-6, 2026

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/agent-uid/create` | POST | Issue new SA-XXXXXXXX |
| `/api/v1/agent-uid/next` | GET | Preview next agent_uid |
| `/api/v1/agent-platforms` | GET | List registered platforms |
| `/api/v1/agents` | GET/POST | List/Create agents |
| `/api/v1/agents/{agent_uid}` | GET/PUT/DELETE | CRUD operations |

---

## 3.4 Two-Counter System

**Source:** Document 26, Part VI.4 (lines 3066-3083)
**Date:** February 5-6, 2026

Both counters are independent and stored in `network-endpoints.json` metadata:

```json
{
  "metadata": {
    "next_site_uid": 95,
    "next_agent_uid": 9,
    "last_updated": "2026-02-06T..."
  }
}
```

- `next_site_uid` increments when ANY endpoint is created (website, agent, database, node)
- `next_agent_uid` increments ONLY when an agent is registered via Step 2
- The two counters are completely independent sequences

---

## 3.5 Agent Subtypes (Level 3)

**Source:** Document 46, Section 20 (lines 1315-1322)
**Date:** February 6, 2026

| Domain | Prefix | Type Field Values | Examples |
|--------|--------|------------------|----------|
| NETWORK | `sa_` | AI=AI Agent, BT=Bot, AU=Automation | Claudio (CIO), ProductAssist |

**Source:** Document 26, Part IV (lines 2897-2903) — `agent_type` values in endpoint_taxonomy
**Date:** February 5-6, 2026

| agent_type | Description |
|------------|-------------|
| `product_assist` | Product catalog assistant |
| `domain_assist` | Domain search/registration assistant |
| `content_assist` | Content generation assistant |

**Source:** `DATABASE-DESIGN.md`, Section 2 — `/assist.shopnet/docs/DATABASE-DESIGN.md` (lines 56-57)
**Date:** February 5-6, 2026

Agent types in agents table:
- `agent_type`: ENUM('internal', 'client')
- `agent_skill`: VARCHAR(50) — values: 'code', 'chat', 'content', 'data', 'documents', 'promotion'

---

## 3.6 Level Separation Rules

**Source:** Document 26, Part VI.6 (lines 3103-3110)
**Date:** February 5-6, 2026

1. Level 1 (agent_uid) CANNOT exist without Level 0 (site_uid)
2. Level 1 wizards CANNOT modify Level 0 data
3. Deleting an agent (Level 1) does NOT delete the endpoint (Level 0)
4. agent_uid is NEVER reused, even after deletion (same rule as site_uid)
5. Both UIDs are generated ONLY by Connect Gateway (THE LAW applies to both)

---

## 3.7 Registered Agent Platforms

**Source:** Document 26, Part VI.5 (lines 3086-3100)
**Source:** `DATABASE-DESIGN.md`, Section 2 seed data — `/assist.shopnet/docs/DATABASE-DESIGN.md` (lines 109-187)
**Date:** February 6, 2026

As of February 6, 2026 — 8 agents registered, 13 total defined:

| site_uid | agent_uid | agent_id | Agent Name | Type | Skill | Status |
|----------|-----------|----------|------------|------|-------|--------|
| SN-00000085 | SA-00000001 | product_assist | Product Assist | client | chat | live |
| SN-00000086 | SA-00000002 | domain_assist | Domain Assist | client | chat | wip |
| SN-00000087 | SA-00000003 | content_assist | Content Assist | internal | content | wip |
| SN-00000088 | SA-00000004 | kpi_assist | KPI Assist | client | data | wip |
| SN-00000089 | SA-00000005 | site_assist | Site Assist (Radius) | internal | code | wip |
| SN-00000092 | SA-00000006 | cao_assist | CAO Assist (Claudelia) | internal | documents | wip |
| SN-00000093 | SA-00000007 | cto_assist | CTO Assist (Claudnet) | internal | code | wip |
| SN-00000094 | SA-00000008 | cio_assist | CIO Assist (Claudi) | internal | data | future |

Additional defined (not yet registered with agent_uid):

| agent_id | Agent Name | Type | Skill | Status |
|----------|------------|------|-------|--------|
| gift_assist | Gift Assist | client | chat | future |
| customer_assist | Customer Assist | client | chat | future |
| security_assist | Security Assist | internal | code | future |
| marketing_assist | Marketing Assist | internal | promotion | future |
| fun_assist | Fun Assist | internal | content | future |

---

## 3.8 shopnet_assist Database Schema

**Source:** `DATABASE-DESIGN.md` — `/assist.shopnet/docs/DATABASE-DESIGN.md` (lines 710-723)
**Date:** February 5-6, 2026

```
shopnet_assist (Instance 1: amazon-products-db)
├── agents                  Master agent definitions (13 agents, 8 registered with agent_uid)
├── agent_tasks             Task definitions per agent
├── invocation_history      Full invocation log (session memory)
├── agent_learnings         Behavioral learning (what worked/didn't)
├── agent_memory            Factual memory (persistent context)
├── agent_permissions       Fine-grained access control
├── agent_rules             Self-policing rules (12 seed rules)
├── rule_violations         Rule violation log
└── prompt_templates        Dynamic prompt templates per task
```

**9 tables total.** All agent operations in one database.

### agents table (master)

**Source:** `DATABASE-DESIGN.md`, Section 2 (lines 51-104)
**Date:** February 5-6, 2026

```sql
CREATE TABLE agents (
    -- Identity
    agent_id            VARCHAR(50) PRIMARY KEY,       -- 'claudnet', 'product_assist'
    agent_uid           VARCHAR(12) UNIQUE,            -- 'SA-00000001' (assigned by Connect Gateway)
    agent_name          VARCHAR(100) NOT NULL,
    agent_type          ENUM('internal', 'client') NOT NULL,
    agent_skill         VARCHAR(50) NOT NULL,          -- 'code', 'chat', 'content', 'data', 'documents', 'promotion'
    primary_mode        VARCHAR(200),
    status              ENUM('live', 'wip', 'future', 'disabled') DEFAULT 'future',

    -- Persona
    agent_role          VARCHAR(100),
    agent_title         VARCHAR(20),
    agent_user_name     VARCHAR(50),

    -- UI
    agent_ui_name       VARCHAR(100),
    agent_ui_icon       VARCHAR(10),
    agent_ui_color      VARCHAR(7),

    -- Personality & Prompt
    personality         TEXT,
    system_prompt       TEXT,
    catchphrase         VARCHAR(200),

    -- Assignments
    endpoint_assignments JSON,
    gui_assignments     JSON,
    key_databases       JSON,
    key_modules         JSON,
    key_documents       JSON,

    -- Permissions
    data_access         JSON,
    escalation_to       JSON,
    escalation_from     JSON,
    reports_to          VARCHAR(50),

    -- Key Tasks
    key_tasks           TEXT,

    -- Config
    model_tier          ENUM('haiku', 'sonnet', 'opus') DEFAULT 'sonnet',
    max_tokens_output   INT DEFAULT 2048,
    daily_invocation_limit INT DEFAULT 50,
    enabled             BOOLEAN DEFAULT false,

    -- Metadata
    agent_notes         TEXT,
    rd_notes            TEXT,
    site_uid            VARCHAR(12),
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### agent_rules table (self-policing)

**Source:** `DATABASE-DESIGN.md`, Section 6 (lines 400-424)
**Date:** February 5-6, 2026

12 seed rules across 5 categories:

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

### agent_permissions table

**Source:** `DATABASE-DESIGN.md`, Section 5 (lines 368-391)
**Date:** February 5-6, 2026

Fine-grained RBAC + ABAC hybrid:
- `resource_type`: ENUM('database', 'aws', 'api', 'file', 'agent')
- `access_level`: ENUM('read', 'write', 'execute', 'describe', 'invoke')
- `requires_approval`: BOOLEAN
- `time_window`: 'business_hours', 'always', 'maintenance_window'
- `max_queries_per_hour`: INT

---

## 3.9 Prompt Assembly Pipeline

**Source:** `DATABASE-DESIGN.md`, Section 8 (lines 547-631)
**Date:** February 5-6, 2026

10-step pipeline:
1. LOAD AGENT from agents table (personality, role, constraints, model_tier)
2. LOAD TASK from agent_tasks table
3. LOAD PROMPT TEMPLATE from prompt_templates table
4. INJECT RULES from agent_rules table (filtered by applies_to, refresh_frequency)
5. INJECT MEMORY from agent_memory table (top 20 by priority)
6. INJECT LEARNINGS from agent_learnings table (top 10 by confidence > 0.30)
7. INJECT HISTORY from invocation_history (last N runs with outcomes)
8. INJECT CONTEXT (live data from the request)
9. ASSEMBLE FINAL PROMPT
10. TOKEN CHECK (trim history/memory/learnings if over budget)

---

## 3.10 Self-Policing Mechanism

**Source:** `DATABASE-DESIGN.md`, Section 9 (lines 635-706)
**Date:** February 5-6, 2026

```
Gateway enforces:
  PRE-FLIGHT:   Permissions valid? Rate limit? Circuit closed? Budget?
  RULES INJECT: Rules injected into prompt (agent sees them, self-polices)
  POST-FLIGHT:  Output contains secrets? Write without approval? Cross-site data?
  VIOLATION:    Log to rule_violations, notify operator, block if critical
```

Rule refresh schedule:
| Frequency | Rules |
|-----------|-------|
| every_invocation | Security & compliance (RULE-001 to 004, 010, 012) |
| daily | Cost & behavior (RULE-005, 006, 009) |
| weekly | Quality (RULE-008) |

---
---

# SECTION 4 — User UID Taxonomy (su_ / SU-)

**Source:** Document 46: Future Deathstar v2.0 — `/shopnet-deathstar/46-FUTURE-DEATHSTAR.md`
**Source:** `002_shopnet_crm.sql` — `/connect.shopnet/backend/sql/002_shopnet_crm.sql` (IMPLEMENTED)
**Source:** Document 47: THIS IS THE SND LAW v1.0 — `/taxonomy.shopnet/ThisIsTheLaw.md`
**Date:** February 6, 2026
**Authority:** TJL
**RDS Status:** Database `shopnet_crm` created on Instance 2 (shopnet-crm-registry). 7 tables created.

---

## 4.1 user_uid Format

**Source:** Document 47, Part VIII.4 (lines 304-317) — `/taxonomy.shopnet/ThisIsTheLaw.md`
**Source:** Document 46, Section 8 (lines 406-417) — `/shopnet-deathstar/46-FUTURE-DEATHSTAR.md`
**Date:** February 6, 2026

| Attribute | Value |
|-----------|-------|
| **Prefix** | `su_` |
| **Full Name** | Shopnet User |
| **v1 Format** | `SU-XXXXXXXX` (8-digit zero-padded sequential) |
| **v2 Format** | `su_xxxxxxxxxxxx` (12 base36: 7 timestamp + 5 random) |
| **Entity Type** | Human users, customer accounts, companies, groups |
| **Target Database** | `shopnet_crm` (Instance 2: shopnet-crm-registry) |
| **Required** | YES (for all user types) |
| **Mutable** | NO — NEVER CHANGES |
| **Assigned By** | Connect Gateway ONLY |
| **Never Reused** | Even after user deletion |
| **v1 Equivalent** | None (new in SND) |

---

## 4.2 User Subtypes (Level 3)

**Source:** Document 46, Section 18 (lines 1161-1176) — `/shopnet-deathstar/46-FUTURE-DEATHSTAR.md`
**Date:** February 6, 2026
**Decision:** One prefix, type field (not separate prefixes per user type)

| Type Code | Name | Description |
|-----------|------|-------------|
| `I` | Individual | Natural person |
| `C` | Company | Legal person, registered business |
| `G` | Group | Informal collection — soccer team, family, club |

All three behave identically in the system. All can own wallets, delegate to agents, own endpoints, create lists. The type is metadata for display and compliance, not for routing or behavior.

### Rationale for One Prefix

**Source:** Document 46, Section 18 (lines 1151-1159)
**Date:** February 6, 2026

1. **Prefix = routing key.** Both route to shopnet_crm. Different prefixes would create a false partition.
2. **Legally, both are persons.** A company is a legal person. Same rights, same capabilities, same UID treatment.
3. **Mirrors the SN- side.** `sn_` covers websites, databases, infrastructure — all different types, same prefix. The `endpoint_type` field distinguishes them. Same pattern.
4. **Future-proof.** New person types (trusts, DAOs, AI entities) → add a type value, not a new prefix.

### Future Type Values

**Source:** Document 46, Section 18 (lines 1184-1189)
**Date:** February 6, 2026

```
Current types:   I=Individual, C=Company, G=Group
Future types:    I=Individual, C=Company, G=Group, A=AI Entity, K=K-9
```

If AI ever gains legal personhood, the architecture is ready. Add a type value, no schema change. An AI entity with `su_` would own wallets, own endpoints, delegate to other agents, create lists, make payments.

---

## 4.3 The Taxonomy Parallel — site_uid Mirrors user_uid

**Source:** Document 46, Section 6 (lines 257-311) — `/shopnet-deathstar/46-FUTURE-DEATHSTAR.md`
**Date:** February 6, 2026

**Site Side (existing):**
```
Connect Gateway issues SN-XXXXXXXX (site_uid)
  → stored in endpoint_taxonomy table
    → branches to: website_data (content)
    → branches to: agent_data (SA-XXXXXXXX)
    → branches to: pulse_data (monitoring)
```

**User Side (implemented):**
```
Connect Gateway issues SU-XXXXXXXX (user_uid)
  → stored in user_taxonomy table
    → branches to: user_profiles (CRM data)
    → branches to: user_site_registrations (which sites)
    → branches to: user_delegations (which agents authorized)
    → branches to: user_wallets (Web3 addresses)
    → branches to: user_oauth (auth provider tokens)
```

---

## 4.4 Key Relationship — Users to Sites

**Source:** Document 46, Section 8 (lines 472-474) — `/shopnet-deathstar/46-FUTURE-DEATHSTAR.md`
**Date:** February 6, 2026

A user (SU-) can be registered to one or many endpoints (SN-). This is a many-to-many relationship. A user logging into bestbird.com and shopnet.domains would have the SAME user_uid but separate registration records per site_uid.

---

## 4.5 The First Law — User Authority Over Agents

**Source:** Document 47, Part IX.1-IX.3 (lines 393-490) — `/taxonomy.shopnet/ThisIsTheLaw.md`
**Source:** Document 46, Section 18 (lines 1182-1206) — `/shopnet-deathstar/46-FUTURE-DEATHSTAR.md`
**Date:** February 6, 2026

The `su_` UID has ULTIMATE AUTHORITY:
1. A user owns their data
2. A user owns their lists
3. A user owns their transaction history
4. A user can revoke any agent's access at any time
5. An agent CANNOT act without user delegation
6. An agent CANNOT override user decisions
7. An agent CANNOT access user data without permission

Implemented via `user_delegations` table: user_uid ↔ agent_uid junction with scope (read/write/purchase) and revocable access.

---

## 4.6 Authentication Strategy

**Source:** Document 46, Section 9 (lines 480-486) — `/shopnet-deathstar/46-FUTURE-DEATHSTAR.md`
**Date:** February 6, 2026

**Phase 1 (near-term):** OAuth 2.0 proxy with Google as first provider. Add Apple, Microsoft later. The user_uid gets issued by Connect Gateway regardless of which OAuth provider authenticated the user.

**Phase 2 (far-future):** Blockchain-based `.uid` identity. A user's `.uid` domain becomes their identity AND their payment address. This ties CRM and DomainPay together.

**Recommendation:** Build uid.shopnet as a standard OAuth 2.0 relying party. The blockchain .uid identity layer is PHASE 2 — only after the standard OAuth system is proven.

---

## 4.7 shopnet_crm Database Schema (IMPLEMENTED)

**Source:** `002_shopnet_crm.sql` — `/connect.shopnet/backend/sql/002_shopnet_crm.sql` (lines 1-116)
**Date:** February 6, 2026 (SND Build)
**Status:** IMPLEMENTED — tables created on RDS Instance 2

```
shopnet_crm (Instance 2: shopnet-crm-registry)
├── user_taxonomy              su_ UIDs, email, display_name, auth_provider, status
├── user_site_registrations    su_ ↔ sn_ junction (which user on which site, role)
├── user_delegations           su_ ↔ sa_ junction (which user authorized which agent, scope)
├── org_memberships            org_name ↔ su_ junction (which person in which org, role)
├── user_profiles              Extended profile data (GDPR isolation — separate table)
├── user_wallets               Web3 wallet addresses linked to user
└── user_oauth                 OAuth provider tokens and metadata
```

**7 tables total.**

### user_taxonomy table

**Source:** `002_shopnet_crm.sql` (lines 11-22)
**Date:** February 6, 2026

```sql
CREATE TABLE IF NOT EXISTS user_taxonomy (
    uid             VARCHAR(30) PRIMARY KEY,   -- su_xxxxxxxxxxxx (v2) or SU-XXXXXXXX (v1)
    email           VARCHAR(255) UNIQUE,
    display_name    VARCHAR(255),
    avatar_url      TEXT,
    auth_provider   VARCHAR(50) DEFAULT 'native',  -- native, google, apple, microsoft
    auth_provider_id VARCHAR(255),
    status          VARCHAR(20) DEFAULT 'active',  -- active, suspended, deleted
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    last_login_at   TIMESTAMP
);
```

### user_site_registrations table

**Source:** `002_shopnet_crm.sql` (lines 31-42)
**Date:** February 6, 2026

```sql
CREATE TABLE IF NOT EXISTS user_site_registrations (
    id              SERIAL PRIMARY KEY,
    user_uid        VARCHAR(30) NOT NULL,
    site_uid        VARCHAR(30) NOT NULL,
    registered_at   TIMESTAMP NOT NULL DEFAULT NOW(),
    last_active_at  TIMESTAMP,
    role            VARCHAR(50) DEFAULT 'user',  -- user, admin, owner
    UNIQUE(user_uid, site_uid)
);
```

### user_delegations table (implements First Law)

**Source:** `002_shopnet_crm.sql` (lines 45-57)
**Date:** February 6, 2026

```sql
CREATE TABLE IF NOT EXISTS user_delegations (
    id              SERIAL PRIMARY KEY,
    user_uid        VARCHAR(30) NOT NULL,       -- The user granting delegation
    agent_uid       VARCHAR(30) NOT NULL,       -- The agent receiving delegation (SA-)
    scope           VARCHAR(100) NOT NULL,      -- 'read', 'write', 'purchase'
    granted_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    revoked_at      TIMESTAMP,
    active          BOOLEAN NOT NULL DEFAULT TRUE,
    UNIQUE(user_uid, agent_uid, scope)
);
```

### org_memberships table

**Source:** `002_shopnet_crm.sql` (lines 60-70)
**Date:** February 6, 2026

```sql
CREATE TABLE IF NOT EXISTS org_memberships (
    id              SERIAL PRIMARY KEY,
    org_name        VARCHAR(255) NOT NULL,
    user_uid        VARCHAR(30) NOT NULL,
    role            VARCHAR(50) DEFAULT 'member',  -- owner, admin, member
    joined_at       TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(org_name, user_uid)
);
```

### user_profiles table

**Source:** `002_shopnet_crm.sql` (lines 73-83)
**Date:** February 6, 2026

```sql
CREATE TABLE IF NOT EXISTS user_profiles (
    user_uid        VARCHAR(30) PRIMARY KEY,
    first_name      VARCHAR(100),
    last_name       VARCHAR(100),
    phone           VARCHAR(50),
    country_code    VARCHAR(5),
    timezone        VARCHAR(50),
    language        VARCHAR(10) DEFAULT 'en',
    preferences     JSONB DEFAULT '{}',
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### user_wallets table

**Source:** `002_shopnet_crm.sql` (lines 86-98)
**Date:** February 6, 2026

```sql
CREATE TABLE IF NOT EXISTS user_wallets (
    id              SERIAL PRIMARY KEY,
    user_uid        VARCHAR(30) NOT NULL,
    wallet_address  VARCHAR(255) NOT NULL,
    chain           VARCHAR(50) NOT NULL,       -- polygon, ethereum, solana
    label           VARCHAR(100),               -- "Primary Wallet", "Business"
    verified        BOOLEAN DEFAULT FALSE,
    verified_at     TIMESTAMP,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(wallet_address, chain)
);
```

### user_oauth table

**Source:** `002_shopnet_crm.sql` (lines 101-116)
**Date:** February 6, 2026

```sql
CREATE TABLE IF NOT EXISTS user_oauth (
    id              SERIAL PRIMARY KEY,
    user_uid        VARCHAR(30) NOT NULL,
    provider        VARCHAR(50) NOT NULL,       -- google, apple, microsoft
    provider_user_id VARCHAR(255) NOT NULL,
    access_token    TEXT,
    refresh_token   TEXT,
    token_expires_at TIMESTAMP,
    scopes          TEXT,
    created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(provider, provider_user_id)
);
```

---
---

# SECTION 5 — List UID Taxonomy (sl_ / SL-)

**Source:** Document 46: Future Deathstar v2.0 — `/shopnet-deathstar/46-FUTURE-DEATHSTAR.md`
**Source:** Document 47: THIS IS THE SND LAW v1.0 — `/taxonomy.shopnet/ThisIsTheLaw.md`
**Date:** February 6, 2026
**Authority:** TJL
**RDS Status:** Database `shopnet_registry` planned for Instance 2 (shopnet-crm-registry). Tables designed but not yet created.

---

## 5.1 list_uid Format

**Source:** Document 47, Part VIII.5 (lines 321-334) — `/taxonomy.shopnet/ThisIsTheLaw.md`
**Source:** Document 46, Section 8 (lines 406-417) — `/shopnet-deathstar/46-FUTURE-DEATHSTAR.md`
**Date:** February 6, 2026

| Attribute | Value |
|-----------|-------|
| **Prefix** | `sl_` |
| **Full Name** | Shopnet List |
| **v1 Format** | `SL-XXXXXXXX` (8-digit zero-padded sequential) |
| **v2 Format** | `sl_xxxxxxxxxxxx` (12 base36: 7 timestamp + 5 random) |
| **Entity Type** | Lists, registries, wishlists, collections |
| **Target Database** | `shopnet_registry` (Instance 2: shopnet-crm-registry) |
| **Required** | YES (for all list types) |
| **Mutable** | NO — NEVER CHANGES |
| **Assigned By** | Connect Gateway ONLY |
| **Never Reused** | Even after list deletion |
| **v1 Equivalent** | None (new in SND) |
| **Requires** | user_uid owner (lists are owned by users) |

---

## 5.2 List Subtypes (Level 3)

**Source:** Document 46, Section 20 (lines 1315-1322) — `/shopnet-deathstar/46-FUTURE-DEATHSTAR.md`
**Date:** February 6, 2026

| Type Code | Name | Description |
|-----------|------|-------------|
| `WL` | Wishlist | Amazon/product wishlists |
| `GR` | Gift Registry | Gift registries (birthday, wedding, baby shower) |
| `TD` | Todo | To-do lists |
| `DL` | Domain List | Domain wishlists |

---

## 5.3 The Pointer Pattern

**Source:** Document 46, Section 8 (lines 426-453) — `/shopnet-deathstar/46-FUTURE-DEATHSTAR.md`
**Source:** Document 47, Part VIII.7 (lines 353-389) — `/taxonomy.shopnet/ThisIsTheLaw.md`
**Date:** February 6, 2026

Lists reference external products and domains by their **natural identifiers**, not by proprietary UIDs.

- Amazon products → referenced by ASIN (e.g., B08N5WRWNW)
- Shopnet domains → referenced by domain name (e.g., foo.shop)
- Custom items → referenced by user-supplied description

**RULE:** If we did not create the entity, we do not UID the entity. We POINT to it using its natural identifier.

### Why No product_uid or domain_uid

**Source:** Document 46, Section 8 (lines 426-437)
**Date:** February 6, 2026

- Domains already have a natural unique identifier — the domain name itself
- Products have universal external identifiers — ASIN, ISBN, UPC/EAN
- Creating proprietary UIDs for entities we don't own violates DRY
- No third-party system would recognize our proprietary product_uid
- It adds a translation layer with zero benefit

---

## 5.4 list_items Table Design

**Source:** Document 46, Section 8 (lines 440-451) — `/shopnet-deathstar/46-FUTURE-DEATHSTAR.md`
**Date:** February 6, 2026
**Status:** DESIGNED — not yet created in RDS

```sql
CREATE TABLE list_items (
    list_uid        VARCHAR(11),        -- SL-XXXXXXXX (which list)
    item_type       VARCHAR(20),        -- 'product' | 'domain' | 'custom'
    external_ref    VARCHAR(255),       -- 'B08N5WRWNW' (ASIN) or '.shopping' (domain)
    ref_system      VARCHAR(50),        -- 'amazon_asin' | 'isbn' | 'shopnet_tld' | 'custom'
    quantity        INT DEFAULT 1,
    notes           TEXT,               -- 'Size M, blue'
    added_by        VARCHAR(11),        -- SU-XXXXXXXX (user_uid)
    added_at        TIMESTAMP DEFAULT NOW()
);
```

---

## 5.5 Sharing Model

**Source:** Document 46, Section 9 (lines 488-494) — `/shopnet-deathstar/46-FUTURE-DEATHSTAR.md`
**Date:** February 6, 2026

- Authenticated owner creates and edits lists
- Anyone with a share link can view (no registration required)
- Viewing a shared list should be anonymous (token-based URL)
- Only creating/editing lists requires authentication

---

## 5.6 shopnet_registry Database Schema (PLANNED)

**Source:** Document 46, Section 21 (lines 1541-1545) — `/shopnet-deathstar/46-FUTURE-DEATHSTAR.md`
**Date:** February 6, 2026
**Status:** PLANNED — designed, not yet created on RDS

```
shopnet_registry (Instance 2: shopnet-crm-registry — same instance as shopnet_crm)
├── list_taxonomy              sl_ UIDs, list type, owner su_ ref, status
├── list_items                 External refs (ASIN, domain name), quantities, notes
└── sharing_tokens             Public access tokens for shared list links
```

**3 tables planned.** CRM and registry share an RDS instance (cost efficiency) but are separate databases (logical isolation).

---

## 5.7 registry.shopnet Service (PLANNED)

**Source:** Document 46, Section 21 (lines 1567-1574) — `/shopnet-deathstar/46-FUTURE-DEATHSTAR.md`
**Date:** February 6, 2026
**Status:** Phase 3

| Attribute | Value |
|-----------|-------|
| **Service** | registry.shopnet |
| **Technology** | FastAPI |
| **Purpose** | List CRUD, sharing, item management |
| **Connects To** | shopnet_registry + snd.shopnet |
| **Phase** | Phase 3 |
| **Deployment** | Python FastAPI on Lightsail (same pattern as connect.shopnet) |

---
---

# SECTION 6 — Payment UID Taxonomy (sp_ / SP-)

**Source:** Document 46: Future Deathstar v2.0 — `/shopnet-deathstar/46-FUTURE-DEATHSTAR.md`
**Source:** Document 47: THIS IS THE SND LAW v1.0 — `/taxonomy.shopnet/ThisIsTheLaw.md`
**Date:** February 6, 2026
**Authority:** TJL
**RDS Status:** CONCEPTUAL ONLY — separate RDS instance required, no tables created.

---

## 6.1 payment_uid Format

**Source:** Document 47, Part VIII.6 (lines 338-350) — `/taxonomy.shopnet/ThisIsTheLaw.md`
**Source:** Document 46, Section 8 (lines 406-417) — `/shopnet-deathstar/46-FUTURE-DEATHSTAR.md`
**Date:** February 6, 2026

| Attribute | Value |
|-----------|-------|
| **Prefix** | `sp_` |
| **Full Name** | Shopnet Payment |
| **v1 Format** | `SP-XXXXXXXX` (8-digit zero-padded sequential) |
| **v2 Format** | `sp_xxxxxxxxxxxx` (12 base36: 7 timestamp + 5 random) |
| **Entity Type** | Payments, transactions, wallet operations |
| **Target Database** | `shopnet_payments` (FUTURE — Instance 3, separate from all others) |
| **Required** | YES (for all transaction types) |
| **Mutable** | NO — NEVER CHANGES |
| **Assigned By** | Connect Gateway ONLY |
| **Never Reused** | Even after transaction reversal |
| **v1 Equivalent** | None (new in SND) |
| **Requires** | user_uid payer (payments require a user) |
| **Append-Only** | Transaction records are NEVER deleted |

---

## 6.2 Payment Subtypes (Level 3)

**Source:** Document 46, Section 20 (lines 1315-1322) — `/shopnet-deathstar/46-FUTURE-DEATHSTAR.md`
**Date:** February 6, 2026

| Type Code | Name | Description |
|-----------|------|-------------|
| `WT` | Wallet Transfer | Wallet-to-wallet crypto transfer |
| `SB` | Subscription | Recurring payment |
| `RF` | Refund | Refund transaction |

---

## 6.3 DomainPay Concept

**Source:** Document 46, Section 4 (lines 73-85) — `/shopnet-deathstar/46-FUTURE-DEATHSTAR.md`
**Date:** February 6, 2026

Payment service using Web3 domain wallet-to-wallet transfers via Freename domains. "pay tim.uid" resolves to a wallet address, and the blockchain handles the actual transfer. Shopnet never touches funds — it's a resolver and facilitator.

### TLD Ownership (Freename)

| TLD | Purpose |
|-----|---------|
| `.uid` | Identity namespace |
| `.pmt` | Payment namespace |
| `.domainpay` | Payment branding |
| `.🛍️` | Retail namespace (shopping bag emoji) |
| `.🛒` | E-commerce namespace (shopping cart emoji) |

---

## 6.4 Honest Concerns

**Source:** Document 46, Section 9 (lines 496-519) — `/shopnet-deathstar/46-FUTURE-DEATHSTAR.md`
**Date:** February 6, 2026

1. **Regulatory minefield** — facilitating value transfer may classify as MSB (US), require MiCA (EU), or FCA (UK) registration
2. **Freename dependency** — entire concept rests on Freename's infrastructure (a startup)
3. **Adoption barrier** — both parties need crypto wallets; most e-commerce expects cards
4. **Volatility** — crypto pricing complexity; stablecoins help but add complexity
5. **Irreversibility** — blockchain transactions cannot be reversed; no chargebacks
6. **Single point of failure** — .uid as identity AND payment address; lose key = lose both

---

## 6.5 Recommended Phasing

**Source:** Document 46, Section 9 (lines 514-519) — `/shopnet-deathstar/46-FUTURE-DEATHSTAR.md`
**Date:** February 6, 2026

| Phase | Scope | Legal Risk |
|-------|-------|------------|
| **Phase 1** | Domain resolution only — map .uid/.pmt to wallet addresses. No payment processing, no funds touching. | Cleanest |
| **Phase 2** | Add "pay" button that initiates wallet-to-wallet via user's own wallet. Shopnet never touches funds. | Moderate — **get legal advice** |
| **Phase 3** | Proprietary .uid identity tied to wallet with recovery mechanisms. CRM and DomainPay converge. | Highest |

---

## 6.6 shopnet_payments Database Schema (CONCEPTUAL)

**Source:** Document 46, Section 21 (lines 1549-1561) — `/shopnet-deathstar/46-FUTURE-DEATHSTAR.md`
**Date:** February 6, 2026
**Status:** CONCEPTUAL — no CREATE TABLE statements, no RDS instance

```
shopnet_payments (FUTURE Instance 3 — MUST be separate from all others)
├── payment_taxonomy           sp_ UIDs, type (WT/SB/RF), payer/payee su_ refs
├── transaction_log            Timestamps, amounts, wallet addresses, chain, status
├── wallet_mappings            Domain (.uid/.pmt) → wallet address resolution cache
└── compliance_records         KYC data if/when required (Phase 3+)
```

**4 tables conceptual.** MUST be a separate RDS instance — separate credentials, separate access policies, audit logging enabled. No shared infrastructure with user or network data. AML/KYC, MiCA, FinCEN, FCA compliance requires strict isolation.

---

## 6.7 domainpay.shopnet Service (CONCEPTUAL)

**Source:** Document 46, Section 21 (lines 1567-1574) — `/shopnet-deathstar/46-FUTURE-DEATHSTAR.md`
**Date:** February 6, 2026
**Status:** Phase 4

| Attribute | Value |
|-----------|-------|
| **Service** | domainpay.shopnet |
| **Technology** | FastAPI |
| **Purpose** | Domain→wallet resolution, transaction logging |
| **Connects To** | shopnet_payments + Freename API + snd.shopnet |
| **Phase** | Phase 4 |
| **Deployment** | Python FastAPI on Lightsail (same pattern as connect.shopnet) |
