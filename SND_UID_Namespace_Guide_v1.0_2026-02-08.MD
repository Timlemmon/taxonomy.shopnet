# SND UID Namespace Guide
**Date:** February 8, 2026
**Version:** v1.0
**Authority:** TJL
**Authors:** TJL, Claude (Opus 4.6)
**Status:** Reference Guide — derived from ThisIsTheLaw v5.0 and Deathstar Master v5.0

**This document is a summary guide to the SND UID namespace system.
For the definitive governance specification, see ThisIsTheLaw v5.0.**

**Source Documents:**
- `ThisIsTheLaw_v5.0_2026-02-07.MD` — `/taxonomy.shopnet/` (DEFINITIVE)
- `Shopnet-Deathstar-Master_v5.0_2026-02-07.MD` — `/shopnet-deathstar/` (Architecture blueprint)
- `uid_generator.py` — `/connect.shopnet/backend/snd/uid_generator.py` (Code)
- `uid_registry.py` — `/connect.shopnet/backend/snd/uid_registry.py` (Code)
- `snd_monitor.py` — `/connect.shopnet/backend/snd/snd_monitor.py` (Code)
- `001_uid_registry.sql` — `/connect.shopnet/backend/sql/001_uid_registry.sql` (Schema)

---
---

# PART I — WHAT IS SND?

## 1.1 Overview

SND stands for **Shopnet Network Deathstar** — "DNS Backwards."

DNS resolves human-readable names to machine addresses.
SND resolves machine-generated UIDs to human-readable entities.

