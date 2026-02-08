# Endpoint Taxonomy — Dynamic Validation Update

**Version:** 1.0
**Date:** February 7, 2026
**Author:** Claude (Opus 4.6), directed by Tim Lemmon
**Scope:** `validate_platform_type()` trigger, console.js `PLATFORM_OPTIONS`, Flask API

---

## 1. What Changed

The endpoint taxonomy validation system was **changed from hardcoded to dynamic**. Previously, valid `platform_type` values were hardcoded in three independent places. Now they all read from one source of truth: the `taxonomy_definition` table.

### Before (Hardcoded — Three Copies)

```
taxonomy_definition table          → Source of truth (74 rows)
                                      ↑ NOBODY READ FROM THIS

validate_platform_type() trigger   → Hardcoded IN lists (copy #1)
PLATFORM_OPTIONS in console.js     → Hardcoded const object (copy #2)
Flask app.py                       → No validation at all (passthrough)
```

Adding a new platform_type required editing all three places.

### After (Dynamic — Single Source of Truth)

```
taxonomy_definition table           → Source of truth (79 rows)
        │                                ↑ EVERYTHING READS FROM THIS
        ├──→ validate_platform_type()    → Dynamic SELECT against table
        ├──→ PLATFORM_OPTIONS            → Fetched from API on wizard open
        └──→ Flask API endpoint          → Serves table data to frontend
```

Adding a new platform_type requires **one INSERT into `taxonomy_definition`**. The trigger and UI pick it up automatically.

---

## 2. The Source of Truth: `taxonomy_definition` Table

**Database:** `shopnet_sites` on RDS (`amazon-products-db-1754023596.cenq4au2o7vl.us-east-1.rds.amazonaws.com`)

**Schema:**

```sql
CREATE TABLE IF NOT EXISTS taxonomy_definition (
    id SERIAL PRIMARY KEY,
    level VARCHAR(30) NOT NULL,        -- 'endpoint_type', 'platform_type', 'website_purpose', etc.
    parent_code VARCHAR(10),           -- For platform_type: the parent endpoint_type (W, A, D, N, I, O)
    code VARCHAR(30) NOT NULL,         -- The value code (e.g., 'CO', 'CP', 'LS')
    name VARCHAR(100) NOT NULL,        -- Display name (e.g., 'Lightsail Instance')
    description TEXT,                  -- Description shown in wizard
    active BOOLEAN DEFAULT TRUE,       -- Whether this value is currently valid
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(level, parent_code, code)
);
```

**SQL file:** `shopnet.network-console/scripts/update-taxonomy-v3.5.sql` (lines 22–33)

### Current Platform Types (as of Feb 7, 2026)

| endpoint_type | platform_type codes | Count |
|---------------|-------------------|-------|
| W (Website) | CL, CO, CP, L3, LM, S3, SH, WP, WW | 9 |
| A (Agent) | CA, CL, GM, GP, OT | 5 |
| D (Database) | DY, GIT, RD, S3, TPD | 5 |
| N (Node) | API, LLM, OTH, RDH, W3G, W3S | 6 |
| I (Infrastructure) | AGW, CF, EC2, LMB, LS, RDS, S3B, SNS, SQS | 9 |
| O (Other) | OTH | 1 |

**Total:** 35 platform_type rows

### How to Add a New Platform Type

One INSERT. Example — adding a new Infrastructure type for "ECS Cluster":

```sql
INSERT INTO taxonomy_definition (level, parent_code, code, name, description)
VALUES ('platform_type', 'I', 'ECS', 'ECS Cluster', 'Amazon ECS container cluster');
```

No other changes needed. The trigger and console wizard will pick it up automatically on next use.

---

## 3. The Database Trigger: `validate_platform_type()`

**Database:** `shopnet_sites`
**Table:** `endpoint_taxonomy`
**Trigger name:** `trg_validate_platform_type`
**Fires:** BEFORE INSERT OR UPDATE on `endpoint_taxonomy`

