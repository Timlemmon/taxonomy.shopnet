# Taxonomy Session Handoff

**Date:** February 11, 2026
**Died:** prompt too long at 52 MB (4th death of this session lineage)
**Session ID:** a07b1c63 (trimmed and resumed multiple times, finally died during Agent Optimizer + old server archaeology)
**Previous deaths:** 61 MB (Feb 10), 54 MB (Feb 8 as 3a0d5e8f)

---

## CRITICAL: Read These First

1. `/Users/tim001/VSCode/HMCG/VSCode-Root-Files/ClaudeNew.md` — Master rules (READ FIRST)
2. `/Users/tim001/VSCode/HMCG/taxonomy.shopnet/TODO.md` — Full status of all items
3. `/Users/tim001/VSCode/HMCG/taxonomy.shopnet/TAXONOMIZER-INTERACTIVE-IMPLEMENTATION.MD` — Full architecture doc for LLM integration
4. `/Users/tim001/VSCode/HMCG/taxonomy.shopnet/TAXONOMIZER-AGENT-PROMPT-DESIGN.MD` — Prompt design doc (needs update with staged prompt details)
5. `/Users/tim001/VSCode/HMCG/assist.shopnet/ClaudaxAgentSetup.md` — Agent registration spec for assist platform
6. `/Users/tim001/VSCode/HMCG/shopnet.network-console/docs/STYLE-GUIDE_v1.0_2026-02-08.md` — GUI formatting rules

---

## What Was Completed in Final Session (Feb 10-11, 2026)

### Agent Optimizer GUI Panel — COMPLETE (Step 2.1)
- **Blueprint:** `shopnet.network-console/agent_optimizer_api.py` — Flask blueprint with API endpoints
- **Frontend:** JS + CSS for Agent Optimizer panel in console GUI
- **SQL:** `004_prompt_test_tables.sql` — 2 new tables created on live RDS
- **API endpoints:** All returning correctly (9 agents loaded, analytics working)
- **Bug fix:** Column name mismatch — `persona_name` → `agent_user_name` in agents table query
- Deployed to server, all endpoints verified

### Old Server Archaeology — COMPLETE
- Investigated choiceassistai server — found original agent platform lost for 2 years
- Backed up useful findings for future reference
- Also investigated old domain assist prototypes (webdomaintools server) for Pinecone, component modules
- Findings documented for potential reuse in future agent platform

### Agent UID Cleanup — COMPLETE
- Found and replaced old-format agent UIDs on server

---

## What Was Completed Earlier This Session

### Bedrock as Second LLM Provider — COMPLETE
- **File:** `connect.shopnet/backend/shopnet_connect_api.py`
- Connect Gateway LLM endpoint now supports multi-provider routing
- `POST /api/v1/llm/chat` accepts `provider: "ollama"` (default) or `provider: "bedrock"`
- Two async functions: `_llm_ollama()` and `_llm_bedrock()`
- Bedrock uses `boto3` `bedrock-runtime` `converse()` API
- **Must use inference profile IDs** (not direct model IDs):
  - `us.anthropic.claude-3-5-haiku-20241022-v1:0` (NOT `anthropic.claude-3-5-haiku-...`)
  - `us.anthropic.claude-sonnet-4-20250514-v1:0`
- Model alias mapping: `"haiku"` → Haiku, `"sonnet"` → Sonnet, `"claude-haiku"` → Haiku, etc.
- Runs sync boto3 in `asyncio.to_thread()` to not block FastAPI event loop
- Returns same response format as Ollama (`message`, `model`, `provider`, `done`, `usage`)
- `GET /api/v1/llm/models` now returns both providers: `{ providers: { ollama: [...], bedrock: [...] } }`
- **Tested successfully:** Haiku 0.9s, Sonnet 3.3s (vs Ollama phi3:mini ~4 minutes)

### Staged Prompt System for Ollama — COMPLETE
- **File:** `shopnet.network-console/taxonomizer_api.py`
- Replaced monolithic `CLAUDAX_SYSTEM_PROMPT` (~4KB, ~3000 tokens) with phase-aware staged prompts
- **Why:** phi3:mini takes ~4 minutes with the full prompt. Staging cuts it to ~1 minute by only sending what's needed per phase.

#### Prompt Components:
| Component | Size | When Sent |
|-----------|------|-----------|
| `CLAUDAX_BASE` | ~200 tokens | Always (agent identity, 9 UID types, key rules) |
| `CLAUDAX_PHASE1` | ~200 tokens | Phase 1: Gather information (question prompts) |
| `CLAUDAX_PHASE2` | ~150 tokens | Phase 2: Lay out process steps |
| `CLAUDAX_PHASE3_HEADER` + conditional L2 + `CLAUDAX_PHASE3_FOOTER` | ~200-600 tokens | Phase 3: Taxonomy matching (only relevant L2 subtypes) |
| `CLAUDAX_PHASE4` | ~200 tokens | Phase 4: Present final mapping |
| `CLAUDAX_FULL_PROMPT` | ~1200 tokens | Bedrock only (fast enough for full prompt) |