```
+-----------------------------------------------------------------------+
|                                                                       |
|                          snd.shopnet                                  |
|                                                                       |
|   "DNS Backwards" — the Shopnet Network Deathstar namespace           |
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

## 1.2 Design Principles

| Principle | Description |
|-----------|-------------|
| **Flat Namespace** | No hierarchy in UIDs — relationships are stored in tables, not in identifiers |
| **Self-Routing** | The 2-character prefix routes any UID to its target database without a central lookup |
| **Sole Issuer** | Connect Gateway is the ONLY service that can create UIDs — this is THE LAW |
| **Immutable** | A UID never changes and is never reused once issued |
| **Audited** | Every issuance is recorded in the uid_issuance_log — the blockchain-equivalent audit trail |
| **Pointer Pattern** | External entities (Amazon products, domains) are referenced by their natural IDs, never given Shopnet UIDs |
| **The First Law** | The user (su_) has ultimate authority — agents can only act by user delegation |

---
---

# PART II — UID TYPES

## 2.1 The Five Prefixes

SND defines five UID prefixes. Each prefix identifies a category of entity and routes to a specific database.

| Prefix | Full Name | Entity Type | Target Database | RDS Instance | Status |
|--------|-----------|-------------|-----------------|--------------|--------|
| `sn_` | Shopnet Network | Sites, endpoints, infrastructure | `shopnet_sites` | Instance 1 | LIVE |
| `sa_` | Shopnet Assist | AI agents, automated assistants | `shopnet_assist` | Instance 1 | LIVE |
| `su_` | Shopnet User | Human users, customer accounts | `shopnet_crm` | Instance 2 | DESIGNED |
| `sl_` | Shopnet List | Lists, registries, wishlists | `shopnet_registry` | Instance 2 | DESIGNED |
| `sp_` | Shopnet Payment | Payments, transactions, wallets | `shopnet_payments` | Future | FUTURE |

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

## 2.2 sn_ — Sites and Endpoints [LIVE]

| Attribute | Value |
|-----------|-------|
| **Prefix** | `sn_` |
| **Full Name** | Shopnet Network |
| **Entity Type** | Sites, endpoints, network infrastructure |
| **Target Database** | `shopnet_sites` |
| **v1 Equivalent** | `SN-XXXXXXXX` (site_uid) |
| **Examples** | `sn_a1b2c3d4e5f6`, `SN-00000100` |

Every network endpoint receives a site UID. Websites, databases, nodes, infrastructure components — anything that exists as an addressable endpoint on the Shopnet network gets an `sn_` identifier. The `endpoint_taxonomy` table in `shopnet_sites` holds the master record for each site.

**Human Use Case — Register a Web Store:**
> Maria wants to sell handmade candles online. She signs up at shopnet.network and registers her store "Wax & Wick." Connect Gateway issues `sn_m4k7r2p9x1v3` for her store endpoint. This UID is her store's permanent identity on the network — it appears in her pulse monitoring, her taxonomy record, and any agent configurations tied to the store. Even if she changes her store name or domain, the UID never changes.

## 2.3 sa_ — Agents [LIVE]

| Attribute | Value |
|-----------|-------|
| **Prefix** | `sa_` |
| **Full Name** | Shopnet Assist |
| **Entity Type** | AI agents, automated assistants |
| **Target Database** | `shopnet_assist` |
| **v1 Equivalent** | `SA-XXXXXXXX` (agent_uid) |
| **Examples** | `sa_b8n3q5t1y7w2`, `SA-00000050` |

Every AI agent receives an agent UID **in addition to** its site UID. An agent is both a network endpoint (it gets an `sn_` UID) and an operational agent (it gets an `sa_` UID). The agent UID tracks its configuration, capabilities, and delegation permissions.

**Human Use Case — Deploy a Document Manager Agent:**
> James runs a consulting firm with hundreds of client documents. He creates a Shopnet Assist agent configured to organize, tag, and summarize his documents. Connect Gateway issues `sa_j2f6h8k4m9p1` for the agent. James can now reference this agent by its UID across any Shopnet service — delegating it permission to read his document library, setting up scheduled tasks, or reviewing its activity logs. If he wants to pause or revoke the agent's access, the UID lets him target exactly this agent without ambiguity.

## 2.4 su_ — Users [DESIGNED]

| Attribute | Value |
|-----------|-------|
| **Prefix** | `su_` |
| **Full Name** | Shopnet User |
| **Entity Type** | Human users, customer accounts |
| **Target Database** | `shopnet_crm` |
| **v1 Equivalent** | None (new in SND) |
| **Examples** | `su_c5r9w2g7l4n8`, `su_000000000001` |

Every human user who interacts with the Shopnet ecosystem receives a user UID. This is the **cross-site identity**. A user authenticates once (via OAuth or future blockchain identity) and their `su_` UID follows them across every Shopnet endpoint.

**THE FIRST LAW applies to this prefix.** The `su_` UID has ultimate authority over agents, lists, and payment operations. See Section 3.3.

**Human Use Case — Cross-Site Consumer Identity:**
> Priya shops at three different Shopnet stores — one for electronics, one for books, one for craft supplies. When she signs up, Connect Gateway issues `su_p7t3v9x5b2d8`. Her single user UID lets her maintain one wishlist across all three stores, see a unified order history, and manage all her agent delegations from one place. If she registers at a new store, her `su_` UID carries her preferences and history without creating yet another account.

## 2.5 sl_ — Lists and Registries [DESIGNED]

| Attribute | Value |
|-----------|-------|
| **Prefix** | `sl_` |
| **Full Name** | Shopnet List |
| **Entity Type** | Lists, registries, wishlists, collections |
| **Target Database** | `shopnet_registry` |
| **v1 Equivalent** | None (new in SND) |
| **Examples** | `sl_d6s1u8y3a7e4`, `sl_000000000001` |

Every list or registry created in the Shopnet ecosystem receives a list UID. Gift registries, wishlists, domain wishlists, to-do lists, curated collections — any structured list a user creates gets an `sl_` identifier. Lists are owned by users (linked via `su_` UID) and may be shared via secure share tokens.

Lists reference external products and domains using the **Pointer Pattern** (see Section 3.2) — items inside a list are pointers to external natural identifiers (ASINs, domain names), not Shopnet UIDs.

**Human Use Case — Wedding Gift Registry:**
> Alex and Jordan are getting married. They create a gift registry on Shopnet, and Connect Gateway issues `sl_a3j7m2p8r5w1` for the list. They add items from multiple stores — an espresso machine (ASIN B08N5WRWNW from an electronics store), a pottery set (from a craft store), and the domain "alexjordan.love" (from Shopnet Domains). Each item is a pointer, not a UID. They share the registry via a secure link. When guests purchase items, the list updates across all source stores in real time.

## 2.6 sp_ — Payments [FUTURE]

| Attribute | Value |
|-----------|-------|
| **Prefix** | `sp_` |
| **Full Name** | Shopnet Payment |
| **Entity Type** | Payments, transactions, wallet operations |
| **Target Database** | `shopnet_payments` |
| **v1 Equivalent** | None (new in SND) |
| **Examples** | `sp_e2f8h4k6n9q1`, `sp_000000000001` |

Every payment or transaction in the Shopnet ecosystem will receive a payment UID. This covers wallet-to-wallet transfers, domain-based payments (via Freename/.uid), and any future transaction types.

**Human Use Case — Peer-to-Peer Domain Payment:**
> Carlos sells a premium domain "golden.shop" to Dana. The transaction is issued `sp_c4d9g3k7m1r6`. This payment UID permanently records the transfer: who paid, who received, what was transferred, and when. Both Carlos and Dana can reference this UID in disputes, tax records, or account history. The payment UID is linked to both their `su_` UIDs and the domain's natural identifier.

---
---

# PART III — SYSTEM ARCHITECTURE

## 3.1 Self-Routing

Every v2 UID is self-routing. The 2-character prefix tells any system exactly which database to query. No central directory lookup is needed.

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
    Route: prefix "sn_" → shopnet_sites → query by UID

    Given: su_x9y8z7w6v5u4
    Route: prefix "su_" → shopnet_crm → query by UID
```

