# Cards, Taxonomy, and The Taxonomizer
**Date:** February 10, 2026
**Vision:** Universal Card Platform for All UID Types
**Status:** Design Document

---

## The Vision

**Cards are the universal UI abstraction for all entities in the Shopnet Network.**

Every UID type in the taxonomy has a corresponding card type that defines:
- Visual presentation
- Data structure
- Interaction patterns
- Status indicators

With the complete taxonomy now defined (9 UID types), we can:
1. **Standardize** card design and content by type
2. **Build a Taxonomizer** to test taxonomy integrity and card type mapping
3. **Create workflow tools** (like internal JIRA) using standardized cards
4. **Unify presentation** everywhere (Finder results, Console lists, etc.)

---

## The Three Pillars

### 1. THE LAW (Taxonomy)
**Source:** `shopnet_connect.taxonomy_law` table
**Defines:** What types of entities exist in the system

**9 UID Types (Level 1):**
```
shopnet.network (L0)
├─ sn_ (Sites/Endpoints) - Digital endpoints
├─ sg_ (Thing) - Discoverable entities
├─ sc_ (Location) - Physical places
├─ st_ (Transaction) - Non-financial exchanges
├─ sp_ (Payment) - Financial transactions
├─ sl_ (List) - Collections
├─ su_ (User) - Identity/persons/entities
├─ sa_ (Agent) - AI agents
└─ sv_ (Activity) - Workflow activities
```

Each has L2 (subtypes) and L3 (attributes) taxonomy.

---

### 2. CARDS (UI Pattern)
**Purpose:** Visual representation of entities
**Implementation:** Standardized card components

**Current Card Types:**
1. **Network Card** (Type 1) - For sn_ endpoints
2. **GitHub Card** (Type 2) - For GitHub modules (transitional)
3. **Product Card** (Type 3) - For domains/products (sg_ Things)

**Needed Card Types (Mapping to Taxonomy):**
```
UID Type  → Card Type → Use Case
─────────────────────────────────────────────────────
sn_       → Network Card        → Sites, endpoints, infrastructure
sg_       → Thing Card          → Products, domains, services, information
sc_       → Location Card       → Stores, warehouses, addresses
st_       → Transaction Card    → Messages, shipments, documents
sp_       → Payment Card        → Invoices, payments, refunds
sl_       → List Card           → Registries, guest lists, task lists
su_       → User Card           → People, companies, organizations
sa_       → Agent Card          → AI assistants, chatbots
sv_       → Activity Card       → Projects, tasks, campaigns
```

---

### 3. TAXONOMIZER (Validation Tool)
**Purpose:** AI agent that validates taxonomy integrity and card type mappings
**Runs off:** `shopnet_connect.taxonomy_law` table

**Functions:**
1. **Taxonomy Integrity Check**
   - Verify all UID types have complete L2/L3 taxonomy
   - Check for gaps or inconsistencies
   - Validate examples match definitions

2. **Card Type Mapping**
   - Ensure every UID type has a defined card type
   - Verify card designs exist for each type
   - Check card data structure matches taxonomy attributes

3. **Scenario Testing**
   - Given a scenario, suggest appropriate UID type
   - Example: "User books hotel room" → st_ (transaction) + sc_ (location)
   - Validate we have all needed types for common scenarios

4. **Missing Type Detection**
   - Identify scenarios that don't map to existing types
   - Suggest new card types if needed
   - Flag taxonomy gaps

---

## Card Type Specifications

### Universal Card Structure

All cards share a common base structure:

```javascript
{
  // Identity
  uid: "xx_xxxxxxxxxxxx",        // The UID
  uid_type: "xx",                 // sn, sg, sc, etc.
  display_name: "...",            // Human-readable name

  // Taxonomy
  l2_type: "...",                 // L2 taxonomy code
  l3_attributes: {...},           // L3 taxonomy values

  // Status
  status: "live|wip|designed",    // Development status
  active: true|false,             // Is it active?

  // Metadata
  created_at: "ISO timestamp",
  updated_at: "ISO timestamp",

  // Card-specific data
  ...
}
```

---

### 1. Network Card (sn_ - Sites/Endpoints)

**For:** sn_ UIDs (sites, agents platforms, databases, nodes, infrastructure, user devices)

