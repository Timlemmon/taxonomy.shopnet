# THIS IS THE LAW v4.0
**Updated:** February 6, 2026


**Declared:** January 24, 2026
**Updated:** February 6, 2026
**Authority:** TJL
**Version:** 4.0

---

## Table of Contents

### PART I: site_uid
1. [Core Principle](#i1-core-principle)
2. [site_uid Format](#i2-site_uid-format)
3. [How Site ID Issuance Works](#i3-how-site-id-issuance-works)
4. [Data Source Hierarchy](#i4-data-source-hierarchy)
5. [What Was Wrong](#i5-what-was-wrong)
6. [What Must Be Fixed](#i6-what-must-be-fixed)

### PART II: Site Taxonomy
1. [Taxonomy Hierarchy](#ii1-taxonomy-hierarchy)
2. [Level 1: Endpoint Type](#ii2-level-1-endpoint-type)
3. [Level 2: Platform Type](#ii3-level-2-platform-type)
4. [Universal Fields](#ii4-universal-fields)
5. [Website-Specific Fields](#ii5-website-specific-fields)
6. [Architecture](#ii6-architecture)
7. [Data Storage (RDS Schema)](#ii7-data-storage-rds-schema)
8. [Process Flows](#ii8-process-flows)
9. [Quick Reference](#ii9-quick-reference)
10. [Backup Schedule](#ii10-backup-schedule)

### PART VI: Network Identity Hierarchy (agent_uid)
1. [Two-Level Identity System](#vi1-two-level-identity-system)
2. [agent_uid Format](#vi2-agent_uid-format)
3. [How agent_uid Issuance Works](#vi3-how-agent_uid-issuance-works)
4. [Two-Counter System](#vi4-two-counter-system)
5. [Registered Agent Platforms](#vi5-registered-agent-platforms)
6. [Level Separation Rules](#vi6-level-separation-rules)

---

# THE ZEROTH LAW

> **"THE LAW exists to be re-written to improve and evolve. It exists so that at any given point in time the Entire System is compliant."**
> — Tim, Founder

THE LAW is a living governance framework. It is versioned and evolves as the architecture evolves. When new capabilities, services, or compliance requirements are introduced, THE LAW is updated. All components of the Shopnet Network must comply with the **current version** of THE LAW at all times. No component should reference or operate under an outdated version.

Compliance is not a snapshot — it is continuous.

---

# PART I: site_uid

Every network endpoint in Shopnet receives a **site_uid**. This is THE LAW.

---

## I.1 Core Principle

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                            THE LAW                                      │
│                                                                         │
│   1. Every endpoint gets a site_uid                                     │
│   2. site_uid is assigned ONCE by Connect Gateway                       │
│   3. site_uid NEVER changes for the lifetime of the endpoint            │
│   4. site_uid is NEVER reused, even after deletion                      │
│   5. site_uid is the primary key for ALL cross-system references        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Banned Terminology

The use of the words **"gold"** or **"golden"** with respect to databases is **BANNED** due to confusion experienced. Do not use these terms in table names, column names, or documentation.

---

## I.2 site_uid Format

| Attribute | Value |
|-----------|-------|
| **Field Name** | `site_uid` |
| **Type** | VARCHAR(12) |
| **Format** | `SN-XXXXXXXX` |
| **Example** | `SN-00000001`, `SN-00000047` |
| **Required** | YES |
| **Mutable** | NO - NEVER CHANGES |
| **Assigned By** | Connect Gateway ONLY |

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         site_uid FORMAT                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│                    S N - 0 0 0 0 0 0 4 7                                │
│                    ─┬─   ─────────┬─────                                │
│                     │             │                                     │
│                     │             └── 8-digit zero-padded integer       │
│                     │                 (sequential, never reused)        │
│                     │                                                   │
│                     └── Prefix "SN-" (Shopnet)                          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## I.3 How Site ID Issuance Works

When Lambda or Radius are about to setup a new site, they call `create_site_uid()` in shopnet-connect.service.

- `create_site_uid()` generates a new site_uid (SN-XXXXXXXX format)
- `create_site_uid()` writes the site_uid (and creation date) to network-endpoints.json
- `create_site_uid()` returns the site_uid to Lambda or Radius

```
                         CORRECT site_uid FLOW (THE LAW)
                         ────────────────────────────────

  Lambda/Radius              create_site_uid()              network-endpoints.json
       │                  (shopnet-connect)                 (SOURCE OF TRUTH)
       │                        │                               │
       │  "I need a site_uid"   │                               │
       │───────────────────────►│                               │
       │                        │                               │
       │                        │  Generate next SN-XXXXXXXX    │
       │                        │  + creation date              │
       │                        │                               │
       │                        │  INSERT new endpoint record   │
       │                        │──────────────────────────────►│
       │                        │                               │
       │  ◄─── site_uid ────────│                               │
       │       + date_assigned  │                               │
       │                        │                               │
       ▼                        │                               │
  ┌─────────────────────────────┴───────────────────────────────┘
  │
  │  LAMBDA path:                      RADIUS path:
  │  ├── Save site_uid in              ├── Save site_uid in
  │  │   amazon_products.               │   shopnet_sites RDS
  │  │   domains_unused                │
  │  │                                 │
  │  └── Create S3 folder              └── Create S3 folder
  │      SN-XXXXXXXX/                      SN-XXXXXXXX/
```

---

## I.4 Data Source Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           DATA SOURCE HIERARCHY                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │ SOURCE OF TRUTH: network-endpoints.json                                    │ │
│  │ Location: /opt/shopnet/connect-gateway/data/network-endpoints.json         │ │
│  │                                                                            │ │
│  │ Contains:                                                                  │ │
│  │  • All endpoint records with site_uid                                      │ │
│  │  • Infrastructure sections and components                                  │ │
│  │  • Status indicators                                                       │ │
│  │  • Date assigned                                                           │ │
│  │                                                                            │ │
│  │ Feeds: Endpoint Registry GUI table                                         │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│            │                                                                     │
│            │ create_site_uid() creates records here FIRST                        │
│            ▼                                                                     │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │ SECONDARY: shopnet_sites RDS                                               │ │
│  │                                                                            │ │
│  │ Contains:                                                                  │ │
│  │  • Domain configs (moved FROM brochure-sites.json)                         │ │
│  │  • Site build records (for Radius)                                         │ │
│  │  • Additional endpoint info (synced to GUI if needed)                      │ │
│  │                                                                            │ │
│  │ Radius saves site_uid here after getting from create_site_uid()            │ │
│  │                                                                            │ │
│  │ DISASTER RECOVERY: Receives periodic backup of network-endpoints.json      │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │ SECONDARY: amazon_products RDS (domains_unused table)                      │ │
│  │                                                                            │ │
│  │ Lambda saves site_uid here after getting from create_site_uid()            │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │ STORAGE: S3 shopnet-domain-images                                          │ │
│  │                                                                            │ │
│  │ Folder structure uses site_uid: SN-XXXXXXXX/                               │ │
│  │ Created by Lambda or Radius after getting site_uid from create_site_uid()  │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
│  ┌────────────────────────────────────────────────────────────────────────────┐ │
│  │ ❌ DELETE: brochure-sites.json                                             │ │
│  │                                                                            │ │
│  │ This was an old data dump that caused confusion.                           │ │
│  │ Must be deleted. Domain configs go to shopnet_sites RDS.                   │ │
│  └────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## I.5 What Was Wrong

An old data dump of site information called brochure-sites.json was made from the Domains database to make some cards for the Shopnet console GUI. Placeholder data was put in network-endpoints.json to get the project started. This got confused with network-endpoints.json (the actual source of truth).

```
                    WHAT WAS BUILT WRONG
                    ─────────────────────────────────────────

  Lambda                           RDS: shopnet_sites
    │                                     │
    │  get_or_assign_site_uid()           │
    │  (Lambda issues site_uid directly)  │
    │─────────────────────────────────────►│
    │                                     │
    │  ◄─── site_uid from sequence ────────│
    │                                     │

  ⚠️  Connect Gateway NOT involved
  ⚠️  network-endpoints.json has NO site_uid field
  ⚠️  create_site_uid() does not exist
  ⚠️  Documentation in ClaudeNew.md and ARCHITECTURE.md is FALSE
```

---

## I.6 What Must Be Fixed

1. **Create `create_site_uid()`** in shopnet-connect.service
   - New endpoint that generates site_uid
   - Writes to network-endpoints.json
   - Returns site_uid + date to caller

2. **Add site_uid field** to network-endpoints.json components

3. **Modify Lambda** to call `create_site_uid()` instead of issuing site_uid directly

4. **Modify Radius** (when deployed) to call `create_site_uid()`

5. **Migrate domain configs** from brochure-sites.json to shopnet_sites RDS

6. **Delete brochure-sites.json** after migration

7. **Update Endpoint Registry GUI** to show site_uid and date columns

8. **Fix false documentation** in ClaudeNew.md and ARCHITECTURE.md

9. **Disaster Recovery Backup** - Connect Gateway periodically syncs network-endpoints.json to shopnet_sites RDS table

---

# PART II: Site Taxonomy

Every endpoint is classified using a taxonomy hierarchy.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│                    TAXONOMY SOURCE OF TRUTH                             │
│                                                                         │
│   Connect Gateway (network-endpoints.json)                              │
│       → SOURCE OF TRUTH for site_uid issuance                           │
│                                                                         │
│   shopnet_sites RDS (endpoint_taxonomy table)                           │
│       → SOURCE OF TRUTH for taxonomy classification                     │
│       → All taxonomy queries read from here                             │
│       → Console displays data from here                                 │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## II.1 Taxonomy Hierarchy

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         TAXONOMY HIERARCHY                              │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   LEVEL 0: Identity                                                     │
│   ════════════════                                                      │
│   site_uid: SN-00000001                                                 │
│       │                                                                 │
│       │                                                                 │
│   LEVEL 1: Endpoint Type                                                │
│   ══════════════════════                                                │
│       ├── W   (Website)                                                 │
│       ├── A   (Agent)                                                   │
│       ├── D   (Database)                                                │
│       └── ND  (Node)                                                    │
│           │                                                             │
│           │                                                             │
│   LEVEL 2: Platform Type (varies by endpoint_type)                      │
│   ════════════════════════════════════════════════                      │
│       │                                                                 │
│       ├── W:  CO, CP, WP, WW, SH                                        │
│       ├── A:  CL, GP, GM, CU, OT                                        │
│       ├── D:  S3, RD                                                    │
│       └── ND: LM, R53, CF, FN, OT                                       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## II.2 Level 1: Endpoint Type

| Field | `endpoint_type` |
|-------|-----------------|
| **Type** | CHAR(2) |
| **Required** | YES |
| **Mutable** | NO - Set at creation |

### Permitted Values

| Code | Name | Description |
|------|------|-------------|
| `W` | Website | Web pages served to browsers |
| `A` | Agent | AI agent endpoint |
| `D` | Database | Data storage endpoint |
| `ND` | Node | Infrastructure (connectors, APIs, hubs, routing) |

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      ENDPOINT TYPES                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐             │
│   │    W    │    │    A    │    │    D    │    │   ND    │             │
│   │ Website │    │  Agent  │    │Database │    │  Node   │             │
│   └────┬────┘    └────┬────┘    └────┬────┘    └────┬────┘             │
│        │              │              │              │                   │
│        ▼              ▼              ▼              ▼                   │
│   ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐             │
│   │ Brochure│    │ Claude  │    │   S3    │    │ Lambda  │             │
│   │ Portal  │    │   GPT   │    │   RDS   │    │Route53  │             │
│   │ Console │    │ Gemini  │    │         │    │CloudFrt │             │
│   │  Store  │    │ Custom  │    │         │    │Freename │             │
│   └─────────┘    └─────────┘    └─────────┘    └─────────┘             │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## II.3 Level 2: Platform Type

| Field | `platform_type` |
|-------|-----------------|
| **Type** | VARCHAR(3) |
| **Required** | YES |
| **Mutable** | YES (via migration workflow) |

### W (Website)

| Code | Platform | Runtime | Host | Description |
|------|----------|---------|------|-------------|
| `CO` | Custom On-Demand | Lambda | API Gateway | On-demand HTML via Lambda |
| `CP` | Custom Persistent | Nginx | EC2 | Pre-rendered HTML from EC2 |
| `WP` | WordPress | PHP | EC2 | WordPress CMS |
| `WW` | WooCommerce | PHP | EC2 | WordPress + WooCommerce |
| `SH` | Shopify | External | External | Shopify-hosted store |

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    WEBSITE PLATFORM TYPES                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌──────────────────────────────────────────────────────────────┐     │
│   │  CO - Custom On-Demand                                       │     │
│   │  ┌─────────┐     ┌─────────────┐     ┌──────────┐           │     │
│   │  │ Request │────▶│ API Gateway │────▶│  Lambda  │           │     │
│   │  └─────────┘     └─────────────┘     └──────────┘           │     │
│   │                                       Generates HTML         │     │
│   │                                       on each request        │     │
│   └──────────────────────────────────────────────────────────────┘     │
│                                                                         │
│   ┌──────────────────────────────────────────────────────────────┐     │
│   │  CP - Custom Persistent                                      │     │
│   │  ┌─────────┐     ┌─────────────┐     ┌──────────┐           │     │
│   │  │ Request │────▶│ CloudFront  │────▶│  Nginx   │           │     │
│   │  └─────────┘     └─────────────┘     └──────────┘           │     │
│   │                                       Serves pre-rendered    │     │
│   │                                       HTML from filesystem   │     │
│   └──────────────────────────────────────────────────────────────┘     │
│                                                                         │
│   ┌──────────────────────────────────────────────────────────────┐     │
│   │  WP/WW - WordPress/WooCommerce                               │     │
│   │  ┌─────────┐     ┌─────────┐     ┌──────────┐     ┌─────┐   │     │
│   │  │ Request │────▶│  Nginx  │────▶│   PHP    │────▶│ RDS │   │     │
│   │  └─────────┘     └─────────┘     └──────────┘     └─────┘   │     │
│   │                                   Dynamic CMS                │     │
│   └──────────────────────────────────────────────────────────────┘     │
│                                                                         │
│   ┌──────────────────────────────────────────────────────────────┐     │
│   │  SH - Shopify                                                │     │
│   │  ┌─────────┐     ┌─────────────────────────────────────┐    │     │
│   │  │ Request │────▶│        Shopify (External)           │    │     │
│   │  └─────────┘     └─────────────────────────────────────┘    │     │
│   │                   Custom domain points to Shopify            │     │
│   └──────────────────────────────────────────────────────────────┘     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### A (Agent)

| Code | Platform | Provider | Description |
|------|----------|----------|-------------|
| `CL` | Claude | Anthropic | Claude AI agent |
| `GP` | GPT | OpenAI | GPT AI agent |
| `GM` | Gemini | Google | Gemini AI agent |
| `CU` | Custom | - | Custom-built agent |
| `OT` | Other | Various | Other AI provider |

### D (Database)

| Code | Platform | Service | Description |
|------|----------|---------|-------------|
| `S3` | S3 | AWS S3 | Object storage |
| `RD` | RDS | AWS RDS | Relational database |

### ND (Node)

| Code | Platform | Service | Description |
|------|----------|---------|-------------|
| `LM` | Lambda | AWS Lambda | Serverless function |
| `R53` | Route53 | AWS Route53 | DNS service |
| `CF` | CloudFront | AWS CloudFront | CDN |
| `FN` | Freename | Freename | Web3 DNS |
| `OT` | Other | Various | Other infrastructure |

---

## II.4 Universal Fields

These fields apply to ALL endpoint types.

| Field | Type | Values | Required | Mutable | Description |
|-------|------|--------|----------|---------|-------------|
| `site_uid` | VARCHAR(12) | SN-XXXXXXXX | YES | NO | THE LAW |
| `domain_name` | VARCHAR(255) | any | YES | YES | Primary domain/identifier |
| `endpoint_type` | CHAR(2) | W, A, D, ND | YES | NO | Level 1 classification |
| `platform_type` | VARCHAR(3) | varies | YES | YES | Level 2 classification |
| `web_protocol` | CHAR(2) | W2, W3 | YES | NO | DNS protocol |
| `status` | VARCHAR(10) | planned, wip, live | YES | YES | Lifecycle status |
| `runtime` | VARCHAR(20) | lambda, nginx, php, s3, external, n/a | NO | YES | What serves content |
| `host` | VARCHAR(20) | api_gateway, ec2, s3, rds, external | NO | YES | Where it runs |
| `created_at` | TIMESTAMP | - | YES | NO | Creation timestamp |
| `updated_at` | TIMESTAMP | - | YES | YES | Last update timestamp |

### web_protocol

| Code | Name | Description |
|------|------|-------------|
| `W2` | Web2 | Traditional DNS (ICANN TLDs: .com, .net, .io) |
| `W3` | Web3 | Blockchain DNS (.domains, emoji TLDs) |

### status

| Value | Description | Console Display |
|-------|-------------|-----------------|
| `planned` | Registered, not yet started | Gray badge |
| `wip` | Work in progress | Yellow badge |
| `live` | Active and serving | Green badge |

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      ENDPOINT LIFECYCLE                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌──────────┐         ┌──────────┐         ┌──────────┐               │
│   │ PLANNED  │────────▶│   WIP    │────────▶│   LIVE   │               │
│   │          │         │          │         │          │               │
│   │ ○ Gray   │         │ ○ Yellow │         │ ○ Green  │               │
│   └──────────┘         └──────────┘         └──────────┘               │
│        │                                          │                     │
│        │                                          │                     │
│        │    ┌──────────────────────────┐         │                     │
│        └───▶│        DELETED           │◀────────┘                     │
│             │   (site_uid preserved)   │                               │
│             │   (never reused)         │                               │
│             └──────────────────────────┘                               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## II.5 Website-Specific Fields

These fields ONLY apply when `endpoint_type = 'W'`.

| Field | Type | Values | Required | Mutable | Description |
|-------|------|--------|----------|---------|-------------|
| `managed_by` | CHAR(1) | L, R, M, null | NO | YES | Management application |
| `persistence` | CHAR(1) | D, P | NO | YES | On-Demand or Persistent |
| `website_purpose` | VARCHAR(20) | see below | NO | YES | Level 3 classification |
| `store_checkout` | CHAR(1) | Y, N | NO | YES | Has e-commerce checkout |

### managed_by

| Code | Name | Description |
|------|------|-------------|
| `L` | Lambda | Managed by Lambda management system |
| `R` | Radius | Managed by Radius workflow engine |
| `M` | Manual | Manually managed (external platforms) |
| `null` | None | No automated management |

### persistence

| Code | Name | Description |
|------|------|-------------|
| `D` | On-Demand | Content generated at request time |
| `P` | Persistent | Content pre-rendered and stored |

### website_purpose

| Value | Description |
|-------|-------------|
| `brochure` | Informational/marketing site |
| `product_store` | Product showcase/store |
| `domain_store` | Domain name marketplace |
| `portal` | User portal/dashboard |
| `console` | Admin console/management interface |
| `other` | Other purpose |

### store_checkout

| Value | Description |
|-------|-------------|
| `Y` | Has shopping cart and checkout |
| `N` | No e-commerce transaction capability |

---

## II.6 Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        SHOPNET ARCHITECTURE                             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│                         ┌─────────────────┐                             │
│                         │   THIS IS THE   │                             │
│                         │      LAW        │                             │
│                         │                 │                             │
│                         │ Defines valid   │                             │
│                         │ taxonomy values │                             │
│                         └────────┬────────┘                             │
│                                  │                                      │
│                                  ▼                                      │
│   ┌──────────────────────────────────────────────────────────────┐     │
│   │                    RADIUS (EC2)                              │     │
│   │                                                              │     │
│   │   ┌────────────────────────────────────────────────────┐    │     │
│   │   │                  RADIUS GUI                        │    │     │
│   │   │  ┌──────────┐  ┌──────────┐  ┌──────────┐         │    │     │
│   │   │  │  Wizard  │  │  Manual  │  │   API    │         │    │     │
│   │   │  │   Mode   │  │   Form   │  │   Mode   │         │    │     │
│   │   │  └──────────┘  └──────────┘  └──────────┘         │    │     │
│   │   └────────────────────────────────────────────────────┘    │     │
│   │                          │                                   │     │
│   │   ┌────────────────────────────────────────────────────┐    │     │
│   │   │              RADIUS BACKEND                        │    │     │
│   │   │                                                    │    │     │
│   │   │  1. Validate taxonomy against THE LAW             │    │     │
│   │   │  2. Request site_uid from Connect Gateway         │    │     │
│   │   │  3. Create endpoint_taxonomy record in RDS        │    │     │
│   │   │  4. IF managed_by = R: Execute provisioning       │    │     │
│   │   │                                                    │    │     │
│   │   └────────────────────┬───────────────────────────────┘    │     │
│   │                        │                                     │     │
│   └────────────────────────│─────────────────────────────────────┘     │
│                            │                                            │
│              ┌─────────────┴─────────────┐                              │
│              │                           │                              │
│              ▼                           ▼                              │
│   ┌─────────────────────┐     ┌─────────────────────┐                  │
│   │  CONNECT GATEWAY    │     │   RDS (PostgreSQL)  │                  │
│   │  (Port 8000)        │     │   shopnet_sites     │                  │
│   │                     │     │                     │                  │
│   │  network-endpoints  │     │  endpoint_taxonomy  │                  │
│   │  .json              │     │  website_data       │                  │
│   │                     │     │                     │                  │
│   │  SOURCE OF TRUTH:   │     │  SOURCE OF TRUTH:   │                  │
│   │  - site_uid issue   │     │  - Taxonomy data    │                  │
│   │                     │     │  - Console queries  │                  │
│   │                     │     │  - All filtering    │                  │
│   └─────────────────────┘     └─────────────────────┘                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Responsibility Matrix

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     RESPONSIBILITY MATRIX                               │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌───────────────────┬───────────────────────────────────────────┐    │
│   │ Component         │ Responsibility                            │    │
│   ├───────────────────┼───────────────────────────────────────────┤    │
│   │ THIS IS THE LAW   │ DEFINES valid taxonomy values             │    │
│   │ (this document)   │ DEFINES field constraints                 │    │
│   │                   │ DEFINES validation rules                  │    │
│   ├───────────────────┼───────────────────────────────────────────┤    │
│   │ Radius GUI        │ PRESENTS taxonomy forms to users          │    │
│   │                   │ VALIDATES input before submission         │    │
│   │                   │ INITIATES all endpoint operations         │    │
│   ├───────────────────┼───────────────────────────────────────────┤    │
│   │ Radius Backend    │ REQUESTS site_uid from Connect Gateway    │    │
│   │                   │ WRITES to RDS (endpoint_taxonomy)         │    │
│   │                   │ PROVISIONS websites (if managed_by=R)     │    │
│   ├───────────────────┼───────────────────────────────────────────┤    │
│   │ Connect Gateway   │ ASSIGNS site_uid (THE LAW)                │    │
│   │                   │ STORES reference in network-endpoints.json│    │
│   │                   │ NEVER reuses site_uid                     │    │
│   ├───────────────────┼───────────────────────────────────────────┤    │
│   │ RDS               │ SOURCE OF TRUTH for taxonomy              │    │
│   │ (shopnet_sites)   │ STORES endpoint_taxonomy (classifications)│    │
│   │                   │ STORES website_data (operational data)    │    │
│   │                   │ SERVES Console display/filtering          │    │
│   │                   │ ALL taxonomy queries read from here       │    │
│   └───────────────────┴───────────────────────────────────────────┘    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## II.7 Data Storage (RDS Schema)

### site_uid Storage in Connect Gateway

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    site_uid STORAGE                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   CONNECT GATEWAY (Port 8000) ◄───── SOURCE OF TRUTH                    │
│   ═══════════════════════════                                           │
│                                                                         │
│   network-endpoints.json                                                │
│   ┌─────────────────────────────────────────────────────────────┐      │
│   │ {                                                           │      │
│   │   "next_site_uid": 48,        ◄─── Sequence counter         │      │
│   │   "endpoints": [                                            │      │
│   │     {                                                       │      │
│   │       "site_uid": "SN-00000001",                            │      │
│   │       "domain": "shopnet.ai",                               │      │
│   │       "assigned_at": "2025-01-01T00:00:00Z"                 │      │
│   │     },                                                      │      │
│   │     {                                                       │      │
│   │       "site_uid": "SN-00000047",                            │      │
│   │       "domain": "shop.it.com",                              │      │
│   │       "assigned_at": "2026-01-20T00:00:00Z"                 │      │
│   │     }                                                       │      │
│   │   ]                                                         │      │
│   │ }                                                           │      │
│   └─────────────────────────────────────────────────────────────┘      │
│                                                                         │
│   Rules:                                                                │
│   • Connect Gateway is the ONLY issuer of site_uid                      │
│   • Sequence increments, never decrements                               │
│   • Deleted endpoints remain in list (preserves history)                │
│   • site_uid is NEVER reused                                            │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### RDS Schema (Two Tables) - SOURCE OF TRUTH FOR TAXONOMY

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        RDS SCHEMA                                       │
│              shopnet_sites database (PostgreSQL)                        │
│              ═══════════════════════════════════                        │
│              SOURCE OF TRUTH for all taxonomy data                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   TABLE 1: endpoint_taxonomy                                            │
│   ══════════════════════════                                            │
│   Purpose: Clean taxonomy data for Console queries (SOURCE OF TRUTH)    │
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────┐      │
│   │ endpoint_taxonomy                                           │      │
│   ├─────────────────────────────────────────────────────────────┤      │
│   │ site_uid         VARCHAR(12)  PRIMARY KEY   -- THE LAW      │      │
│   │ domain_name      VARCHAR(255) NOT NULL                      │      │
│   │ endpoint_type    CHAR(2)      NOT NULL      -- W,A,D,ND     │      │
│   │ platform_type    VARCHAR(3)   NOT NULL      -- CO,CP,CL...  │      │
│   │ web_protocol     CHAR(2)      NOT NULL      -- W2,W3        │      │
│   │ status           VARCHAR(10)  NOT NULL      -- planned,wip..│      │
│   │ runtime          VARCHAR(20)                                │      │
│   │ host             VARCHAR(20)                                │      │
│   │ -- Website-specific (nullable) ──────────────────────────── │      │
│   │ managed_by       CHAR(1)                    -- L,R,M        │      │
│   │ persistence      CHAR(1)                    -- D,P          │      │
│   │ website_purpose  VARCHAR(20)                                │      │
│   │ store_checkout   CHAR(1)                    -- Y,N          │      │
│   │ -- Timestamps ───────────────────────────────────────────── │      │
│   │ created_at       TIMESTAMP    NOT NULL                      │      │
│   │ updated_at       TIMESTAMP    NOT NULL                      │      │
│   └─────────────────────────────────────────────────────────────┘      │
│                                                                         │
│                              │                                          │
│                              │ FK: site_uid                             │
│                              ▼                                          │
│                                                                         │
│   TABLE 2: website_data (endpoint_type = 'W' only)                      │
│   ════════════════════════════════════════════════                      │
│   Purpose: Operational data for website provisioning                    │
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────┐      │
│   │ website_data                                                │      │
│   ├─────────────────────────────────────────────────────────────┤      │
│   │ site_uid         VARCHAR(12)  PRIMARY KEY   -- FK           │      │
│   │ template_id      VARCHAR(50)                                │      │
│   │ site_content     JSONB                                      │      │
│   │ html_s3_path     VARCHAR(255)                               │      │
│   │ build_status     VARCHAR(20)                                │      │
│   │ build_error      TEXT                                       │      │
│   │ -- Infrastructure status ────────────────────────────────── │      │
│   │ dns_status       VARCHAR(20)                                │      │
│   │ ssl_status       VARCHAR(20)                                │      │
│   │ cloudfront_id    VARCHAR(50)                                │      │
│   │ cloudfront_domain VARCHAR(255)                              │      │
│   │ route53_zone_id  VARCHAR(50)                                │      │
│   │ acm_cert_arn     VARCHAR(255)                               │      │
│   │ -- Timestamps ───────────────────────────────────────────── │      │
│   │ last_build_at    TIMESTAMP                                  │      │
│   │ last_deploy_at   TIMESTAMP                                  │      │
│   └─────────────────────────────────────────────────────────────┘      │
│                                                                         │
│                                                                         │
│   QUERY PATTERNS:                                                       │
│                                                                         │
│   Console (filtering/display):                                          │
│   ┌─────────────────────────────────────────────────────────────┐      │
│   │ SELECT * FROM endpoint_taxonomy                             │      │
│   │ WHERE endpoint_type = 'W'                                   │      │
│   │   AND status = 'live'                                       │      │
│   │ ORDER BY domain_name;                                       │      │
│   └─────────────────────────────────────────────────────────────┘      │
│                                                                         │
│   Radius (provisioning):                                                │
│   ┌─────────────────────────────────────────────────────────────┐      │
│   │ SELECT t.*, w.*                                             │      │
│   │ FROM endpoint_taxonomy t                                    │      │
│   │ JOIN website_data w ON t.site_uid = w.site_uid              │      │
│   │ WHERE t.site_uid = 'SN-00000047';                           │      │
│   └─────────────────────────────────────────────────────────────┘      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## II.8 Process Flows

### Flow 1: Create New Website (Managed by Radius)

```
┌─────────────────────────────────────────────────────────────────────────┐
│              FLOW: Create New Website (managed_by = R)                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   USER                          RADIUS                    CONNECT GW    │
│    │                              │                           │         │
│    │  1. Open Radius GUI          │                           │         │
│    │─────────────────────────────▶│                           │         │
│    │                              │                           │         │
│    │  2. Select endpoint_type: W  │                           │         │
│    │─────────────────────────────▶│                           │         │
│    │                              │                           │         │
│    │  3. Fill taxonomy form:      │                           │         │
│    │     - platform_type: CP      │                           │         │
│    │     - domain: shop.it.com    │                           │         │
│    │     - managed_by: R          │                           │         │
│    │     - persistence: P         │                           │         │
│    │     - purpose: brochure      │                           │         │
│    │─────────────────────────────▶│                           │         │
│    │                              │                           │         │
│    │  4. Submit                   │                           │         │
│    │─────────────────────────────▶│                           │         │
│    │                              │                           │         │
│    │                              │  5. Request site_uid      │         │
│    │                              │─────────────────────────▶│         │
│    │                              │                           │         │
│    │                              │  6. site_uid: SN-00000048 │         │
│    │                              │◀─────────────────────────│         │
│    │                              │                           │         │
│    │                              │  7. INSERT endpoint_taxonomy        │
│    │                              │     (site_uid + all taxonomy)       │
│    │                              │─────────────────────────▶ RDS       │
│    │                              │                                     │
│    │                              │  8. INSERT website_data             │
│    │                              │     (site_uid + operational data)   │
│    │                              │─────────────────────────▶ RDS       │
│    │                              │                                     │
│    │                              │  9. Execute workflow (R, CREATE)    │
│    │                              │     - Render HTML                   │
│    │                              │     - Deploy to Nginx               │
│    │                              │     - Setup Route53                 │
│    │                              │     - Request ACM cert              │
│    │                              │     - Setup CloudFront              │
│    │                              │                                     │
│    │                              │  10. UPDATE status = 'live'         │
│    │                              │─────────────────────────▶ RDS       │
│    │                              │                           │         │
│    │  11. Success: SN-00000048    │                           │         │
│    │◀─────────────────────────────│                           │         │
│    │                              │                           │         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Flow 2: Register Database Endpoint (Manual)

```
┌─────────────────────────────────────────────────────────────────────────┐
│              FLOW: Register Database Endpoint                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   USER                          RADIUS                    CONNECT GW    │
│    │                              │                           │         │
│    │  1. Open Radius GUI          │                           │         │
│    │─────────────────────────────▶│                           │         │
│    │                              │                           │         │
│    │  2. Select endpoint_type: D  │                           │         │
│    │─────────────────────────────▶│                           │         │
│    │                              │                           │         │
│    │  3. Fill taxonomy form:      │                           │         │
│    │     - platform_type: RD      │                           │         │
│    │     - name: shopnet-sites    │                           │         │
│    │     - status: live           │                           │         │
│    │─────────────────────────────▶│                           │         │
│    │                              │                           │         │
│    │  4. Submit                   │                           │         │
│    │─────────────────────────────▶│                           │         │
│    │                              │                           │         │
│    │                              │  5. Request site_uid      │         │
│    │                              │─────────────────────────▶│         │
│    │                              │                           │         │
│    │                              │  6. site_uid: SN-00000049 │         │
│    │                              │◀─────────────────────────│         │
│    │                              │                           │         │
│    │                              │  7. INSERT endpoint_taxonomy        │
│    │                              │     (site_uid + taxonomy)           │
│    │                              │─────────────────────────▶ RDS       │
│    │                              │                                     │
│    │                              │  8. NO PROVISIONING                 │
│    │                              │     (Database already exists,       │
│    │                              │      this just registers it)        │
│    │                              │                           │         │
│    │  9. Success: SN-00000049     │                           │         │
│    │◀─────────────────────────────│                           │         │
│    │                              │                           │         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Flow 3: Console Display

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    FLOW: Console Display                                │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   CONSOLE                                              RDS              │
│    │                                                    │               │
│    │  1. User opens Endpoint Registry                   │               │
│    │                                                    │               │
│    │  2. Query endpoint_taxonomy                        │               │
│    │───────────────────────────────────────────────────▶│               │
│    │                                                    │               │
│    │  SELECT site_uid, domain_name, endpoint_type,      │               │
│    │         platform_type, status, website_purpose     │               │
│    │  FROM endpoint_taxonomy                            │               │
│    │  ORDER BY status, domain_name                      │               │
│    │                                                    │               │
│    │  3. Results                                        │               │
│    │◀───────────────────────────────────────────────────│               │
│    │                                                    │               │
│    │  4. Render table:                                                  │
│    │  ┌──────────────┬────────┬────────┬────────┬────────────────┐     │
│    │  │ Domain       │ Type   │Platform│ Status │ Purpose        │     │
│    │  ├──────────────┼────────┼────────┼────────┼────────────────┤     │
│    │  │ shopnet.ai   │ W      │ CP     │ ● live │ console        │     │
│    │  │ shop.it.com  │ W      │ CP     │ ○ wip  │ brochure       │     │
│    │  │ myagent.ai   │ A      │ CL     │ ● live │ -              │     │
│    │  │ sites-rds    │ D      │ RD     │ ● live │ -              │     │
│    │  └──────────────┴────────┴────────┴────────┴────────────────┘     │
│    │                                                                    │
│    │  5. User filters by endpoint_type = 'W'                           │
│    │                                                                    │
│    │  6. Query with filter                              │               │
│    │───────────────────────────────────────────────────▶│               │
│    │                                                    │               │
│    │  SELECT ... WHERE endpoint_type = 'W'              │               │
│    │                                                    │               │
│    │  7. Filtered results                               │               │
│    │◀───────────────────────────────────────────────────│               │
│    │                                                    │               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## II.9 Quick Reference

### Complete Field Matrix

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      FIELD MATRIX                                       │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│                           ENDPOINT TYPE                                 │
│                    ┌────────┬────────┬────────┬────────┐               │
│   FIELD           │   W    │   A    │   D    │   ND   │               │
│   ────────────────┼────────┼────────┼────────┼────────┤               │
│   site_uid        │   ✓    │   ✓    │   ✓    │   ✓    │   Universal   │
│   domain_name     │   ✓    │   ✓    │   ✓    │   ✓    │   Universal   │
│   endpoint_type   │   ✓    │   ✓    │   ✓    │   ✓    │   Universal   │
│   platform_type   │   ✓    │   ✓    │   ✓    │   ✓    │   Universal   │
│   web_protocol    │   ✓    │   ✓    │   ✓    │   ✓    │   Universal   │
│   status          │   ✓    │   ✓    │   ✓    │   ✓    │   Universal   │
│   runtime         │   ✓    │   ✓    │   ✓    │   ✓    │   Universal   │
│   host            │   ✓    │   ✓    │   ✓    │   ✓    │   Universal   │
│   ────────────────┼────────┼────────┼────────┼────────┤               │
│   managed_by      │   ✓    │   -    │   -    │   -    │   W only      │
│   persistence     │   ✓    │   -    │   -    │   -    │   W only      │
│   website_purpose │   ✓    │   -    │   -    │   -    │   W only      │
│   store_checkout  │   ✓    │   -    │   -    │   -    │   W only      │
│                    └────────┴────────┴────────┴────────┘               │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Platform Type by Endpoint Type

```
┌─────────────────────────────────────────────────────────────────────────┐
│                 PLATFORM TYPE REFERENCE                                 │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   W (Website)                                                           │
│   ├── CO  Custom On-Demand     (Lambda + API Gateway)                   │
│   ├── CP  Custom Persistent    (Nginx + EC2)                            │
│   ├── WP  WordPress            (PHP + EC2)                              │
│   ├── WW  WooCommerce          (PHP + EC2)                              │
│   └── SH  Shopify              (External)                               │
│                                                                         │
│   A (Agent)                                                             │
│   ├── CL  Claude               (Anthropic)                              │
│   ├── GP  GPT                  (OpenAI)                                 │
│   ├── GM  Gemini               (Google)                                 │
│   ├── CU  Custom               (Custom-built)                           │
│   └── OT  Other                (Other provider)                         │
│                                                                         │
│   D (Database)                                                          │
│   ├── S3  S3                   (AWS Object Storage)                     │
│   └── RD  RDS                  (AWS Relational Database)                │
│                                                                         │
│   ND (Node)                                                             │
│   ├── LM  Lambda               (AWS Lambda)                             │
│   ├── R53 Route53              (AWS DNS)                                │
│   ├── CF  CloudFront           (AWS CDN)                                │
│   ├── FN  Freename             (Web3 DNS)                               │
│   └── OT  Other                (Other infrastructure)                   │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Taxonomy Tree

```
site_uid (THE LAW)
    │
    ├── endpoint_type
    │       │
    │       ├── W (Website)
    │       │       ├── platform_type: CO, CP, WP, WW, SH
    │       │       ├── managed_by: L, R, M
    │       │       ├── persistence: D, P
    │       │       ├── website_purpose: brochure, product_store, domain_store, portal, console
    │       │       └── store_checkout: Y, N
    │       │
    │       ├── A (Agent)
    │       │       └── platform_type: CL, GP, GM, CU, OT
    │       │
    │       ├── D (Database)
    │       │       └── platform_type: S3, RD
    │       │
    │       └── ND (Node)
    │               └── platform_type: LM, R53, CF, FN, OT
    │
    ├── web_protocol: W2, W3
    │
    └── status: planned, wip, live
```

---

## II.10 Backup Schedule

The shopnet_sites RDS database has a comprehensive backup strategy:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        BACKUP SCHEDULE                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   TYPE        FREQUENCY                RETENTION    METHOD              │
│   ────────────────────────────────────────────────────────────────────  │
│                                                                         │
│   Daily       Every day 09:45-10:15    7 days       RDS Automated       │
│               UTC                      (rolling)    Snapshots           │
│                                                                         │
│   Monthly     1st of month 10:00 UTC   90 days      AWS Backup Service  │
│                                        (3 months)                       │
│                                                                         │
│   Hourly      Every hour at :00        Versioned    Connect Gateway →   │
│                                        in RDS       json_backup table   │
│                                                                         │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   POINT-IN-TIME RECOVERY                                                │
│   ══════════════════════                                                │
│   Available for last 7 days via RDS automated backups.                  │
│   Can restore to any second within that window.                         │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   AWS RESOURCES                                                         │
│   ═════════════                                                         │
│   • RDS Instance: amazon-products-db-1754023596                         │
│   • Backup Vault: shopnet-monthly-backups                               │
│   • Backup Plan: shopnet-rds-monthly                                    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Hourly JSON Backup Details

Connect Gateway runs an hourly cron job that:

1. Reads `network-endpoints.json` (source of truth)
2. Parses and writes individual records to `json_backup` table

```
Cron: 0 * * * * curl -X POST http://127.0.0.1:8000/api/v1/network-json/backup
```

This ensures `json_backup` stays synchronized with the JSON file and provides queryable backup data for the Console (url, label, notes fields used in JOINs with endpoint_taxonomy).

---

# PART III: Data Flows & Backup

This section defines exactly where data lives, how it flows, and how it's backed up.

---

## III.1 What Happens NOW (Current Code Behavior)

Based on actual code analysis of Connect Gateway and Console:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    WHAT HAPPENS NOW (Jan 24, 2026)                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ENDPOINT REGISTRY TABLE (Console GUI)                                 │
│   ══════════════════════════════════════                                │
│   Current Source: GET /api/v1/endpoints (Connect Gateway)               │
│   Code: shopnet_connect_api.py → list_endpoints()                       │
│                                                                         │
│   What happens:                                                         │
│   1. Connect Gateway reads from IN-MEMORY ENDPOINT_REGISTRY dict        │
│   2. Enriches with site_uid from amazon_products.domains_unused         │
│   3. Returns: domain_name, s3_folder, sync_status, license_key          │
│                                                                         │
│   ⚠️  Problems:                                                          │
│   - Data is IN-MEMORY only (lost on restart)                            │
│   - site_uid comes from wrong source (amazon_products, not Connect GW)  │
│   - No taxonomy fields (endpoint_type, platform_type, etc.)             │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   SITE CARDS (Console GUI - Brochure Sites)                             │
│   ═══════════════════════════════════════════                           │
│   Current Source: brochure-sites.json (static file)                     │
│   Code: console.js → loadBrochureSites()                                │
│                                                                         │
│   What happens:                                                         │
│   1. Console fetches /data/brochure-sites.json directly                 │
│   2. Renders cards from static JSON dump                                │
│   3. No live status, no site_uid, no taxonomy                           │
│                                                                         │
│   ⚠️  Problems:                                                          │
│   - Data is STALE (old dump from products database)                     │
│   - brochure-sites.json should be DELETED per THE LAW                   │
│   - No connection to RDS or network-endpoints.json                      │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   NETWORK MAP (Console GUI)                                             │
│   ══════════════════════════                                            │
│   Current Source: GET /api/v1/network/status (Connect Gateway)          │
│   Code: shopnet_connect_api.py → get_network_status()                   │
│                                                                         │
│   What happens:                                                         │
│   1. Connect Gateway reads network-endpoints.json                       │
│   2. Evaluates dynamic:db markers for live status                       │
│   3. Returns sections with components and connectors                    │
│   4. Cached for 10 seconds                                              │
│                                                                         │
│   ✓ This works correctly but:                                           │
│   - Components have NO site_uid field                                   │
│   - No taxonomy fields in the JSON                                      │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   SITE_UID CREATION (When new site created)                             │
│   ═════════════════════════════════════════                             │
│   Current Source: Lambda issues directly from RDS sequence              │
│   Code: Lambda's get_or_assign_site_uid() in domains_unused             │
│                                                                         │
│   What happens NOW (WRONG):                                             │
│   1. Lambda checks domains_unused.site_uid in amazon_products RDS       │
│   2. If null, Lambda generates SN-XXXXXXXX from shopnet_site_seq        │
│   3. Lambda writes to amazon_products.domains_unused                    │
│   4. Connect Gateway is NOT involved                                    │
│   5. network-endpoints.json is NOT updated                              │
│                                                                         │
│   ⚠️  This violates THE LAW:                                             │
│   - Connect Gateway should be ONLY issuer of site_uid                   │
│   - network-endpoints.json should be written FIRST                      │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   BACKUP (Current - Jan 2026)                                           │
│   ═══════════════════════════                                           │
│   Current: POST /api/v1/network-json/backup (hourly cron)               │
│   Code: shopnet_connect_api.py → sync_json_backup()                     │
│                                                                         │
│   What happens:                                                         │
│   1. Reads network-endpoints.json                                       │
│   2. Parses each component with site_uid                                │
│   3. UPSERTs individual records to json_backup table                    │
│   4. Records: site_uid, url, label, notes, section, json_data           │
│                                                                         │
│   Purpose:                                                              │
│   - json_backup provides queryable fields for Console JOINs             │
│   - Full database backup via RDS automated snapshots (daily/monthly)    │
│   - No separate blob table needed                                       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## III.2 What SHOULD Happen (After Taxonomy & Radius Implementation)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    WHAT SHOULD HAPPEN (Target State)                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ENDPOINT REGISTRY TABLE (Console GUI)                                 │
│   ══════════════════════════════════════                                │
│   Target Source: GET /api/v1/taxonomy/endpoints (Connect Gateway)       │
│   Reads From: RDS endpoint_taxonomy table                               │
│                                                                         │
│   What should happen:                                                   │
│   1. Connect Gateway queries endpoint_taxonomy table in RDS             │
│   2. Returns ALL taxonomy fields:                                       │
│      site_uid, domain_name, endpoint_type, platform_type,               │
│      web_protocol, status, managed_by, persistence, website_purpose     │
│   3. Console renders table with filters by type/platform/status         │
│                                                                         │
│   Changes needed:                                                       │
│   - Create endpoint_taxonomy table in shopnet_sites RDS                 │
│   - Add /api/v1/taxonomy/endpoints endpoint to Connect Gateway          │
│   - Update Console to call new endpoint                                 │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   SITE CARDS (Console GUI - Brochure Sites)                             │
│   ═══════════════════════════════════════════                           │
│   Target Source: GET /api/v1/sites/cards?endpoint_type=W                │
│   Reads From: RDS endpoint_taxonomy + website_data (joined)             │
│                                                                         │
│   What should happen:                                                   │
│   1. Connect Gateway queries:                                           │
│      SELECT t.*, w.* FROM endpoint_taxonomy t                           │
│      LEFT JOIN website_data w ON t.site_uid = w.site_uid                │
│      WHERE t.endpoint_type = 'W'                                        │
│   2. Returns: domain, status badge, purpose, platform, preview, link    │
│   3. Console renders cards grouped by purpose                           │
│                                                                         │
│   Changes needed:                                                       │
│   - Delete brochure-sites.json                                          │
│   - Create website_data table in shopnet_sites RDS                      │
│   - Add /api/v1/sites/cards endpoint to Connect Gateway                 │
│   - Update Console to call new endpoint                                 │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   NETWORK MAP (Console GUI) - NO CHANGE NEEDED                          │
│   ══════════════════════════════════════════════                        │
│   Source: GET /api/v1/network/status (same as now)                      │
│   Reads From: network-endpoints.json (live status)                      │
│                                                                         │
│   This continues to work for live component status.                     │
│   BUT: Add site_uid field to each component in JSON.                    │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   SITE_UID CREATION (When new site created via Radius)                  │
│   ════════════════════════════════════════════════════                  │
│   Target: Radius calls Connect Gateway → create_site_uid()              │
│                                                                         │
│   What should happen:                                                   │
│                                                                         │
│   Step 1: Radius requests site_uid                                      │
│   ─────────────────────────────────                                     │
│   POST /api/v1/endpoints/create-site-uid                                │
│   Body: { "domain_name": "shop.it.com" }                                │
│                                                                         │
│   Step 2: Connect Gateway generates                                     │
│   ───────────────────────────────────                                   │
│   - Read next_site_uid from network-endpoints.json metadata             │
│   - Generate: SN-{next:08d}                                             │
│   - Increment next_site_uid                                             │
│                                                                         │
│   Step 3: Connect Gateway writes to network-endpoints.json              │
│   ─────────────────────────────────────────────────────────             │
│   Add to endpoints array:                                               │
│   {                                                                     │
│     "site_uid": "SN-00000048",                                          │
│     "domain": "shop.it.com",                                            │
│     "assigned_at": "2026-01-24T10:30:00Z",                              │
│     "status": "grey"                                                    │
│   }                                                                     │
│                                                                         │
│   Step 4: Connect Gateway writes to shopnet_site_index RDS              │
│   ─────────────────────────────────────────────────────────             │
│   INSERT INTO shopnet_site_index                                        │
│   (site_uid, domain_name, assigned_at, assigned_by, status)             │
│   VALUES ('SN-00000048', 'shop.it.com', NOW(), 'radius', 'assigned')    │
│                                                                         │
│   Step 5: Connect Gateway returns to Radius                             │
│   ──────────────────────────────────────────                            │
│   { "site_uid": "SN-00000048", "assigned_at": "2026-01-24T10:30:00Z" }  │
│                                                                         │
│   Step 6: Radius writes taxonomy to RDS                                 │
│   ─────────────────────────────────────                                 │
│   INSERT INTO endpoint_taxonomy                                         │
│   (site_uid, domain_name, endpoint_type, platform_type, status, ...)    │
│                                                                         │
│   Step 7: Radius writes website_data to RDS (if endpoint_type = W)      │
│   ─────────────────────────────────────────────────────────────────     │
│   INSERT INTO website_data                                              │
│   (site_uid, template_id, site_content, ...)                            │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   TAXONOMY CHANGE (When user updates via Radius GUI)                    │
│   ══════════════════════════════════════════════════                    │
│   Target: Radius writes directly to RDS                                 │
│                                                                         │
│   What should happen:                                                   │
│   1. User changes platform_type from CO to CP in Radius GUI             │
│   2. Radius validates against THE LAW (valid values)                    │
│   3. Radius executes:                                                   │
│      UPDATE endpoint_taxonomy                                           │
│      SET platform_type = 'CP', updated_at = NOW()                       │
│      WHERE site_uid = 'SN-00000048'                                     │
│   4. Console shows updated value on next refresh                        │
│                                                                         │
│   Note: network-endpoints.json is NOT updated for taxonomy changes.     │
│   Taxonomy lives in RDS. JSON only has site_uid + live status.          │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   LIVE STATUS CHANGE (When workflow completes)                          │
│   ══════════════════════════════════════════════                        │
│   Target: Radius updates both RDS and JSON                              │
│                                                                         │
│   What should happen:                                                   │
│   1. Radius workflow completes (site goes live)                         │
│   2. Radius updates RDS:                                                │
│      UPDATE endpoint_taxonomy SET status = 'live' WHERE site_uid = ...  │
│      UPDATE website_data SET build_status = 'deployed' WHERE ...        │
│   3. Radius calls Connect Gateway to update JSON:                       │
│      PUT /api/v1/endpoints/{site_uid}/status                            │
│      Body: { "status": "green" }                                        │
│   4. Connect Gateway updates component status in JSON                   │
│   5. Console Cards show "live" badge (from RDS)                         │
│   6. Network Map shows green dot (from JSON)                            │
│                                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   BACKUP (Hourly)                                                       │
│   ═══════════════                                                       │
│   Target: Field-by-field backup to json_backup table                    │
│                                                                         │
│   What happens:                                                         │
│                                                                         │
│   Step 1: Read network-endpoints.json                                   │
│   ────────────────────────────────────                                  │
│   Parse all sections and components                                     │
│                                                                         │
│   Step 2: For each component with site_uid                              │
│   ─────────────────────────────────────────                             │
│   UPSERT INTO json_backup                                               │
│   (site_uid, url, label, notes, section_name,                           │
│    json_data, backed_up_at)                                             │
│   VALUES (from JSON fields)                                             │
│   ON CONFLICT (site_uid) DO UPDATE SET ...                              │
│                                                                         │
│   Result:                                                               │
│   - json_backup has queryable field-by-field backup                     │
│   - Used by Console for JOINs with endpoint_taxonomy                    │
│   - Full database backup via RDS automated snapshots (daily)            │
│                                                                         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## III.2 Data Categories

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      DATA CATEGORIES                                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   IDENTITY DATA (Immutable after creation)                              │
│   ═══════════════════════════════════════                               │
│   • site_uid          - Issued by Connect Gateway, NEVER changes        │
│   • domain_name       - Primary domain (can change via migration)       │
│   • assigned_at       - When site_uid was issued                        │
│   • endpoint_type     - W/A/D/ND (set at creation)                      │
│                                                                         │
│   TAXONOMY DATA (Stored, changes via Radius GUI)                        │
│   ═════════════════════════════════════════════                         │
│   • platform_type     - CO/CP/WP/WW/SH etc.                             │
│   • web_protocol      - W2/W3                                           │
│   • managed_by        - L/R/M (websites only)                           │
│   • persistence       - D/P (websites only)                             │
│   • website_purpose   - brochure/product_store/etc. (websites only)     │
│   • store_checkout    - Y/N (websites only)                             │
│                                                                         │
│   LIVE STATUS DATA (Real-time, changes frequently)                      │
│   ═════════════════════════════════════════════                         │
│   • status            - planned/wip/live (workflow state)               │
│   • dns_status        - pending/active/failed                           │
│   • ssl_status        - pending/issued/expired                          │
│   • build_status      - pending/building/deployed/failed                │
│   • component_status  - green/red/orange/grey (health check)            │
│                                                                         │
│   OPERATIONAL DATA (Websites only, changes on build/deploy)             │
│   ═══════════════════════════════════════════════════════               │
│   • template_id       - Which template version                          │
│   • site_content      - JSONB content for rendering                     │
│   • html_s3_path      - Where built HTML lives                          │
│   • cloudfront_id     - CDN distribution ID                             │
│   • route53_zone_id   - DNS zone ID                                     │
│   • acm_cert_arn      - SSL certificate ARN                             │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## III.3 Field-by-Field Data Flow Matrix

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                              FIELD-BY-FIELD DATA FLOW MATRIX                                        │
├──────────────────┬───────────────────┬───────────────────┬───────────────────┬──────────────────────┤
│ FIELD            │ CREATED BY        │ STORED (Primary)  │ BACKED UP TO      │ USED BY              │
├──────────────────┼───────────────────┼───────────────────┼───────────────────┼──────────────────────┤
│                  │                   │                   │                   │                      │
│ IDENTITY         │                   │                   │                   │                      │
│ ──────────────── │                   │                   │                   │                      │
│ site_uid         │ Connect Gateway   │ network-endpoints │ shopnet_site_     │ Endpoint Registry,   │
│                  │ create_site_uid() │ .json             │ index RDS         │ Cards, all systems   │
│                  │                   │                   │                   │                      │
│ domain_name      │ User via Radius   │ network-endpoints │ endpoint_taxonomy │ Endpoint Registry,   │
│                  │                   │ .json             │ RDS               │ Cards, DNS           │
│                  │                   │                   │                   │                      │
│ assigned_at      │ Connect Gateway   │ network-endpoints │ shopnet_site_     │ Endpoint Registry    │
│                  │ (auto timestamp)  │ .json             │ index RDS         │                      │
│                  │                   │                   │                   │                      │
│ TAXONOMY         │                   │                   │                   │                      │
│ ──────────────── │                   │                   │                   │                      │
│ endpoint_type    │ User via Radius   │ endpoint_taxonomy │ (already in RDS)  │ Endpoint Registry,   │
│                  │                   │ RDS               │                   │ Console filtering    │
│                  │                   │                   │                   │                      │
│ platform_type    │ User via Radius   │ endpoint_taxonomy │ (already in RDS)  │ Endpoint Registry,   │
│                  │                   │ RDS               │                   │ Console filtering    │
│                  │                   │                   │                   │                      │
│ web_protocol     │ User via Radius   │ endpoint_taxonomy │ (already in RDS)  │ Cards display        │
│                  │                   │ RDS               │                   │                      │
│                  │                   │                   │                   │                      │
│ managed_by       │ User via Radius   │ endpoint_taxonomy │ (already in RDS)  │ Workflow selection   │
│                  │                   │ RDS               │                   │                      │
│                  │                   │                   │                   │                      │
│ persistence      │ User via Radius   │ endpoint_taxonomy │ (already in RDS)  │ Workflow selection   │
│                  │                   │ RDS               │                   │                      │
│                  │                   │                   │                   │                      │
│ website_purpose  │ User via Radius   │ endpoint_taxonomy │ (already in RDS)  │ Cards display,       │
│                  │                   │ RDS               │                   │ Console filtering    │
│                  │                   │                   │                   │                      │
│ LIVE STATUS      │                   │                   │                   │                      │
│ ──────────────── │                   │                   │                   │                      │
│ status           │ Radius workflow   │ endpoint_taxonomy │ (already in RDS)  │ Endpoint Registry,   │
│ (planned/wip/    │                   │ RDS               │                   │ Cards badge          │
│  live)           │                   │                   │                   │                      │
│                  │                   │                   │                   │                      │
│ component_status │ Health checks     │ network-endpoints │ json_backup       │ Network Map,         │
│ (green/red/      │ (live)            │ .json (dynamic)   │ RDS (hourly)      │ Console status       │
│  orange/grey)    │                   │                   │                   │                      │
│                  │                   │                   │                   │                      │
│ dns_status       │ AWS Route53       │ website_data      │ (already in RDS)  │ Infrastructure       │
│                  │                   │ RDS               │                   │ panel                │
│                  │                   │                   │                   │                      │
│ ssl_status       │ AWS ACM           │ website_data      │ (already in RDS)  │ Infrastructure       │
│                  │                   │ RDS               │                   │ panel                │
│                  │                   │                   │                   │                      │
│ build_status     │ Radius deployer   │ website_data      │ (already in RDS)  │ Build history        │
│                  │                   │ RDS               │                   │                      │
│                  │                   │                   │                   │                      │
│ OPERATIONAL      │                   │                   │                   │                      │
│ ──────────────── │                   │                   │                   │                      │
│ template_id      │ User via Radius   │ website_data      │ (already in RDS)  │ Template render      │
│                  │                   │ RDS               │                   │                      │
│                  │                   │                   │                   │                      │
│ site_content     │ User via Radius   │ website_data      │ (already in RDS)  │ Template render,     │
│                  │                   │ RDS               │                   │ Cards display        │
│                  │                   │                   │                   │                      │
│ html_s3_path     │ Radius deployer   │ website_data      │ (already in RDS)  │ Nginx config         │
│                  │                   │ RDS               │                   │                      │
│                  │                   │                   │                   │                      │
│ cloudfront_id    │ AWS infra module  │ website_data      │ (already in RDS)  │ CDN invalidation     │
│                  │                   │ RDS               │                   │                      │
│                  │                   │                   │                   │                      │
│ route53_zone_id  │ AWS infra module  │ website_data      │ (already in RDS)  │ DNS updates          │
│                  │                   │ RDS               │                   │                      │
│                  │                   │                   │                   │                      │
└──────────────────┴───────────────────┴───────────────────┴───────────────────┴──────────────────────┘
```

---

## III.4 Console GUI Data Sources (Simplified Architecture)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    CONSOLE GUI DATA SOURCES - SIMPLIFIED                         │
│                                                                                  │
│   PRINCIPLE: No complex merging. Each table has ONE source.                      │
│   Live status is an OVERLAY on cards, not merged into registry.                  │
│                                                                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   1. ENDPOINT REGISTRY TABLE (Pure RDS)                                          │
│   ══════════════════════════════════════                                         │
│   Source: RDS endpoint_taxonomy table ONLY                                       │
│   API: GET /api/brochure/taxonomy                                                │
│                                                                                  │
│   Features:                                                                      │
│   • Configurable columns (user selects which to display)                         │
│   • Filter by any column                                                         │
│   • Sort by any column                                                           │
│   • NO live status - this is taxonomy data only                                  │
│                                                                                  │
│   Available Columns (all from endpoint_taxonomy):                                │
│   ┌─────────────────┬───────────────────────────────────────────────────────┐   │
│   │ Column          │ Description                                           │   │
│   ├─────────────────┼───────────────────────────────────────────────────────┤   │
│   │ site_uid        │ SN-XXXXXXXX (THE LAW)                                 │   │
│   │ domain_name     │ Primary domain                                        │   │
│   │ endpoint_type   │ W / A / D / ND                                        │   │
│   │ platform_type   │ CO / CP / WP / SH / CL / S3 / LM / etc.               │   │
│   │ web_protocol    │ W2 / W3                                               │   │
│   │ status          │ planned / wip / live                                  │   │
│   │ runtime         │ Lambda / EC2 / Lightsail / etc.                       │   │
│   │ host            │ AWS / External / Partner                              │   │
│   │ managed_by      │ L / R / M (websites only)                             │   │
│   │ persistence     │ D / P (websites only)                                 │   │
│   │ website_purpose │ brochure / product_store / etc. (websites only)       │   │
│   │ store_checkout  │ Y / N (websites only)                                 │   │
│   │ created_at      │ When registered                                       │   │
│   │ updated_at      │ Last taxonomy change                                  │   │
│   └─────────────────┴───────────────────────────────────────────────────────┘   │
│                                                                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   2. LIVE STATUS TABLE (Pure JSON - Separate Table)                              │
│   ══════════════════════════════════════════════════                             │
│   Source: network-endpoints.json via Connect Gateway ONLY                        │
│   API: GET connect.shopnet.network/api/v1/network/live                           │
│                                                                                  │
│   Purpose: Show real-time operational status from health checks                  │
│                                                                                  │
│   Columns (all from JSON):                                                       │
│   ┌─────────────────┬───────────────────────────────────────────────────────┐   │
│   │ Column          │ Description                                           │   │
│   ├─────────────────┼───────────────────────────────────────────────────────┤   │
│   │ site_uid        │ SN-XXXXXXXX (link to taxonomy)                        │   │
│   │ component_key   │ Key name in JSON                                      │   │
│   │ section         │ Which section (brochure, products, etc.)              │   │
│   │ label           │ Display name                                          │   │
│   │ live_status     │ 🟢 green / 🔴 red / 🟠 orange / ⚫ grey               │   │
│   │ ip              │ IP address or service (CloudFront, RDS, etc.)         │   │
│   │ instance        │ EC2 / Lambda / Lightsail / etc.                       │   │
│   │ notes           │ Current state notes                                   │   │
│   │ last_check      │ When status was last evaluated                        │   │
│   └─────────────────┴───────────────────────────────────────────────────────┘   │
│                                                                                  │
│   Cache: 10 seconds                                                              │
│   Auto-refresh: Every 30 seconds                                                 │
│                                                                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   3. SITE CARDS (RDS + Live Status Overlay)                                      │
│   ══════════════════════════════════════════                                     │
│   Primary Source: RDS endpoint_taxonomy + website_data                           │
│   Overlay: Live status color from JSON (if site_uid exists in JSON)              │
│   API: GET /api/v1/sites/cards?endpoint_type=W                                   │
│                                                                                  │
│   Card Content (from RDS):                                                       │
│   ┌─────────────────┬───────────────────────────────────────────────────────┐   │
│   │ Card Element    │ Source                                                │   │
│   ├─────────────────┼───────────────────────────────────────────────────────┤   │
│   │ Title           │ endpoint_taxonomy.domain_name                         │   │
│   │ Status Badge    │ endpoint_taxonomy.status (planned/wip/live)           │   │
│   │ Purpose         │ endpoint_taxonomy.website_purpose                     │   │
│   │ Platform        │ endpoint_taxonomy.platform_type                       │   │
│   │ Preview Image   │ website_data.html_s3_path → thumbnail                 │   │
│   │ Last Build      │ website_data.last_build_at                            │   │
│   │ Link            │ Derived from domain_name + web_protocol               │   │
│   └─────────────────┴───────────────────────────────────────────────────────┘   │
│                                                                                  │
│   Live Status Overlay (from JSON):                                               │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │                                                                         │   │
│   │   IF site_uid exists in network-endpoints.json:                         │   │
│   │      Show live_status indicator: 🟢 / 🔴 / 🟠                           │   │
│   │                                                                         │   │
│   │   ELSE:                                                                 │   │
│   │      Show grey indicator: ⚫ (no live data)                             │   │
│   │                                                                         │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   4. NETWORK MAP (Pure JSON)                                                     │
│   ═══════════════════════════                                                    │
│   Source: network-endpoints.json via Connect Gateway ONLY                        │
│   API: GET connect.shopnet.network/api/v1/network/status                         │
│                                                                                  │
│   Map Elements (all from JSON):                                                  │
│   ┌─────────────────┬───────────────────────────────────────────────────────┐   │
│   │ Element         │ Source                                                │   │
│   ├─────────────────┼───────────────────────────────────────────────────────┤   │
│   │ Sections        │ network-endpoints.json.sections                       │   │
│   │ Components      │ section.components[]                                  │   │
│   │ Status Colors   │ component.status (green/red/orange/grey)              │   │
│   │ Connectors      │ section.connectors[]                                  │   │
│   │ Labels          │ component.label                                       │   │
│   │ Positions       │ section.position (left/right/top/center)              │   │
│   │ Summary Stats   │ Computed from component status counts                 │   │
│   │ Timestamp       │ response.timestamp                                    │   │
│   └─────────────────┴───────────────────────────────────────────────────────┘   │
│                                                                                  │
│   Auto-refresh: Every 30 seconds                                                 │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

                         SUMMARY: SEPARATION OF CONCERNS

    ┌────────────────────┐     ┌────────────────────┐     ┌────────────────────┐
    │  ENDPOINT REGISTRY │     │   LIVE STATUS      │     │    SITE CARDS      │
    │    (Taxonomy)      │     │   (Operations)     │     │  (Combined View)   │
    ├────────────────────┤     ├────────────────────┤     ├────────────────────┤
    │                    │     │                    │     │                    │
    │  Source: RDS ONLY  │     │ Source: JSON ONLY  │     │ Content: RDS       │
    │                    │     │                    │     │ Status: JSON       │
    │  • Classification  │     │  • Health checks   │     │                    │
    │  • Taxonomy fields │     │  • Live status     │     │ If no site_uid     │
    │  • Static data     │     │  • Real-time ops   │     │ in JSON → grey     │
    │                    │     │                    │     │                    │
    │  NO MERGING        │     │  NO MERGING        │     │ SIMPLE OVERLAY     │
    │                    │     │                    │     │                    │
    └────────────────────┘     └────────────────────┘     └────────────────────┘

    ┌────────────────────┐
    │    NETWORK MAP     │
    │  (Visual Status)   │
    ├────────────────────┤
    │                    │
    │ Source: JSON ONLY  │
    │                    │
    │  • Visual topology │
    │  • Component grid  │
    │  • Live status     │
    │  • 30s auto-refresh│
    │                    │
    │  NO MERGING        │
    │                    │
    └────────────────────┘
```

### III.4.1 Console Card Types

There are TWO fundamentally different card types in the Console GUI:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           CONSOLE CARD TYPES                                     │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   TYPE 1: NETWORK CARDS (THE LAW - site_uid required)                           │
│   ════════════════════════════════════════════════════                          │
│                                                                                  │
│   Key Field: site_uid (SN-XXXXXXXX)                                             │
│   RDS Table: endpoint_taxonomy (+ website_data for websites)                    │
│   Source: RDS endpoint_taxonomy + JSON live status overlay                      │
│   Status: Health check (live) OR taxonomy status (planned/wip)                  │
│                                                                                  │
│   Status Display:                                                               │
│   ┌────────────┬─────────────┬────────────────────────────────┐                 │
│   │ RDS Status │ Card Color  │ Meaning                        │                 │
│   ├────────────┼─────────────┼────────────────────────────────┤                 │
│   │ planned    │ Grey        │ Placeholder - not health checked│                 │
│   │ wip        │ Orange      │ Work in Progress - building     │                 │
│   │ live       │ Green/Red   │ Live - health check determines  │                 │
│   └────────────┴─────────────┴────────────────────────────────┘                 │
│                                                                                  │
│   Used in Console Sections:                                                     │
│   • Brochure Sites (website_purpose = 'brochure')                               │
│   • Product Stores (website_purpose = 'product_store')                          │
│   • Domain Stores (website_purpose = 'domain_store')                            │
│   • AI Agents (endpoint_type = 'A')                                             │
│   • Data Layer (endpoint_type = 'D')                                            │
│   • Templates (endpoint_type = 'W', platform_type = 'CP')                       │
│                                                                                  │
│   Render Function: renderNetworkCard()                                          │
│                                                                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   TYPE 2: GITHUB CARDS (No site_uid - RDS github_cards table)                   │
│   ════════════════════════════════════════════════════════════                  │
│                                                                                  │
│   Key Field: id (auto-increment) + repo_name/file_path                          │
│   RDS Table: github_cards (synced daily from GitHub API)                        │
│   Source: RDS github_cards (populated by daily cron sync)                       │
│   Status: Git freshness (last_commit_at, not health checked)                    │
│                                                                                  │
│   Freshness Display (based on last_commit_at):                                  │
│   ┌────────────────┬─────────────┬────────────────────────────┐                 │
│   │ Days Since     │ Card Color  │ Meaning                    │                 │
│   ├────────────────┼─────────────┼────────────────────────────┤                 │
│   │ < 24 hours     │ Green       │ Recent - just updated      │                 │
│   │ < 7 days       │ Blue        │ Active - being worked on   │                 │
│   │ < 30 days      │ Grey        │ Stable - not changing      │                 │
│   │ > 30 days      │ Orange      │ Stale - needs review       │                 │
│   └────────────────┴─────────────┴────────────────────────────┘                 │
│                                                                                  │
│   Used in Console Sections:                                                     │
│   • GitHub Modules panel (console_section = 'github_modules')                   │
│   • Plugin library (console_section = 'plugin_library')                         │
│   • Documentation (console_section = 'docs')                                    │
│                                                                                  │
│   Click Action: Opens document viewer modal (fetches from raw_content_url)      │
│   Render Function: renderGitHubCard()                                           │
│                                                                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   KEY DISTINCTION:                                                              │
│                                                                                  │
│   • Network Cards → Have site_uid → THE LAW Tables 1-3 apply                    │
│   • GitHub Cards → No site_uid → THE LAW Table 4 (github_cards)                 │
│                                                                                  │
│   Network Cards represent DEPLOYED infrastructure (sites, agents, databases).   │
│   GitHub Cards represent SOURCE CODE and DOCUMENTATION in GitHub repos.         │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### III.4.2 GitHub Cards Table (Table 4)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                          github_cards TABLE STRUCTURE                            │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   RDS Table: github_cards                                                       │
│   Primary Key: id (auto-increment, NOT site_uid)                                │
│   Unique Constraint: (repo_name, file_path)                                     │
│                                                                                  │
│   ┌─────────────────────┬───────────────────────────────────────────────────┐   │
│   │ Field               │ Purpose                                           │   │
│   ├─────────────────────┼───────────────────────────────────────────────────┤   │
│   │ id                  │ Auto-increment primary key                        │   │
│   │ repo_name           │ GitHub repo (e.g., 'shopnet-library')             │   │
│   │ file_path           │ Path in repo (e.g., 'templates/brochure-v1')      │   │
│   ├─────────────────────┼───────────────────────────────────────────────────┤   │
│   │ module_name         │ Display name on card                              │   │
│   │ module_type         │ template, plugin, docs, config, module            │   │
│   │ description         │ Card description text                             │   │
│   ├─────────────────────┼───────────────────────────────────────────────────┤   │
│   │ github_url          │ Full GitHub URL                                   │   │
│   │ raw_content_url     │ Raw URL for document viewer                       │   │
│   │ primary_language    │ JavaScript, Python, Markdown, etc.                │   │
│   │ last_commit_sha     │ SHA to detect changes during sync                 │   │
│   │ last_commit_at      │ Timestamp for freshness indicator                 │   │
│   │ last_commit_by      │ Author name                                       │   │
│   ├─────────────────────┼───────────────────────────────────────────────────┤   │
│   │ console_section     │ Which Console section displays this card          │   │
│   │ display_order       │ Sort order within section                         │   │
│   │ card_label          │ Optional badge override                           │   │
│   │ is_visible          │ Hide without deleting                             │   │
│   ├─────────────────────┼───────────────────────────────────────────────────┤   │
│   │ synced_at           │ When last synced from GitHub                      │   │
│   │ sync_error          │ Last sync error (if any)                          │   │
│   └─────────────────────┴───────────────────────────────────────────────────┘   │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### III.4.3 GitHub Sync Process

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                         GITHUB CARDS SYNC PROCESS                                │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   Frequency: Daily cron (e.g., 2:00 AM UTC)                                     │
│   Source: GitHub API (shopnet-library repository)                               │
│   Target: RDS github_cards table                                                │
│                                                                                  │
│   SYNC FLOW:                                                                    │
│   ═════════                                                                     │
│                                                                                  │
│   ┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐   │
│   │   CRON      │────▶│ GitHub API  │────▶│   SYNC      │────▶│    RDS      │   │
│   │  (daily)    │     │  (commits)  │     │   SCRIPT    │     │github_cards │   │
│   └─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘   │
│                                                                                  │
│   SYNC LOGIC:                                                                   │
│   ───────────                                                                   │
│   1. Read github_cards table for list of tracked paths                          │
│   2. For each path, call GitHub API to get latest commit info                   │
│   3. Compare last_commit_sha - if different, update record                      │
│   4. Update: last_commit_at, last_commit_sha, last_commit_by, synced_at         │
│   5. On error: set sync_error field, continue to next item                      │
│                                                                                  │
│   INITIAL POPULATION:                                                           │
│   ───────────────────                                                           │
│   • Manual INSERT for each module/document to track                             │
│   • Or: Radius GUI to add new GitHub Cards                                      │
│   • Sync only UPDATES existing records, does not auto-discover                  │
│                                                                                  │
│   EXAMPLE CRON (Lambda or EC2):                                                 │
│   ─────────────────────────────                                                 │
│   0 2 * * * /path/to/sync-github-cards.py                                       │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## III.5 Change Propagation Flows

### When Taxonomy Data Changes (via Radius GUI)

```
┌─────────────────────────────────────────────────────────────────────────┐
│         FLOW: Taxonomy Change (e.g., platform_type update)             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   USER                    RADIUS                         RDS            │
│    │                        │                             │             │
│    │  1. Update taxonomy    │                             │             │
│    │     in Radius GUI      │                             │             │
│    │───────────────────────▶│                             │             │
│    │                        │                             │             │
│    │                        │  2. Validate against        │             │
│    │                        │     THE LAW                 │             │
│    │                        │                             │             │
│    │                        │  3. UPDATE endpoint_        │             │
│    │                        │     taxonomy                │             │
│    │                        │────────────────────────────▶│             │
│    │                        │                             │             │
│    │                        │  4. Log change with         │             │
│    │                        │     timestamp               │             │
│    │                        │────────────────────────────▶│             │
│    │                        │                             │             │
│    │  5. Success            │                             │             │
│    │◀───────────────────────│                             │             │
│    │                        │                             │             │
│                                                                         │
│   Result: Console Endpoint Registry and Cards refresh on next load     │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### When Live Status Changes (workflow state)

```
┌─────────────────────────────────────────────────────────────────────────┐
│         FLOW: Status Change (e.g., wip → live)                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   RADIUS                    RDS                    CONNECT GW           │
│   WORKFLOW                   │                         │                │
│      │                       │                         │                │
│      │  1. Workflow          │                         │                │
│      │     completes         │                         │                │
│      │                       │                         │                │
│      │  2. UPDATE endpoint_  │                         │                │
│      │     taxonomy.status   │                         │                │
│      │     = 'live'          │                         │                │
│      │──────────────────────▶│                         │                │
│      │                       │                         │                │
│      │  3. UPDATE website_   │                         │                │
│      │     data.build_status │                         │                │
│      │     = 'deployed'      │                         │                │
│      │──────────────────────▶│                         │                │
│      │                       │                         │                │
│      │  4. Update component  │                         │                │
│      │     status in network-│                         │                │
│      │     endpoints.json    │                         │                │
│      │─────────────────────────────────────────────────▶│               │
│      │                       │                         │                │
│                                                                         │
│   Result:                                                               │
│   - Console shows "live" badge (from RDS)                              │
│   - Network Map shows green status (from JSON)                         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### When New Endpoint Created

```
┌─────────────────────────────────────────────────────────────────────────┐
│         FLOW: New Endpoint Creation                                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   RADIUS       CONNECT GW        network-        RDS                    │
│      │             │             endpoints.json    │                    │
│      │             │                  │            │                    │
│      │  1. Request │                  │            │                    │
│      │  site_uid   │                  │            │                    │
│      │────────────▶│                  │            │                    │
│      │             │                  │            │                    │
│      │             │  2. Generate     │            │                    │
│      │             │  SN-XXXXXXXX     │            │                    │
│      │             │                  │            │                    │
│      │             │  3. Write new    │            │                    │
│      │             │  endpoint record │            │                    │
│      │             │─────────────────▶│            │                    │
│      │             │                  │            │                    │
│      │             │  4. Write to     │            │                    │
│      │             │  site_index      │            │                    │
│      │             │─────────────────────────────▶│                    │
│      │             │                  │            │                    │
│      │  5. Return  │                  │            │                    │
│      │  site_uid   │                  │            │                    │
│      │◀────────────│                  │            │                    │
│      │             │                  │            │                    │
│      │  6. INSERT endpoint_taxonomy   │            │                    │
│      │─────────────────────────────────────────────▶│                   │
│      │             │                  │            │                    │
│      │  7. INSERT website_data (if W) │            │                    │
│      │─────────────────────────────────────────────▶│                   │
│      │             │                  │            │                    │
│                                                                         │
│   Result:                                                               │
│   - network-endpoints.json has site_uid record (SOURCE for site_uid)   │
│   - shopnet_site_index has site_uid (BACKUP for site_uid)              │
│   - endpoint_taxonomy has full taxonomy (SOURCE for taxonomy)          │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## III.6 Backup Flows

### Backup Flow 1: network-endpoints.json → RDS (Hourly)

```
┌─────────────────────────────────────────────────────────────────────────┐
│         BACKUP: network-endpoints.json → RDS (Hourly)                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   SCHEDULER           CONNECT GW           RDS                          │
│   (Cron/Hourly)          │                  │                           │
│        │                 │                  │                           │
│        │  1. Trigger     │                  │                           │
│        │  backup         │                  │                           │
│        │────────────────▶│                  │                           │
│        │                 │                  │                           │
│        │                 │  2. Read network-endpoints.json              │
│        │                 │                  │                           │
│        │                 │  3. For each endpoint with site_uid:         │
│        │                 │                  │                           │
│        │                 │     UPSERT json_backup                       │
│        │                 │     ┌─────────────────────────────┐          │
│        │                 │     │ site_uid     (from JSON)    │          │
│        │                 │     │ url          (from JSON)    │          │
│        │                 │     │ label        (from JSON)    │          │
│        │                 │     │ notes        (from JSON)    │          │
│        │                 │     │ section_name (from JSON)    │          │
│        │                 │     │ json_data    (component)    │          │
│        │                 │     │ backed_up_at (NOW)          │          │
│        │                 │     └─────────────────────────────┘          │
│        │                 │────────────────────────────────────▶│        │
│        │                 │                  │                           │
│        │  4. Complete    │                  │                           │
│        │◀────────────────│                  │                           │
│        │                 │                  │                           │
│                                                                         │
│   Table updated:                                                        │
│   • json_backup (field-by-field from JSON, used by Console JOINs)      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Backup Flow 2: RDS Tables (AWS Managed)

```
┌─────────────────────────────────────────────────────────────────────────┐
│         BACKUP: RDS Automatic Backups (AWS Managed)                    │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   AWS RDS automatically handles:                                        │
│   • Daily snapshots (retained 7 days)                                  │
│   • Point-in-time recovery (last 5 minutes)                            │
│   • Multi-AZ replication (if enabled)                                  │
│                                                                         │
│   Tables backed up by AWS:                                             │
│   • endpoint_taxonomy (taxonomy SOURCE OF TRUTH)                       │
│   • website_data (operational data)                                    │
│   • json_backup (field-by-field JSON backup for Console JOINs)        │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## III.7 Backup Field Mapping

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    BACKUP FIELD MAPPING                                 │
│         network-endpoints.json → RDS endpoint_backup table             │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   JSON PATH                          │ RDS COLUMN                       │
│   ───────────────────────────────────┼───────────────────────────       │
│   component.site_uid                 │ site_uid (PK)                    │
│   component.domain (or label)        │ domain_name                      │
│   section key                        │ section_name                     │
│   component.status                   │ live_status                      │
│   component.label                    │ label                            │
│   component.type                     │ component_type                   │
│   component.platform_type            │ platform_type                    │
│   component.ip                       │ ip_address                       │
│   component.instance                 │ instance_id                      │
│   component.notes                    │ notes                            │
│   sections[x].connectors             │ (separate connector_backup table)│
│   metadata.updated_at                │ json_updated_at                  │
│   (auto)                             │ backed_up_at                     │
│                                                                         │
│   ───────────────────────────────────────────────────────────────       │
│                                                                         │
│   endpoint_backup TABLE SCHEMA:                                         │
│   ┌─────────────────────────────────────────────────────────────┐      │
│   │ site_uid         VARCHAR(12)  PRIMARY KEY                   │      │
│   │ domain_name      VARCHAR(255)                               │      │
│   │ section_name     VARCHAR(50)                                │      │
│   │ live_status      VARCHAR(20)  -- green/red/orange/grey      │      │
│   │ label            VARCHAR(255)                               │      │
│   │ component_type   VARCHAR(50)                                │      │
│   │ platform_type    VARCHAR(10)                                │      │
│   │ ip_address       VARCHAR(50)                                │      │
│   │ instance_id      VARCHAR(100)                               │      │
│   │ notes            TEXT                                       │      │
│   │ json_updated_at  TIMESTAMP                                  │      │
│   │ backed_up_at     TIMESTAMP    DEFAULT NOW()                 │      │
│   └─────────────────────────────────────────────────────────────┘      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## III.8 Summary: Sources of Truth & Backups

```
┌─────────────────────────────────────────────────────────────────────────┐
│              FINAL SUMMARY: SOURCES OF TRUTH & BACKUPS                  │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│   ┌─────────────────────────────────────────────────────────────────┐  │
│   │ DATA TYPE         │ SOURCE OF TRUTH     │ BACKED UP TO          │  │
│   ├───────────────────┼─────────────────────┼───────────────────────┤  │
│   │ site_uid          │ network-endpoints   │ shopnet_site_index    │  │
│   │ (identity)        │ .json (Connect GW)  │ RDS (on creation)     │  │
│   │                   │                     │ endpoint_backup RDS   │  │
│   │                   │                     │ (hourly)              │  │
│   ├───────────────────┼─────────────────────┼───────────────────────┤  │
│   │ Taxonomy          │ endpoint_taxonomy   │ AWS RDS snapshots     │  │
│   │ (classification)  │ RDS                 │ (daily)               │  │
│   ├───────────────────┼─────────────────────┼───────────────────────┤  │
│   │ Live Status       │ network-endpoints   │ endpoint_backup RDS   │  │
│   │ (green/red/etc)   │ .json (real-time)   │ (hourly)              │  │
│   ├───────────────────┼─────────────────────┼───────────────────────┤  │
│   │ Operational       │ website_data        │ AWS RDS snapshots     │  │
│   │ (build, infra)    │ RDS                 │ (daily)               │  │
│   └───────────────────┴─────────────────────┴───────────────────────┘  │
│                                                                         │
│   CONSOLE GUI READS FROM:                                               │
│   • Endpoint Registry → RDS endpoint_taxonomy                          │
│   • Site Cards → RDS endpoint_taxonomy + website_data                  │
│   • Network Map → network-endpoints.json (live status)                 │
│                                                                         │
│   CHANGES PROPAGATED:                                                   │
│   • Taxonomy changes → RDS immediately (Radius writes)                 │
│   • Live status → JSON immediately, RDS hourly (backup)                │
│   • New endpoints → JSON + RDS immediately (Connect GW + Radius)       │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## III.9 network-endpoints.json Field Sources

This section documents exactly where each field in network-endpoints.json comes from.

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                        network-endpoints.json FIELD SOURCES                                          │
├─────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                      │
│  ┌──────────────────────────────────────────────────────────────────────────────────────────────┐   │
│  │                                 METADATA (top-level)                                          │   │
│  ├────────────────────┬──────────────────────────────────────────────────────────────────────────┤   │
│  │ FIELD              │ SOURCE                                                                   │   │
│  ├────────────────────┼──────────────────────────────────────────────────────────────────────────┤   │
│  │ version            │ Manual - set when file format changes                                    │   │
│  │ updated_at         │ Manual - set when any component is added/changed                         │   │
│  │ description        │ Manual - static text describing the file                                 │   │
│  │ platform_types     │ Manual - static lookup table of platform codes                           │   │
│  └────────────────────┴──────────────────────────────────────────────────────────────────────────┘   │
│                                                                                                      │
│  ┌──────────────────────────────────────────────────────────────────────────────────────────────┐   │
│  │                                 SECTION FIELDS                                                │   │
│  ├────────────────────┬──────────────────────────────────────────────────────────────────────────┤   │
│  │ FIELD              │ SOURCE                                                                   │   │
│  ├────────────────────┼──────────────────────────────────────────────────────────────────────────┤   │
│  │ status             │ Derived - Connect Gateway aggregates from component statuses             │   │
│  │ label              │ Manual - human-readable name for the section                             │   │
│  │ position           │ Manual - GUI positioning (left, right, top, center)                      │   │
│  │ url                │ Manual - main URL for the section (if applicable)                        │   │
│  │ components         │ Composite - contains component objects (see below)                       │   │
│  │ connectors         │ Composite - contains connector objects (for connect.shopnet only)        │   │
│  └────────────────────┴──────────────────────────────────────────────────────────────────────────┘   │
│                                                                                                      │
│  ┌──────────────────────────────────────────────────────────────────────────────────────────────┐   │
│  │                                 COMPONENT FIELDS                                              │   │
│  ├────────────────────┬────────────────────┬─────────────────────────────────────────────────────┤   │
│  │ FIELD              │ SOURCE             │ NOTES                                               │   │
│  ├────────────────────┼────────────────────┼─────────────────────────────────────────────────────┤   │
│  │ status             │ Mixed              │ "green/red/orange/grey" = manual/health-check       │   │
│  │                    │                    │ "dynamic:db" = Connect GW evaluates live            │   │
│  ├────────────────────┼────────────────────┼─────────────────────────────────────────────────────┤   │
│  │ label              │ Manual             │ Human-readable component name                       │   │
│  ├────────────────────┼────────────────────┼─────────────────────────────────────────────────────┤   │
│  │ url                │ Manual             │ Public URL if accessible                            │   │
│  ├────────────────────┼────────────────────┼─────────────────────────────────────────────────────┤   │
│  │ type               │ Manual             │ database, storage, agent, etc.                      │   │
│  ├────────────────────┼────────────────────┼─────────────────────────────────────────────────────┤   │
│  │ ip                 │ Manual             │ IP address or "CloudFront", "RDS", "S3", etc.       │   │
│  ├────────────────────┼────────────────────┼─────────────────────────────────────────────────────┤   │
│  │ instance           │ Manual             │ Infrastructure type (EC2, Lambda, Lightsail, etc.)  │   │
│  ├────────────────────┼────────────────────┼─────────────────────────────────────────────────────┤   │
│  │ notes              │ Manual             │ Human notes, warnings, current state description    │   │
│  ├────────────────────┼────────────────────┼─────────────────────────────────────────────────────┤   │
│  │ platform_type      │ Manual             │ Taxonomy code: L, R, WP, SH, L3, S3, RD             │   │
│  │                    │ (future: Radius)   │ FUTURE: Set by Radius GUI, synced to JSON           │   │
│  ├────────────────────┼────────────────────┼─────────────────────────────────────────────────────┤   │
│  │ uses_connect       │ Manual             │ Boolean - does this site call Connect API?          │   │
│  ├────────────────────┼────────────────────┼─────────────────────────────────────────────────────┤   │
│  │ site_uid           │ NOT PRESENT YET    │ MUST ADD: Connect Gateway creates via create_site_  │   │
│  │                    │ (future: Connect)  │ uid() - becomes PRIMARY KEY for cross-system refs   │   │
│  └────────────────────┴────────────────────┴─────────────────────────────────────────────────────┘   │
│                                                                                                      │
│  ┌──────────────────────────────────────────────────────────────────────────────────────────────┐   │
│  │                                 CONNECTOR FIELDS (connect.shopnet section only)               │   │
│  ├────────────────────┬────────────────────┬─────────────────────────────────────────────────────┤   │
│  │ FIELD              │ SOURCE             │ NOTES                                               │   │
│  ├────────────────────┼────────────────────┼─────────────────────────────────────────────────────┤   │
│  │ status             │ Mixed              │ Manual or "dynamic:db" for live evaluation          │   │
│  │ target             │ Manual             │ Target section ID                                   │   │
│  │ direction          │ Manual             │ left, right, top, bottom                            │   │
│  │ notes              │ Manual             │ Connector state description                         │   │
│  └────────────────────┴────────────────────┴─────────────────────────────────────────────────────┘   │
│                                                                                                      │
└─────────────────────────────────────────────────────────────────────────────────────────────────────┘

                              SUMMARY: network-endpoints.json SOURCES

  ┌────────────────────────────────────────────────────────────────────────────────────┐
  │                                                                                    │
  │   MANUALLY SET (by human editing JSON file):                                       │
  │   ─────────────────────────────────────────                                        │
  │   • All metadata (version, updated_at, description, platform_types)                │
  │   • Section structure (label, position, url)                                       │
  │   • Component definitions (label, url, type, ip, instance, notes, platform_type)   │
  │   • Connector definitions (target, direction, notes)                               │
  │   • Static status values (green, red, orange, grey)                                │
  │                                                                                    │
  │   CONNECT GATEWAY DERIVES (live evaluation):                                       │
  │   ──────────────────────────────────────────                                       │
  │   • "dynamic:db" status → evaluated to green/red based on DB connectivity          │
  │   • Section status → aggregated from component statuses                            │
  │   • connect.shopnet status → aggregated from connector statuses                    │
  │                                                                                    │
  │   NOT YET IN JSON (must be added per THE LAW):                                     │
  │   ─────────────────────────────────────────────                                    │
  │   • site_uid → Connect Gateway should generate and add to each component           │
  │   • assigned_at → When site_uid was issued                                         │
  │   • endpoint_type → W/A/D/ND classification                                        │
  │                                                                                    │
  └────────────────────────────────────────────────────────────────────────────────────┘
```

---

## III.10 Endpoint Registry Table Sources (Current vs Target)

The Endpoint Registry table in Console currently gets data from multiple sources. This section documents exactly what happens NOW vs what SHOULD happen.

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                  ENDPOINT REGISTRY TABLE - CURRENT STATE (Jan 24, 2026)                              │
├─────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                      │
│  API: GET /api/v1/endpoints (Connect Gateway)                                                        │
│  Code: shopnet_connect_api.py → list_endpoints()                                                     │
│                                                                                                      │
│  ┌───────────────────┬─────────────────────────────────────────────────────────────────────────────┐│
│  │ TABLE COLUMN      │ SOURCE                                                                      ││
│  ├───────────────────┼─────────────────────────────────────────────────────────────────────────────┤│
│  │ domain_name       │ ENDPOINT_REGISTRY dict (hardcoded in-memory)                                ││
│  │                   │ File: shopnet_connect_api.py line 339                                       ││
│  ├───────────────────┼─────────────────────────────────────────────────────────────────────────────┤│
│  │ s3_folder         │ ENDPOINT_REGISTRY dict (hardcoded in-memory)                                ││
│  │                   │ Same domain name copied to s3_folder field                                  ││
│  ├───────────────────┼─────────────────────────────────────────────────────────────────────────────┤│
│  │ sync_status       │ ENDPOINT_REGISTRY dict (hardcoded in-memory)                                ││
│  │                   │ last_sync_status field (success/failed)                                     ││
│  ├───────────────────┼─────────────────────────────────────────────────────────────────────────────┤│
│  │ license_key       │ ENDPOINT_REGISTRY dict (hardcoded in-memory)                                ││
│  │                   │ license_key field or null                                                   ││
│  ├───────────────────┼─────────────────────────────────────────────────────────────────────────────┤│
│  │ site_uid          │ ENRICHED from amazon_products.domains_unused RDS                            ││
│  │                   │ Code: get_site_uid_map() at request time                                    ││
│  │                   │ ⚠️  WRONG SOURCE - should come from Connect Gateway/JSON                    ││
│  └───────────────────┴─────────────────────────────────────────────────────────────────────────────┘│
│                                                                                                      │
│  ⚠️  PROBLEMS:                                                                                        │
│  1. ENDPOINT_REGISTRY is hardcoded dict - NOT from JSON or RDS                                       │
│  2. Only 2 endpoints defined (bestbird.com, choiceassist.ai)                                         │
│  3. Lost on server restart                                                                           │
│  4. site_uid pulled from wrong database (amazon_products instead of Connect)                         │
│  5. NO taxonomy fields (endpoint_type, platform_type, status, etc.)                                  │
│  6. NO connection to network-endpoints.json                                                          │
│                                                                                                      │
└─────────────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐
│             ENDPOINT REGISTRY TABLE - TARGET STATE (Simplified - Pure RDS)                           │
├─────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                      │
│  API: GET /api/v1/taxonomy/endpoints (Connect Gateway)                                               │
│  Data: RDS endpoint_taxonomy ONLY - No merging with JSON                                             │
│                                                                                                      │
│  ┌───────────────────┬────────────────────────┬─────────────────────────────────────────────────────┐│
│  │ TABLE COLUMN      │ SOURCE                 │ NOTES                                               ││
│  ├───────────────────┼────────────────────────┼─────────────────────────────────────────────────────┤│
│  │ site_uid          │ endpoint_taxonomy      │ PRIMARY KEY - issued by Connect Gateway             ││
│  │ domain_name       │ endpoint_taxonomy      │ Main domain for endpoint                            ││
│  │ endpoint_type     │ endpoint_taxonomy      │ W/A/D/ND - set by Radius GUI                        ││
│  │ platform_type     │ endpoint_taxonomy      │ CO/CP/WP/SH/CL/S3/LM/etc.                           ││
│  │ web_protocol      │ endpoint_taxonomy      │ W2/W3                                               ││
│  │ status            │ endpoint_taxonomy      │ planned/wip/live                                    ││
│  │ runtime           │ endpoint_taxonomy      │ Lambda/EC2/Lightsail/etc.                           ││
│  │ host              │ endpoint_taxonomy      │ AWS/External/Partner                                ││
│  │ managed_by        │ endpoint_taxonomy      │ L/R/M (websites only)                               ││
│  │ persistence       │ endpoint_taxonomy      │ D/P (websites only)                                 ││
│  │ website_purpose   │ endpoint_taxonomy      │ brochure/product_store/etc.                         ││
│  │ store_checkout    │ endpoint_taxonomy      │ Y/N (websites only)                                 ││
│  │ created_at        │ endpoint_taxonomy      │ When registered                                     ││
│  │ updated_at        │ endpoint_taxonomy      │ Last taxonomy change                                ││
│  └───────────────────┴────────────────────────┴─────────────────────────────────────────────────────┘│
│                                                                                                      │
│  KEY PRINCIPLE: NO MERGING                                                                           │
│  ─────────────────────────                                                                           │
│  • Endpoint Registry shows TAXONOMY data only (from RDS)                                             │
│  • Live status (green/red/orange/grey) is shown in a SEPARATE Live Table                             │
│  • This eliminates complexity and makes each table single-source                                     │
│                                                                                                      │
│  EXAMPLE RECORD (pure RDS):                                                                          │
│  {                                                                                                   │
│    "site_uid": "SN-00000047",                                                                        │
│    "domain_name": "shop.it.com",                                                                     │
│    "endpoint_type": "W",                                                                             │
│    "platform_type": "CP",                                                                            │
│    "status": "live",             // taxonomy status, not live health                                 │
│    "web_protocol": "W2",                                                                             │
│    "managed_by": "R",                                                                                │
│    "persistence": "P",                                                                               │
│    "website_purpose": "portal",                                                                      │
│    "created_at": "2026-01-24T10:30:00Z",                                                             │
│    "updated_at": "2026-01-24T14:00:00Z"                                                              │
│  }                                                                                                   │
│                                                                                                      │
└─────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## III.11 Data Source Responsibility Matrix (Simplified)

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                     DATA SOURCE RESPONSIBILITY MATRIX - SIMPLIFIED                                   │
├─────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                      │
│   PRINCIPLE: Each GUI component has ONE data source. No merging.                                     │
│                                                                                                      │
│   ┌─────────────────────────────────────────────────────────────────────────────────────────────┐   │
│   │                                                                                             │   │
│   │   CONNECT GATEWAY (JSON)              │   RDS (shopnet_sites)                               │   │
│   │   ═══════════════════════             │   ═══════════════════                               │   │
│   │                                       │                                                     │   │
│   │   OWNS:                               │   OWNS:                                             │   │
│   │   • site_uid generation               │   • Taxonomy fields (endpoint_taxonomy)             │   │
│   │   • Live component status             │   • Website operational data (website_data)         │   │
│   │   • Section/connector layout          │   • Build history                                   │   │
│   │   • Network Map structure             │   • Infrastructure IDs (CloudFront, Route53, etc.)  │   │
│   │                                       │                                                     │   │
│   │   WRITTEN BY:                         │   WRITTEN BY:                                       │   │
│   │   • create_site_uid() API             │   • Radius GUI (taxonomy)                           │   │
│   │   • Health check updates              │   • Radius workflows (builds, status)               │   │
│   │   • Manual JSON edits                 │   • AWS infra modules                               │   │
│   │                                       │                                                     │   │
│   │   BACKED UP TO:                       │   BACKED UP BY:                                     │   │
│   │   • RDS json_backup table (hourly)    │   • AWS RDS snapshots (daily)                       │   │
│   │                                       │                                                     │   │
│   └─────────────────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                                      │
│   ─────────────────────────────────────────────────────────────────────────────────────────────────  │
│                                                                                                      │
│   CONSOLE GUI - SINGLE SOURCE PER COMPONENT:                                                         │
│   ══════════════════════════════════════════                                                         │
│                                                                                                      │
│   ┌─────────────────────┬───────────────────┬───────────────────────────────────────────────────┐   │
│   │ GUI Component       │ Source            │ API                                               │   │
│   ├─────────────────────┼───────────────────┼───────────────────────────────────────────────────┤   │
│   │ Endpoint Registry   │ RDS ONLY          │ GET /api/v1/taxonomy/endpoints                    │   │
│   │ (taxonomy table)    │                   │                                                   │   │
│   ├─────────────────────┼───────────────────┼───────────────────────────────────────────────────┤   │
│   │ Live Status Table   │ JSON ONLY         │ GET /api/v1/network/live                          │   │
│   │ (health/operations) │                   │                                                   │   │
│   ├─────────────────────┼───────────────────┼───────────────────────────────────────────────────┤   │
│   │ Network Map         │ JSON ONLY         │ GET /api/v1/network/status                        │   │
│   │ (visual diagram)    │                   │                                                   │   │
│   ├─────────────────────┼───────────────────┼───────────────────────────────────────────────────┤   │
│   │ Site Cards          │ RDS + overlay     │ GET /api/v1/sites/cards                           │   │
│   │                     │                   │ Content from RDS, live color from JSON            │   │
│   │                     │                   │ (if site_uid in JSON → color, else grey)          │   │
│   └─────────────────────┴───────────────────┴───────────────────────────────────────────────────┘   │
│                                                                                                      │
│   ─────────────────────────────────────────────────────────────────────────────────────────────────  │
│                                                                                                      │
│   CHANGES FLOW:                                                                                      │
│   ─────────────                                                                                      │
│   • New endpoint      → Radius → Connect GW (site_uid) → JSON + RDS                                  │
│   • Taxonomy change   → Radius → RDS only                                                            │
│   • Build/deploy      → Radius → RDS (website_data)                                                  │
│   • Health change     → Health checker → JSON only (backed up hourly)                                │
│                                                                                                      │
└─────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

# PART IV: Three-Table RDS Schema & Implementation

This section defines the final RDS schema and the implementation plan.

---

## IV.1 The Three Tables (No Redundancy)

The shopnet_sites RDS database will have exactly THREE tables. No field duplication except site_uid (the join key).

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                              THE THREE TABLES - shopnet_sites RDS                                    │
├─────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                      │
│   ┌─────────────────────────────────────────────────────────────────────────────────────────────┐   │
│   │                                                                                             │   │
│   │   TABLE 1: endpoint_taxonomy                                                                │   │
│   │   ══════════════════════════                                                                │   │
│   │   Purpose: Source of truth for ALL endpoint classifications                                 │   │
│   │   Scope: All endpoints (W, A, D, ND)                                                        │   │
│   │   Written by: Radius GUI                                                                    │   │
│   │   Read by: Console Endpoint Registry, Site Cards                                            │   │
│   │                                                                                             │   │
│   │   ┌─────────────────────────────────────────────────────────────────────────────────────┐   │   │
│   │   │ COLUMN           │ TYPE          │ CONSTRAINTS        │ NOTES                      │   │   │
│   │   ├──────────────────┼───────────────┼────────────────────┼────────────────────────────┤   │   │
│   │   │ site_uid         │ VARCHAR(12)   │ PRIMARY KEY        │ SN-XXXXXXXX (THE LAW)      │   │   │
│   │   │ domain_name      │ VARCHAR(255)  │ NOT NULL UNIQUE    │ Primary domain             │   │   │
│   │   │ endpoint_type    │ CHAR(2)       │ NOT NULL           │ W / A / D / ND             │   │   │
│   │   │ platform_type    │ VARCHAR(3)    │ NOT NULL           │ CO/CP/WP/SH/CL/S3/LM/etc.  │   │   │
│   │   │ web_protocol     │ CHAR(2)       │ NOT NULL           │ W2 / W3                    │   │   │
│   │   │ status           │ VARCHAR(10)   │ NOT NULL           │ planned / wip / live       │   │   │
│   │   │ runtime          │ VARCHAR(20)   │                    │ Lambda/EC2/Lightsail/etc.  │   │   │
│   │   │ host             │ VARCHAR(20)   │                    │ AWS/External/Partner       │   │   │
│   │   │ managed_by       │ CHAR(1)       │                    │ L/R/M (W only)             │   │   │
│   │   │ persistence      │ CHAR(1)       │                    │ D/P (W only)               │   │   │
│   │   │ website_purpose  │ VARCHAR(20)   │                    │ brochure/store/etc (W only)│   │   │
│   │   │ store_checkout   │ CHAR(1)       │                    │ Y/N (W only)               │   │   │
│   │   │ created_at       │ TIMESTAMP     │ NOT NULL           │ When registered            │   │   │
│   │   │ updated_at       │ TIMESTAMP     │ NOT NULL           │ Last taxonomy change       │   │   │
│   │   └──────────────────┴───────────────┴────────────────────┴────────────────────────────┘   │   │
│   │                                                                                             │   │
│   └─────────────────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                                      │
│                                          │                                                           │
│                                          │ FK: site_uid                                              │
│                                          ▼                                                           │
│                                                                                                      │
│   ┌─────────────────────────────────────────────────────────────────────────────────────────────┐   │
│   │                                                                                             │   │
│   │   TABLE 2: website_data                                                                     │   │
│   │   ═════════════════════                                                                     │   │
│   │   Purpose: Operational data for WEBSITES ONLY (endpoint_type = 'W')                         │   │
│   │   Written by: Radius workflows, AWS infra modules                                           │   │
│   │   Read by: Site Cards, Radius deployer                                                      │   │
│   │                                                                                             │   │
│   │   ┌─────────────────────────────────────────────────────────────────────────────────────┐   │   │
│   │   │ COLUMN           │ TYPE          │ CONSTRAINTS        │ NOTES                      │   │   │
│   │   ├──────────────────┼───────────────┼────────────────────┼────────────────────────────┤   │   │
│   │   │ site_uid         │ VARCHAR(12)   │ PRIMARY KEY, FK    │ References endpoint_taxonomy│  │   │
│   │   │ template_id      │ VARCHAR(50)   │                    │ Which template version     │   │   │
│   │   │ site_content     │ JSONB         │                    │ Content for rendering      │   │   │
│   │   │ html_s3_path     │ VARCHAR(255)  │                    │ Path to generated HTML     │   │   │
│   │   │ build_status     │ VARCHAR(20)   │                    │ pending/building/deployed  │   │   │
│   │   │ build_error      │ TEXT          │                    │ Error message if failed    │   │   │
│   │   │ dns_status       │ VARCHAR(20)   │                    │ pending/active/failed      │   │   │
│   │   │ ssl_status       │ VARCHAR(20)   │                    │ pending/issued/expired     │   │   │
│   │   │ cloudfront_id    │ VARCHAR(50)   │                    │ CDN distribution ID        │   │   │
│   │   │ cloudfront_domain│ VARCHAR(255)  │                    │ CDN domain                 │   │   │
│   │   │ route53_zone_id  │ VARCHAR(50)   │                    │ DNS zone ID                │   │   │
│   │   │ acm_cert_arn     │ VARCHAR(255)  │                    │ SSL certificate ARN        │   │   │
│   │   │ last_build_at    │ TIMESTAMP     │                    │ When last built            │   │   │
│   │   │ last_deploy_at   │ TIMESTAMP     │                    │ When last deployed         │   │   │
│   │   └──────────────────┴───────────────┴────────────────────┴────────────────────────────┘   │   │
│   │                                                                                             │   │
│   └─────────────────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                                      │
│                                                                                                      │
│   ┌─────────────────────────────────────────────────────────────────────────────────────────────┐   │
│   │                                                                                             │   │
│   │   TABLE 3: json_backup                                                                      │   │
│   │   ════════════════════                                                                      │   │
│   │   Purpose: Backup of network-endpoints.json fields (disaster recovery)                      │   │
│   │   Written by: Connect Gateway backup process (hourly)                                       │   │
│   │   Read by: Disaster recovery only (NOT used for display)                                    │   │
│   │                                                                                             │   │
│   │   ┌─────────────────────────────────────────────────────────────────────────────────────┐   │   │
│   │   │ COLUMN           │ TYPE          │ CONSTRAINTS        │ NOTES                      │   │   │
│   │   ├──────────────────┼───────────────┼────────────────────┼────────────────────────────┤   │   │
│   │   │ site_uid         │ VARCHAR(12)   │ PRIMARY KEY        │ From JSON component        │   │   │
│   │   │ section_name     │ VARCHAR(50)   │ NOT NULL           │ Which section in JSON      │   │   │
│   │   │ component_key    │ VARCHAR(100)  │ NOT NULL           │ Key name in JSON           │   │   │
│   │   │ live_status      │ VARCHAR(20)   │                    │ green/red/orange/grey      │   │   │
│   │   │ label            │ VARCHAR(255)  │                    │ Display label              │   │   │
│   │   │ url              │ VARCHAR(255)  │                    │ Component URL              │   │   │
│   │   │ component_type   │ VARCHAR(50)   │                    │ database/storage/agent/etc │   │   │
│   │   │ ip_address       │ VARCHAR(50)   │                    │ IP or service name         │   │   │
│   │   │ instance_type    │ VARCHAR(50)   │                    │ EC2/Lambda/Lightsail/etc   │   │   │
│   │   │ notes            │ TEXT          │                    │ Human notes                │   │   │
│   │   │ uses_connect     │ BOOLEAN       │                    │ Calls Connect API?         │   │   │
│   │   │ json_updated_at  │ TIMESTAMP     │                    │ When JSON was updated      │   │   │
│   │   │ backed_up_at     │ TIMESTAMP     │ DEFAULT NOW()      │ When backup ran            │   │   │
│   │   └──────────────────┴───────────────┴────────────────────┴────────────────────────────┘   │   │
│   │                                                                                             │   │
│   │   Full database backup provided by RDS automated snapshots (daily/monthly)                  │   │
│   │                                                                                             │   │
│   └─────────────────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                                      │
└─────────────────────────────────────────────────────────────────────────────────────────────────────┘

                              NO REDUNDANCY PRINCIPLE

   ┌──────────────────────────────────────────────────────────────────────────────────────────────┐
   │                                                                                              │
   │   EACH FIELD EXISTS IN EXACTLY ONE TABLE (except site_uid which is the join key):           │
   │                                                                                              │
   │   endpoint_taxonomy     │  website_data         │  json_backup                               │
   │   (classification)      │  (operations)         │  (live status backup)                      │
   │   ──────────────────────┼───────────────────────┼────────────────────────────────────────────│
   │   domain_name           │  template_id          │  section_name                              │
   │   endpoint_type         │  site_content         │  component_key                             │
   │   platform_type         │  html_s3_path         │  live_status                               │
   │   web_protocol          │  build_status         │  label                                     │
   │   status                │  build_error          │  url                                       │
   │   runtime               │  dns_status           │  component_type                            │
   │   host                  │  ssl_status           │  ip_address                                │
   │   managed_by            │  cloudfront_id        │  instance_type                             │
   │   persistence           │  cloudfront_domain    │  notes                                     │
   │   website_purpose       │  route53_zone_id      │  uses_connect                              │
   │   store_checkout        │  acm_cert_arn         │  json_updated_at                           │
   │   created_at            │  last_build_at        │  backed_up_at                              │
   │   updated_at            │  last_deploy_at       │                                            │
   │                                                                                              │
   │   TO GET FULL PICTURE: Join tables on site_uid                                               │
   │                                                                                              │
   └──────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## IV.2 SQL Schema (Ready to Execute)

```sql
-- ============================================================================
-- THE LAW: Three-Table RDS Schema for shopnet_sites
-- Execute in shopnet_sites database
-- ============================================================================

-- Drop existing tables if rebuilding (CAREFUL!)
-- DROP TABLE IF EXISTS json_backup CASCADE;
-- DROP TABLE IF EXISTS website_data CASCADE;
-- DROP TABLE IF EXISTS endpoint_taxonomy CASCADE;

-- TABLE 1: endpoint_taxonomy (Source of Truth for Classifications)
CREATE TABLE IF NOT EXISTS endpoint_taxonomy (
    site_uid         VARCHAR(12)   PRIMARY KEY,  -- SN-XXXXXXXX
    domain_name      VARCHAR(255)  NOT NULL UNIQUE,
    endpoint_type    CHAR(2)       NOT NULL,     -- W, A, D, ND
    platform_type    VARCHAR(3)    NOT NULL,     -- CO, CP, WP, SH, CL, S3, LM, etc.
    web_protocol     CHAR(2)       NOT NULL DEFAULT 'W2',  -- W2, W3
    status           VARCHAR(10)   NOT NULL DEFAULT 'planned',  -- planned, wip, live
    runtime          VARCHAR(20),                -- Lambda, EC2, Lightsail, etc.
    host             VARCHAR(20),                -- AWS, External, Partner
    -- Website-specific fields (nullable for non-W types)
    managed_by       CHAR(1),                    -- L, R, M
    persistence      CHAR(1),                    -- D, P
    website_purpose  VARCHAR(20),                -- brochure, product_store, domain_store, portal, console
    store_checkout   CHAR(1),                    -- Y, N
    -- Timestamps
    created_at       TIMESTAMP     NOT NULL DEFAULT NOW(),
    updated_at       TIMESTAMP     NOT NULL DEFAULT NOW(),

    -- Constraints
    CONSTRAINT chk_endpoint_type CHECK (endpoint_type IN ('W', 'A', 'D', 'ND')),
    CONSTRAINT chk_web_protocol CHECK (web_protocol IN ('W2', 'W3')),
    CONSTRAINT chk_status CHECK (status IN ('planned', 'wip', 'live')),
    CONSTRAINT chk_managed_by CHECK (managed_by IS NULL OR managed_by IN ('L', 'R', 'M')),
    CONSTRAINT chk_persistence CHECK (persistence IS NULL OR persistence IN ('D', 'P')),
    CONSTRAINT chk_store_checkout CHECK (store_checkout IS NULL OR store_checkout IN ('Y', 'N'))
);

-- TABLE 2: website_data (Operational Data for Websites)
CREATE TABLE IF NOT EXISTS website_data (
    site_uid          VARCHAR(12)   PRIMARY KEY REFERENCES endpoint_taxonomy(site_uid),
    template_id       VARCHAR(50),
    site_content      JSONB,
    html_s3_path      VARCHAR(255),
    build_status      VARCHAR(20)   DEFAULT 'pending',  -- pending, building, deploying, deployed, failed
    build_error       TEXT,
    dns_status        VARCHAR(20)   DEFAULT 'pending',  -- pending, active, failed
    ssl_status        VARCHAR(20)   DEFAULT 'pending',  -- pending, issued, expired
    cloudfront_id     VARCHAR(50),
    cloudfront_domain VARCHAR(255),
    route53_zone_id   VARCHAR(50),
    acm_cert_arn      VARCHAR(255),
    last_build_at     TIMESTAMP,
    last_deploy_at    TIMESTAMP
);

-- TABLE 3: json_backup (Backup of network-endpoints.json Fields)
CREATE TABLE IF NOT EXISTS json_backup (
    site_uid          VARCHAR(12)   PRIMARY KEY,
    section_name      VARCHAR(50)   NOT NULL,
    component_key     VARCHAR(100)  NOT NULL,
    live_status       VARCHAR(20),   -- green, red, orange, grey
    label             VARCHAR(255),
    url               VARCHAR(255),
    component_type    VARCHAR(50),   -- database, storage, agent, etc.
    ip_address        VARCHAR(50),
    instance_type     VARCHAR(50),   -- EC2, Lambda, Lightsail, etc.
    notes             TEXT,
    uses_connect      BOOLEAN       DEFAULT FALSE,
    json_updated_at   TIMESTAMP,
    backed_up_at      TIMESTAMP     DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_taxonomy_endpoint_type ON endpoint_taxonomy(endpoint_type);
CREATE INDEX IF NOT EXISTS idx_taxonomy_platform_type ON endpoint_taxonomy(platform_type);
CREATE INDEX IF NOT EXISTS idx_taxonomy_status ON endpoint_taxonomy(status);
CREATE INDEX IF NOT EXISTS idx_taxonomy_domain ON endpoint_taxonomy(domain_name);
CREATE INDEX IF NOT EXISTS idx_website_build_status ON website_data(build_status);
CREATE INDEX IF NOT EXISTS idx_json_backup_section ON json_backup(section_name);

-- Trigger to update updated_at on taxonomy changes
CREATE OR REPLACE FUNCTION update_taxonomy_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_taxonomy_updated ON endpoint_taxonomy;
CREATE TRIGGER trg_taxonomy_updated
    BEFORE UPDATE ON endpoint_taxonomy
    FOR EACH ROW
    EXECUTE FUNCTION update_taxonomy_timestamp();
```

---

## IV.3 How the Bill Becomes The LAW

This section outlines the implementation steps to transition from the current broken state to THE LAW.

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                              HOW THE BILL BECOMES THE LAW                                            │
│                              Implementation Phases                                                   │
├─────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                      │
│   PHASE 1: DATABASE SETUP                                                                            │
│   ═══════════════════════                                                                            │
│   □ Execute SQL schema in shopnet_sites RDS                                                          │
│   □ Create endpoint_taxonomy table                                                                   │
│   □ Create website_data table                                                                        │
│   □ Create json_backup table                                                                         │
│   □ Create indexes and triggers                                                                      │
│   □ Verify tables exist and constraints work                                                         │
│                                                                                                      │
│   PHASE 2: CONNECT GATEWAY UPDATES                                                                   │
│   ════════════════════════════════                                                                   │
│   □ Add site_uid field to each component in network-endpoints.json                                   │
│   □ Add create_site_uid() API endpoint                                                               │
│   □ Add next_site_uid counter to JSON metadata                                                       │
│   □ Update backup process to write to json_backup table (field-by-field)                             │
│   □ Add /api/v1/network/live endpoint for Live Status Table                                          │
│   □ Test site_uid generation and backup                                                              │
│                                                                                                      │
│   PHASE 3: SEED EXISTING DATA                                                                        │
│   ═══════════════════════════                                                                        │
│   □ Generate site_uid for all existing endpoints in JSON                                             │
│   □ Populate endpoint_taxonomy from current known sites                                              │
│   □ Populate website_data for websites (from existing RDS if available)                              │
│   □ Run initial backup to json_backup                                                                │
│   □ Verify data integrity                                                                            │
│                                                                                                      │
│   PHASE 4: RADIUS UPDATES                                                                            │
│   ═══════════════════════                                                                            │
│   □ Update site_registry module to call Connect Gateway for site_uid                                 │
│   □ Update rds_manager to write to endpoint_taxonomy                                                 │
│   □ Update rds_manager to write to website_data                                                      │
│   □ Update config_fetcher to read from endpoint_taxonomy                                             │
│   □ Test CREATE workflow with new tables                                                             │
│   □ Test UPDATE workflow with new tables                                                             │
│   □ Test DELETE workflow (mark_deleted, no reuse)                                                    │
│                                                                                                      │
│   PHASE 5: CONSOLE GUI UPDATES                                                                       │
│   ══════════════════════════                                                                         │
│   □ Create new Endpoint Registry component (pure RDS)                                                │
│   □ Create new Live Status Table component (pure JSON)                                               │
│   □ Update Site Cards to use RDS + live status overlay                                               │
│   □ Add API endpoint: GET /api/v1/taxonomy/endpoints                                                 │
│   □ Add API endpoint: GET /api/v1/sites/cards                                                        │
│   □ Delete brochure-sites.json                                                                       │
│   □ Remove hardcoded ENDPOINT_REGISTRY dict                                                          │
│   □ Test Console with new data sources                                                               │
│                                                                                                      │
│   PHASE 6: LAMBDA UPDATES                                                                            │
│   ════════════════════════                                                                           │
│   □ Remove get_or_assign_site_uid() from Lambda (violates THE LAW)                                   │
│   □ Lambda calls Connect Gateway for site_uid                                                        │
│   □ Lambda writes to endpoint_taxonomy via Connect Gateway                                           │
│   □ Test Lambda site creation with new flow                                                          │
│                                                                                                      │
│   PHASE 7: CLEANUP                                                                                   │
│   ════════════════                                                                                   │
│   □ Delete brochure-sites.json                                                                       │
│   □ Remove deprecated code paths                                                                     │
│   □ Archive old database tables (if any)                                                             │
│   □ Update documentation                                                                             │
│   □ Final verification                                                                               │
│                                                                                                      │
└─────────────────────────────────────────────────────────────────────────────────────────────────────┘

                              IMPLEMENTATION ORDER

    ┌─────────────────────────────────────────────────────────────────────────────────────────┐
    │                                                                                         │
    │   Phase 1        Phase 2          Phase 3        Phase 4       Phase 5       Phase 6   │
    │   ────────       ────────         ────────       ────────      ────────      ────────  │
    │                                                                                         │
    │   RDS Tables  →  Connect GW   →   Seed Data  →   Radius    →   Console   →   Lambda   │
    │   (schema)       (site_uid API)   (populate)     (workflows)   (GUI)         (fix)     │
    │                                                                                         │
    │                                                                                         │
    │   Can start                       Requires       Requires      Requires     Requires   │
    │   immediately                     Phase 2        Phase 3       Phase 4      Phase 2    │
    │                                                                                         │
    └─────────────────────────────────────────────────────────────────────────────────────────┘

                              VERIFICATION CHECKLIST

   ┌──────────────────────────────────────────────────────────────────────────────────────────┐
   │                                                                                          │
   │   After implementation, verify THE LAW is enforced:                                      │
   │                                                                                          │
   │   □ Every endpoint has a site_uid in format SN-XXXXXXXX                                  │
   │   □ site_uid is issued ONLY by Connect Gateway                                           │
   │   □ site_uid exists in network-endpoints.json (source of truth)                          │
   │   □ site_uid is backed up to json_backup table (hourly)                                  │
   │   □ Taxonomy data is in endpoint_taxonomy table (source of truth)                        │
   │   □ Website operational data is in website_data table                                    │
   │   □ Console Endpoint Registry reads from RDS only                                        │
   │   □ Console Live Table reads from JSON only                                              │
   │   □ Site Cards show RDS content + JSON live status overlay                               │
   │   □ Deleted site_uids are marked deleted, NEVER reused                                   │
   │   □ brochure-sites.json is DELETED                                                       │
   │   □ ENDPOINT_REGISTRY hardcoded dict is REMOVED                                          │
   │                                                                                          │
   └──────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## IV.4 Save THE LAW

Once approved, THE LAW should be saved to:

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                              SAVE THE LAW TO THESE LOCATIONS                                         │
├─────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                      │
│   PRIMARY LOCATIONS:                                                                                 │
│   ══════════════════                                                                                 │
│   1. /Users/tim001/VSCode/shopnet-console/ThisIsTheLaw.md              (current location)            │
│   2. /Users/tim001/VSCode/connect.shopnet/docs/ThisIsTheLaw.md         (Connect Gateway repo)        │
│   3. /Users/tim001/VSCode/shopnet-console/radius/docs/ThisIsTheLaw.md  (Radius module)               │
│                                                                                                      │
│   BACKUP LOCATIONS:                                                                                  │
│   ═════════════════                                                                                  │
│   4. S3: shopnet-domain-images/docs/ThisIsTheLaw-v{VERSION}.md         (versioned backup)            │
│   5. RDS: Automated daily/monthly snapshots via AWS Backup                                           │
│                                                                                                      │
│   REFERENCE IN CODE:                                                                                 │
│   ══════════════════                                                                                 │
│   6. Add header comment in site_registry/registry.py referencing THE LAW                             │
│   7. Add header comment in shopnet_connect_api.py referencing THE LAW                                │
│   8. Add header comment in rds_manager/handler.py referencing THE LAW                                │
│                                                                                                      │
└─────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

# PART V: HOW DATA ARE USED (Console GUI)

## V.1 Overview: Console GUI Data Sources

The Console GUI has three main data display areas, each with specific data sources:

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                              CONSOLE GUI DATA FLOW (v3.3)                                            │
├─────────────────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                                      │
│                                      CONSOLE GUI                                                     │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────┐ │
│  │    NETWORK CARDS     │  │    GITHUB CARDS      │  │  ENDPOINT REGISTRY   │  │    LIVE STATUS   │ │
│  │ (renderNetworkCard)  │  │ (renderGitHubCard)   │  │      TABLE           │  │      TABLE       │ │
│  └──────────┬───────────┘  └──────────┬───────────┘  └──────────┬───────────┘  └──────────┬───────┘ │
│             │                         │                         │                         │          │
│             ▼                         ▼                         ▼                         ▼          │
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐  ┌──────────────────┐ │
│  │ /api/v1/sites/cards  │  │ /api/github/cards    │  │ Connect Gateway      │  │ Connect Gateway  │ │
│  │ (Console app.py)     │  │ (Console app.py)     │  │ /taxonomy/endpoints  │  │ /network/live    │ │
│  └──────────┬───────────┘  └──────────┬───────────┘  └──────────┬───────────┘  └──────────┬───────┘ │
│             │                         │                         │                         │          │
│             ▼                         ▼                         ▼                         ▼          │
│  ┌─────────────────────────────────────────────────────────────────────┐     ┌──────────────────┐   │
│  │                         RDS (THE LAW)                               │     │ network-endpoints│   │
│  │  ├─ endpoint_taxonomy (Table 1)                                     │     │      .json       │   │
│  │  ├─ website_data (Table 2)                                          │     │  (live health)   │   │
│  │  ├─ json_backup (Table 3)                                           │     └──────────────────┘   │
│  │  └─ github_cards (Table 4) ← NEW                                    │                            │
│  └─────────────────────────────────────────────────────────────────────┘                            │
│                                                                                                      │
└─────────────────────────────────────────────────────────────────────────────────────────────────────┘
```

## V.2 Network Cards (Unified)

### renderNetworkCard() - All Network Endpoint Cards

**Replaces:** `renderSiteCard()`, `renderBrochureCard()`, `renderWeb3Card()` (all removed in v3.3)

**API Endpoint:** `/api/v1/sites/cards` (Console app.py → RDS + Live overlay)

**Click Action:** `openChangeSiteModal(siteUid)` → Opens Radius "Change Site" modal

```
┌─────────────────────────────────────────────────────────────────┐
│ ● [SN-XXXXXXXX]                                             [↗] │
│                                                                 │
│ domain-name.com                                                 │
│ [W] [CO] [L]                                                    │
│                                                                 │
│ Sample notes for this endpoint                                  │
│                                                                 │
│ ─────────────────────────────────────────────────────────────── │
│ 1/25/2026                                           ONLINE      │
└─────────────────────────────────────────────────────────────────┘
```

| Card Element | Data Field | Source |
|--------------|------------|--------|
| Status dot (●) | status + health_status | RDS status (planned/wip/live) + JSON health overlay |
| Site UID badge | site_uid | endpoint_taxonomy - RDS |
| External link [↗] | domain_name | endpoint_taxonomy - RDS |
| Domain title | domain_name, label | endpoint_taxonomy - RDS |
| Endpoint type [W] | endpoint_type | endpoint_taxonomy - RDS (W/A/D/ND) |
| Platform type [CO] | platform_type | endpoint_taxonomy - RDS |
| Managed by [L] | managed_by | endpoint_taxonomy - RDS (L/R/M) |
| Notes | notes | endpoint_taxonomy - RDS |
| Footer date | updated_at | endpoint_taxonomy - RDS |
| Footer status | status + health_status | See status logic below |

**Status Logic (THE LAW):**
| RDS Status | Health Status | Dot Color | Display Text |
|------------|---------------|-----------|--------------|
| planned | - | Grey | Placeholder |
| wip | - | Orange | Building |
| live | online | Green | Online |
| live | degraded | Orange | Degraded |
| live | offline | Red | Offline |

**Used in Console Sections:**
- Brochure Sites (loadBrochureSites → website_purpose='brochure')
- Product Stores (loadBrochureSites → website_purpose='product_store')
- Domain Stores (loadBrochureSites → website_purpose='domain_store')
- Web3 Sites (loadWeb3Sites)
- AI Agents (endpoint_type='A') - placeholder cards pending RDS population

## V.2.5 GitHub Cards

### renderGitHubCard() - GitHub Module Cards

**NEW in v3.3** - For GitHub-stored modules, templates, and documentation

**API Endpoint:** `/api/github/cards` (Console app.py → RDS github_cards table)

**Click Action:** `openDocumentViewer(idOrPath)` → Opens document viewer modal

```
┌─────────────────────────────────────────────────────────────────┐
│ ● [module-name]                                             [⚙] │
│                                                                 │
│ Module Display Name                                             │
│ [template] [JavaScript]                                         │
│                                                                 │
│ Description of the module                                       │
│                                                                 │
│ ─────────────────────────────────────────────────────────────── │
│ ↩ 1/22/2026                                              Active │
└─────────────────────────────────────────────────────────────────┘
```

| Card Element | Data Field | Source |
|--------------|------------|--------|
| Status dot (●) | last_commit_at | Calculated freshness from RDS |
| Module name badge | file_path (short) | github_cards - RDS |
| GitHub link [⚙] | github_url | github_cards - RDS |
| Title | module_name | github_cards - RDS |
| Type badge [template] | module_type | github_cards - RDS |
| Language badge | primary_language | github_cards - RDS |
| Description | description | github_cards - RDS |
| Commit date | last_commit_at | github_cards - RDS (synced daily) |
| Freshness text | last_commit_at | Calculated (see freshness logic) |

**Freshness Logic (Based on last_commit_at):**
| Days Since Commit | Dot Color | Display Text |
|-------------------|-----------|--------------|
| < 1 day | Green | Recent |
| < 7 days | Blue | Active |
| < 30 days | Grey | Stable |
| > 30 days | Orange | Stale |

**Used in Console Sections:**
- GitHub Modules (loadGitHubModules → console_section='github_modules')
- Plugin Library (console_section='plugin_library')
- Documentation (console_section='docs')

**Data Sync:** Daily cron via `/radius/scripts/sync_github_cards.py`

## V.3 Endpoint Registry Table

**API Endpoint:** `https://connect.shopnet.network/api/v1/taxonomy/endpoints`
**Source:** Connect Gateway → RDS endpoint_taxonomy table

### All endpoint_taxonomy Fields

| Table Column | Field Name | Source | Values |
|--------------|------------|--------|--------|
| UID | site_uid | endpoint_taxonomy | SN-XXXXXXXX |
| Domain | domain_name | endpoint_taxonomy | domain.com |
| Type | endpoint_type | endpoint_taxonomy | W, A, D, ND |
| Platform | platform_type | endpoint_taxonomy | CO, CP, WP, WW, SH, CL, GP, GM, S3, RD, LM, R53, CF, FN, OT |
| Protocol | web_protocol | endpoint_taxonomy | W2 (Web2), W3 (Web3) |
| Status | status | endpoint_taxonomy | planned, wip, live |
| Runtime | runtime | endpoint_taxonomy | Lambda, EC2, Lightsail, nginx, php, s3, external, n/a |
| Host | host | endpoint_taxonomy | api_gateway, ec2, s3, rds, external |
| Managed | managed_by | endpoint_taxonomy | L (Lambda), R (Radius), M (Manual) - websites only |
| Persist | persistence | endpoint_taxonomy | D (On-Demand), P (Persistent) - websites only |
| Purpose | website_purpose | endpoint_taxonomy | brochure, product_store, domain_store, portal, console, other |
| Checkout | store_checkout | endpoint_taxonomy | Y, N - websites only |
| Agent Type | agent_type | endpoint_taxonomy | product_assist, domain_assist, content_assist - agents only |
| Notes | notes | endpoint_taxonomy | User notes from wizard form |
| Created By | created_by | endpoint_taxonomy | Email of user who created |
| Created | created_at | endpoint_taxonomy | timestamp |
| Updated | updated_at | endpoint_taxonomy | timestamp (auto-updated) |
| Deleted | deleted_at | endpoint_taxonomy | Soft-delete timestamp (NULL = active) |

### Platform Type by Endpoint Type

| endpoint_type | Valid platform_type Values |
|---------------|---------------------------|
| W (Website) | CO (Custom On-Demand), CP (Custom Persistent), WP (WordPress), WW (WooCommerce), SH (Shopify) |
| A (Agent) | CL (Claude), GP (GPT), GM (Gemini), CU (Custom), OT (Other) |
| D (Database) | S3, RD (RDS) |
| ND (Node) | LM (Lambda), R53 (Route53), CF (CloudFront), FN (Freename), OT (Other) |

### Agent Type Values (for endpoint_type='A')

| agent_type | Description |
|------------|-------------|
| product_assist | Product catalog assistant |
| domain_assist | Domain search/registration assistant |
| content_assist | Content generation assistant |

## V.4 Live Status Table (Network JSON)

**API Endpoint:** `https://connect.shopnet.network/api/v1/network/live`
**Source:** Connect Gateway → network-endpoints.json file

| Table Column | Field Name | Source | Description |
|--------------|------------|--------|-------------|
| Status | status | network-endpoints.json | green, red, orange, grey |
| UID | site_uid | network-endpoints.json | SN-XXXXXXXX |
| Label | label / component_key | network-endpoints.json | Display name |
| Section | section | network-endpoints.json | brochure, products, agents, etc. |
| Type | type | network-endpoints.json | Component type |
| Instance | instance / ip | network-endpoints.json | CloudFront, RDS, S3, IP |
| Notes | notes | network-endpoints.json | Human notes |

## V.5 Data Source Summary

| GUI Component | Primary Source | Secondary Source | Render Function | Purpose |
|---------------|----------------|------------------|-----------------|---------|
| Network Cards | RDS (endpoint_taxonomy) | **LIVE JSON** for health_status | `renderNetworkCard()` | Unified cards for all endpoints |
| GitHub Cards | RDS (github_cards) | Daily sync from GitHub API | `renderGitHubCard()` | GitHub modules/templates |
| Endpoint Registry | RDS (endpoint_taxonomy) | None | Table render | Pure classification data |
| Live Status Table | network-endpoints.json | None | Table render | Real-time health status |

**Console Panels Using Network Cards:**
| Panel | Load Function | Filter |
|-------|--------------|--------|
| Brochure Sites | `loadBrochureSites()` | website_purpose='brochure' |
| Product Stores | `loadBrochureSites()` | website_purpose='product_store' |
| Domain Stores | `loadBrochureSites()` | website_purpose='domain_store' |
| Web3 Sites | `loadWeb3Sites()` | web_protocol='W3' |
| AI Agents | Static (pending) | endpoint_type='A' |

**Console Panels Using GitHub Cards:**
| Panel | Load Function | Filter |
|-------|--------------|--------|
| GitHub Modules | `loadGitHubModules()` | console_section='github_modules' |

## V.6 Field Responsibility Matrix

| Field | Written By | Read By | Stored In |
|-------|------------|---------|-----------|
| site_uid | Connect Gateway ONLY | All | endpoint_taxonomy, network-endpoints.json |
| domain_name | Radius, Connect Gateway | Console, Cards | endpoint_taxonomy |
| endpoint_type | Radius wizard | Endpoint Registry | endpoint_taxonomy |
| platform_type | Radius wizard | Endpoint Registry, Cards | endpoint_taxonomy |
| managed_by | Radius wizard | Endpoint Registry, Cards | endpoint_taxonomy |
| persistence | Radius wizard | Endpoint Registry | endpoint_taxonomy |
| agent_type | Radius wizard | AI Agents section | endpoint_taxonomy |
| notes (taxonomy) | User via wizard | Audit | endpoint_taxonomy |
| notes (operational) | Manual / Connect API | Cards | LIVE JSON → json_backup (fallback) |
| created_by | Console session | Audit trail | endpoint_taxonomy |
| live_status | Health checks | Live Table, Cards | LIVE JSON → json_backup (fallback) |
| build_status | Radius workflows | Cards | website_data |
| dns_status | AWS Infra module | Cards | website_data |
| ssl_status | AWS Infra module | Cards | website_data |
| cloudfront_status | AWS Infra module | Cards | website_data |

---

---

# PART VI: Network Identity Hierarchy (agent_uid)

**Added:** February 5-6, 2026

Every AI agent in the ShopNet network receives BOTH a `site_uid` (as a network endpoint) AND an `agent_uid` (as an operational agent). This is THE LAW.

---

## VI.1 Two-Level Identity System

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    NETWORK IDENTITY HIERARCHY                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  Level 0 (Endpoint):  site_uid   SN-XXXXXXXX                           │
│    - Fundamental network identity                                       │
│    - Every endpoint gets one (websites, agents, databases, nodes)       │
│    - Stored in: endpoint_taxonomy (PK)                                  │
│    - Counter: metadata.next_site_uid                                    │
│                                                                         │
│  Level 1 (Instance):  agent_uid  SA-XXXXXXXX                           │
│    - Agent-specific operational identity                                │
│    - Only agents get one (subset of endpoints)                          │
│    - Stored in: shopnet_assist.agents (UNIQUE)                          │
│    - Counter: metadata.next_agent_uid                                   │
│    - REQUIRES site_uid first (cannot exist without Level 0)             │
│                                                                         │
│  Level 2 (Assignment): Future                                           │
│    - Maps agent instances to specific endpoints                         │
│    - e.g., "SA-00000001 serves SN-00000001 through SN-00000048"         │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## VI.2 agent_uid Format

| Attribute | Value |
|-----------|-------|
| **Field Name** | `agent_uid` |
| **Type** | VARCHAR(12) |
| **Format** | `SA-XXXXXXXX` |
| **Example** | `SA-00000001`, `SA-00000008` |
| **Required** | YES (for agents) |
| **Mutable** | NO - NEVER CHANGES |
| **Assigned By** | Connect Gateway ONLY |
| **Never Reused** | Even after agent deletion |

```
┌─────────────────────────────────────────────────────────────────────────┐
│                       agent_uid FORMAT                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│                    S A - 0 0 0 0 0 0 0 1                                │
│                    ─┬─   ─────────┬─────                                │
│                     │             │                                     │
│                     │             └── 8-digit zero-padded integer       │
│                     │                 (sequential, never reused)        │
│                     │                                                   │
│                     └── Prefix "SA-" (Shopnet Agent)                    │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## VI.3 How agent_uid Issuance Works

Two-step registration process:

```
STEP 1: Add Endpoint Wizard (site_uid)
  └── Registers agent as Endpoint Type 'A' in endpoint_taxonomy
  └── Assigns site_uid (SN-XXXXXXXX) via Connect Gateway
  └── Creates S3 folder SN-XXXXXXXX/
  └── Agent is now a NETWORK ENDPOINT

STEP 2: Add Agent Wizard (agent_uid)
  └── REQUIRES site_uid from Step 1 (will not run without it)
  └── Assigns agent_uid (SA-XXXXXXXX) via Connect Gateway
  └── Adds agent config to shopnet_assist.agents table
  └── Uploads portrait image and round icon to S3
  └── Agent is now an OPERATIONAL AGENT
```

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/agent-uid/create` | POST | Issue new SA-XXXXXXXX |
| `/api/v1/agent-uid/next` | GET | Preview next agent_uid |
| `/api/v1/agent-platforms` | GET | List registered platforms |
| `/api/v1/agents` | GET/POST | List/Create agents |
| `/api/v1/agents/{agent_uid}` | GET/PUT/DELETE | CRUD operations |

---

## VI.4 Two-Counter System

Both counters are independent and stored in `network-endpoints.json` metadata:

```json
{
  "metadata": {
    "next_site_uid": 95,
    "next_agent_uid": 9,
    "last_updated": "2026-02-06T..."
  }
}
```

- `next_site_uid` increments when ANY endpoint is created (website, agent, database, node)
- `next_agent_uid` increments ONLY when an agent is registered via Step 2
- The two counters are completely independent sequences

---

## VI.5 Registered Agent Platforms

As of February 6, 2026, 8 agents registered:

| site_uid | agent_uid | Agent Name | Role |
|----------|-----------|------------|------|
| SN-00000085 | SA-00000001 | Product Assist | Product recommendations |
| SN-00000086 | SA-00000002 | Domain Assist | TLD recommendations |
| SN-00000087 | SA-00000003 | Content Assist | Daily content generation |
| SN-00000088 | SA-00000004 | KPI Assist | Dashboard analytics |
| SN-00000089 | SA-00000005 | Site Assist (Radius) | Site management |
| SN-00000092 | SA-00000006 | CAO Assist (Claudelia) | Chief AI Officer |
| SN-00000093 | SA-00000007 | CTO Assist (Claudnet) | Chief Technology Officer |
| SN-00000094 | SA-00000008 | CIO Assist (Claudi) | Chief Information Officer |

---

## VI.6 Level Separation Rules

1. Level 1 (agent_uid) CANNOT exist without Level 0 (site_uid)
2. Level 1 wizards CANNOT modify Level 0 data
3. Deleting an agent (Level 1) does NOT delete the endpoint (Level 0)
4. agent_uid is NEVER reused, even after deletion (same rule as site_uid)
5. Both UIDs are generated ONLY by Connect Gateway (THE LAW applies to both)

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Jan 24, 2026 | Initial THE LAW - site_uid rules, what was wrong, what to fix |
| 2.0 | Jan 24, 2026 | Added PART II: Complete taxonomy (endpoint_type, platform_type, status, architecture, RDS schema, process flows) |
| 2.1 | Jan 24, 2026 | Added PART III: Data Flows & Backup (field-by-field mapping, Console GUI sources, change propagation, backup flows) |
| 2.2 | Jan 24, 2026 | Added III.9-III.11: network-endpoints.json field sources, Endpoint Registry sources, data responsibility matrix |
| 2.3 | Jan 25, 2026 | **SIMPLIFIED GUI ARCHITECTURE**: Endpoint Registry = pure RDS (no merging), separate Live Table for JSON data, Cards = RDS + live status overlay |
| 3.0 | Jan 25, 2026 | **PART IV**: Three-Table RDS Schema (no redundancy), SQL ready to execute, "How the Bill Becomes THE LAW" implementation phases |
| 3.1 | Jan 25, 2026 | **PART V**: How Data Are Used - Console GUI data sources, field mapping for Site Cards, Endpoint Registry, Live Status Table |
| 3.2 | Jan 25, 2026 | Updated V.2-V.6: Site Cards now use LIVE JSON (Connect Gateway) as primary source for live_status, url, notes with json_backup as fallback. Clarified two types of notes (taxonomy vs operational). Removed dead code reference. |
| 3.3 | Jan 25, 2026 | **UNIFIED CARD SYSTEM**: `renderNetworkCard()` replaces renderSiteCard/renderBrochureCard/renderWeb3Card. `renderGitHubCard()` for github_cards (Table 4). New click handlers: `openChangeSiteModal()`, `openDocumentViewer()`. Added V.2.5 GitHub Cards section. Updated data source summary with render functions and console panels. |
| 4.0 | Feb 6, 2026 | **PART VI**: Network Identity Hierarchy — agent_uid (SA-XXXXXXXX) as Level 1 identity. Two-counter system. Two-step agent registration. 8 agent platforms registered. Level separation rules. |

---

**THIS IS THE LAW v4.0 - TJL**