Any service receiving a UID parses the first two characters and routes directly. The `uid_registry` table exists for validation and audit, not for routing.

**Implementation:** `uid_generator.py` — `PREFIX_ROUTES` dict and `get_routes_for_prefix()` function.

## 3.2 The Pointer Pattern

SND follows a strict principle: **if we did not create the entity, we do not UID the entity.** External products, domains, and third-party resources are referenced by their natural identifiers.

```
+-----------------------------------------------------------------------+
|                       THE POINTER PATTERN                              |
+-----------------------------------------------------------------------+
|                                                                       |
|   Amazon products  →  referenced by ASIN (e.g., B08N5WRWNW)          |
|   Shopnet domains  →  referenced by domain name (e.g., foo.shop)      |
|   Custom items     →  referenced by user-supplied description         |
|                                                                       |
|   RULE: If we did not create the entity, we do not UID the entity.    |
|   We POINT to it using its natural identifier.                        |
|                                                                       |
+-----------------------------------------------------------------------+
```

**Example — A Wishlist:**
```
    sl_a1b2c3d4e5f6   (the list — we own this, we UID it)
        |
        +-- item 1: ASIN B08N5WRWNW    (Amazon product — pointer)
        +-- item 2: ASIN B09V3KXJPB    (Amazon product — pointer)
        +-- item 3: domain "cool.shop"  (Shopnet domain — pointer)
        +-- item 4: "Blue running shoes size 10"  (custom — text)
```

The list has a UID. The items inside are pointers.

## 3.3 The First Law

The user UID (`su_`) has **ultimate authority** in the SND hierarchy. This is a foundational governance principle.

```
+-----------------------------------------------------------------------+
|                         THE FIRST LAW                                 |
+-----------------------------------------------------------------------+
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

```
   Level 1: THE LAW (governance specification)
     |   Defines what UIDs exist and how they are governed
     |
   Level 2: Connect Gateway (sole issuer)
     |   Enforces THE LAW through code
     |
   Level 3: User (su_)
     |   Has authority over their own data and delegations
     |
   Level 4: Agent (sa_)
         Acts only by delegation from Level 3
         Cannot escalate to Level 2 or Level 1
```

An agent cannot modify THE LAW. An agent cannot bypass Connect Gateway. An agent cannot override a user. An agent can only do what a user has permitted.

## 3.4 Sole Issuer

Connect Gateway is the **sole issuer** of all UIDs. This is non-negotiable.

1. No other service may generate a UID
2. No other service may assign a UID
3. No other service may predict the next UID
4. All UID requests go through Connect Gateway
5. Connect Gateway records every issuance in `uid_issuance_log`
6. Connect Gateway writes every UID to `uid_registry`

**Implementation:** `uid_registry.py` — `create_uid()` is the only function that issues UIDs. It generates via `uid_generator.py`, writes to `uid_registry`, and logs to `uid_issuance_log` in a single atomic transaction.

## 3.5 Identity Hierarchy

```
SHOPNET NETWORK IDENTITY HIERARCHY