#### Phase Detection (`_detect_phase()`):
- Scans assistant's latest response for transition signals
- `"step 1:"` or `"process steps"` → Phase 2
- UID prefixes (`sn_`, `sg_`, etc.) in step text → Phase 3
- `"fully covered"`, `"mostly covered"`, `"has gaps"` → Phase 4
- Turn count fallback: >=4 turns → Phase 2, >=2 turns → still Phase 1

#### Conditional L2 Subtype Inclusion (`_detect_relevant_uids()`):
- Phase 3 prompt only includes L2 subtypes for UID types discussed in conversation
- `UID_KEYWORDS` dict maps each UID type to ~10-15 trigger words
- E.g., if conversation mentions "customer", "pizza", "delivery", "payment" → includes `su_`, `sg_`, `sc_`, `sp_` L2 data, skips `sn_`, `sl_`, `sa_`, `sv_`, `st_` unless also mentioned
- Falls back to all 9 types if no keywords detected yet

#### Session Format Change:
- **Old:** `agent_conversations = { session_id: [messages] }`
- **New:** `agent_conversations = { session_id: { "history": [...], "phase": 1 } }`
- Phase is tracked per session and updated after each assistant response

### Updated Chat Endpoint — COMPLETE
- `POST /api/v1/taxonomizer/chat` now accepts optional `provider` parameter
- Passes `provider` through to Connect Gateway
- Returns `phase` in response (so frontend can show phase indicator)
- New endpoint: `POST /api/v1/taxonomizer/chat/status` — returns phase, relevant UIDs, turn count

### Deployed to Server — COMPLETE
- `taxonomizer_api.py` deployed and service restarted
- Service running with `--timeout 300`, `CONNECT_API_URL=http://127.0.0.1:8000`

---

## What Was Completed in Previous Continuation Session

### Claudax Agent Prompt Design — COMPLETE
- Full Context + Dynamic Control prompt, 4-phase conversation flow
- Stored as `taxonomy.shopnet/ClaudaxPrompt.md` and embedded in `taxonomizer_api.py`

### LLM Gateway Endpoint on Connect Gateway — COMPLETE
- `POST /api/v1/llm/chat` — multi-provider (Ollama + Bedrock)
- `GET /api/v1/llm/models` — lists models from all providers

### Taxonomizer Chat Endpoint — COMPLETE
- `POST /api/v1/taxonomizer/chat` — agent chat with staged prompts
- `POST /api/v1/taxonomizer/chat/reset` — clear session
- `POST /api/v1/taxonomizer/chat/status` — get phase info

### Frontend Agent Chat Wiring — COMPLETE
- `sendToAgent()`, `agentContinue()`, `agentSendMessage()`, typing indicators, session management

### Deployment & Debugging — COMPLETE
- Full timeout chain fixed: nginx (300s) → gunicorn (300s) → Console requests (300s) → Gateway httpx (300s)
- Connect Gateway file path issue resolved (root, not backend/ subdirectory)
- Internal routing via localhost:8000 instead of external HTTPS

---

## Current State: WORKING — Multi-Provider, Staged Prompts

The full chain works end-to-end with two providers:
```
Frontend → Console Flask (8001) → Connect Gateway FastAPI (8000) → Ollama OR Bedrock
```

**Performance comparison:**
| Provider | Model | Response Time | Cost |
|----------|-------|---------------|------|
| Ollama | phi3:mini (3.8B) | ~4 min (full prompt), ~1 min (staged) | Free |
| Bedrock | Claude Haiku | ~0.9s | ~$0.001/turn |
| Bedrock | Claude Sonnet | ~3.3s | ~$0.01-0.12/turn |

**Cost concern raised by user:** "$0.12 per simple question is too much" — need to optimize:
- Use Ollama for simple Phase 1-2 turns (free)
- Escalate to Bedrock only for complex Phase 3-4 analysis
- Or use Haiku ($0.001/turn) for everything except final mapping

---

## What Needs To Be Done Next

### In Progress When Session Died
1. **Agent Optimizer JS debugging** — The panel was built and deployed but the JS may have scoping/loading issues in the live console. The last messages show Claude was checking the JS file for syntax errors and verifying it loads on the live server.

2. **Agent Chatbot Best Practices document** — Research was launched but may not have completed. Save to `assist.shopnet/docs/AGENT-CHATBOT-BEST-PRACTICES.md`.

3. **Update Claudax Prompt Design doc** — Needs staged prompt system, conditional L2 logic, and phase detection documented.

