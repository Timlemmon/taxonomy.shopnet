# Complete L1-L3 Taxonomy - All 9 UID Types
**Version:** v5.1 WIP
**Date:** February 9, 2026
**Authority:** TJL
**Status:** WORK IN PROGRESS

**Related Documents:**
- [ThisIsTheLaw_v5.1_WIP_2026-02-09.MD](./ThisIsTheLaw_v5.1_WIP_2026-02-09.MD) — Master LAW document
- [complete-taxonomy-v5.1-WIP.csv](./complete-taxonomy-v5.1-WIP.csv) — CSV export
- [taxonomy_law_schema.sql](./taxonomy_law_schema.sql) — Master registry schema
- [TAXONOMY-OPERATIONAL-MODEL.MD](./TAXONOMY-OPERATIONAL-MODEL.MD) — Operational model

---

## Table of Contents

- [Overview](#overview)
- [Hierarchy Structure](#hierarchy-structure)
- [Level 0: Namespace](#level-0-namespace)
- [Level 1: The 9 UID Types](#level-1-the-9-uid-types)
- [Complete Taxonomy Tables](#complete-taxonomy-tables)
  - [sn_ Sites/Endpoints](#sn_-sitesendpoints)
  - [sg_ Thing](#sg_-thing)
  - [sc_ Location](#sc_-location)
  - [st_ Transaction](#st_-transaction)
  - [sp_ Payment](#sp_-payment)
  - [sl_ List](#sl_-list)
  - [su_ User](#su_-user)
  - [sa_ Agent](#sa_-agent)
  - [sv_ Activity](#sv_-activity)

---

## Overview

The SND (Shopnet Network Deathstar) namespace contains **9 Level 1 UID types**, each with its own hierarchical taxonomy extending to Level 2 (subtypes) and Level 3 (attributes).

### Key Principles

1. **Flat Namespace** - All UIDs are peers at Level 1. Hierarchy is organizational, not structural.
2. **Dependencies ≠ Hierarchy** - Dependencies are foreign key relationships, not parent-child hierarchy.
3. **Single Source of Truth** - `taxonomy_law` table on shopnet_connect is authoritative.
4. **Distributed Operation** - Each UID type has its own database and local taxonomy cache.

---

## Hierarchy Structure

```
Level 0: shopnet.network (The Namespace)
    │
    ├─ Level 1: UID Types (9 types)
    │   ├─ sn_ (Sites/Endpoints)
    │   ├─ sg_ (Thing)
    │   ├─ sc_ (Location)
    │   ├─ st_ (Transaction)
    │   ├─ sp_ (Payment)
    │   ├─ sl_ (List)
    │   ├─ su_ (User)
    │   ├─ sa_ (Agent)
    │   └─ sv_ (Activity)
    │
    ├─ Level 2: Subtypes (varies by UID type)
    │   └─ Example: sn_ → W (Website) → CO (CloudFront On-Demand)
    │
    └─ Level 3: Attributes (specific fields)
        └─ Example: status, runtime, device_type, etc.
```

---

## Level 0: Namespace

| Field | Value |
|-------|-------|
| **Code** | shopnet.network |
| **Name** | Shopnet Network |
| **Description** | The namespace itself - contains all SND UIDs |
| **Authority** | Connect Gateway |
| **Governance** | THE LAW document |

**Level 0 is the root.** All 9 UID types exist within this namespace.

---

## Level 1: The 9 UID Types

### Summary Table

| # | Prefix | Name | Definition | Database | Status |
|---|--------|------|------------|----------|--------|
| 1 | **sn_** | Sites/Endpoints | Digital network endpoints and infrastructure | shopnet_sites | **LIVE** |
| 2 | **sg_** | Thing | Discoverable entities (products, domains, information, services) | shopnet_things | **WIP** |
| 3 | **sc_** | Location | Physical places on or above Earth (lat/long) | shopnet_locations | **WIP** |
| 4 | **st_** | Transaction | Non-monetary transactional exchanges | shopnet_transactions | **WIP** |
| 5 | **sp_** | Payment | Financial transactions (special st_ case) | shopnet_payments | **WIP** |
| 6 | **sl_** | List | Collections of UIDs or things | shopnet_registry | **DESIGNED** |
| 7 | **su_** | User | Identity - persons or entities that own data | shopnet_crm | **DESIGNED** |
| 8 | **sa_** | Agent | Software agents under user direction | shopnet_assist | **LIVE** |
| 9 | **sv_** | Activity | Goal-oriented workflow activities | shopnet_activities | **WIP** |

### Detailed Definitions

#### 1. sn_ (Sites/Endpoints) - [LIVE]

**Definition:** Digital network endpoints - websites, APIs, databases, infrastructure, client devices.

**Purpose:** Every addressable endpoint in the Shopnet network gets an sn_ UID.

**Examples:**
- shopnet.network (console website)
- Amazon RDS database
- iPhone device
- Lambda function

**Key Characteristic:** Digital/virtual entities (vs physical locations).

---

#### 2. sg_ (Thing) - [WIP]

**Definition:** Discoverable entities that humans or agents can find, search for, or reference.

**Purpose:** Replaces external pointers (ASIN, ISBN) with internal UIDs for things we track.

**Examples:**
- iPhone 15 (product)
- cool.shop (domain name)
- "How to bake bread" (article/information)
- Legal consulting (service)

**Key Characteristic:** Things that exist independently and can be searched/discovered.

---

#### 3. sc_ (Location) - [WIP]

**Definition:** Real-world physical places on or above Earth, identified by lat/long coordinates.

**Purpose:** Physical equivalent to sn_ (digital endpoints). Track real-world locations.

**Examples:**
- Apple Store at 5th Avenue (retail location)
- Amazon warehouse (distribution center)
- Your home address (delivery location)
- Conference venue (event space)

**Key Characteristic:** Has physical coordinates (lat/long). You can go there.

---

#### 4. st_ (Transaction - Non-Financial) - [WIP]

**Definition:** Non-monetary transactional exchanges from an originator to a recipient.

**Purpose:** Track the flow of information, goods, messages (opposite direction to payments).

**Examples:**
- Email sent from Alice to Bob
- Package shipped from warehouse to customer
- Receipt issued from store to buyer
- Contract signed between parties

**Key Characteristic:** Something moves from A to B (not money - that's sp_).

---

#### 5. sp_ (Payment) - [WIP]

**Definition:** Financial transactions involving monetary exchange from payer to payee.

**Purpose:** Special transaction type requiring regulatory separation (PCI-DSS, financial compliance).

**Examples:**
- Credit card payment for iPhone
- Refund for returned item
- Subscription charge (Netflix)
- Wallet-to-wallet crypto transfer

**Key Characteristic:** Involves money. Requires payment authentication and compliance.

**Note:** Semantically a subtype of st_ (transaction), but gets its own Level 1 UID for system/regulatory separation.

---

#### 6. sl_ (List) - [DESIGNED]

**Definition:** Collections or groups of other UIDs or external things, owned by one or more users.

**Purpose:** Organize items into lists. Can contain any UID type or external references.

**Examples:**
- Wedding gift registry (list of sg_ things)
- Guest list (list of su_ people)
- Project task list (list of sv_ activities)
- Walmart soccer team (group of su_ employees)

**Key Characteristic:** Container/collection. Owned by su_ users. No legal authority (vs su_ company).

---

#### 7. su_ (User) - [DESIGNED]

**Definition:** Identity - persons or entities that own data, delegate to agents, and have legal authority.

**Purpose:** Cross-site identity. User authenticates once, su_ UID follows them everywhere.

**Examples:**
- John Smith (person)
- Walmart Inc (company - has legal authority)
- Red Cross (non-profit organization)
- Smith Family Trust (legal entity)

**Key Characteristic:** Has legal authority. Can own property, sign contracts (if company/person).

**First Law applies:** su_ has ultimate authority over agents (sa_).

---

#### 8. sa_ (Agent) - [LIVE]

**Definition:** Software agents (AI/automation) operating under direction of users (First Law of AI).

**Purpose:** AI assistants that help users. Must be controlled by a su_ user.

**Examples:**
- Product Assist (chatbot)
- Content Assist (content generator)
- CTO Assist (code assistant)

**Key Characteristic:** Non-human. Requires sn_ platform to run on. Subject to user control.

**First Law:** Agent cannot act without user delegation. User can revoke access anytime.

---

#### 9. sv_ (Activity) - [WIP]

**Definition:** Goal-oriented workflow activities with outcomes - projects, tasks, events, campaigns.

**Purpose:** Track work activities, dependencies, timelines (like Jira/Asana).

**Examples:**
- Wedding planning (event)
- Website redesign (project)
- Order cake (task)
- Q1 marketing campaign
- Annual revenue goal

**Key Characteristic:** Has start/end dates, dependencies, outcomes. Can link to other UIDs.

---

## Complete Taxonomy Tables

### sn_ (Sites/Endpoints)

[REST OF THE DETAILED TABLES WOULD GO HERE - THIS FILE IS GETTING VERY LONG]

**See:** [CSV export](./complete-taxonomy-v5.1-WIP.csv) for complete L1-L3 details.

**Status:** LIVE - existing taxonomy with 35 platform types across 6 endpoint types.

**Notable Addition:** DEV (Client Device) platform type added to Infrastructure (Feb 9, 2026).

---

### sg_ (Thing) - [DETAILED TAXONOMY]

#### L1: sg_ (Thing)

**Target Database:** shopnet_things

#### L2: Thing Types (6 types)

| Code | Name | Description | Examples |
|------|------|-------------|----------|
| product | Product | Physical or digital goods | iPhone, software license |
| domain | Domain | Internet domain names | cool.shop, example.com |
| information | Information | Knowledge or data | Article, tutorial, dataset |
| service | Service | Professional/technical services | Consulting, web hosting |
| resource | Resource | Tools and templates | Code template, design asset |
| concept | Concept | Abstract ideas | Category, taxonomy |

#### L2 → L3: Subtypes

**product:**
- physical_good (tangible items: furniture, electronics)
- digital_good (downloadable: eBook, software)
- consumable (use-once: food, supplies)
- service_based (product with service: warranty, support plan)

**domain:**
- web2 (traditional TLDs: .com, .net, .org)
- web3 (blockchain: .crypto, .nft, emoji TLDs)
- subdomain (internal: app.example.com)

**information:**
- document (structured: PDF, Word doc)
- data (raw/structured: CSV, JSON, database export)
- knowledge (educational: tutorial, how-to, recipe)
- media (audio/visual: podcast, video, image)

**service:**
- professional (expert services: legal, accounting, consulting)
- technical (tech support: hosting, maintenance, IT)
- creative (creative work: design, photography, writing)
- manual (physical labor: cleaning, moving, repair)

#### L3: Attributes

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| thing_uid | VARCHAR(15) | sg_xxxxxxxxxxxx | YES |
| thing_type | VARCHAR(20) | product/domain/information/service/resource/concept | YES |
| category | VARCHAR(50) | L2 subtype | NO |
| physical | BOOLEAN | Is it a physical object? | NO |
| digital | BOOLEAN | Is it a digital object? | NO |
| consumable | BOOLEAN | Can it be consumed/used up? | NO |
| status | VARCHAR(20) | available/unavailable/discontinued | YES |
| external_refs | JSONB | {asin, isbn, sku, url, ...} | NO |
| name | VARCHAR(255) | Display name | YES |
| description | TEXT | Details | NO |
| created_at | TIMESTAMP | When added | YES |

---

### sc_ (Location) - [DETAILED TAXONOMY]

#### L1: sc_ (Location)

**Target Database:** shopnet_locations

#### L2: Location Types (6 types)

| Code | Name | Description | Examples |
|------|------|-------------|----------|
| store | Store | Retail or commercial location | Apple Store, Walmart |
| warehouse | Warehouse | Storage/distribution facility | Amazon fulfillment center |
| office | Office | Business workspace | Corporate HQ, coworking space |
| home | Home | Residential location | Primary residence, vacation home |
| public_place | Public Place | Publicly accessible location | Park, stadium, airport |
| coordinates | Coordinates | Precise lat/long only | GPS waypoint, drone location |

#### L2 → L3: Subtypes

**store:**
- retail (customer-facing: Walmart, Best Buy)
- restaurant (food service: Starbucks, McDonald's)
- service (service business: bank branch, post office)
- online_pickup (curbside pickup, locker)

**warehouse:**
- distribution (product distribution: fulfillment center)
- storage (general storage: self-storage unit, warehouse)
- manufacturing (production: factory, plant)

**office:**
- corporate (company HQ: regional office, headquarters)
- coworking (shared workspace: WeWork, shared office)
- home_office (remote work: home desk setup)

**public_place:**
- park (outdoor recreation: city park, national park)
- venue (event space: stadium, concert hall, church)
- transport (transit hub: airport, train station, bus terminal)
- landmark (tourist site: monument, historical site)

#### L3: Attributes

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| location_uid | VARCHAR(15) | sc_xxxxxxxxxxxx | YES |
| location_type | VARCHAR(20) | store/warehouse/office/home/public_place/coordinates | YES |
| precision | VARCHAR(20) | exact/approximate/region/city/country | YES |
| latitude | DECIMAL(10,8) | Geographic latitude (-90 to 90) | YES |
| longitude | DECIMAL(11,8) | Geographic longitude (-180 to 180) | YES |
| altitude | DECIMAL(10,2) | Height above sea level (meters, optional) | NO |
| address | JSONB | {street, city, state, zip, country} | NO |
| owner_uid | VARCHAR(15) | su_xxxxxxxxxxxx (who owns/controls) | NO |
| access | VARCHAR(20) | public/private/restricted | YES |
| name | VARCHAR(255) | Display name | NO |
| description | TEXT | Details | NO |

---

### st_ (Transaction - Non-Financial) - [DETAILED TAXONOMY]

#### L1: st_ (Transaction)

**Target Database:** shopnet_transactions

#### L2: Transaction Types (7 types)

| Code | Name | Description | Examples |
|------|------|-------------|----------|
| message | Message | Communication sent | Email, SMS, chat message |
| receipt | Receipt | Confirmation/acknowledgment | Purchase receipt, read receipt |
| shipment | Shipment | Physical item in transit | Package delivery, mail |
| transfer | Transfer | Data or asset transfer | File transfer, ownership transfer |
| notification | Notification | Alert or update | System alert, push notification |
| confirmation | Confirmation | Action confirmation | Booking confirmation, RSVP |
| document | Document | Document exchange | Signed contract, invoice |

#### L2 → L3: Subtypes

**message:**
- email (email message)
- sms (text message)
- chat (instant message: Slack, Teams)
- alert (system alert)

**shipment:**
- package_shipped (parcel sent)
- in_transit (package moving)
- out_for_delivery (delivery in progress)
- delivered (package received)

**document:**
- contract_signed (legal agreement executed)
- invoice_issued (bill sent)
- report_generated (report created)
- certificate_issued (certificate granted)

#### L3: Attributes

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| transaction_uid | VARCHAR(15) | st_xxxxxxxxxxxx | YES |
| transaction_type | VARCHAR(20) | message/receipt/shipment/transfer/etc | YES |
| direction | VARCHAR(20) | outbound/inbound/bilateral | YES |
| from_uid | VARCHAR(15) | Originator (any UID type) | YES |
| to_uid | VARCHAR(15) | Recipient (any UID type) | YES |
| status | VARCHAR(20) | pending/in_transit/delivered/failed/cancelled | YES |
| content_type | VARCHAR(50) | MIME type (text/json/pdf/image) | NO |
| content | TEXT or JSONB | Transaction payload | NO |
| related_to | VARCHAR(15) | What this is about (any UID) | NO |
| timestamp | TIMESTAMP | When transaction occurred | YES |

**Note:** st_ records are **append-only**. Never deleted.

---

### sp_ (Payment) - [DETAILED TAXONOMY]

#### L1: sp_ (Payment)

**Target Database:** shopnet_payments (separate for PCI-DSS compliance)

#### L2: Payment Types (7 types)

| Code | Name | Description | Examples |
|------|------|-------------|----------|
| purchase | Purchase | One-time product/service payment | Buy iPhone, pay for service |
| refund | Refund | Return of previous payment | Product return refund |
| subscription | Subscription | Recurring payment | Netflix, Spotify monthly |
| transfer | Transfer | Peer-to-peer money transfer | Venmo, PayPal transfer |
| tip | Tip | Gratuity payment | Restaurant tip, driver tip |
| donation | Donation | Charitable contribution | Charity donation |
| fee | Fee | Service or processing fee | Transaction fee, service charge |

#### L2 → L3: Payment Methods

**purchase:**
- card (credit/debit card payment)
- bank (ACH/wire transfer)
- wallet (Apple Pay, Google Pay)
- crypto (Bitcoin, Ethereum)
- cash (physical cash)

#### L3: Attributes

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| payment_uid | VARCHAR(15) | sp_xxxxxxxxxxxx | YES |
| payment_type | VARCHAR(20) | purchase/refund/subscription/transfer/etc | YES |
| payment_method | VARCHAR(20) | card/bank/wallet/crypto/cash | YES |
| payer_uid | VARCHAR(15) | su_xxxxxxxxxxxx (who is paying) | **YES** |
| payee_uid | VARCHAR(15) | su_xxxxxxxxxxxx (who is receiving) | **YES** |
| amount | DECIMAL(18,2) | Payment amount | YES |
| currency | VARCHAR(3) | Currency code (USD, EUR, BTC) | YES |
| status | VARCHAR(20) | pending/authorized/captured/failed/refunded/cancelled | YES |
| authentication | JSONB | Payment auth data (PCI-compliant, encrypted) | YES |
| related_to | VARCHAR(15) | What this payment is for (any UID) | NO |
| processor | VARCHAR(50) | Payment processor (stripe, paypal, square) | YES |
| timestamp | TIMESTAMP | When payment occurred | YES |

**Special Rules:**
- sp_ records are **append-only**. Never deleted.
- **Regulatory compliance:** PCI-DSS, financial regulations
- **Separate database:** shopnet_payments (isolated from other data)
- **Audit trail:** Every sp_ must have authentication record

---

### sl_ (List) - [DETAILED TAXONOMY]

#### L1: sl_ (List)

**Target Database:** shopnet_registry

**Status:** DESIGNED - SQL schema ready

#### L2: List Types (8 types)

| Code | Name | Description | Examples |
|------|------|-------------|----------|
| wishlist | Wishlist | Items desired for future purchase | Shopping wishlist, domain watchlist |
| registry | Registry | Gift registry for events | Wedding, baby shower, birthday |
| cart | Cart | Active shopping basket | Shopping cart, saved cart |
| todo | To-Do List | Task list | Work tasks, personal to-do |
| reminder | Reminder | Reminder list | Daily reminders, recurring reminders |
| group | Group | Collection of users (no legal authority) | Team, social group, family |
| network | Network | Professional network | LinkedIn connections, professional contacts |
| collection | Collection | Curated items | Favorite articles, bookmarks, playlist |

#### L2 → L3: Subtypes

**wishlist:**
- shopping_wishlist (products to buy)
- domain_wishlist (domains to acquire)
- general_wishlist (mixed items)

**registry:**
- gift_registry (wedding, baby, birthday registry)
- wish_registry (holiday, graduation)
- donation_registry (charity fundraiser)

**group:**
- team (work team: marketing team, dev team)
- social (friend/hobby group: soccer team, book club)
- family (family members: Smith family)
- network (professional network: industry contacts)

#### L3: Attributes

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| list_uid | VARCHAR(15) | sl_xxxxxxxxxxxx | YES |
| list_type | VARCHAR(20) | wishlist/registry/cart/todo/group/etc | YES |
| visibility | VARCHAR(20) | private/shared/public | YES |
| owner_uid | VARCHAR(15) or ARRAY | su_xxxxxxxxxxxx (can be multiple owners) | **YES** |
| name | VARCHAR(255) | Display name | YES |
| description | TEXT | Purpose/details | NO |
| items | JSONB | Array of {uid, ref, type, quantity, notes} | NO |
| item_count | INTEGER | Number of items | YES |
| status | VARCHAR(20) | active/archived/deleted | YES |
| shared_with | ARRAY | Array of su_ UIDs with access | NO |
| related_to | VARCHAR(15) | What this list is for (any UID, e.g., sv_ event) | NO |

**Key Distinction:** sl_ group vs su_ company
- **sl_ group:** No legal authority. Just a collection (Walmart soccer team)
- **su_ company:** Legal entity. Can sign contracts, own property (Walmart Inc)

---

### su_ (User) - [DETAILED TAXONOMY]

#### L1: su_ (User)

**Target Database:** shopnet_crm

**Status:** DESIGNED - SQL schema ready

#### L2: User Types (4 types)

| Code | Name | Description | Examples |
|------|------|-------------|----------|
| person | Person | Individual human | John Smith, Jane Doe |
| company | Company | Legal business entity | Walmart Inc, Apple Inc |
| organization | Organization | Non-profit or government entity | Red Cross, City Government |
| group_entity | Group Entity | Legal group (trust/estate) | Smith Family Trust, Estate |

#### L2 → L3: Subtypes

**person:**
- individual (standard user account)
- professional (business profile, consultant)
- celebrity (public figure, influencer)

**company:**
- corporation (C-corp, S-corp)
- llc (limited liability company)
- partnership (business partnership, law firm)
- sole_proprietor (individual business, freelancer)

**organization:**
- nonprofit (501c3 charity, foundation)
- government (city, state, federal entity)
- educational (school, university, college)
- religious (church, temple, mosque)

**group_entity:**
- family (family unit with legal status)
- trust (legal trust, family trust)
- estate (deceased person's estate)

#### L3: Attributes

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| user_uid | VARCHAR(15) | su_xxxxxxxxxxxx | YES |
| user_type | VARCHAR(20) | person/company/organization/group_entity | YES |
| role | VARCHAR(20) | owner/admin/member/viewer/employee/contractor (context-dependent) | NO |
| email | VARCHAR(255) | Primary email (unique) | YES |
| display_name | VARCHAR(255) | Public display name | YES |
| auth_provider | VARCHAR(50) | google/apple/microsoft/blockchain/email | YES |
| status | VARCHAR(20) | active/suspended/deleted/deceased | YES |
| legal_status | VARCHAR(50) | individual/sole_proprietor/llc/corporation/nonprofit | NO |
| created_at | TIMESTAMP | Account creation | YES |
| verified | BOOLEAN | Email/identity verified | YES |
| relationships | JSONB | {employer: su_, employees: [su_], member_of: [sl_]} | NO |

**First Law:** su_ has ultimate authority over sa_ agents. User can revoke agent access anytime.

**Key Relationships:**
- **Walmart (su_ company)** → employees → John Smith (su_ person) with role "employee"
- **Walmart Soccer Team (sl_ group)** → members → John Smith (su_ person) with role "individual"

---

### sa_ (Agent) - [DETAILED TAXONOMY]

#### L1: sa_ (Agent)

**Target Database:** shopnet_assist

**Status:** LIVE - 8 agents registered

#### L2: Agent Types (2 types)

| Code | Name | Description | Examples |
|------|------|-------------|----------|
| internal | Internal Agent | Used by Shopnet internally | Content Assist, CTO Assist |
| client | Client Agent | User-facing chatbot | Product Assist, Domain Assist |

#### L2 → L3: Agent Skills (6 skills)

**Agent skills** (what the agent does):
- code (generates/reviews code: CTO Assist, Site Assist)
- chat (conversational: Product Assist, Domain Assist)
- content (creates content: Content Assist)
- data (analyzes data: KPI Assist, CIO Assist)
- documents (handles docs: CAO Assist)
- promotion (marketing: Marketing Assist)

#### L3: Attributes

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| agent_uid | VARCHAR(15) | sa_xxxxxxxxxxxx | YES |
| agent_type | ENUM | internal/client | YES |
| agent_skill | VARCHAR(50) | code/chat/content/data/documents/promotion | YES |
| site_uid | VARCHAR(15) | sn_xxxxxxxxxxxx (platform hosting this agent) | **YES** |
| controlled_by | VARCHAR(15) | su_xxxxxxxxxxxx (user with authority - First Law) | **YES** |
| agent_id | VARCHAR(50) | Human-readable ID (e.g., product_assist) | YES |
| display_name | VARCHAR(255) | Agent name | YES |
| model_tier | ENUM | basic/standard/premium | YES |
| status | VARCHAR(20) | live/wip/future/suspended | YES |
| permissions | JSONB | What the agent can do | NO |
| delegations | ARRAY | Array of su_ UIDs who delegated to this agent | NO |

**Two-Level Identity:**
1. **sn_ (Agent Platform)** - The infrastructure (e.g., Claude platform)
2. **sa_ (Agent Instance)** - The specific agent running on that platform

**Relationship:** One sn_ platform → Multiple sa_ agents

**First Law of AI:** Agents operate under user direction. User (su_) can revoke access anytime.

---

### sv_ (Activity) - [DETAILED TAXONOMY]

#### L1: sv_ (Activity)

**Target Database:** shopnet_activities

**Status:** WIP - new system

#### L2: Activity Types (9 types)

| Code | Name | Description | Examples |
|------|------|-------------|----------|
| campaign | Campaign | Marketing or awareness campaign | Product launch, ad campaign |
| project | Project | Work project with deliverables | Website redesign, construction |
| event | Event | Scheduled occurrence | Wedding, conference, meeting |
| plan | Plan | Strategic plan | Annual plan, business plan |
| goal | Goal | Objective to achieve | Revenue goal, fitness goal |
| task | Task | Individual work item | Order cake, update docs |
| outcome | Outcome | Result or deliverable | Launch complete, milestone reached |
| sprint | Sprint | Time-boxed iteration | 2-week sprint, agile sprint |
| milestone | Milestone | Key project checkpoint | Beta launch, Phase 1 complete |

#### L2 → L3: Categories

**project:**
- software_development (build app, write code)
- construction (build office, renovate)
- event_planning (plan wedding, organize conference)
- research (market research, study)

**event:**
- meeting (team meeting, client call)
- conference (industry conference, summit)
- celebration (wedding, birthday party, graduation)
- milestone (product launch, grand opening)

**task:**
- work_task (business-related task)
- personal_task (personal to-do)
- recurring_task (weekly, daily tasks)
- subtask (part of larger task)

**campaign:**
- marketing_campaign (promotional campaign, ad campaign)
- sales_campaign (sales initiative, outreach)
- awareness_campaign (brand awareness, social cause)
- fundraising (charity fundraiser, crowdfunding)

**goal:**
- business_goal (revenue, growth, KPIs)
- personal_goal (fitness, learning, habits)
- team_goal (team KPIs, OKRs)
- project_goal (deliverable, outcome)

#### L3: Attributes

| Field | Type | Description | Required |
|-------|------|-------------|----------|
| activity_uid | VARCHAR(15) | sv_xxxxxxxxxxxx | YES |
| activity_type | VARCHAR(20) | campaign/project/event/plan/goal/task/etc | YES |
| category | VARCHAR(50) | Domain/purpose (marketing, development, personal) | NO |
| name | VARCHAR(255) | Activity name | YES |
| description | TEXT | Details | NO |
| owner_uid | VARCHAR(15) | su_xxxxxxxxxxxx (who owns this activity) | YES |
| assigned_to | VARCHAR(15) | su_ or sl_ (person or group responsible) | NO |
| parent_uid | VARCHAR(15) | sv_xxxxxxxxxxxx (parent activity for nesting) | NO |
| depends_on | ARRAY | Array of sv_ UIDs (dependencies) | NO |
| start_date | TIMESTAMP | When it starts | NO |
| end_date | TIMESTAMP | When it ends/due | NO |
| duration | INTERVAL | How long it takes | NO |
| status | VARCHAR(20) | planned/active/completed/cancelled/blocked | YES |
| related_entities | JSONB | Links to other UIDs {sl_, sg_, sc_, etc.} | NO |

**Use Cases:**
- Jira-style project management
- Wedding planning (tasks, vendors, timelines)
- Business campaigns (marketing, sales)
- Personal goal tracking

---

## Status Summary

| UID Type | L2 Count | L3 Count | Database | Status | Notes |
|----------|----------|----------|----------|--------|-------|
| **sn_** | 35 | 12 | shopnet_sites | **LIVE** | Existing, fully deployed |
| **sg_** | 19 | 5 | shopnet_things | **WIP** | New database needed |
| **sc_** | 13 | 6 | shopnet_locations | **WIP** | New database needed |
| **st_** | 15 | 7 | shopnet_transactions | **WIP** | New database needed |
| **sp_** | 9 | 9 | shopnet_payments | **WIP** | Separate for compliance |
| **sl_** | 14 | 9 | shopnet_registry | **DESIGNED** | SQL ready, tables not created |
| **su_** | 13 | 8 | shopnet_crm | **DESIGNED** | SQL ready, tables not created |
| **sa_** | 7 | 8 | shopnet_assist | **LIVE** | 8 agents registered |
| **sv_** | 17 | 11 | shopnet_activities | **WIP** | New database needed |
| **Total** | **142** | **75** | **9 databases** | — | — |

---

## Next Steps

1. ✅ Document complete L1-L3 taxonomy
2. ✅ Export to CSV
3. ✅ Create taxonomy_law schema
4. ✅ Document operational model
5. ⬜ Load CSV into taxonomy_law table (shopnet_connect)
6. ⬜ Build API endpoints for taxonomy access
7. ⬜ Update Console to use taxonomy API
8. ⬜ Design local taxonomy tables for new UID types
9. ⬜ Provision new RDS instances
10. ⬜ Implement sync jobs

---

**Document Status:** WIP - Complete taxonomy documented
**Next Review:** After master registry implementation
**CSV Export:** [complete-taxonomy-v5.1-WIP.csv](./complete-taxonomy-v5.1-WIP.csv)
**SQL Schema:** [taxonomy_law_schema.sql](./taxonomy_law_schema.sql)