**Visual Design:**
```
┌─────────────────────────────────────────────┐
│ ● [sn_abc123]                          [↗]  │
│                                             │
│ domain-name.com                             │
│ [W] [CO] [L]                                │
│                                             │
│ Notes about this endpoint                   │
│                                             │
│ ─────────────────────────────────────────── │
│ 2/10/2026                           ONLINE  │
└─────────────────────────────────────────────┘
```

**Data Structure:**
```javascript
{
  uid: "sn_abc123",
  uid_type: "sn",
  display_name: "domain-name.com",

  // L2 Taxonomy
  endpoint_type: "W",              // W, A, D, N, I, U, O
  platform_type: "CO",             // Varies by endpoint_type

  // L3 Taxonomy
  status: "live",
  runtime: "lambda",
  host: "cloudfront",
  pulse_status: "online",

  // Metadata
  created_at: "2026-02-10T12:00:00Z",
  updated_at: "2026-02-10T12:30:00Z",
  notes: "Notes about this endpoint"
}
```

**Status Indicators:**
- Dot color: Green (online), Orange (degraded), Red (offline), Grey (planned)
- Click action: Opens edit modal

**Current Status:** ✅ IMPLEMENTED

---

### 2. Thing Card (sg_ - Discoverable Entities)

**For:** sg_ UIDs (products, domains, information, services, resources, concepts)

**Visual Design:**
```
┌─────────────────────────────────────────────┐
│ ╔═══════════════════════════════════════╗  │
│ ║         ┌──────────┐                  ║  │
│ ║         │   🍕     │                  ║  │
│ ║         └──────────┘                  ║  │
│ ║                                       ║  │
│ ║      pizza.🍕                         ║  │
│ ║      xn--pizza-vq93d                  ║  │
│ ║                                       ║  │
│ ║   ╭──────────────────╮                ║  │
│ ║   │ ⭐ Food & Dining │                ║  │
│ ║   ╰──────────────────╯                ║  │
│ ║                                       ║  │
│ ║   Register 🍕pizza Web3 domain       ║  │
│ ║                                       ║  │
│ ║  ╔════════════════════╗               ║  │
│ ║  ║ View Details →     ║               ║  │
│ ║  ╚════════════════════╝               ║  │
│ ╚═══════════════════════════════════════╝  │
└─────────────────────────────────────────────┘
```

**Data Structure:**
```javascript
{
  uid: "sg_xyz789",
  uid_type: "sg",
  display_name: "pizza.🍕",

  // L2 Taxonomy
  thing_type: "domain",            // product, domain, information, service, resource, concept
  subtype: "web3",                 // Varies by thing_type

  // L3 Taxonomy
  category: "food_dining",
  status: "available",
  price: "$299",

  // Thing-specific
  icon: "🍕",
  punycode: "xn--pizza-vq93d",
  description: "Register 🍕pizza Web3 domain",

  // Metadata
  created_at: "2026-02-10T12:00:00Z",
  featured: false
}
```

**Variations by thing_type:**
- **product:** Show price, availability, image
- **domain:** Show punycode, TLD, registration status
- **information:** Show author, publish date, format
- **service:** Show provider, pricing, availability

**Current Status:** ⚠️ PARTIAL (Product Card exists, needs generalization to all thing_types)

---

### 3. Location Card (sc_ - Physical Places)

**For:** sc_ UIDs (stores, warehouses, offices, homes, public places, coordinates)

**Visual Design:**
```
┌─────────────────────────────────────────────┐
│ 📍 [sc_def456]                         [📱] │
│                                             │
│ Apple Store - 5th Avenue                    │
│ [Store] [Retail]                            │
│                                             │
│ 767 5th Ave, New York, NY 10153             │
│                                             │
│ 🕒 Open Now • Closes 9PM                    │
│ ☎️  (212) 336-1440                          │
│                                             │
│ ─────────────────────────────────────────── │
│ 40.7637° N, 73.9731° W            📍 Map    │
└─────────────────────────────────────────────┘
```

**Data Structure:**
```javascript
{
  uid: "sc_def456",
  uid_type: "sc",
  display_name: "Apple Store - 5th Avenue",

  // L2 Taxonomy
  location_type: "store",          // store, warehouse, office, home, public_place, coordinates
  subtype: "retail",               // Varies by location_type

  // L3 Taxonomy
  latitude: 40.7637,
  longitude: -73.9731,
  address: "767 5th Ave, New York, NY 10153",

  // Location-specific
  phone: "(212) 336-1440",
  hours: "10AM - 9PM",
  status: "open",

  // Metadata
  created_at: "2026-02-10T12:00:00Z"
}
```

