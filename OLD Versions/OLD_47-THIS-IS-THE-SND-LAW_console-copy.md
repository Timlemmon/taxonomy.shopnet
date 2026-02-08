# THIS IS THE SND LAW v1.0
**Declared:** February 6, 2026
**Authority:** TJL
**Version:** 1.0

**Supersedes:** None (extends Document 26: THIS IS THE LAW)
**Scope:** The ENTIRE SND namespace — all five UID types, v2 format, SND Monitor, First Law

---

## Table of Contents

### THE ZEROTH LAW
- [The Zeroth Law](#the-zeroth-law)

### PART VII: SND Architecture
1. [The Namespace](#vii1-the-namespace)
2. [v2 UID Format](#vii2-v2-uid-format)
3. [v2 Capacity](#vii3-v2-capacity)
4. [UID Routing](#vii4-uid-routing)
5. [Sole Issuer](#vii5-sole-issuer)

### PART VIII: The Five Prefixes
1. [Prefix Table](#viii1-prefix-table)
2. [sn_ (Sites)](#viii2-sn_-sites)
3. [sa_ (Agents)](#viii3-sa_-agents)
4. [su_ (Users)](#viii4-su_-users)
5. [sl_ (Lists)](#viii5-sl_-lists)
6. [sp_ (Payments)](#viii6-sp_-payments)
7. [The Pointer Pattern](#viii7-the-pointer-pattern)

### PART IX: The First Law
1. [User Authority](#ix1-user-authority)
2. [Delegation Model](#ix2-delegation-model)
3. [Authority Chain](#ix3-authority-chain)

### PART X: SND Validation Layer
1. [SND Monitor](#x1-snd-monitor)
2. [The Four Checks](#x2-the-four-checks)
3. [Validation Flow](#x3-validation-flow)

### PART XI: Database Topology
1. [Instance Map](#xi1-instance-map)
2. [Instance 1: amazon-products-db](#xi2-instance-1-amazon-products-db)
3. [Instance 2: shopnet-crm-registry](#xi3-instance-2-shopnet-crm-registry)
4. [The Master Index](#xi4-the-master-index)

### PART XII: Governance Hierarchy
1. [Three Levels of Governance](#xii1-three-levels-of-governance)
2. [Level 1: Namespace](#xii2-level-1-namespace)
3. [Level 2: Domains](#xii3-level-2-domains)
4. [Level 3: Entity Types](#xii4-level-3-entity-types)

### Appendix A: Migration from v1 to SND
1. [v1 Coexistence](#a1-v1-coexistence)
2. [Format Comparison](#a2-format-comparison)
3. [Migration Rules](#a3-migration-rules)

---

# THE ZEROTH LAW

> **"THE LAW exists to be re-written to improve and evolve. It exists so that at any given point in time the Entire System is compliant."**
> -- Tim, Founder

THE LAW is a living governance framework. It is versioned and evolves as the architecture evolves. When new capabilities, services, or compliance requirements are introduced, THE LAW is updated. All components of the Shopnet Network must comply with the **current version** of THE LAW at all times. No component should reference or operate under an outdated version.

Document 26 (THIS IS THE LAW) established governance for `site_uid` and `agent_uid` -- the first two UID types, using the v1 format (`SX-XXXXXXXX`). That document remains in force.

Document 47 (THIS IS THE SND LAW) extends governance to the **entire namespace**: all five UID types, the v2 format, the SND Monitor validation layer, the First Law of user authority, and the complete database topology. Where Document 26 governs the original two prefixes, Document 47 governs the system.

Compliance is not a snapshot -- it is continuous.

---

# PART VII: SND Architecture

The Shopnet Network Deathstar (SND) is the unified namespace and identity system for the entire Shopnet platform. Every entity that exists in the Shopnet ecosystem -- every site, every agent, every user, every list, every payment -- receives a UID issued by a single authority.

---

## VII.1 The Namespace

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

This is a deliberate design decision. Hierarchical identifiers (like file paths or OIDs) create coupling between the identifier and the structure. When the structure changes, identifiers break. Flat identifiers are permanent.

---

## VII.2 v2 UID Format

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
| **Mutable** | NO -- NEVER CHANGES |
| **Reusable** | NO -- NEVER REUSED |

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

### Why Base36

Base36 uses `0-9` and `a-z`. It is case-insensitive, URL-safe, human-readable, and database-friendly. No special characters. No uppercase/lowercase ambiguity. A 12-character base36 string encodes approximately 62 bits of information.

### Why Timestamp + Random

The 7 timestamp characters encode seconds since epoch in base36. This makes UIDs **naturally sortable by creation time** without a separate timestamp field. The 5 random characters prevent collisions when multiple UIDs are issued in the same second.

---

## VII.3 v2 Capacity

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

## VII.4 UID Routing

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

## VII.5 Sole Issuer

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

The Sole Issuer principle exists to guarantee **global uniqueness**. If two services can independently generate UIDs, collisions become possible. If one service generates all UIDs, collisions are impossible by construction.

This mirrors how DNS works: only the authoritative nameserver for a zone can create records in that zone. Connect Gateway is the authoritative nameserver for the SND namespace.

---

# PART VIII: The Five Prefixes

Every entity in the Shopnet ecosystem belongs to exactly one of five types. Each type has a two-character prefix. This is THE LAW.

---

## VIII.1 Prefix Table

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

---

## VIII.2 sn_ (Sites)

| Attribute | Value |
|-----------|-------|
| **Prefix** | `sn_` |
| **Full Name** | Shopnet Network |
| **Entity Type** | Sites, endpoints, network infrastructure |
| **Target Database** | `shopnet_sites` |
| **v1 Equivalent** | `SN-XXXXXXXX` (site_uid) |
| **Examples** | `sn_a1b2c3d4e5f6`, `sn_000000000001` |

Every network endpoint receives a site UID. Websites, databases, nodes, infrastructure components -- anything that exists as an addressable endpoint on the Shopnet network gets an `sn_` identifier. This is the foundation of the namespace. Document 26 Part I governs the original `SN-XXXXXXXX` format; this document extends governance to the `sn_` v2 format.

---

## VIII.3 sa_ (Agents)

| Attribute | Value |
|-----------|-------|
| **Prefix** | `sa_` |
| **Full Name** | Shopnet Assist |
| **Entity Type** | AI agents, automated assistants |
| **Target Database** | `shopnet_assist` |
| **v1 Equivalent** | `SA-XXXXXXXX` (agent_uid) |
| **Examples** | `sa_a1b2c3d4e5f6`, `sa_000000000001` |

Every AI agent receives an agent UID in addition to its site UID. An agent is both a network endpoint (it gets an `sn_` UID) and an operational agent (it gets an `sa_` UID). The `sa_` UID identifies the agent's role, configuration, and capabilities. Document 26 Part VI governs the original `SA-XXXXXXXX` format; this document extends governance to the `sa_` v2 format.

---

## VIII.4 su_ (Users)

| Attribute | Value |
|-----------|-------|
| **Prefix** | `su_` |
| **Full Name** | Shopnet User |
| **Entity Type** | Human users, customer accounts |
| **Target Database** | `shopnet_crm` |
| **v1 Equivalent** | None (new in SND) |
| **Examples** | `su_a1b2c3d4e5f6`, `su_000000000001` |

Every human user who interacts with the Shopnet ecosystem receives a user UID. This is the cross-site identity. A user authenticates once (via OAuth or future blockchain identity) and their `su_` UID follows them across every Shopnet endpoint. The user UID is the anchor for shopping history, preferences, memberships, consent records, and list ownership.

**THE FIRST LAW applies here.** The `su_` UID has ultimate authority. See Part IX.

---

## VIII.5 sl_ (Lists)

| Attribute | Value |
|-----------|-------|
| **Prefix** | `sl_` |
| **Full Name** | Shopnet List |
| **Entity Type** | Lists, registries, wishlists, collections |
| **Target Database** | `shopnet_registry` |
| **v1 Equivalent** | None (new in SND) |
| **Examples** | `sl_a1b2c3d4e5f6`, `sl_000000000001` |

Every list or registry created in the Shopnet ecosystem receives a list UID. Gift registries, wishlists, domain wishlists, to-do lists, curated collections -- any structured list a user creates gets an `sl_` identifier. Lists are owned by users (linked via `su_` UID) and may be shared via share links.

Lists reference external products and domains using the **Pointer Pattern** (see VIII.7).

---

## VIII.6 sp_ (Payments)

| Attribute | Value |
|-----------|-------|
| **Prefix** | `sp_` |
| **Full Name** | Shopnet Payment |
| **Entity Type** | Payments, transactions, wallet operations |
| **Target Database** | `shopnet_payments` |
| **v1 Equivalent** | None (new in SND) |
| **Examples** | `sp_a1b2c3d4e5f6`, `sp_000000000001` |

Every payment or transaction in the Shopnet ecosystem receives a payment UID. This covers wallet-to-wallet transfers, domain-based payments (via Freename/.uid), and any future transaction types. The `sp_` UID provides an auditable, immutable record of every financial event.

---

## VIII.7 The Pointer Pattern

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

The list has a UID. The items inside are pointers. This keeps the namespace clean and avoids the trap of trying to index a third-party product database.

---

# PART IX: The First Law

---

## IX.1 User Authority

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

The First Law establishes the relationship between human users (`su_`) and AI agents (`sa_`). In the Shopnet ecosystem, agents exist to serve users. They do not have independent authority. Every action an agent takes on behalf of a user requires delegation -- either explicit (the user clicked a button) or configured (the user set a preference).

This is not merely a UX principle. It is an architectural constraint. The data model enforces it. The API enforces it. The audit log records it.

---

## IX.2 Delegation Model

```
                         DELEGATION MODEL
                         ----------------

    User (su_)                    Agent (sa_)
        |                             |
        |   "Show me product recs"    |
        |---------------------------->|
        |                             |
        |                             |  Agent acts WITH user context
        |                             |  Agent reads ONLY permitted data
        |                             |  Agent writes ONLY to permitted scope
        |                             |
        |   <-- recommendations ------|
        |                             |
        |   "Add this to my list"     |
        |---------------------------->|
        |                             |
        |                             |  Agent writes to user's list
        |                             |  uid_issuance_log records:
        |                             |    who: sa_XXXX
        |                             |    for: su_XXXX
        |                             |    what: sl_XXXX (new list item)
        |                             |
        |   <-- confirmation ---------|
        |                             |

    Every agent action is:
      1. Initiated by user (su_)
      2. Executed by agent (sa_)
      3. Recorded in audit log
      4. Revocable by user
```

---

## IX.3 Authority Chain

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

# PART X: SND Validation Layer

The SND Monitor is the compliance engine of the namespace. It validates that every UID in the system conforms to THE LAW.

---

## X.1 SND Monitor

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
|   Data sources:                                                       |
|     - uid_registry (master index in shopnet_connect)                  |
|     - uid_issuance_log (audit trail in shopnet_connect)               |
|     - Target databases (shopnet_sites, shopnet_assist, etc.)          |
|                                                                       |
+-----------------------------------------------------------------------+
```

---

## X.2 The Four Checks

| # | Check | What It Validates | Failure Means |
|---|-------|-------------------|---------------|
| 1 | **Uniqueness** | No two entities share the same UID across the entire namespace | Collision detected -- critical failure |
| 2 | **Consistency** | Every UID in a target database also exists in uid_registry | Orphan UID -- issued outside Connect Gateway |
| 3 | **Immutability** | No UID has been modified after issuance | UID tampering -- integrity violation |
| 4 | **Audit** | Every UID in uid_registry has a corresponding entry in uid_issuance_log | Missing audit trail -- issuance not recorded |

```
+-----------------------------------------------------------------------+
|                       THE FOUR CHECKS                                  |
+-----------------------------------------------------------------------+
|                                                                       |
|   CHECK 1: UNIQUENESS                                                 |
|   -------------------                                                 |
|   For every UID in uid_registry:                                      |
|     - No duplicate exists in uid_registry                             |
|     - No duplicate exists in any target database                      |
|     - Cross-prefix uniqueness (sn_X != sa_X by construction,          |
|       but verify no prefix corruption)                                |
|                                                                       |
|   CHECK 2: CONSISTENCY                                                |
|   --------------------                                                |
|   For every UID in each target database:                              |
|     - A matching record exists in uid_registry                        |
|     - The prefix matches the target database                          |
|       (sn_ in shopnet_sites, sa_ in shopnet_assist, etc.)             |
|     - The entity type recorded in uid_registry matches reality        |
|                                                                       |
|   CHECK 3: IMMUTABILITY                                               |
|   ---------------------                                               |
|   For every UID in uid_registry:                                      |
|     - The UID value has not changed since issuance                    |
|     - The prefix has not changed                                      |
|     - The entity type has not changed                                 |
|     - Compare against uid_issuance_log original values                |
|                                                                       |
|   CHECK 4: AUDIT                                                      |
|   --------------                                                      |
|   For every UID in uid_registry:                                      |
|     - A corresponding record exists in uid_issuance_log               |
|     - The issuance timestamp is present                               |
|     - The issuer (Connect Gateway) is recorded                        |
|     - The requesting service is recorded                              |
|                                                                       |
+-----------------------------------------------------------------------+
```

---

## X.3 Validation Flow

```
                      SND MONITOR VALIDATION FLOW
                      ----------------------------

    uid_registry              SND Monitor              Target DBs
    (master index)                |                    (shopnet_sites,
         |                        |                     shopnet_assist,
         |                        |                     shopnet_crm, etc.)
         |                        |                         |
         |  <-- Read all UIDs ----|                         |
         |                        |                         |
         |  --- UID list -------->|                         |
         |                        |                         |
         |                        |--- Read all UIDs ----->|
         |                        |                         |
         |                        |<-- UID list -----------|
         |                        |                         |
         |                        |                         |
         |          +-------------+-------------+           |
         |          |                           |           |
         |          |  CHECK 1: Uniqueness      |           |
         |          |  CHECK 2: Consistency     |           |
         |          |  CHECK 3: Immutability    |           |
         |          |  CHECK 4: Audit           |           |
         |          |                           |           |
         |          +-------------+-------------+           |
         |                        |                         |
         |                        |                         |
         |                   [PASS / FAIL]                  |
         |                        |                         |
         |                   PASS: log clean report         |
         |                   FAIL: flag + quarantine        |
         |                        |                         |
```

---

# PART XI: Database Topology

The SND namespace spans two RDS instances. This is the physical reality of where data lives.

---

## XI.1 Instance Map

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

---

## XI.2 Instance 1: amazon-products-db

| Database | Purpose | UID Prefix | Status |
|----------|---------|------------|--------|
| `shopnet_data` | General platform data, shared resources | -- | Active |
| `shopnet_sites` | Sites, endpoints, endpoint taxonomy, domain configs | `sn_` | Active |
| `shopnet_assist` | Agent configurations, agent registry, agent platforms | `sa_` | Active |
| `amazon_products` | Amazon product catalog, domain inventory (domains_unused) | -- | Active |
| `KPI_Source` | Analytics dashboards, KPI data, reporting | -- | Active |
| `shopnet_connect` | Connect Gateway state, uid_registry, uid_issuance_log | -- | Active |

Instance 1 is the **operational core**. It holds the network (sites + agents), the product data, the analytics, and critically, Connect Gateway's own database (`shopnet_connect`) which contains the master UID registry.

---

## XI.3 Instance 2: shopnet-crm-registry

| Database | Purpose | UID Prefix | Status |
|----------|---------|------------|--------|
| `shopnet_crm` | User accounts, profiles, shopping history, preferences, consent | `su_` | New |
| `shopnet_registry` | Lists, gift registries, wishlists, curated collections | `sl_` | New |

Instance 2 is the **user-facing data store**. It holds everything that belongs to or is created by users. This separation is deliberate: user data has different access patterns, different privacy requirements, and different backup policies than operational network data.

---

## XI.4 The Master Index

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

# PART XII: Governance Hierarchy

The SND namespace is governed at three levels. Each level has a clear scope and clear rules.

---

## XII.1 Three Levels of Governance

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

---

## XII.2 Level 1: Namespace

| Attribute | Value |
|-----------|-------|
| **Name** | `snd.shopnet` |
| **Scope** | The entire SND namespace |
| **Authority** | THE LAW (Document 26 + Document 47) |
| **Enforced By** | Connect Gateway |
| **Validated By** | SND Monitor |

Level 1 rules apply to ALL UIDs regardless of type:
- Every UID is issued by Connect Gateway (sole issuer)
- Every UID is globally unique (no collisions, no reuse)
- Every UID is immutable (never changes after issuance)
- Every UID is recorded in uid_registry and uid_issuance_log
- Every UID follows the v2 format (or valid v1 format for legacy)

---

## XII.3 Level 2: Domains

| Domain | Prefixes | Scope | Instance |
|--------|----------|-------|----------|
| **Network** | `sn_`, `sa_` | Infrastructure, endpoints, agents | Instance 1 |
| **Identity** | `su_` | Users, authentication, profiles | Instance 2 |
| **Content** | `sl_` | Lists, registries, user-created data | Instance 2 |
| **Transactions** | `sp_` | Payments, wallet operations | TBD |

Level 2 rules are domain-specific:
- **Network**: Agents require both `sn_` and `sa_` UIDs (two-level identity, per Document 26 Part VI)
- **Identity**: `su_` data is subject to privacy rules; user has ultimate authority (First Law)
- **Content**: Lists reference external entities by pointer, not by UID (Pointer Pattern)
- **Transactions**: `sp_` records are append-only; no transaction is ever deleted

---

## XII.4 Level 3: Entity Types

Level 3 governs the specific schemas, validation rules, and business logic for each entity type within a domain. These rules are defined in the target database schemas and enforced by the services that manage those databases.

Level 3 rules are the most granular and the most likely to change. When they change, they change within the constraints of Level 2 (domain rules) and Level 1 (namespace rules). A Level 3 rule can never contradict a Level 2 or Level 1 rule.

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

# Appendix A: Migration from v1 to SND

---

## A.1 v1 Coexistence

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
|   The system MUST accept and route both formats.                      |
|   Any service that receives a UID must handle:                        |
|     - SN-XXXXXXXX  (v1 site)                                         |
|     - SA-XXXXXXXX  (v1 agent)                                        |
|     - sn_xxxxxxxxxxxx  (v2 site)                                      |
|     - sa_xxxxxxxxxxxx  (v2 agent)                                     |
|     - su_xxxxxxxxxxxx  (v2 user)                                      |
|     - sl_xxxxxxxxxxxx  (v2 list)                                      |
|     - sp_xxxxxxxxxxxx  (v2 payment)                                   |
|                                                                       |
+-----------------------------------------------------------------------+
```

---

## A.2 Format Comparison

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
| **Collision Risk** | None (sequential) | Negligible (~60.5M/sec headroom) |

```
                    FORMAT COMPARISON
                    ------------------

    v1:   S N - 0 0 0 0 0 0 4 7
          --- - ----------------
          prefix  8-digit sequential

    v2:   s n _ a 1 b 2 c 3 d 4 e 5 f 6
          --- - ------------------------
          prefix  7 timestamp + 5 random (base36)

    v1 is simple. v2 is scalable.
    Both are valid. Both are permanent.
```

---

## A.3 Migration Rules

1. **No forced migration.** Existing v1 UIDs are permanent. There is no project to convert `SN-00000047` to `sn_xxxxxxxxxxxx`. The entity keeps its original UID forever.

2. **New issuance uses v2.** All new UIDs issued by Connect Gateway use the v2 format. The v1 sequential counters stop incrementing once v2 issuance begins.

3. **uid_registry stores both.** The master index accommodates both formats. The `uid` column is `VARCHAR(15)` to handle the longer v2 format. v1 UIDs (11 characters) fit within this.

4. **Routing handles both.** Any service that parses UID prefixes must recognize both `SN-` (v1 uppercase with hyphen) and `sn_` (v2 lowercase with underscore) as routing to `shopnet_sites`. Same for `SA-`/`sa_` routing to `shopnet_assist`.

5. **SND Monitor validates both.** The four checks (Uniqueness, Consistency, Immutability, Audit) apply equally to v1 and v2 UIDs. A v1 UID is not exempt from validation.

6. **No version hierarchy.** A v2 UID is not "better" than a v1 UID. They are different formats of the same namespace. `SN-00000001` and `sn_a1b2c3d4e5f6` have equal standing.

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Feb 6, 2026 | Initial SND LAW -- complete namespace governance: 5 prefixes, v2 format, SND Monitor, First Law, database topology, governance hierarchy, v1 coexistence |

---

**THIS IS THE SND LAW v1.0 -- TJL**
