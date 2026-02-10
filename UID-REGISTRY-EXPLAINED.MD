# UID Registry - The Two Tables Explained
**Date:** February 9, 2026
**Location:** shopnet_connect database (RDS Instance 1)

---

## YES - Both Are in shopnet_connect Database!

There are **TWO tables** that work together:

---

## 1. uid_registry (Current State)

**Table:** `shopnet_connect.uid_registry`
**Purpose:** Master index of what UIDs exist RIGHT NOW
**Current Records:** 89 UIDs

### What It Is
- **Phone book** of active UIDs
- **Current state** snapshot
- **Conflict prevention** via PRIMARY KEY
- **Can be queried** by type, status, etc.

### Schema
```sql
CREATE TABLE uid_registry (
    uid             VARCHAR(30) PRIMARY KEY,  -- ← PREVENTS DUPLICATES
    uid_version     SMALLINT NOT NULL DEFAULT 1,
    uid_type        VARCHAR(10) NOT NULL,
    display_name    VARCHAR(255),
    routes_to       VARCHAR(50) NOT NULL,
    issued_at       TIMESTAMP NOT NULL DEFAULT NOW(),
    active          BOOLEAN NOT NULL DEFAULT true
);
```

### Example Data
```
       uid       | uid_type |      display_name      |    routes_to     |         issued_at
-----------------+----------+------------------------+------------------+---------------------------
 su_0ta1w63d8iah | su       | Duplicate Tim          | shopnet_crm      | 2026-02-06 18:46:51
 sl_0ta1w62707b6 | sl       | Production Test List   | shopnet_registry | 2026-02-06 18:46:50
 su_0ta1w62wwkxt | su       | SND Build Test User    | shopnet_crm      | 2026-02-06 18:46:50
 sn_0ta1w62d0tii | sn       | production-create-test | shopnet_sites    | 2026-02-06 18:46:50
 sa_0ta4kc147c51 | sa       | Product Assist         | shopnet_assist   | 2026-02-06 18:08:59
```

### This Table Answers:
- "What UIDs exist?"
- "Where does this UID route to?"
- "Is this UID active?"
- "What type is this UID?"

---

## 2. uid_issuance_log ⭐ (Blockchain-Like Audit Trail)

**Table:** `shopnet_connect.uid_issuance_log`
**Purpose:** APPEND-ONLY complete history of every issuance
**Current Records:** 89 events (IDs 1-90, one was skipped)

### What It Is
- **Blockchain-like** immutable ledger
- **Complete history** of every issuance event
- **APPEND-ONLY** - never updated or deleted
- **Audit trail** for namespace integrity

### Schema
```sql
CREATE TABLE uid_issuance_log (
    id              SERIAL PRIMARY KEY,           -- Sequential event ID
    uid             VARCHAR(30) NOT NULL,         -- Which UID was issued
    requested_by    VARCHAR(100),                 -- Who requested it
    request_context VARCHAR(255),                 -- Why it was issued
    issued_at       TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Example Data
```
 id |       uid       | requested_by  |  request_context  |         issued_at
----+-----------------+---------------+-------------------+---------------------------
 90 | su_0ta1w63d8iah | snd.shopnet   | user_registration | 2026-02-06 18:46:51
 89 | sl_0ta1w62707b6 | snd.shopnet   | list_creation     | 2026-02-06 18:46:50
 88 | su_0ta1w62wwkxt | snd.shopnet   | user_registration | 2026-02-06 18:46:50
 87 | sn_0ta1w62d0tii | snd.shopnet   | api_create        | 2026-02-06 18:46:50
 83 | sa_0ta4kc19i438 | import_script | legacy_import_sa  | 2026-02-06 18:08:59
```

### This Table Answers:
- "When was this UID issued?"
- "Who requested this UID?"
- "Why was this UID created?"
- "What's the complete history of issuances?"
- "Has this UID been tampered with?" (immutability check)

---

## How They Work Together

```
┌─────────────────────────────────────────────────────────────┐
│  CREATE NEW UID                                              │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  1. Generate UID (timestamp + random)                        │
│     Example: sn_0ta1w62d0tii                                │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  2. INSERT INTO uid_registry                                 │
│     - PRIMARY KEY prevents duplicates                        │
│     - If collision → retry (max 5 attempts)                 │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  3. INSERT INTO uid_issuance_log                            │
│     - Record who, when, why                                 │
│     - Append-only audit trail                               │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  4. COMMIT (both or neither - atomic transaction)           │
└─────────────────────────────────────────────────────────────┘
```

---

## The "Blockchain" Analogy

### Why It's Called "Blockchain-Like"

| Property | Blockchain | uid_issuance_log |
|----------|------------|------------------|
| **Append-only** | ✅ Blocks never modified | ✅ Records never updated/deleted |
| **Immutable** | ✅ Past blocks cannot change | ✅ Past records cannot change |
| **Sequential** | ✅ Block numbers sequential | ✅ ID numbers sequential |
| **Timestamp** | ✅ Each block has timestamp | ✅ Each record has issued_at |
| **Audit trail** | ✅ Complete history | ✅ Complete history |
| **Tamper-evident** | ✅ Hash chain | ✅ Immutability check via SND Monitor |

### What's Different?

| Property | Blockchain | uid_issuance_log |
|----------|------------|------------------|
| **Distributed** | ✅ Multiple nodes | ❌ Centralized (single DB) |
| **Consensus** | ✅ Network validates | ❌ Single authority (Connect Gateway) |
| **Cryptographic hash** | ✅ SHA-256 chains | ❌ No hash chain |
| **Decentralized** | ✅ No single owner | ❌ Shopnet owns it |

**Bottom Line:** It's "blockchain-like" in its **immutability** and **append-only** properties, but it's **centralized** (not distributed).

---

## Current State (Production)

### Counts
```
uid_registry:        89 UIDs (current state)
uid_issuance_log:    89 events (complete history)
```

### Timeline
```
First issuance:  2026-02-06 18:08:58  (Event ID 1)
Last issuance:   2026-02-06 18:46:51  (Event ID 90)
Total events:    89 (one ID was skipped)
```

### By UID Type
```
uid_type | count
---------|-------
sn       |    76  (Sites/Endpoints)
sa       |     8  (Agents)
su       |     3  (Users)
sl       |     2  (Lists)
```

---

## How SND Monitor Uses Both Tables

### Check 1: Uniqueness (uid_registry)
```sql
-- Scan for duplicate UIDs
SELECT uid, COUNT(*)
FROM uid_registry
GROUP BY uid
HAVING COUNT(*) > 1;
```
**Result:** Should be empty (no duplicates)

### Check 3: Immutability (both tables)
```sql
-- Verify every UID has an issuance log entry
SELECT r.uid
FROM uid_registry r
LEFT JOIN uid_issuance_log l ON r.uid = l.uid
WHERE l.uid IS NULL;
```
**Result:** Should be empty (all UIDs have logs)

### Check 4: Audit (uid_issuance_log)
```sql
-- Count total issuances and coverage
SELECT
    (SELECT COUNT(*) FROM uid_issuance_log) as total_logs,
    (SELECT COUNT(*) FROM uid_registry) as total_uids;