**Status Indicators:**
- Open/Closed status
- Distance from user (if location available)

**Click action:** Opens map view / directions

**Current Status:** ❌ NOT IMPLEMENTED

---

### 4. Transaction Card (st_ - Non-Financial Exchanges)

**For:** st_ UIDs (messages, receipts, shipments, transfers, notifications, confirmations, documents)

**Visual Design:**
```
┌─────────────────────────────────────────────┐
│ 📧 [st_ghi789]                         [⋮]  │
│                                             │
│ Order Confirmation #12345                   │
│ [Receipt] [Email]                           │
│                                             │
│ From: store@example.com                     │
│ To: customer@example.com                    │
│                                             │
│ Your order has been confirmed and will...   │
│                                             │
│ ─────────────────────────────────────────── │
│ 2/10/2026 2:30 PM                 Delivered │
└─────────────────────────────────────────────┘
```

**Data Structure:**
```javascript
{
  uid: "st_ghi789",
  uid_type: "st",
  display_name: "Order Confirmation #12345",

  // L2 Taxonomy
  transaction_type: "receipt",     // message, receipt, shipment, transfer, notification, confirmation, document
  subtype: "email",                // Varies by transaction_type

  // L3 Taxonomy
  from: "store@example.com",
  to: "customer@example.com",
  status: "delivered",
  timestamp: "2026-02-10T14:30:00Z",

  // Transaction-specific
  body: "Your order has been confirmed...",
  attachments: [],

  // Metadata
  created_at: "2026-02-10T14:30:00Z"
}
```

**Status Indicators:**
- Sent, Delivered, Read, Failed
- Delivery timestamp

**Click action:** Opens full transaction view

**Current Status:** ❌ NOT IMPLEMENTED

---

### 5. Payment Card (sp_ - Financial Transactions)

**For:** sp_ UIDs (card payments, bank transfers, refunds, subscriptions, crypto, invoices)

**Visual Design:**
```
┌─────────────────────────────────────────────┐
│ 💳 [sp_jkl012]                    [Receipt] │
│                                             │
│ Payment to Apple Store                      │
│ [Card Payment] [Visa ****1234]              │
│                                             │
│ Amount: $299.00                             │
│ Date: Feb 10, 2026 2:45 PM                  │
│                                             │
│ Transaction ID: TXN-ABC-123                 │
│                                             │
│ ─────────────────────────────────────────── │
│ Status: ✅ Completed                        │
└─────────────────────────────────────────────┘
```

**Data Structure:**
```javascript
{
  uid: "sp_jkl012",
  uid_type: "sp",
  display_name: "Payment to Apple Store",

  // L2 Taxonomy
  payment_type: "card_payment",    // card_payment, bank_transfer, refund, subscription, crypto, invoice
  subtype: "visa",                 // Varies by payment_type

  // L3 Taxonomy
  amount: 299.00,
  currency: "USD",
  status: "completed",
  timestamp: "2026-02-10T14:45:00Z",

  // Payment-specific
  card_last4: "1234",
  transaction_id: "TXN-ABC-123",
  merchant: "Apple Store",

  // Metadata
  created_at: "2026-02-10T14:45:00Z"
}
```

**Status Indicators:**
- Pending, Completed, Failed, Refunded
- Security icons (PCI compliant)

**Click action:** Opens payment details / receipt

**Current Status:** ❌ NOT IMPLEMENTED

---

### 6. List Card (sl_ - Collections)

**For:** sl_ UIDs (registries, guest lists, task lists, shopping lists, teams, collections)

**Visual Design:**
```
┌─────────────────────────────────────────────┐
│ 📋 [sl_mno345]                         [⋮]  │
│                                             │
│ Wedding Gift Registry                       │
│ [Registry] [Public]                         │
│                                             │
│ 12 items • 5 purchased • 7 remaining        │
│                                             │
│ Owner: John & Jane Smith                    │
│ Event Date: June 15, 2026                   │
│                                             │
│ ─────────────────────────────────────────── │
│ Updated 2 hours ago               View List │
└─────────────────────────────────────────────┘
```

