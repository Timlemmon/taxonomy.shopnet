# Agent Taxonomy — Source of Truth v1.0
**Date:** February 11, 2026
**Version:** v1.0
**Authority:** TJL
**Authors:** TJL, Claude (Opus 4.6)
**Owner:** Tim Lemmon / HMCG
**Status:** ACTIVE — All agent registration and architecture must follow this document.

**This document is part of THE LAW.** It defines the complete Agent UID taxonomy, database design, prompt library architecture, and registration process for the Shopnet Assist platform.

**Supersedes:** All prior agent_uid definitions in Document 43, DATABASE-DESIGN.md, and PART III of ThisIsTheLaw v5.0.

---
---

## 1. Two Taxonomies

The Shopnet network has two independent taxonomies. They never overlap.

| Taxonomy | UID Prefix | Issued by | DB | Purpose |
|---|---|---|---|---|
| **Site** | `sn_` | Connect Gateway | shopnet_sites | Infrastructure, websites, services, hosting |
| **Agent** | `sa_` | Connect Gateway | assist_shopnet | Agent platforms and licensed deployments |

A single endpoint (e.g., shopnet.domains) can have BOTH a `sn_` (the website) and one or more `sa_` (agents deployed there). They coexist independently.

**Rule:** Agents do NOT get site_uids. Sites do NOT get agent_uids. Each lives in its own taxonomy.

---

## 2. Site Taxonomy — Types

Sites are registered via the **Add Endpoint** wizard. All registrations are Level 2 (L2) on the network.

| Type Code | Name | What it is | Example |
|---|---|---|---|
| I | Infrastructure | Physical/virtual servers, RDS, core services | EC2 i-007067889932cd6c7 (Connect) |
| W | Website | A website or web application | shopnet.domains, shopnet.network-console |
| L | Lambda | AWS Lambda function | Lambda brochure sites |
| **A** | **Agent Engine** | Application that hosts agent platforms | Assist Engine on 13.219.217.59 |

**Key change (v1.0):** Site type "A" is relabeled from "Agent" to **"Agent Engine"**. Agents themselves live in the Agent taxonomy. The Agent Engine is the hosting service — it is infrastructure, not an agent.

An Agent Engine is a running application (like the FastAPI Assist Engine) that hosts one or more Agent Platforms. Multiple Agent Engines can exist (scale, redundancy, dedicated engines). An Agent Platform references which Agent Engine(s) host it.

---

## 3. Agent Taxonomy — Types

Agents are registered via the **Add Agent** wizard. All registrations are Level 2 (L2) on the network.

| Type Code | Name | What it is | Example |
|---|---|---|---|
| **PL** | **Platform** | The agent concept — handler code, personality, prompts, branding | Domain Assist |
| **IN** | **Instance** | A licensed deployment of a platform to a specific endpoint | Domain Assist on shopnet.domains |

### Platform (PL)

Defines **WHAT** the agent is. One per agent concept.

- Handler code (e.g., `handlers/domain_assist.py`)
- Personality, system prompt, catchphrase
- Default model tier (haiku/sonnet/opus)
- Branding (icon, color, portraits)
- Task definitions and prompt library
- References which Agent Engine (`sn_` type A) hosts it

### Instance (IN)

Defines **WHERE** the agent is deployed. One per licensed endpoint.

- References the Platform (`sa_` type PL) it belongs to
- References the site (`sn_`) it's deployed on — or NULL if standalone (e.g., phone app)
- Each Instance is a **separate license**
- 20 sites x Domain Assist = 20 Instances = 20 licenses = 20 `sa_` UIDs

### Version

**Version is NOT a taxonomy type.** It is a database column on the Instance record — which version of the platform's configuration this Instance runs. Versions are also tracked on prompt records.

---

## 4. The Full Stack

