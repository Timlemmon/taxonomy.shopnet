> **SUPERSEDED** — This document has been superseded by **`ThisIsTheLaw_v5.0_2026-02-07.MD`** (same directory).
> All content from this file has been merged into the master document. Retained for historical reference only.
> — February 7, 2026

# Fixing THE LAW — Taxonomy Update Record
**Created:** February 7, 2026
**Purpose:** Capture all discrepancies and pending changes needed to bring THE LAW documents up to date
**Context:** Compiled from Document 26 (THE LAW v4.0), Document 47 (SND LAW v1.0), Document 46 (Future Deathstar v2.0), Deathstar Master v5.0, and the active Claude session (9c49eaff) where the Feb 4 taxonomy changes were implemented in code but NOT yet written back to the governance documents.

**System Sources of Truth (code):**
- `console.js` PLATFORM_OPTIONS constant — `/shopnet.network-console/static/js/console.js` (lines 3783-3824)
- `update-taxonomy-v3.5.sql` — `/shopnet.network-console/scripts/update-taxonomy-v3.5.sql` (THE LAW v3.5, Feb 4 2026)
- `taxonomy_definition` RDS table — created by the SQL script above, stores every valid taxonomy value

---

## Table of Contents

1. [Documents Involved](#1-documents-involved)
2. [System Sources of Truth (Code)](#2-system-sources-of-truth-code)
3. [What Changed on Feb 4, 2026](#3-what-changed-on-feb-4-2026)
4. [Current Correct Taxonomy (Full Schema)](#4-current-correct-taxonomy-full-schema)
5. [Discrepancies Between Documents](#5-discrepancies-between-documents)
6. [Documents That Need Updating](#6-documents-that-need-updating)
7. [Full endpoint_taxonomy RDS Schema](#7-full-endpoint_taxonomy-rds-schema)
8. [taxonomy_definition Table (Complete Seed Data)](#8-taxonomy_definition-table-complete-seed-data)
9. [Console Card Allocation Rules](#9-console-card-allocation-rules)
10. [Pulse Health Check Method Mapping](#10-pulse-health-check-method-mapping)

---

## 1. Documents Involved

| # | Document | Location | Version | Date | Status |
|---|----------|----------|---------|------|--------|
| 26 | THIS IS THE LAW | `/shopnet-deathstar/26-THIS-IS-THE-LAW.md` | v4.0 | Feb 6, 2026 | **OUTDATED** — still has `ND` |
| 47 | THIS IS THE SND LAW | `/taxonomy.shopnet/ThisIsTheLaw.md` | v1.0 | Feb 6, 2026 | OK — namespace-level, no endpoint taxonomy detail |
| 46 | Future Deathstar | `/shopnet-deathstar/46-FUTURE-DEATHSTAR.md` | v2.0 | Feb 6, 2026 | OK — vision doc, references old format but not authoritative for taxonomy |
| — | Deathstar Master | `/shopnet-deathstar/Shopnet-Deathstar-Master.MD` | v5.0 | Feb 6, 2026 | **OUTDATED** — still has `ND` |
| — | Deathstar LITE | `/shopnet-deathstar/Shopnet-Deathstar-LITE.md` | v2.1 | Feb 6, 2026 | **OUTDATED** — still has `ND` |
| — | Old Law (console) | `/shopnet.network-console/docs/OLD/ThisIsTheLawOLD.md` | v3.3 | Feb 2, 2026 | Archived — correct for its version |
| — | SND LAW (console) | `/shopnet.network-console/docs/47-THIS-IS-THE-SND-LAW.md` | v1.0 | Feb 6, 2026 | Copy of Doc 47 |
| — | console.js | `/shopnet.network-console/static/js/console.js` | — | Feb 4+, 2026 | **CORRECT** — `PLATFORM_OPTIONS` has the new taxonomy |
| — | update-taxonomy-v3.5.sql | `/shopnet.network-console/scripts/update-taxonomy-v3.5.sql` | v3.5 | Feb 4, 2026 | **CORRECT** — complete taxonomy definition SQL |
| — | Console GUI "This Is The Law" panel | `/shopnet.network-console/static/index.html` (lines 3874-4720+) | — | Feb 6, 2026 | **PARTIALLY OUTDATED** — has SND namespace content but Platform Type Flags table incomplete, missing N/I/O platform_types, no taxonomy_definition concept |

### Copies in shopnet.network-library (mirror repo)

| Document | Location |
|----------|----------|
| 26-THIS-IS-THE-LAW.md | `/shopnet.network-library/shopnet-deathstar/26-THIS-IS-THE-LAW.md` |
| 47-ThisIsTheLaw.md | `/shopnet.network-library/shopnet-deathstar/47-ThisIsTheLaw.md` |
| ThisIsTheLaw.md | `/shopnet.network-library/taxonomy.shopnet/ThisIsTheLaw.md` |
| 46-FUTURE-DEATHSTAR.md | `/shopnet.network-library/shopnet-deathstar/46-FUTURE-DEATHSTAR.md` |

These mirror copies also need updating when the primaries are updated.

---

## 2. System Sources of Truth (Code)

The governance documents (THE LAW, Deathstar) are **outdated**. The following code files represent the **actual current system state** as implemented on Feb 4, 2026.

### 2.1 console.js — PLATFORM_OPTIONS

**File:** `/shopnet.network-console/static/js/console.js` (lines 3783-3824)

This JavaScript constant defines the Level 1 → Level 2 hierarchy for the Add/Edit Endpoint wizard in the Console GUI. It controls what options appear when creating or editing endpoints.

```javascript
const PLATFORM_OPTIONS = {
    'W': [
        { value: 'CO', label: 'CloudFront On-Demand (CO)', desc: 'Lambda-backed, scales to zero' },
        { value: 'CP', label: 'CloudFront Persistent (CP)', desc: 'nginx on EC2, always running' },
        { value: 'WP', label: 'WordPress (WP)', desc: 'PHP on EC2 with WordPress' },
        { value: 'SH', label: 'Shopify (SH)', desc: 'External Shopify store' },
        { value: 'WW', label: 'WooCommerce (WW)', desc: 'WordPress with WooCommerce' },
        { value: 'CL', label: 'Custom Lambda (CL)', desc: 'Custom Lambda function' },
        { value: 'S3', label: 'S3 Static (S3)', desc: 'Static files on S3' },
        { value: 'LM', label: 'Lightsail (LM)', desc: 'Amazon Lightsail instance' },
        { value: 'W3', label: 'Web3 Domain (W3)', desc: 'Web3 blockchain domain (Freename, ENS)' },
    ],
    'A': [
        { value: 'CL', label: 'Claude Agent (CL)', desc: 'Anthropic Claude-based agent' },
        { value: 'GP', label: 'GPT Agent (GP)', desc: 'OpenAI GPT-based agent' },
        { value: 'CA', label: 'Custom Agent (CA)', desc: 'Custom AI agent implementation' },
    ],
    'D': [
        { value: 'RD', label: 'RDS PostgreSQL (RD)', desc: 'Amazon RDS PostgreSQL' },
        { value: 'DY', label: 'DynamoDB (DY)', desc: 'Amazon DynamoDB' },
        { value: 'S3', label: 'S3 Data Lake (S3)', desc: 'S3 as data store' },
        { value: 'GIT', label: 'GitHub Repository (GIT)', desc: 'GitHub code repository' },
        { value: 'TPD', label: 'Third Party DB API (TPD)', desc: 'External database API' },
    ],
    'N': [
        { value: 'W3G', label: 'Web3 Gateway (W3G)', desc: 'Web3 domain resolution gateway' },
        { value: 'API', label: 'API Hub (API)', desc: 'API service endpoint' },
        { value: 'RDH', label: 'Redirect Hub (RDH)', desc: 'URL redirect service' },
        { value: 'W3S', label: 'Web3 DAAS (W3S)', desc: 'Web3 decentralized service' },
        { value: 'LLM', label: 'LLM Service (LLM)', desc: 'Large language model service' },
        { value: 'OTH', label: 'Other Node (OTH)', desc: 'Other network node' },
    ],
    'I': [
        { value: 'S3B', label: 'S3 Bucket (S3B)', desc: 'S3 storage bucket' },
        { value: 'LMB', label: 'Lambda Function (LMB)', desc: 'Standalone Lambda' },
        { value: 'SQS', label: 'SQS Queue (SQS)', desc: 'Message queue' },
        { value: 'SNS', label: 'SNS Topic (SNS)', desc: 'Notification topic' },
    ],
    'O': [
        { value: 'OTH', label: 'Other (OTH)', desc: 'Uncategorized endpoint' },
    ]
};
```

### 2.2 update-taxonomy-v3.5.sql — Complete Taxonomy Definition

**File:** `/shopnet.network-console/scripts/update-taxonomy-v3.5.sql`
**Date:** February 4, 2026
**Authority:** TJL (THE LAW v3.5)

This SQL script is the **most authoritative source** for the taxonomy. It:

1. Creates the `taxonomy_definition` table — a lookup table storing every valid value for every taxonomy level
2. Seeds all valid values for: `endpoint_type`, `platform_type`, `website_purpose`, `managed_by`, `persistence`, `status`, `web_protocol`, `console_section`, `runtime`, `host`, `agent_type`
3. Marks legacy values (`ND`, `gateway`) as inactive
4. Updates the `endpoint_taxonomy` CHECK constraint from `(W, A, D, ND)` to `(W, A, D, N, I, O)`
5. Updates the `validate_platform_type()` trigger function with all new valid combinations
6. Provides migration template for reclassifying existing `ND` records (commented out, awaiting manual review)

### 2.3 Differences Between console.js and SQL

The SQL trigger validation is **slightly broader** than console.js PLATFORM_OPTIONS:

| Level | console.js | SQL trigger | Difference |
|-------|-----------|-------------|------------|
| W platform_types | CO, CP, WP, SH, WW, CL, S3, LM, **W3** | CO, CP, WP, WW, SH, CL, S3, LM, **L3** | JS has `W3`; SQL has `L3` (Layer3 Web3 — Lambda@Edge with IP certs for emoji TLDs) |
| A platform_types | CL, GP, CA | CL, GP, **GM**, CA, **OT** | SQL keeps `GM` (Gemini) and `OT` (Other) as valid; JS only shows CL, GP, CA in wizard |

The SQL is more permissive to allow legacy/future values. The JS wizard shows only the primary options. Both are correct for their purpose.

---

## 3. What Changed on Feb 4, 2026

**Authority:** TJL
**Implemented in:** `console.js` PLATFORM_OPTIONS constant and `update-taxonomy-v3.5.sql` (active Claude session 9c49eaff)
**Written to governance documents:** NO — this is the gap

### Change Log

| Date | Change | Authority |
|------|--------|-----------|
| Feb 4, 2026 | Split `ND` (Node) into `N` (Node), `I` (Infrastructure), `O` (Other) | TJL |
| Feb 4, 2026 | Added `GIT`, `TPD` to Database platform_types | TJL |
| Feb 4, 2026 | Added Node platform_types: W3G, API, RDH, W3S, LLM, OTH | TJL |
| Feb 4, 2026 | Added Infrastructure platform_types: S3B, LMB, SQS, SNS | TJL |
| Feb 4, 2026 | Added Website platform_types: CL (Custom Lambda), S3 (S3 Static), LM (Lightsail) | TJL |
| Feb 4, 2026 | Added Website platform_types: W3 (Web3 Domain) in console.js; L3 (Layer3 Web3) in SQL | TJL |
| Feb 4, 2026 | Added Agent platform_type: CA (Custom Agent); GM and OT kept valid in SQL trigger | TJL |
| Feb 4, 2026 | Removed `gateway` from website_purpose | TJL |

### Before (Document 26 v4.0)

```
Level 1 endpoint_type:  W, A, D, ND     (4 types)
```

### After (Feb 4 changes)

```
Level 1 endpoint_type:  W, A, D, N, I, O     (6 types)
```

---

## 4. Current Correct Taxonomy (Full Schema)

This is the CURRENT CORRECT taxonomy as of Feb 7, 2026, combining Document 26 v4.0 with the Feb 4 changes.

### Level 0 — Identity

| Field | Type | Values | Required | Mutable |
|-------|------|--------|----------|---------|
| `site_uid` | VARCHAR(12) / VARCHAR(15) | v1: `SN-XXXXXXXX`, v2: `sn_xxxxxxxxxxxx` | YES | **NO** |

Issued by Connect Gateway ONLY. Never changes. Never reused.

---

### Level 1 — Endpoint Type

| Field | Type | Required | Mutable |
|-------|------|----------|---------|
| `endpoint_type` | CHAR(2) | YES | **NO** — set at creation, immutable |

| Code | Name | Description |
|------|------|-------------|
| `W` | Website | Web-accessible sites (brochure, store, portal, console) |
| `A` | Agent | AI agents and assistants |
| `D` | Database | Data stores (RDS, DynamoDB, S3, GitHub) |
| `N` | Node | Network service nodes (gateways, APIs, hubs) |
| `I` | Infrastructure | Infrastructure components (Lambda, queues, topics) |
| `O` | Other | Uncategorized endpoints |

---

### Level 2 — Platform Type

| Field | Type | Required | Mutable |
|-------|------|----------|---------|
| `platform_type` | VARCHAR(3) | YES | **YES** — via migration workflow |

#### W (Website)

| Code | Name | Runtime | Host | Description |
|------|------|---------|------|-------------|
| `CO` | CloudFront On-Demand | Lambda | API Gateway | Lambda-backed, scales to zero |
| `CP` | CloudFront Persistent | Nginx | EC2 | nginx on EC2, always running |
| `WP` | WordPress | PHP | EC2 | PHP on EC2 with WordPress |
| `WW` | WooCommerce | PHP | EC2 | WordPress with WooCommerce |
| `SH` | Shopify | External | External | External Shopify store |
| `CL` | Custom Lambda | Lambda | Lambda | Custom Lambda function |
| `S3` | S3 Static | S3 | S3 | Static files on S3 |
| `LM` | Lightsail | Various | Lightsail | Amazon Lightsail instance |
| `W3` | Web3 Domain | Web3 | Web3 | Web3 blockchain domain (Freename, ENS) — *console.js* |
| `L3` | Layer3 Web3 | Lambda@Edge | CloudFront | Lambda@Edge with IP certs for emoji TLDs — *SQL trigger* |

#### A (Agent)

| Code | Name | Provider | Description |
|------|------|----------|-------------|
| `CL` | Claude Agent | Anthropic | Claude-based agent |
| `GP` | GPT Agent | OpenAI | GPT-based agent |
| `GM` | Gemini Agent | Google | Google Gemini-based agent — *valid in SQL trigger, not shown in wizard* |
| `CA` | Custom Agent | Various | Custom AI agent implementation |
| `OT` | Other Agent | Various | Other AI agent — *valid in SQL trigger, not shown in wizard* |

#### D (Database)

| Code | Name | Service | Description |
|------|------|---------|-------------|
| `RD` | RDS PostgreSQL | AWS RDS | Amazon RDS PostgreSQL |
| `DY` | DynamoDB | AWS DynamoDB | Amazon DynamoDB |
| `S3` | S3 Data Lake | AWS S3 | S3 as data store |
| `GIT` | GitHub Repository | GitHub | GitHub code repository |
| `TPD` | Third Party DB API | Various | External database API |

#### N (Node) — *formerly part of ND*

| Code | Name | Service | Description |
|------|------|---------|-------------|
| `W3G` | Web3 Gateway | Web3 | Web3 domain resolution gateway |
| `API` | API Hub | Various | API service endpoint |
| `RDH` | Redirect Hub | Various | URL redirect service |
| `W3S` | Web3 DAAS | Web3 | Web3 decentralized service |
| `LLM` | LLM Service | Various | Large language model service |
| `OTH` | Other Node | Various | Other network node |

#### I (Infrastructure) — *formerly part of ND*

| Code | Name | Service | Description |
|------|------|---------|-------------|
| `S3B` | S3 Bucket | AWS S3 | S3 storage bucket |
| `LMB` | Lambda Function | AWS Lambda | Standalone Lambda |
| `SQS` | SQS Queue | AWS SQS | Message queue |
| `SNS` | SNS Topic | AWS SNS | Notification topic |

#### O (Other) — *formerly part of ND*

| Code | Name | Description |
|------|------|-------------|
| `OTH` | Other | Uncategorized endpoint |

---

### Universal Fields (all endpoint types)

| Field | Type | Values | Required | Mutable |
|-------|------|--------|----------|---------|
| `domain_name` | VARCHAR(255) | any | YES | YES |
| `web_protocol` | CHAR(2) | `W2` (Web2/ICANN), `W3` (Web3/blockchain) | YES | **NO** — immutable |
| `status` | VARCHAR(10) | `planned`, `wip`, `live` | YES | YES |
| `runtime` | VARCHAR(20) | `nginx`, `lambda`, `php`, `node`, `python`, `external` | NO | YES |
| `host` | VARCHAR(20) | `ec2`, `api_gateway`, `s3`, `cloudfront`, `external` | NO | YES |
| `created_at` | TIMESTAMP | — | YES | NO |
| `updated_at` | TIMESTAMP | — | YES | YES |
| `notes` | TEXT | — | NO | YES |
| `created_by` | VARCHAR(100) | default `'system'` | NO | YES |
| `deleted_at` | TIMESTAMP | — | NO | YES |

---

### Level 3 — Website-Specific Fields (`endpoint_type = 'W'` only)

| Field | Type | Values | Required | Mutable |
|-------|------|--------|----------|---------|
| `managed_by` | CHAR(1) | `L` (Lambda), `R` (Radius), `M` (Manual), `E` (External), `null` (none) | NO | YES |
| `persistence` | CHAR(1) | `D` (On-Demand), `P` (Persistent) | NO | YES |
| `website_purpose` | VARCHAR(20) | `brochure`, `product_store`, `domain_store`, `portal`, `console`, `other` | NO | YES |
| `store_checkout` | CHAR(1) | `Y`, `N` | NO | YES |

**Note:** `managed_by` gained value `E` (External) in the Feb 4 wizard updates. Document 26 v4.0 only lists L, R, M, null.

**Note:** `gateway` was removed from `website_purpose` on Feb 4.

---

## 5. Discrepancies Between Documents

### 4.1 endpoint_type

| Source | Values | Status |
|--------|--------|--------|
| Document 26 (THE LAW v4.0) | W, A, D, **ND** | **OUTDATED** |
| Deathstar Master v5.0 | W, A, D, **ND** | **OUTDATED** |
| Deathstar LITE v2.1 | W, A, D, **ND** | **OUTDATED** |
| console.js PLATFORM_OPTIONS | W, A, D, **N, I, O** | **CORRECT** |
| RDS CHECK constraint | Needs verification — may still have old `ND` constraint | **CHECK** |

### 4.2 store_checkout

| Source | Values | Status |
|--------|--------|--------|
| Document 26 (THE LAW v4.0) | `Y`, `N` | Authoritative |
| Deathstar Master (line 7201) | `affiliate`, `checkout`, `both`, `none` | **CONFLICTS** with Document 26 |

**Resolution needed:** Which is correct? Document 26 says Y/N. Deathstar Master says 4 values. THE LAW takes precedence unless intentionally updated.

### 4.3 Agent platform_types

| Source | Values | Status |
|--------|--------|--------|
| Document 26 (THE LAW v4.0) | CL, GP, **GM**, **CU**, **OT** | **OUTDATED** |
| console.js PLATFORM_OPTIONS | CL, GP, **CA** | **CORRECT** |

GM (Gemini), CU (Custom), OT (Other) replaced by CA (Custom Agent).

### 4.4 Website platform_types

| Source | Values | Status |
|--------|--------|--------|
| Document 26 (THE LAW v4.0) | CO, CP, WP, WW, SH | **OUTDATED** — missing 3 |
| console.js PLATFORM_OPTIONS | CO, CP, WP, WW, SH, **CL**, **S3**, **LM** | **CORRECT** |

New: CL (Custom Lambda), S3 (S3 Static), LM (Lightsail).

### 4.5 Database platform_types

| Source | Values | Status |
|--------|--------|--------|
| Document 26 (THE LAW v4.0) | S3, RD | **OUTDATED** — missing 3 |
| console.js PLATFORM_OPTIONS | RD, **DY**, S3, **GIT**, **TPD** | **CORRECT** |

New: DY (DynamoDB), GIT (GitHub Repository), TPD (Third Party DB API).

### 4.6 managed_by

| Source | Values | Status |
|--------|--------|--------|
| Document 26 (THE LAW v4.0) | L, R, M, null | **OUTDATED** — missing E |
| console.js wizard | L, R, M, **E** (External) | **CORRECT** |

---

## 6. Documents That Need Updating

### Priority 1 — Governance (THE LAW)

| Document | What Needs Changing |
|----------|-------------------|
| **26-THIS-IS-THE-LAW.md** | Part II: Replace `ND` with `N`, `I`, `O` in all taxonomy tables, diagrams, schemas, CHECK constraints. Update all platform_type tables. Update managed_by. Bump to v5.0. |
| **Deathstar Master** | Section 21.2.2: Update taxonomy table and website-specific fields. |
| **Deathstar LITE** | Section 2 Taxonomy: Update endpoint_type and platform_type values. |
| **Console GUI "This Is The Law" panel** | `index.html` lines 3874-4720+: (1) Platform Type Flags table (line 4387) only shows Website flags — missing A, D, N, I, O platform_types. (2) Site ID System section (line 4614) only shows v1 format — add v2. (3) Add taxonomy_definition source-of-truth concept. (4) Add revised Infrastructure platform_types (LS, EC2, RDS, CF, AGW). |

### Priority 2 — Copies

| Document | Action |
|----------|--------|
| `/shopnet.network-library/shopnet-deathstar/26-THIS-IS-THE-LAW.md` | Sync from primary after update |
| `/backup/snd-build-20260206/26-THIS-IS-THE-LAW_v4.0.md` | Leave as-is (historical backup) |

### Priority 3 — RDS Schema

| Item | Action |
|------|--------|
| `endpoint_taxonomy` CHECK constraint | Verify and update: `CHECK (endpoint_type IN ('W', 'A', 'D', 'N', 'I', 'O'))` |
| `taxonomy_definition` table | Verify seed data includes all new platform_types |
| Existing `ND` records | Migrate to `N`, `I`, or `O` as appropriate |

---

## 7. Full endpoint_taxonomy RDS Schema

The CORRECT schema as of Feb 7, 2026:

```sql
CREATE TABLE endpoint_taxonomy (
    site_uid         VARCHAR(15)   PRIMARY KEY,  -- SN-XXXXXXXX (v1) or sn_xxxxxxxxxxxx (v2)
    domain_name      VARCHAR(255)  NOT NULL UNIQUE,
    endpoint_type    CHAR(2)       NOT NULL,     -- W, A, D, N, I, O     (IMMUTABLE)
    platform_type    VARCHAR(3)    NOT NULL,      -- varies by endpoint_type
    web_protocol     CHAR(2)       NOT NULL DEFAULT 'W2',  -- W2, W3   (IMMUTABLE)
    status           VARCHAR(10)   NOT NULL DEFAULT 'planned',
    runtime          VARCHAR(20),
    host             VARCHAR(20),
    -- Website-specific (Level 3, nullable) --
    managed_by       CHAR(1),                    -- L, R, M, E
    persistence      CHAR(1),                    -- D, P
    website_purpose  VARCHAR(20),
    store_checkout   CHAR(1),                    -- Y, N
    -- Agent-specific (nullable) --
    agent_type       VARCHAR(20),
    -- Console display --
    console_section  VARCHAR(50),
    card_label       VARCHAR(255),
    show_on_map      BOOLEAN       DEFAULT TRUE,
    -- Metadata --
    created_at       TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMP     NOT NULL DEFAULT NOW(),
    notes            TEXT,
    created_by       VARCHAR(100)  DEFAULT 'system',
    deleted_at       TIMESTAMP,
    -- Constraints --
    CONSTRAINT chk_endpoint_type CHECK (endpoint_type IN ('W', 'A', 'D', 'N', 'I', 'O'))
);
```

### Companion Table: website_data (FK to endpoint_taxonomy, W only)

```sql
CREATE TABLE website_data (
    site_uid              VARCHAR(15)   PRIMARY KEY REFERENCES endpoint_taxonomy(site_uid),
    template_id           VARCHAR(50),
    site_content          JSONB,
    html_s3_path          VARCHAR(255),
    build_status          VARCHAR(20),
    build_error           TEXT,
    dns_status            VARCHAR(20),
    ssl_status            VARCHAR(20),
    cloudfront_id         VARCHAR(50),
    cloudfront_domain     VARCHAR(255),
    route53_zone_id       VARCHAR(50),
    acm_cert_arn          VARCHAR(255),
    last_build_at         TIMESTAMP,
    last_deploy_at        TIMESTAMP
);
```

---

## 8. taxonomy_definition Table (Complete Seed Data)

The `taxonomy_definition` table is the **RDS lookup table** that stores every valid taxonomy value. Created by `update-taxonomy-v3.5.sql`.

**Source:** `/shopnet.network-console/scripts/update-taxonomy-v3.5.sql`

### Table Schema

```sql
CREATE TABLE taxonomy_definition (
    id SERIAL PRIMARY KEY,
    level VARCHAR(30) NOT NULL,           -- e.g., 'endpoint_type', 'platform_type'
    parent_code VARCHAR(10),              -- For platform_type: the parent endpoint_type
    code VARCHAR(30) NOT NULL,            -- The code value
    name VARCHAR(100) NOT NULL,           -- Display name
    description TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(level, parent_code, code)
);
```

### Complete Seed Data

#### endpoint_type

| code | name | description | active |
|------|------|-------------|--------|
| `W` | Website | Web-accessible sites (brochure, store, portal, console) | TRUE |
| `A` | Agent | AI agents and assistants | TRUE |
| `D` | Database | Data stores (RDS, DynamoDB, S3, GitHub) | TRUE |
| `N` | Node | Network service nodes (gateways, APIs, hubs) | TRUE |
| `I` | Infrastructure | Infrastructure components (Lambda, queues, topics) | TRUE |
| `O` | Other | Uncategorized endpoints | TRUE |
| `ND` | Non-Domain (LEGACY) | Legacy — split into N, I, O | **FALSE** |

#### platform_type (parent: W)

| code | name | description |
|------|------|-------------|
| `CO` | CloudFront On-Demand | Lambda-backed, scales to zero |
| `CP` | CloudFront Persistent | nginx on EC2, always running |
| `WP` | WordPress | PHP on EC2 with WordPress |
| `SH` | Shopify | External Shopify store |
| `WW` | WooCommerce | WordPress with WooCommerce |
| `CL` | Custom Lambda | Custom Lambda function |
| `S3` | S3 Static | Static files on S3 |
| `LM` | Lightsail | Amazon Lightsail instance |
| `L3` | Layer3 Web3 | Lambda@Edge with IP certs for emoji TLDs |

#### platform_type (parent: A)

| code | name | description |
|------|------|-------------|
| `CL` | Claude Agent | Anthropic Claude-based agent |
| `GP` | GPT Agent | OpenAI GPT-based agent |
| `CA` | Custom Agent | Custom AI agent implementation |
| `GM` | Gemini Agent | Google Gemini-based agent |
| `OT` | Other Agent | Other AI agent |

#### platform_type (parent: D)

| code | name | description |
|------|------|-------------|
| `RD` | RDS PostgreSQL | Amazon RDS PostgreSQL |
| `DY` | DynamoDB | Amazon DynamoDB |
| `S3` | S3 Data Lake | S3 as data store |
| `GIT` | GitHub Repository | GitHub code repository |
| `TPD` | Third Party DB API | External database API |

#### platform_type (parent: N)

| code | name | description |
|------|------|-------------|
| `W3G` | Web3 Gateway | Web3 domain resolution gateway |
| `API` | API Hub | API service endpoint |
| `RDH` | Redirect Hub | URL redirect service |
| `W3S` | Web3 DAAS | Web3 decentralized service |
| `LLM` | LLM Service | Large language model service |
| `OTH` | Other Node | Other network node |

#### platform_type (parent: I)

| code | name | description |
|------|------|-------------|
| `S3B` | S3 Bucket | S3 storage bucket |
| `LMB` | Lambda Function | Standalone Lambda |
| `SQS` | SQS Queue | Message queue |
| `SNS` | SNS Topic | Notification topic |

#### platform_type (parent: O)

| code | name | description |
|------|------|-------------|
| `OTH` | Other | Uncategorized endpoint |

#### website_purpose (parent: W)

| code | name | description | active |
|------|------|-------------|--------|
| `brochure` | Brochure Site | Brochure/marketing site | TRUE |
| `product_store` | Product Store | Product store (e.g., Shopify) | TRUE |
| `domain_store` | Domain Store | Domain store (e.g., WooCommerce) | TRUE |
| `portal` | Portal | Client portal | TRUE |
| `console` | Console | Console/Admin interface | TRUE |
| `other` | Other | Other purpose | TRUE |
| `gateway` | Web3 Gateway (LEGACY) | Legacy — use endpoint_type=N, platform_type=W3G | **FALSE** |

#### managed_by

| code | name | description |
|------|------|-------------|
| `L` | Lambda | Managed by AWS Lambda (On-Demand) |
| `R` | Radius | Managed by Radius site builder (Persistent) |
| `M` | Manual | Manually managed |
| `E` | External | Externally managed (third-party) |

#### persistence

| code | name | description |
|------|------|-------------|
| `P` | Persistent | Always running |
| `D` | On-Demand | Scales to zero when not in use |

#### status

| code | name | description |
|------|------|-------------|
| `planned` | Planned | Placeholder — grey dot, not health checked |
| `wip` | Work in Progress | Building — orange dot |
| `live` | Live | Active — green/red based on health check |

#### web_protocol

| code | name | description |
|------|------|-------------|
| `W2` | Web2 | Traditional DNS-based web |
| `W3` | Web3 | Blockchain/decentralized web |

#### console_section

| code | name | description |
|------|------|-------------|
| `brochure` | Brochure Sites | Marketing and brochure websites |
| `products` | Product Stores | E-commerce product stores |
| `domains` | Domain Stores | Domain marketplace stores |
| `data.shopnet` | Data Layer | Databases and data stores |
| `assist.shopnet` | AI Agents | AI assistants and agents |
| `network-nodes` | Network Nodes | Network service nodes (non-W3G) |
| `web3-gateways` | Web3 Gateways | Web3 domain resolution gateways |
| `infrastructure` | Infrastructure | AWS infrastructure components |
| `shopnet.network` | Core Platform | Core platform services and consoles |
| `connect.shopnet` | Connect Services | Connect API and services |

#### runtime

| code | name | description |
|------|------|-------------|
| `nginx` | nginx | nginx web server |
| `lambda` | Lambda | AWS Lambda function |
| `php` | PHP | PHP runtime |
| `node` | Node.js | Node.js runtime |
| `python` | Python | Python runtime |
| `external` | External | External/third-party runtime |

#### host

| code | name | description |
|------|------|-------------|
| `ec2` | EC2 | Amazon EC2 instance |
| `api_gateway` | API Gateway | AWS API Gateway |
| `s3` | S3 | Amazon S3 |
| `cloudfront` | CloudFront | Amazon CloudFront CDN |
| `external` | External | External/third-party host |

#### agent_type

| code | name | description |
|------|------|-------------|
| `domain` | Domain Assist | Domain recommendation agent |
| `product` | Product Assist | Product recommendation agent |
| `content` | Content Assist | Content generation agent |
| `kpi` | KPI Assist | KPI analysis agent |
| `site` | Site Assist | Site management agent |
| `choice` | Choice Assist | General choice helper |
| `custom` | Custom | Custom agent type |

### Validate Platform Type Trigger

The SQL trigger function enforces valid endpoint_type → platform_type combinations:

```sql
CREATE OR REPLACE FUNCTION validate_platform_type()
RETURNS trigger LANGUAGE plpgsql AS $function$
BEGIN
    IF NEW.endpoint_type = 'W' AND NEW.platform_type NOT IN ('CO','CP','WP','WW','SH','CL','S3','LM','L3') THEN
        RAISE EXCEPTION 'Invalid platform_type % for W. Valid: CO,CP,WP,WW,SH,CL,S3,LM,L3', NEW.platform_type;
    END IF;
    IF NEW.endpoint_type = 'A' AND NEW.platform_type NOT IN ('CL','GP','GM','CA','OT') THEN
        RAISE EXCEPTION 'Invalid platform_type % for A. Valid: CL,GP,GM,CA,OT', NEW.platform_type;
    END IF;
    IF NEW.endpoint_type = 'D' AND NEW.platform_type NOT IN ('RD','DY','S3','GIT','TPD') THEN
        RAISE EXCEPTION 'Invalid platform_type % for D. Valid: RD,DY,S3,GIT,TPD', NEW.platform_type;
    END IF;
    IF NEW.endpoint_type = 'N' AND NEW.platform_type NOT IN ('W3G','API','RDH','W3S','LLM','OTH') THEN
        RAISE EXCEPTION 'Invalid platform_type % for N. Valid: W3G,API,RDH,W3S,LLM,OTH', NEW.platform_type;
    END IF;
    IF NEW.endpoint_type = 'I' AND NEW.platform_type NOT IN ('S3B','LMB','SQS','SNS') THEN
        RAISE EXCEPTION 'Invalid platform_type % for I. Valid: S3B,LMB,SQS,SNS', NEW.platform_type;
    END IF;
    IF NEW.endpoint_type = 'O' AND NEW.platform_type NOT IN ('OTH') THEN
        RAISE EXCEPTION 'Invalid platform_type % for O. Valid: OTH', NEW.platform_type;
    END IF;
    RETURN NEW;
END;
$function$;
```

---

## 9. Console Card Allocation Rules

How endpoints map to console pages (from Feb 4 session):

| Console Page | Filter Criteria |
|-------------|----------------|
| **Brochure Sites** | `endpoint_type = 'W'` AND `website_purpose = 'brochure'` |
| **Product Stores** | `endpoint_type = 'W'` AND `website_purpose = 'product_store'` |
| **Domain Stores** | `endpoint_type = 'W'` AND `website_purpose = 'domain_store'` |
| **Client Portals** | `endpoint_type = 'W'` AND `website_purpose = 'portal'` |
| **Shopnet Consoles** | `endpoint_type = 'W'` AND `website_purpose = 'console'` |
| **AI Agents** | `endpoint_type = 'A'` |
| **Databases** | `endpoint_type = 'D'` |
| **Web3 Gateways** | `endpoint_type = 'N'` AND `platform_type = 'W3G'` |
| **Network Nodes** | `endpoint_type = 'N'` AND `platform_type != 'W3G'` |
| **Infrastructure** | `endpoint_type = 'I'` |

---

## 10. Pulse Health Check Method Mapping

Defined in `console.js` function `getPulseMethod()` (line 3828). Determines which health check method is used for each endpoint based on its type and platform.

| endpoint_type | platform_type | Pulse Method | Description |
|---------------|---------------|-------------|-------------|
| W | W3 | `http_web3` | Web3 domain — gateway resolution check |
| W | CO, CL | `http_ondemand` | Lambda-based — on-demand check |
| W | SH, WP, WW | `http_store` | External stores — store check |
| W | CP, S3, LM (default) | `http` | Persistent sites — standard HTTP |
| A | (all) | `agent` | AI Agents |
| D | RD | `db` | RDS database connection check |
| D | GIT | `github` | GitHub repository check |
| D | S3 | `fileserver` | S3 fileserver — pulse.json check |
| D | DY, TPD (default) | `api` | API check |
| N | (all) | `api` | Network nodes — API Gateway check |
| I | (all) | `api` | Infrastructure — API check |

**Source:** `console.js` lines 3828-3846 (`getPulseMethod()`)

---

## Next Steps

1. **Resolve store_checkout discrepancy** — Is it Y/N (Doc 26) or affiliate/checkout/both/none (Master)?
2. **Update Document 26** to v5.0 with all Feb 4 changes
3. **Update Deathstar Master** section 21.2.2
4. **Update Deathstar LITE** section 2
5. **Verify RDS** CHECK constraint and seed data
6. **Migrate existing ND records** in RDS to N, I, or O
7. **Sync library copies** after primary updates

---

**This document was compiled by cross-referencing all governance documents, the Deathstar Master, and the active Claude session (9c49eaff) where the Feb 4 taxonomy changes were implemented.**

**System sources of truth referenced:**
- `console.js` PLATFORM_OPTIONS — `/shopnet.network-console/static/js/console.js:3783-3824`
- `console.js` getPulseMethod() — `/shopnet.network-console/static/js/console.js:3828-3846`
- `console.js` populateConfirmation() typeLabels — `/shopnet.network-console/static/js/console.js:4185`
- `console.js` submitEndpointWizard() section mapping — `/shopnet.network-console/static/js/console.js:4213-4235`
- `update-taxonomy-v3.5.sql` — `/shopnet.network-console/scripts/update-taxonomy-v3.5.sql` (complete file)
- `taxonomy_definition` table — `shopnet_sites` RDS database (created by SQL above)
- `endpoint_taxonomy` table — `shopnet_sites` RDS database (CHECK constraint + trigger validation)
- `validate_platform_type()` trigger — `shopnet_sites` RDS database (enforces Level 1→Level 2 mapping)
- Console GUI "This Is The Law" panel — `/shopnet.network-console/static/index.html:3874-4720+` (SND namespace governance page, built from Doc 47, Feb 6 2026)