**Data Structure:**
```javascript
{
  uid: "sl_mno345",
  uid_type: "sl",
  display_name: "Wedding Gift Registry",

  // L2 Taxonomy
  list_type: "registry",           // registry, guest_list, task_list, shopping_list, team, collection
  subtype: "gift_registry",        // Varies by list_type

  // L3 Taxonomy
  visibility: "public",
  owner_uid: "su_abc123",
  item_count: 12,

  // List-specific
  items_purchased: 5,
  items_remaining: 7,
  event_date: "2026-06-15",

  // Metadata
  created_at: "2026-01-10T12:00:00Z",
  updated_at: "2026-02-10T12:00:00Z"
}
```

**Status Indicators:**
- Progress bar (completed/total)
- Visibility (public/private)

**Click action:** Opens list view

**Current Status:** ❌ NOT IMPLEMENTED

---

### 7. User Card (su_ - Identity)

**For:** su_ UIDs (people, companies, organizations, trusts, legal entities)

**Visual Design:**
```
┌─────────────────────────────────────────────┐
│ 👤 [su_pqr678]                      [Follow] │
│                                             │
│       ┌──────────┐                          │
│       │   Photo  │                          │
│       └──────────┘                          │
│                                             │
│ John Smith                                  │
│ [Person] [Verified ✓]                       │
│                                             │
│ CEO @ Acme Corp                             │
│ San Francisco, CA                           │
│                                             │
│ ─────────────────────────────────────────── │
│ Joined Jan 2025                  📧 Message │
└─────────────────────────────────────────────┘
```

**Data Structure:**
```javascript
{
  uid: "su_pqr678",
  uid_type: "su",
  display_name: "John Smith",

  // L2 Taxonomy
  user_type: "person",             // person, company, organization, trust
  subtype: "individual",           // Varies by user_type

  // L3 Taxonomy
  verified: true,
  location: "San Francisco, CA",

  // User-specific
  photo_url: "/photos/su_pqr678.jpg",
  title: "CEO",
  company: "Acme Corp",
  bio: "...",

  // Metadata
  created_at: "2025-01-15T12:00:00Z"
}
```

**Status Indicators:**
- Verified badge
- Online/offline status

**Click action:** Opens user profile

**Current Status:** ❌ NOT IMPLEMENTED

---

### 8. Agent Card (sa_ - AI Agents)

**For:** sa_ UIDs (chatbots, assistants, automation agents)

**Visual Design:**
```
┌─────────────────────────────────────────────┐
│ 🤖 [sa_stu901]                      [Chat]  │
│                                             │
│       ┌──────────┐                          │
│       │    AI    │                          │
│       │   Logo   │                          │
│       └──────────┘                          │
│                                             │
│ Product Assist                              │
│ [Client Agent] [Chat]                       │
│                                             │
│ Helps customers find products               │
│                                             │
│ Platform: sn_abc123 (Claude)                │
│ Model: claude-4.5                           │
│                                             │
│ ─────────────────────────────────────────── │
│ 🟢 Online • 127 chats today                │
└─────────────────────────────────────────────┘
```

**Data Structure:**
```javascript
{
  uid: "sa_stu901",
  uid_type: "sa",
  display_name: "Product Assist",

  // L2 Taxonomy
  agent_type: "client",            // internal, client
  agent_skill: "chat",             // code, chat, content, data, documents, promotion

  // L3 Taxonomy
  status: "live",
  model_tier: "premium",

  // Agent-specific
  platform_uid: "sn_abc123",
  model: "claude-4.5",
  description: "Helps customers find products",
  logo_url: "/logos/sa_stu901.png",

  // Stats
  chats_today: 127,
  uptime: "99.9%",

  // Metadata
  created_at: "2025-12-01T12:00:00Z"
}
```

**Status Indicators:**
- Online/offline status
- Usage stats

**Click action:** Opens agent console / chat

**Current Status:** ❌ NOT IMPLEMENTED

---

### 9. Activity Card (sv_ - Workflow Activities)

**For:** sv_ UIDs (projects, tasks, events, campaigns, goals)

**Visual Design:**
```
┌─────────────────────────────────────────────┐
│ 📌 [sv_vwx234]                      [Edit]  │
│                                             │
│ Website Redesign Project                    │
│ [Project] [In Progress]                     │
│                                             │
│ ████████░░░░░ 67% complete                  │
│                                             │
│ 👤 Assigned: Design Team (5)                │
│ 📅 Due: March 15, 2026                      │
│ 📎 12 tasks • 8 done • 4 remaining          │
│                                             │
│ ─────────────────────────────────────────── │
│ Updated 1 hour ago              View Tasks  │
└─────────────────────────────────────────────┘
```