Level 0: Endpoints          sn_xxxxxxxxxxxx  (site_uid)
  Level 1: Agents           sa_xxxxxxxxxxxx  (agent_uid)     [requires Level 0]
  Level 1: Users            su_xxxxxxxxxxxx  (user_uid)      [independent]
  Level 1: Lists            sl_xxxxxxxxxxxx  (list_uid)      [requires user_uid owner]
  Level 1: Payments         sp_xxxxxxxxxxxx  (payment_uid)   [requires user_uid payer]

External References (NOT owned by Shopnet):
  Products:                 ASIN / ISBN / UPC  (Amazon, books, retail)
  Domains:                  domain_name        (already unique in TLDs table)
  Wallets:                  0x...              (blockchain address)
```

The **site_uid** taxonomy pattern mirrors the **user_uid** taxonomy pattern:

**Site Side (LIVE):**
```
Connect Gateway issues sn_ (site_uid)
  → stored in endpoint_taxonomy table
    → branches to: website_data (content)
    → branches to: agent_data (sa_ agent_uid)
    → branches to: pulse_data (monitoring)
```

**User Side (DESIGNED):**
```
Connect Gateway issues su_ (user_uid)
  → stored in user_taxonomy table
    → branches to: user_profiles (CRM data)
    → branches to: user_site_registrations (which sites)
    → branches to: user_delegations (which agents authorized)
    → branches to: user_wallets (Web3 addresses)
    → branches to: user_oauth (auth provider tokens)
```

---
---

# PART IV — UID FORMAT AND CREATION

## 4.1 v2 UID Format (Current)

| Attribute | Value |
|-----------|-------|
| **Format** | `xx_xxxxxxxxxxxx` |
| **Total Length** | 15 characters |
| **Prefix** | 2-character type code |
| **Separator** | Underscore `_` |
| **Body** | 12 base36 characters |
| **Body Structure** | 7 timestamp chars + 5 random chars |
| **Character Set** | `0-9`, `a-z` (lowercase only, 36 symbols) |
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

### How v2 UIDs Are Generated

1. **Prefix** — The caller specifies the entity type (e.g., `sn`, `sa`, `su`)
2. **Timestamp** — `int(time.time())` is converted to 7-character base36 — provides second-precision ordering
3. **Random** — 5 characters of cryptographic randomness (`secrets.randbelow(36)`) — prevents collision
4. **Assembly** — `{prefix}_{timestamp}{random}` = 15-character UID

**Code:** `uid_generator.py` — `generate_uid_v2(prefix)`

```python
def generate_uid_v2(prefix: str) -> str:
    timestamp = int(time.time())
    ts_b36 = _to_base36(timestamp, 7)
    rand_b36 = _random_base36(5)
    return f"{prefix}_{ts_b36}{rand_b36}"
```

## 4.2 v1 UID Format (Legacy)

| Attribute | Value |
|-----------|-------|
| **Format** | `SX-XXXXXXXX` |
| **Total Length** | 11 characters |
| **Prefix** | 2 uppercase letters (SN, SA) |
| **Separator** | Hyphen `-` |
| **Body** | 8-digit zero-padded sequential number |
| **Capacity** | 99,999,999 per prefix |
| **Status** | NEVER RETIRED — v1 and v2 coexist |

```
    SN-00000100   →  v1 site UID (sequential)
    SA-00000050   →  v1 agent UID (sequential)
```

The `validate_uid()` function in `uid_generator.py` recognizes both formats:
- v1 pattern: `^S[A-Z]-\d{8}$`
- v2 pattern: `^[a-z]{2}_[0-9a-z]{12}$`

Both versions coexist permanently. v1 UIDs remain valid and routable.

## 4.3 UID Creation Process

When a new UID is requested, the full creation process is:

```
Request → Connect Gateway → uid_registry.py: create_uid()
                                |
                                +→ 1. Validate prefix (must be sn, sa, su, sl, or sp)
                                +→ 2. Look up target database (PREFIX_ROUTES)
                                +→ 3. Generate v2 UID (uid_generator.py)
                                +→ 4. INSERT INTO uid_registry (with UNIQUE PK constraint)
                                +→ 5. INSERT INTO uid_issuance_log (audit trail)
                                +→ 6. COMMIT (atomic — both writes succeed or both fail)
                                +→ 7. Return UID to caller