### Short Term
3. **Test staged prompts in browser** — The code is deployed, needs real testing to confirm phase transitions work and Ollama is actually faster with smaller prompts
4. **Add streaming responses** — Currently waits for full response. Streaming would show text as it generates.
5. **Add provider toggle to frontend** — Currently hardcoded to Ollama. Add a dropdown or toggle for Bedrock.
6. **Run 500 batch use cases** — Clear taxonomizer_data, run detailed batch, analyze L3 taxonomy gaps

### Medium Term (assist.shopnet platform)
7. **Register Claudax as agent** in `shopnet_assist.agents` table
8. **Store prompts** in `prompt_templates` table
9. **Conversation persistence** — Replace in-memory dict with `invocation_history` table
10. **Dynamic taxonomy loading** — Load from `taxonomy_law` instead of hardcoded prompt
11. **Hybrid cost routing** — Auto-select provider based on conversation phase (Ollama for simple, Bedrock for complex)

### Connect Server Migration — DONE
12. **Server migrated to EC2** — New IP: `50.19.186.215` (was `34.234.121.248`). Migration completed Feb 11. All services running on new EC2.

---

## Key File Locations

| File | Purpose |
|------|---------|
| `taxonomy.shopnet/TODO.md` | Master task tracker |
| `taxonomy.shopnet/TAXONOMIZER-INTERACTIVE-IMPLEMENTATION.MD` | LLM integration architecture doc |
| `taxonomy.shopnet/TAXONOMIZER-AGENT-PROMPT-DESIGN.MD` | Prompt design document |
| `taxonomy.shopnet/ClaudaxPrompt.md` | Permanent copy of Claudax prompt |
| `assist.shopnet/ClaudaxAgentSetup.md` | Agent registration spec |
| `assist.shopnet/docs/AGENT-CHATBOT-BEST-PRACTICES.md` | Best practices doc (may not exist yet — was being researched) |
| `shopnet.network-console/taxonomizer_api.py` | Console backend — staged prompts + chat endpoint |
| `shopnet.network-console/static/js/taxonomizer.js` | Frontend JS (~1128 lines) |
| `shopnet.network-console/static/index.html` | Main console HTML |
| `connect.shopnet/backend/shopnet_connect_api.py` | Connect Gateway — multi-provider LLM endpoint |

---

## Deployment

| Item | Detail |
|------|--------|
| SSH Key | `~/.ssh/TLemmon.pem` (also at `/Users/tim001/VSCode/Keys/TLemmon.pem`) |
| Server | `ubuntu@50.19.186.215` |
| Console Service | `shopnet-console` — gunicorn, port 8001, timeout 300s |
| Connect Service | `shopnet-connect` — uvicorn, port 8000 |
| Connect Gateway file | `/opt/shopnet/connect-gateway/shopnet_connect_api.py` (NOT backend/ subdirectory!) |
| Console files | `/home/ubuntu/shopnet-console/` |
| Live URL | `https://shopnet.network` |
| Last Deploy | Feb 10, 2026 — taxonomizer_api.py (staged prompts version) |
| Cache Bust | Currently at `?v=12` for taxonomizer.js |
| Ollama | `http://18.209.135.85:11434` — phi3:mini + mistral:7b |
| Bedrock | us-east-1, boto3 1.42.32, IAM credentials configured on EC2 |

### Systemd Service Config
```
# /etc/systemd/system/shopnet-console.service
Environment="CONNECT_API_URL=http://127.0.0.1:8000"
ExecStart=... --timeout 300

# /etc/nginx/sites-enabled/shopnet
proxy_read_timeout 300s;
```

---

## Live System State (Feb 10, 2026)

```
RDS Instance 1: KPI_Source, amazon_products, shopnet_assist (9 tables), shopnet_connect, shopnet_data, shopnet_sites (7 tables)
RDS Instance 2: shopnet_crm (7 tables), shopnet_registry (3 tables)
uid_registry: 102 UIDs — ALL v2 format (94 sn_, 8 sa_). Zero v1 UIDs remain.
endpoint_taxonomy: 82 rows, site_uid VARCHAR(15), CHECK ^sn_[0-9a-z]{12}$
agents: 8 rows, all v2 format
S3: 37 sn_ folders (0 SN- folders)
Connect Gateway: ~6100+ lines (multi-provider LLM endpoint)
taxonomy_definition: 79 rows, 3 dynamic triggers live
Taxonomizer_Data: table created in shopnet_connect (Feb 10)
Ollama: 2 models (phi3:mini 3.8B, mistral:7b 7.2B) on 18.209.135.85:11434
LLM Gateway: LIVE — multi-provider (Ollama + Bedrock)
Bedrock: Claude Haiku + Sonnet available via inference profiles
```

---

## Playwright Screenshot Warning

Do NOT take Playwright screenshots on every step. Only screenshot on errors, max 5 total. Sessions a07b1c63 AND 3a0d5e8f both died from context bloat caused by accumulated screenshots.

---

*Updated by Terminal Claude (monitor session) on Feb 11, 2026 — session died for 4th time at 52 MB*
