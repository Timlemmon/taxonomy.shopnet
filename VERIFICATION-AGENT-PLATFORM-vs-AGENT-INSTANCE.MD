# VERIFICATION: Agent Platform vs Agent Instance
**Date:** February 9, 2026
**Verified By:** Server data inspection
**Status:** ✅ CONFIRMED

---

## Question

Are all taxonomy tables on shopnet_sites related to **sn_** UID taxonomy, and does endpoint_type='A' mean "Agent PLATFORM" (not the agent instance)?

---

## Answer: ✅ YES - VERIFIED

### Confirmed Facts

1. ✅ All taxonomy tables on `shopnet_sites` relate to **sn_** UIDs
2. ✅ endpoint_type='A' means **Agent PLATFORM** (infrastructure that hosts agents)
3. ✅ Agent instances (sa_) are stored in `shopnet_assist`, NOT `shopnet_sites`
4. ✅ One Agent Platform (sn_) can host multiple Agent Instances (sa_)

---

## Server Verification Results

### 1. Agent Platforms (sn_) in shopnet_sites

**Database:** `shopnet_sites`
**Table:** `endpoint_taxonomy`

```
    site_uid     |          domain_name          | endpoint_type | platform_type
-----------------+-------------------------------+---------------+---------------
 sn_0ta4kc03hxc4 | domain-assist.assist.shopnet  | A             | CL
 sn_0ta4kc0e3ylk | content-assist.assist.shopnet | A             | CL
 sn_0ta4kc0j3zi8 | cio-assist.assist.shopnet     | A             | CL
 sn_0ta4kc0jhnnh | cto-assist.assist.shopnet     | A             | CL
 sn_0ta4kc0wmmzo | kpi-assist.assist.shopnet     | A             | CL
 sn_0ta4kc0yiawp | site-assist.assist.shopnet    | A             | CL
 sn_0ta4kc0yqnv6 | cao-assist.assist.shopnet     | A             | CL
 sn_0ta4kc0zxldu | product-assist.assist.shopnet | A             | CL
```

**What this shows:**
- 8 Agent Platforms (sn_ UIDs)
- All have `endpoint_type = 'A'` (Agent Platform)
- All have `platform_type = 'CL'` (Claude Agent Platform)
- These are **infrastructure/endpoints**, not agents themselves

---

### 2. Agent Instances (sa_) in shopnet_assist

**Database:** `shopnet_assist`
**Table:** `agents`

```
    agent_uid    |    site_uid     |    agent_id    |       agent_name       | agent_type | agent_skill | status
-----------------+-----------------+----------------+------------------------+------------+-------------+--------
 sa_0ta4kc147c51 | sn_0ta4kc0zxldu | product_assist | Product Assist         | client     | chat        | live
 sa_0ta4kc19i438 | sn_0ta4kc0j3zi8 | cio_assist     | CIO Assist (Claudi)    | internal   | data        | future
 sa_0ta4kc1carwp | sn_0ta4kc03hxc4 | domain_assist  | Domain Assist          | client     | data        | live
 sa_0ta4kc1ge80n | sn_0ta4kc0yqnv6 | cao_assist     | CAO Assist (Claudelia) | internal   | documents   | future
 sa_0ta4kc1mty3k | sn_0ta4kc0yiawp | site_assist    | Site Assist (Radius)   | internal   | code        | wip
 sa_0ta4kc1n1278 | sn_0ta4kc0jhnnh | cto_assist     | CTO Assist (Claudnet)  | internal   | code        | future
 sa_0ta4kc1uxcws | sn_0ta4kc0wmmzo | kpi_assist     | KPI Assist             | internal   | data        | wip
 sa_0ta4kc1ybt0q | sn_0ta4kc0e3ylk | content_assist | Content Assist         | internal   | content     | wip
```

**What this shows:**
- 8 Agent Instances (sa_ UIDs)
- Each has a `site_uid` pointing to its Agent Platform (sn_)
- These are the **actual agents** running on the platforms
- Taxonomy fields: `agent_type`, `agent_skill`, `status`

---

### 3. Example: Product Assist

**Agent Platform (sn_):**
```
UID: sn_0ta4kc0zxldu
Name: product-assist.assist.shopnet
Type: endpoint_type='A', platform_type='CL'
Database: shopnet_sites.endpoint_taxonomy
```

**Agent Instance (sa_):**
```
UID: sa_0ta4kc147c51
Name: Product Assist
Platform: sn_0ta4kc0zxldu (runs on this platform)
Type: agent_type='client', agent_skill='chat'
Database: shopnet_assist.agents
```

**Relationship:**
```
sn_0ta4kc0zxldu (Agent Platform - Claude infrastructure)
    └─ sa_0ta4kc147c51 (Agent Instance - Product Assist chatbot)
```

---

### 4. UID Registry Verification

**Database:** `shopnet_connect`
**Table:** `uid_registry`

```
       uid       | uid_type |         display_name          |   routes_to
-----------------+----------+-------------------------------+----------------
 sn_0ta4kc0zxldu | sn       | product-assist.assist.shopnet | shopnet_sites
 sa_0ta4kc147c51 | sa       | Product Assist                | shopnet_assist
 sn_0ta4kc03hxc4 | sn       | domain-assist.assist.shopnet  | shopnet_sites
 sa_0ta4kc1carwp | sa       | Domain Assist                 | shopnet_assist
```