```

If step 4 hits a primary key collision (astronomically unlikely), the system retries up to 5 times with a newly generated UID.

## 4.4 Duplicate Prevention — Four Layers

SND employs four layers of duplicate prevention:

| Layer | Mechanism | Description |
|-------|-----------|-------------|
| **1. Mathematical** | Timestamp + random | 60.5M unique values per second per prefix — collision probability is negligible |
| **2. Database** | `PRIMARY KEY (uid)` | PostgreSQL enforces absolute uniqueness at the storage level |
| **3. Application** | 5-attempt retry loop | If a collision occurs (PK violation), `create_uid()` generates a new UID and retries up to 5 times |
| **4. Monitoring** | SND Monitor — Check 1 | `check_uniqueness()` periodically scans for any corruption that bypassed the PK constraint |

**The UNIQUE constraint is the lock on the door. The SND Monitor is the security camera.**

---
---

# PART V — SCALABILITY AND CAPACITY

## 5.1 v2 Capacity Analysis

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
|     (4,738,381,338,321,616,896)                                       |
|                                                                       |
|   For comparison:                                                     |
|     v1 (SX-XXXXXXXX):   99,999,999 total per prefix                  |
|     v2 (xx_xxxxxxxxxxxx): 4.7 quintillion total per prefix            |
|                                                                       |
|   The IPv4 problem will not occur in our lifetimes.                   |
|                                                                       |
+-----------------------------------------------------------------------+
```

## 5.2 Expandability

The SND namespace is designed for expansion:

| Expansion Vector | Mechanism | Capacity |
|-----------------|-----------|----------|
| **New entity types** | Add new 2-letter prefix to `PREFIX_ROUTES` | 676 possible prefixes (26 x 26) — only 5 used today |
| **New databases** | Map new prefix to new database in routing table | Unlimited — each prefix routes independently |
| **New RDS instances** | Add connection config in snd_monitor.py | SND Monitor already handles multi-instance checks |
| **Higher throughput** | Random component handles 60.5M UIDs/second | Far exceeds any foreseeable demand |
| **Longer UIDs** | Increase body length if needed (currently 12) | Each additional base36 char multiplies capacity by 36x |

Adding a new UID type requires:
1. Add prefix to `PREFIX_ROUTES` in `uid_generator.py`
2. Create target database and tables
3. Add consistency check in `snd_monitor.py`
4. Add API routes in `shopnet_connect_api.py`
5. Update THE LAW documentation

The 2-character prefix system gives 676 possible entity types. With 5 in use, there is room for 671 more — likely more than will ever be needed.

---
---

# PART VI — SND vs DNS AND COMPARABLE SYSTEMS

## 6.1 SND vs DNS

SND was explicitly designed as "DNS Backwards." The parallel is structural, not coincidental:

| Concept | DNS | SND |
|---------|-----|-----|
| **Purpose** | Resolve names → addresses | Resolve UIDs → entities |
| **Zone File** | DNS zone files | `uid_registry` table |
| **Authority** | ICANN | Connect Gateway |
| **Structure** | Hierarchical (subdomains) | Flat (all UIDs at same level) |
| **Identifiers** | Variable-length domain names | Fixed 15-char UIDs (v2) |
| **Routing** | Recursive delegation (root → TLD → authoritative) | Instant prefix-based routing (2 chars → target database) |
| **Uniqueness** | Registrar enforcement | PK constraint + SND Monitor |
| **Audit** | WHOIS records | `uid_issuance_log` |
| **Mutability** | Domains can be transferred/expired | UIDs never change, never expire |
| **Human readable** | Yes (google.com) | Partially (prefix is meaningful: `sn_` = site) |

