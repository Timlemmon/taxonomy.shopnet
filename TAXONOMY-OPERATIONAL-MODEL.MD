# Taxonomy Operational Model v5.1 WIP
**Date:** February 9, 2026
**Version:** v5.1 WIP
**Authority:** TJL

---

## Overview

The Shopnet taxonomy system uses a **two-tier architecture**:

1. **Master Registry** - `taxonomy_law` table on `shopnet_connect` database (authoritative source)
2. **Local Taxonomies** - Operational tables in each UID-specific database (performance-optimized)

This model balances:
- **Centralized governance** (single source of truth)
- **Distributed performance** (local lookups)
- **System isolation** (each UID type has its own database)

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                     SHOPNET.CONNECT DATABASE                         │
│                     (Master Registry)                                │
│                                                                      │
│   ┌──────────────────────────────────────────────────────────┐    │
│   │           taxonomy_law TABLE                              │    │
│   │                                                           │    │
│   │  - ALL UID types (sn_, sg_, sc_, st_, sp_, sl_, su_,    │    │
│   │    sa_, sv_)                                             │    │
│   │  - ALL levels (L0, L1, L2, L3)                          │    │
│   │  - Authoritative source of truth                         │    │
│   │  - Read-only for operational systems                     │    │
│   │  - Updated via migration scripts only                    │    │
│   └──────────────────────────────────────────────────────────┘    │
│                                                                      │
│                            │                                         │
│                            │ syncs to                                │
│                            ▼                                         │
└─────────────────────────────────────────────────────────────────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
            ▼                ▼                ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│  shopnet_sites   │  │  shopnet_assist  │  │  shopnet_crm     │
│                  │  │                  │  │                  │
│  sn_ taxonomy    │  │  sa_ taxonomy    │  │  su_ taxonomy    │
│  (local cache)   │  │  (local cache)   │  │  (local cache)   │
└──────────────────┘  └──────────────────┘  └──────────────────┘

┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ shopnet_registry │  │ shopnet_things   │  │shopnet_locations │
│                  │  │                  │  │                  │
│  sl_ taxonomy    │  │  sg_ taxonomy    │  │  sc_ taxonomy    │
│  (local cache)   │  │  (local cache)   │  │  (local cache)   │
└──────────────────┘  └──────────────────┘  └──────────────────┘

┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│shopnet_payments  │  │shopnet_transact  │  │shopnet_activities│
│                  │  │                  │  │                  │
│  sp_ taxonomy    │  │  st_ taxonomy    │  │  sv_ taxonomy    │
│  (local cache)   │  │  (local cache)   │  │  (local cache)   │
└──────────────────┘  └──────────────────┘  └──────────────────┘
```

---

## Two-Tier Model

### Tier 1: Master Registry (shopnet_connect)

**Table:** `taxonomy_law`
**Location:** `shopnet_connect` database (Connect Gateway)
**Purpose:** Single source of truth for ALL taxonomies
**Access:** Read-only for operational systems, write-only via migrations

#### Characteristics:
- ✅ Contains ALL 9 UID types (sn_, sg_, sc_, st_, sp_, sl_, su_, sa_, sv_)
- ✅ Contains ALL levels (L0, L1, L2, L3)
- ✅ Authoritative for THE LAW
- ✅ Version controlled (updated via migration scripts)
- ✅ Centralized governance
- ✅ Cross-UID-type queries possible
- ⚠️ Not optimized for high-frequency operational queries

#### Use Cases:
- **Console GUI** fetches from here to populate wizards
- **API documentation** generated from here
- **Validation rules** reference this for cross-UID validation
- **Analytics** query this for taxonomy reporting
- **Sync jobs** read from here to update local caches

---

### Tier 2: Local Taxonomies (Operational Databases)

**Tables:** `taxonomy_definition` (or similar) in each database
**Location:** UID-specific databases (shopnet_sites, shopnet_assist, etc.)
**Purpose:** Fast, local validation for operational queries
**Access:** Read-optimized for high-frequency queries

#### Characteristics:
- ✅ Contains ONLY its own UID type taxonomy
- ✅ Optimized for fast lookups (indexed, cached)
- ✅ Used by database triggers for validation
- ✅ Used by application code for dropdown lists
- ✅ Periodically synced from master registry
- ⚠️ Not authoritative (master is the source of truth)

#### Use Cases:
- **Database triggers** validate against local taxonomy
- **Application code** queries local taxonomy for dropdowns
- **API endpoints** serve local taxonomy for frontend
- **High-frequency validation** (every INSERT/UPDATE)

---

## Example: sn_ (Sites)

### Master Registry (shopnet_connect.taxonomy_law)

```sql
-- All sn_ taxonomy entries
SELECT * FROM taxonomy_law WHERE uid_type = 'sn_';