| Step | What | Taxonomy | Level | Type | Wizard | UID |
|---|---|---|---|---|---|---|
| EC2 server | The box | Site | L2 | I (Infrastructure) | **Add Endpoint** | `sn_xxxx` |
| Assist Engine app | Agent hosting service | Site | L2 | A (Agent Engine) | **Add Endpoint** | `sn_yyyy` |
| Domain Assist | Agent platform | Agent | L2 | PL (Platform) | **Add Agent** | `sa_xxxx` |
| DA on shopnet.domains | Licensed deployment | Agent | L2 | IN (Instance) | **Add Agent** | `sa_yyyy` |

Two wizards. Two taxonomies. Everything is L2.

---

## 5. Real-World Example: Domain Assist

```
INFRASTRUCTURE (Site Taxonomy — Add Endpoint wizard)
  sn_0000000001  type I   EC2 13.219.217.59 (the box)
  sn_0000000002  type A   Assist Engine (the app, runs on sn_0000000001)

AGENT PLATFORM (Agent Taxonomy — Add Agent wizard, type PL)
  sa_0000000001  type PL  Domain Assist
    ├── agent_id: "domain_assist" (handler slug)
    ├── agent_name: "Domain Assist"
    ├── agent_user_name: "DomainBot"
    ├── agent_class: client
    ├── engine_uid: sn_0000000002
    ├── personality: "Friendly domain advisor..."
    ├── model_tier: sonnet
    ├── handler: handlers/domain_assist.py
    └── prompts: PR-001 (suggest_domains), PR-002 (explore_categories)

AGENT INSTANCES (Agent Taxonomy — Add Agent wizard, type IN)
  sa_0000000010  type IN  Domain Assist on shopnet.domains
    ├── platform_uid: sa_0000000001
    ├── site_uid: sn_XXXX (shopnet.domains)
    ├── version: 1
    ├── license_status: active
    └── date_deployed: 2026-02-10

  sa_0000000011  type IN  Domain Assist on Console Test GUI
    ├── platform_uid: sa_0000000001
    ├── site_uid: sn_YYYY (shopnet.network-console)
    ├── version: 1
    ├── license_status: active (internal)
    └── date_deployed: 2026-02-10
```

### Queries this structure answers:

| Question | Query |
|---|---|
| How many instances of Domain Assist? | COUNT sa_ type IN WHERE platform_uid = sa_0000000001 → **2** |
| How many agents on shopnet.domains? | COUNT sa_ type IN WHERE site_uid = sn_XXXX → **1** |
| How many platforms on the Assist Engine? | COUNT sa_ type PL WHERE engine_uid = sn_0000000002 → **5** |
| Is Domain Assist online? | Health check Agent Engine sn_0000000002, handler "domain_assist" |

---

## 6. Registration Process (THE LAW)

### 6a. Registering an Agent Engine

**Prerequisite:** An Infrastructure server (`sn_` type I) must already exist.

1. **Add Endpoint** wizard → select type: **A (Agent Engine)**
2. Connect Gateway issues `sn_xxxxxxxxxxxx`
3. DB record created in `shopnet_sites`
4. S3 folder created: `s3://bucket/sn_xxxxxxxxxxxx/`

### 6b. Registering an Agent Platform

**Prerequisite:** An Agent Engine (`sn_` type A) must already exist.

1. **Add Agent** wizard → select type: **PL (Platform)**
2. Select which Agent Engine hosts it
3. Connect Gateway issues `sa_xxxxxxxxxxxx`
4. DB record created in `assist_shopnet.agents` with `agent_type = 'PL'`
5. S3 folder created: `s3://bucket/sa_xxxxxxxxxxxx/`
6. Populate platform fields: name, personality, model_tier, branding, handler reference

### 6c. Registering an Agent Instance

**Prerequisite:** The Agent Platform (`sa_` type PL) must already exist.

1. **Add Agent** wizard → select type: **IN (Instance)**
2. Select which Platform this is an instance of
3. Select which site (`sn_`) it's deployed to — or "standalone" for no site
4. Connect Gateway issues `sa_xxxxxxxxxxxx`
5. DB record created in `assist_shopnet.agents` with `agent_type = 'IN'`
6. S3 folder created: `s3://bucket/sa_xxxxxxxxxxxx/`
7. **This is a licensed deployment — one license per Instance**

