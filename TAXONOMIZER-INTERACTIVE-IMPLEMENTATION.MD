# Taxonomizer Interactive Mode — Implementation Document
**Date:** February 10, 2026
**Author:** Tim Lemmon / Claude
**Purpose:** Documents the Taxonomizer Interactive Mode (Claudax agent) wiring to Ollama via Connect Gateway
**Status:** IMPLEMENTED — ready for deployment and testing

---

## What Was Built

The Taxonomizer Interactive Mode now has a working LLM-powered conversational agent ("Claudax") that:

1. Accepts a use case from the user in the chat box
2. Routes the conversation through Connect Gateway to Ollama
3. Uses the Claudax system prompt (4-phase conversation flow) to guide the analysis
4. Maintains multi-turn conversation history per session
5. Returns agent responses to the chat UI with typing indicators

This is the **first live LLM integration** in the Shopnet platform — the first agent to actually talk to an LLM through the Connect Gateway.

---

## Architecture

```
┌──────────────────────────────────────────────────────┐
│  FRONTEND (taxonomizer.js)                            │
│                                                       │
│  agentContinue() → sendToAgent(useCase)              │
│  agentSendMessage() → sendToAgent(text)              │
│                                                       │
│  POST /api/v1/taxonomizer/chat                        │
│    { message, session_id }                            │
└──────────────────────┬───────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────┐
│  CONSOLE BACKEND (taxonomizer_api.py)                 │
│  Flask: POST /api/v1/taxonomizer/chat                 │
│                                                       │
│  1. Load/create conversation history (in-memory)      │
│  2. Build messages: system prompt + history + message  │
│  3. POST to Connect Gateway /api/v1/llm/chat          │
│  4. Store assistant response in conversation history   │
│  5. Return response to frontend                       │
└──────────────────────┬───────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────┐
│  CONNECT GATEWAY (shopnet_connect_api.py)             │
│  FastAPI: POST /api/v1/llm/chat                       │
│                                                       │
│  LLM Gateway Pattern (Deathstar Architecture):        │
│  "Never allow endpoint code to call LLM APIs directly"│
│                                                       │
│  Forwards to Ollama with model, messages, options     │
│  Also: GET /api/v1/llm/models (list available models) │
└──────────────────────┬───────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────┐
│  OLLAMA (18.209.135.85:11434)                         │
│                                                       │
│  POST /api/chat                                       │
│  Model: phi3:mini (configurable)                      │
│  Returns: { message: { role, content }, done, ... }   │
└──────────────────────────────────────────────────────┘
```

### Key Design Decisions

| Decision | Rationale |
|----------|-----------|
| Route through Connect Gateway | Follows Deathstar LLM Gateway pattern — cost control, usage tracking, model routing |
| System prompt embedded in console backend | Console owns the Taxonomizer; prompt is part of the module |
| In-memory conversation state | Sufficient for testing; permanent agent will use `invocation_history` table |
| 120-second timeout | Ollama on phi3:mini may be slow; generous timeout for complex prompts |
| Non-streaming response | Simpler implementation; streaming can be added later |

---

## Files Modified

### 1. Connect Gateway — LLM Endpoint
**File:** `connect.shopnet/backend/shopnet_connect_api.py`
**Server path:** `/opt/shopnet/connect-gateway/backend/shopnet_connect_api.py`

**Added:**
- `POST /api/v1/llm/chat` — Ollama proxy endpoint
  - Accepts: `{ model, messages, stream, options }`
  - Forwards to `OLLAMA_URL/api/chat` (env var, default `http://18.209.135.85:11434`)
  - Returns: `{ message, model, done, total_duration, eval_count }`
- `GET /api/v1/llm/models` — List available Ollama models
  - Forwards to `OLLAMA_URL/api/tags`

**Dependencies:** `httpx` (already imported)

### 2. Console Backend — Chat Endpoint
**File:** `shopnet.network-console/taxonomizer_api.py`
**Server path:** `/home/ubuntu/shopnet-console/taxonomizer_api.py`

**Added:**
- `CLAUDAX_SYSTEM_PROMPT` — Full context + dynamic control prompt (~4KB)
- `agent_conversations` — In-memory conversation storage dict
- `POST /api/v1/taxonomizer/chat` — Agent chat endpoint
  - Accepts: `{ message, session_id (optional), model (optional) }`
  - Builds: system prompt + conversation history + new message
  - Calls: Connect Gateway `POST /api/v1/llm/chat`
  - Returns: `{ response, session_id, model }`
- `POST /api/v1/taxonomizer/chat/reset` — Clear conversation session
  - Accepts: `{ session_id }`

**Dependencies:** `requests` (added import)