### Current Trigger (Dynamic — v3.5.1)

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
```

**SQL file:** `shopnet.network-console/scripts/update-taxonomy-v3.5.sql` (lines 258–299)

### How It Works

1. On every INSERT or UPDATE to `endpoint_taxonomy`, the trigger fires
2. It queries `taxonomy_definition` for active platform_types matching the endpoint_type
3. If the platform_type is found → allow the operation
4. If not found → RAISE EXCEPTION with a dynamic list of valid codes
5. **Safety net:** If `taxonomy_definition` has zero rows for the endpoint_type (table empty/corrupt), the trigger issues a WARNING but allows the operation — this prevents catastrophic lockout of the entire network

### Error Message Example

```
ERROR: Invalid platform_type ZZ for endpoint_type W . Valid: CL, CO, CP, L3, LM, S3, SH, WP, WW
```

The valid codes list is generated dynamically from the table, not hardcoded.

---

## 4. The Flask API Endpoint

**File:** `shopnet.network-console/app.py` (line ~803)
**Route:** `GET /api/brochure/taxonomy-definitions/platform-options`
**URL:** `https://shopnet.network/api/brochure/taxonomy-definitions/platform-options`

### Code

```python
@app.route('/api/brochure/taxonomy-definitions/platform-options', methods=['GET'])
def get_platform_options():
    """
    Get platform_type options grouped by endpoint_type from taxonomy_definition.
    THE LAW: taxonomy_definition is the source of truth for valid taxonomy values.
    Returns data in the exact shape console.js PLATFORM_OPTIONS expects.
    """
    try:
        with get_rds_connection() as conn:
            with conn.cursor() as cur:
                cur.execute("""
                    SELECT parent_code, code, name, description
                    FROM taxonomy_definition
                    WHERE level = 'platform_type' AND active = TRUE
                    ORDER BY parent_code, code
                """)
                rows = cur.fetchall()

                # Group by parent_code (endpoint_type) in PLATFORM_OPTIONS shape
                options = {}
                for row in rows:
                    parent = row['parent_code']
                    if parent not in options:
                        options[parent] = []
                    options[parent].append({
                        'value': row['code'],
                        'label': f"{row['name']} ({row['code']})",
                        'desc': row['description'] or ''
                    })

                return jsonify({
                    'success': True,
                    'platform_options': options
                })
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
```

### Response Shape

```json
{
  "success": true,
  "platform_options": {
    "W": [
      {"value": "CO", "label": "CloudFront On-Demand (CO)", "desc": "Lambda-backed, scales to zero"},
      ...
    ],
    "I": [
      {"value": "AGW", "label": "API Gateway (AGW)", "desc": "Amazon API Gateway"},
      {"value": "LS", "label": "Lightsail Instance (LS)", "desc": "Amazon Lightsail virtual server"},
      ...
    ],
    ...
  }
}
```

This is the exact shape `PLATFORM_OPTIONS` expects in console.js.

---

## 5. Console.js: Dynamic Loading with Fallback

**File:** `shopnet.network-console/static/js/console.js`

### PLATFORM_OPTIONS Variable (line ~3784)

Changed from `const` (immutable) to `let` (can be overwritten by API response). The hardcoded values serve as **fallback** if the API is unreachable:

```javascript
// FALLBACK values — overwritten by loadPlatformOptions() from taxonomy_definition API
// Source of truth: taxonomy_definition table in shopnet_sites DB
let PLATFORM_OPTIONS = {
    'W': [
        { value: 'CO', label: 'CloudFront On-Demand (CO)', desc: 'Lambda-backed, scales to zero' },
        { value: 'CP', label: 'CloudFront Persistent (CP)', desc: 'nginx on EC2, always running' },
        // ... 7 more
    ],
    'A': [ /* 5 items: CL, GP, GM, CA, OT */ ],
    'D': [ /* 5 items: RD, DY, S3, GIT, TPD */ ],
    'N': [ /* 6 items: W3G, API, RDH, W3S, LLM, OTH */ ],
    'I': [ /* 4 items in fallback: S3B, LMB, SQS, SNS — API returns 9 */ ],
    'O': [ /* 1 item: OTH */ ]
};
```

**Note:** The fallback `'I'` section has 4 items (pre-update values) while the live API returns 9 (including LS, EC2, RDS, CF, AGW). When the API is reachable, the fallback is completely overwritten.

### loadPlatformOptions() Function (line ~3834)

