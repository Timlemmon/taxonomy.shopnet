# Implementation Plan: Add U (User Device) Endpoint Type
**Date:** February 9, 2026
**Status:** ⚠️ AWAITING APPROVAL - DO NOT EXECUTE
**Impact:** Production database, documentation, GUI

---

## Summary

Add new **U (User Device)** endpoint_type to sn_ taxonomy for tracking end-user client devices (phones, tablets, laptops, desktops, watches, TVs).

**Key Changes:**
- Remove DEV from Infrastructure (I) platform_types
- Add U as new endpoint_type (same level as W, A, D, N, I, O)
- Add 7 platform_types under U (iOS, Android, Windows, macOS, Linux, ChromeOS, Other)
- Add 7 form_factors as L3 (phone, tablet, laptop, desktop, watch, tv, other)
- Pulse method: `none` (pending client app)

---

## Part 1: Database Changes

### 1.1 Update taxonomy_law Table (Master Registry)

**Database:** shopnet_connect
**Table:** taxonomy_law

#### Step 1: Remove DEV from Infrastructure
```sql
-- REMOVE: DEV as platform_type under Infrastructure (I)
DELETE FROM taxonomy_law
WHERE uid_type = 'sn_'
  AND parent_code = 'I'
  AND code = 'DEV';
```

#### Step 2: Add U (User Device) Endpoint Type
```sql
-- ADD: U as endpoint_type (L2)
INSERT INTO taxonomy_law (level, uid_type, parent_code, code, name, description, examples, target_database, status, active, notes)
VALUES (
    'L2',
    'sn_',
    'sn_',
    'U',
    'User Device',
    'End-user client devices (phones, tablets, laptops, desktops, watches, TVs)',
    'iPhone, Android phone, MacBook, Windows PC',
    'shopnet_sites',
    'WIP',
    TRUE,
    'Added Feb 9, 2026 - Moved from Infrastructure to own endpoint_type'
);
```

#### Step 3: Add Platform Types under U
```sql
-- ADD: Platform types (L2 - operating systems)
INSERT INTO taxonomy_law (level, uid_type, parent_code, code, name, description, examples, target_database, status, active, notes) VALUES
('L2', 'sn_', 'U', 'iOS', 'Apple iOS', 'Apple iOS ecosystem', 'iPhone, iPad', 'shopnet_sites', 'WIP', TRUE, NULL),
('L2', 'sn_', 'U', 'Android', 'Google Android', 'Android ecosystem', 'Samsung Galaxy, Pixel', 'shopnet_sites', 'WIP', TRUE, NULL),
('L2', 'sn_', 'U', 'Windows', 'Microsoft Windows', 'Windows OS', 'Surface, Dell PC', 'shopnet_sites', 'WIP', TRUE, NULL),
('L2', 'sn_', 'U', 'macOS', 'Apple macOS', 'Apple desktop/laptop OS', 'MacBook, iMac', 'shopnet_sites', 'WIP', TRUE, NULL),
('L2', 'sn_', 'U', 'Linux', 'Linux', 'Linux distributions', 'Ubuntu laptop, Debian desktop', 'shopnet_sites', 'WIP', TRUE, NULL),
('L2', 'sn_', 'U', 'ChromeOS', 'Chrome OS', 'Google Chrome OS', 'Chromebook', 'shopnet_sites', 'WIP', TRUE, NULL),
('L2', 'sn_', 'U', 'Other', 'Other OS', 'Other operating systems', 'Custom OS', 'shopnet_sites', 'WIP', TRUE, NULL);
```

