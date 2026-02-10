# Taxonomizer Tool Specification
**Date:** February 10, 2026
**Location:** shopnet.network-console GUI page
**Purpose:** Visual tool to validate taxonomy through use case mapping

---

## Vision

**"Find or Do Anything"**

The Taxonomizer is a visual tool that demonstrates Shopnet's capability to represent any use case through its UID taxonomy. It maps real-world scenarios to UID types, displays them as connected cards, and validates that the taxonomy is complete.

---

## Why Build This?

### 1. **Demonstration Tool**
Show the power of shopnet.network - "Find or Do Anything"
- Visual proof that our taxonomy can handle any scenario
- Marketing/sales tool to show comprehensive coverage
- Interactive demo for stakeholders

### 2. **Validation Tool**
Test that taxonomy structure actually works
- Run 100+ use cases through the system
- Identify gaps where we lack UID types
- Validate L2/L3 taxonomy values are sufficient
- Find edge cases and missing relationships

### 3. **Design Research Tool**
Collect data to inform card system redesign
- See what fields are actually used in real scenarios
- Understand card relationships and dependencies
- Identify common patterns across use cases
- Inform L2/L3 taxonomy expansion

---

## Location

**Console GUI Page:** `https://shopnet.network-console.com/taxonomizer`

**Menu Item:** "Taxonomizer" in main navigation

---

## Data Source

**Single Source of Truth:** `shopnet_connect.taxonomy_law` table

- 9 UID types (L0/L1)
- L2 subtypes for each UID type
- L3 attributes for each subtype
- Examples, descriptions, status

**Read-Only:** Taxonomizer never modifies taxonomy_law, only reads it

---

## Two Operating Modes

### Mode 1: Interactive Mode (User Input)

**User Flow:**
1. User types a use case scenario in text input
2. Click "Analyze" button
3. Taxonomizer agent processes the scenario
4. Displays connected card flow diagram
5. Shows which UIDs are needed and how they relate

**Example:**
```
Input: "User orders pizza for delivery"

Output: Connected Flow Diagram
┌──────────┐    places    ┌──────────┐
│ User Card│──────────────>│Thing Card│
│ su_      │               │ sg_      │
│ Customer │               │ Pizza    │
└────┬─────┘               └──────────┘
     │
     │ makes
     v
┌──────────┐    pays via   ┌──────────┐
│ Payment  │──────────────>│Transaction│
│ sp_      │               │ st_       │
│ Card Pay │               │ Delivery  │
└──────────┘               └────┬──────┘
                                │
                                │ to
                                v
                           ┌──────────┐
                           │Location  │
                           │ sc_      │
                           │ Address  │
                           └──────────┘
```

**UI Elements:**
- Text input for use case
- "Analyze" button
- Card flow visualization area
- Relationship lines with labels
- Click card to see taxonomy details (L2/L3 values)
- "Export PNG" button to save diagram

---

### Mode 2: Batch Mode (Auto-Generate)

**User Flow:**
1. Click "Generate 100 Use Cases" button
2. Taxonomizer agent generates diverse scenarios
3. Analyzes each scenario
4. Saves results to CSV
5. Shows summary report

**Generated Use Cases (Examples):**
```
1. User orders pizza for delivery
2. Company sends invoice to customer
3. Team manages website redesign project
4. AI agent sends email notification
5. Customer books hotel room
6. User adds items to shopping cart
7. Payment processor refunds transaction
8. Warehouse ships product to store
9. User creates wedding gift registry
10. Agent schedules calendar event
... 90 more
```

**CSV Output Format:**
```csv
use_case_id,scenario,uid_types_needed,missing_types,gaps_found,l2_values_used,l3_values_used,card_types_needed,notes
1,"User orders pizza for delivery","su_,sg_,sp_,st_,sc_","","","su_:person|sg_:product|sp_:card_payment|st_:shipment|sc_:home","su_:active|sg_:food_dining|sp_:completed|st_:in_transit|sc_:residential","User,Thing,Payment,Transaction,Location",""
2,"Company sends invoice to customer","su_,sp_,st_","","","su_:company|sp_:invoice|st_:message","su_:verified|sp_:pending|st_:sent","User,Payment,Transaction",""
3,"Track shopping cart","sg_,sl_,su_","","Need session/cart type?","sg_:product|sl_:shopping_list|su_:person","sg_:available|sl_:active|su_:logged_in","Thing,List,User","Could use sl_ for cart or need new type?"
...
```