---

## 7. Database Design (assist_shopnet RDS)

### 7a. `agents` table — unified, discriminated by agent_type

One table holds both Platforms and Instances. The `agent_type` column (PL or IN) determines which fields are populated.

**Shared fields (all records):**

| Field | Type | Purpose |
|---|---|---|
| agent_uid | VARCHAR(15) **PK** | `sa_xxxxxxxxxxxx` — issued by THE LAW |
| agent_type | VARCHAR(2) NOT NULL | `'PL'` (Platform) or `'IN'` (Instance) |
| agent_id | VARCHAR(50) UNIQUE | Slug for handler lookup — `"domain_assist"` |
| agent_name | VARCHAR(100) | Formal name — "Domain Assist" |
| status | VARCHAR(20) | `live` / `wip` / `disabled` / `archived` |
| created_at | TIMESTAMP | Registration date |
| updated_at | TIMESTAMP | Last modified |

**Platform-only fields (agent_type = 'PL'):**

| Field | Type | Purpose |
|---|---|---|
| engine_uid | VARCHAR(15) | FK → `sn_` of the Agent Engine that hosts this platform |
| agent_user_name | VARCHAR(50) | Persona name — "DomainBot", "Claudius", "Claudeax" |
| agent_class | VARCHAR(10) | `internal` / `client` / `both` |
| agent_skill | VARCHAR(50) | `chat` / `data` / `code` / `content` |
| personality | TEXT | Full personality definition |
| system_prompt | TEXT | Base system prompt |
| model_tier | VARCHAR(20) | Default model — `haiku` / `sonnet` / `opus` |
| max_tokens_output | INT | Default max tokens |
| agent_ui_icon | VARCHAR(10) | Emoji for cards/chat |
| agent_ui_color | VARCHAR(7) | Hex color for branding |
| portrait_url | VARCHAR(500) | S3 path to portrait image |
| icon_url | VARCHAR(500) | S3 path to icon |
| catchphrase | VARCHAR(200) | Persona catchphrase |

**Instance-only fields (agent_type = 'IN'):**

| Field | Type | Purpose |
|---|---|---|
| platform_uid | VARCHAR(15) | FK → `sa_` of the parent Platform |
| site_uid | VARCHAR(15) | FK → `sn_` of deployment site (NULL if standalone) |
| version | VARCHAR(20) | Which version of the platform config this instance runs |
| date_deployed | TIMESTAMP | When this instance went live |
| license_status | VARCHAR(20) | `active` / `suspended` / `trial` / `internal` |
| config_overrides | JSON | Endpoint-specific config (model tier override, custom settings) |
| daily_invocation_limit | INT | Rate limit for this specific instance |

**Note:** The old `agent_type` ENUM (`internal`/`client`/`both`) is renamed to `agent_class`. The `agent_type` column now means PL or IN.

### 7b. `prompt_library` table

Prompts are database records, NOT S3 documents. PostgreSQL TEXT fields handle long structured prompts with no size issues.

| Field | Type | Purpose |
|---|---|---|
| prompt_id | SERIAL **PK** | Auto-increment (structured IDs can come later) |
| prompt_name | VARCHAR(200) | Human label — "Domain suggestion system prompt" |
| use_case | VARCHAR(100) | Task identifier — `"suggest_domains"`, `"diagnose_error"` |
| method | VARCHAR(50) | Technique — `"system_prompt"`, `"few_shot"`, `"chain_of_thought"` |
| prompt_text | TEXT | **The actual prompt content** — full text, can be very long |
| version | INT | Version number within this prompt |
| is_active | BOOLEAN | Is this the current active version for this use_case? |
| author | VARCHAR(100) | Who wrote or last edited it |
| created_at | TIMESTAMP | When created |
| updated_at | TIMESTAMP | Last modified |

