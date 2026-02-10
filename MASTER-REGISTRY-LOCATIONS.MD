# Master Registry Locations - shopnet_connect Database
**Date:** February 9, 2026
**Status:** ✅ DEPLOYED TO PRODUCTION

---

## Overview

**shopnet_connect** on RDS Instance 1 is the **MASTER DATABASE OF TRUTH** for:
1. **UID Registry** - All issued UIDs (conflict checking)
2. **Taxonomy Law** - Complete taxonomy for all 9 UID types
3. **Audit Trail** - Complete issuance history

---

## Location Details

### RDS Instance 1
**Host:** `amazon-products-db-1754023596.cenq4au2o7vl.us-east-1.rds.amazonaws.com`
**Database:** `shopnet_connect`
**Region:** us-east-1
**Status:** **LIVE** ✅

---

## Tables in shopnet_connect

### 1. uid_registry ✅ (LIVE - Conflict Checking)

**Purpose:** Master index of ALL UIDs across ALL types. This is where conflict checking happens.

**Schema:**
```sql
CREATE TABLE uid_registry (
    uid             VARCHAR(30) PRIMARY KEY,  -- ← CONFLICT PREVENTION
    uid_version     SMALLINT NOT NULL DEFAULT 1,
    uid_type        VARCHAR(10) NOT NULL,
    display_name    VARCHAR(255),
    routes_to       VARCHAR(50) NOT NULL,
    issued_at       TIMESTAMP NOT NULL DEFAULT NOW(),
    active          BOOLEAN NOT NULL DEFAULT true
);
```

**Current Contents:**
```
uid_type | count
---------|-------
sn       |    76  (Sites/Endpoints)
sa       |     8  (Agents)
su       |     3  (Users)
sl       |     2  (Lists)
---------|-------
TOTAL    |    89  UIDs
```

**Conflict Prevention:**
- **PRIMARY KEY** on `uid` column = automatic duplicate rejection
- **Retry logic** in uid_registry.py (max 5 attempts on collision)
- **SND Monitor** scans for any corruption that bypassed PK

**This is THE definitive list of what UIDs exist.**

---

### 2. uid_issuance_log ✅ (LIVE - Audit Trail)

**Purpose:** Append-only audit trail of every UID ever issued.

**Schema:**
```sql
CREATE TABLE uid_issuance_log (
    id              SERIAL PRIMARY KEY,
    uid             VARCHAR(30) NOT NULL,
    requested_by    VARCHAR(100),
    request_context VARCHAR(255),
    issued_at       TIMESTAMP NOT NULL DEFAULT NOW()
);
```

**Properties:**
- **APPEND-ONLY** - never updated or deleted
- Every issuance recorded (who, when, why)
- Immutability check validates every uid_registry entry has a log

**This is THE audit trail for namespace integrity.**

---

### 3. taxonomy_law ✅ (LIVE - Master Taxonomy)

**Purpose:** Single source of truth for ALL UID type taxonomies.

**Schema:**
```sql
CREATE TABLE taxonomy_law (
    id                  SERIAL PRIMARY KEY,
    level               VARCHAR(10) NOT NULL,      -- L0, L1, L2, L3
    uid_type            VARCHAR(10),               -- sn_, sg_, sc_, st_, sp_, sl_, su_, sa_, sv_
    parent_code         VARCHAR(30),
    code                VARCHAR(30) NOT NULL,
    name                VARCHAR(100) NOT NULL,
    description         TEXT,
    examples            TEXT,
    target_database     VARCHAR(50) NOT NULL,
    status              VARCHAR(20) NOT NULL DEFAULT 'WIP',
    active              BOOLEAN NOT NULL DEFAULT TRUE,
    notes               TEXT,
    created_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT taxonomy_law_unique UNIQUE(level, uid_type, parent_code, code)
);

COMMENT ON TABLE taxonomy_law IS
'Master taxonomy registry for all UID types in the SND namespace.
This is the single source of truth for THE LAW. Lives on shopnet_connect
as the authoritative reference. Each operational database (shopnet_sites,
shopnet_assist, etc.) has its own local taxonomy table for performance,
but this is the master.';
```

**Current Contents:**
```
Level | Count | Description
------|-------|--------------------------------------------------
L0    |     1 | Namespace (shopnet.network)
L1    |     9 | UID Types (sn_, sg_, sc_, st_, sp_, sl_, su_, sa_, sv_)
L2    |   163 | Subtypes (endpoint types, thing types, etc.)
L3    |    71 | Attributes (status, runtime, location fields, etc.)
------|-------|--------------------------------------------------
TOTAL |   244 | Complete taxonomy entries
```

**By UID Type:**
```
UID Type | Entries | Status
---------|---------|----------
sn_      |      50 | live (existing)
sa_      |      17 | live (existing)
su_      |      22 | designed (SQL ready)
sl_      |      25 | designed (SQL ready)
sg_      |      27 | WIP (new)
sc_      |      25 | WIP (new)
st_      |      23 | WIP (new)
sp_      |      21 | WIP (new)
sv_      |      33 | WIP (new)
ALL      |       1 | L0 namespace
```

**By Status:**
```
Status   | Count
---------|-------
live     |    65
designed |    47
WIP      |   132
```

**This is THE definitive taxonomy for all UID types.**

---

## How Conflict Checking Works

### 1. Database Level (Primary Defense)

```sql
-- PRIMARY KEY constraint prevents duplicates at insertion
INSERT INTO uid_registry (uid, ...) VALUES ('sn_abc123', ...);
-- If 'sn_abc123' already exists → ERROR: duplicate key value
```