**Data Structure:**
```javascript
{
  uid: "sv_vwx234",
  uid_type: "sv",
  display_name: "Website Redesign Project",

  // L2 Taxonomy
  activity_type: "project",        // project, task, event, campaign, goal
  subtype: "design",               // Varies by activity_type

  // L3 Taxonomy
  status: "in_progress",
  priority: "high",
  due_date: "2026-03-15",

  // Activity-specific
  assignees: ["su_abc", "su_def", "su_ghi", "su_jkl", "su_mno"],
  progress: 67,
  total_tasks: 12,
  completed_tasks: 8,

  // Metadata
  created_at: "2026-01-15T12:00:00Z",
  updated_at: "2026-02-10T11:00:00Z"
}
```

**Status Indicators:**
- Progress bar
- Status (not started, in progress, completed, blocked)
- Priority (low, medium, high, urgent)

**Click action:** Opens activity/project view

**Current Status:** ❌ NOT IMPLEMENTED

---

## Taxonomizer Agent Specification

### Purpose

The **Taxonomizer** is an AI agent that validates taxonomy integrity and helps map real-world scenarios to the correct UID types and card types.

### Data Source

**Primary:** `shopnet_connect.taxonomy_law` table (master taxonomy)
**Secondary:** Card type definitions (from this document)

### Core Functions

#### 1. Taxonomy Validation

**Check:** All UID types have complete taxonomy
```
FOR each UID type (L1):
  - Verify L2 subtypes exist
  - Verify L3 attributes exist
  - Check for orphaned entries
  - Validate examples
  - Flag missing or incomplete taxonomy
```

**Output:**
```
✅ sn_ - Complete (7 endpoint_types, 42 platform_types, 15 L3 attributes)
✅ sg_ - Complete (6 thing_types, 14 subtypes, 8 L3 attributes)
⚠️  sc_ - Incomplete (missing L3 attributes for coordinates type)
❌ sv_ - Missing (no L2 subtypes defined)
```

#### 2. Card Type Coverage

**Check:** Every UID type has a defined card type
```
FOR each UID type:
  - Verify card type exists
  - Check card design documented
  - Validate data structure matches taxonomy
  - Flag missing card types
```

**Output:**
```
✅ sn_ → Network Card (IMPLEMENTED)
⚠️  sg_ → Thing Card (PARTIAL - Product Card only)
❌ sc_ → Location Card (NOT IMPLEMENTED)
❌ st_ → Transaction Card (NOT IMPLEMENTED)
❌ sp_ → Payment Card (NOT IMPLEMENTED)
❌ sl_ → List Card (NOT IMPLEMENTED)
❌ su_ → User Card (NOT IMPLEMENTED)
❌ sa_ → Agent Card (NOT IMPLEMENTED)
❌ sv_ → Activity Card (NOT IMPLEMENTED)
```

#### 3. Scenario Mapping

**Function:** Given a scenario, suggest appropriate UID types and card types

**Examples:**

**Scenario 1:** "User orders pizza for delivery"
```
Analysis:
- User (su_) places order
- Pizza (sg_ thing:product)
- Payment (sp_ payment)
- Delivery transaction (st_ shipment)
- Delivery address (sc_ location:home)

UIDs needed:
✅ su_ - User (customer)
✅ sg_ - Thing (pizza product)
✅ sp_ - Payment (credit card)
✅ st_ - Transaction (delivery)
✅ sc_ - Location (delivery address)

Card types needed:
✅ User Card
✅ Thing Card
✅ Payment Card
✅ Transaction Card
✅ Location Card
```

**Scenario 2:** "Team manages website redesign project"
```
Analysis:
- Team members (su_ users)
- Website (sn_ endpoint)
- Project (sv_ activity:project)
- Tasks (sv_ activity:task)
- Design files (sg_ thing:resource)

UIDs needed:
✅ su_ - User (team members)
✅ sn_ - Endpoint (website)
✅ sv_ - Activity (project + tasks)
✅ sg_ - Thing (design resources)

Card types needed:
✅ User Card
✅ Network Card
✅ Activity Card
✅ Thing Card
```