### 7c. `prompt_assignments` table — many-to-many

Links prompts to Platforms and/or Instances.

| Field | Type | Purpose |
|---|---|---|
| id | SERIAL **PK** | Auto-increment |
| prompt_id | INT | FK → `prompt_library.prompt_id` |
| agent_uid | VARCHAR(15) | FK → `agents.agent_uid` — can be Platform OR Instance |

**Inheritance rule:**
- Prompt assigned to a **Platform** → ALL Instances of that Platform inherit it
- Prompt assigned to a specific **Instance** → overrides the Platform default for that Instance only

**Runtime query — how the handler gets a prompt:**

```sql
-- Get active prompt for use_case, preferring instance override over platform default
SELECT pl.prompt_text
FROM prompt_library pl
JOIN prompt_assignments pa ON pl.prompt_id = pa.prompt_id
WHERE pl.use_case = 'suggest_domains'
  AND pl.is_active = TRUE
  AND pa.agent_uid IN (:instance_uid, :platform_uid)
ORDER BY CASE WHEN pa.agent_uid = :instance_uid THEN 0 ELSE 1 END
LIMIT 1;
```

### 7d. Existing tables — how they map

| Existing table | Links to | Change needed |
|---|---|---|
| `agent_tasks` | Platform agent_uid | Tasks are platform-level (shared across instances) |
| `invocation_history` | Instance agent_uid | Each invocation comes from a specific deployment |
| `agent_permissions` | Platform agent_uid | Permissions are platform-level |
| `agent_learnings` | Platform agent_uid | Learnings apply across all instances |
| `agent_memory` | Instance agent_uid | Conversation memory is per-deployment |
| `agent_rules` | Platform agent_uid | Rules are platform-level |
| `rule_violations` | Instance agent_uid | Violations happen at specific deployments |
| `prompt_templates` | **Replaced by** `prompt_library` + `prompt_assignments` | New architecture |

---

## 8. S3 Storage

When ANY UID is issued (site or agent), an S3 folder is created keyed by that UID. Same pattern for both taxonomies.

**Site:** `s3://bucket/sn_xxxxxxxxxxxx/` — site assets
**Agent:** `s3://bucket/sa_xxxxxxxxxxxx/` — agent assets

### Platform S3 folder (`sa_xxxx` type PL):

```
s3://bucket/sa_xxxx/
  ├── branding/       ← default icon, logo, portraits
  └── config/         ← default config files
```

### Instance S3 folder (`sa_yyyy` type IN):

```
s3://bucket/sa_yyyy/
  ├── branding/       ← endpoint-specific logo (overrides platform default)
  └── config/         ← endpoint-specific config
```

**Prompts are NOT in S3.** Prompt text lives in the database (`prompt_library` table). S3 is for binary assets only (images, icons, logos).

---

## 9. Endpoint Registry

The Endpoint Registry in the Console shows BOTH taxonomies side by side. An endpoint can have a `sn_`, one or more `sa_`, or both.

| Endpoint | site_uid | agent_uid(s) | What's there |
|---|---|---|---|
| shopnet.domains | `sn_XXXX` (W) | `sa_YYYY` (IN) | Website + Domain Assist instance |
| Console test GUI | `sn_AAAA` (W) | `sa_BBBB` (IN), `sa_CCCC` (IN) | Website + 2 agent instances |
| Assist Engine | `sn_DDDD` (A) | — | Agent Engine only (no agent instances here) |
| Domain Assist | — | `sa_EEEE` (PL) | Platform definition (no site) |
| Phone app | — | `sa_FFFF` (IN) | Standalone agent instance (no website) |

---

## 10. Relationships