-- Returns: L1, L2, L3 entries for sn_
-- - L1: sn_ (Sites/Endpoints)
-- - L2: W, A, D, N, I, O (endpoint types)
-- - L2: CO, CP, WP, ... (platform types under each endpoint type)
-- - L3: status, web_protocol, runtime, etc. (attributes)
```

### Local Cache (shopnet_sites.taxonomy_definition)

```sql
-- Only L2 platform types for sn_
SELECT * FROM taxonomy_definition WHERE level = 'platform_type';

-- Returns: Only platform_type codes (CO, CP, WP, etc.)
-- Used by validate_platform_type() trigger
```

### Data Flow

```
1. User clicks "Add Endpoint" in Console
   → Console fetches from taxonomy_law API
   → Dropdown shows all valid endpoint_type values (W, A, D, N, I, O)

2. User selects endpoint_type = 'W'
   → Console fetches platform_type options for 'W' from taxonomy_law
   → Dropdown shows website platform types (CO, CP, WP, etc.)

3. User submits form
   → POST to /api/v1/site-uid/create (Connect Gateway)
   → POST to /api/brochure/taxonomy (Flask API)
   → INSERT INTO endpoint_taxonomy (shopnet_sites)
   → Trigger validate_platform_type() fires
   → Trigger queries local taxonomy_definition table
   → Validates platform_type against local cache
   → If valid: INSERT succeeds
   → If invalid: RAISE EXCEPTION
```

---

## Sync Model

### Master → Local Sync

Local taxonomies are **periodically synced** from the master registry:

```sql
-- Sync job (runs on deployment or schedule)
-- Example: Sync sn_ taxonomy to shopnet_sites

-- 1. Fetch from master (shopnet_connect)
SELECT * FROM taxonomy_law
WHERE uid_type = 'sn_' AND level = 'L2' AND active = TRUE;

-- 2. Update local cache (shopnet_sites)
INSERT INTO taxonomy_definition (level, parent_code, code, name, description, active)
VALUES (...) -- data from master
ON CONFLICT (level, parent_code, code)
DO UPDATE SET
    name = EXCLUDED.name,
    description = EXCLUDED.description,
    active = EXCLUDED.active,
    updated_at = NOW();
```

### Sync Frequency

| Database | UID Type | Sync Frequency | Reason |
|----------|----------|----------------|--------|
| shopnet_sites | sn_ | On deployment | Low change frequency |
| shopnet_assist | sa_ | On deployment | Low change frequency |
| shopnet_crm | su_ | On deployment | Low change frequency |
| shopnet_registry | sl_ | On deployment | Low change frequency |
| shopnet_things | sg_ | Daily | May add new thing types frequently |
| shopnet_locations | sc_ | Daily | May add new location types |
| shopnet_transactions | st_ | On deployment | Low change frequency |
| shopnet_payments | sp_ | On deployment | Critical - manual only |
| shopnet_activities | sv_ | Daily | May add new activity types |

---

## Database Assignments

| UID Type | Database Name | Instance | Status | Local Taxonomy Table |
|----------|---------------|----------|--------|----------------------|
| **sn_** | shopnet_sites | 1 | Live | `taxonomy_definition` |
| **sa_** | shopnet_assist | 1 | Live | TBD (currently hardcoded ENUMs) |
| **su_** | shopnet_crm | 2 | Designed | TBD (needs design) |
| **sl_** | shopnet_registry | 2 | Designed | TBD (needs design) |
| **sg_** | shopnet_things | TBD | WIP | TBD (new database) |
| **sc_** | shopnet_locations | TBD | WIP | TBD (new database) |
| **st_** | shopnet_transactions | TBD | WIP | TBD (new database) |
| **sp_** | shopnet_payments | TBD | WIP | TBD (separate for compliance) |
| **sv_** | shopnet_activities | TBD | WIP | TBD (new database) |

---

## Implementation Phases

### Phase 1: Master Registry (Current)
- ✅ Create `taxonomy_law` table on shopnet_connect
- ✅ Load CSV data into taxonomy_law
- ✅ Create helper views and functions
- ✅ Document operational model

### Phase 2: API Layer
- ⬜ Create `/api/v1/taxonomy` endpoint on Connect Gateway
- ⬜ Support filtering by uid_type, level, parent_code
- ⬜ Cache responses (5-minute TTL)
- ⬜ Return JSON in format matching Console expectations

### Phase 3: Console Integration
- ⬜ Update Console wizards to fetch from taxonomy_law API
- ⬜ Replace hardcoded PLATFORM_OPTIONS with API calls
- ⬜ Add UID type selection (for future multi-type wizards)
- ⬜ Add status indicators (live/WIP/future)

### Phase 4: Local Taxonomy Tables
- ⬜ Design local taxonomy tables for sa_, su_, sl_
- ⬜ Create sync jobs for each UID type
- ⬜ Migrate hardcoded ENUMs to taxonomy tables
- ⬜ Update triggers to query local taxonomies

### Phase 5: New Databases
- ⬜ Provision RDS instances for sg_, sc_, st_, sp_, sv_
- ⬜ Create schemas for new databases
- ⬜ Create local taxonomy tables
- ⬜ Implement sync jobs

---

## API Endpoints

### Master Registry API

```
GET /api/v1/taxonomy
  Query params:
    - uid_type: sn_, sg_, sc_, st_, sp_, sl_, su_, sa_, sv_
    - level: L0, L1, L2, L3
    - parent_code: filter by parent
    - status: live, designed, WIP, future
    - active: true/false

  Returns: JSON array of taxonomy entries
  Cache: 5 minutes