**SND Advantages Over DNS:**
- **Routing is instant** — no recursive resolution chain. Two characters tell you everything.
- **No expiration** — UIDs are permanent. No renewal fees, no domain squatting.
- **Immutability** — UIDs cannot be transferred or hijacked. Once issued, they are permanent.
- **Built-in audit** — every issuance is logged. DNS has no equivalent to uid_issuance_log.
- **Flat simplicity** — no subdomain hierarchy to manage. Relationships live in tables, not in identifiers.

**DNS Advantages Over SND:**
- **Human memorability** — "google.com" is easier to remember than `sn_a1b2c3d4e5f6`
- **Established infrastructure** — global caching, redundancy, 40+ years of hardening
- **Decentralization** — multiple registrars and authoritative nameservers vs. single gateway

## 6.2 Comparable Systems

SND is not entirely unique — several systems share design principles. However, no single existing system combines all of SND's properties (flat namespace, self-routing prefixes, immutable identifiers, centralized issuance with audit, and human-governance hierarchy).

| System | Org | Similarity to SND | Key Difference |
|--------|-----|-------------------|----------------|
| **UUID** (RFC 4122) | IETF | Universal uniqueness, random generation | No routing — UUIDs carry no semantic information about entity type or target database |
| **URN** (RFC 8141) | IETF | Namespace identifiers (`urn:isbn:...`) | Hierarchical, requires resolution services, no self-routing |
| **Amazon ARN** | AWS | Resource identification with embedded routing (`arn:aws:s3:::bucket`) | Hierarchical, AWS-specific, long and complex |
| **GS1 (GTIN/EAN)** | GS1 | Globally unique product identification | Numeric-only, product-specific, managed by regional organizations |
| **DOI** (Digital Object Identifier) | DOI Foundation | Persistent identifiers for digital content | Content-specific, requires Handle System resolution |
| **Handle System** | DONA Foundation | Distributed identifier resolution | Requires infrastructure for resolution, not self-routing |
| **ISNI** | ISNI-IA | Author/creator identification | Person-specific, managed by external agencies |
| **Snowflake IDs** | Twitter/X | Timestamp + machine + sequence encoding | Machine-specific, no semantic prefix for entity type |
| **W3C DID** (Decentralized Identifiers) | W3C | Decentralized, self-sovereign identity | Blockchain-based resolution, complex infrastructure |
| **DNS** | ICANN | Global name resolution with hierarchical delegation | Hierarchical, names expire, transferable |

### What Makes SND Unique

No existing system combines all five of these properties:

1. **Self-routing prefix** — Instant database targeting from 2 characters (ARN is closest but is hierarchical and verbose)
2. **Flat namespace with relational context** — Relationships in tables, not in identifiers (UUID has this but lacks routing)
3. **Human governance hierarchy** — THE FIRST LAW gives users authority over agents (W3C DID is closest but is infrastructure-heavy)
4. **Immutable with full audit trail** — Blockchain-grade auditability without blockchain infrastructure
5. **Simple, fixed-length format** — 15 characters, base36, human-readable prefix (most systems are either too long or too cryptic)

---
---

# PART VII — MONITORING AND VALIDATION

## 7.1 SND Monitor

The SND Monitor (`snd_monitor.py`) runs four validation checks to ensure namespace integrity:

| Check | Name | What It Validates |
|-------|------|-------------------|
| **1** | **Uniqueness** | No duplicate UIDs exist in `uid_registry` (PK enforces, monitor verifies) |
| **2** | **Consistency** | Every UID in `uid_registry` exists in its target database, and vice versa — no ghosts, no orphans |
| **3** | **Immutability** | Every UID in `uid_registry` has a corresponding entry in `uid_issuance_log` |
| **4** | **Audit** | Issuance log integrity — coverage percentage, issuance sources, request contexts |

### Check Details

**Check 1 — Uniqueness:**
Scans `uid_registry` for any UIDs appearing more than once. The PRIMARY KEY constraint makes this theoretically impossible, but the monitor protects against database corruption.

**Check 2 — Consistency:**
Cross-references UIDs between `uid_registry` and their target databases:
- `sn_` UIDs → checked against `endpoint_taxonomy` in `shopnet_sites`
- `sa_` UIDs → checked against `agents` in `shopnet_assist`
- `su_` UIDs → checked against `user_taxonomy` in `shopnet_crm`
- `sl_` UIDs → checked against `list_taxonomy` in `shopnet_registry`

