# Shopnet Connect Database - Table Comments Documentation
**Date:** February 9, 2026
**Database:** shopnet_connect (RDS Instance 1)
**Status:** ✅ COMPLETED

---

## Overview

All 6 tables in the `shopnet_connect` database now have comprehensive PostgreSQL comments documenting:
- What each table stores
- What components write to it
- What components read from it
- Current production status and record counts
- Future development plans

---

## Tables Documented

### 1. uid_registry ✅
**Purpose:** Master UID registry for the entire Shopnet Network (SND)
**Record Count:** 89 UIDs (76 sn_, 8 sa_, 3 su_, 2 sl_)
**Status:** LIVE - Production critical table

**Written by:**
- `/opt/shopnet/connect-gateway/snd/uid_registry.py` (create_uid function)
- Connect Gateway API during UID issuance

**Read by:**
- ALL Shopnet components for UID validation and routing
- `/opt/shopnet/connect-gateway/snd/snd_monitor.py` (Check 1: Uniqueness, Check 2: Consistency)
- Connect Gateway for routes_to resolution
- Console wizards for UID lookups
- API endpoints for UID verification

**Conflict Prevention:** PRIMARY KEY constraint on uid column

---

### 2. uid_issuance_log ✅
**Purpose:** APPEND-ONLY audit trail of all UID issuances (blockchain-like)
**Record Count:** 89 events (IDs 1-90, one ID skipped)
**Status:** LIVE - Production critical table

**Written by:**
- `/opt/shopnet/connect-gateway/snd/uid_registry.py` (create_uid function)
- Connect Gateway API during UID issuance (same transaction as uid_registry INSERT)

**Read by:**
- `/opt/shopnet/connect-gateway/snd/snd_monitor.py` (Check 3: Immutability, Check 4: Audit)
- Audit systems for compliance reporting
- Forensic analysis for namespace investigation

**Immutability:** NEVER updated or deleted. Records are permanent.

**Future:** May be migrated to actual blockchain for distributed immutability

---

### 3. taxonomy_law ✅
**Purpose:** Master taxonomy registry for ALL UID types (L0-L3)
**Record Count:** 244 rows (L0: 1, L1: 9, L2: 163, L3: 71)
**Status:** LIVE - Production reference table

**Written by:**
- Manual imports via psql during taxonomy updates
- Future: Taxonomy management API (not yet implemented)
- Future: Sync from version-controlled CSV files

**Read by:**
- Future: Connect Gateway taxonomy API endpoint (GET /api/v1/taxonomy)
- Future: Console wizards for dynamic dropdown population
- Future: Sync jobs that populate local taxonomy tables
- Documentation generation scripts

**Status Breakdown:**
- live: 65 (currently in production)
- designed: 47 (fully designed, not yet implemented)
- WIP: 132 (work in progress, needs refinement)

**Future:** Blockchain-based master registry for distributed consensus

---

### 4. licenses ✅
**Purpose:** API licensing and tenant management for Connect Gateway
**Record Count:** 0 (not yet in use)
**Status:** DESIGNED - Table exists but licensing system not yet fully implemented

**Written by:**
- Connect Gateway license management endpoints (not yet fully implemented)
- Manual tenant provisioning scripts
- Future: Self-service tenant registration API

**Read by:**
- Connect Gateway API middleware for authentication and authorization
- Rate limiting middleware (checks tier for request limits)
- Usage tracking system

**Schema:**
- `api_key` - Public API key for tenant authentication
- `api_secret` - Secret key for request signing/validation
- `tenant_name` - Human-readable tenant/organization name
- `tier` - Access tier: "free", "basic", "pro", "enterprise"
- `is_active` - Whether license is active (auth middleware blocks if false)

---

### 5. secrets ✅
**Purpose:** Secure storage for API keys, tokens, passwords, and other sensitive credentials
**Record Count:** 1 (GitHub token for pulse checks)
**Status:** LIVE - In production use

**Written by:**
- Manual credential provisioning via psql or secure admin scripts
- System migration scripts (e.g., moving credentials from .env files)
- Future: Secure credential management API (vault-like)

**Read by:**
- Connect Gateway for external service integration (GitHub, Shopify, etc.)
- Pulse monitoring system (uses GitHub token for repository checks)
- SND background jobs needing external API access
- Deployment scripts for credential injection

**Security Note:** This is NOT a proper secrets vault. Values are stored as plain text.

**Future:** Migrate to AWS Secrets Manager or implement column-level encryption

---

### 6. usage_metrics ✅
**Purpose:** API usage tracking and rate limiting metrics
**Record Count:** 0 (not yet collecting metrics)
**Status:** DESIGNED - Table exists but usage tracking not yet fully implemented