**Summary Report:**
```
Taxonomizer Batch Analysis Report
Date: 2026-02-10
Use Cases Analyzed: 100

Coverage:
✅ 95 scenarios fully covered by existing taxonomy
⚠️  4 scenarios partially covered (workarounds exist)
❌ 1 scenario missing UID type

UID Type Usage:
- sn_ (Network): 23 use cases
- sg_ (Thing): 87 use cases
- sc_ (Location): 45 use cases
- st_ (Transaction): 78 use cases
- sp_ (Payment): 34 use cases
- sl_ (List): 12 use cases
- su_ (User): 92 use cases
- sa_ (Agent): 15 use cases
- sv_ (Activity): 31 use cases

Most Common L2 Values:
- su_:person (78 times)
- sg_:product (54 times)
- st_:message (34 times)
- sc_:home (28 times)
- sp_:card_payment (22 times)

Gaps Identified:
1. Session management (shopping cart, browsing session)
   - Workaround: Use sl_ (List:shopping_list)
   - Recommendation: Add ss_ (Session) UID type?

2. Real-time events (notifications, alerts)
   - Workaround: Use st_ (Transaction:notification)
   - Status: Acceptable, no change needed

L2/L3 Values Needed:
- See CSV for complete list
- 47 unique L2 values used
- 89 unique L3 values used

Card Type Usage:
- User Card: 92 times
- Thing Card: 87 times
- Transaction Card: 78 times
- Location Card: 45 times
- Payment Card: 34 times
- Activity Card: 31 times
- Network Card: 23 times
- Agent Card: 15 times
- List Card: 12 times

Export: taxonomizer_batch_2026-02-10_143045.csv
```

---

## Agent Specification

### Agent Details
- **Agent Type:** sa_ (Agent)
- **Agent Skill:** data (taxonomy analysis)
- **Platform:** Claude Agent Platform (sn_ with endpoint_type='A')
- **Model:** claude-sonnet-4.5

### Agent Capabilities

#### 1. Scenario Analysis
Parse use case text and identify:
- **Actors** (su_ users, sa_ agents)
- **Objects** (sg_ things, sc_ locations)
- **Actions** (st_ transactions, sv_ activities)
- **Payments** (sp_ payments)
- **Collections** (sl_ lists)
- **Infrastructure** (sn_ endpoints)

#### 2. UID Mapping
For each entity in scenario:
- Determine UID type (sn_, sg_, sc_, st_, sp_, sl_, su_, sa_, sv_)
- Select L2 subtype from taxonomy_law
- Assign L3 attributes from taxonomy_law
- Flag if taxonomy_law lacks needed type/subtype/attribute

#### 3. Relationship Detection
Identify connections between UIDs:
- **owns** (su_ owns sg_)
- **places** (su_ places st_)
- **pays** (su_ pays sp_)
- **delivers_to** (st_ delivers_to sc_)
- **assigns** (sv_ assigns su_)
- **hosts** (sn_ hosts sa_)
- **contains** (sl_ contains sg_)

#### 4. Use Case Generation (Batch Mode)
Generate diverse scenarios covering:
- E-commerce (orders, payments, shipping)
- Communication (messages, notifications)
- Collaboration (projects, teams, tasks)
- Location (stores, deliveries, events)
- AI agents (automation, assistance)
- Lists/collections (registries, carts, teams)
- Infrastructure (hosting, APIs, databases)

Ensure:
- Coverage of all 9 UID types
- Mix of simple (2-3 UIDs) and complex (5+ UIDs) scenarios
- Real-world use cases (not contrived)

#### 5. Gap Detection
Identify:
- Scenarios that can't be fully represented
- Missing L2 subtypes in taxonomy_law
- Missing L3 attributes in taxonomy_law
- Missing UID types entirely
- Relationships that can't be expressed

#### 6. CSV Export
Generate CSV with columns:
- use_case_id
- scenario (text description)
- uid_types_needed (comma-separated list)
- missing_types (gaps identified)
- gaps_found (description)
- l2_values_used (type:value pairs)
- l3_values_used (type:value pairs)
- card_types_needed (list)
- notes

---

## GUI Design

### Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ Shopnet Console > Taxonomizer                          [User ▾] │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ╔═══════════════════════════════════════════════════════════╗ │
│  ║                    TAXONOMIZER                            ║ │
│  ║        "Find or Do Anything" - Taxonomy Validator         ║ │
│  ╚═══════════════════════════════════════════════════════════╝ │
│                                                                 │
│  ┌─── Mode Selection ────────────────────────────────────────┐ │
│  │  ◉ Interactive Mode    ○ Batch Mode (Generate 100)       │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─── Use Case Input ────────────────────────────────────────┐ │
│  │                                                            │ │
│  │  Describe a use case scenario:                            │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │ User orders pizza for delivery                       │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                                                            │ │
│  │  [Analyze Use Case]  [Clear]                              │ │
│  │                                                            │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─── Card Flow Diagram ─────────────────────────────────────┐ │
│  │                                                            │ │
│  │                                                            │ │
│  │    ┌──────────┐    places    ┌──────────┐                │ │
│  │    │ 👤       │──────────────>│ 🍕       │                │ │
│  │    │ User     │               │ Thing    │                │ │
│  │    │ su_      │               │ sg_      │                │ │
│  │    │ Customer │               │ Pizza    │                │ │
│  │    └────┬─────┘               └──────────┘                │ │
│  │         │                                                  │ │
│  │         │ makes payment                                    │ │
│  │         v                                                  │ │
│  │    ┌──────────┐    pays for   ┌──────────┐                │ │
│  │    │ 💳       │──────────────>│ 📦       │                │ │
│  │    │ Payment  │               │Transaction│                │ │
│  │    │ sp_      │               │ st_       │                │ │
│  │    │ Card Pay │               │ Delivery  │                │ │
│  │    └──────────┘               └────┬──────┘                │ │
│  │                                    │                       │ │
│  │                                    │ to                    │ │
│  │                                    v                       │ │
│  │                               ┌──────────┐                 │ │
│  │                               │ 📍       │                 │ │
│  │                               │ Location │                 │ │
│  │                               │ sc_      │                 │ │
│  │                               │ Address  │                 │ │
│  │                               └──────────┘                 │ │
│  │                                                            │ │
│  │  [Export PNG]  [Export JSON]                              │ │
│  │                                                            │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
│  ┌─── Analysis Results ──────────────────────────────────────┐ │
│  │                                                            │ │
│  │  ✅ Scenario fully supported by taxonomy                  │ │
│  │                                                            │ │
│  │  UIDs Required: 5                                         │ │
│  │  • su_ - User (person)                                    │ │
│  │  • sg_ - Thing (product:food_dining)                      │ │
│  │  • sp_ - Payment (card_payment:visa)                      │ │
│  │  • st_ - Transaction (shipment:delivery)                  │ │
│  │  • sc_ - Location (home:residential)                      │ │
│  │                                                            │ │
│  │  L2 Values Used: 5                                        │ │
│  │  L3 Values Used: 5                                        │ │
│  │                                                            │ │
│  │  Gaps Found: None                                         │ │
│  │                                                            │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Batch Mode GUI

When Batch Mode selected:

```
┌─── Batch Analysis ─────────────────────────────────────────┐
│                                                            │
│  Generate and analyze 100 use cases to validate taxonomy  │
│                                                            │
│  [Generate & Analyze 100 Use Cases]                       │
│                                                            │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 47/100                │
│                                                            │
│  Processing: "Team manages website redesign project"      │
│                                                            │
│  ┌────────────────────────────────────────────────────┐   │
│  │ Results Summary                                    │   │
│  │                                                    │   │
│  │ Analyzed: 47 / 100                                │   │
│  │ ✅ Fully Covered: 45                              │   │
│  │ ⚠️  Partial: 1                                     │   │
│  │ ❌ Missing: 1                                     │   │
│  │                                                    │   │
│  │ Gaps:                                             │   │
│  │ • Session management (use case #23)               │   │
│  │                                                    │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
└───────────────────────────────────────────────────────────┘
```

When complete:

```
┌─── Batch Analysis Complete ───────────────────────────────┐
│                                                            │
│  ✅ Analysis Complete                                     │
│                                                            │
│  100 use cases analyzed                                   │
│  95 fully covered • 4 partial • 1 gap                     │
│                                                            │
│  [Download CSV Report]                                    │
│  taxonomizer_batch_2026-02-10_143045.csv                  │
│                                                            │
│  ┌────────────────────────────────────────────────────┐   │
│  │ Coverage by UID Type                               │   │
│  │                                                    │   │
│  │ su_ User       ████████████████████████████ 92%   │   │
│  │ sg_ Thing      ████████████████████████    87%   │   │
│  │ st_ Transaction████████████████████████    78%   │   │
│  │ sc_ Location   ████████████            45%   │   │
│  │ sp_ Payment    ████████                34%   │   │
│  │ sv_ Activity   ███████                 31%   │   │
│  │ sn_ Network    █████                   23%   │   │
│  │ sa_ Agent      ███                     15%   │   │
│  │ sl_ List       ███                     12%   │   │
│  │                                                    │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
│  ┌────────────────────────────────────────────────────┐   │
│  │ Gaps Identified                                    │   │
│  │                                                    │   │
│  │ 1. Session Management                              │   │
│  │    Use Case: "Track shopping cart"                │   │
│  │    Workaround: Use sl_ (List:shopping_list)       │   │
│  │    Recommendation: Add ss_ (Session) type?        │   │
│  │                                                    │   │
│  └────────────────────────────────────────────────────┘   │
│                                                            │
└───────────────────────────────────────────────────────────┘
```