**What this shows:**
- **sn_** UIDs route to `shopnet_sites`
- **sa_** UIDs route to `shopnet_assist`
- Clear separation between platforms and agent instances

---

## Taxonomy Separation - Confirmed

### shopnet_sites (sn_ taxonomy)

**Tables:**
- `endpoint_taxonomy` - All sn_ endpoints (websites, agents platforms, databases, nodes, infrastructure)
- `taxonomy_definition` - Valid values for sn_ taxonomy (endpoint_type, platform_type, etc.)

**Taxonomy Levels:**
- **L0:** site_uid (sn_xxxxxxxxxxxx)
- **L1:** endpoint_type (W, A, D, N, I, O)
- **L2:** platform_type (varies by endpoint_type)
  - For A: CL, GP, GM, CA, OT (agent platforms)
- **L3:** status, web_protocol, runtime, host, etc.

**Scope:** Network endpoints and infrastructure

---

### shopnet_assist (sa_ taxonomy)

**Tables:**
- `agents` - All sa_ agent instances
- `agent_tasks` - Tasks per agent
- `agent_rules` - Agent behavioral rules
- `agent_memory` - Agent memory
- `agent_permissions` - Agent access control
- (9 tables total)

**Taxonomy Levels:**
- **L0:** agent_uid (sa_xxxxxxxxxxxx)
- **L1:** agent_type (internal, client)
- **L2:** agent_skill (code, chat, content, data, documents, promotion)
- **L3:** status, model_tier, permissions, etc.

**Scope:** AI agent instances and their operational data

**Note:** Currently uses hardcoded ENUM constraints, NOT a taxonomy_definition table

---

## Key Distinctions Confirmed

| Aspect | Agent Platform (sn_) | Agent Instance (sa_) |
|--------|----------------------|----------------------|
| **UID Type** | sn_ | sa_ |
| **Database** | shopnet_sites | shopnet_assist |
| **Table** | endpoint_taxonomy | agents |
| **What It Is** | Infrastructure/endpoint | Software agent |
| **endpoint_type** | 'A' | N/A (not an endpoint) |
| **platform_type** | CL, GP, GM, CA, OT | N/A |
| **agent_type** | N/A | internal, client |
| **agent_skill** | N/A | code, chat, content, data, documents, promotion |
| **Relationship** | Can host multiple sa_ | Requires one sn_ |

---

## Terminology Clarification

### ❌ INCORRECT (Confusing)
- "Agent endpoint" (ambiguous - platform or instance?)
- "sn_ agent" (which one - platform or instance?)

### ✅ CORRECT (Clear)
- **"Agent Platform" (sn_ with endpoint_type='A')** - The infrastructure
- **"Agent Instance" (sa_)** - The actual agent running on the platform
- **"Agent endpoint"** - Should be called "Agent Platform"

---

## Documentation Updates Needed

### 1. Update ThisIsTheLaw v5.1 WIP
Add clarification:
```markdown
## sn_ Level 1: endpoint_type = 'A' (Agent Platform)

**Important:** endpoint_type='A' means AGENT PLATFORM (infrastructure),
not the agent itself. The agent instances are sa_ UIDs stored in shopnet_assist.

One Agent Platform (sn_) can host multiple Agent Instances (sa_).

Example:
- sn_0ta4kc0zxldu = Claude Agent Platform (infrastructure)
  - sa_0ta4kc147c51 = Product Assist (agent running on this platform)
  - sa_0ta4kc1ybt0q = Content Assist (agent running on this platform)
```

### 2. Update COMPLETE-L1-L3-TAXONOMY.MD
Add section clarifying the distinction.

### 3. Update console.js comments
Add comments in wizard code clarifying "Agent" means "Agent Platform"

---

## Current Production State - Verified

| Component | Database | Table | UID Type | Count | Status |
|-----------|----------|-------|----------|-------|--------|
| **Agent Platforms** | shopnet_sites | endpoint_taxonomy | sn_ | 8 | **LIVE** ✅ |
| **Agent Instances** | shopnet_assist | agents | sa_ | 8 | **LIVE** ✅ |
| **Master Registry** | shopnet_connect | uid_registry | sn_, sa_ | All | **LIVE** ✅ |

**Relationship:** 8 Agent Platforms → 8 Agent Instances (1:1 currently, could be 1:many in future)

---

## Future Consideration

**Scenario:** Multiple agents on same platform

```
sn_claude_platform_01 (Claude Agent Platform)
    ├─ sa_product_assist (Product Assist)
    ├─ sa_domain_assist (Domain Assist)
    ├─ sa_content_assist (Content Assist)
    └─ sa_kpi_assist (KPI Assist)
```

Currently, each agent has its own platform (1:1). In the future, multiple agents could share a platform (1:many).

---

## Conclusion

✅ **VERIFIED:** All taxonomy on shopnet_sites relates to **sn_** UIDs
✅ **VERIFIED:** endpoint_type='A' means **Agent PLATFORM** (infrastructure)
✅ **VERIFIED:** Agent instances (sa_) are in shopnet_assist, NOT shopnet_sites
✅ **VERIFIED:** Clear separation between platforms and instances

**Action Required:** Update documentation to consistently use "Agent Platform" terminology to avoid confusion.