**Scenario 3:** "AI agent sends email notification"
```
Analysis:
- AI agent (sa_)
- Email (st_ transaction:message)
- Recipient (su_ user)
- Runs on platform (sn_ endpoint:agent_platform)

UIDs needed:
✅ sa_ - Agent (sender)
✅ st_ - Transaction (email message)
✅ su_ - User (recipient)
✅ sn_ - Endpoint (agent platform)

Card types needed:
✅ Agent Card
✅ Transaction Card
✅ User Card
✅ Network Card
```

#### 4. Gap Detection

**Function:** Identify scenarios that can't be fully represented

**Example:**
```
Scenario: "Track customer's shopping cart"

Missing UID type:
❌ No UID type for "cart" or "session"

Suggestion:
Option 1: Add cart as sl_ (List:shopping_list)
Option 2: Add new UID type: ss_ (Session)

Recommendation: Use sl_ (List:shopping_list)
Reasoning: Cart is a temporary collection of sg_ (things)
```

---

### Taxonomizer Implementation

**Agent Type:** sa_ (Agent)
**Skill:** data (taxonomy analysis)
**Platform:** Claude Agent Platform
**Model:** claude-sonnet-4.5

**API Endpoints:**

```
POST /api/v1/taxonomizer/validate
- Validates complete taxonomy
- Returns health report

POST /api/v1/taxonomizer/map-scenario
- Input: Scenario description
- Output: Required UID types, card types, gaps

POST /api/v1/taxonomizer/check-coverage
- Returns card type coverage report

GET /api/v1/taxonomizer/taxonomy
- Returns complete taxonomy from taxonomy_law
```

**Database Access:**
- Read-only access to `shopnet_connect.taxonomy_law`
- Read-only access to card type definitions

---

## Use Cases

### 1. Standardized Card Design

**Problem:** Each section of Console uses different card HTML/CSS
**Solution:** Use taxonomy-driven card types

**Before:**
```javascript
// Different card function for each section
renderBrochureCard(data)
renderSiteCard(data)
renderWeb3Card(data)
renderGitHubCard(data)
```

**After:**
```javascript
// Universal card renderer
renderCard(uid, data) {
  const uid_type = uid.substring(0, 2);

  switch(uid_type) {
    case 'sn': return renderNetworkCard(data);
    case 'sg': return renderThingCard(data);
    case 'sc': return renderLocationCard(data);
    case 'st': return renderTransactionCard(data);
    case 'sp': return renderPaymentCard(data);
    case 'sl': return renderListCard(data);
    case 'su': return renderUserCard(data);
    case 'sa': return renderAgentCard(data);
    case 'sv': return renderActivityCard(data);
  }
}
```

---

### 2. Workflow Tool (workflow.shopnet)

**Vision:** Internal JIRA-like project management tool

**Features:**
- Projects (sv_ activity:project) displayed as Activity Cards
- Tasks (sv_ activity:task) displayed as Activity Cards
- Team members (su_ user) displayed as User Cards
- Deliverables (sg_ thing:resource) displayed as Thing Cards

**Card Grid View:**
```
┌──────────────┬──────────────┬──────────────┐
│ Activity Card│ Activity Card│ Activity Card│
│ Project A    │ Project B    │ Project C    │
│ 67% complete │ 23% complete │ 91% complete │
└──────────────┴──────────────┴──────────────┘

┌──────────────┬──────────────┬──────────────┐
│ User Card    │ User Card    │ User Card    │
│ Team Member 1│ Team Member 2│ Team Member 3│
│ 5 tasks      │ 3 tasks      │ 8 tasks      │
└──────────────┴──────────────┴──────────────┘
```

**Benefits:**
- Consistent UI across all views
- Taxonomy-driven filtering/sorting
- Type-safe data structures

---

### 3. Finder Module Results

**Vision:** Universal search that returns cards for any entity type

**Search:** "pizza"

**Results:**
```
┌──────────────┬──────────────┬──────────────┐
│ Thing Card   │ Thing Card   │ Location Card│
│ pizza.🍕    │ 🍕 Pizza    │ Pizza Hut    │
│ Domain       │ Product      │ Restaurant   │
│ sg_abc123    │ sg_def456    │ sc_ghi789    │
└──────────────┴──────────────┴──────────────┘
```

**Search:** "John Smith"

