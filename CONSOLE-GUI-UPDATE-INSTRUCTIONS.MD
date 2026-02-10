# Console GUI Update Instructions - Add U (User Device)
**Date:** February 9, 2026
**Status:** Manual update required on server

---

## Overview

The Console GUI (shopnet-console) needs to be updated to include the new U (User Device) endpoint_type in dropdowns and wizards.

---

## Files to Update

### 1. Console JavaScript
**Location:** `/home/ubuntu/shopnet-console/static/js/console.js` (on server)
**Backup Location:** `/Users/tim001/VSCode/HMCG/server-backups/2026-02-08/home-ubuntu/shopnet-console/static/js/console.js`

#### Changes Needed:

**A. Update endpoint_type dropdown/list:**

Find references to endpoint types (search for: `['W', 'A', 'D', 'N', 'I', 'O']` or similar)

Add `'U'` to the list:
```javascript
// BEFORE:
const endpointTypes = ['W', 'A', 'D', 'N', 'I', 'O'];

// AFTER:
const endpointTypes = ['W', 'A', 'D', 'N', 'I', 'U', 'O'];
```

**B. Update endpoint_type labels:**
```javascript
// Add to endpoint type display names:
const endpointTypeNames = {
    'W': 'Website',
    'A': 'Agent Platform',
    'D': 'Database',
    'N': 'Node',
    'I': 'Infrastructure',
    'U': 'User Device',  // ADD THIS
    'O': 'Other'
};
```

**C. Update platform_type options for U:**

Add platform types when U is selected:
```javascript
const platformTypes = {
    'W': ['CO', 'CP', 'WP', 'SH', 'WW', 'CL', 'S3', 'LM', 'L3'],
    'A': ['CL', 'GP', 'GM', 'CA', 'OT'],
    'D': ['RD', 'DY', 'S3', 'GIT', 'TPD'],
    'N': ['W3G', 'API', 'RDH', 'W3S', 'LLM', 'OTH'],
    'I': ['S3B', 'LMB', 'SQS', 'SNS', 'LS', 'EC2', 'RDS', 'CF', 'AGW'],
    'U': ['iOS', 'Android', 'Windows', 'macOS', 'Linux', 'ChromeOS', 'Other'],  // ADD THIS
    'O': ['OTH']
};

const platformTypeNames = {
    // ... existing entries ...
    // ADD THESE:
    'iOS': 'Apple iOS',
    'Android': 'Google Android',
    'Windows': 'Microsoft Windows',
    'macOS': 'Apple macOS',
    'Linux': 'Linux',
    'ChromeOS': 'Chrome OS',
    'Other': 'Other OS'
};
```

---

## Future: Migrate to API-Driven Taxonomy

**Current:** Console has hardcoded taxonomy lists in JavaScript
**Future:** Console should fetch taxonomy from API

### Recommended Approach:

1. Build taxonomy API endpoint:
   ```
   GET /api/v1/taxonomy
   GET /api/v1/taxonomy/sn_/endpoint_types
   GET /api/v1/taxonomy/sn_/platform_types?endpoint_type=U
   ```

2. Update Console to fetch on page load:
   ```javascript
   async function loadTaxonomy() {
       const response = await fetch('/api/v1/taxonomy/sn_/endpoint_types');
       const endpointTypes = await response.json();
       // Populate dropdowns dynamically
   }
   ```

3. Benefits:
   - No code changes needed when taxonomy updates
   - Single source of truth (taxonomy_law database)
   - Automatic synchronization

---

## Verification Steps

After updating console.js:

1. **Test endpoint_type dropdown:**
   - [ ] Open "Create New Site" wizard
   - [ ] Verify U appears in endpoint_type dropdown
   - [ ] Select U

2. **Test platform_type dropdown:**
   - [ ] After selecting U, platform_type dropdown should show:
     - iOS
     - Android
     - Windows
     - macOS
     - Linux
     - ChromeOS
     - Other

3. **Test site creation:**
   - [ ] Create test site with U → iOS → phone
   - [ ] Verify it saves to database correctly
   - [ ] Check endpoint_taxonomy table

---

## Pulse Configuration Note

When creating U (User Device) endpoints via Console:
- Set `pulse_enabled = false`
- Set `pulse_method = 'none'`
- Add note: "Pulse monitoring requires client app (not yet implemented)"

---

## Status

**Database:** ✅ Updated (taxonomy_law has U entries)
**Documentation:** ✅ Updated (ThisIsTheLaw, CSV)
**Console GUI:** ⏸️ **Awaiting manual update on server**

---

## Next Steps

1. SSH to server: `ssh ubuntu@<server-ip>`
2. Backup console.js: `cp /home/ubuntu/shopnet-console/static/js/console.js /home/ubuntu/shopnet-console/static/js/console.js.backup-$(date +%Y%m%d-%H%M%S)`
3. Edit console.js to add U endpoint_type
4. Restart Console service if needed
5. Test in browser
6. Commit changes to git