Reports two categories of problems:
- **Ghosts:** UIDs in the registry but not in the target database
- **Orphans:** UIDs in the target database but not in the registry

**Check 3 — Immutability:**
Verifies every `uid_registry` entry has a matching `uid_issuance_log` record. Missing log entries indicate a UID was created outside the proper issuance process.

**Check 4 — Audit:**
Reports issuance statistics: total UIDs, total log entries, coverage percentage, breakdown by source (`requested_by`) and context (`request_context`).

### Overall Health Status

| Status | Meaning |
|--------|---------|
| **HEALTHY** | All 4 checks PASS |
| **WARNING** | No failures, but some checks returned warnings (e.g., missing log entries) |
| **CRITICAL** | One or more checks FAIL (e.g., orphans or ghosts detected) |

---
---

# PART VIII — DATABASE TOPOLOGY

## 8.1 RDS Instances

| Instance | Host | Databases | UID Types Stored |
|----------|------|-----------|------------------|
| **Instance 1** | `shopnet-things.cenq4au2o7vl.us-east-1.rds.amazonaws.com` | shopnet_connect, shopnet_sites, shopnet_assist, shopnet_data, amazon_products, KPI_Source | `sn_`, `sa_` |
| **Instance 2** | `shopnet-crm-registry.cenq4au2o7vl.us-east-1.rds.amazonaws.com` | shopnet_crm, shopnet_registry | `su_`, `sl_` |
| **Future** | TBD | shopnet_payments | `sp_` |

## 8.2 Core SND Tables

### uid_registry (shopnet_connect, Instance 1)

The **zone file** of SND. Every UID ever issued has a row here.

```sql
CREATE TABLE uid_registry (
    uid             VARCHAR(30) PRIMARY KEY,   -- the UID itself (PK = uniqueness)
    uid_version     SMALLINT NOT NULL DEFAULT 1,
    uid_type        VARCHAR(10) NOT NULL,      -- prefix: sn, sa, su, sl, sp
    display_name    VARCHAR(255),              -- human-readable name
    routes_to       VARCHAR(50) NOT NULL,      -- target database name
    issued_at       TIMESTAMP NOT NULL DEFAULT NOW(),
    active          BOOLEAN NOT NULL DEFAULT true
);
```

### uid_issuance_log (shopnet_connect, Instance 1)

The **audit trail**. Append-only log of every UID issuance.

```sql
CREATE TABLE uid_issuance_log (
    id              SERIAL PRIMARY KEY,
    uid             VARCHAR(30) NOT NULL,      -- the UID that was issued
    requested_by    VARCHAR(100),              -- who/what requested it
    request_context VARCHAR(255),              -- why it was created
    issued_at       TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### endpoint_taxonomy (shopnet_sites, Instance 1)

Master record for site UIDs (`sn_`). Contains site name, platform type, endpoint type, URL, and configuration.

### agents (shopnet_assist, Instance 1)

Agent configurations for agent UIDs (`sa_`). Contains agent name, capabilities, and linked site_uid.

### user_taxonomy (shopnet_crm, Instance 2) [DESIGNED]

Master record for user UIDs (`su_`). Branches to profiles, site registrations, delegations, wallets, and OAuth tokens.

### list_taxonomy (shopnet_registry, Instance 2) [DESIGNED]

Master record for list UIDs (`sl_`). Contains list type, owner (su_ UID), visibility, and share tokens.

## 8.3 Connect Gateway Components

| File | Path | Function |
|------|------|----------|
| `uid_generator.py` | `/connect.shopnet/backend/snd/uid_generator.py` | v2 UID generation, validation, prefix routing |
| `uid_registry.py` | `/connect.shopnet/backend/snd/uid_registry.py` | CRUD operations for uid_registry + uid_issuance_log |
| `snd_monitor.py` | `/connect.shopnet/backend/snd/snd_monitor.py` | 4 validation checks (uniqueness, consistency, immutability, audit) |
| `crm.py` | `/connect.shopnet/backend/snd/crm.py` | User CRM operations — registration, profiles, delegations |
| `registry.py` | `/connect.shopnet/backend/snd/registry.py` | List/registry operations — create list, add items, share |
| `shopnet_connect_api.py` | `/connect.shopnet/backend/shopnet_connect_api.py` | API routes for all SND operations (v1 + v2 endpoints) |
| `001_uid_registry.sql` | `/connect.shopnet/backend/sql/001_uid_registry.sql` | uid_registry + uid_issuance_log schema |
| `002_shopnet_crm.sql` | `/connect.shopnet/backend/sql/002_shopnet_crm.sql` | CRM schema (7 tables) |
| `003_shopnet_registry.sql` | `/connect.shopnet/backend/sql/003_shopnet_registry.sql` | Registry schema (3 tables) |

## 8.4 API Endpoints

### v1 API (Legacy)
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/v1/snd/uid/create` | Create a new UID |
| GET | `/api/v1/snd/uid/lookup/{uid}` | Look up a UID in the registry |
| GET | `/api/v1/snd/uid/validate/{uid}` | Validate UID format (v1 or v2) |
| GET | `/api/v1/snd/uid/list` | List UIDs with optional filters |
| GET | `/api/v1/snd/uid/stats` | Registry statistics |
| GET | `/api/v1/snd/monitor` | Run all 4 SND Monitor checks |