```javascript
/**
 * Load platform options from taxonomy_definition table via API.
 * THE LAW: taxonomy_definition is the source of truth.
 * Falls back to hardcoded PLATFORM_OPTIONS if API is unavailable.
 */
async function loadPlatformOptions() {
    try {
        const response = await fetch('/api/brochure/taxonomy-definitions/platform-options');
        if (!response.ok) {
            console.warn('Failed to load platform options from API, using hardcoded fallback');
            return;
        }
        const data = await response.json();
        if (data.success && data.platform_options) {
            PLATFORM_OPTIONS = data.platform_options;
            console.log('Platform options loaded from taxonomy_definition:',
                Object.keys(PLATFORM_OPTIONS).map(k => `${k}:${PLATFORM_OPTIONS[k].length}`).join(', '));
        }
    } catch (error) {
        console.warn('Error loading platform options, using hardcoded fallback:', error.message);
    }
}
```

**Pattern:** Identical to `loadSecretsIntoDropdowns()` (line ~3895) — fetch from API, graceful fallback on failure.

---

## 6. How the Endpoint Wizards Use This

### GUI Wizards (Human User)

Both the **Add Endpoint** and **Change Endpoint** wizards are accessed via buttons on each section toolbar in `index.html` or via the Radius page action cards.

**Wizard Protocol** (documented in `index.html` lines 7770–7866):

#### Add Endpoint Wizard

```
User clicks "Add Endpoint" button
    → calls openEndpointAdderWizard()                   [console.js line 3955]
        → await loadPlatformOptions()                    [fetches from taxonomy_definition API]
        → loadSecretsIntoDropdowns()                     [fetches auth secrets]
        → shows modal

Step 1: Select endpoint_type (W/A/D/N/I/O)              [radio buttons in HTML]
Step 2: Select platform_type                             [populatePlatformOptions() reads PLATFORM_OPTIONS]
Step 3: Enter details (domain, managed_by, etc.)
Step 4: Configure card (section, status)
Step 5: Confirm and submit
    → POST to Connect Gateway: /api/v1/site-uid/create  [issues SN-XXXXXXXX]
    → POST to Flask: /api/brochure/taxonomy              [creates taxonomy record]
    → DB trigger validates platform_type against taxonomy_definition
```

**Key function:** `populatePlatformOptions(endpointType)` at line ~4185:
```javascript
function populatePlatformOptions(endpointType) {
    const container = document.getElementById('platform-options-container');
    const options = PLATFORM_OPTIONS[endpointType] || [];
    // Renders radio card grid from PLATFORM_OPTIONS[endpointType]
}
```

#### Change Endpoint Wizard

```
User clicks "Change Endpoint" button
    → calls openEndpointEditorWizard(siteUid)            [console.js line 4366]
        → fetch(`/api/brochure/taxonomy/${siteUid}`)     [loads current record]
        → await loadPlatformOptions()                    [fetches from taxonomy_definition API]
        → await loadSecretsIntoDropdowns()
        → pre-selects current values in form
        → shows modal

Step 1: endpoint_type (pre-selected, editable)
Step 2: platform_type (pre-selected, editable)           [populateEditorPlatformOptions() reads PLATFORM_OPTIONS]
Step 3: Edit details
Step 4: Edit card config
Step 5: Review changes and submit
    → PUT /api/brochure/taxonomy/{site_uid}              [updates taxonomy record]
    → DB trigger validates platform_type against taxonomy_definition
```

**Key function:** `populateEditorPlatformOptions(endpointType)` at line ~4545:
```javascript
function populateEditorPlatformOptions(endpointType) {
    const container = document.getElementById('editor-platform-options-container');
    const options = PLATFORM_OPTIONS[endpointType] || [];
    // Renders radio card grid with current value pre-selected (yellow border)
}
```

### Claude CLI Process (AI Agent)

When Claude Code is asked to add or change endpoints, it uses the **same API endpoints** that the GUI wizards use. The process is documented on the Radius page (`index.html` lines 7773–7796):

#### Add Endpoint (Claude CLI)

```bash
# Step 1: Request site_uid from Connect Gateway
curl -s -X POST "https://connect.shopnet.network/api/v1/site-uid/create" \
  -H "Content-Type: application/json" \
  -d '{"domain_name": "example.com", "endpoint_type": "I", "platform_type": "LS"}'

# Step 2: Create taxonomy record (trigger validates platform_type dynamically)
curl -s -X POST "https://shopnet.network/api/brochure/taxonomy" \
  -H "Content-Type: application/json" \
  -d '{
    "site_uid": "SN-00000095",
    "endpoint_type": "I",
    "platform_type": "LS",
    "domain_name": "web3-multisite.52.70.242.70",
    "status": "live",
    "created_by": "claude-console"
  }'

# Step 3: Verify
curl -s "https://shopnet.network/api/brochure/taxonomy/SN-00000095"
```