---

## Card Display

### Card Appearance in Flow

Each card in the flow diagram is a **simplified card** (not full card):

```
┌──────────┐
│ 🍕       │  ← Icon from taxonomy_law or UID type
│ Thing    │  ← UID type display name
│ sg_      │  ← UID prefix
│ Pizza    │  ← Entity name
└──────────┘
```

**Click card** → Opens detail modal:

```
┌─────────────────────────────────────────┐
│ Thing Card Details              [Close] │
├─────────────────────────────────────────┤
│                                         │
│ UID Type: sg_ (Thing)                   │
│                                         │
│ L2 Type: product                        │
│   ↳ From taxonomy_law.thing_type        │
│                                         │
│ L3 Subtype: food_dining                 │
│   ↳ From taxonomy_law.category          │
│                                         │
│ Status: available                       │
│ Price: $15.99                           │
│                                         │
│ Example from taxonomy_law:              │
│ "Consumable goods like pizza, books"    │
│                                         │
└─────────────────────────────────────────┘
```

### Relationship Lines

Lines connecting cards show relationships:

```
┌──────────┐    places order    ┌──────────┐
│ User     │───────────────────>│ Thing    │
└──────────┘                    └──────────┘
            ↑
            └─ Label describes relationship
```

**Relationship types:**
- owns, places, makes, pays, sends, receives
- delivers_to, ships_to, located_at
- assigns, manages, completes
- hosts, runs_on, stores_in
- contains, includes, has

---

## API Endpoints

### For GUI Page

```
POST /api/v1/taxonomizer/analyze
Request:
{
  "use_case": "User orders pizza for delivery"
}

Response:
{
  "scenario": "User orders pizza for delivery",
  "uids_required": [
    {
      "uid_type": "su_",
      "display_name": "User",
      "entity_name": "Customer",
      "l2_type": "person",
      "l3_attributes": {"status": "active"},
      "icon": "👤"
    },
    {
      "uid_type": "sg_",
      "display_name": "Thing",
      "entity_name": "Pizza",
      "l2_type": "product",
      "l3_attributes": {"category": "food_dining"},
      "icon": "🍕"
    },
    // ... more UIDs
  ],
  "relationships": [
    {"from": 0, "to": 1, "label": "places order"},
    {"from": 0, "to": 2, "label": "makes payment"},
    // ... more relationships
  ],
  "gaps": [],
  "coverage": "complete"
}
```

```
POST /api/v1/taxonomizer/batch
Request:
{
  "count": 100
}

Response (Streaming):
{
  "progress": 47,
  "total": 100,
  "current_scenario": "Team manages website redesign project",
  "summary": {
    "complete": 45,
    "partial": 1,
    "missing": 1
  }
}

Final Response:
{
  "complete": true,
  "csv_url": "/downloads/taxonomizer_batch_2026-02-10_143045.csv",
  "summary": {
    "total": 100,
    "complete": 95,
    "partial": 4,
    "missing": 1
  },
  "gaps": [
    {
      "issue": "Session management",
      "use_case_id": 23,
      "recommendation": "Add ss_ (Session) type?"
    }
  ]
}
```

```
GET /api/v1/taxonomizer/taxonomy
Response:
{
  "uid_types": [
    {
      "uid_type": "sn_",
      "name": "Network",
      "description": "...",
      "l2_types": [...],
      "l3_attributes": [...],
      "examples": [...]
    },
    // ... all 9 UID types from taxonomy_law
  ]
}
```

---

## Database Access

### Read-Only Access

```sql
-- Query taxonomy_law for all UID types
SELECT * FROM shopnet_connect.taxonomy_law
ORDER BY level, uid_type, parent_code, code;

-- Get L2 types for specific UID
SELECT * FROM shopnet_connect.taxonomy_law
WHERE level = 'L2' AND uid_type = 'sg_';

-- Get L3 attributes for specific L2 type
SELECT * FROM shopnet_connect.taxonomy_law
WHERE level = 'L3' AND uid_type = 'sg_' AND parent_code = 'product';
```

**No writes** - Taxonomizer is read-only validation tool.

---

## Implementation Plan