#### Step 4: Add Form Factors (L3)
```sql
-- ADD: Form factors (L3) for each platform_type
-- Note: These apply to ALL platform_types, so we'll add them generically
INSERT INTO taxonomy_law (level, uid_type, parent_code, code, name, description, examples, target_database, status, active, notes) VALUES
('L3', 'sn_', 'iOS', 'phone', 'Smartphone', 'Mobile phone device', 'iPhone 15', 'shopnet_sites', 'WIP', TRUE, NULL),
('L3', 'sn_', 'iOS', 'tablet', 'Tablet', 'Tablet device', 'iPad Pro', 'shopnet_sites', 'WIP', TRUE, NULL),
('L3', 'sn_', 'iOS', 'watch', 'Smartwatch', 'Wearable watch device', 'Apple Watch', 'shopnet_sites', 'WIP', TRUE, NULL),
('L3', 'sn_', 'iOS', 'tv', 'Smart TV', 'Television/streaming device', 'Apple TV', 'shopnet_sites', 'WIP', TRUE, NULL),
('L3', 'sn_', 'Android', 'phone', 'Smartphone', 'Mobile phone device', 'Samsung Galaxy', 'shopnet_sites', 'WIP', TRUE, NULL),
('L3', 'sn_', 'Android', 'tablet', 'Tablet', 'Tablet device', 'Samsung Tab', 'shopnet_sites', 'WIP', TRUE, NULL),
('L3', 'sn_', 'Android', 'watch', 'Smartwatch', 'Wearable watch device', 'Wear OS watch', 'shopnet_sites', 'WIP', TRUE, NULL),
('L3', 'sn_', 'Android', 'tv', 'Smart TV', 'Television/streaming device', 'Android TV', 'shopnet_sites', 'WIP', TRUE, NULL),
('L3', 'sn_', 'Windows', 'laptop', 'Laptop', 'Portable computer', 'Surface Laptop', 'shopnet_sites', 'WIP', TRUE, NULL),
('L3', 'sn_', 'Windows', 'desktop', 'Desktop', 'Desktop computer', 'Dell Desktop', 'shopnet_sites', 'WIP', TRUE, NULL),
('L3', 'sn_', 'Windows', 'tablet', 'Tablet', 'Tablet device', 'Surface Pro', 'shopnet_sites', 'WIP', TRUE, NULL),
('L3', 'sn_', 'macOS', 'laptop', 'Laptop', 'Portable computer', 'MacBook Pro', 'shopnet_sites', 'WIP', TRUE, NULL),
('L3', 'sn_', 'macOS', 'desktop', 'Desktop', 'Desktop computer', 'iMac', 'shopnet_sites', 'WIP', TRUE, NULL),
('L3', 'sn_', 'Linux', 'laptop', 'Laptop', 'Portable computer', 'Ubuntu laptop', 'shopnet_sites', 'WIP', TRUE, NULL),
('L3', 'sn_', 'Linux', 'desktop', 'Desktop', 'Desktop computer', 'Debian desktop', 'shopnet_sites', 'WIP', TRUE, NULL),
('L3', 'sn_', 'ChromeOS', 'laptop', 'Laptop', 'Portable computer', 'Chromebook', 'shopnet_sites', 'WIP', TRUE, NULL),
('L3', 'sn_', 'Other', 'other', 'Other', 'Other form factor', 'Custom device', 'shopnet_sites', 'WIP', TRUE, NULL);
```

**Row Changes:**
- DELETE: 1 row (DEV from Infrastructure)
- INSERT: 1 + 7 + 17 = 25 rows (endpoint_type + platform_types + form_factors)
- **Net change: +24 rows** (244 → 268 total)

---

### 1.2 Update shopnet_sites.taxonomy_definition (Local Cache)

**Database:** shopnet_sites
**Table:** taxonomy_definition

#### Step 1: Remove DEV from Infrastructure
```sql
-- Check if DEV exists as Infrastructure platform_type
SELECT * FROM taxonomy_definition
WHERE endpoint_type = 'I' AND platform_type = 'DEV';

-- If exists, DELETE it
DELETE FROM taxonomy_definition
WHERE endpoint_type = 'I' AND platform_type = 'DEV';
```

#### Step 2: Add U endpoint_type to ENUM (if using ENUM)
**Note:** Check if endpoint_type column uses ENUM or VARCHAR. If ENUM:
```sql
-- Check current ENUM values
SELECT enum_range(NULL::endpoint_type_enum);

-- Add U to ENUM (requires ALTER TYPE)
ALTER TYPE endpoint_type_enum ADD VALUE IF NOT EXISTS 'U';
```

#### Step 3: Add taxonomy_definition entries for U
```sql
-- Note: Actual schema TBD - this is example structure
-- May need to add to taxonomy_definition or create separate device_taxonomy table
```

**Action:** Inspect actual shopnet_sites.taxonomy_definition schema before implementing

---

## Part 2: Documentation Updates

### 2.1 Update ThisIsTheLaw_v5.1_WIP Document

**File:** `/Users/tim001/VSCode/HMCG/taxonomy.shopnet/ThisIsTheLaw_v5.1_WIP_2026-02-09.MD`