#### Change Endpoint (Claude CLI)

```bash
# Step 1: GET current record
curl -s "https://shopnet.network/api/brochure/taxonomy/SN-00000078"

# Step 2-3: PUT with changed fields (trigger validates any platform_type change)
curl -s -X PUT "https://shopnet.network/api/brochure/taxonomy/SN-00000078" \
  -H "Content-Type: application/json" \
  -d '{"pulse_url": "ip:52.70.242.70", "updated_by": "claude-console"}'

# Step 4: Verify
curl -s "https://shopnet.network/api/brochure/taxonomy/SN-00000078"
```

**In both cases**, the `validate_platform_type()` trigger fires on the INSERT/UPDATE and dynamically checks the value against `taxonomy_definition`.

---

## 7. Complete Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        taxonomy_definition TABLE                             │
│                    (shopnet_sites DB on RDS)                                  │
│                                                                              │
│  id │ level         │ parent_code │ code │ name                │ active      │
│  ───┼───────────────┼─────────────┼──────┼─────────────────────┼──────       │
│  1  │ endpoint_type │ NULL        │ W    │ Website             │ true        │
│  2  │ endpoint_type │ NULL        │ I    │ Infrastructure      │ true        │
│  …  │ platform_type │ W           │ CO   │ CloudFront On-Dem…  │ true        │
│  …  │ platform_type │ I           │ LS   │ Lightsail Instance  │ true        │
│  …  │ platform_type │ I           │ EC2  │ EC2 Instance        │ true        │
│     │               │             │      │ (79 rows total)     │             │
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
│  IF table empty          │    │  → { "W": [{value,label,desc},...], ... }    │
│    → WARN + ALLOW        │    │                                              │
└──────────────────────────┘    └──────────────────┬───────────────────────────┘
               │                                   │
               │ Enforces on                       │ Fetched by
               ▼                                   ▼