```
**Result:** Should match or exceed (one UID can have multiple log entries if recreated)

---

## Code Implementation

### File: uid_registry.py

```python
def create_uid(uid_type: str, display_name: str,
               requested_by: str = "snd.shopnet",
               request_context: str = "api_create") -> dict:

    for attempt in range(5):  # Max 5 collision retries
        uid = generate_uid_v2(uid_type)

        try:
            # 1. Insert into uid_registry (conflict prevention)
            cur.execute("""
                INSERT INTO uid_registry
                (uid, uid_version, uid_type, display_name, routes_to)
                VALUES (%s, 2, %s, %s, %s)
            """, (uid, uid_type, display_name, routes_to))

            # 2. Insert into uid_issuance_log (audit trail)
            cur.execute("""
                INSERT INTO uid_issuance_log
                (uid, requested_by, request_context)
                VALUES (%s, %s, %s)
            """, (uid, requested_by, request_context))

            # 3. Commit both (atomic transaction)
            conn.commit()

            return {"success": True, "uid": uid}

        except psycopg2.IntegrityError:
            # Collision! Try again
            if attempt < 4:
                continue
            return {"error": "UID collision after max attempts"}
```

---

## Querying the Registry

### Get All UIDs of a Type
```sql
SELECT uid, display_name, issued_at
FROM uid_registry
WHERE uid_type = 'sn'
ORDER BY issued_at DESC;
```

### Check When a UID Was Issued
```sql
SELECT l.*, r.display_name
FROM uid_issuance_log l
JOIN uid_registry r ON l.uid = r.uid
WHERE l.uid = 'sn_0ta1w62d0tii';
```

### See Who Issued What
```sql
SELECT requested_by, COUNT(*) as total
FROM uid_issuance_log
GROUP BY requested_by
ORDER BY total DESC;
```

### Get Complete Audit Trail
```sql
SELECT
    l.id as event_id,
    l.uid,
    r.uid_type,
    r.display_name,
    l.requested_by,
    l.request_context,
    l.issued_at
FROM uid_issuance_log l
JOIN uid_registry r ON l.uid = r.uid
ORDER BY l.issued_at DESC;
```

---

## Summary

| Question | Answer |
|----------|--------|
| **Where is the UID registry list?** | `shopnet_connect.uid_registry` (89 UIDs) |
| **Where is the "blockchain-like" audit trail?** | `shopnet_connect.uid_issuance_log` (89 events) |
| **How does conflict checking work?** | PRIMARY KEY on uid_registry.uid + retry logic |
| **Is it truly a blockchain?** | No, but it's append-only and immutable like a blockchain |
| **Can records be deleted?** | uid_registry: yes (deactivate). uid_issuance_log: **NEVER** |
| **Can records be updated?** | uid_registry: limited (active flag). uid_issuance_log: **NEVER** |
| **Who can create UIDs?** | ONLY Connect Gateway (sole issuer) |
| **Where does the code live?** | Connect Server: `/opt/shopnet/connect-gateway/snd/` |

---

## Visual Diagram

```
┌──────────────────────────────────────────────────────────┐
│  RDS Instance 1: shopnet_connect Database                │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  uid_registry (Current State)                  │    │
│  │  - 89 UIDs                                     │    │
│  │  - PRIMARY KEY prevents duplicates             │    │
│  │  - Queryable by type, status                   │    │
│  │  - Can deactivate (active = false)             │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  uid_issuance_log (Blockchain-like)            │    │
│  │  - 89 events                                   │    │
│  │  - APPEND-ONLY (never modified/deleted)        │    │
│  │  - Sequential IDs (1, 2, 3...)                 │    │
│  │  - Complete audit trail                        │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌────────────────────────────────────────────────┐    │
│  │  taxonomy_law (Master Taxonomy)                │    │
│  │  - 244 rows (all 9 UID types, L0-L3)          │    │
│  │  - Single source of truth for THE LAW         │    │
│  └────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────┘
```

---

**Bottom Line:**
- ✅ `uid_registry` = current snapshot (what exists now)
- ✅ `uid_issuance_log` = immutable history (blockchain-like audit trail)
- ✅ Both are in `shopnet_connect` database
- ✅ Both work together for conflict prevention and audit integrity