### Phase 1: Backend Agent (Week 1)
- [ ] Create sa_ UID for Taxonomizer agent in uid_registry
- [ ] Build scenario analysis engine
  - [ ] Parse use case text
  - [ ] Identify entities (actors, objects, actions)
  - [ ] Map entities to UID types
- [ ] Build UID mapping logic
  - [ ] Query taxonomy_law for L2/L3 values
  - [ ] Select appropriate types based on entity
  - [ ] Flag gaps when taxonomy_law lacks values
- [ ] Build relationship detection
  - [ ] Identify connections between entities
  - [ ] Label relationships appropriately
- [ ] Build use case generator (batch mode)
  - [ ] Generate diverse scenarios
  - [ ] Cover all 9 UID types
  - [ ] Mix simple and complex scenarios
- [ ] Build CSV export
  - [ ] Format results as CSV
  - [ ] Include all required columns
  - [ ] Generate summary statistics

### Phase 2: API Endpoints (Week 1)
- [ ] POST /api/v1/taxonomizer/analyze
- [ ] POST /api/v1/taxonomizer/batch (with streaming progress)
- [ ] GET /api/v1/taxonomizer/taxonomy
- [ ] File download endpoint for CSV

### Phase 3: Frontend GUI (Week 2)
- [ ] Create Taxonomizer page in Console
- [ ] Build Interactive Mode UI
  - [ ] Text input for use case
  - [ ] Analyze button
  - [ ] Card flow diagram canvas
  - [ ] Relationship lines rendering
  - [ ] Card click → detail modal
  - [ ] Export PNG/JSON buttons
- [ ] Build Batch Mode UI
  - [ ] Generate button
  - [ ] Progress bar with streaming updates
  - [ ] Summary report display
  - [ ] CSV download button
  - [ ] Coverage charts
  - [ ] Gap report display
- [ ] Add to Console navigation menu

### Phase 4: Testing & Refinement (Week 2)
- [ ] Test with 20 manual scenarios
- [ ] Run batch mode (100 scenarios)
- [ ] Review CSV output
- [ ] Identify taxonomy gaps
- [ ] Refine card field requirements
- [ ] Update documentation

### Phase 5: Taxonomy Refinement (Ongoing)
- [ ] Add missing L2/L3 values identified by testing
- [ ] Consider new UID types if gaps found
- [ ] Document findings for card redesign
- [ ] Use data to inform L2/L3 expansion

---

## Success Metrics

### Tool Effectiveness
- Can analyze any use case in < 3 seconds
- Batch mode completes 100 scenarios in < 5 minutes
- Zero crashes or errors during analysis

### Taxonomy Validation
- 95%+ of use cases fully covered by existing taxonomy
- < 5% require workarounds
- Clear recommendations for any gaps

### Demo Impact
- Stakeholders understand "Find or Do Anything" vision
- Visual flow diagrams are clear and intuitive
- Export formats are useful for analysis

### Design Research Value
- CSV data informs card field requirements
- Identifies most common L2/L3 values
- Reveals missing attributes needed
- Provides real-world usage patterns

---

## File Locations

### Documentation
```
/Users/tim001/VSCode/HMCG/taxonomy.shopnet/
  └─ TAXONOMIZER-TOOL-SPEC.MD (This document)
```

### Code (To Be Created)
```
/home/ubuntu/shopnet-console/
  ├─ templates/
  │   └─ taxonomizer.html (GUI page)
  ├─ static/
  │   ├─ js/
  │   │   └─ taxonomizer.js (Interactive flow diagram)
  │   └─ css/
  │       └─ taxonomizer.css (Card & flow styles)
  └─ api/
      └─ taxonomizer.py (API endpoints)

/home/ubuntu/shopnet-agents/
  └─ taxonomizer/
      ├─ analyzer.py (Scenario analysis engine)
      ├─ mapper.py (UID mapping logic)
      ├─ generator.py (Use case generator)
      └─ exporter.py (CSV export)
```

### Data Output
```
/home/ubuntu/shopnet-console/downloads/
  └─ taxonomizer_batch_YYYY-MM-DD_HHMMSS.csv
```

---

## Summary

**What:** Visual tool to validate taxonomy through use case mapping

**Where:** shopnet.network-console GUI page (/taxonomizer)

**How:** Two modes:
1. Interactive - User inputs scenario, see card flow
2. Batch - Generate 100 scenarios, export CSV analysis

**Why:**
1. Demonstrate "Find or Do Anything" capability
2. Validate taxonomy structure with real use cases
3. Collect data to inform card system redesign

**Data Source:** `shopnet_connect.taxonomy_law` (read-only)

**Timeline:** 2 weeks to MVP

**Next Step:** Get approval to proceed with implementation

---

**"Find or Do Anything"**