GET /api/v1/taxonomy/{uid_type}/tree
  Returns: Hierarchical tree for a specific UID type
  Cache: 5 minutes

GET /api/v1/taxonomy/{uid_type}/{level}/{code}
  Returns: Specific taxonomy entry
  Cache: 15 minutes
```

### Local Taxonomy API (per database)

```
GET /api/v1/{uid_type}/taxonomy
  Example: GET /api/v1/sn_/taxonomy
  Returns: Local taxonomy cache for this UID type
  Source: Local database (fast)
  Use: High-frequency operational queries
```

---

## Migration Strategy

### Adding a New Taxonomy Value

1. **Update master registry:**
   ```sql
   -- On shopnet_connect
   INSERT INTO taxonomy_law (level, uid_type, parent_code, code, name, description, target_database, status)
   VALUES ('L2', 'sn_', 'I', 'K8S', 'Kubernetes Cluster', 'K8s cluster', 'shopnet_sites', 'WIP');
   ```

2. **Sync to local cache:**
   ```bash
   # Run sync job
   ./scripts/sync-taxonomy.sh sn_ shopnet_sites
   ```

3. **Test validation:**
   ```sql
   -- Should succeed
   INSERT INTO endpoint_taxonomy (site_uid, endpoint_type, platform_type, ...)
   VALUES ('sn_test', 'I', 'K8S', ...);
   ```

4. **Deploy to console:**
   - Console wizard automatically picks up new value on next API fetch

---

## Governance Rules

### THE LAW Authority Hierarchy

1. **Level 1:** THE LAW document (ThisIsTheLaw_vX.X.MD)
   - Defines what UID types exist
   - Defines semantic meaning
   - Ultimate authority

2. **Level 2:** `taxonomy_law` table (shopnet_connect)
   - Implements THE LAW in database form
   - Authoritative for operational systems
   - Updated via migration scripts only

3. **Level 3:** Local taxonomy tables (operational databases)
   - Cached copies for performance
   - Not authoritative (master is source of truth)
   - Synced from master periodically

### Update Process

1. **Propose change** to THE LAW document (WIP version)
2. **Review and approve** change (finalize WIP → new version)
3. **Create migration script** to update taxonomy_law
4. **Run migration** on shopnet_connect
5. **Sync to local caches** (manual or scheduled)
6. **Update documentation** (CSV, API docs)

---

## Validation Layers

### 3-Layer Validation

```
┌─────────────────────────────────────────────────────────────┐
│  Layer 1: Frontend Validation (Console)                     │
│  - Fetches valid values from taxonomy_law API              │
│  - Dropdowns only show valid options                        │
│  - User cannot submit invalid values                        │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  Layer 2: Application Validation (Connect Gateway / Flask)  │
│  - Validates against taxonomy_law before DB insert          │
│  - Returns 400 Bad Request if invalid                       │
│  - Logs validation errors                                   │
└─────────────────────────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│  Layer 3: Database Validation (Triggers)                    │
│  - Validates against local taxonomy cache                   │
│  - RAISES EXCEPTION if invalid                              │
│  - Prevents data corruption at DB level                     │
└─────────────────────────────────────────────────────────────┘
```

---

## Benefits of Two-Tier Model

### Centralized Governance
- ✅ Single source of truth (taxonomy_law)
- ✅ Cross-UID-type queries possible
- ✅ Easier to maintain consistency
- ✅ Version control through migrations

### Distributed Performance
- ✅ Fast local lookups (no cross-database queries)
- ✅ Optimized for high-frequency operations
- ✅ Reduced network latency
- ✅ Database isolation maintained

### Scalability
- ✅ Each UID type can have its own database instance
- ✅ Local caches can be independently scaled
- ✅ Master registry is read-mostly (low load)
- ✅ Sync jobs run independently per database

---

## Next Steps

1. **Load CSV into taxonomy_law** table on shopnet_connect
2. **Test queries** against taxonomy_law
3. **Build API endpoints** for taxonomy access
4. **Update Console** to use API instead of hardcoded values
5. **Design local taxonomy tables** for sa_, su_, sl_
6. **Implement sync jobs** for each UID type
7. **Provision new databases** for sg_, sc_, st_, sp_, sv_

---

**Document Status:** WIP
**Next Review:** After Phase 1 completion