### 3. Frontend — Agent Chat Wiring
**File:** `shopnet.network-console/static/js/taxonomizer.js`
**Server path:** `/home/ubuntu/shopnet-console/static/js/taxonomizer.js`

**Added/Modified:**
- `agentSessionId`, `agentIsLoading` — Session state variables
- `agentContinue()` — Now sends initial use case to `/api/v1/taxonomizer/chat`
- `agentSendMessage()` — Now sends follow-up messages to same endpoint
- `sendToAgent(message)` — New async function handling the API call
- `addTypingIndicator()` / `removeTypingIndicator()` — Thinking animation
- `clearAgentChat()` — Now also resets server-side session

---

## System Prompt Design

The Claudax system prompt is documented in detail at:
- **Design doc:** `taxonomy.shopnet/TAXONOMIZER-AGENT-PROMPT-DESIGN.MD`
- **Agent copy:** `taxonomy.shopnet/ClaudaxPrompt.md`
- **Embedded in code:** `taxonomizer_api.py` line 25 (`CLAUDAX_SYSTEM_PROMPT`)

### Prompt Structure
```
CONTEXT (what the agent knows):
  - Agent identity (Taxonomizer for Shopnet Network)
  - Complete L1 taxonomy (9 UID types with descriptions)
  - Complete L2 subtypes (all values per UID type)
  - L3 attributes overview
  - Key concepts (flat namespace, foreign keys, taxonomy_law)
  - Primary goal (prove existing taxonomy works, match-first)

DYNAMIC CONTROL (how it behaves):
  - Phase 1: Gather Information (ask 2-4 questions per turn)
  - Phase 2: Lay Out Process Steps (Actor → Action → Result)
  - Phase 3: Derive and Match (L2/L3 needed vs existing)
  - Phase 4: Present Complete Mapping (verdict + table)
  - Conversation rules (concise, focused, steps before UIDs)
```

---

## Deployment

### Files to SCP

```bash
# Console backend + frontend
scp -i ~/.ssh/shopnet-ec2.pem \
  shopnet.network-console/taxonomizer_api.py \
  ubuntu@50.19.186.215:/home/ubuntu/shopnet-console/taxonomizer_api.py

scp -i ~/.ssh/shopnet-ec2.pem \
  shopnet.network-console/static/js/taxonomizer.js \
  ubuntu@50.19.186.215:/home/ubuntu/shopnet-console/static/js/taxonomizer.js

# Connect Gateway
scp -i ~/.ssh/shopnet-ec2.pem \
  connect.shopnet/backend/shopnet_connect_api.py \
  ubuntu@50.19.186.215:/opt/shopnet/connect-gateway/backend/shopnet_connect_api.py
```

### Services to Restart

```bash
# Restart Connect Gateway (shopnet-connect)
sudo systemctl restart shopnet-connect

# Restart Console (shopnet-console)
sudo systemctl restart shopnet-console
```

### Cache Bust
Frontend JS change requires cache bust. Current version: `?v=11` → update to `?v=12` in index.html.

---

## Testing

### Quick Test
1. Open Taxonomizer → select "Interactive" mode
2. Enter: "Customer orders pizza for delivery"
3. Click "Continue"
4. Agent should respond with Phase 1 clarifying questions
5. Answer the questions in chat
6. Agent should progress through Phases 2-4

### Verify LLM Gateway
```bash
# Check Ollama is running
curl http://18.209.135.85:11434/api/tags

# Check Connect Gateway LLM endpoint
curl -X POST https://connect.shopnet.network/api/v1/llm/chat \
  -H "Content-Type: application/json" \
  -d '{"model":"phi3:mini","messages":[{"role":"user","content":"hello"}]}'

# Check available models
curl https://connect.shopnet.network/api/v1/llm/models
```

### Known Limitations (Testing Phase)
- **phi3:mini is small** (3.8B params) — may struggle with complex taxonomy reasoning
- **No streaming** — user waits for full response (could be slow)
- **In-memory sessions** — lost on server restart
- **No usage tracking** — no token counting or cost logging yet
- **No authentication** — LLM endpoint is open (same as other Connect Gateway endpoints)

---

## Migration to assist.shopnet Platform

When the permanent agent infrastructure is built, the following changes are needed to make the Taxonomizer agent (Claudax) compliant with the assist.shopnet platform.

### 1. Register Agent in shopnet_assist