**Results:**
```
┌──────────────┬──────────────┬──────────────┐
│ User Card    │ Transaction  │ Activity Card│
│ John Smith   │ Email from   │ John's Tasks │
│ CEO @ Acme   │ John Smith   │ 4 active     │
│ su_abc123    │ st_def456    │ sv_ghi789    │
└──────────────┴──────────────┴──────────────┘
```

**Benefits:**
- Mixed result types, consistent presentation
- Click any card to see full details
- Type-specific actions (email user, view product, get directions, etc.)

---

### 4. Console Dashboard

**Vision:** Main dashboard shows cards for all entity types

**Layout:**
```
┌─ My Network ──────────────────────────────┐
│ Network Cards (sn_): Sites, endpoints     │
│ [Card] [Card] [Card] [Card]              │
└───────────────────────────────────────────┘

┌─ My Products ─────────────────────────────┐
│ Thing Cards (sg_): Products, domains      │
│ [Card] [Card] [Card] [Card]              │
└───────────────────────────────────────────┘

┌─ My Projects ─────────────────────────────┐
│ Activity Cards (sv_): Projects, tasks     │
│ [Card] [Card] [Card] [Card]              │
└───────────────────────────────────────────┘

┌─ My Team ─────────────────────────────────┐
│ User Cards (su_): Team members            │
│ [Card] [Card] [Card] [Card]              │
└───────────────────────────────────────────┘
```

---

## Implementation Roadmap

### Phase 1: Design (Current)
- [x] Define complete taxonomy (taxonomy_law)
- [x] Document card type specifications
- [ ] Design Taxonomizer agent
- [ ] Get stakeholder approval

### Phase 2: Card Type Implementation
- [x] Network Card (sn_) ✅ DONE
- [ ] Thing Card (sg_) - Generalize Product Card
- [ ] Location Card (sc_)
- [ ] Transaction Card (st_)
- [ ] Payment Card (sp_)
- [ ] List Card (sl_)
- [ ] User Card (su_)
- [ ] Agent Card (sa_)
- [ ] Activity Card (sv_)

### Phase 3: Taxonomizer Agent
- [ ] Build API endpoints
- [ ] Implement validation logic
- [ ] Create scenario mapping engine
- [ ] Build admin UI for Taxonomizer

### Phase 4: Integration
- [ ] Migrate Console to universal card renderer
- [ ] Build Finder module with card results
- [ ] Create workflow.shopnet (JIRA-like tool)
- [ ] Standardize cards across all platforms

---

## File Locations

### Documentation
```
/Users/tim001/VSCode/HMCG/taxonomy.shopnet/
  ├─ ThisIsTheLaw_v5.1_WIP_2026-02-09.MD (The Law)
  ├─ complete-taxonomy-v5.1-WIP.csv (Taxonomy export)
  └─ CARDS-TAXONOMY-TAXONOMIZER.MD (This document)

/Users/tim001/VSCode/HMCG/shopnet.network-console/docs/
  └─ CARD-IMPLEMENTATION-PLAN.md (Card implementation)

/Users/tim001/VSCode/HMCG/shopnet.domains-WP/docs/
  ├─ PRODUCT-CARD-DESIGN.md (Product/Thing card)
  ├─ TASK-1-CATEGORY-CARDS-DESIGN.md
  └─ TASK-2-PRODUCT-CARDS-DESIGN.md
```

### Database
```
shopnet_connect.taxonomy_law (Master taxonomy)
shopnet_sites.taxonomy_definition (Local cache for Console)
```

### Code
```
/home/ubuntu/shopnet-console/static/js/console.js
  ├─ renderNetworkCard() ✅ Implemented
  ├─ renderGitHubCard() ✅ Implemented
  └─ renderCard() (universal renderer) ❌ TODO

/home/ubuntu/shopnet-console/static/css/console.css
  └─ Unified card styles ✅ Implemented
```

---

## Summary

**The Vision:**
Cards are the universal UI platform for all Shopnet entities. With complete taxonomy defined, we can standardize presentation, build powerful tools, and ensure consistency across the entire network.

**The Three Pillars:**
1. **THE LAW** (taxonomy_law) - Defines what exists
2. **CARDS** (UI patterns) - Defines how it looks
3. **TAXONOMIZER** (validation agent) - Ensures integrity

**Next Steps:**
1. Implement remaining 8 card types
2. Build Taxonomizer agent
3. Create workflow.shopnet
4. Standardize everything

**Status:** Design complete, ready for implementation

---

**"Everything is a card. The taxonomy defines the card type."**