**Protection:** Database-level enforcement, cannot be bypassed

---

### 2. Application Level (Retry Logic)

**File:** `/opt/shopnet/connect-gateway/snd/uid_registry.py`

```python
def create_uid(uid_type: str, ...) -> dict:
    max_attempts = 5

    for attempt in range(max_attempts):
        uid = generate_uid_v2(uid_type)  # timestamp + random
        try:
            # Insert into uid_registry (PK prevents duplicates)
            cur.execute("INSERT INTO uid_registry ...")

            # Insert into uid_issuance_log (audit trail)
            cur.execute("INSERT INTO uid_issuance_log ...")

            conn.commit()
            return {"success": True, "uid": uid}

        except psycopg2.IntegrityError:
            # Collision detected! Try again (extremely rare)
            if attempt < max_attempts - 1:
                continue
            return {"error": "UID collision after max attempts"}
```

**Protection:** If collision occurs (astronomically rare), retry up to 5 times

---

### 3. Validation Level (SND Monitor)

**File:** `/opt/shopnet/connect-gateway/snd/snd_monitor.py`

```python
def check_uniqueness() -> dict:
    """Verify no duplicate UIDs exist (scan entire registry)"""
    cur.execute("""
        SELECT uid, COUNT(*) as cnt
        FROM uid_registry
        GROUP BY uid
        HAVING COUNT(*) > 1
    """)
    duplicates = cur.fetchall()

    return {
        "status": "PASS" if not duplicates else "FAIL",
        "duplicates_found": len(duplicates)
    }
```

**Protection:** Continuous scanning for any corruption that bypassed PK constraint

---

## How It All Connects

```
┌─────────────────────────────────────────────────────────────┐
│  CONNECT SERVER (34.234.121.248)                            │
│  /opt/shopnet/connect-gateway/                              │
│                                                             │
│  CODE:                                                      │
│  ├─ snd/uid_generator.py    (generates UIDs)               │
│  ├─ snd/uid_registry.py     (CRUD, conflict handling)      │
│  └─ snd/snd_monitor.py      (validation checks)            │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ connects to
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  RDS INSTANCE 1                                             │
│  amazon-products-db-1754023596...                           │
│                                                             │
│  DATABASE: shopnet_connect                                  │
│  ├─ uid_registry         (89 UIDs - conflict checking)     │
│  ├─ uid_issuance_log     (audit trail)                     │
│  └─ taxonomy_law         (244 rows - master taxonomy)      │
└─────────────────────────────────────────────────────────────┘
```

---

## Accessing the Master Registry

### Via SSH + psql

```bash
# SSH to Connect Server
ssh -i ~/VSCode/Keys/TLemmon.pem ubuntu@34.234.121.248

# Connect to database
PGPASSWORD='J09GsxbZqFsWEuCH1nWIDG48uY4FFghG' \
psql -h amazon-products-db-1754023596.cenq4au2o7vl.us-east-1.rds.amazonaws.com \
     -U postgres -d shopnet_connect

# Query uid_registry
SELECT * FROM uid_registry ORDER BY issued_at DESC LIMIT 10;

# Query taxonomy_law
SELECT * FROM taxonomy_law WHERE uid_type = 'sn_' AND level = 'L2';

# Check for conflicts
SELECT uid, COUNT(*) FROM uid_registry GROUP BY uid HAVING COUNT(*) > 1;
```

### Via Python (uid_registry.py)

```python
from snd.uid_registry import create_uid, lookup_uid, list_uids

# Create new UID
result = create_uid(uid_type='sn', display_name='my-site.com')
# Returns: {'success': True, 'uid': 'sn_xxxxxxxxxxxx', ...}

# Lookup UID
result = lookup_uid('sn_abc123')
# Returns: {'success': True, 'found': True, 'uid': ..., 'routes_to': ...}

# List all sn_ UIDs
result = list_uids(uid_type='sn', active=True)
# Returns: {'success': True, 'uids': [...], 'total': 76}
```

---

## Master vs Local Taxonomies

### Master Registry (shopnet_connect)
- **Purpose:** Single source of truth
- **Scope:** ALL 9 UID types
- **Access:** API queries, Console wizards
- **Updates:** Via migration scripts only
- **Performance:** Read-optimized, not for high-frequency queries

### Local Taxonomies (Operational Databases)
- **Purpose:** Fast validation for high-frequency operations
- **Scope:** Only their own UID type
- **Access:** Database triggers, application code
- **Updates:** Synced from master periodically
- **Performance:** Write-optimized, cached

**Example:**
```
shopnet_sites.taxonomy_definition
  ← synced from ← shopnet_connect.taxonomy_law (WHERE uid_type = 'sn_')
```

---

## Summary

### UID Conflict Checking Location
✅ **Database:** shopnet_connect
✅ **Table:** uid_registry
✅ **Primary Key:** uid (VARCHAR 30)
✅ **Current UIDs:** 89 (76 sn_, 8 sa_, 3 su_, 2 sl_)

### Master Taxonomy Location
✅ **Database:** shopnet_connect
✅ **Table:** taxonomy_law
✅ **Total Entries:** 244 (1 L0, 9 L1, 163 L2, 71 L3)
✅ **Comment:** "Master taxonomy registry for all UID types in the SND namespace"

### Audit Trail Location
✅ **Database:** shopnet_connect
✅ **Table:** uid_issuance_log
✅ **Properties:** Append-only, complete history

---

**Everything is on RDS Instance 1, database shopnet_connect.**

**This is THE MASTER DATABASE OF TRUTH for Shopnet UID and Taxonomy systems.**