**Changes:**
1. Add U (User Device) to L2 endpoint_types section
2. Add full L2/L3 taxonomy for U
3. Update Infrastructure (I) section to remove DEV
4. Add note about pulse method: none (pending client app)

**Section to add:**
```markdown
#### L2: endpoint_type = 'U' (User Device)

**Name:** User Device
**Description:** End-user client devices (phones, tablets, laptops, desktops, watches, TVs)
**Pulse Method:** `none` (pending client app - devices cannot be checked from outside without app sending heartbeats)
**Added:** February 9, 2026

**Platform Types (L2):**
- **iOS** - Apple iOS ecosystem (iPhone, iPad)
- **Android** - Android ecosystem (Samsung, Pixel)
- **Windows** - Microsoft Windows (Surface, Dell PC)
- **macOS** - Apple macOS (MacBook, iMac)
- **Linux** - Linux distributions (Ubuntu, Debian)
- **ChromeOS** - Google Chrome OS (Chromebook)
- **Other** - Other operating systems

**Form Factors (L3):**
- **phone** - Smartphone
- **tablet** - Tablet device
- **laptop** - Laptop computer
- **desktop** - Desktop computer
- **watch** - Smartwatch/wearable
- **tv** - Smart TV/streaming device
- **other** - Other form factor

**Example UIDs:**
- `sn_abc123` → U → iOS → phone (iPhone)
- `sn_def456` → U → macOS → laptop (MacBook Pro)
- `sn_ghi789` → U → Windows → desktop (Dell Desktop)

**Pulse Monitoring:**
User devices cannot be checked from outside (behind NAT/firewalls by design).
Future: When client app is developed, pulse_method will be 'device_heartbeat' with app sending periodic pings.
```

---

### 2.2 Update GUI "This Is The Law" Page

**File:** `/Users/tim001/VSCode/HMCG/server-backups/2026-02-08/home-ubuntu/shopnet-console/static/js/console.js`
**Production Location:** `/home/ubuntu/shopnet-console/static/js/console.js` (on server)

**Actions:**
1. Search for hardcoded endpoint_type lists (W, A, D, N, I, O)
2. Add 'U' to endpoint_type options
3. If taxonomy is hardcoded, update to fetch from taxonomy_law API instead
4. Update any wizards that create sites to include U option

**Future:** Build GET /api/v1/taxonomy endpoint so Console fetches taxonomy dynamically

---

## Part 3: Pulse Check System Updates

### 3.1 Add device_heartbeat Pulse Method (Design Only)

**File:** `/opt/shopnet/connect-gateway/pulse/checks.py`

**Add function (not implemented, just documented):**
```python
async def check_device_heartbeat_pulse(site_uid: str, db_func) -> Dict[str, Any]:
    """
    Check if user device is alive by verifying recent heartbeat.

    **Status:** DESIGNED - Not yet implemented (pending client app)

    Requires:
    - Client app running on device
    - App sends POST /api/v1/device/heartbeat every 5-15 minutes
    - Server updates last_seen_at timestamp

    Green: Heartbeat within last 15 minutes
    Orange: Heartbeat within last hour
    Red: No heartbeat in over 1 hour

    Returns: {"status": "green|orange|red|grey", "latency_ms": int, "error": str|None}
    """
    # Implementation pending client app development
    return {"status": "grey", "latency_ms": 0, "error": "Client app not yet developed"}
```

**For Now:** U (User Device) endpoints:
- `pulse_enabled = false`
- `pulse_method = 'none'`
- `pulse_notes = 'Pending client app - devices require app for heartbeat monitoring'`

---

### 3.2 Update endpoint_taxonomy Schema

**Database:** shopnet_sites
**Table:** endpoint_taxonomy

**Future columns needed (not adding yet):**
```sql
-- When client app is developed, add:
ALTER TABLE endpoint_taxonomy ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMP;
ALTER TABLE endpoint_taxonomy ADD COLUMN IF NOT EXISTS device_info JSONB;
ALTER TABLE endpoint_taxonomy ADD COLUMN IF NOT EXISTS pulse_notes TEXT;
```

**For now:** Just use existing pulse columns with pulse_method='none'

---

## Part 4: CSV Export Update

### 4.1 Update complete-taxonomy-v5.1-WIP.csv

**File:** `/Users/tim001/VSCode/HMCG/taxonomy.shopnet/complete-taxonomy-v5.1-WIP.csv`

