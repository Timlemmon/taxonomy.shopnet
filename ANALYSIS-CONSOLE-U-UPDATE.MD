# Analysis: What Needs To Be Updated For U (User Device)
**Date:** February 9, 2026
**Status:** INVESTIGATION ONLY - NO CHANGES MADE

---

## Current State

### ✅ Already Updated:
1. shopnet_connect.taxonomy_law - U entries added ✅
2. ThisIsTheLaw_v5.1_WIP.MD - Documentation updated ✅
3. complete-taxonomy-v5.1-WIP.csv - CSV updated ✅

### ❓ Need To Investigate:
1. shopnet_sites.taxonomy_definition table - Does it have U?
2. console.js hardcoded fallback lists - Where are they?
3. How Console loads taxonomy - Dynamic vs hardcoded?

---

## Investigation Plan (Read-Only)

### Step 1: Check shopnet_sites.taxonomy_definition
Query to see if U exists:
```sql
SELECT * FROM taxonomy_definition
WHERE endpoint_type = 'U' OR parent_code = 'U';
```

### Step 2: Check console.js PLATFORM_OPTIONS
Look at line 3546 where PLATFORM_OPTIONS is defined:
- Is it hardcoded?
- Or loaded from API?
- What's the fallback?

### Step 3: Check if Console has API endpoint
Look for: `/api/taxonomy` or similar endpoint that serves taxonomy

---

## Waiting for approval to proceed with read-only investigation...