**Written by:**
- Connect Gateway API middleware (increments request_count on each API call)
- Background aggregation job (rolls up hourly metrics to daily)
- Future: Real-time streaming to analytics system

**Read by:**
- Rate limiting middleware (checks daily usage against tier limits)
- Usage reporting dashboard (not yet implemented)
- Billing system (for metered pricing, not yet implemented)
- Admin analytics for capacity planning

**Future:** Add hourly granularity, response time metrics, error rates

---

## SQL Files Created

### 1. [004_add_table_comments.sql](../connect.shopnet/backend/sql/004_add_table_comments.sql)
Comments for core SND tables:
- uid_registry (table + 7 columns)
- uid_issuance_log (table + 5 columns)
- taxonomy_law (table + 12 columns)

### 2. [005_add_remaining_table_comments.sql](../connect.shopnet/backend/sql/005_add_remaining_table_comments.sql)
Comments for supporting tables:
- licenses (table + 6 columns)
- secrets (table + 8 columns)
- usage_metrics (table + 5 columns)

---

## Scripts Created

### 1. [apply_table_comments.py](../connect.shopnet/backend/scripts/apply_table_comments.py)
Applied comments from 004_add_table_comments.sql to database

### 2. [inspect_tables.py](../connect.shopnet/backend/scripts/inspect_tables.py)
Inspected structure and sample data of uncommented tables

### 3. [apply_remaining_comments.py](../connect.shopnet/backend/scripts/apply_remaining_comments.py)
Applied comments from 005_add_remaining_table_comments.sql to database

---

## Verification

All 6 tables in `shopnet_connect` now have comprehensive comments:

```
✓ licenses             API licensing and tenant management for Connect Gateway...
✓ secrets              Secure storage for API keys, tokens, passwords, and other...
✓ taxonomy_law         Master taxonomy registry for ALL UID types across the entire...
✓ uid_issuance_log     APPEND-ONLY audit trail of all UID issuances. Acts as "block...
✓ uid_registry         Master UID registry for the entire Shopnet Network (SND)...
✓ usage_metrics        API usage tracking and rate limiting metrics. Records reques...
```

---

## How to View Comments

### Via psql:
```sql
-- View table comment
\d+ uid_registry

-- View all table comments
SELECT
    c.relname AS table_name,
    d.description AS comment
FROM pg_class c
LEFT JOIN pg_description d ON c.oid = d.objoid AND d.objsubid = 0
WHERE c.relkind = 'r'
  AND c.relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
ORDER BY c.relname;

-- View column comments for a specific table
SELECT
    a.attname AS column_name,
    d.description AS comment
FROM pg_class c
JOIN pg_attribute a ON a.attrelid = c.oid
LEFT JOIN pg_description d ON d.objoid = c.oid AND d.objsubid = a.attnum
WHERE c.relname = 'uid_registry'
  AND a.attnum > 0
  AND NOT a.attisdropped
ORDER BY a.attnum;
```

### Via Python:
```python
import psycopg2
from psycopg2.extras import RealDictCursor

conn = psycopg2.connect(
    host="amazon-products-db-1754023596.cenq4au2o7vl.us-east-1.rds.amazonaws.com",
    port=5432,
    database="shopnet_connect",
    user="postgres",
    password="J09GsxbZqFsWEuCH1nWIDG48uY4FFghG",
    cursor_factory=RealDictCursor
)

cur = conn.cursor()
cur.execute("""
    SELECT c.relname, d.description
    FROM pg_class c
    LEFT JOIN pg_description d ON c.oid = d.objoid AND d.objsubid = 0
    WHERE c.relkind = 'r' AND c.relnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public')
    ORDER BY c.relname
""")

for row in cur.fetchall():
    print(f"{row['relname']}: {row['description'][:80]}...")
```

---

## Future Development Note

As mentioned in the `uid_issuance_log` and `taxonomy_law` comments, there is consideration for migrating these critical tables to a blockchain implementation for:
- Distributed immutability
- Consensus-based validation
- Cryptographic proof of history
- Decentralized master registry

This would transform the current centralized "blockchain-like" append-only tables into true distributed blockchain tables with distributed consensus.

---

## Summary

✅ **All 6 shopnet_connect tables now fully documented**
✅ **Comments describe what, who writes, who reads, status, and future plans**
✅ **Both table-level and column-level comments provided**
✅ **SQL files and scripts created for reproducibility**
✅ **Comments applied to production database**

**Next Steps:** Continue with other pending taxonomy tasks (API endpoints, Console updates, RDS Instance 2 provisioning, etc.)