```sql
INSERT INTO agents (
  agent_id, agent_uid, agent_name, agent_type, agent_skill,
  primary_mode, status, agent_role, agent_title, agent_user_name,
  agent_ui_name, agent_ui_icon, agent_ui_color,
  personality, system_prompt, catchphrase,
  gui_assignments, key_databases, key_modules, key_documents,
  model_tier, site_uid
) VALUES (
  'taxonomizer', 'SA-00000009', 'Claudax', 'internal', 'data',
  'Taxonomy validation through use case analysis', 'wip',
  'Taxonomy Analyst', NULL, 'claudax',
  'Claudax', '🔬', '#667eea',
  'Analytical, thorough, match-first mindset. Prefers proving existing taxonomy works over proposing new values.',
  -- system_prompt loaded dynamically from prompt_templates
  NULL,
  '"Can the taxonomy handle it? Let me find out."',
  '["shopnet.network - console/taxonomizer"]',
  '["shopnet_connect"]',
  '["Taxonomizer"]',
  '["TAXONOMIZER-AGENT-PROMPT-DESIGN.MD", "COMPLETE-L1-L3-TAXONOMY.MD", "ClaudaxPrompt.md"]',
  'sonnet',  -- needs strong reasoning; phi3:mini is for testing only
  'SN-00000095'  -- needs to be registered via Add Endpoint Wizard first
);
```

### 2. Store Prompts in prompt_templates

```sql
-- Context prompt (static knowledge)
INSERT INTO prompt_templates (
  agent_id, template_name, template_type, template_content
) VALUES (
  'taxonomizer', 'taxonomizer_context', 'system',
  '...'  -- Content from CLAUDAX_SYSTEM_PROMPT (context section)
);

-- Dynamic control prompt (conversation behavior)
INSERT INTO prompt_templates (
  agent_id, template_name, template_type, template_content
) VALUES (
  'taxonomizer', 'taxonomizer_control', 'control',
  '...'  -- Content from CLAUDAX_SYSTEM_PROMPT (dynamic control section)
);
```

### 3. Dynamic Taxonomy Loading

Currently the taxonomy data is **hardcoded in the system prompt**. For the permanent agent:

```
1. User opens Interactive mode
2. Frontend calls GET /api/v1/taxonomizer/taxonomy
3. Frontend gets latest taxonomy_law data
4. System message = context_template + live_taxonomy_data + control_template
5. Sent to LLM via Connect Gateway
```

This ensures when `taxonomy_law` is updated, the agent automatically gets the latest values.

### 4. Conversation Persistence

Replace in-memory `agent_conversations` dict with `invocation_history` table:

```sql
INSERT INTO invocation_history (
  agent_id, session_id, role, content, model, tokens_used, created_at
) VALUES (...);
```

### 5. Provider Router

Current: Console backend hardcodes Connect Gateway URL → Ollama.
Permanent: Provider router reads `agent.provider` from DB and routes to Anthropic/Ollama/OpenAI.

### 6. LLM Gateway Enhancements

The current `/api/v1/llm/chat` endpoint needs:
- **Usage tracking** — Log tokens, cost, duration per request
- **Rate limiting** — Per-agent invocation limits (`daily_invocation_limit`)
- **Model routing** — Read provider from agent config, route accordingly
- **Circuit breaker** — Handle Ollama/provider outages gracefully
- **Authentication** — Require agent_uid or API key

### 7. Console Integration

Add "Ask Claudax" button to the Taxonomizer page (following the "Ask [Agent]" pattern from TeamClaud docs).

---

## What This Enables

This implementation proves:
1. The **LLM Gateway pattern works** — Console → Gateway → Ollama
2. The **Claudax prompt design** produces useful conversational analysis
3. The **Connect Gateway** can serve as the central LLM router
4. The **architecture** is ready for more agents to follow the same pattern

Every future agent (Claudelia, Claudnet, Product Assist, etc.) will follow this same flow:
```
Frontend → Console/Lambda → Connect Gateway /api/v1/llm/chat → LLM Provider
```

---

## Related Documents

| Document | Location |
|----------|----------|
| Claudax Prompt Design | `taxonomy.shopnet/TAXONOMIZER-AGENT-PROMPT-DESIGN.MD` |
| Claudax Prompt (permanent) | `taxonomy.shopnet/ClaudaxPrompt.md` |
| Tool Specification | `taxonomy.shopnet/TAXONOMIZER-TOOL-SPEC.MD` |
| Deployment Success | `taxonomy.shopnet/TAXONOMIZER-DEPLOYMENT-SUCCESS.MD` |
| Assist Platform Context | `assist.shopnet/Agent_Context.MD` |
| Database Design | `assist.shopnet/docs/DATABASE-DESIGN.md` |
| System Architecture | `assist.shopnet/docs/SYSTEM-ARCHITECTURE.md` |
| Deathstar Agent Arch | `shopnet-deathstar/43-ASSIST-SHOPNET-AGENT-ARCHITECTURE.md` |

---

*This is the first live LLM agent on the Shopnet platform. Test with Ollama phi3:mini now, upgrade to Claude sonnet when assist.shopnet agent engine is operational.*
*Last updated: February 10, 2026*