```
sn_ type I  (Infrastructure — the box)
  └── hosts → sn_ type A  (Agent Engine — the hosting app)
                └── hosts → sa_ type PL  (Platform — the agent concept)
                              ├── has prompts → prompt_library (via prompt_assignments)
                              ├── has tasks → agent_tasks
                              └── has instances → sa_ type IN  (Instance — licensed deployment)
                                                    ├── deployed on → sn_ type W/L (website/lambda)
                                                    ├── may override → prompt_library (via prompt_assignments)
                                                    ├── logs to → invocation_history
                                                    └── license tracked here
```

---

## 11. How Invocation Works at Runtime

1. Client request arrives at Agent Engine: `POST /invoke {"agent_id": "domain_assist", "instance_uid": "sa_YYYY"}`
2. `invoke.py` looks up handler by `agent_id` slug → routes to `handle_domain_assist()`
3. Handler queries `prompt_library` for active prompts assigned to this Platform (or Instance override)
4. Handler calls LLM via `provider.py` (Ollama or Bedrock)
5. Response logged to `invocation_history` with the Instance's `agent_uid`
6. Response returned to client

The `agent_id` slug is used for **code routing** (which handler to call). The `agent_uid` is used for **identity** (which specific deployment made the call, for logging, licensing, and metrics).

---

## 12. Current Agents — Migration Map

All 8 existing registrations become **Platforms (PL)**. No Instances exist yet — they'll be created when we deploy to specific endpoints.

| Current agent_id | Current agent_uid | New type | Formal Name | Persona Name | Class |
|---|---|---|---|---|---|
| product_assist | SA-00000001 | PL | Product Assist | ProductBot | client |
| domain_assist | SA-00000002 | PL | Domain Assist | DomainBot | client |
| content_assist | SA-00000003 | PL | Content Assist | ContentBot | both |
| kpi_assist | SA-00000004 | PL | KPI Assist | KPIBot | both |
| site_assist | SA-00000005 | PL | Site Assist | Claudius | internal |
| cao_assist | SA-00000006 | PL | CAO Assist | Claudelia | internal |
| cto_assist | SA-00000007 | PL | CTO Assist | Claudnet | internal |
| cio_assist | SA-00000008 | PL | CIO Assist | Claudi | internal |

**Not yet registered (needs THE LAW):**
- `claudeax` → will become PL, "Taxonomy Assist" / "Claudeax", internal

**Merged:**
- `ai_assistant` → folded into `site_assist` (SA-00000005). Handler renamed from `ai_assistant.py` to `site_assist.py`.

---

## 13. Decisions Log

All decisions confirmed with Tim Lemmon, Feb 10-11 2026:

1. **Two taxonomies, clean separation:** Sites (`sn_`) and Agents (`sa_`) never cross. Agent Engine is a site type, not an agent type.
2. **Site type "A" relabeled:** "Agent" → "Agent Engine". Code stays "A".
3. **Two agent_uid types:** PL (Platform) and IN (Instance). Two-letter codes.
4. **Licensing is per Instance:** Each endpoint deployment is a separate license, a separate `sa_`.
5. **Version is NOT a taxonomy type:** It's a database column, not a UID level.
6. **agent_type column renamed:** Old `agent_type` (internal/client/both) → `agent_class`. New `agent_type` = PL or IN.
7. **Prompts live in the database, not S3:** `prompt_library` table in assist_shopnet RDS. TEXT fields. Full prompt content in DB.
8. **Prompt inheritance:** Assigned to Platform = all Instances get it. Assigned to Instance = overrides Platform default.
9. **S3 folders for every UID:** Both Platform and Instance get S3 folders (for branding/assets, not prompts).
10. **ai_assistant → site_assist:** Merge. Rename handler. SA-00000005 (Claudius) gets the handler.
11. **Bot names for client agents:** ProductBot, DomainBot, ContentBot. C-Suite agents keep Claud- names.
12. **KPI Assist and Content Assist:** Class = `both` (internal + client).

---

*This document is part of THE LAW. See ThisIsTheLaw v6.0 for the complete integrated taxonomy.*
*AgentTaxonomy v1.0 — February 11, 2026*