┌──────────────────────────┐    ┌──────────────────────────────────────────────┐
│  endpoint_taxonomy TABLE │    │  console.js: loadPlatformOptions()           │
│                          │    │                                              │
│  INSERT/UPDATE validated │    │  → fetch('/api/brochure/taxonomy-            │
│  by trigger before save  │    │      definitions/platform-options')          │
│                          │    │  → PLATFORM_OPTIONS = response               │
│  Used by:                │    │  → Fallback to hardcoded if API fails        │
│  - Add Endpoint wizard   │    │                                              │
│  - Change Endpoint wizard│    │  Called by:                                  │
│  - Claude CLI process    │    │  - openEndpointAdderWizard()                 │
│                          │    │  - openEndpointEditorWizard()                │
└──────────────────────────┘    │                                              │
                                │  Consumed by:                                │
                                │  - populatePlatformOptions()                 │
                                │  - populateEditorPlatformOptions()           │
                                └──────────────────────────────────────────────┘
```

---

## 8. File Reference

| File | Lines | What |
|------|-------|------|
| `shopnet.network-console/app.py` | ~803–838 | Flask API endpoint `GET /api/brochure/taxonomy-definitions/platform-options` |
| `shopnet.network-console/app.py` | ~845–920 | `POST /api/brochure/taxonomy` — creates taxonomy record (trigger validates) |
| `shopnet.network-console/app.py` | ~922–980 | `PUT /api/brochure/taxonomy/<site_uid>` — updates record (trigger validates) |
| `shopnet.network-console/static/js/console.js` | ~3784–3827 | `PLATFORM_OPTIONS` variable (fallback values) |
| `shopnet.network-console/static/js/console.js` | ~3834–3850 | `loadPlatformOptions()` — fetches from API |
| `shopnet.network-console/static/js/console.js` | ~3854–3872 | `getPulseMethod()` — auto-determines pulse check type |
| `shopnet.network-console/static/js/console.js` | ~3955–3992 | `openEndpointAdderWizard()` — calls `loadPlatformOptions()` |
| `shopnet.network-console/static/js/console.js` | ~4185–4210 | `populatePlatformOptions()` — renders dropdown from `PLATFORM_OPTIONS` |
| `shopnet.network-console/static/js/console.js` | ~4366–4421 | `openEndpointEditorWizard()` — calls `loadPlatformOptions()` |
| `shopnet.network-console/static/js/console.js` | ~4545–4570 | `populateEditorPlatformOptions()` — renders dropdown with pre-selection |
| `shopnet.network-console/static/index.html` | ~7770–7866 | Wizard Protocol documentation (HTML comment + visible reference) |
| `shopnet.network-console/scripts/update-taxonomy-v3.5.sql` | 22–33 | `taxonomy_definition` table schema |
| `shopnet.network-console/scripts/update-taxonomy-v3.5.sql` | 109–123 | Infrastructure platform_type seed data (9 rows) |
| `shopnet.network-console/scripts/update-taxonomy-v3.5.sql` | 258–299 | `validate_platform_type()` trigger function |

---

## 9. Safety Features

### Trigger Safety Net

If `taxonomy_definition` is empty or corrupted (no rows for a given endpoint_type), the trigger does NOT block all operations. Instead:

```
IF valid_codes IS NULL THEN
    RAISE WARNING '...Allowing as safety fallback...'
    RETURN NEW;   ← operation proceeds
END IF;
```

This prevents a catastrophic lockout scenario where nobody can create or update endpoints.

### Console Fallback

If the Flask API is unreachable when a wizard opens, `loadPlatformOptions()` catches the error and keeps the hardcoded fallback values. The wizard still works with stale data. The trigger on the database is the true enforcer — if someone picks an option from stale fallback data that's been deactivated in `taxonomy_definition`, the INSERT/UPDATE will fail with a clear error.

### Rollback Procedure

The old hardcoded trigger is backed up. To restore:

```sql
-- Paste the old function source into this template:
CREATE OR REPLACE FUNCTION validate_platform_type()
RETURNS trigger LANGUAGE plpgsql AS $function$
BEGIN
    -- [paste old hardcoded IF/ELSE blocks here]
    RETURN NEW;
END;
$function$;
```

---

## 10. Known Issues and Notes

### L3 Naming Collision (Documentation Only)

`L3` appears in two unrelated contexts:
- **Platform type code:** `L3` = "Layer3 Web3" (Lambda@Edge with IP certs for emoji TLDs) — stored in `taxonomy_definition`
- **Display label:** `L3` = "Level 3: Website Purpose" — used in Endpoint Registry table headers (`console.js` line ~2774) and Site Cards (line ~1808)

These are separate concepts. No code fix needed, but worth knowing to avoid confusion.

### What Remains Hardcoded (Out of Scope)

| Item | File | Notes |
|------|------|-------|
| `getPulseMethod()` | console.js ~3854 | Maps endpoint_type + platform_type to pulse check method. Logic-based, not data-driven. |
| `populateConfirmation()` label maps | console.js ~4184 | Display labels for type names. Could be data-driven in future. |
| Endpoint type CHECK constraint | endpoint_taxonomy table | `CHECK (endpoint_type IN ('W','A','D','N','I','O','ND'))` — separate from trigger. |
| `HOSTING_TYPE_TO_TAXONOMY` | connect.shopnet `shopnet_connect_api.py` ~3086 | Maps hosting_type to taxonomy pairs. Different system. |

---

## 11. Change History

| Date | Change | By |
|------|--------|----|
| Feb 7, 2026 | Replaced hardcoded `validate_platform_type()` trigger with dynamic `taxonomy_definition` query | Claude (Opus 4.6) |
| Feb 7, 2026 | Added `GET /api/brochure/taxonomy-definitions/platform-options` Flask route | Claude (Opus 4.6) |
| Feb 7, 2026 | Made `PLATFORM_OPTIONS` dynamic in console.js with `loadPlatformOptions()` | Claude (Opus 4.6) |
| Feb 7, 2026 | Fixed W3→L3 in fallback `PLATFORM_OPTIONS` and `getPulseMethod()` | Claude (Opus 4.6) |
| Feb 7, 2026 | Added GM and OT to Agent platform_type fallback | Claude (Opus 4.6) |
| Feb 7, 2026 | Added 5 new Infrastructure platform_types: LS, EC2, RDS, CF, AGW | Claude (Opus 4.6) |
| Feb 7, 2026 | Updated `update-taxonomy-v3.5.sql` with dynamic trigger + 9 I types | Claude (Opus 4.6) |
| Feb 7, 2026 | Deployed all changes to production | Claude (Opus 4.6) |

---

*Part of the Shopnet Network Taxonomy Documentation*
*See also: ThisIsTheLaw.md, ThisIsTheLaw3.MD, FixingTheLaw.MD*