**Changes:**
1. Remove row: `L2,sn_,I,DEV,Client Device,...`
2. Add 25 new rows (1 endpoint_type + 7 platform_types + 17 form_factors)
3. Update row count: 244 → 268

---

## Part 5: Verification Steps

### 5.1 Database Verification
```sql
-- Verify taxonomy_law changes
SELECT level, parent_code, code, name, status
FROM taxonomy_law
WHERE uid_type = 'sn_'
  AND (parent_code = 'U' OR code = 'U')
ORDER BY level, code;

-- Should return 25 rows (1 U + 7 platform_types + 17 form_factors)

-- Verify DEV removed from Infrastructure
SELECT * FROM taxonomy_law
WHERE uid_type = 'sn_' AND parent_code = 'I' AND code = 'DEV';

-- Should return 0 rows

-- Verify total count
SELECT
    level,
    COUNT(*) as count
FROM taxonomy_law
WHERE uid_type = 'sn_'
GROUP BY level
ORDER BY level;

-- Should show increased counts at L2 and L3
```

### 5.2 Documentation Verification
- [ ] ThisIsTheLaw_v5.1_WIP has U section
- [ ] Infrastructure (I) section no longer mentions DEV
- [ ] CSV export has correct row count (268)
- [ ] Pulse method documented as 'none' (pending client app)

### 5.3 Console Verification
- [ ] Console GUI shows U in endpoint_type dropdown
- [ ] Creating new site shows U as option
- [ ] Platform types populate correctly when U is selected

---

## Execution Order (When Approved)

**⚠️ DO NOT EXECUTE WITHOUT EXPLICIT "GO" FROM USER**

1. ✅ Create SQL scripts (006_add_u_user_device.sql)
2. ⏸️ Test on local database first
3. ⏸️ Backup production taxonomy_law table
4. ⏸️ Execute SQL on shopnet_connect.taxonomy_law
5. ⏸️ Update ThisIsTheLaw_v5.1_WIP document
6. ⏸️ Update CSV export
7. ⏸️ Update Console GUI files
8. ⏸️ Document pulse method (design only, no code changes)
9. ⏸️ Verify all changes
10. ⏸️ Create documentation summary

---

## Rollback Plan

If issues occur:

### Database Rollback
```sql
-- Restore from backup
-- OR manually remove changes:

-- Remove U taxonomy entries
DELETE FROM taxonomy_law WHERE uid_type = 'sn_' AND (parent_code = 'U' OR code = 'U');

-- Restore DEV to Infrastructure
INSERT INTO taxonomy_law (level, uid_type, parent_code, code, name, description, examples, target_database, status, active, notes)
VALUES ('L2', 'sn_', 'I', 'DEV', 'Client Device', 'End-user computing devices', 'iPhone, MacBook, Windows PC', 'shopnet_sites', 'WIP', TRUE, 'Restored after rollback');
```

### Documentation Rollback
- Revert ThisIsTheLaw_v5.1_WIP from git history
- Revert CSV export from git history

---

## Risk Assessment

| Risk | Severity | Mitigation |
|------|----------|-----------|
| Breaking existing I/DEV references | LOW | DEV not yet used in production |
| Console dropdowns break | MEDIUM | Test in staging first, verify endpoint_type list updated |
| Taxonomy_law constraint violations | LOW | UNIQUE constraint prevents duplicates |
| Production sites affected | LOW | No existing U endpoints, purely additive |

**Overall Risk: LOW** - This is an additive change with minimal production impact.

---

## Notes

- **Status:** WIP taxonomy (not yet in production use)
- **Dependencies:** None (standalone taxonomy addition)
- **Client App Required:** Yes (for pulse monitoring functionality)
- **Breaking Changes:** None (DEV was never used)

---

## Summary

**What's changing:**
- ➖ Remove: DEV from Infrastructure (I)
- ➕ Add: U (User Device) as new endpoint_type
- ➕ Add: 7 platform_types (iOS, Android, Windows, macOS, Linux, ChromeOS, Other)
- ➕ Add: 17 form_factors across platform_types
- 📝 Document: pulse_method='none' (pending client app)

**Impact:**
- Database: +24 rows in taxonomy_law
- Documentation: Updated ThisIsTheLaw, CSV export
- GUI: Console endpoint_type dropdown updated
- Pulse: Design documented, implementation pending client app

**Status:** ⚠️ AWAITING USER APPROVAL TO PROCEED

---

**Ready for approval? Reply "GO" to execute or provide feedback for adjustments.**