### v2 API (Current)
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/v2/snd/uid` | Create a new UID |
| GET | `/api/v2/snd/uid/{uid}` | Look up a UID |
| GET | `/api/v2/snd/uid/{uid}/validate` | Validate UID format |
| GET | `/api/v2/snd/uid` | List UIDs (with query params) |
| GET | `/api/v2/snd/stats` | Registry statistics |
| GET | `/api/v2/snd/monitor` | Run all SND Monitor checks |
| POST | `/api/v2/snd/crm/register` | Register new user (su_ UID) |
| GET | `/api/v2/snd/crm/user/{uid}` | Get user profile |
| POST | `/api/v2/snd/crm/delegate` | Delegate agent access |
| DELETE | `/api/v2/snd/crm/delegate` | Revoke agent delegation |
| POST | `/api/v2/snd/registry/list` | Create a new list (sl_ UID) |
| GET | `/api/v2/snd/registry/list/{uid}` | Get list details |
| POST | `/api/v2/snd/registry/list/{uid}/items` | Add items to list |
| GET | `/api/v2/snd/registry/share/{token}` | Access shared list |

---
---

# PART IX — SUMMARY

## 9.1 What SND Is

SND is a **flat, self-routing, immutable UID namespace** that provides permanent identity to every entity in the Shopnet ecosystem. It operates like DNS in reverse — instead of resolving human names to machine addresses, it resolves machine-generated UIDs to human-meaningful entities.

## 9.2 Key Properties

| Property | Value |
|----------|-------|
| **Total UID types** | 5 (sn_, sa_, su_, sl_, sp_) |
| **Format** | 15 characters: 2 prefix + underscore + 12 base36 body |
| **Capacity per prefix** | ~4.7 quintillion |
| **Issuance authority** | Connect Gateway (sole issuer) |
| **Duplicate prevention** | 4 layers: mathematical + PK constraint + retry loop + SND Monitor |
| **Audit trail** | Every issuance logged in uid_issuance_log |
| **Governance** | THE FIRST LAW — users have ultimate authority over agents |
| **Expandability** | 671 unused prefix slots available |
| **Comparable systems** | Closest: Amazon ARN (routing), UUID (uniqueness), W3C DID (governance) — but none combine all SND properties |

## 9.3 Current Implementation Status

| Component | Status |
|-----------|--------|
| `uid_generator.py` | LIVE — v2 generation and validation |
| `uid_registry.py` | LIVE — CRUD for uid_registry and issuance log |
| `snd_monitor.py` | LIVE — 4 validation checks |
| sn_ (Sites) | LIVE — endpoint_taxonomy operational |
| sa_ (Agents) | LIVE — agents table operational |
| su_ (Users) | DESIGNED — CRM schema written, code ready |
| sl_ (Lists) | DESIGNED — Registry schema written, code ready |
| sp_ (Payments) | FUTURE — planned |

---

*Generated from Shopnet Deathstar documentation, Feb 8, 2026*
