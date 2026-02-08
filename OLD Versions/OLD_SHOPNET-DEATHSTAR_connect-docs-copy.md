# SHOPNET DEATHSTAR v1.0
**Updated:** February 2, 2026


## The Master Architectural Blueprint

**Version:** 3.3
**Date:** January 22, 2026
**Status:** Active Development
**Document:** `SHOPNET-DEATHSTAR.md`

---

## Progress Log

| Date | Milestone | Status |
|------|-----------|--------|
| Jan 16, 2026 | Migrate `shopnet_data` PostgreSQL from EC2 to RDS | ✅ Completed |
| Jan 17, 2026 | Terminate Australia EC2 (13.217.5.143) | ✅ Completed |
| Jan 17, 2026 | Build connect.shopnet API Gateway | ✅ Completed |
| Jan 17, 2026 | **ARCHITECTURE DECISION: New EC2 for Backend** | ✅ Decided |
| Jan 18, 2026 | Spin up Lightsail (us-east-1) - Connect Server | ✅ Completed |
| Jan 18, 2026 | Deploy Flask API to Connect Server (data.shopnet.domains) | ✅ Completed |
| Jan 18, 2026 | Deploy Admin GUI to Connect Server | ✅ Completed |
| Jan 18, 2026 | Deploy Connect Gateway (connect.shopnet.network) | ✅ Completed |
| Jan 18, 2026 | SSL certificates for both domains | ✅ Completed |
| TBD | Migrate shopnet.domains to API-first (no local TLD/Category DB) | ⏳ Pending |
| TBD | Formalize connect.shopnet API and license system | ⏳ Pending |
| TBD | Merge Admin GUI into shopnet.network console | ⏳ Pending |
| Jan 18, 2026 | **shopnet.network PRE-BUILD** - Unified Console deployed | ✅ Completed |
| Jan 18, 2026 | Unified Console with Network/Control Panels tabs | ✅ Completed |
| Jan 18, 2026 | **Professional SaaS left-nav sidebar design** | ✅ Completed |
| Jan 18, 2026 | Narrowed sidebar (220px), dark theme, stats grid | ✅ Completed |
| Jan 18, 2026 | Documented Lambda shopnet.network architecture | ✅ Completed |
| Jan 18, 2026 | Created CONSOLE-MIGRATION-PLAN.md | ✅ Completed |
| Jan 18, 2026 | **SESSION PAUSED** - Console shell ready, plan documented | ⏸️ Paused |
| Jan 18, 2026 | shopnet.domains API-first code deployed (Claudine) | ✅ Completed |
| Jan 18, 2026 | **Connect API endpoints built** (6 endpoints for TLDs/Categories) | ✅ Completed |
| Jan 18, 2026 | Deployed Connect API to Connect Server with psycopg2 | ✅ Completed |
| Jan 18, 2026 | Enabled SHOPNET_API_MODE on shopnet.domains | ✅ Completed |
| Jan 18, 2026 | Added Connection Monitor to console (API tracking) | ✅ Completed |
| Jan 18, 2026 | Added monitoring endpoints to Connect API | ✅ Completed |
| Jan 18, 2026 | **NETWORK MAP** - Designed traffic light status system | ✅ Completed |
| Jan 18, 2026 | Added /api/v1/network/status endpoint with full topology | ✅ Completed |
| Jan 18, 2026 | Built SVG-based Network Map visualization (homepage) | ✅ Completed |
| Jan 18, 2026 | Traffic lights: section level + component level + connectors | ✅ Completed |
| Jan 18, 2026 | Data View toggle for raw status table | ✅ Completed |
| Jan 18, 2026 | Auto-refresh every 30 seconds with 10s server cache | ✅ Completed |
| Jan 18, 2026 | **OPERATIONAL:** Domains DB → connect → shopnet.domains path | ✅ Working |
| Jan 18, 2026 | **STATUS LIGHTS** - Added traffic lights to sidebar nav items | ✅ Completed |
| Jan 18, 2026 | Added status dots to all cards (component-level status) | ✅ Completed |
| Jan 18, 2026 | Live status sync: nav + cards update from /api/v1/network/status | ✅ Completed |
| Jan 18, 2026 | CSS: .nav-status-dot + .card-status-dot with pulse animation | ✅ Completed |
| Jan 18, 2026 | Deployed v2 console with full traffic light system to production | ✅ Completed |
| Jan 18, 2026 | **Web3 Sites** - Added to Network Map with real server status | ✅ Completed |
| Jan 18, 2026 | Web3 Sites panel synced with Network Map (API-driven status) | ✅ Completed |
| Jan 18, 2026 | Added favicon to shopnet.network (same as shopnet.domains) | ✅ Completed |
| Jan 18, 2026 | Added logout button to sidebar header | ✅ Completed |
| Jan 18, 2026 | Added connection line from connect hub to Web3 Sites box | ✅ Completed |
| Jan 18, 2026 | Removed purple color scheme from Web3 section (now teal) | ✅ Completed |
| Jan 18, 2026 | Added All Endpoints table below Network Map | ✅ Completed |
| Jan 19, 2026 | Console authentication separation (admin@shopnet.network) | ✅ Completed |
| Jan 19, 2026 | data.shopnet naming standardization (lowercase) | ✅ Completed |
| Jan 19, 2026 | Fixed data.shopnet admin GUI login (admin@data.shopnet) | ✅ Completed |
| Jan 19, 2026 | **TLD MIGRATION:** data.shopnet.domains → data.shopnet.network | ✅ Completed |
| Jan 19, 2026 | **shopnet.domains v2.0.82** - API pagination fix (per_page > 100) | ✅ Completed |
| Jan 19, 2026 | Fixed 500 errors - directory permissions (755/644) | ✅ Completed |
| Jan 19, 2026 | Emoji/Kanji dropdowns populated from Connect API | ✅ Completed |
| Jan 19, 2026 | Domain Search module CSS narrowed (1050px container) | ✅ Completed |
| Jan 20, 2026 | **Console GUI Reorganization** - Merged panels, collapsible nav | ✅ Completed |
| Jan 20, 2026 | Renamed "Software Components" → "Github Library" (under System) | ✅ Completed |
| Jan 20, 2026 | Merged Overview into Network Map panel | ✅ Completed |
| Jan 20, 2026 | Merged AI Content into AI Assist Agents panel | ✅ Completed |
| Jan 20, 2026 | Frontend label mapping (SECTION_LABEL_MAP) for display names | ✅ Completed |
| Jan 20, 2026 | Collapsible navigation sections with Console Index toggle | ✅ Completed |
| Jan 20, 2026 | **Status indicator rules** - Grey/Orange/Red/Green definitions | ✅ Completed |
| Jan 20, 2026 | Updated getSectionStatus() with priority: red > green > orange > grey | ✅ Completed |
| Jan 20, 2026 | Converted WIP badges on cards to grey status dots | ✅ Completed |
| Jan 20, 2026 | Added "Useful Info" page under System with status definitions | ✅ Completed |
| Jan 20, 2026 | Network Map globe icon repositioned (53% 54%) | ✅ Completed |
| Jan 20, 2026 | Management Console to hub line now vertical | ✅ Completed |
| Jan 20, 2026 | Created private GitHub repo: shopnet.network-library | ✅ Completed |
| TBD | **shopnet.domains Domain Search** - JS filter implementation | ⏳ Pending |
| TBD | **shopnet.domains Domain Search** - Client Endpoint Filters | ⏳ Pending |
| TBD | **shopnet.domains Domain Search** - Results Table | ⏳ Pending |
| TBD | **Phase 1:** Merge data.shopnet admin into console | ⏳ Pending |
| TBD | **Phase 2:** Port Lambda endpoint management to Connect | ⏳ Pending |
| TBD | **Phase 3:** Build assist.shopnet agent panels | ⏳ Pending |
| TBD | **Phase 4:** Decommission Lambda dashboard | ⏳ Pending |
| TBD | **shopnet.network migration** - DNS cutover from Lambda | ⏳ Ready |
| TBD | Move shopnet.network from Lambda to Connect Server (DNS cutover) | ⏳ Pending |
| TBD | Build Domain.Assist Lambda (on RDS) | ⏳ Pending |
| TBD | Build Product.Assist Lambda (on RDS) | ⏳ Pending |
| TBD | Downsize OLD EC2 to t3.small (WordPress only) | ⏳ Pending |
| Jan 21, 2026 | **S3 Endpoint Management** - Database schema designed | ✅ Completed |
| Jan 21, 2026 | Added endpoint_registry API endpoints to Connect API | ✅ Completed |
| Jan 21, 2026 | Added license-authenticated content serving endpoint | ✅ Completed |
| Jan 21, 2026 | Console Endpoint Overview UI with stats cards | ✅ Completed |
| Jan 21, 2026 | Console Endpoint Registry table with sync triggers | ✅ Completed |
| Jan 21, 2026 | Deployed S3 Endpoint Management to production | ✅ Completed |
| Jan 21, 2026 | Created PROJECT-S3-ENDPOINT-MANAGEMENT.md | ✅ Completed |
| Jan 22, 2026 | **Endpoint Registry Table Enhancement** - Added Last Activity field | ✅ Completed |
| Jan 22, 2026 | Activity tracking with tooltip details | ✅ Completed |
| Jan 22, 2026 | Time-ago formatting for activity display | ✅ Completed |
| Jan 22, 2026 | **Brochure Endpoint Audit** - Complete inventory (48 sites) | ✅ Completed |
| Jan 22, 2026 | Documented 39 live sites (23 Product Assist, 16 Domain Assist) | ✅ Completed |
| Jan 22, 2026 | Migration priority plan for Connect API transition | ✅ Completed |
| Jan 22, 2026 | Created BROCHURE-ENDPOINT-AUDIT.md with SEO automation scope | ✅ Completed |
| Jan 22, 2026 | End of day backup (rsync + GitHub push all repos) | ✅ Completed |
| Jan 22, 2026 | **Universal Connector Audit** - Analyzed current Lambda architecture | ✅ Completed |
| Jan 22, 2026 | Found: NO client-side S3 connector (Lambda serves pre-rendered HTML) | ✅ Completed |
| Jan 22, 2026 | Created SHOPNET-CONNECTOR-DESIGN.md specification | ✅ Completed |
| Jan 22, 2026 | **shopnet-connector.js v2.0** - Universal connector created | ✅ Completed |
| Jan 22, 2026 | Added `/api/v1/config/{domain}` - Site configuration endpoint | ✅ Completed |
| Jan 22, 2026 | Added `/api/v1/seo/{domain}` - SEO content endpoint | ✅ Completed |
| Jan 22, 2026 | Added `/api/v1/chat/{domain}` - Chat proxy to Lambda | ✅ Completed |
| Jan 22, 2026 | Connector features: license auth, content fetch, chat, caching | ✅ Completed |
| TBD | **shop.it.com test** - First connector deployment | ⏳ Pending |
| TBD | **Endpoint Config Modal** - Sync mode/schedule configuration | ⏳ Pending |
| TBD | **Sync History View** - Log viewer for endpoints | ⏳ Pending |
| TBD | **Content Activation Tracking** - Live vs staged files | ⏳ Pending |
| TBD | **SEO Content Migration** - Move generation to Connect Server | ⏳ Pending |
| Jan 23, 2026 | **Site Registry Authority** - ShopNet Console is single source of truth | ✅ Documented |
| Jan 23, 2026 | **site_uid system** - SN-XXXXXXXX unique identifiers assigned by Console | ✅ Implemented |
| Feb 3, 2026 | **pulse.shopnet** - Health monitoring system implemented | ✅ Completed |
| Feb 3, 2026 | Auto-grey for unregistered endpoints (no site_uid = grey) | ✅ Completed |
| Feb 3, 2026 | Per-type check intervals (http, db, agent) - default 1 hour | ✅ Completed |
| Feb 3, 2026 | GUI control panel in Live Status section | ✅ Completed |

---

## SHOPNET CONSOLE - THE AUTHORITY

**ShopNet Console** is the **SINGLE SOURCE OF TRUTH** for all network data.

| Component | Description |
|-----------|-------------|
| **Application** | Flask app at `/home/ubuntu/shopnet-console/app.py` on Lightsail (34.234.121.248) |
| **Master Endpoints File** | `network-endpoints.json` on Connect Gateway - master record of all endpoints |
| **site_uid** | Unique identifier (SN-XXXXXXXX) - **ONLY** issued by Connect Gateway `/api/v1/site-uid/create` |
| **Endpoint Registry** | GUI tab that VIEWS endpoint_taxonomy RDS table (does not manage, just displays) |

### Key Rules

1. **site_uid is ONLY issued by Connect Gateway** - Lambda, Radius, Console must call `/api/v1/site-uid/create`
2. **network-endpoints.json is the SOURCE OF TRUTH** - All other databases sync FROM this source
3. **Endpoint Registry is read-only** - It's a viewer, not a manager
4. **site_uid is NEVER reused** - Even if a site is deleted, its ID is preserved
5. **ALWAYS ensure network-endpoints.json is updated** - Connect Gateway handles this automatically

### Flow for New Sites (THE LAW - Implemented February 3, 2026)

```
POST /api/v1/site-uid/create
         ↓
Connect Gateway:
  1. Generates site_uid (SN-XXXXXXXX)
  2. Updates metadata counter in network-endpoints.json
  3. Adds component to sections.{section}.components in JSON  ← CRITICAL
  4. Writes to endpoint_taxonomy RDS table
  5. Returns site_uid to caller
```

> **CRITICAL:** The site_uid creation process is fundamental to network operations.
> All endpoints MUST have a site_uid. Connect Gateway is the ONLY authority.
> See ThisIsTheLaw.md for complete specification.

### CRITICAL: RDS Backup Copy

**The RDS database `shopnet_sites.endpoint_registry_backup` is a BACKUP COPY of network-endpoints.json.**

This is **intentional redundancy** - NOT a duplicate to be removed:
- **Primary:** ShopNet Console + JSON file (Lightsail 34.234.121.248)
- **Backup:** RDS `shopnet_sites.endpoint_registry_backup` table (47 rows)

**DO NOT DELETE EITHER ONE.** If Lightsail crashes, the RDS backup allows recovery.

---

## PULSE.SHOPNET - HEALTH MONITORING

**pulse.shopnet** is the automatic health monitoring system for ShopNet endpoints.

### Key Principle

**Only endpoints with a `site_uid` are monitored.** Unregistered components remain grey.

```
Has site_uid?
  ├─ YES → Dynamic health check → 🟢 green / 🔴 red / 🟠 orange
  └─ NO  → ⚫ grey (not registered yet)
```

### Check Types

| Type | Description | Default Interval |
|------|-------------|------------------|
| `dynamic:http` | HTTP HEAD request to URL | 1 hour |
| `dynamic:db` | Database connection test | 1 hour |
| `dynamic:agent` | Agent /health endpoint call | 1 hour |

### API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/v1/pulse/config` | GET | Get check intervals by type |
| `/api/v1/pulse/config` | POST | Update interval for a type |
| `/api/v1/pulse/run` | GET | Run checks synchronously |
| `/api/v1/pulse/run` | POST | Run checks in background |

### GUI Location

```
ShopNet Console → Live Status → pulse.shopnet panel (bottom)
```

### Cost Consideration

Lambda on-demand sites trigger invocations when pinged. Default interval is 1 hour to minimize costs. Can be set to "Manual only" to disable automatic checks.

### Documentation

Full specification: [PULSE-SHOPNET.md](./PULSE-SHOPNET.md)

---

## MIGRATION CHECKLIST (145 Steps)

> **START HERE when ready to migrate. Check off each step. Do not skip phases.**

### Quick Reference

| Phase | Steps | Description | Est. Time |
|-------|-------|-------------|-----------|
| A | 1-10 | Pre-flight checks | 15 min |
| B | 11-20 | New EC2 launch | 10 min |
| C | 21-26 | Security groups | 5 min |
| D | 27-40 | Server setup | 20 min |
| E | 41-55 | Deploy Flask API | 30 min |
| F | 56-62 | Deploy Admin GUI | 10 min |
| G | 63-75 | Deploy Connect Gateway | 20 min |
| H | 76-85 | Configure Nginx | 15 min |
| I | 86-95 | DNS & SSL | 30 min |
| J | 96-105 | Admin GUI verification | 15 min |
| K | 106-120 | WordPress API-first | 45 min |
| L | 121-125 | Chatbot verification | 10 min |
| M | 126-130 | Disable MySQL sync | 10 min |
| N | 131-145 | Old EC2 cleanup (Redis, PostgreSQL, downsize) | 30 min |

### PHASE A: PRE-FLIGHT (Steps 1-10)

- [ ] **1.** Confirm AWS Console access
- [ ] **2.** Confirm RDS credentials (check data.shopnet README)
- [ ] **3.** Confirm SSH key: `ls /Users/tim001/VSCode/Keys/TLemmon.pem`
- [ ] **4.** Confirm DNS provider access (Route 53)
- [ ] **5.** Backup Admin GUI: `tar -czf admin-backup.tar.gz /opt/shopnet-data/admin/`
- [ ] **6.** Backup Flask API: `tar -czf api-backup.tar.gz /opt/shopnet-data/api/`
- [ ] **7.** Note current EC2 IP: 54.236.245.127
- [ ] **8.** Test RDS: `psql -h RDS_HOST -U postgres -d shopnet_data -c "SELECT COUNT(*) FROM tlds;"`
- [ ] **9.** Document rollback contacts
- [ ] **10.** Schedule maintenance window

### PHASE B: NEW EC2 LAUNCH (Steps 11-20)

- [ ] **11.** Launch EC2: AWS Console → EC2 → Launch Instance
- [ ] **12.** AMI: Ubuntu 22.04 LTS (64-bit x86)
- [ ] **13.** Instance type: t3.small
- [ ] **14.** Key pair: TLemmon
- [ ] **15.** VPC: Same as RDS
- [ ] **16.** Subnet: Public subnet us-east-1a
- [ ] **17.** Auto-assign public IP: Enable
- [ ] **18.** Storage: 20 GiB gp3
- [ ] **19.** Security group: `shopnet-backend-sg`
- [x] **20.** **CONNECT SERVER IP:** 34.234.121.248 (Lightsail static IP)

### PHASE C: SECURITY GROUPS (Steps 21-26)

- [ ] **21.** Add SSH rule: Port 22
- [ ] **22.** Add HTTP rule: Port 80
- [ ] **23.** Add HTTPS rule: Port 443
- [ ] **24.** Update RDS security group: Port 5432 from shopnet-backend-sg
- [ ] **25.** Verify all rules in AWS Console
- [ ] **26.** Test SSH: `ssh -i TLemmon.pem ubuntu@[NEW_IP]`

### PHASE D: SERVER SETUP (Steps 27-40)

- [ ] **27.** `sudo apt update && sudo apt upgrade -y`
- [ ] **28.** `sudo apt install -y nginx`
- [ ] **29.** `sudo apt install -y python3.11 python3.11-venv python3-pip`
- [ ] **30.** `sudo apt install -y postgresql-client`
- [ ] **31.** `sudo apt install -y certbot python3-certbot-nginx`
- [ ] **32.** `sudo apt install -y git`
- [ ] **33.** `sudo useradd -m -s /bin/bash shopnet`
- [ ] **34.** `sudo mkdir -p /opt/shopnet`
- [ ] **35.** `sudo mkdir -p /opt/shopnet/{admin,data-api,connect-api,backups}`
- [ ] **36.** `sudo chown -R shopnet:shopnet /opt/shopnet`
- [ ] **37.** `sudo mkdir -p /var/log/shopnet && sudo chown shopnet:shopnet /var/log/shopnet`
- [ ] **38.** Test RDS: `psql -h amazon-products-db-*.rds.amazonaws.com -U postgres -d shopnet_data -c "SELECT 1;"`
- [ ] **39.** Verify TLDs: Returns 2011
- [ ] **40.** Verify categories: Returns 37

### PHASE E: DEPLOY FLASK API (Steps 41-55)

- [ ] **41.** `mkdir -p /tmp/data-api`
- [ ] **42.** Upload: `scp -i TLemmon.pem -r data.shopnet/api/* ubuntu@[IP]:/tmp/data-api/`
- [ ] **43.** `sudo mv /tmp/data-api/* /opt/shopnet/data-api/`
- [ ] **44.** `sudo chown -R shopnet:shopnet /opt/shopnet/data-api`
- [ ] **45.** Create venv: `python3.11 -m venv venv`
- [ ] **46.** Install deps: `pip install -r requirements.txt`
- [ ] **47.** Create .env file (see Section 18.12 Step 47)
- [ ] **48.** `chmod 600 /opt/shopnet/data-api/.env`
- [ ] **49.** Create systemd service (see Section 18.12 Step 49)
- [ ] **50.** `sudo systemctl daemon-reload`
- [ ] **51.** `sudo systemctl enable shopnet-data-api`
- [ ] **52.** `sudo systemctl start shopnet-data-api`
- [ ] **53.** `sudo systemctl status shopnet-data-api` → Active (running)
- [ ] **54.** `curl http://127.0.0.1:5000/api/health` → healthy
- [ ] **55.** `sudo journalctl -u shopnet-data-api -n 50` → no errors

### PHASE F: DEPLOY ADMIN GUI (Steps 56-62)

- [ ] **56.** `mkdir -p /tmp/admin`
- [ ] **57.** Upload: `scp -i TLemmon.pem -r data.shopnet/admin/* ubuntu@[IP]:/tmp/admin/`
- [ ] **58.** `sudo mv /tmp/admin/* /opt/shopnet/admin/`
- [ ] **59.** `sudo chown -R shopnet:shopnet /opt/shopnet/admin`
- [ ] **60.** Verify: `ls -la /opt/shopnet/admin/index.html`
- [ ] **61.** Verify: `ls -la /opt/shopnet/admin/assets/js/admin.js`
- [ ] **62.** Verify: `ls -la /opt/shopnet/admin/assets/css/admin.css`

### PHASE G: DEPLOY CONNECT GATEWAY (Steps 63-75)

- [ ] **63.** `mkdir -p /tmp/connect-api`
- [ ] **64.** Upload: `scp -i TLemmon.pem -r connect.shopnet/backend/* ubuntu@[IP]:/tmp/connect-api/`
- [ ] **65.** `sudo mv /tmp/connect-api/* /opt/shopnet/connect-api/`
- [ ] **66.** `sudo chown -R shopnet:shopnet /opt/shopnet/connect-api`
- [ ] **67.** Create venv: `python3.11 -m venv venv`
- [ ] **68.** Install: `pip install fastapi uvicorn[standard] psycopg2-binary python-dotenv pydantic`
- [ ] **69.** Create .env file (see Section 18.12 Step 69)
- [ ] **70.** `chmod 600 /opt/shopnet/connect-api/.env`
- [ ] **71.** Create systemd service (see Section 18.12 Step 71)
- [ ] **72.** `sudo systemctl daemon-reload`
- [ ] **73.** `sudo systemctl enable shopnet-connect`
- [ ] **74.** `sudo systemctl start shopnet-connect`
- [ ] **75.** `curl http://127.0.0.1:8000/health` → healthy

### PHASE H: CONFIGURE NGINX (Steps 76-85)

- [ ] **76.** Create nginx config (see Section 18.12 Step 76)
- [ ] **77.** `sudo rm -f /etc/nginx/sites-enabled/default`
- [ ] **78.** `sudo ln -sf /etc/nginx/sites-available/shopnet /etc/nginx/sites-enabled/`
- [ ] **79.** `sudo nginx -t` → Syntax OK
- [ ] **80.** `sudo systemctl reload nginx`
- [ ] **81.** `curl -I http://127.0.0.1/` → HTTP 200
- [ ] **82.** `curl http://127.0.0.1/api/health` → healthy
- [ ] **83.** `sudo tail -f /var/log/nginx/error.log` → no errors
- [ ] **84.** `curl -I http://[NEW_EC2_IP]/` → HTTP 200
- [ ] **85.** `curl http://[NEW_EC2_IP]/api/health` → healthy

### PHASE I: DNS & SSL (Steps 86-95)

- [ ] **86.** Update DNS: shopnet.network A → [NEW_EC2_IP]
- [ ] **87.** Update DNS: connect.shopnet.network A → [NEW_EC2_IP]
- [ ] **88.** Wait for propagation: `dig shopnet.network`
- [ ] **89.** Verify from server: `dig +short shopnet.network`
- [ ] **90.** `sudo certbot --nginx -d shopnet.network -d connect.shopnet.network`
- [ ] **91.** `curl -I https://shopnet.network/` → HTTP 200 + SSL
- [ ] **92.** `curl https://shopnet.network/api/health` → healthy
- [ ] **93.** `curl https://connect.shopnet.network/health` → healthy
- [ ] **94.** `sudo certbot renew --dry-run` → OK
- [ ] **95.** Verify SSL blocks in nginx config

### PHASE J: ADMIN GUI VERIFICATION (Steps 96-105)

- [ ] **96.** Browser: https://shopnet.network/ → Login page
- [ ] **97.** F12 Console → No JS errors
- [ ] **98.** Login: admin@shopnet.domains / Admin2026
- [ ] **99.** Dashboard: 2011 TLDs, 37 categories
- [ ] **100.** TLD Manager → Table loads
- [ ] **101.** Search "love" → Results appear
- [ ] **102.** Edit TLD → Modal opens
- [ ] **103.** Save TLD → Toast "TLD updated"
- [ ] **104.** Category Manager → Categories load
- [ ] **105.** Create test category → Appears in list

### PHASE K: WORDPRESS API-FIRST (Steps 106-120)

- [ ] **106.** SSH to OLD EC2: `ssh -i TLemmon.pem bitnami@54.236.245.127`
- [ ] **107.** Backup: `cp functions.php functions.php.backup`
- [ ] **108.** Add: `define('SHOPNET_API_MODE', false);`
- [ ] **109.** Add: `define('SHOPNET_CONNECT_URL', 'https://connect.shopnet.network/api/v1');`
- [ ] **110.** Add: `define('SHOPNET_LICENSE_KEY', 'snc_shopnet_domains_2026');`
- [ ] **111.** Create: `/theme/inc/shopnet-api-client.php`
- [ ] **112.** Add Shopnet_API_Client class code (see Section 18.12)
- [ ] **113.** Include client in functions.php
- [ ] **114.** Update module-loader.php get_tlds()
- [ ] **115.** Update module-loader.php get_categories()
- [ ] **116.** Clear cache: `wp cache flush`
- [ ] **117.** Test with API OFF → Site works normally
- [ ] **118.** Enable: `SHOPNET_API_MODE = true`
- [ ] **119.** Clear cache: `wp transient delete --all`
- [ ] **120.** Test with API ON → Site works via API

### PHASE L: CHATBOT VERIFICATION (Steps 121-125)

- [ ] **121.** Browse shopnet.domains homepage
- [ ] **122.** Click chatbot icon → Widget opens
- [ ] **123.** Type "I want a domain about love" → Suggestions appear
- [ ] **124.** Verify TLDs are valid
- [ ] **125.** F12 Network → Calls to connect.shopnet.network

### PHASE M: DISABLE MYSQL SYNC (Steps 126-130)

- [ ] **126.** Confirm all Phase L tests pass
- [ ] **127.** Comment out `register_rest_routes()` in data-sync.php
- [ ] **128.** Set `ds_auto_sync_enabled` to '0' in wp_options
- [ ] **129.** Delete `ds_last_sync_*` transients
- [ ] **130.** Document completion date/time below

### PHASE N: OLD EC2 CLEANUP (Steps 131-145)

- [ ] **131.** Confirm new EC2 stable (24+ hours)
- [ ] **132.** `sudo systemctl stop shopnet-data-api`
- [ ] **133.** `sudo systemctl disable shopnet-data-api`
- [ ] **134.** Remove /admin location from nginx config
- [ ] **135.** `sudo systemctl reload nginx`
- [ ] **136.** Verify shopnet.domains works via API
- [ ] **137.** `sudo systemctl stop redis-server`
- [ ] **138.** `sudo systemctl disable redis-server`
- [x] **139.** `sudo systemctl stop postgresql` ✅ DONE Jan 17, 2026
- [x] **140.** `sudo systemctl disable postgresql` ✅ DONE Jan 17, 2026
- [ ] **141.** Verify only WordPress + MariaDB running: `sudo systemctl list-units --type=service --state=running`
- [ ] **142.** Schedule EC2 downsize
- [ ] **143.** AWS Console → Stop old EC2
- [ ] **144.** Change instance type: t3.medium → t3.small
- [ ] **145.** Start old EC2 → Verify WordPress working

### Migration Notes

| Field | Value |
|-------|-------|
| **New EC2 IP** | |
| **Migration Started** | |
| **Phase J Complete** | |
| **Phase K Complete** | |
| **Migration Complete** | |
| **Verified By** | |

### Rollback Triggers

**Immediately rollback if:**
1. Connect API returns 500 errors for >1 minute
2. Chatbot fails to load TLD suggestions
3. Category pages show 0 products
4. Admin GUI cannot save changes
5. RDS connection fails from new EC2

**Rollback procedure:**
1. Set `SHOPNET_API_MODE = false` in wp-config.php
2. Clear transients: `wp transient delete --all`
3. Re-enable sync webhook
4. Verify local data is valid

---

```
    ╔═══════════════════════════════════════════════════════════════════════════╗
    ║                                                                            ║
    ║         ███████╗██╗  ██╗ ██████╗ ██████╗ ███╗   ██╗███████╗████████╗      ║
    ║         ██╔════╝██║  ██║██╔═══██╗██╔══██╗████╗  ██║██╔════╝╚══██╔══╝      ║
    ║         ███████╗███████║██║   ██║██████╔╝██╔██╗ ██║█████╗     ██║         ║
    ║         ╚════██║██╔══██║██║   ██║██╔═══╝ ██║╚██╗██║██╔══╝     ██║         ║
    ║         ███████║██║  ██║╚██████╔╝██║     ██║ ╚████║███████╗   ██║         ║
    ║         ╚══════╝╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝  ╚═══╝╚══════╝   ╚═╝         ║
    ║                                                                            ║
    ║              ██████╗ ███████╗ █████╗ ████████╗██╗  ██╗                     ║
    ║              ██╔══██╗██╔════╝██╔══██╗╚══██╔══╝██║  ██║                     ║
    ║              ██║  ██║█████╗  ███████║   ██║   ███████║                     ║
    ║              ██║  ██║██╔══╝  ██╔══██║   ██║   ██╔══██║                     ║
    ║              ██████╔╝███████╗██║  ██║   ██║   ██║  ██║                     ║
    ║              ╚═════╝ ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝                     ║
    ║                                                                            ║
    ║                     ███████╗████████╗ █████╗ ██████╗                       ║
    ║                     ██╔════╝╚══██╔══╝██╔══██╗██╔══██╗                      ║
    ║                     ███████╗   ██║   ███████║██████╔╝                      ║
    ║                     ╚════██║   ██║   ██╔══██║██╔══██╗                      ║
    ║                     ███████║   ██║   ██║  ██║██║  ██║                      ║
    ║                     ╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝                      ║
    ║                                                                            ║
    ║                    One Platform. Unlimited Storefronts.                    ║
    ║                                                                            ║
    ╚═══════════════════════════════════════════════════════════════════════════╝
```

---

## The Mandate

> **Build the highest scalability, lowest marginal cost, most secure e-commerce infrastructure in the world.**

| | Target |
|---|--------|
| **Scalability** | 1000s of endpoints from single infrastructure |
| **Marginal Cost** | ~$0.50/month per new endpoint |
| **Security** | Zero trust, defense in depth |

*Every decision must serve at least two of these three criteria.*

---

## Quick Navigation - Documentation Index

### START HERE - Priority Reading

| # | Document | Description | Location |
|---|----------|-------------|----------|
| 1 | **SHOPNET DEATHSTAR** | This document - master architecture blueprint | You are here |
| 2 | [data.shopnet README](../data.shopnet/README.md) | Database credentials, API endpoints, TLD data | `data.shopnet/README.md` |
| 3 | [Project Structure Overview](../PROJECT-STRUCTURE-OVERVIEW.md) | Map of all folders and how they connect | Root level |

---

### The Seven Core Components - Documentation Map

| Component | What It Does | Primary Documentation |
|-----------|--------------|----------------------|
| **1. Backend Databases** | Products + Domains data | [data.shopnet README](../data.shopnet/README.md), [Data Dictionary](../data.shopnet/docs/DATA-DICTIONARY.md) |
| **2. AI Agents** | Product.Assist + Domain.Assist | [Product.Assist Architecture](../purchaseassist-ShopifyV1/PRODUCT_ASSIST_ARCHITECTURE.md), [Domain.Assist README](../domainassist-WPWooV2/README.md) |
| **3. Endpoints** | Product/Domain/Hybrid stores | [This document, Section 4](#4-endpoint-types) |
| **4. Management Console** | shopnet.network admin | [This document, Section 7](#7-management-console) |
| **5. Brochure Sites** | S3+CloudFront landing pages | [This document, Section 8](#8-scaling-model) |
| **6. API Gateway** | shopnet.connect (planned) | [This document, Section 5](#5-the-gateway-shopnetconnect-api), [Unified API Architecture](./ARCHITECTURE-UNIFIED-API.md) |
| **7. Web3 Gateway** | Blockchain domain bridge | [This document, Section 15.7](#157-component-7-web3-gateway-migration-path) |

---

### By Topic - Quick Reference

| If You Need... | Go To... |
|----------------|----------|
| **Overall Architecture** | [This document, Section 2](#2-platform-architecture) |
| **Server IPs & Infrastructure** | [This document, Section 15.6](#156-server-infrastructure-view), [Tactical Migration Plan](./TACTICAL-SERVER-MIGRATION.md) |
| **Database Passwords** | [data.shopnet README](../data.shopnet/README.md) |
| **Current vs Ideal State** | [This document, Section 15](#15-current-state-vs-ideal-deathstar-architecture) |
| **WordPress Theme** | [Theme Structure Map](../shopnet.domains-WP/docs/THEME-STRUCTURE-MAP.md) |
| **TLD/Domain Data** | [Asset Inventory](../data.shopnet/docs/ASSET-INVENTORY-JAN-16-2026.md) |
| **API Specifications** | [Unified API Architecture](./ARCHITECTURE-UNIFIED-API.md), [Backend API Spec](./backend/api-specification.md) |
| **Security** | [This document, Section 9](#9-security-architecture), [Security Audit](../shopnet.domains-WP/docs/SECURITY-AUDIT-RECOMMENDATIONS.md) |
| **Deployment** | [Server Setup](./SERVER-SETUP.md), [Deployment Guide](../data.shopnet/docs/SYNC-AND-BACKUP-ARCHITECTURE.md) |

---

### All Project Documentation

#### connect.shopnet (This Project)
| Document | Size | Purpose |
|----------|------|---------|
| **SHOPNET-DEATHSTAR.md** | 150K | Master blueprint (this file) |
| [TACTICAL-SERVER-MIGRATION.md](./TACTICAL-SERVER-MIGRATION.md) | 15K | Server-level migration plan with costs |
| [AUTH-STRATEGY-HMAC-VS-COGNITO.md](./AUTH-STRATEGY-HMAC-VS-COGNITO.md) | 5K | Authentication decision analysis |
| [ARCHITECTURE-UNIFIED-API.md](./ARCHITECTURE-UNIFIED-API.md) | 67K | Detailed API gateway design |
| [README.md](./README.md) | 35K | Project overview |
| [CHATBOT-IMPLEMENTATION-GUIDE.md](./CHATBOT-IMPLEMENTATION-GUIDE.md) | 35K | Chatbot feature guide |
| [SERVER-SETUP.md](./SERVER-SETUP.md) | 10K | Server configuration |
| [backend/api-specification.md](./backend/api-specification.md) | 5K | API spec details |

#### data.shopnet (Database Layer)
| Document | Size | Purpose |
|----------|------|---------|
| [README.md](../data.shopnet/README.md) | 25K | Credentials, APIs, overview |
| [ASSET-INVENTORY-JAN-16-2026.md](../data.shopnet/docs/ASSET-INVENTORY-JAN-16-2026.md) | 15K | Complete asset list |
| [SERVER-MIGRATION-US-EAST-JAN-15-2026.md](../data.shopnet/docs/SERVER-MIGRATION-US-EAST-JAN-15-2026.md) | 12K | Server setup details |
| [SYNC-AND-BACKUP-ARCHITECTURE.md](../data.shopnet/docs/SYNC-AND-BACKUP-ARCHITECTURE.md) | 12K | Backup strategy |
| [DATA-DICTIONARY.md](../data.shopnet/docs/DATA-DICTIONARY.md) | 7K | Field definitions |
| [SERVER-ARCHITECTURE-DIAGRAM.md](../data.shopnet/docs/SERVER-ARCHITECTURE-DIAGRAM.md) | 6K | Visual architecture |

#### Domain.Assist (TLD Search Platform)
| Document | Size | Purpose |
|----------|------|---------|
| [README.md](../domainassist-WPWooV2/README.md) | 13K | Platform overview |
| [PLATFORM-COMPONENTS-SUMMARY.md](../domainassist-WPWooV2/PLATFORM-COMPONENTS-SUMMARY.md) | 15K | Component details |
| [DAILY-CONTENT-MODULE.md](../domainassist-WPWooV2/DAILY-CONTENT-MODULE.md) | 20K | Daily content system |
| [UI-CUSTOMIZATION-CONTROLS.md](../domainassist-WPWooV2/UI-CUSTOMIZATION-CONTROLS.md) | 20K | UI customization |

#### Product.Assist (Product Search Platform)
| Document | Size | Purpose |
|----------|------|---------|
| [PRODUCT_ASSIST_ARCHITECTURE.md](../purchaseassist-ShopifyV1/PRODUCT_ASSIST_ARCHITECTURE.md) | 12K | Architecture reference |
| [ARCHITECTURE.md](../purchaseassist-ShopifyV1/shopnet.network/ARCHITECTURE.md) | 7K | Network architecture |
| [DEPLOYMENT_SUMMARY.md](../purchaseassist-ShopifyV1/DEPLOYMENT_SUMMARY.md) | 6K | Deployment guide |

#### WordPress/WooCommerce Theme
| Document | Size | Purpose |
|----------|------|---------|
| [THEME-STRUCTURE-MAP.md](../shopnet.domains-WP/docs/THEME-STRUCTURE-MAP.md) | 32K | Complete theme map |
| [CHATBOT-TLD-MANAGEMENT.md](../shopnet.domains-WP/docs/CHATBOT-TLD-MANAGEMENT.md) | 33K | TLD chatbot system |
| [DATABASE-FUTURE-ARCHITECTURE.md](../shopnet.domains-WP/database/docs/DATABASE-FUTURE-ARCHITECTURE.md) | 334K | Future database design |
| [WOOCOMMERCE-README.md](../shopnet.domains-WP/docs/WOOCOMMERCE-README.md) | 14K | WooCommerce integration |

---

### Server Quick Reference

| Server | IP/Endpoint | What's Running |
|--------|-------------|----------------|
| **Connect Server (Lightsail)** | 34.234.121.248 | Flask API, Connect Gateway, ShopNet Console |
| EC2 Production | 54.236.245.127 | WordPress only (PostgreSQL disabled) |
| RDS Database | *.rds.amazonaws.com | amazon_products (13k products, 230k reviews) |
| Lambda | product-assist-lambda | Product.Assist AI Agent |
| S3 + CloudFront | Various | 40+ brochure sites |
| Web3 Server 1 | 3.81.115.9 | Needs verification |
| Web3 Server 2 | 50.17.187.45 | Needs verification |

### Connect Server Services (34.234.121.248)

| Service | Port | URL | Description |
|---------|------|-----|-------------|
| Data API | 5000 | https://data.shopnet.network/api | TLD/Category database API |
| Admin GUI | - | https://data.shopnet.network/admin | Database admin interface |
| Connect Gateway | 8000 | https://connect.shopnet.network | API gateway |
| **ShopNet Console** | 8001 | https://shopnet.network | Unified management dashboard |

**Note:** ShopNet Console is the new unified management interface that will eventually replace shopnet.network (Lambda) and merge Admin GUI functionality.

---

### Document Health Status

| Project | Status | Last Updated | Rating |
|---------|--------|--------------|--------|
| connect.shopnet | Active | Jan 16, 2026 | A+ |
| data.shopnet | Active | Jan 16, 2026 | A+ |
| shopnet.domains-WP | Active | Jan 15, 2026 | A+ |
| domainassist-WPWooV2 | Active | Jan 10, 2026 | A |
| BestBird.com-Shopify | Mixed | Jan 12, 2026 | B+ |
| purchaseassist-ShopifyV1 | Stale | Dec 21, 2025 | B |

---

### Cleanup Recommendations

| Folder | Action | Reason |
|--------|--------|--------|
| `HMCGBackupFolders/` | Delete or archive externally | Full duplicate of all projects |
| `shopnet.domains-WP/backups/Pre-Nonce-Master-Backup-20260114/` | Delete | 90 duplicate files |
| `domainassist-WPWooV1/` | Archive | Superseded by V2 |

---

## This Document Contents

**Below this index is the complete Shopnet Deathstar architectural blueprint.**

---

## Executive Summary

connect.shopnet is a unified API gateway platform that enables rapid deployment of thousands of branded AI-powered e-commerce endpoints from a single infrastructure.

**The Vision:** One platform, unlimited storefronts. Each endpoint is a thin brochure site that connects to shared AI backends (Product.Assist or Domain.Assist) through a centralized gateway with license-based access control.

**Current State:** 40+ active endpoints, 2 prototype stores, 2 AI backends, 1 management console
**Target State:** Scalable to 1000s of endpoints with near-zero marginal cost per new site

**Why This Works:** By separating the presentation layer (thin endpoints) from the business logic (gateway + backends), we achieve what industry leaders like GoDaddy and Salesforce have proven: tens of thousands of unique storefronts served from shared infrastructure.

---

## Core Design Principles

**These principles guide ALL architectural decisions for the Shopnet platform.**

---

### The North Star

```
╔═══════════════════════════════════════════════════════════════════════════════╗
║                                                                                ║
║                           THE SHOPNET MANDATE                                  ║
║                                                                                ║
║       Build the highest scalability, lowest marginal cost, most secure         ║
║       e-commerce infrastructure in the world.                                  ║
║                                                                                ║
╚═══════════════════════════════════════════════════════════════════════════════╝
```

**Every architectural decision must be evaluated against these three criteria:**

| Criterion | Question to Ask | Target |
|-----------|-----------------|--------|
| **SCALABILITY** | Can this handle 10x, 100x, 1000x growth without redesign? | 1000s of endpoints from single infrastructure |
| **MARGINAL COST** | What does adding one more endpoint/customer cost? | Near-zero (~$0.50/month per endpoint) |
| **SECURITY** | Is this the most secure way to implement this? | Zero trust, defense in depth, no shortcuts |

**If a decision doesn't serve at least two of these three, reject it.**

---

### How the Principles Below Serve the Mandate

| Principle | Serves Scalability | Serves Low Cost | Serves Security |
|-----------|-------------------|-----------------|-----------------|
| Tier Separation | ✅ Independent scaling | ✅ Scale only what needs it | ✅ Isolated failure domains |
| Gateway Independence | ✅ Gateway scales separately | ✅ One gateway, unlimited endpoints | ✅ Single hardened entry point |
| Backend Isolation | ✅ Agents scale independently | ✅ Pay only for compute used | ✅ Blast radius limited |
| Database Consolidation | ✅ RDS handles scale | ✅ One DB to manage | ✅ Unified security policies |
| Stateless Compute | ✅ Horizontal scaling | ✅ Lambda = pay per use | ✅ No state to compromise |

---

### Principle 1: Strict Tier Separation

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                              │
│   THE FOUR TIERS - MUST BE PHYSICALLY SEPARATED                             │
│   ═══════════════════════════════════════════════                           │
│                                                                              │
│   TIER 1: PRESENTATION                 TIER 2: API GATEWAY                  │
│   ────────────────────                 ───────────────────                  │
│   • S3 + CloudFront                    • Separate Lambda OR EC2             │
│   • WordPress (UI only)                • connect.shopnet.network            │
│   • Shopify stores                     • Auth, routing, rate limits         │
│   • Static assets                      • NO business logic                  │
│   • NO backend code                    • NO data storage                    │
│                                                                              │
│   TIER 3: BUSINESS LOGIC               TIER 4: DATA                         │
│   ──────────────────────               ───────────                          │
│   • Lambda functions                   • RDS (consolidated)                 │
│   • Product.Assist                     • S3 (assets, backups)               │
│   • Domain.Assist                      • NO compute                         │
│   • AI/LLM processing                  • NO business logic                  │
│   • NO data storage                                                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Rule:** Each tier runs on its own infrastructure. Never mix tiers on the same server.

### Principle 2: Gateway Independence

| Rule | Rationale |
|------|-----------|
| Gateway is SEPARATE from backends | Independent scaling, deployment, failure isolation |
| Gateway contains NO business logic | Only auth, routing, rate limiting, caching |
| Gateway is the ONLY entry point | Backends never exposed to internet directly |
| Gateway can be replaced | No vendor lock-in, could swap Lambda for Kong, etc. |

### Principle 3: Backend Isolation

| Rule | Rationale |
|------|-----------|
| Each AI agent is a separate Lambda | Independent deployment, scaling, versioning |
| Agents share the LLM, not code | Common dependency, separate implementations |
| Agents connect to databases via gateway OR direct | Flexibility in data access patterns |
| New agents plug in without changing existing | Extensibility |

### Principle 4: Database Consolidation

| Rule | Rationale |
|------|-----------|
| One RDS instance, multiple databases | Cost efficiency, unified backups, single admin point |
| Databases are logically separate | No cross-database dependencies |
| Compute never runs on database server | Separation of concerns |
| Data never stored on compute instances | Ephemerality, scaling |

### Principle 5: Stateless Compute

| Rule | Rationale |
|------|-----------|
| Lambda functions are stateless | Horizontal scaling, no session affinity |
| State lives in databases or cache | Centralized, persistent |
| No local file storage for data | Ephemerality |
| Configuration via environment variables | 12-factor app compliance |

---

### Current Technical Debt (Violates Principles)

```
⚠️  EC2 54.236.245.127 VIOLATES SEPARATION:
────────────────────────────────────────────

   Currently running on ONE server:
   ├── WordPress (Tier 1: Presentation)     ← WRONG
   ├── Domain.Assist PHP (Tier 3: Logic)    ← WRONG
   ├── Flask API (Tier 3: Logic)            ← WRONG
   ├── PostgreSQL (Tier 4: Data)            ← WRONG
   └── MariaDB (Tier 4: Data)               ← WRONG

   This must be decomposed:
   ✓ WordPress → Keep on EC2 (presentation only)
   ✓ Domain.Assist → Move to Lambda
   ✓ Flask API → Move to Lambda or separate EC2
   ✓ PostgreSQL → Migrate to RDS
   ✓ MariaDB → Can stay (WordPress-specific)
```

---

### Principle Compliance Checklist

Use this checklist when making ANY infrastructure decision:

- [ ] Is the gateway separate from backends?
- [ ] Is business logic separate from presentation?
- [ ] Is data storage separate from compute?
- [ ] Can each component scale independently?
- [ ] Can each component be deployed independently?
- [ ] Can each component fail without cascading?
- [ ] Is there a single entry point (gateway) for external traffic?

---

## Table of Contents

**Foundation**
- [Core Design Principles](#core-design-principles) ← START HERE
- [Executive Summary](#executive-summary)

**Architecture**
1. [The Problem We're Solving](#1-the-problem-were-solving)
2. [Platform Architecture](#2-platform-architecture)
3. [The Three Layers](#3-the-three-layers)
4. [Endpoint Types](#4-endpoint-types)
5. [The Gateway (connect.shopnet API)](#5-the-gateway-shopnetconnect-api)
6. [AI Backends](#6-ai-backends)
7. [Management Console](#7-management-console)

**Operations**
8. [Scaling Model](#8-scaling-model)
9. [Security Architecture](#9-security-architecture)
10. [Infrastructure Options](#10-infrastructure-options)
11. [Implementation Roadmap](#11-implementation-roadmap)
12. [Current Assets Inventory](#12-current-assets-inventory)
13. [Cost Analysis](#13-cost-analysis)
14. [Success Metrics](#14-success-metrics)

**Current vs Future State**
15. [Current State vs Ideal Deathstar Architecture](#15-current-state-vs-ideal-deathstar-architecture)
    - [The Seven Core Components](#151-the-seven-core-components)
    - [Current State Diagram](#152-current-state-diagram)
    - [Ideal Deathstar Architecture](#153-ideal-deathstar-architecture)
    - [Component Migration Path](#154-component-migration-path)
    - [Data Flow: Ideal State](#155-data-flow-ideal-state)
    - [Server Infrastructure View](#156-server-infrastructure-view)
    - [Web3 Gateway Migration](#157-component-7-web3-gateway-migration-path)

**References**
16. [Industry Research & References](#16-industry-research--references)

**Migration & Templates**
17. [Master Migration Plan (January 2026)](#17-master-migration-plan-january-2026)
18. [Detailed Code Inventory for Migration](#18-detailed-code-inventory-for-migration)
19. [Universal Store Template Architecture](#19-universal-store-template-architecture)
    - [19.11 Endpoint Configuration System](#1911-endpoint-configuration-system) ← NEW
    - [19.11.4 Shopnet Client Plugin](#19114-shopnet-client-plugin-architecture)
    - [19.11.7 Implementation Plan](#19117-implementation-plan)

---

## 1. The Problem We're Solving

### Traditional E-commerce Scaling

Building multiple e-commerce sites traditionally requires:
- Separate hosting for each site
- Duplicate product databases
- Individual payment integrations
- Per-site maintenance overhead
- Linear cost scaling (10x sites = 10x cost)

### The Shopnet Approach

Instead of building complete stores, we build:
- **Thin endpoints** (brochure pages) that cost almost nothing
- **Shared AI backends** that serve all endpoints
- **One gateway** that routes and authenticates everything
- **One console** that manages the entire network

**Result:** Sublinear cost scaling. 1000 sites cost barely more than 10.

### Industry Validation

This architecture mirrors proven patterns:
- **GoDaddy** uses this model for tens of thousands of unique live storefronts
- **Salesforce** pioneered multi-tenant SaaS serving millions of clients on shared infrastructure
- **AWS CloudFront SaaS Manager** was specifically built for this use case

---

## 2. Platform Architecture

### ⚠️ TLD Naming Convention (IMPORTANT)

**Infrastructure services (.network TLD):**
- `shopnet.network` - Network monitoring console
- `connect.shopnet.network` - API Gateway admin/dashboard
- `data.shopnet.network` - Database service admin GUI ✅ **MIGRATING NOW**
- `assist.shopnet.network` - AI agents admin/dashboard (future)

**Customer-facing products (.domains TLD):**
- `shopnet.domains` - Domain store (client)
- `alien.domains` - Domain store (client)
- `lasercat.domains` - Domain store (client)

**🚧 Active Migration (Jan 19, 2026):**
- Moving `data.shopnet.domains` → `data.shopnet.network` for TLD consistency
- Both URLs work during 30-day transition period
- Claudius: Use `data.shopnet.network` for all new search module code
- See: `MIGRATION-DATA-SHOPNET-NETWORK.md` and `AUDIT-DATA-SHOPNET-DOMAINS-USAGE.md`

---

```
                                    THE SHOPNET PLATFORM
    ════════════════════════════════════════════════════════════════════════

    LAYER 1: ENDPOINTS (Unlimited)
    ──────────────────────────────────────────────────────────────────────

         buyerassist.ai    shopnet.domains    alien.domains    best.gifts
              │                  │                  │               │
         findyour.ai       web3pay.domains    bestbird.com    shopnet.gifts
              │                  │                  │               │
         (... 40+ more, scaling to 1000s ...)
              │                  │                  │               │
              └──────────────────┼──────────────────┴───────────────┘
                                 │
                                 ▼
    LAYER 2: GATEWAY (Single Entry Point)
    ──────────────────────────────────────────────────────────────────────

                    ┌─────────────────────────────────┐
                    │       SHOPNET.CONNECT API       │
                    │      connect.shopnet.network    │
                    │                                 │
                    │  • License validation (HMAC)    │
                    │  • Tenant identification        │
                    │  • Request routing              │
                    │  • Per-tenant rate limiting     │
                    │  • Usage metering               │
                    │  • Response caching             │
                    └────────────────┬────────────────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
                    ▼                ▼                ▼
    LAYER 3: BACKENDS (Shared Services)
    ──────────────────────────────────────────────────────────────────────

        ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
        │  PRODUCT.ASSIST │  │  DOMAIN.ASSIST  │  │  DAILY CONTENT  │
        │                 │  │                 │  │                 │
        │  AI product     │  │  Web3 domain    │  │  Scheduled      │
        │  search across  │  │  discovery and  │  │  images, text,  │
        │  any catalog    │  │  purchase       │  │  promotions     │
        │                 │  │                 │  │                 │
        │  Database:      │  │  Database:      │  │  Storage:       │
        │  Amazon RDS     │  │  data.shopnet   │  │  S3 + CDN       │
        │                 │  │  (2,011 TLDs)   │  │                 │
        └─────────────────┘  └─────────────────┘  └─────────────────┘

    ════════════════════════════════════════════════════════════════════════

    MANAGEMENT LAYER (Admin Only)
    ──────────────────────────────────────────────────────────────────────

                    ┌─────────────────────────────────┐
                    │       SHOPNET.NETWORK           │
                    │    Network Management Console   │
                    │                                 │
                    │  • Create/manage endpoints      │
                    │  • Configure AI agents          │
                    │  • Provision DNS + SSL          │
                    │  • Monitor health + usage       │
                    │  • Manage licenses              │
                    │  • Tenant branding config       │
                    └─────────────────────────────────┘
```

### data.shopnet: Remote Database Architecture

**data.shopnet** is the standardized name for our remote database service that powers domain-related endpoints throughout the ShopNet network.

**Architecture Flow:**
```
Database (RDS PostgreSQL)
    ↓
connect.shopnet API Gateway
    ↓
Endpoint Clients (shopnet.domains, alien.domains, etc.)
    ↓
Search Module (built by Claudius)
```

**Key Characteristics:**
- **Centralized Database:** Single PostgreSQL database on AWS RDS containing 2,011+ TLDs and category data
- **API-First Access:** All endpoints access data through connect.shopnet API (no direct database connections)
- **Multi-Endpoint Support:** Powers multiple domain store endpoints (shopnet.domains, alien.domains, lasercat.domains, etc.)
- **Admin GUI:** Accessible at `https://data.shopnet.network/admin` (requires second-level authentication: `admin@data.shopnet`)
- **Search Integration:** Paired with search module client for endpoint implementation

**Naming Conventions:**
- **Service Name:** `data.shopnet` (lowercase, standardized)
- **Admin Login:** `admin@data.shopnet` (second-level authentication)
- **Live URL:** `https://data.shopnet.network` (infrastructure TLD - correct)
- **Legacy URL:** `https://data.shopnet.network` (deprecated, kept for 30-day backwards compatibility)
- **Display Name in UIs:** "data.shopnet" (lowercase)

**⚠️ MIGRATION IN PROGRESS (January 19, 2026):**
- Moving from `data.shopnet.domains` → `data.shopnet.network` to align with .network TLD for infrastructure
- Dual-stack: Both domains work during transition
- Search module (built by Claudius) should reference `data.shopnet.network` for new code
- See: `MIGRATION-DATA-SHOPNET-NETWORK.md` for details

**Endpoints Using data.shopnet:**
- shopnet.domains (primary endpoint)
- alien.domains
- lasercat.domains
- (Future endpoints as they're built)

Each endpoint has its own page within the data.shopnet admin GUI (e.g., `shopnet.domains` endpoint configuration page).

---

## 3. The Three Layers

### Layer 1: Endpoints (The Storefronts)

**What they are:** Branded landing pages that present AI services to users

**Characteristics:**
- Static HTML/CSS/JS hosted on S3 + CloudFront
- Near-zero hosting cost (~$0.50/month each)
- Unique branding, messaging, domain
- All business logic delegated to gateway
- Spin up in minutes via management console

**Current count:** 40+ active
**Target:** 1,000+ with same infrastructure

**Types:**
| Type | Example | Backend |
|------|---------|---------|
| Product Finder | buyerassist.ai | Product.Assist |
| Domain Finder | alien.domains | Domain.Assist |
| Gift Finder | best.gifts | Product.Assist |
| Niche Store | bestbird.com | Product.Assist |
| Gateway/Hub | web3.sn | Domain.Assist |

### Layer 2: Gateway (The Router)

**What it is:** Single API that all endpoints call

**Responsibilities:**
1. **Tenant Identification** - Every request carries tenant context derived from license, not user-supplied values
2. **Authentication** - Validate license keys with HMAC signatures
3. **Authorization** - Check feature access per license tier
4. **Routing** - Direct requests to appropriate backend
5. **Filtering** - Apply data filters based on license
6. **Caching** - Reduce backend load with smart caching
7. **Metering** - Track usage for billing and analytics
8. **Rate Limiting** - Per-tenant throttling to prevent noisy neighbor problems

**Why single gateway matters:**
- One place to update security
- One place to add features
- One place to monitor health
- Consistent behavior across all endpoints
- Prevents any tenant from impacting others

### Layer 3: Backends (The Brains)

**What they are:** Specialized services that do the actual work

**Product.Assist:**
- AI-powered product search and recommendations
- Connects to product databases (Amazon RDS)
- Powers: bestbird.com, best.gifts, buyerassist.ai, etc.
- LLM integration for natural language queries

**Domain.Assist:**
- Web3 domain discovery and search
- Connects to data.shopnet (2,011 TLDs, 37 categories)
- Powers: shopnet.domains, alien.domains, web3.sn, etc.
- Relevancy scoring and categorization

**Daily Content:**
- Scheduled promotional content
- Images, text, deals updated daily
- Timezone-aware delivery
- CDN-cached for global performance

---

## 4. Endpoint Types

### 4.1 Brochure Endpoints (Majority)

**Purpose:** Marketing landing pages with AI chat widget

**Stack:**
```
index.html          ← Static page with branding
styles.css          ← Custom styling (tenant-specific)
shopnet-connect.js  ← Universal connector script
```

**Hosted on:** S3 + CloudFront (using CloudFront SaaS Manager for scale)
**Cost:** ~$0.50/month
**Setup time:** 5 minutes via console

**How it works:**
1. User visits buyerassist.ai
2. Page loads with chatbot widget
3. Widget calls connect.shopnet.network/api/chat
4. Gateway validates license, routes to Product.Assist
5. AI responds with product recommendations

**White-Label Customization:**
- Theme colors and branding via JSON config
- Logo, favicon, custom fonts
- Welcome messages per tenant
- No code changes required for new tenants

### 4.2 Prototype Stores (Full E-commerce)

**Purpose:** Complete shopping experience with cart/checkout

**Current prototypes:**
- **shopnet.domains** (WordPress/WooCommerce) - Domain.Assist
- **bestbird.com** (Shopify) - Product.Assist

**Stack:**
```
WordPress/Shopify   ← Full e-commerce platform
WooCommerce/Shopify ← Cart, checkout, payments
connect.shopnet     ← Data sync, chatbot, daily content
```

**Why keep prototypes:**
- Prove the full purchase flow works
- Test new features before rolling to network
- Handle complex transactions that brochures can't

### 4.3 Gateway Endpoints

**Purpose:** Hub pages that aggregate or redirect

**Examples:**
- web3.sn - Web3 domain gateway
- web3smartlinks.com - Blockchain resource hub

**Stack:** Lambda@Edge + CloudFront routing

---

## 5. The Gateway (connect.shopnet API)

### 5.1 Core Design Principles

1. **Stateless** - No session state in gateway, all in backends
2. **Fast** - Sub-100ms response for cached content
3. **Secure** - HMAC signatures, domain binding, rate limits
4. **Observable** - Tenant context in every metric, log, and trace
5. **Extensible** - New channels added without breaking existing
6. **Fair** - Per-tenant throttling prevents noisy neighbors

### 5.2 API Channels

| Channel | Endpoint | Description |
|---------|----------|-------------|
| **Chat** | `/api/v1/chat/*` | AI conversation with product/domain search |
| **Data** | `/api/v1/data/*` | TLD/product data sync and queries |
| **Daily** | `/api/v1/daily-content` | Scheduled promotional content |
| **License** | `/api/v1/license/*` | License validation and info |
| **Analytics** | `/api/v1/analytics/*` | Usage stats and recommendations |

### 5.3 Authentication Flow (HMAC)

```
┌─────────────┐                      ┌─────────────┐
│   Endpoint  │                      │   Gateway   │
│ (Browser)   │                      │             │
└──────┬──────┘                      └──────┬──────┘
       │                                    │
       │  1. Create signature               │
       │     timestamp = current_time       │
       │     nonce = random_string          │
       │     message = timestamp.nonce.     │
       │               method.path.body     │
       │     sig = HMAC-SHA256(secret, msg) │
       │                                    │
       │  2. Send request ─────────────────►│
       │     Headers:                       │
       │       X-License-Key: snc_xxx       │
       │       X-Timestamp: 1705401234      │
       │       X-Nonce: abc123              │
       │       X-Signature: def456...       │
       │                                    │
       │                             3. Validate:
       │                                - Key exists?
       │                                - License active?
       │                                - Domain allowed?
       │                                - Timestamp within 5min?
       │                                - Nonce not reused?
       │                                - Signature matches?
       │                                (constant-time compare)
       │                                    │
       │                             4. Set tenant context
       │                             5. Route to backend
       │                                    │
       │  6. Response ◄────────────────────│
       │                                    │
```

### 5.4 Why HMAC Over JWT for This Use Case

| Aspect | HMAC | JWT |
|--------|------|-----|
| **Latency** | Millions of verifications/sec | Requires parsing + verification |
| **Offline** | Works without token server | May need token refresh |
| **Use case** | Trusted system-to-system | User authentication |
| **Complexity** | Simple | Requires token management |

HMAC is ideal for this architecture because:
- Endpoints are controlled systems (not arbitrary users)
- We need maximum performance at gateway
- No need for token refresh flows
- Secret never transmitted (only used for signing)

**Security Best Practices Implemented:**
- SHA-256 algorithm (never SHA-1)
- Timestamp + nonce prevents replay attacks
- Constant-time comparison prevents timing attacks
- 5-minute window for timestamp freshness
- HTTP verb included in signature to prevent method substitution

### 5.5 License Model

```sql
CREATE TABLE licenses (
    id              UUID PRIMARY KEY,
    license_key     VARCHAR(64) UNIQUE NOT NULL,  -- snc_bestbird_prod_2026
    license_secret  VARCHAR(64) NOT NULL,         -- For HMAC (never transmitted)

    -- Tenant Info
    tenant_id       VARCHAR(64) NOT NULL,         -- Derived, used internally
    customer_name   VARCHAR(255),
    customer_type   VARCHAR(20),                  -- internal, franchisee, third_party

    -- Access Control
    domains         TEXT[],                       -- Allowed origins
    tier            VARCHAR(20),                  -- free, basic, pro, enterprise
    features        TEXT[],                       -- Enabled channels

    -- Data Filtering
    filter_groups   TEXT[],                       -- TLD groups allowed
    filter_categories INTEGER[],                  -- Category IDs allowed
    filter_public   BOOLEAN DEFAULT true,

    -- Rate Limiting
    rate_limit_minute INTEGER DEFAULT 60,
    rate_limit_day    INTEGER DEFAULT 10000,

    -- Lifecycle
    status          VARCHAR(20) DEFAULT 'active',
    created_at      TIMESTAMP DEFAULT NOW(),
    expires_at      TIMESTAMP,
    last_used_at    TIMESTAMP
);

CREATE INDEX idx_license_key ON licenses(license_key);
CREATE INDEX idx_tenant_id ON licenses(tenant_id);
```

**Tier Features:**

| Tier | Price | Features | Rate Limit |
|------|-------|----------|------------|
| Free | $0 | daily_content | 10/min |
| Basic | $29/mo | + chatbot | 30/min |
| Pro | $99/mo | + data_sync, analytics | 60/min |
| Enterprise | Custom | + white-label, SLA | 200/min |
| Internal | N/A | All features | 500/min |

### 5.6 Tenant Isolation & Data Filtering

**The "Noisy Neighbor" Problem:**
In multi-tenant systems, one tenant's heavy usage can impact others. Solution: per-tenant rate limiting at the gateway.

```python
# Gateway pseudocode
async def handle_request(request):
    # 1. Validate HMAC signature
    license = validate_signature(request)

    # 2. Derive tenant context (never trust client)
    tenant_id = license.tenant_id

    # 3. Check per-tenant rate limit
    if rate_limiter.is_exceeded(tenant_id):
        return 429, "Rate limit exceeded"

    # 4. Apply data filters
    filters = {
        "groups": license.filter_groups,
        "categories": license.filter_categories,
        "public_only": license.filter_public
    }

    # 5. Route to backend with tenant context
    response = await route_to_backend(request, tenant_id, filters)

    # 6. Log with tenant context for observability
    log_request(tenant_id, request, response)

    return response
```

---

## 6. AI Backends

### 6.1 Product.Assist

**Purpose:** AI-powered product discovery and recommendations

**Architecture:**
```
┌─────────────────────────────────────────────────────────┐
│                    PRODUCT.ASSIST                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │   LLM       │  │  Product    │  │   Session   │     │
│  │  (Local     │  │  Database   │  │   Store     │     │
│  │   Install)  │  │  (RDS)      │  │  (Redis)    │     │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘     │
│         │                │                │             │
│         └────────────────┼────────────────┘             │
│                          │                              │
│              ┌───────────┴───────────┐                  │
│              │     Chat Engine       │                  │
│              │                       │                  │
│              │  • Parse user intent  │                  │
│              │  • Search products    │                  │
│              │  • Generate response  │                  │
│              │  • Track conversation │                  │
│              └───────────────────────┘                  │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

**LLM Gateway Pattern:**
Never allow endpoint code to call LLM APIs directly. The gateway acts as an inference gateway, providing:
- Cost control per tenant
- Usage tracking
- Model routing (different tiers get different models)
- Caching for repeated queries

**Database:** Amazon Products RDS (PostgreSQL)
- Host: `amazon-products-db-*.us-east-1.rds.amazonaws.com`
- Status: Active (password recovery needed)

### 6.2 Domain.Assist

**Purpose:** Web3 domain discovery, search, and purchase facilitation

**Capabilities:**
- TLD search by keyword, category, characteristics
- Relevancy scoring (SODI algorithm)
- Category-based filtering (37 categories)
- Emoji/Kanji domain support
- Purchase flow via Freename API

**Database:** data.shopnet PostgreSQL
- Location: data.shopnet.network
- Records: 2,011 TLDs, 37 categories, 5,249 assignments
- Admin: https://data.shopnet.network/admin

### 6.3 Daily Content Service

**Purpose:** Scheduled promotional content delivery

**How it works:**
1. Admin uploads daily images/text via console
2. Content stored in S3 with date-based keys
3. Endpoints request `/api/v1/daily-content`
4. Gateway returns today's content (timezone-aware)
5. Content cached in browser localStorage until refresh hour

---

## 7. Management Console

### 7.1 Current: shopnet.network

**What exists today (Lambda):**
- Domain management (add/delete/duplicate endpoints)
- UI customization per domain
- Chatbot/Agent configuration
- SEO/GEO auto-generation
- DNS management (Route 53)
- SSL provisioning (ACM)
- CloudFront monitoring

**Platform:** Lambda + CloudFront (static HTML/JS)

**Full documentation:** `/Users/tim001/VSCode/purchaseassist-ShopifyV1/shopnet.network/SHOPNET-NETWORK-ARCHITECTURE.md`

### 7.1.1 Console Migration Status (Jan 18, 2026)

**New Console Shell Built:**
- Location: Connect Server (34.234.121.248) port 8001
- Code: `/Users/tim001/VSCode/shopnet-console/`
- Backup: `/Users/tim001/VSCode/connect.shopnet/shopnet-console-backup/`
- Design: Professional SaaS left-nav sidebar (220px dark theme)

**Migration Plan:** `/Users/tim001/VSCode/connect.shopnet/CONSOLE-MIGRATION-PLAN.md`

| Phase | Description | Status |
|-------|-------------|--------|
| 1 | Merge data.shopnet admin panels into console | ⏳ Pending |
| 2 | Port Lambda endpoint management to Connect Server | ⏳ Pending |
| 3 | Build assist.shopnet agent panels | ⏳ Pending |
| 4 | Decommission Lambda dashboard | ⏳ Pending |

**Principle:** ONE CONSOLE, NO DUPLICATES. All admin in shopnet.network on Connect Server.

### 7.2 Target: Unified Network Console

**Additional capabilities needed:**

| Tab | Function |
|-----|----------|
| **Dashboard** | System health, usage metrics, alerts |
| **Endpoints** | All 40+ sites with status, traffic, health |
| **Licenses** | Create/manage licenses, set features/filters |
| **Data Admin** | TLD management (embed data.shopnet.network admin) |
| **Analytics** | Per-tenant usage patterns, popular queries |
| **Billing** | Stripe integration, usage-based invoicing |
| **Users** | Admin user management, roles, permissions |
| **Audit Log** | Security and change tracking |

### 7.3 White-Label Branding

**Tenant-specific customization without code changes:**

```json
{
  "tenant_id": "bestbird",
  "branding": {
    "logo_url": "https://cdn.../bestbird-logo.png",
    "favicon_url": "https://cdn.../bestbird-favicon.ico",
    "primary_color": "#FF6B35",
    "secondary_color": "#2E2E2E",
    "font_family": "Inter, sans-serif"
  },
  "chatbot": {
    "welcome_message": "Hi! I can help you find the perfect bird products.",
    "avatar_url": "https://cdn.../bird-avatar.png",
    "position": "bottom-right"
  },
  "seo": {
    "title_template": "{query} | BestBird",
    "meta_description": "Find premium bird products with AI assistance"
  }
}
```

Theme configs stored in database, loaded via API, applied via CSS variables.

### 7.4 Access Levels (RBAC)

```
┌─────────────────────────────────────────────────────────┐
│              ACCESS LEVEL HIERARCHY                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  SUPER_ADMIN (Full)                                     │
│  ├── All endpoints                                      │
│  ├── All licenses                                       │
│  ├── System configuration                               │
│  ├── User management                                    │
│  └── Billing management                                 │
│                                                          │
│  FRANCHISEE (Scoped)                                    │
│  ├── Their endpoints only                               │
│  ├── Their licenses only                                │
│  ├── Branding configuration                             │
│  └── View their billing                                 │
│                                                          │
│  CLIENT (Minimal)                                       │
│  ├── Their license status                               │
│  ├── Their usage stats                                  │
│  └── Trigger manual sync                                │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 8. Scaling Model

### 8.1 Why This Scales

**Traditional model:** Each site is a full stack
```
Site 1: Server + DB + App = $50/month
Site 2: Server + DB + App = $50/month
...
Site 100: Server + DB + App = $50/month
Total: $5,000/month
```

**Shopnet model:** Sites share infrastructure
```
Gateway: 1 server = $50/month
Backends: 2 databases = $100/month
Endpoints: 100 x S3/CF = $50/month
Total: $200/month
```

**10x sites, 25x cheaper.**

This matches industry patterns:
> "A single codebase, shared infrastructure, and unified updates reduce overhead dramatically—while giving every tenant a fully branded, independent storefront. The result is faster go-to-market, lower costs, and centralized management." - Industry SaaS Architecture Guide

### 8.2 AWS CloudFront SaaS Manager

For scaling beyond 100 endpoints, AWS CloudFront SaaS Manager is purpose-built for this:

**Multi-Tenant Distributions:**
- Blueprint specifies shared config (cache, security, origins)
- Each tenant gets a "distribution tenant" with custom domain
- Shared ACM certificate covers all tenants
- Per-tenant WAF rules, geographic restrictions
- Automatic TLS certificate provisioning

**How it works:**
1. Create multi-tenant distribution (blueprint)
2. For each new endpoint, create distribution tenant
3. Tenant inherits shared config, gets custom domain
4. DNS points to CloudFront, SSL auto-provisioned

### 8.3 Marginal Cost Per Endpoint

| Component | First Site | Each Additional |
|-----------|------------|-----------------|
| S3 hosting | $0.50 | $0.50 |
| CloudFront | $1.00 | $0.10 |
| SSL cert | $0 (ACM) | $0 (ACM) |
| DNS | $0.50 | $0.50 |
| Gateway load | included | ~$0.01 |
| **Total** | **$2.00** | **~$1.10** |

Real-world validation: One case study showed S3 + CloudFront hosting averaging **$0.93/month** for a static site.

### 8.4 Scaling Bottlenecks & Solutions

| Bottleneck | Solution |
|------------|----------|
| Gateway CPU | Horizontal scaling (ALB) or Lambda |
| Database connections | Connection pooling (PgBouncer) |
| LLM API limits | Queue + per-tenant rate limiting |
| DNS propagation | Pre-provision with CloudFront SaaS Manager |
| Management console | Pagination, lazy loading |
| Noisy neighbors | Per-tenant throttling at gateway |

### 8.5 Target Scale

| Metric | Current | Phase 1 | Phase 2 | Phase 3 |
|--------|---------|---------|---------|---------|
| Endpoints | 40 | 100 | 500 | 2,000+ |
| Requests/day | ~1K | 10K | 100K | 1M+ |
| Backend DBs | 2 | 2 | 2-3 | 3-5 |
| Gateway instances | 1 | 1-2 | 2-4 | Auto-scale |

---

## 9. Security Architecture

### 9.0 Authentication Strategy Decision

**Decision: HMAC for API, Cognito for Admin Console only**

See full analysis: [AUTH-STRATEGY-HMAC-VS-COGNITO.md](./AUTH-STRATEGY-HMAC-VS-COGNITO.md)

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                      │
│   SHOPNET AUTHENTICATION STRATEGY                                   │
│                                                                      │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│   HMAC-SHA256 (Primary - 99% of traffic)                            │
│   ──────────────────────────────────────                            │
│   • Brochure sites → Gateway           WHY HMAC:                    │
│   • Gateway → Backend Lambdas          • ~1-2ms latency (fast)      │
│   • WordPress plugin → Gateway         • $0 cost at any scale       │
│   • Shopify app → Gateway              • No auth server bottleneck  │
│   • All automated/system traffic       • Purpose-built for S2S      │
│                                                                      │
│   Cognito (Admin only - 1% of traffic)                              │
│   ────────────────────────────────────                              │
│   • shopnet.network console login      WHY COGNITO HERE:            │
│   • Admin dashboard access             • Human users need sessions  │
│   • Human operators only               • MFA for admin access       │
│                                        • Social login option        │
│                                                                      │
│   OAuth (Future - if needed)                                        │
│   ──────────────────────────                                        │
│   • Third-party developer API access   WHY OAUTH LATER:             │
│   • Partner integrations               • External devs need tokens  │
│   • "Connect your Shopnet account"     • Standard for public APIs   │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘

WHY NOT COGNITO FOR EVERYTHING?
───────────────────────────────
• 50-100ms latency vs 1-2ms for HMAC (50x slower)
• Adds complexity (token refresh, session management)
• Solves wrong problem (user auth vs system auth)
• Cost scales with users ($0.0055/MAU after 50k)

HMAC serves the mandate: highest scalability, lowest cost, secure.
```

### 9.1 Defense in Depth

```
┌─────────────────────────────────────────────────────────┐
│                   SECURITY LAYERS                        │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Layer 7: WAF (AWS WAF)                                 │
│  └── SQL injection, XSS, bot protection                 │
│                                                          │
│  Layer 6: Per-Tenant Rate Limiting                      │
│  └── Prevents noisy neighbor attacks                    │
│                                                          │
│  Layer 5: TLS/HTTPS                                     │
│  └── All communications encrypted (ACM certs)           │
│                                                          │
│  Layer 4: Request Signing (HMAC-SHA256)                 │
│  └── Cryptographic verification, replay protection      │
│                                                          │
│  Layer 3: Domain Binding                                │
│  └── License only works from registered domains         │
│                                                          │
│  Layer 2: License Secret                                │
│  └── Never transmitted, stored in secrets manager       │
│                                                          │
│  Layer 1: License Key                                   │
│  └── Unique identifier per tenant                       │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### 9.2 HMAC Implementation Best Practices

Based on industry research, our implementation includes:

**1. Algorithm:** SHA-256 only (SHA-1 is deprecated)

**2. Signature Construction:**
```python
# Include HTTP verb to prevent method substitution attacks
message = f"{timestamp}.{nonce}.{method}.{path}.{body_hash}"
signature = hmac.new(secret.encode(), message.encode(), sha256).hexdigest()
```

**3. Replay Attack Prevention:**
- Timestamp must be within 5-minute window
- Nonce cached to prevent reuse within window
- Both timestamp AND nonce required

**4. Timing Attack Prevention:**
```python
# Always use constant-time comparison
import hmac
if not hmac.compare_digest(expected_sig, provided_sig):
    raise AuthenticationError()
```

**5. Key Management:**
- Secrets stored in AWS Secrets Manager (not code)
- Minimum 32 bytes (256 bits)
- Regular rotation schedule
- Never logged or returned in responses

### 9.3 Tenant Isolation

| Threat | Mitigation |
|--------|------------|
| Tenant data leak | Row-level filtering by tenant_id |
| Noisy neighbor | Per-tenant rate limits |
| Cross-tenant access | Tenant derived from license, not request |
| Key theft | Domain binding + short expiry + rotation |
| DDoS | CloudFront + WAF + rate limiting |

### 9.4 Compliance Considerations

For future enterprise customers:
- Data segregation enforced at gateway
- Audit logging with tenant context
- RBAC for admin access
- SOC 2 / GDPR readiness through data filtering

---

## 10. Infrastructure Options

### 10.1 Current Assets

| Asset | Location | Status |
|-------|----------|--------|
| US East EC2 | 54.236.245.127 | Production |
| Australia EC2 | 13.217.5.143 | Wiped, available |
| Amazon Products RDS | us-east-1 | Active (need password) |
| data.shopnet | data.shopnet.network | Production |
| shopnet.network | S3 + CloudFront | Production |

### 10.2 Infrastructure Separation Principle

**CRITICAL DESIGN DECISION:** Endpoints must NEVER run on the same infrastructure as backends/gateway.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        INFRASTRUCTURE SEPARATION                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ENDPOINTS (Layer 1)                    BACKEND/GATEWAY (Layer 2+3)        │
│   ──────────────────                     ──────────────────────────         │
│                                                                              │
│   S3 + CloudFront                        EC2 / Lambda                       │
│   ├── 40+ brochure sites                 ├── connect.shopnet.network        │
│   ├── Static HTML/CSS/JS                 ├── Gateway API                    │
│   └── Zero server management             ├── Product.Assist                 │
│                                          ├── Domain.Assist                  │
│   Prototype Stores (separate)            └── PostgreSQL / RDS               │
│   ├── shopnet.domains (WP/EC2)                                              │
│   └── bestbird.com (Shopify)             Management Console                 │
│                                          └── shopnet.network (S3+CF)        │
│                                                                              │
│   WHY SEPARATE:                                                             │
│   ✓ Security isolation - endpoint compromise doesn't expose backend         │
│   ✓ Independent scaling - endpoints scale via CDN, backends scale compute   │
│   ✓ Clean blast radius - issues contained to their layer                    │
│   ✓ Different update cycles - endpoints change frequently, backends stable  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 10.3 Deployment Architecture

**Endpoints (Layer 1) - MUST be separate infrastructure:**
```
CloudFront + S3 (Brochure Sites):
├── buyerassist.ai, findyour.ai, etc. (40+ sites)
├── Static assets only
├── Call gateway via HTTPS
└── Cost: ~$0.50/site/month

Prototype Stores (Full E-commerce):
├── shopnet.domains → WordPress on separate EC2 or managed hosting
├── bestbird.com → Shopify (already separate)
└── These also call gateway, never host backend code
```

**Backend + Gateway (Layer 2+3) - Dedicated infrastructure:**

**Option A: Single Backend Server (Recommended for Phase 1)**
```
Dedicated EC2 (NOT the endpoint server):
├── Gateway API (FastAPI) - connect.shopnet.network
├── Product.Assist (FastAPI)
├── Domain.Assist (Flask)
├── PostgreSQL (data.shopnet)
└── Redis (sessions/cache)

Pros: Simple, cheap, clear separation
Cons: Single point of failure for backend
Cost: ~$50/month
Best for: Proving architecture, first 100 endpoints
```

**Option B: Serverless Backend (Most Scalable)**
```
AWS Lambda + API Gateway:
├── Gateway (Lambda)
├── Product.Assist (Lambda)
├── Domain.Assist (Lambda)
├── RDS (managed PostgreSQL)
└── ElastiCache (Redis)

Pros: Auto-scaling, pay-per-use, inherently separate from endpoints
Cons: Cold starts (mitigated by provisioned concurrency)
Cost: $0-200/month (usage based)
Best for: 500+ endpoints, variable traffic
```

**Option C: Hybrid Backend**
```
EC2 for stateful:
├── PostgreSQL databases
├── Redis cache
└── Background workers

Lambda for stateless:
├── Gateway API
├── Chat endpoints
└── Daily content

Pros: Cost-effective, scales where needed
Cons: More moving parts
Cost: ~$100/month base
Best for: 200-1000 endpoints
```

### 10.4 Current Asset Assignment

| Asset | Role | Layer |
|-------|------|-------|
| US East EC2 (54.236.245.127) | Currently hosts shopnet.domains (WP) + data.shopnet.domains (API) | Mixed - needs separation |
| Australia EC2 (13.217.5.143) | Available - wiped | Could become dedicated backend server |
| CloudFront + S3 | Brochure endpoints | Layer 1 (correct) |
| Shopify | bestbird.com | Layer 1 (correct) |
| Amazon Products RDS | Product database | Layer 3 (correct) |

**Recommended Separation:**
1. **US East EC2** → Dedicated to shopnet.domains WordPress (prototype store endpoint)
2. **New/Australia EC2** → Dedicated backend: Gateway + Product.Assist + Domain.Assist + data.shopnet
3. **S3 + CloudFront** → All brochure endpoints (already correct)

### 10.5 Lambda@Edge for Global Performance

For endpoints with global users, Lambda@Edge runs code at CloudFront edge locations:

**Benefits:**
- Sub-50ms latency globally
- Code runs close to users
- Automatic global distribution

**Use cases:**
- Request routing based on domain
- A/B testing
- Light authentication validation at edge
- Response transformation

**Note:** Lambda@Edge is for edge processing only - heavy backend logic still runs on dedicated backend infrastructure.

### 10.6 Recommended Progression

```
Phase 1 (0-100 endpoints):    Option A (Single dedicated backend server)
Phase 2 (100-500 endpoints):  Option C (Hybrid backend)
Phase 3 (500+ endpoints):     Option B (Full serverless backend)

Endpoints always remain on S3+CloudFront (brochures) or managed platforms (Shopify/WP).
```

Start simple, scale as needed. The architecture supports migration between backend options while endpoints remain stable.

---

## 11. Implementation Roadmap

### Phase 1: Gateway Foundation

**Goal:** Working gateway with HMAC authentication

**Tasks:**
- [ ] Create gateway FastAPI application
- [ ] Implement HMAC signature validation (SHA-256, timestamp, nonce)
- [ ] Create license database schema
- [ ] Implement per-tenant rate limiting
- [ ] Build routing to existing backends
- [ ] Deploy to US East EC2
- [ ] Test with single endpoint (shopnet.domains)

**Deliverable:** `connect.shopnet.network` responding to authenticated requests

### Phase 2: Migrate Prototype Stores

**Goal:** Both prototype stores using gateway

**Tasks:**
- [ ] Update shopnet.domains WordPress connector
- [ ] Update bestbird.com Shopify connector
- [ ] Verify data sync through gateway
- [ ] Verify chatbot through gateway
- [ ] Add tenant context to all logs/metrics
- [ ] Remove direct backend connections

**Deliverable:** Prototypes fully running through gateway

### Phase 3: Endpoint Migration

**Goal:** All 40+ brochure endpoints using gateway

**Tasks:**
- [ ] Update shopnet-connect.js for HMAC auth
- [ ] Create licenses for all endpoints
- [ ] Update DNS/config in shopnet.network
- [ ] Batch migrate endpoints (10 at a time)
- [ ] Verify each endpoint works
- [ ] Monitor for issues

**Deliverable:** 100% of endpoints using gateway

### Phase 4: Console Enhancement

**Goal:** Unified management console

**Tasks:**
- [ ] Add license management to shopnet.network
- [ ] Add endpoint monitoring dashboard
- [ ] Embed data.shopnet.domains admin
- [ ] Add per-tenant usage analytics
- [ ] Add billing integration (Stripe)

**Deliverable:** Single console managing entire network

### Phase 5: Scale Testing

**Goal:** Validate scaling model

**Tasks:**
- [ ] Load test gateway (1000 req/sec)
- [ ] Create 50 new test endpoints
- [ ] Measure marginal costs
- [ ] Test CloudFront SaaS Manager for 100+ domains
- [ ] Document scaling procedures
- [ ] Create runbook for adding new endpoints

**Deliverable:** Proven ability to scale to 500+ endpoints

---

## 12. Current Assets Inventory

### 12.1 Servers

| Server | IP | Region | Role | Status | Services |
|--------|-----|--------|------|--------|----------|
| **Connect Server** | **34.234.121.248** | **us-east-1** | **Infrastructure** | ✅ **Active** | connect.shopnet, data.shopnet, console |
| Old EC2 | 54.236.245.127 | us-east-1 | WordPress Only | Active | shopnet.domains (presentation) |
| ~~Australia~~ | ~~13.217.5.143~~ | ~~ap-southeast-2~~ | ~~Available~~ | ✅ **TERMINATED** (Jan 17, 2026) | - |

#### Connect Server Details (34.234.121.248)

**Platform:** AWS Lightsail Ubuntu 22.04 LTS
**Region:** us-east-1 (US East - N. Virginia)
**Instance Type:** 2 vCPU, 2 GB RAM, 60 GB SSD
**SSH Key:** `/Users/tim001/VSCode/Keys/TLemmon.pem`
**SSH Access:** `ssh -i /Users/tim001/VSCode/Keys/TLemmon.pem ubuntu@34.234.121.248`

**Services Running:**

1. **connect.shopnet.network** (Port 8000)
   - FastAPI gateway (connect.shopnet API)
   - Systemd service: `shopnet-connect`
   - Code: `/opt/shopnet/connect-gateway/`
   - Venv: `/opt/shopnet/connect-gateway/venv/`
   - URL: https://connect.shopnet.network

2. **data.shopnet.network** (Port 5000)
   - Flask API + Admin GUI
   - Systemd service: `shopnet-data-api`
   - Code: `/opt/shopnet/data-api/`
   - Admin GUI: `/opt/shopnet/admin-gui/`
   - Venv: `/opt/shopnet/data-api/venv/`
   - URL: https://data.shopnet.network
   - Admin: https://data.shopnet.network/admin
   - Login: `admin@data.shopnet` / `Admin2026`

3. **shopnet.network** (Port 8001)
   - Network management console
   - Systemd service: `shopnet-console`
   - Code: `/home/ubuntu/shopnet-console/`
   - Venv: `/home/ubuntu/shopnet-console/venv/`
   - URL: https://shopnet.network
   - Login: `admin@shopnet.network` / `Admin2026`

4. **Nginx** (Ports 80, 443)
   - Reverse proxy for all services
   - SSL certificates via Let's Encrypt
   - Config: `/etc/nginx/sites-available/shopnet`

**Nginx Virtual Hosts:**
- `data.shopnet.domains` → 127.0.0.1:5000 (deprecated, 30-day transition)
- `data.shopnet.network` → 127.0.0.1:5000 (preferred)
- `connect.shopnet.network` → 127.0.0.1:8000
- `shopnet.network` → 127.0.0.1:8001

**SSL Certificates (Let's Encrypt):**
- `data.shopnet.domains` - expires April 18, 2026
- `data.shopnet.network` - expires April 19, 2026
- `connect.shopnet.network` - expires April 18, 2026
- `shopnet.network` - expires April 18, 2026

#### Old EC2 Details (54.236.245.127)

**Platform:** AWS EC2 Bitnami WordPress
**Region:** us-east-1
**SSH Key:** `/Users/tim001/VSCode/Keys/TLemmon.pem`
**SSH Access:** `ssh -i /Users/tim001/VSCode/Keys/TLemmon.pem bitnami@54.236.245.127`

**Services Running:**
- WordPress (shopnet.domains presentation layer)
- MariaDB (WordPress database)
- Apache web server

**To Be Migrated:**
- WordPress should eventually move to S3 + CloudFront (static site)
- Server can be downsized to t3.small once API-first migration complete

### 12.2 Databases

| Database | Host | Engine | Data |
|----------|------|--------|------|
| data.shopnet | ✅ **RDS** (consolidated) | PostgreSQL | 2,011 TLDs |
| Amazon Products | *.us-east-1.rds.amazonaws.com | PostgreSQL | Products |
| connect.shopnet | *.us-east-1.rds.amazonaws.com | PostgreSQL | Licenses (NEW) |
| WordPress | 127.0.0.1:3306 | MariaDB | WP content |

### 12.3 Endpoints Summary

| Category | Count | Examples |
|----------|-------|----------|
| Product.Assist | 14 | buyerassist.ai, bestbird.com, best.gifts |
| Domain.Assist | 24 | shopnet.domains, alien.domains, web3.sn |
| Gateway | 2 | web3.sn, web3smartlinks.com |
| **Total** | **40+** | |

### 12.4 Code Repositories

| Repo | Purpose | Status |
|------|---------|--------|
| data.shopnet | TLD database + API | Production |
| connect.shopnet | Gateway architecture | Design |
| shopnet.domains-WP | WordPress prototype | Production |
| BestBird.com-Shopify | Shopify prototype | Production |

---

## 13. Cost Analysis

### 13.1 Current Monthly Costs (Estimated)

| Item | Cost |
|------|------|
| US East EC2 (t3.medium) | $30 |
| Australia EC2 (t3.micro) | $10 |
| RDS (db.t3.micro) | $15 |
| S3 + CloudFront | $20 |
| Route 53 | $5 |
| **Total** | **~$80/month** |

### 13.2 Projected Costs at Scale

| Scale | Endpoints | Gateway | Backends | Storage | Total | Per Endpoint |
|-------|-----------|---------|----------|---------|-------|--------------|
| Current | 40 | $30 | $45 | $20 | $95 | $2.38 |
| 100 | 100 | $30 | $45 | $30 | $105 | $1.05 |
| 500 | 500 | $60 | $60 | $50 | $170 | $0.34 |
| 1000 | 1000 | $100 | $80 | $70 | $250 | **$0.25** |

### 13.3 Revenue Model

| Tier | Price | Target Customers |
|------|-------|------------------|
| Free | $0 | Lead generation |
| Basic | $29/mo | Small businesses |
| Pro | $99/mo | Growing businesses |
| Enterprise | $499+/mo | Large clients |
| Franchise | $999+/mo | Network operators |

**Break-even:** ~3 Pro licenses cover infrastructure

---

## 14. Success Metrics

### 14.1 Technical Metrics

| Metric | Target |
|--------|--------|
| Gateway latency (p95) | < 100ms |
| Gateway uptime | 99.9% |
| Endpoint spin-up time | < 5 minutes |
| Failed requests | < 0.1% |
| Cache hit rate | > 80% |

### 14.2 Business Metrics

| Metric | Phase 1 | Phase 2 | Phase 3 |
|--------|---------|---------|---------|
| Active endpoints | 50 | 200 | 1000 |
| Paid licenses | 5 | 20 | 100 |
| Monthly revenue | $500 | $2,000 | $10,000 |
| Cost per endpoint | $2 | $0.85 | $0.25 |

### 14.3 Operational Metrics

| Metric | Target |
|--------|--------|
| Time to add new endpoint | < 10 minutes |
| Time to onboard new customer | < 1 hour |
| Support tickets per customer | < 1/month |
| Mean time to resolution | < 24 hours |

---

## 15. Current State vs Ideal Deathstar Architecture

### 15.1 The Seven Core Components

| # | Component | Current State | Ideal Deathstar |
|---|-----------|---------------|-----------------|
| 1 | **Backend Databases** | Split: Products on RDS, Domains on EC2 | Both on RDS with unified admin in shopnet.network |
| 2 | **AI Agents** | Product.Assist on Lambda (local LLM), Domain.Assist on EC2 (PHP, no LLM) | Both on Lambda with local LLM, extensible for more agents |
| 3 | **Endpoints** | 40+ brochure sites, 2 prototype stores | Categorized: Products, Domains, Hybrid (both) |
| 4 | **Management Console** | shopnet.network (partial) | Unified hub with role-based access |
| 5 | **Brochure Sites** | S3+CloudFront (working) | Same, scaling to 1000s |
| 6 | **API Gateway** | ❌ MISSING | shopnet.connect - the critical missing piece |
| 7 | **Web3 Gateway** | web3.sn + web3smartlinks.com (test/partial) | IP-based HTTPS, blockchain traffic routing |

### 15.2 Current State Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           CURRENT STATE (January 2026)                           │
│                           ════════════════════════════                           │
│                                                                                  │
│                     ⚠️ NO UNIFIED GATEWAY - Direct connections everywhere        │
│                                                                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   DATABASES (Split)                      AI AGENTS (Split)                       │
│   ─────────────────                      ─────────────────                       │
│                                                                                  │
│   ┌─────────────────────┐               ┌─────────────────────┐                 │
│   │ Amazon Products RDS │               │   Product.Assist    │                 │
│   │ (us-east-1)         │◄──────────────│   AWS Lambda        │                 │
│   │                     │               │   ✅ LIVE           │                 │
│   │ • 13k products      │               │   • Local LLM       │                 │
│   │ • 230k reviews      │               │   • CloudFront      │                 │
│   │ • domains config    │               └─────────────────────┘                 │
│   └─────────────────────┘                         │                             │
│                                                   │ Direct                      │
│   ┌─────────────────────┐               ┌────────▼────────────┐                 │
│   │ data.shopnet PG     │               │   Domain.Assist     │                 │
│   │ EC2 (54.236.245.127)│◄──────────────│   WordPress PHP     │                 │
│   │                     │               │   ⚠️ NO LLM         │                 │
│   │ • 2,011 TLDs        │               │   • Rule-based only │                 │
│   │ • 37 categories     │               │   • Same EC2        │                 │
│   │ • Flask API         │               └─────────────────────┘                 │
│   └─────────────────────┘                         │                             │
│            │                                      │                             │
│            │ Direct                               │ Direct                      │
│            ▼                                      ▼                             │
│   ┌─────────────────────┐               ┌─────────────────────┐                 │
│   │ data.shopnet.domains│               │ shopnet.domains     │                 │
│   │ Admin GUI           │               │ WordPress/WooCommerce│                │
│   └─────────────────────┘               └─────────────────────┘                 │
│                                                                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   ENDPOINTS (No unified routing)                                                │
│   ──────────────────────────────                                                │
│                                                                                  │
│   Product Sites ────► Lambda directly     Domain Sites ────► EC2 directly       │
│   • buyerassist.ai                        • shopnet.domains                     │
│   • bestbird.com (Shopify)                • alien.domains                       │
│   • best.gifts (WIP)                      • web3.sn                             │
│   • toysforpets.co (WIP)                  • web3pay.domains                     │
│                                                                                  │
│   Brochure Sites ────► S3+CloudFront (working but no gateway auth)             │
│   • shopperassist.ai, findyour.ai, etc.                                        │
│                                                                                  │
│   Web3 Sites ────► Unknown servers (3.81.115.9? 50.17.187.45?)                 │
│   • web3.sn (gateway)         ⚠️ NEEDS VERIFICATION                            │
│   • web3smartlinks.com        ⚠️ NEEDS VERIFICATION                            │
│   • Test .crypto/.eth sites   ⚠️ NEEDS VERIFICATION                            │
│                                                                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   MANAGEMENT                                                                    │
│   ──────────────                                                                │
│                                                                                  │
│   ┌─────────────────────┐    ┌─────────────────────┐                           │
│   │ shopnet.network     │    │ data.shopnet.domains│                           │
│   │ S3+CloudFront       │    │ Flask Admin         │                           │
│   │ ✅ Active           │    │ ✅ Active           │                           │
│   │                     │    │                     │                           │
│   │ • Domain management │    │ • TLD CRUD          │  ⚠️ SEPARATE CONSOLES    │
│   │ • UI customization  │    │ • Category mgmt     │                           │
│   │ • DNS provisioning  │    │ • Sync triggers     │                           │
│   │ • CloudFront config │    │                     │                           │
│   └─────────────────────┘    └─────────────────────┘                           │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

PROBLEMS WITH CURRENT STATE:
────────────────────────────
❌ No unified authentication/authorization
❌ No license management or metering
❌ Direct database connections from multiple places
❌ Domain.Assist has no LLM (Product.Assist does)
❌ Databases on different infrastructure (RDS vs EC2)
❌ Two separate admin consoles
❌ No way to add third-party licensees
❌ Cannot scale endpoint management efficiently
❌ Web3 servers undocumented (IPs 3.81.115.9, 50.17.187.45 unknown)
❌ Web3 gateway configuration not recorded
```

### 15.3 Ideal Deathstar Architecture

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                        IDEAL DEATHSTAR ARCHITECTURE                              │
│                        ════════════════════════════                              │
│                                                                                  │
│                   ★ SHOPNET.CONNECT GATEWAY AT THE CENTER ★                     │
│                                                                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │                                                                            │  │
│  │   COMPONENT 4: SHOPNET.NETWORK - Unified Management Console               │  │
│  │   ═══════════════════════════════════════════════════════                 │  │
│  │                                                                            │  │
│  │   ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐    │  │
│  │   │  Endpoints   │ │  Licenses    │ │   Data       │ │  Analytics   │    │  │
│  │   │  Management  │ │  Management  │ │   Admin      │ │  Dashboard   │    │  │
│  │   ├──────────────┤ ├──────────────┤ ├──────────────┤ ├──────────────┤    │  │
│  │   │ • 40+ sites  │ │ • HMAC keys  │ │ • TLD CRUD   │ │ • Usage/site │    │  │
│  │   │ • DNS/SSL    │ │ • Tiers      │ │ • Product DB │ │ • API calls  │    │  │
│  │   │ • Branding   │ │ • Features   │ │ • Categories │ │ • Costs      │    │  │
│  │   │ • UI config  │ │ • Rate limits│ │ • Sync       │ │ • Health     │    │  │
│  │   └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘    │  │
│  │                                                                            │  │
│  │   ACCESS LEVELS:                                                          │  │
│  │   • SUPER_ADMIN (Shopnet): Full access to everything                      │  │
│  │   • FRANCHISEE: Their endpoints + licenses only                           │  │
│  │   • LICENSEE: View their usage + trigger syncs                            │  │
│  │                                                                            │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│                                            │                                    │
│                                            │ Admin API                          │
│                                            ▼                                    │
│  ┌───────────────────────────────────────────────────────────────────────────┐  │
│  │                                                                            │  │
│  │   COMPONENT 6: SHOPNET.CONNECT - API Gateway (THE MISSING PIECE)          │  │
│  │   ═══════════════════════════════════════════════════════════════         │  │
│  │                                                                            │  │
│  │                     connect.shopnet.network                               │  │
│  │                     ───────────────────────                               │  │
│  │                                                                            │  │
│  │   ┌─────────────────────────────────────────────────────────────────┐    │  │
│  │   │                                                                  │    │  │
│  │   │  1. AUTHENTICATE    2. AUTHORIZE       3. ROUTE                 │    │  │
│  │   │  ───────────────    ─────────────      ───────                  │    │  │
│  │   │  • HMAC-SHA256      • License tier     • /chat/* → AI Agents   │    │  │
│  │   │  • Timestamp+Nonce  • Feature flags    • /data/* → Databases   │    │  │
│  │   │  • Domain binding   • Data filters     • /daily/* → Content    │    │  │
│  │   │                                                                  │    │  │
│  │   │  4. RATE LIMIT      5. METER           6. CACHE                 │    │  │
│  │   │  ──────────────     ─────────          ───────                  │    │  │
│  │   │  • Per-tenant       • Usage tracking   • Response caching       │    │  │
│  │   │  • Prevent abuse    • Billing data     • Reduce backend load    │    │  │
│  │   │                                                                  │    │  │
│  │   └─────────────────────────────────────────────────────────────────┘    │  │
│  │                                                                            │  │
│  └───────────────────────────────────────────────────────────────────────────┘  │
│                         │                              │                        │
│           ┌─────────────┴──────────────┐   ┌──────────┴───────────┐            │
│           ▼                            ▼   ▼                      ▼            │
│  ┌─────────────────────────────────────────────────────────────────────────┐   │
│  │                                                                          │   │
│  │   COMPONENT 2: AI AGENTS (Separate, Extensible)                         │   │
│  │   ═════════════════════════════════════════════                         │   │
│  │                                                                          │   │
│  │   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐        │   │
│  │   │ Product.Assist  │  │ Domain.Assist   │  │ Future Agents   │        │   │
│  │   │ ─────────────── │  │ ─────────────── │  │ ─────────────── │        │   │
│  │   │ AWS Lambda      │  │ AWS Lambda      │  │ AWS Lambda      │        │   │
│  │   │ ✅ LIVE         │  │ 🔄 BUILD TO MATCH│  │ 📋 PLANNED      │        │   │
│  │   │                 │  │   PRODUCT.ASSIST│  │                 │        │   │
│  │   │ • Local LLM     │  │ • Local LLM     │  │ • Gift.Assist   │        │   │
│  │   │ • Product search│  │ • TLD search    │  │ • Travel.Assist │        │   │
│  │   │ • Recommendations│ │ • Suggestions   │  │ • Compare.Assist│        │   │
│  │   │ • Wishlist      │  │ • Category match│  │ • (extensible)  │        │   │
│  │   │                 │  │                 │  │                 │        │   │
│  │   └────────┬────────┘  └────────┬────────┘  └─────────────────┘        │   │
│  │            │                    │                                       │   │
│  │            ▼                    ▼                                       │   │
│  │   ┌─────────────────────────────────────────────────────────────┐      │   │
│  │   │                                                              │      │   │
│  │   │   COMPONENT 1: BACKEND DATABASES (Unified on RDS)           │      │   │
│  │   │   ═══════════════════════════════════════════════           │      │   │
│  │   │                                                              │      │   │
│  │   │   ┌───────────────────┐    ┌───────────────────┐            │      │   │
│  │   │   │  Products DB      │    │  Domains DB       │            │      │   │
│  │   │   │  (amazon_products)│    │  (shopnet_data)   │            │      │   │
│  │   │   │                   │    │                   │            │      │   │
│  │   │   │  • 13k+ products  │    │  • 2,011+ TLDs    │            │      │   │
│  │   │   │  • 230k reviews   │    │  • 37 categories  │            │      │   │
│  │   │   │  • domain configs │    │  • 5,249 assigns  │            │      │   │
│  │   │   │                   │    │                   │            │      │   │
│  │   │   └───────────────────┘    └───────────────────┘            │      │   │
│  │   │                                                              │      │   │
│  │   │   ONE RDS INSTANCE, TWO DATABASES, ZERO INTERDEPENDENCE     │      │   │
│  │   │   Admin GUIs embedded in shopnet.network (Component 4)      │      │   │
│  │   │                                                              │      │   │
│  │   └──────────────────────────────────────────────────────────────┘      │   │
│  │                                                                          │   │
│  └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│   COMPONENT 3: ENDPOINTS (All via Gateway)                                     │
│   ════════════════════════════════════════                                     │
│                                                                                 │
│   ┌───────────────────────────────────────────────────────────────────────┐   │
│   │                                                                        │   │
│   │   PRODUCT ENDPOINTS                 DOMAIN ENDPOINTS                   │   │
│   │   ─────────────────                 ────────────────                   │   │
│   │                                                                        │   │
│   │   Shopify:                          WooCommerce:                       │   │
│   │   • bestbird.com ✅                 • shopnet.domains ✅               │   │
│   │                                                                        │   │
│   │   WooCommerce (WIP):                Future:                            │   │
│   │   • best.gifts 🔨                   • More domain stores               │   │
│   │   • toysforpets.co 🔨                                                  │   │
│   │                                                                        │   │
│   ├────────────────────────────────────────────────────────────────────────┤   │
│   │                                                                        │   │
│   │   HYBRID ENDPOINTS (BOTH Products + Domains)                          │   │
│   │   ──────────────────────────────────────────                          │   │
│   │                                                                        │   │
│   │   Coming Soon:                                                         │   │
│   │   • findyour.com    ← Both Product.Assist + Domain.Assist             │   │
│   │   • shop.it.com     ← Both agents available                           │   │
│   │   • wefind.it       ← User chooses products or domains                │   │
│   │                                                                        │   │
│   └────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│   ┌───────────────────────────────────────────────────────────────────────┐   │
│   │                                                                        │   │
│   │   COMPONENT 5: BROCHURE SITES (Scale to 1000s)                        │   │
│   │   ════════════════════════════════════════════                        │   │
│   │                                                                        │   │
│   │   S3 + CloudFront (via CloudFront SaaS Manager)                       │   │
│   │   ───────────────────────────────────────────                         │   │
│   │                                                                        │   │
│   │   Single-page AI chat widgets:                                        │   │
│   │   • buyerassist.ai      • shopperassist.ai    • findassist.ai        │   │
│   │   • giftassist.ai       • choiceassist.ai     • purchaseassist.ai    │   │
│   │   • domainassist.ai     • web3pay.domains     • alien.domains        │   │
│   │   • ... (40+ current, scaling to 1000s)                              │   │
│   │                                                                        │   │
│   │   Each site: ~$1/month, spins up in minutes, unique branding         │   │
│   │   All authenticate through SHOPNET.CONNECT gateway                    │   │
│   │                                                                        │   │
│   └────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
│   ┌───────────────────────────────────────────────────────────────────────┐   │
│   │                                                                        │   │
│   │   COMPONENT 7: WEB3 GATEWAY (Blockchain Bridge)                       │   │
│   │   ════════════════════════════════════════════                        │   │
│   │                                                                        │   │
│   │   Dedicated EC2 with Elastic IP + IP-based HTTPS Certificate          │   │
│   │   ──────────────────────────────────────────────────────────          │   │
│   │                                                                        │   │
│   │   SERVICES:                                                            │   │
│   │   ├── Web3 Gateway (web3.sn)                                          │   │
│   │   │   └── Web2 → Web3 traffic routing                                 │   │
│   │   │                                                                    │   │
│   │   ├── Web3 Smart Links (web3smartlinks.com)                           │   │
│   │   │   └── Blockchain resource hub                                     │   │
│   │   │                                                                    │   │
│   │   └── Domain Resolution Proxy                                          │   │
│   │       ├── .crypto → Unstoppable Domains                               │   │
│   │       ├── .eth → ENS (Ethereum Name Service)                          │   │
│   │       └── .nft → NFT domains                                          │   │
│   │                                                                        │   │
│   │   WHY SEPARATE:                                                        │   │
│   │   • Web3 domains bypass traditional DNS                               │   │
│   │   • Requires IP-based SSL (can't validate via DNS)                    │   │
│   │   • Different traffic patterns than Web2 sites                        │   │
│   │   • Needs direct blockchain/IPFS connectivity                         │   │
│   │                                                                        │   │
│   └────────────────────────────────────────────────────────────────────────┘   │
│                                                                                 │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                 │
│   OWNERSHIP TIERS (via licenses)                                               │
│   ══════════════════════════════                                               │
│                                                                                 │
│   OWNED (Internal)          FRANCHISED              LICENSED (Third Party)     │
│   ────────────────          ──────────              ────────────────────────   │
│   shopnet.domains           Partner networks        API-only customers         │
│   bestbird.com              White-label resellers   Build own endpoints        │
│   best.gifts                Full admin access       Rate-limited access        │
│   All brochures             Their endpoints only    Data filtered by tier      │
│                                                                                 │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 15.4 Component Migration Path

```
════════════════════════════════════════════════════════════════════════════════
                        MIGRATION PRIORITY ORDER
                 (Based on Design Principles Compliance)
════════════════════════════════════════════════════════════════════════════════

PRIORITY 1: DECOMPOSE EC2 54.236.245.127 (Fixes Tier Separation Violation)
──────────────────────────────────────────────────────────────────────────

This is the MOST CRITICAL migration because it violates ALL design principles.
One server currently runs: Presentation + Business Logic + Data = WRONG

   STEP A: Migrate PostgreSQL to RDS (Tier 4 separation)
   ───────────────────────────────────────────────────────
   1. [ ] Dump shopnet_data from EC2 PostgreSQL
   2. [ ] Create shopnet_data database on existing RDS instance
   3. [ ] Restore dump to RDS
   4. [ ] Update Flask API connection string
   5. [ ] Test API connectivity to RDS
   6. [ ] Stop PostgreSQL on EC2
   ⏱️  Result: Data tier separated

   STEP B: Move Domain.Assist to Lambda (Tier 3 separation)
   ─────────────────────────────────────────────────────────
   1. [ ] Build domain_assist_lambda.py (parallel to Product.Assist)
   2. [ ] Connect to RDS (shopnet_data)
   3. [ ] Add local LLM integration
   4. [ ] Deploy to AWS Lambda
   5. [ ] Update DNS/routing for Domain.Assist
   6. [ ] Deprecate PHP Domain.Assist on EC2
   ⏱️  Result: Business logic tier separated

   STEP C: Move Flask API to Lambda (Tier 3 separation)
   ──────────────────────────────────────────────────────
   1. [ ] Convert Flask app to Lambda-compatible (Mangum wrapper)
   2. [ ] Deploy as separate Lambda function
   3. [ ] Update data.shopnet.domains routing
   4. [ ] Remove Flask from EC2
   ⏱️  Result: All business logic off EC2

   AFTER PRIORITY 1:
   EC2 54.236.245.127 contains ONLY:
   ├── WordPress (Tier 1: Presentation) ✅
   └── MariaDB (WordPress-specific, acceptable)

────────────────────────────────────────────────────────────────────────────────

PRIORITY 2: BUILD THE GATEWAY (Establishes Single Entry Point)
──────────────────────────────────────────────────────────────

Cannot have proper tier separation without the gateway routing traffic.

   1. [ ] Create FastAPI gateway application
   2. [ ] Implement HMAC signature validation
   3. [ ] Create license database schema (in RDS)
   4. [ ] Implement per-tenant rate limiting
   5. [ ] Build routing to Product.Assist Lambda
   6. [ ] Build routing to Domain.Assist Lambda
   7. [ ] Deploy gateway to Lambda (or dedicated EC2)
   8. [ ] DNS: connect.shopnet.network → gateway
   9. [ ] Test end-to-end with one endpoint
   ⏱️  Result: Single entry point established

────────────────────────────────────────────────────────────────────────────────

PRIORITY 3: MIGRATE ENDPOINTS TO GATEWAY
─────────────────────────────────────────

Once gateway exists, route all traffic through it.

   1. [ ] Update shopnet-connect.js with HMAC signing
   2. [ ] Migrate one brochure site (buyerassist.ai) as test
   3. [ ] Migrate shopnet.domains WordPress to use gateway
   4. [ ] Batch migrate all 40+ brochure sites
   5. [ ] Block direct backend access (gateway only)
   ⏱️  Result: All traffic through gateway

════════════════════════════════════════════════════════════════════════════════
```

---

### Component-by-Component Details

```
CURRENT → IDEAL MIGRATION STEPS
════════════════════════════════

COMPONENT 1: Backend Databases
──────────────────────────────
CURRENT: Products on RDS (us-east-1), Domains on EC2 PostgreSQL
TARGET:  Both on same RDS instance (separate databases)

Steps:
1. [ ] Dump shopnet_data from EC2 PostgreSQL
2. [ ] Create shopnet_data database on Amazon Products RDS
3. [ ] Restore dump to RDS
4. [ ] Update Domain.Assist connection string
5. [ ] Verify data integrity
6. [ ] Deprecate EC2 PostgreSQL

───────────────────────────────────────────────────────────────────────

COMPONENT 2: AI Agents
──────────────────────
CURRENT: Product.Assist (Lambda + local LLM), Domain.Assist (PHP, no LLM)
TARGET:  Domain.Assist built to parallel Product.Assist (Lambda + local LLM)

Steps:
1. [ ] Study Product.Assist architecture as reference
2. [ ] Build domain_assist_lambda.py to match Product.Assist structure
3. [ ] Connect to shopnet_data database (TLDs, categories)
4. [ ] Add local LLM integration for suggestions (same as Product.Assist)
5. [ ] Implement conversation flow: intent → refinement → suggestions
6. [ ] Deploy to AWS Lambda
7. [ ] Route Domain.Assist endpoints to Lambda
8. [ ] Deprecate PHP Domain.Assist on EC2

───────────────────────────────────────────────────────────────────────

COMPONENT 3: Endpoints
─────────────────────
CURRENT: Direct connections to backends
TARGET:  All through connect.shopnet gateway

Product Endpoints:
1. [ ] bestbird.com - Update connector to use gateway
2. [ ] best.gifts - Build with gateway from start
3. [ ] toysforpets.co - Build with gateway from start

Domain Endpoints:
1. [ ] shopnet.domains - Update module-loader.php to use gateway
2. [ ] Future stores - Build with gateway from start

Hybrid Endpoints:
1. [ ] findyour.com - Enable both agents via license
2. [ ] shop.it.com - Enable both agents via license
3. [ ] wefind.it - Enable both agents via license

───────────────────────────────────────────────────────────────────────

COMPONENT 4: Management Console
──────────────────────────────
CURRENT: shopnet.network (partial) + data.shopnet.domains (separate)
TARGET:  Unified shopnet.network with embedded admin

Steps:
1. [ ] Embed data.shopnet.domains admin as iframe/component
2. [ ] Add Products admin panel
3. [ ] Add License management UI
4. [ ] Add Analytics dashboard
5. [ ] Implement RBAC (Super Admin / Franchisee / Licensee)
6. [ ] Add billing integration (Stripe)

───────────────────────────────────────────────────────────────────────

COMPONENT 5: Brochure Sites
──────────────────────────
CURRENT: S3+CloudFront, direct to backends
TARGET:  S3+CloudFront, through gateway with HMAC auth

Steps:
1. [ ] Update shopnet-connect.js with HMAC signing
2. [ ] Create license for each brochure site
3. [ ] Test with one site (buyerassist.ai)
4. [ ] Batch migrate all 40+ sites
5. [ ] Set up CloudFront SaaS Manager for scaling

───────────────────────────────────────────────────────────────────────

COMPONENT 6: connect.shopnet Gateway (THE CRITICAL MISSING PIECE)
────────────────────────────────────────────────────────────────
CURRENT: Does not exist
TARGET:  connect.shopnet.network

Steps:
1. [ ] Create FastAPI gateway application
2. [ ] Implement HMAC signature validation
3. [ ] Create license database schema
4. [ ] Implement per-tenant rate limiting
5. [ ] Build routing to Product.Assist Lambda
6. [ ] Build routing to Domain.Assist Lambda
7. [ ] Build routing to databases (data channel)
8. [ ] Deploy to Lambda (or dedicated EC2)
9. [ ] DNS: connect.shopnet.network → gateway
10. [ ] Test end-to-end with one endpoint
```

### 15.5 Data Flow: Ideal State

```
USER REQUEST FLOW (Ideal Deathstar)
═══════════════════════════════════

   User on buyerassist.ai
            │
            │ 1. User types: "bird feeders under $50"
            ▼
   ┌─────────────────────────┐
   │   Brochure Site         │
   │   (S3 + CloudFront)     │
   │                         │
   │   shopnet-connect.js:   │
   │   • Create HMAC sig     │
   │   • Add license headers │
   └───────────┬─────────────┘
               │
               │ 2. POST /api/v1/chat/message
               │    Headers: X-License-Key, X-Timestamp, X-Nonce, X-Signature
               ▼
   ┌─────────────────────────────────────────────────────────────────┐
   │                                                                  │
   │   SHOPNET.CONNECT GATEWAY (connect.shopnet.network)             │
   │                                                                  │
   │   3. Validate HMAC signature                                    │
   │   4. Look up license → tenant_id: "buyerassist"                 │
   │   5. Check rate limit for tenant                                │
   │   6. Verify feature access (chat: ✅)                           │
   │   7. Route to Product.Assist                                    │
   │                                                                  │
   └─────────────────────────────┬────────────────────────────────────┘
                                 │
                                 │ 8. Forward to backend
                                 ▼
   ┌─────────────────────────────────────────────────────────────────┐
   │                                                                  │
   │   PRODUCT.ASSIST (Lambda)                                       │
   │                                                                  │
   │   9.  Parse user intent                                         │
   │   10. Query Amazon Products DB                                  │
   │   11. Call local LLM with context                               │
   │   12. Generate response with product cards                      │
   │                                                                  │
   └─────────────────────────────┬────────────────────────────────────┘
                                 │
                                 │ 13. Response with products
                                 ▼
   ┌─────────────────────────────────────────────────────────────────┐
   │                                                                  │
   │   GATEWAY                                                        │
   │                                                                  │
   │   14. Log request with tenant context                           │
   │   15. Update usage metrics                                      │
   │   16. Cache response (if applicable)                            │
   │   17. Return to endpoint                                        │
   │                                                                  │
   └─────────────────────────────┬────────────────────────────────────┘
                                 │
                                 │ 18. JSON response
                                 ▼
   ┌─────────────────────────┐
   │   Brochure Site         │
   │                         │
   │   19. Render products   │
   │   20. User sees results │
   └─────────────────────────┘


HYBRID ENDPOINT FLOW (e.g., findyour.com)
═════════════════════════════════════════

Same flow, but license allows BOTH Product.Assist AND Domain.Assist:

   license = {
       tenant_id: "findyour",
       features: ["chat_products", "chat_domains", "data_sync"],
       agents: ["product.assist", "domain.assist"]
   }

User can:
• "Find me a bird feeder" → Routes to Product.Assist
• "Find me a .crypto domain" → Routes to Domain.Assist
• UI shows both options / agent picker
```

### 15.6 Server Infrastructure View

This section provides a physical/virtual server-level view of where services run.

```
SERVER INFRASTRUCTURE: CURRENT STATE
═════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                                  │
│   AWS US-EAST-1 REGION                                                          │
│   ═════════════════════                                                         │
│                                                                                  │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │                                                                          │   │
│   │   EC2: 54.236.245.127 (PRIMARY PRODUCTION)                              │   │
│   │   ─────────────────────────────────────────                             │   │
│   │   Bitnami LAMP Stack                                                    │   │
│   │                                                                          │   │
│   │   SERVICES:                                                              │   │
│   │   ├── Apache (443, 80)                                                  │   │
│   │   │   ├── VHost: shopnet.domains (WordPress/WooCommerce)                │   │
│   │   │   └── VHost: data.shopnet.domains (Flask API proxy)                 │   │
│   │   │                                                                      │   │
│   │   ├── WordPress + WooCommerce                                           │   │
│   │   │   ├── Domain.Assist PHP (rule-based, NO LLM) ⚠️                     │   │
│   │   │   └── shopnet-domain-theme                                          │   │
│   │   │                                                                      │   │
│   │   ├── Flask API (:5000)                                                 │   │
│   │   │   └── data.shopnet API endpoints                                    │   │
│   │   │                                                                      │   │
│   │   ├── PostgreSQL 15 (:5432) - localhost only                            │   │
│   │   │   └── Database: shopnet_data (2,011 TLDs, 37 categories)            │   │
│   │   │                                                                      │   │
│   │   └── MariaDB (:3306) - localhost only                                  │   │
│   │       └── Database: bitnami_wordpress                                   │   │
│   │                                                                          │   │
│   │   SSL: Let's Encrypt (domain-based certs)                               │   │
│   │   DNS: Route 53 → shopnet.domains, data.shopnet.domains                 │   │
│   │                                                                          │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │                                                                          │   │
│   │   RDS: amazon-products-db-*.us-east-1.rds.amazonaws.com                 │   │
│   │   ──────────────────────────────────────────────────────                │   │
│   │   PostgreSQL (managed)                                                  │   │
│   │                                                                          │   │
│   │   DATABASES:                                                             │   │
│   │   └── amazon_products                                                   │   │
│   │       ├── 13,000+ products                                              │   │
│   │       ├── 230,000+ reviews                                              │   │
│   │       └── domains_configs table                                         │   │
│   │                                                                          │   │
│   │   CONNECTED TO: Product.Assist Lambda                                   │   │
│   │                                                                          │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │                                                                          │   │
│   │   AWS LAMBDA: product-assist-lambda                                     │   │
│   │   ─────────────────────────────────                                     │   │
│   │   ARN: arn:aws:lambda:us-east-1:667865750202:function:product-assist... │   │
│   │                                                                          │   │
│   │   SERVICES:                                                              │   │
│   │   └── Product.Assist AI Agent                                           │   │
│   │       ├── Local LLM integration ✅                                      │   │
│   │       ├── product_assist_lambda.py                                      │   │
│   │       ├── ai_conversation_controller.py                                 │   │
│   │       └── database.py → RDS                                             │   │
│   │                                                                          │   │
│   │   ENDPOINTS SERVED:                                                      │   │
│   │   • bestbird.com (Shopify)                                              │   │
│   │   • buyerassist.ai                                                      │   │
│   │   • best.gifts (WIP)                                                    │   │
│   │                                                                          │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │                                                                          │   │
│   │   S3 + CLOUDFRONT (Multiple Distributions)                              │   │
│   │   ────────────────────────────────────────                              │   │
│   │                                                                          │   │
│   │   BROCHURE SITES (40+):                                                  │   │
│   │   ├── shopnet.network (management console)                              │   │
│   │   ├── buyerassist.ai, shopperassist.ai, findassist.ai                   │   │
│   │   ├── choiceassist.ai, purchaseassist.ai, giftassist.ai                 │   │
│   │   ├── web3pay.domains, alien.domains, web3emoji.domains                 │   │
│   │   └── ... 30+ more                                                      │   │
│   │                                                                          │   │
│   │   Static HTML/CSS/JS, ~$0.50/month each                                 │   │
│   │                                                                          │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   WEB3 SERVERS (TEST/DEVELOPMENT) - TO BE VERIFIED                             │
│   ═════════════════════════════════════════════════                             │
│                                                                                  │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │                                                                          │   │
│   │   IP: 3.81.115.9 (AWS us-east-1) - NEEDS VERIFICATION                   │   │
│   │   ────────────────────────────────────────────────────                  │   │
│   │   PURPOSE: Web3 test server (suspected)                                  │   │
│   │   STATUS: Unknown - requires SSH access to verify                       │   │
│   │                                                                          │   │
│   │   POTENTIAL SERVICES:                                                    │   │
│   │   • web3.sn gateway                                                     │   │
│   │   • Web3 domain resolution proxy                                        │   │
│   │   • IP-based HTTPS certificate (for Web3 traffic)                       │   │
│   │                                                                          │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │                                                                          │   │
│   │   IP: 50.17.187.45 (AWS us-east-1) - NEEDS VERIFICATION                 │   │
│   │   ─────────────────────────────────────────────────────                 │   │
│   │   PURPOSE: Web3 test server (suspected)                                  │   │
│   │   STATUS: Unknown - requires SSH access to verify                       │   │
│   │                                                                          │   │
│   │   POTENTIAL SERVICES:                                                    │   │
│   │   • web3smartlinks.com gateway                                          │   │
│   │   • Blockchain resource hub                                             │   │
│   │   • IP-based HTTPS certificate (for Web3 traffic)                       │   │
│   │                                                                          │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   AUSTRALIA REGION (ap-southeast-2) - AVAILABLE                                │
│   ═══════════════════════════════════════════════                              │
│                                                                                  │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │                                                                          │   │
│   │   EC2: 13.217.5.143                                                     │   │
│   │   ──────────────────                                                    │   │
│   │   STATUS: Wiped/available for future use                                │   │
│   │   POTENTIAL USE: APAC region endpoint or disaster recovery              │   │
│   │                                                                          │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘


SERVER INFRASTRUCTURE: IDEAL DEATHSTAR STATE
═════════════════════════════════════════════

┌─────────────────────────────────────────────────────────────────────────────────┐
│                                                                                  │
│   AWS US-EAST-1 REGION (PRIMARY)                                                │
│   ══════════════════════════════                                                │
│                                                                                  │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │                                                                          │   │
│   │   RDS: CONSOLIDATED DATABASE INSTANCE                                   │   │
│   │   ───────────────────────────────────                                   │   │
│   │   PostgreSQL (Multi-AZ for HA)                                          │   │
│   │                                                                          │   │
│   │   DATABASES:                                                             │   │
│   │   ├── amazon_products                                                   │   │
│   │   │   ├── Products table (13k+)                                         │   │
│   │   │   ├── Reviews table (230k+)                                         │   │
│   │   │   └── domains_configs                                               │   │
│   │   │                                                                      │   │
│   │   ├── shopnet_data (MIGRATED FROM EC2)                                  │   │
│   │   │   ├── tlds table (2,011+)                                           │   │
│   │   │   ├── categories table (37)                                         │   │
│   │   │   └── category_assignments (5,249)                                  │   │
│   │   │                                                                      │   │
│   │   └── shopnet_connect (NEW)                                             │   │
│   │       ├── licenses table                                                │   │
│   │       ├── usage_metrics table                                           │   │
│   │       ├── rate_limits table                                             │   │
│   │       └── endpoints_config table                                        │   │
│   │                                                                          │   │
│   │   ✅ Single point of database administration                            │   │
│   │   ✅ Automated backups                                                  │   │
│   │   ✅ Multi-AZ redundancy                                                │   │
│   │                                                                          │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │                                                                          │   │
│   │   AWS LAMBDA: AI AGENTS CLUSTER                                         │   │
│   │   ─────────────────────────────                                         │   │
│   │                                                                          │   │
│   │   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐        │   │
│   │   │ product-assist  │  │ domain-assist   │  │ future-agents   │        │   │
│   │   │ -lambda         │  │ -lambda         │  │ -lambda         │        │   │
│   │   │                 │  │                 │  │                 │        │   │
│   │   │ ✅ LIVE         │  │ 🔄 BUILD TO     │  │ 📋 PLANNED      │        │   │
│   │   │ • Local LLM     │  │   MATCH PRODUCT │  │ • Gift.Assist   │        │   │
│   │   │ • Products DB   │  │ • Local LLM     │  │ • Travel.Assist │        │   │
│   │   │ • CloudFront    │  │ • Domains DB    │  │ • (extensible)  │        │   │
│   │   └─────────────────┘  └─────────────────┘  └─────────────────┘        │   │
│   │                                                                          │   │
│   │   All agents: Same architecture, different domains, same local LLM      │   │
│   │                                                                          │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │                                                                          │   │
│   │   AWS LAMBDA OR EC2: SHOPNET.CONNECT GATEWAY                            │   │
│   │   ──────────────────────────────────────────                            │   │
│   │   Endpoint: connect.shopnet.network                                     │   │
│   │                                                                          │   │
│   │   SERVICES:                                                              │   │
│   │   ├── FastAPI Gateway Application                                       │   │
│   │   │   ├── HMAC authentication                                           │   │
│   │   │   ├── License validation                                            │   │
│   │   │   ├── Per-tenant rate limiting                                      │   │
│   │   │   └── Request routing                                               │   │
│   │   │                                                                      │   │
│   │   ├── Routes:                                                            │   │
│   │   │   ├── /api/v1/chat/* → AI Agents (Lambda)                           │   │
│   │   │   ├── /api/v1/data/* → RDS (direct)                                 │   │
│   │   │   └── /api/v1/daily/* → S3 Content                                  │   │
│   │   │                                                                      │   │
│   │   └── Response caching + usage metering                                 │   │
│   │                                                                          │   │
│   │   ★ THE CRITICAL MISSING PIECE - ALL TRAFFIC FLOWS THROUGH HERE ★      │   │
│   │                                                                          │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │                                                                          │   │
│   │   S3 + CLOUDFRONT + SAAS MANAGER                                        │   │
│   │   ──────────────────────────────                                        │   │
│   │                                                                          │   │
│   │   MANAGEMENT CONSOLE:                                                    │   │
│   │   └── shopnet.network (unified admin)                                   │   │
│   │       ├── Endpoints management                                          │   │
│   │       ├── Licenses management                                           │   │
│   │       ├── Data admin (TLDs, Products)                                   │   │
│   │       └── Analytics dashboard                                           │   │
│   │                                                                          │   │
│   │   BROCHURE SITES (1000s):                                                │   │
│   │   ├── Product endpoints (buyerassist.ai, etc.)                          │   │
│   │   ├── Domain endpoints (alien.domains, etc.)                            │   │
│   │   └── Hybrid endpoints (findyour.com, etc.)                             │   │
│   │                                                                          │   │
│   │   CloudFront SaaS Manager enables scale to 1000s of distributions       │   │
│   │   All authenticate via connect.shopnet gateway                          │   │
│   │                                                                          │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │                                                                          │   │
│   │   EC2: WEB3 GATEWAY SERVER (DEDICATED)                                  │   │
│   │   ────────────────────────────────────                                  │   │
│   │   Elastic IP required for IP-based HTTPS certificates                   │   │
│   │                                                                          │   │
│   │   SERVICES:                                                              │   │
│   │   ├── Web3 Gateway (web3.sn)                                            │   │
│   │   │   ├── Web2 → Web3 traffic routing                                   │   │
│   │   │   ├── Blockchain domain resolution                                  │   │
│   │   │   └── IPFS/ENS/Unstoppable Domains proxy                            │   │
│   │   │                                                                      │   │
│   │   ├── Web3 Smart Links (web3smartlinks.com)                             │   │
│   │   │   └── Blockchain resource hub                                       │   │
│   │   │                                                                      │   │
│   │   └── Test Web3 Sites                                                   │   │
│   │       └── .crypto, .eth, .nft domain demos                              │   │
│   │                                                                          │   │
│   │   SSL: IP-based HTTPS certificate (special for Web3)                    │   │
│   │   WHY: Web3 domains don't use traditional DNS, need IP routing          │   │
│   │                                                                          │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │                                                                          │   │
│   │   EC2: PROTOTYPE STORES (OPTIONAL - CAN PHASE OUT)                      │   │
│   │   ────────────────────────────────────────────────                      │   │
│   │                                                                          │   │
│   │   WordPress/WooCommerce Stores (if still needed):                       │   │
│   │   ├── shopnet.domains (domain marketplace)                              │   │
│   │   └── Future stores for full checkout flow                              │   │
│   │                                                                          │   │
│   │   Note: These may be replaced by Shopify integrations over time         │   │
│   │   Note: bestbird.com already on Shopify (no EC2 needed)                 │   │
│   │                                                                          │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   LOCAL INFRASTRUCTURE                                                          │
│   ════════════════════                                                          │
│                                                                                  │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │                                                                          │   │
│   │   LOCAL LLM SERVER (On-Premises or Private Cloud)                       │   │
│   │   ───────────────────────────────────────────────                       │   │
│   │                                                                          │   │
│   │   SERVICES:                                                              │   │
│   │   └── Self-hosted LLM                                                   │   │
│   │       ├── Powers Product.Assist                                         │   │
│   │       ├── Powers Domain.Assist (planned)                                │   │
│   │       └── Powers future AI agents                                       │   │
│   │                                                                          │   │
│   │   BENEFITS:                                                              │   │
│   │   ✅ Zero API costs                                                     │   │
│   │   ✅ No rate limits                                                     │   │
│   │   ✅ Full control over model                                            │   │
│   │   ✅ Data privacy                                                       │   │
│   │                                                                          │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘


SERVER SUMMARY TABLE
════════════════════

CURRENT STATE:
┌────────────────────────────┬────────────────────────┬────────────────────────────────────────────────┐
│ Server                     │ IP/Endpoint            │ Services Running                               │
├────────────────────────────┼────────────────────────┼────────────────────────────────────────────────┤
│ EC2 US-East (Production)   │ 54.236.245.127         │ WordPress, Flask API, PostgreSQL, MariaDB      │
│ RDS US-East                │ *.rds.amazonaws.com    │ PostgreSQL (amazon_products)                   │
│ Lambda US-East             │ Function ARN           │ Product.Assist                                 │
│ S3 + CloudFront            │ Various distributions  │ 40+ brochure sites, shopnet.network            │
│ Web3 Server 1 (?)          │ 3.81.115.9            │ Unknown - needs verification                   │
│ Web3 Server 2 (?)          │ 50.17.187.45          │ Unknown - needs verification                   │
│ EC2 Australia (Available)  │ 13.217.5.143          │ Wiped/standby                                  │
│ Local LLM                  │ On-premises            │ Self-hosted LLM for AI agents                  │
└────────────────────────────┴────────────────────────┴────────────────────────────────────────────────┘

IDEAL DEATHSTAR STATE:
┌────────────────────────────┬────────────────────────┬────────────────────────────────────────────────┐
│ Server                     │ IP/Endpoint            │ Services Running                               │
├────────────────────────────┼────────────────────────┼────────────────────────────────────────────────┤
│ RDS (Consolidated)         │ *.rds.amazonaws.com    │ amazon_products + shopnet_data + shopnet_conn  │
│ Lambda: Product.Assist     │ Function ARN           │ AI Agent + Local LLM                           │
│ Lambda: Domain.Assist      │ Function ARN           │ AI Agent + Local LLM (NEW)                     │
│ Lambda/EC2: Gateway        │ connect.shopnet.network│ connect.shopnet API (NEW)                      │
│ EC2: Web3 Gateway          │ Elastic IP             │ web3.sn, web3smartlinks.com, IP-based HTTPS    │
│ S3 + CloudFront SaaS Mgr   │ 1000s of distributions │ All brochure sites, management console         │
│ EC2: Prototype Stores      │ Optional               │ WordPress/WooCommerce (may phase out)          │
│ Local LLM                  │ On-premises            │ Self-hosted LLM for all AI agents              │
└────────────────────────────┴────────────────────────┴────────────────────────────────────────────────┘

ACTION ITEMS FOR WEB3 SERVERS:
1. [ ] SSH into 3.81.115.9 to verify what's running
2. [ ] SSH into 50.17.187.45 to verify what's running
3. [ ] Document Web3 gateway configuration
4. [ ] Verify IP-based HTTPS certificate setup
5. [ ] Create runbook for Web3 infrastructure
```

### 15.7 Component 7: Web3 Gateway Migration Path

```
COMPONENT 7: Web3 Gateway
─────────────────────────
CURRENT: Test servers at 3.81.115.9 and 50.17.187.45 (unverified)
         web3.sn and web3smartlinks.com pointing somewhere
TARGET:  Dedicated EC2 with Elastic IP, IP-based HTTPS certificate

WHY WEB3 NEEDS SPECIAL TREATMENT:
• Web3 domains (.crypto, .eth, .nft) don't use traditional DNS
• Browsers can't resolve them without a gateway/proxy
• Web3 gateway translates Web2 requests to blockchain/IPFS content
• IP-based HTTPS required because we can't validate domain ownership via DNS

Steps:
1. [ ] Verify servers 3.81.115.9 and 50.17.187.45
2. [ ] Document current web3.sn gateway configuration
3. [ ] Document current web3smartlinks.com setup
4. [ ] Provision dedicated EC2 for Web3 (if not already separate)
5. [ ] Request Elastic IP for Web3 server
6. [ ] Obtain IP-based HTTPS certificate (Comodo, DigiCert, etc.)
7. [ ] Configure Web3 gateway proxy (nginx/caddy with blockchain resolution)
8. [ ] Test .crypto, .eth, .nft domain resolution
9. [ ] Update DNS/routing for web3.sn → new infrastructure
10. [ ] Monitor and optimize

───────────────────────────────────────────────────────────────────────

WEB3 GATEWAY ARCHITECTURE:

                                Traditional Browser
                                       │
                                       │ https://web3.sn/mysite.crypto
                                       ▼
                            ┌─────────────────────────┐
                            │  Web3 Gateway Server    │
                            │  (Elastic IP)           │
                            │                         │
                            │  IP-based HTTPS Cert    │
                            │                         │
                            ├─────────────────────────┤
                            │  1. Parse domain request│
                            │  2. Check if .crypto,   │
                            │     .eth, .nft, etc.    │
                            │  3. Query blockchain    │
                            │     registry            │
                            │  4. Resolve to IPFS/    │
                            │     content address     │
                            │  5. Proxy content back  │
                            └───────────┬─────────────┘
                                        │
                    ┌───────────────────┼───────────────────┐
                    │                   │                   │
                    ▼                   ▼                   ▼
            ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
            │ Unstoppable  │   │   ENS        │   │   IPFS       │
            │ Domains      │   │ (Ethereum)   │   │   Gateway    │
            │ Registry     │   │              │   │              │
            │              │   │              │   │              │
            │ .crypto      │   │ .eth         │   │ Content      │
            │ .wallet      │   │ .xyz         │   │ Delivery     │
            │ .nft         │   │              │   │              │
            └──────────────┘   └──────────────┘   └──────────────┘
```

---

## 16. Industry Research & References

### Multi-Tenant SaaS Architecture

- [AWS: Throttling a tiered, multi-tenant REST API at scale](https://aws.amazon.com/blogs/architecture/throttling-a-tiered-multi-tenant-rest-api-at-scale-using-api-gateway-part-1/) - Noisy neighbor prevention
- [AWS: Multi-Tenant Generative AI Gateway](https://aws.amazon.com/solutions/guidance/multi-tenant-generative-ai-gateway-with-cost-and-usage-tracking-on-aws/) - Cost tracking per tenant
- [Multi-Tenant SaaS Architecture on Cloud 2025](https://isitdev.com/multi-tenant-saas-architecture-cloud-2025/) - Modern patterns

### API Gateway Patterns

- [API Gateway Pattern: Multi-Tenant Request Routing](https://medium.com/@reyanshicodes/api-gateway-pattern-building-multi-tenant-request-routing-e8c1aa042026) - Routing strategies
- [Azure: API Management in Multitenant Solutions](https://learn.microsoft.com/en-us/azure/architecture/guide/multitenant/service/api-management) - Enterprise patterns

### HMAC Security

- [Why HMAC Is Still a Must-Have for API Security in 2025](https://www.authgear.com/post/hmac-api-security) - Current best practices
- [HMAC Authentication: Secure Your APIs](https://www.authx.com/blog/hmac-hash-based-message-authentication-codes/) - Implementation guide
- [Secure Protected API with HMAC](https://dev.to/wildanzr/secure-protected-api-with-hmac-next-level-of-api-keys-4l39) - Replay attack prevention

### CloudFront & Static Hosting

- [AWS: CloudFront SaaS Manager](https://aws.amazon.com/blogs/aws/reduce-your-operational-overhead-today-with-amazon-cloudfront-saas-manager/) - Multi-tenant distributions
- [Lambda@Edge Use Cases](https://www.stormit.cloud/blog/lambda-at-edge/) - Edge computing patterns
- [Cost Breakdown: Static Website on AWS](https://medium.com/@bezdelev/cost-breakdown-for-a-static-website-on-aws-after-18-months-in-production-d97a932d2d25) - Real costs

### White-Label SaaS

- [White-Label SaaS Boilerplate](https://medium.com/@yogeshkrishnanseeniraj/white-label-saas-boilerplate-django-tenants-async-branding-engine-585ca3905a77) - Branding engine
- [Spree Commerce: Multi-Tenant White-Label](https://spreecommerce.org/multi-tenant-white-label-ecommerce/) - E-commerce patterns
- [Building Secure White Label Software](https://medium.com/@Brilworks/building-secure-white-label-software-the-architecture-checklist-8016a74419b1) - Security checklist

---

## 16. TACTICAL MIGRATION PLAN

**Status:** 🟢 PHASE 1-4 COMPLETE
**Started:** January 16, 2026
**Goal:** Low cost, high scalability out of the gate

### Migration Log
| Time | Step | Status |
|------|------|--------|
| 11:30 | STEP 1.1: Terminate Australia EC2 | ✅ Rob terminating |
| 11:31 | STEP 1.2: Web3 Servers | ⏸️ Deferred |
| 11:31 | STEP 2.1: Backup PostgreSQL | ✅ 1.6MB backup created |
| 11:32 | STEP 2.2: Create shopnet_data on RDS | ✅ Database created |
| 11:32 | STEP 2.3: Restore to RDS | ✅ 2011 TLDs, 37 categories |
| 11:32 | STEP 2.4: Update Flask .env | ✅ Pointing to RDS |
| 11:33 | STEP 2.5: Test API | ✅ All endpoints working |
| 11:34 | STEP 2.6: Test WordPress | ✅ Working (internal test) |
| 11:35 | STEP 4: Create shopnet_connect DB | ✅ licenses + usage_metrics tables |

### RDS Databases (Consolidated)
| Database | Contents | Status |
|----------|----------|--------|
| amazon_products | 13k products, 230k reviews | ✅ Existing |
| shopnet_data | 2011 TLDs, 37 categories | ✅ Migrated from EC2 |
| shopnet_connect | licenses, usage_metrics | ✅ New - ready for gateway |

### 16.1 Asset-by-Asset Migration Guide

**Plain English: What moves where.**

```
╔═══════════════════════════════════════════════════════════════════════════════════════════════════╗
║                           ASSET-BY-ASSET MIGRATION GUIDE                                           ║
╠═══════════════════════════════════════════════════════════════════════════════════════════════════╣
║                                                                                                    ║
║   WEBSITES & STORES                                                                               ║
║   ─────────────────                                                                               ║
║   • shopnet.domains (WordPress)     → STAYS on EC2 54.236.245.127                                ║
║   • bestbird.com (Shopify)          → STAYS on Shopify (no change)                               ║
║   • 40+ Brochure Sites (S3)         → STAYS on S3+CloudFront                                     ║
║                                                                                                    ║
║   DATABASES                                                                                       ║
║   ─────────                                                                                       ║
║   • shopnet_data (Domains, 2k TLDs) → MOVE from EC2 PostgreSQL to RDS                            ║
║   • amazon_products (13k products)  → STAYS on RDS (no change)                                   ║
║   • bitnami_wordpress (MariaDB)     → STAYS on EC2 (WordPress specific)                          ║
║   • shopnet_connect (Licenses)      → CREATE NEW on RDS                                          ║
║                                                                                                    ║
║   ADMIN PANELS / GUIs                                                                             ║
║   ─────────────────────                                                                           ║
║   • Domains Admin (data.shopnet.domains) → EMBED into shopnet.network hub                        ║
║   • Products Admin                       → BUILD and add to shopnet.network hub                  ║
║   • shopnet.network console              → ENHANCE to unified hub                                ║
║                                                                                                    ║
║   APIs & BACKEND SERVICES                                                                         ║
║   ───────────────────────                                                                         ║
║   • Domains Data API (Flask)        → MOVE to Lambda (shopnet-data-api)                          ║
║   • Domain.Assist (PHP chatbot)     → REBUILD as Lambda (domain-assist)                          ║
║   • Product.Assist (Lambda)         → STAYS as Lambda (reference architecture)                   ║
║   • connect.shopnet Gateway         → BUILD as Lambda (new)                                      ║
║                                                                                                    ║
║   SERVERS                                                                                         ║
║   ───────                                                                                         ║
║   • EC2 US-East (54.236.245.127)    → KEEP for WordPress only, then DOWNSIZE                     ║
║   • EC2 Australia (13.217.5.143)    → TERMINATE (save $30/mo)                                    ║
║   • EC2 Web3 (3.81.115.9, etc)      → VERIFY, keep ONE with Elastic IP                           ║
║                                                                                                    ║
╚═══════════════════════════════════════════════════════════════════════════════════════════════════╝
```

### 16.2 Visual Summary: Before → After

```
BEFORE (messy)                              AFTER (clean)
══════════════                              ═════════════

EC2 54.236.245.127                          EC2 54.236.245.127 (smaller)
├── WordPress ─────────────────────────────► WordPress (STAYS)
├── MariaDB ───────────────────────────────► MariaDB (STAYS)
├── PostgreSQL (shopnet_data) ─────┐
├── Flask API ─────────────────────┤
└── Domain.Assist PHP ─────────────┤
                                   │
                                   │        RDS (consolidated)
RDS                                │        ├── amazon_products (STAYS)
└── amazon_products ───────────────┼───────► shopnet_data (MOVED HERE)
                                   │        └── shopnet_connect (NEW)
                                   │
                                   │        Lambda (serverless)
Lambda                             │        ├── product-assist (STAYS)
└── product-assist ────────────────┼───────► domain-assist (NEW - from PHP)
                                   └───────► shopnet-data-api (NEW - from Flask)
                                            └── shopnet-connect-gateway (NEW)

EC2 Australia
└── (unused) ──────────────────────────────► TERMINATED

EC2 Web3 (x2 unknown)
└── (unknown) ─────────────────────────────► ONE small EC2 with Elastic IP

S3 + CloudFront                             S3 + CloudFront
├── 40+ brochure sites ────────────────────► 40+ brochure sites (STAYS)
└── shopnet.network ───────────────────────► shopnet.network (ENHANCED)
                                                ├── Endpoints mgmt (existing)
                                                ├── Domains admin (embedded)
                                                ├── Products admin (new)
                                                └── License mgmt (new)
```

### 16.3 Cost Comparison

```
CURRENT                                    TARGET
───────                                    ──────
EC2 US-East (mixed):      ~$30/mo          EC2 US-East (WP only):    ~$15/mo
EC2 Australia (unused):   ~$30/mo          EC2 Australia:            $0 (terminated)
EC2 Web3 (unknown x2):    ~$20/mo?         EC2 Web3 (1 small):       ~$10/mo
RDS:                      ~$15/mo          RDS (slight upgrade):     ~$25/mo
Lambda (Product.Assist):  ~$5/mo           Lambda (4 functions):     ~$23/mo
S3 + CloudFront:          ~$20/mo          S3 + CloudFront:          ~$20/mo
─────────────────────────────────          ─────────────────────────────────
TOTAL:                    ~$120-150/mo     TOTAL:                    ~$93/mo

SAVINGS: ~$30-50/month + MUCH better scalability
Lambda scales automatically. No server management for business logic.
```

---

### 16.4 DETAILED MIGRATION SEQUENCE (Execute Today/Tomorrow)

**CRITICAL: Follow this exact order. Each step depends on the previous one.**

```
╔═══════════════════════════════════════════════════════════════════════════════════════════════════╗
║                                                                                                    ║
║   MIGRATION EXECUTION SEQUENCE - JANUARY 16-17, 2026                                              ║
║   ═══════════════════════════════════════════════════                                             ║
║                                                                                                    ║
║   ┌───────────────────────────────────────────────────────────────────────────────────────────┐   ║
║   │ PHASE 1: QUICK WINS (Do First - 30 minutes)                                               │   ║
║   │ ════════════════════════════════════════════                                              │   ║
║   │                                                                                           │   ║
║   │ STEP 1.1: Terminate Australia EC2                                                         │   ║
║   │ ─────────────────────────────────────────                                                 │   ║
║   │ WHY FIRST: Zero dependencies, instant savings                                             │   ║
║   │                                                                                           │   ║
║   │ COMMANDS:                                                                                 │   ║
║   │   # Verify nothing is running (should be wiped already)                                   │   ║
║   │   ssh bitnami@13.217.5.143 "ps aux | head -20"                                           │   ║
║   │                                                                                           │   ║
║   │   # If SSH fails or shows empty → safe to terminate                                       │   ║
║   │   # Go to AWS Console → EC2 → ap-southeast-2 → Terminate instance                         │   ║
║   │   # Release Elastic IP if assigned                                                        │   ║
║   │                                                                                           │   ║
║   │ RESULT: Save $30/month immediately                                                        │   ║
║   │ TIME: 10 minutes                                                                          │   ║
║   │                                                                                           │   ║
║   │ STEP 1.2: Document Web3 Servers                                                           │   ║
║   │ ───────────────────────────────────                                                       │   ║
║   │ WHY: Need to know what's there before making decisions                                    │   ║
║   │                                                                                           │   ║
║   │ COMMANDS:                                                                                 │   ║
║   │   # Check server 1                                                                        │   ║
║   │   ssh -i your-key.pem ubuntu@3.81.115.9 "hostname && df -h && docker ps 2>/dev/null"     │   ║
║   │                                                                                           │   ║
║   │   # Check server 2                                                                        │   ║
║   │   ssh -i your-key.pem ubuntu@50.17.187.45 "hostname && df -h && docker ps 2>/dev/null"   │   ║
║   │                                                                                           │   ║
║   │ RESULT: Know what Web3 setup exists                                                       │   ║
║   │ TIME: 20 minutes                                                                          │   ║
║   └───────────────────────────────────────────────────────────────────────────────────────────┘   ║
║                                                                                                    ║
║   ┌───────────────────────────────────────────────────────────────────────────────────────────┐   ║
║   │ PHASE 2: DATABASE MIGRATION (Critical Path - 2-3 hours)                                   │   ║
║   │ ═══════════════════════════════════════════════════════                                   │   ║
║   │                                                                                           │   ║
║   │ STEP 2.1: Backup Current PostgreSQL                                                       │   ║
║   │ ───────────────────────────────────────                                                   │   ║
║   │ WHY FIRST: Never migrate without backup                                                   │   ║
║   │                                                                                           │   ║
║   │ COMMANDS (run on EC2 54.236.245.127):                                                     │   ║
║   │   # SSH into production server                                                            │   ║
║   │   ssh bitnami@54.236.245.127                                                              │   ║
║   │                                                                                           │   ║
║   │   # Create backup                                                                         │   ║
║   │   pg_dump -U postgres -h localhost -d shopnet_data > ~/shopnet_data_backup_$(date +%Y%m%d).sql
║   │                                                                                           │   ║
║   │   # Verify backup size (should be several MB with 2k TLDs)                                │   ║
║   │   ls -lh ~/shopnet_data_backup_*.sql                                                      │   ║
║   │                                                                                           │   ║
║   │   # Copy backup locally (safety)                                                          │   ║
║   │   scp bitnami@54.236.245.127:~/shopnet_data_backup_*.sql ./                               │   ║
║   │                                                                                           │   ║
║   │ RESULT: Backup file on EC2 and local machine                                              │   ║
║   │ TIME: 15 minutes                                                                          │   ║
║   │                                                                                           │   ║
║   │ STEP 2.2: Create Database on RDS                                                          │   ║
║   │ ────────────────────────────────────                                                      │   ║
║   │ WHY: Need empty database before restore                                                   │   ║
║   │                                                                                           │   ║
║   │ COMMANDS:                                                                                 │   ║
║   │   # Connect to RDS from EC2 (has network access)                                          │   ║
║   │   psql -h amazon-products-db-1754023596.cenq4au2o7vl.us-east-1.rds.amazonaws.com \       │   ║
║   │        -U postgres -d postgres                                                            │   ║
║   │                                                                                           │   ║
║   │   # Create new database                                                                   │   ║
║   │   CREATE DATABASE shopnet_data;                                                           │   ║
║   │   \q                                                                                      │   ║
║   │                                                                                           │   ║
║   │ RESULT: Empty shopnet_data database on RDS                                                │   ║
║   │ TIME: 5 minutes                                                                           │   ║
║   │                                                                                           │   ║
║   │ STEP 2.3: Restore to RDS                                                                  │   ║
║   │ ────────────────────────────                                                              │   ║
║   │ WHY: Move the data                                                                        │   ║
║   │                                                                                           │   ║
║   │ COMMANDS (run on EC2):                                                                    │   ║
║   │   # Restore backup to RDS                                                                 │   ║
║   │   psql -h amazon-products-db-1754023596.cenq4au2o7vl.us-east-1.rds.amazonaws.com \       │   ║
║   │        -U postgres -d shopnet_data < ~/shopnet_data_backup_*.sql                          │   ║
║   │                                                                                           │   ║
║   │   # Verify data exists                                                                    │   ║
║   │   psql -h amazon-products-db-1754023596.cenq4au2o7vl.us-east-1.rds.amazonaws.com \       │   ║
║   │        -U postgres -d shopnet_data -c "SELECT COUNT(*) FROM tlds;"                        │   ║
║   │                                                                                           │   ║
║   │   # Should show ~2011 TLDs                                                                │   ║
║   │                                                                                           │   ║
║   │ RESULT: Data now exists on RDS                                                            │   ║
║   │ TIME: 30 minutes                                                                          │   ║
║   │                                                                                           │   ║
║   │ STEP 2.4: Update Flask API Connection String                                              │   ║
║   │ ────────────────────────────────────────────                                              │   ║
║   │ WHY: Point Flask to new database location                                                 │   ║
║   │                                                                                           │   ║
║   │ COMMANDS (run on EC2):                                                                    │   ║
║   │   # Edit Flask .env file                                                                  │   ║
║   │   sudo nano /opt/shopnet-data/api/.env                                                    │   ║
║   │                                                                                           │   ║
║   │   # Change DATABASE_URL from:                                                             │   ║
║   │   # DATABASE_URL=postgresql://postgres:PASSWORD@localhost:5432/shopnet_data               │   ║
║   │   # To:                                                                                   │   ║
║   │   # DATABASE_URL=postgresql://postgres:PASSWORD@amazon-products-db-1754023596...rds.amazonaws.com:5432/shopnet_data
║   │                                                                                           │   ║
║   │   # Restart Flask                                                                         │   ║
║   │   sudo systemctl restart shopnet-data-api                                                 │   ║
║   │                                                                                           │   ║
║   │ RESULT: Flask now uses RDS                                                                │   ║
║   │ TIME: 10 minutes                                                                          │   ║
║   │                                                                                           │   ║
║   │ STEP 2.5: Test API Still Works                                                            │   ║
║   │ ─────────────────────────────                                                             │   ║
║   │ WHY: Verify nothing broke                                                                 │   ║
║   │                                                                                           │   ║
║   │ COMMANDS:                                                                                 │   ║
║   │   # Test API endpoint                                                                     │   ║
║   │   curl https://data.shopnet.network/api/tlds?per_page=5                                   │   ║
║   │                                                                                           │   ║
║   │   # Test categories                                                                       │   ║
║   │   curl https://data.shopnet.network/api/categories                                        │   ║
║   │                                                                                           │   ║
║   │   # Test admin panel loads                                                                │   ║
║   │   # Open browser: https://data.shopnet.network                                            │   ║
║   │   # Login: shopnet / Admin2026                                                            │   ║
║   │                                                                                           │   ║
║   │ IF TESTS PASS: Continue to next step                                                      │   ║
║   │ IF TESTS FAIL: Revert .env, restart Flask, debug                                          │   ║
║   │                                                                                           │   ║
║   │ RESULT: API works with RDS                                                                │   ║
║   │ TIME: 15 minutes                                                                          │   ║
║   │                                                                                           │   ║
║   │ STEP 2.6: Test WordPress Still Works                                                      │   ║
║   │ ────────────────────────────────────                                                      │   ║
║   │ WHY: Verify shopnet.domains store unaffected                                              │   ║
║   │                                                                                           │   ║
║   │ COMMANDS:                                                                                 │   ║
║   │   # Open browser: https://shopnet.domains                                                 │   ║
║   │   # Verify store loads                                                                    │   ║
║   │   # Check chatbot loads TLDs                                                              │   ║
║   │   # Browse a few product pages                                                            │   ║
║   │                                                                                           │   ║
║   │ IF TESTS PASS: Continue to next step                                                      │   ║
║   │ IF TESTS FAIL: Check WordPress transient cache, may need to clear                         │   ║
║   │                                                                                           │   ║
║   │ RESULT: Production site still works                                                       │   ║
║   │ TIME: 10 minutes                                                                          │   ║
║   │                                                                                           │   ║
║   │ STEP 2.7: Stop PostgreSQL on EC2 (Optional - Wait)                                        │   ║
║   │ ──────────────────────────────────────────────────                                        │   ║
║   │ WHY: Keep running for 24h as fallback, then stop                                          │   ║
║   │                                                                                           │   ║
║   │ COMMANDS (run tomorrow if all works):                                                     │   ║
║   │   sudo systemctl stop postgresql                                                          │   ║
║   │   sudo systemctl disable postgresql                                                       │   ║
║   │                                                                                           │   ║
║   │ RESULT: PostgreSQL no longer running on EC2                                               │   ║
║   │ TIME: 5 minutes (tomorrow)                                                                │   ║
║   └───────────────────────────────────────────────────────────────────────────────────────────┘   ║
║                                                                                                    ║
║   ┌───────────────────────────────────────────────────────────────────────────────────────────┐   ║
║   │ PHASE 3: VERIFICATION CHECKPOINT                                                          │   ║
║   │ ════════════════════════════════                                                          │   ║
║   │                                                                                           │   ║
║   │ Before proceeding, verify:                                                                │   ║
║   │                                                                                           │   ║
║   │ □ Australia EC2 terminated                                                                │   ║
║   │ □ Web3 servers documented                                                                 │   ║
║   │ □ shopnet_data exists on RDS with 2011 TLDs                                               │   ║
║   │ □ Flask API responds from https://data.shopnet.network/api/                               │   ║
║   │ □ WordPress at https://shopnet.domains works                                              │   ║
║   │ □ Admin panel at https://data.shopnet.network works                                       │   ║
║   │                                                                                           │   ║
║   │ IF ALL CHECKED: Phase 2 complete. Stop here for today if tired.                           │   ║
║   │ IF ISSUES: Debug before continuing. Database migration is critical path.                  │   ║
║   │                                                                                           │   ║
║   └───────────────────────────────────────────────────────────────────────────────────────────┘   ║
║                                                                                                    ║
║   ┌───────────────────────────────────────────────────────────────────────────────────────────┐   ║
║   │ PHASE 4: CREATE LICENSES DATABASE (15 minutes)                                            │   ║
║   │ ═══════════════════════════════════════════════                                           │   ║
║   │                                                                                           │   ║
║   │ WHY: Needed for future gateway license validation                                         │   ║
║   │                                                                                           │   ║
║   │ COMMANDS:                                                                                 │   ║
║   │   # Connect to RDS                                                                        │   ║
║   │   psql -h amazon-products-db-1754023596.cenq4au2o7vl.us-east-1.rds.amazonaws.com \       │   ║
║   │        -U postgres -d postgres                                                            │   ║
║   │                                                                                           │   ║
║   │   # Create licenses database                                                              │   ║
║   │   CREATE DATABASE shopnet_connect;                                                        │   ║
║   │   \c shopnet_connect                                                                      │   ║
║   │                                                                                           │   ║
║   │   # Create basic schema                                                                   │   ║
║   │   CREATE TABLE licenses (                                                                 │   ║
║   │       id SERIAL PRIMARY KEY,                                                              │   ║
║   │       api_key VARCHAR(64) UNIQUE NOT NULL,                                                │   ║
║   │       api_secret VARCHAR(128) NOT NULL,                                                   │   ║
║   │       tenant_name VARCHAR(255) NOT NULL,                                                  │   ║
║   │       tier VARCHAR(20) DEFAULT 'free',                                                    │   ║
║   │       is_active BOOLEAN DEFAULT true,                                                     │   ║
║   │       created_at TIMESTAMP DEFAULT NOW()                                                  │   ║
║   │   );                                                                                      │   ║
║   │                                                                                           │   ║
║   │   CREATE TABLE usage_metrics (                                                            │   ║
║   │       id SERIAL PRIMARY KEY,                                                              │   ║
║   │       license_id INTEGER REFERENCES licenses(id),                                         │   ║
║   │       endpoint VARCHAR(255),                                                              │   ║
║   │       request_count INTEGER DEFAULT 0,                                                    │   ║
║   │       recorded_at DATE DEFAULT CURRENT_DATE                                               │   ║
║   │   );                                                                                      │   ║
║   │                                                                                           │   ║
║   │   \q                                                                                      │   ║
║   │                                                                                           │   ║
║   │ RESULT: Ready for gateway development                                                     │   ║
║   │ TIME: 15 minutes                                                                          │   ║
║   └───────────────────────────────────────────────────────────────────────────────────────────┘   ║
║                                                                                                    ║
║   ┌───────────────────────────────────────────────────────────────────────────────────────────┐   ║
║   │ PHASE 5: FUTURE TASKS (Not Today)                                                         │   ║
║   │ ═════════════════════════════════                                                         │   ║
║   │                                                                                           │   ║
║   │ These can be done later, in any order:                                                    │   ║
║   │                                                                                           │   ║
║   │ □ Move Flask API to Lambda (4-6 hours)                                                    │   ║
║   │   - Add Mangum wrapper                                                                    │   ║
║   │   - Deploy to Lambda                                                                      │   ║
║   │   - Update DNS                                                                            │   ║
║   │                                                                                           │   ║
║   │ □ Build Domain.Assist Lambda (2-3 days)                                                   │   ║
║   │   - Copy Product.Assist structure                                                         │   ║
║   │   - Connect to shopnet_data on RDS                                                        │   ║
║   │   - Add Local LLM integration                                                             │   ║
║   │                                                                                           │   ║
║   │ □ Build Gateway Lambda (3-5 days)                                                         │   ║
║   │   - FastAPI with HMAC auth                                                                │   ║
║   │   - License validation                                                                    │   ║
║   │   - Route to backends                                                                     │   ║
║   │                                                                                           │   ║
║   │ □ Downsize EC2 (30 min, after all logic moved to Lambda)                                  │   ║
║   │   - Stop instance                                                                         │   ║
║   │   - Change to t3.small                                                                    │   ║
║   │   - Start instance                                                                        │   ║
║   │                                                                                           │   ║
║   │ □ Consolidate Web3 servers (1 day)                                                        │   ║
║   │   - Based on Phase 1 findings                                                             │   ║
║   │   - Keep one, terminate other                                                             │   ║
║   │   - Get IP-based SSL certificate                                                          │   ║
║   │                                                                                           │   ║
║   │ □ Enhance shopnet.network hub (2-3 weeks, parallel work)                                  │   ║
║   │   - Embed Domains admin                                                                   │   ║
║   │   - Add Products admin                                                                    │   ║
║   │   - Add License management                                                                │   ║
║   │   - Add Cognito login                                                                     │   ║
║   └───────────────────────────────────────────────────────────────────────────────────────────┘   ║
║                                                                                                    ║
╚═══════════════════════════════════════════════════════════════════════════════════════════════════╝
```

### 16.5 Required Credentials & Information

Before starting, confirm you have:

| Item | Value | Where to Find |
|------|-------|---------------|
| **EC2 SSH Key** | your-key.pem | Your local .ssh folder |
| **EC2 US-East IP** | 54.236.245.127 | AWS Console |
| **EC2 Australia IP** | 13.217.5.143 | AWS Console (to terminate) |
| **Web3 Server IPs** | 3.81.115.9, 50.17.187.45 | AWS Console |
| **RDS Endpoint** | amazon-products-db-1754023596.cenq4au2o7vl.us-east-1.rds.amazonaws.com | AWS Console |
| **RDS Password** | [Get from data.shopnet README] | /Users/tim001/VSCode/data.shopnet/README.md |
| **Flask .env path** | /opt/shopnet-data/api/.env | On EC2 server |
| **Admin Login** | admin@data.shopnet / Admin2026 | data.shopnet.network/admin |

### 16.6 Rollback Plan

If anything breaks:

```
DATABASE ROLLBACK (if RDS data is bad):
1. Change Flask .env back to localhost:5432
2. Restart Flask: sudo systemctl restart shopnet-data-api
3. PostgreSQL on EC2 is still running as fallback

COMPLETE ROLLBACK (if everything is bad):
1. Database: Restore from backup file
2. Flask: Point back to localhost
3. Nothing else should have changed yet
```

---

## 17. MASTER MIGRATION PLAN (January 2026)

> **Goal:** Complete Deathstar architecture with proper tier separation, API-first endpoints, and unified management console.

### 17.1 Target Architecture (After Migration)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              LAYER 1: ENDPOINTS                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐                │
│   │ shopnet.domains │  │ S3/CloudFront   │  │ Future Clients  │                │
│   │ (WordPress)     │  │ (40+ brochures) │  │                 │                │
│   │ NO LOCAL DB     │  │ buyerassist.ai  │  │                 │                │
│   │ API-first only  │  │ alien.domains   │  │                 │                │
│   └────────┬────────┘  └────────┬────────┘  └────────┬────────┘                │
│            │                    │                    │                          │
│            └────────────────────┼────────────────────┘                          │
│                                 │                                               │
│                                 ▼                                               │
├─────────────────────────────────────────────────────────────────────────────────┤
│                           LAYER 2: GATEWAY                                       │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │            NEW EC2: shopnet.network / connect.shopnet.network           │   │
│   │                                                                         │   │
│   │   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐        │   │
│   │   │  Nginx          │  │  Admin GUI      │  │  shopnet.network│        │   │
│   │   │  (reverse proxy)│  │  (TLD Manager)  │  │  (console)      │        │   │
│   │   └────────┬────────┘  └─────────────────┘  └─────────────────┘        │   │
│   │            │                                                            │   │
│   │   ┌────────┴────────────────────────────────────┐                      │   │
│   │   │                                              │                      │   │
│   │   ▼                                              ▼                      │   │
│   │   ┌─────────────────┐           ┌─────────────────┐                    │   │
│   │   │  Flask API      │           │  FastAPI        │                    │   │
│   │   │  (data.shopnet) │           │  (Connect)      │                    │   │
│   │   │  Port 5000      │           │  Port 8000      │                    │   │
│   │   └────────┬────────┘           └────────┬────────┘                    │   │
│   │            │                             │                              │   │
│   └────────────┼─────────────────────────────┼──────────────────────────────┘   │
│                │                             │                                   │
│                └──────────────┬──────────────┘                                   │
│                               │                                                  │
│                               ▼                                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                        LAYER 3: BUSINESS LOGIC                                   │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │                          AWS LAMBDA FUNCTIONS                           │   │
│   │                                                                         │   │
│   │   ┌─────────────────┐           ┌─────────────────┐                    │   │
│   │   │  Product.Assist │           │  Domain.Assist  │                    │   │
│   │   │  (Lambda)       │           │  (Lambda)       │                    │   │
│   │   │  Local LLM      │           │  Local LLM      │                    │   │
│   │   └────────┬────────┘           └────────┬────────┘                    │   │
│   │            │                             │                              │   │
│   └────────────┼─────────────────────────────┼──────────────────────────────┘   │
│                │                             │                                   │
│                └──────────────┬──────────────┘                                   │
│                               │                                                  │
│                               ▼                                                  │
├─────────────────────────────────────────────────────────────────────────────────┤
│                          LAYER 4: DATA                                           │
├─────────────────────────────────────────────────────────────────────────────────┤
│                                                                                  │
│   ┌─────────────────────────────────────────────────────────────────────────┐   │
│   │                      RDS PostgreSQL (Consolidated)                      │   │
│   │                                                                         │   │
│   │   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐        │   │
│   │   │  amazon_products│  │  shopnet_data   │  │  shopnet_connect│        │   │
│   │   │  (13k products) │  │  (2k TLDs)      │  │  (licenses)     │        │   │
│   │   │  (230k reviews) │  │  (37 categories)│  │  (sessions)     │        │   │
│   │   └─────────────────┘  └─────────────────┘  └─────────────────┘        │   │
│   │                                                                         │   │
│   └─────────────────────────────────────────────────────────────────────────┘   │
│                                                                                  │
└─────────────────────────────────────────────────────────────────────────────────┘

UNCHANGED INFRASTRUCTURE:
├── OLD EC2 (54.236.245.127): WordPress only (shopnet.domains)
├── Web3 Servers (3.81.115.9, 50.17.187.45): As-is
└── S3/CloudFront: 40+ static brochure sites
```

---

### 17.2 Migration Phases (High-Level)

| Phase | Description | Dependencies | Status |
|-------|-------------|--------------|--------|
| **Phase 1** | Spin up new EC2 in us-east-1 | AWS Console access | ⏳ Ready |
| **Phase 2** | Deploy Flask API (data.shopnet) | Phase 1 | ⏳ Pending |
| **Phase 3** | Deploy FastAPI (connect.shopnet) | Phase 1 | ⏳ Pending |
| **Phase 4** | Deploy Admin GUI | Phase 2, 3 | ⏳ Pending |
| **Phase 5** | Configure Nginx + SSL | Phase 2, 3, 4 | ⏳ Pending |
| **Phase 6** | Update DNS records | Phase 5 | ⏳ Pending |
| **Phase 7** | Migrate shopnet.domains to API-first | Phase 5, 6 | ⏳ Pending |
| **Phase 8** | Formalize licenses & auth | Phase 3 | ⏳ Pending |
| **Phase 9** | Build Lambda agents (RDS) | Phase 7 | ⏳ Pending |
| **Phase 10** | Downsize old EC2 | Phase 7, 9 | ⏳ Pending |

---

### 17.3 Phase 1: New EC2 Setup

#### Instance Configuration
| Setting | Value |
|---------|-------|
| AMI | Ubuntu 22.04 LTS |
| Instance Type | t3.small (2 vCPU, 2GB RAM) |
| Key Pair | TLemmon (existing) |
| VPC | Same as RDS |
| Subnet | Public subnet in us-east-1a |
| Storage | 20GB gp3 |

#### Security Group: `shopnet-backend-sg`
| Type | Port | Source | Description |
|------|------|--------|-------------|
| SSH | 22 | Your IP | SSH access |
| HTTP | 80 | 0.0.0.0/0 | Redirect to HTTPS |
| HTTPS | 443 | 0.0.0.0/0 | Main traffic |

#### Commands After Launch
```bash
# SSH in
ssh -i /Users/tim001/VSCode/Keys/TLemmon.pem ubuntu@[NEW_EC2_IP]

# System setup
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx python3.11 python3.11-venv python3-pip postgresql-client certbot python3-certbot-nginx git

# Create app user
sudo useradd -m -s /bin/bash shopnet
sudo mkdir -p /opt/shopnet/{data-api,connect-api,admin,static}
sudo chown -R shopnet:shopnet /opt/shopnet

# Test RDS connectivity
psql -h amazon-products-db-1754023596.cenq4au2o7vl.us-east-1.rds.amazonaws.com -U postgres -d shopnet_data -c "SELECT COUNT(*) FROM tlds;"
```

---

### 17.4 Phase 2-4: Deploy Services

#### Flask API (data.shopnet)
```bash
# Upload from local
scp -i ~/.ssh/TLemmon.pem -r /Users/tim001/VSCode/data.shopnet/api/* ubuntu@[NEW_EC2_IP]:/tmp/data-api/

# On server
sudo mv /tmp/data-api/* /opt/shopnet/data-api/
sudo -u shopnet bash -c "cd /opt/shopnet/data-api && python3.11 -m venv venv && source venv/bin/activate && pip install flask gunicorn psycopg2-binary python-dotenv flask-cors"

# Create .env
cat > /opt/shopnet/data-api/.env << 'EOF'
DATABASE_URL=postgresql://postgres:ShopnetData2026!@amazon-products-db-1754023596.cenq4au2o7vl.us-east-1.rds.amazonaws.com:5432/shopnet_data
FLASK_ENV=production
EOF
```

#### FastAPI (connect.shopnet)
```bash
# Upload from local
scp -i ~/.ssh/TLemmon.pem -r /Users/tim001/VSCode/connect.shopnet/backend/* ubuntu@[NEW_EC2_IP]:/tmp/connect-api/

# On server
sudo mv /tmp/connect-api/* /opt/shopnet/connect-api/
sudo -u shopnet bash -c "cd /opt/shopnet/connect-api && python3.11 -m venv venv && source venv/bin/activate && pip install fastapi uvicorn[standard] psycopg2-binary python-dotenv pydantic"
```

#### Admin GUI
```bash
scp -i ~/.ssh/TLemmon.pem -r /Users/tim001/VSCode/data.shopnet/admin/* ubuntu@[NEW_EC2_IP]:/tmp/admin/
sudo mv /tmp/admin/* /opt/shopnet/admin/
```

---

### 17.5 Phase 5-6: Nginx + DNS

#### Nginx Configuration
```nginx
# /etc/nginx/sites-available/shopnet
server {
    listen 80;
    server_name shopnet.network connect.shopnet.network;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name shopnet.network;
    root /opt/shopnet/admin;
    index index.html;

    location / { try_files $uri $uri/ /index.html; }
    location /api/ {
        proxy_pass http://127.0.0.1:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}

server {
    listen 443 ssl http2;
    server_name connect.shopnet.network;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

#### DNS Updates
| Record | Type | Value |
|--------|------|-------|
| shopnet.network | A | [NEW_EC2_IP] |
| connect.shopnet.network | A | [NEW_EC2_IP] |

---

### 17.6 Phase 7: shopnet.domains API-First Migration

**Current State:** WordPress with local MySQL containing synced TLD/Category data
**Target State:** WordPress fetching all TLD/Category data from connect.shopnet API

#### Step 7.1: Add Feature Flag
```php
// wp-config.php on shopnet.domains (54.236.245.127)
define('SHOPNET_API_MODE', true);  // false = use local MySQL, true = use API
define('SHOPNET_API_URL', 'https://connect.shopnet.network/api/v1');
```

#### Step 7.2: Update Theme Functions
```php
// In theme: get TLDs from API instead of MySQL
function get_tlds_by_category($category_slug) {
    if (SHOPNET_API_MODE) {
        $response = wp_remote_get(SHOPNET_API_URL . '/tlds?category=' . $category_slug);
        return json_decode(wp_remote_retrieve_body($response), true);
    } else {
        // Existing MySQL query
        global $wpdb;
        return $wpdb->get_results("SELECT * FROM tlds WHERE category = '$category_slug'");
    }
}
```

#### Step 7.3: Cloudflare Edge Caching
```
# Cloudflare Page Rule
URL: connect.shopnet.network/api/v1/tlds*
Cache Level: Cache Everything
Edge Cache TTL: 5 minutes
```

#### Step 7.4: Remove MySQL Sync
After confirming API-first works:
1. Disable webhook push from Admin GUI
2. Drop TLD/Category tables from local MySQL
3. Remove sync cron jobs

---

### 17.6.1 Phase 7 DETAILED IMPLEMENTATION GUIDE (January 18, 2026)

This section provides the refined step-by-step implementation plan for migrating shopnet.domains to API-first architecture.

#### Pre-Implementation Verification

Before making any changes, verify Connect API is working:
```bash
# Test from shopnet.domains server
ssh -i ~/.ssh/TLemmon.pem bitnami@shopnet.domains
curl -s https://connect.shopnet.network/api/v1/tlds?per_page=3 | jq
curl -s https://connect.shopnet.network/api/v1/categories | jq
```

Expected: JSON responses with TLD and category data

---

#### Step 7.1.1: Add Config Constants to wp-config.php

**File:** `/opt/bitnami/wordpress/wp-config.php`

Add before `/* That's all, stop editing! Happy publishing. */`:

```php
/** ShopNet API-First Configuration */
define('SHOPNET_API_MODE', false);  // Start with false for testing
define('SHOPNET_API_URL', 'https://connect.shopnet.network/api/v1');
define('SHOPNET_API_CACHE_TTL', 300);  // 5 minutes cache
```

---

#### Step 7.1.2: Update Module Loader (CRITICAL FILE)

**File:** `/opt/bitnami/wordpress/wp-content/themes/shopnet-domain-theme/inc/module-loader.php`

**Current Method Signatures to Update:**

| Method | Lines | Current Source | New Source |
|--------|-------|----------------|------------|
| `get_tlds($args)` | ~45-80 | CSV/cache | Connect API |
| `get_categories()` | ~115-160 | wp_terms query | Connect API |
| `fetch_api($endpoint)` | ~200-230 | data.shopnet.domains | connect.shopnet.network |
| `load_tld_data()` | ~85-110 | CSV file | REMOVE |

**Add API Fetch Wrapper:**
```php
/**
 * Fetch from Connect API with caching
 * @param string $endpoint e.g., 'tlds', 'categories', 'tlds?category=shopping'
 * @return array|WP_Error
 */
public static function fetch_connect_api($endpoint) {
    if (!defined('SHOPNET_API_MODE') || !SHOPNET_API_MODE) {
        return new WP_Error('api_disabled', 'API mode not enabled');
    }

    $cache_key = 'ds_connect_' . md5($endpoint);
    $cached = get_transient($cache_key);
    if ($cached !== false) {
        return $cached;
    }

    $url = rtrim(SHOPNET_API_URL, '/') . '/' . ltrim($endpoint, '/');
    $response = wp_remote_get($url, [
        'timeout' => 15,
        'headers' => [
            'Accept' => 'application/json',
            'X-Site-URL' => home_url(),
        ]
    ]);

    if (is_wp_error($response)) {
        error_log('Connect API Error: ' . $response->get_error_message());
        return $response;
    }

    $body = wp_remote_retrieve_body($response);
    $data = json_decode($body, true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        return new WP_Error('json_error', 'Invalid JSON response');
    }

    $ttl = defined('SHOPNET_API_CACHE_TTL') ? SHOPNET_API_CACHE_TTL : 300;
    set_transient($cache_key, $data, $ttl);

    return $data;
}
```

**Update get_tlds() Method:**
```php
public static function get_tlds($args = []) {
    // API-First Mode
    if (defined('SHOPNET_API_MODE') && SHOPNET_API_MODE) {
        $query_params = [];
        if (!empty($args['category'])) {
            $query_params['category'] = $args['category'];
        }
        if (!empty($args['search'])) {
            $query_params['search'] = $args['search'];
        }
        if (!empty($args['group'])) {
            $query_params['group'] = $args['group'];
        }
        if (!empty($args['per_page'])) {
            $query_params['per_page'] = $args['per_page'];
        }

        $endpoint = 'tlds' . (!empty($query_params) ? '?' . http_build_query($query_params) : '');
        $result = self::fetch_connect_api($endpoint);

        if (is_wp_error($result)) {
            error_log('API fetch failed, falling back to local: ' . $result->get_error_message());
            // Fall through to local method
        } else {
            return $result['data'] ?? $result;
        }
    }

    // Original local method (fallback or when API_MODE is false)
    // ... existing code ...
}
```

**Update get_categories() Method:**
```php
public static function get_categories() {
    // API-First Mode
    if (defined('SHOPNET_API_MODE') && SHOPNET_API_MODE) {
        $result = self::fetch_connect_api('categories');

        if (is_wp_error($result)) {
            error_log('Categories API failed, falling back to local');
            // Fall through to local method
        } else {
            return $result['data'] ?? $result;
        }
    }

    // Original local method (fallback)
    // ... existing code ...
}
```

---

#### Step 7.1.3: Update Front-Page Homepage Queries

**File:** `/opt/bitnami/wordpress/wp-content/themes/shopnet-domain-theme/front-page.php`

**Lines ~16-24 - TLD Count Query:**
```php
// CURRENT (uses local wpdb):
$tld_count = $wpdb->get_var("SELECT COUNT(DISTINCT p.ID) FROM {$wpdb->posts} p...");

// REPLACE WITH:
if (defined('SHOPNET_API_MODE') && SHOPNET_API_MODE) {
    $stats = DomainStore_Module_Loader::fetch_connect_api('stats/tld-count?group=ForSale');
    $tld_count = is_wp_error($stats) ? 0 : ($stats['count'] ?? 0);
} else {
    // Original wpdb query
    $tld_count = $wpdb->get_var("SELECT COUNT(DISTINCT p.ID)...");
}
```

**Lines ~27-39 - Emoji Stats Query:**
```php
// CURRENT:
$emoji_results = $wpdb->get_results("SELECT pm.meta_value as emoji...");

// REPLACE WITH:
if (defined('SHOPNET_API_MODE') && SHOPNET_API_MODE) {
    $emoji_data = DomainStore_Module_Loader::fetch_connect_api('stats/emojis?group=ForSale');
    $unique_emoji_count = is_wp_error($emoji_data) ? 0 : count($emoji_data['emojis'] ?? []);
    // Map to expected format
    $emoji_results = [];
    if (!is_wp_error($emoji_data) && isset($emoji_data['emojis'])) {
        foreach ($emoji_data['emojis'] as $e) {
            $emoji_results[] = (object)['emoji' => $e['emoji'], 'cnt' => $e['count']];
        }
    }
} else {
    // Original wpdb query
}
```

---

#### Step 7.1.4: Required Connect API Endpoints

The Connect API must support these endpoints for the migration to work:

| Endpoint | Parameters | Response |
|----------|------------|----------|
| `GET /api/v1/tlds` | `category`, `search`, `group`, `per_page`, `page` | `{data: [...], pagination: {...}}` |
| `GET /api/v1/tlds/:punycode` | - | Single TLD object |
| `GET /api/v1/categories` | - | `{data: [...]}` |
| `GET /api/v1/categories/:slug` | - | Single category object |
| `GET /api/v1/stats/tld-count` | `group` | `{count: N}` |
| `GET /api/v1/stats/emojis` | `group` | `{emojis: [{emoji, count}, ...]}` |

**Verify endpoints exist on Connect server before migration:**
```bash
curl -s https://connect.shopnet.network/api/v1/tlds?per_page=2 | jq
curl -s https://connect.shopnet.network/api/v1/categories | jq
curl -s https://connect.shopnet.network/api/v1/stats/tld-count?group=ForSale | jq
```

---

#### Step 7.1.5: Testing Protocol

**Phase A: API OFF (Baseline)**
1. Set `SHOPNET_API_MODE = false` in wp-config.php
2. Clear all caches: `wp transient delete --all`
3. Test homepage loads correctly
4. Test product pages load correctly
5. Test search functionality
6. Document any errors in debug.log

**Phase B: API ON (Testing)**
1. Set `SHOPNET_API_MODE = true`
2. Clear all caches
3. Test homepage - verify TLD count displays
4. Test categories page - verify categories from API
5. Test product pages - verify similar TLDs section
6. Test search - verify results come from API
7. Check debug.log for any API errors

**Phase C: Rollback Test**
1. Set `SHOPNET_API_MODE = false`
2. Verify site returns to local data
3. Confirm no data corruption

**Phase D: Performance Comparison**
```bash
# With API OFF
time curl -s https://shopnet.domains > /dev/null

# With API ON
time curl -s https://shopnet.domains > /dev/null

# Compare load times
```

---

#### Step 7.1.6: Files Changed Summary

| File | Changes |
|------|---------|
| `wp-config.php` | Add 3 constants |
| `inc/module-loader.php` | Add `fetch_connect_api()`, update `get_tlds()`, `get_categories()` |
| `front-page.php` | Update stats queries with API fallback |
| `inc/rest-api.php` | Update to proxy through Connect API (optional Phase 2) |

---

#### Step 7.1.7: Rollback Plan

If issues occur after enabling API mode:

1. SSH to server:
   ```bash
   ssh -i ~/.ssh/TLemmon.pem bitnami@shopnet.domains
   ```

2. Disable API mode:
   ```bash
   wp config set SHOPNET_API_MODE false --raw --path=/opt/bitnami/wordpress
   ```

3. Clear cache:
   ```bash
   wp transient delete --all --path=/opt/bitnami/wordpress
   ```

4. Verify site works:
   ```bash
   curl -s https://shopnet.domains | head -20
   ```

---

#### Step 7.1.8: Post-Migration Cleanup (After 1 Week Stable)

After confirming API-first is working reliably:

1. **Remove Local Sync Code:**
   - Comment out webhook registration in `data-sync.php`
   - Remove sync button from admin dashboard

2. **Remove Legacy CSV Functions:**
   - Delete `load_tld_csv()` function
   - Delete `load_category_csv()` function
   - Delete `/data/tlds.csv` and `/data/categories.csv` files

3. **Update Documentation:**
   - Update DOCUMENTATION.md with new architecture
   - Remove references to MySQL sync

---

### 17.6.1.1 COMPLETED: Legacy Code Removal (January 18, 2026)

**Status:** ✅ COMPLETE - All legacy/fallback code removed from module-loader.php

**What Was Removed:**

| Component | Lines Removed | Description |
|-----------|---------------|-------------|
| `SHOPNET_API_MODE` checks | ~30 | No longer conditional - API is always on |
| Legacy mode blocks | ~50 | Fallback code in `get_tlds()` and `get_categories()` |
| `load_tld_data()` | ~15 | Legacy data loader function |
| `load_tld_csv()` | ~25 | CSV file reader |
| `load_category_csv()` | ~70 | Complex CSV parser |
| `load_categories_from_wordpress()` | ~35 | WordPress taxonomy fallback |
| `parse_categories_simple()` | ~35 | Hardcoded 31 categories fallback |
| `filter_by_category()` | ~25 | Client-side filtering (API does this) |
| `search_tlds()` | ~15 | Client-side search (API does this) |
| `fetch_api()` | ~30 | Legacy data.shopnet.network API caller |
| `DOMAINSTORE_ENV` branching | Throughout | Environment-based logic |

**File Reduction:** `module-loader.php` went from **766 lines → 342 lines** (55% smaller)

**New Architecture:**
```
PostgreSQL (data.shopnet)
    ↓
Connect API (connect.shopnet.network/api/v1)
    ↓ [module-loader.php fetch_connect_api()]
WordPress Display Layer
```

**Remaining WordPress MySQL Usage:**
- WooCommerce products (synced via webhooks) - STILL IN USE for display
- Product meta (`_ds_tld`, `_ds_tld_emoji`, etc.) - STILL IN USE
- Product categories with `_ds_emoji` term meta - STILL IN USE

**Key Decision Point:** The display templates still read from WooCommerce MySQL:
- `wc_get_products()` in front-page.php, search.php
- `get_post_meta()` in content-product.php, single-product.php

This means:
1. **Sync is still needed** to populate WooCommerce products
2. **Alternative:** Rewrite display to call Connect API directly (major refactor)

---

### 17.6.2 REQUIRED: Connect API Endpoints for shopnet.domains

**Status:** WordPress client code DEPLOYED and waiting. These endpoints must be implemented on connect.shopnet.network.

**Priority:** HIGH - shopnet.domains is ready to switch to API-first mode once these endpoints exist.

#### Endpoint Specifications

All endpoints should query the `shopnet_data` PostgreSQL database and return JSON.

---

##### 1. GET /api/v1/tlds

**Purpose:** List TLDs with filtering and pagination

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `category` | string | Filter by category slug (e.g., `shopping-retail`) |
| `search` | string | Search in punycode, unicode, keywords |
| `group` | string | Filter by tld_group (e.g., `ForSale`) |
| `per_page` | int | Results per page (default: 50, max: 100) |
| `page` | int | Page number (default: 1) |

**Response Format:**
```json
{
  "data": [
    {
      "id": 2008,
      "tld_punycode": "xn--love-kw4bs258k",
      "tld_unicode": "❤️love",
      "text_root": "love",
      "emoji_chars": "❤️",
      "emoji_keywords": "red heart love",
      "tld_group": "ForSale",
      "short_description": "Share the love...",
      "long_description": "...",
      "has_emoji": true,
      "has_kanji": false
    }
  ],
  "pagination": {
    "page": 1,
    "per_page": 50,
    "total": 2011,
    "pages": 41
  }
}
```

**SQL Example:**
```sql
SELECT * FROM tlds
WHERE tld_group = 'ForSale'
  AND (tld_punycode ILIKE '%search%' OR tld_unicode ILIKE '%search%')
ORDER BY id
LIMIT 50 OFFSET 0;
```

---

##### 2. GET /api/v1/tlds/:punycode

**Purpose:** Get single TLD by punycode

**Response Format:**
```json
{
  "id": 2008,
  "tld_punycode": "xn--love-kw4bs258k",
  "tld_unicode": "❤️love",
  ... // all TLD fields
}
```

---

##### 3. GET /api/v1/categories

**Purpose:** List all categories

**Response Format:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Shopping & Retail",
      "slug": "shopping-retail",
      "emoji": "🛍️",
      "keywords": ["shopping", "shop", "store", "retail"],
      "tld_count": 45
    }
  ]
}
```

**SQL Example:**
```sql
SELECT c.*,
       (SELECT COUNT(*) FROM tld_categories tc WHERE tc.category_id = c.id) as tld_count
FROM categories c
ORDER BY c.name;
```

---

##### 4. GET /api/v1/categories/:slug

**Purpose:** Get single category by slug

**Response Format:**
```json
{
  "id": 1,
  "name": "Shopping & Retail",
  "slug": "shopping-retail",
  "emoji": "🛍️",
  "keywords": ["shopping", "shop", "store", "retail"],
  "tld_count": 45
}
```

---

##### 5. GET /api/v1/stats/tld-count

**Purpose:** Get count of TLDs (used on shopnet.domains homepage)

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `group` | string | Filter by tld_group (e.g., `ForSale`) |

**Response Format:**
```json
{
  "count": 2011,
  "group": "ForSale"
}
```

**SQL Example:**
```sql
SELECT COUNT(*) FROM tlds WHERE tld_group = 'ForSale';
```

---

##### 6. GET /api/v1/stats/emojis

**Purpose:** Get unique emojis with counts (used for homepage emoji filter)

**Query Parameters:**
| Parameter | Type | Description |
|-----------|------|-------------|
| `group` | string | Filter by tld_group (e.g., `ForSale`) |
| `limit` | int | Max emojis to return (default: 50) |

**Response Format:**
```json
{
  "emojis": [
    {"emoji": "❤️", "count": 15},
    {"emoji": "🛍️", "count": 12},
    {"emoji": "🌐", "count": 10}
  ],
  "group": "ForSale"
}
```

**SQL Example:**
```sql
SELECT emoji_chars as emoji, COUNT(*) as count
FROM tlds
WHERE tld_group = 'ForSale'
  AND emoji_chars IS NOT NULL
  AND emoji_chars != ''
GROUP BY emoji_chars
ORDER BY count DESC
LIMIT 50;
```

---

#### Implementation Checklist

- [ ] Create `/api/v1/tlds` endpoint with filtering
- [ ] Create `/api/v1/tlds/:punycode` endpoint
- [ ] Create `/api/v1/categories` endpoint
- [ ] Create `/api/v1/categories/:slug` endpoint
- [ ] Create `/api/v1/stats/tld-count` endpoint
- [ ] Create `/api/v1/stats/emojis` endpoint
- [ ] Test all endpoints return correct JSON format
- [ ] Notify Tim to enable `SHOPNET_API_MODE = true` on shopnet.domains

#### Testing Commands

After implementing, test with:
```bash
# Test TLD listing
curl -s "https://connect.shopnet.network/api/v1/tlds?per_page=2&group=ForSale" | jq

# Test categories
curl -s "https://connect.shopnet.network/api/v1/categories" | jq

# Test stats
curl -s "https://connect.shopnet.network/api/v1/stats/tld-count?group=ForSale" | jq
curl -s "https://connect.shopnet.network/api/v1/stats/emojis?group=ForSale&limit=10" | jq
```

#### WordPress Client Ready

The WordPress theme at shopnet.domains already has the client code deployed:
- `module-loader.php` has `fetch_connect_api()` method
- `get_tlds()` and `get_categories()` check `SHOPNET_API_MODE`
- `front-page.php` queries stats endpoints when API mode enabled

To enable after endpoints are ready:
```bash
ssh -i ~/.ssh/TLemmon.pem bitnami@shopnet.domains
wp config set SHOPNET_API_MODE true --raw --path=/opt/bitnami/wordpress
wp transient delete --all --path=/opt/bitnami/wordpress
```

---

### 17.7 Phase 8: connect.shopnet License System

#### License Database Schema (RDS: shopnet_connect)
```sql
CREATE TABLE licenses (
    id VARCHAR(36) PRIMARY KEY DEFAULT gen_random_uuid()::text,
    license_key VARCHAR(64) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    domains TEXT[] NOT NULL,
    features TEXT[] DEFAULT ARRAY['daily_content'],
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,
    request_count INTEGER DEFAULT 0
);

CREATE TABLE api_requests (
    id SERIAL PRIMARY KEY,
    license_key VARCHAR(64) REFERENCES licenses(license_key),
    endpoint VARCHAR(255),
    response_code INTEGER,
    response_time_ms INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### License Types
| Type | Features | Rate Limit | Price |
|------|----------|------------|-------|
| **Free** | TLD search only | 100/day | $0 |
| **Basic** | TLD + Categories | 1,000/day | $29/mo |
| **Pro** | All + Chatbot | 10,000/day | $99/mo |
| **Enterprise** | All + Custom | Unlimited | Custom |

#### API Authentication Flow
```
1. Client sends: X-License-Key: snc_xxx, X-Site-URL: domain.com
2. Connect validates license exists and is active
3. Connect checks domain is in license.domains[]
4. Connect checks feature access
5. Connect checks rate limit
6. If all pass: route to backend service
7. Log request for analytics
```

---

### 17.8 Phase 9: Lambda Agents on RDS

#### Domain.Assist Lambda
```python
# domain_assist_lambda.py
import psycopg2
from os import environ

def lambda_handler(event, context):
    conn = psycopg2.connect(environ['DATABASE_URL'])
    # Query shopnet_data for TLDs, categories
    # Use local LLM for recommendations
    # Return structured response
```

#### Product.Assist Lambda
```python
# product_assist_lambda.py
import psycopg2
from os import environ

def lambda_handler(event, context):
    conn = psycopg2.connect(environ['DATABASE_URL'])
    # Query amazon_products for products, reviews
    # Use local LLM for recommendations
    # Return structured response
```

Both Lambda functions connect to same RDS instance, different databases.

---

### 17.9 Phase 10: Downsize Old EC2

After all services migrated off 54.236.245.127:

#### Remaining on Old EC2
- WordPress only (shopnet.domains)
- MariaDB for WordPress only (bitnami_wordpress)
- Nginx for WordPress only

#### Remove from Old EC2
- Flask API (moved to new EC2)
- Admin GUI (moved to new EC2)
- PostgreSQL client (no longer needed)

#### Downsize
```bash
# In AWS Console:
1. Stop instance 54.236.245.127
2. Change instance type: t3.medium → t3.small
3. Start instance
```

**Cost Savings:** ~$15/month

---

### 17.10 Cost Summary

#### Before Migration
| Resource | Monthly Cost |
|----------|--------------|
| EC2 US-East (mixed) | ~$30 |
| EC2 Australia | ~$30 |
| RDS | ~$15 |
| **Total** | **~$75** |

#### After Migration
| Resource | Monthly Cost |
|----------|--------------|
| NEW EC2 (backend) | ~$15 |
| OLD EC2 (WordPress, downsized) | ~$15 |
| RDS (same) | ~$15 |
| EC2 Australia | $0 (terminated) |
| **Total** | **~$45** |

**Savings:** ~$30/month with better architecture

---

### 17.11 Migration Checklist

#### Pre-Migration
- [ ] AWS Console access confirmed
- [ ] RDS credentials available
- [ ] TLemmon.pem key accessible
- [ ] DNS provider access confirmed

#### Phase 1: New EC2
- [ ] EC2 launched in us-east-1
- [ ] Security group configured
- [ ] RDS security group updated
- [ ] SSH access confirmed
- [ ] RDS connectivity tested

#### Phase 2-4: Services
- [ ] Flask API deployed and running
- [ ] FastAPI Connect deployed and running
- [ ] Admin GUI deployed
- [ ] All health checks passing

#### Phase 5-6: Nginx + DNS
- [ ] Nginx configured
- [ ] SSL certificates obtained
- [ ] DNS updated for shopnet.network
- [ ] DNS updated for connect.shopnet.network
- [ ] All HTTPS endpoints working

#### Phase 7: API-First
- [ ] Feature flag added to shopnet.domains
- [ ] API mode tested
- [ ] Cloudflare caching configured
- [ ] MySQL sync disabled
- [ ] Local TLD/Category tables dropped

#### Phase 8: Licenses
- [ ] License database schema created
- [ ] License CRUD API working
- [ ] Rate limiting implemented
- [ ] Analytics logging active

#### Phase 9: Lambda Agents
- [ ] Domain.Assist Lambda deployed
- [ ] Product.Assist Lambda deployed
- [ ] Both connected to RDS
- [ ] Local LLM integration working

#### Phase 10: Cleanup
- [ ] Old EC2 services stopped
- [ ] Old EC2 downsized
- [ ] Documentation updated
- [ ] Cost savings confirmed

---

### 17.12 Rollback Plan

#### Quick Rollback (DNS)
1. Point `shopnet.network` back to CloudFront
2. Point `connect.shopnet.network` to old EC2
3. Keep new EC2 for debugging

#### Full Rollback
1. Re-enable MySQL sync on shopnet.domains
2. Point all DNS back to original
3. Terminate new EC2 if needed
4. Re-enable all services on old EC2

---

## 18. DETAILED CODE INVENTORY FOR MIGRATION

> **Purpose:** Minute-level detail of all code that needs to change, avoiding issues like the PostgreSQL migration.

### 18.1 Admin GUI Inventory

#### File Structure
| File | Path | Size | Lines | Purpose |
|------|------|------|-------|---------|
| `index.html` | `/admin/` | 241 KB | 3,611 | Main SPA - login, sidebar, panels, modals |
| `admin.js` | `/admin/assets/js/` | 406 KB | 8,891 | Complete application logic, all API calls |
| `admin.css` | `/admin/assets/css/` | 39 KB | 4,867 | Styling, responsive layout, components |
| `favicon.png` | `/admin/` | 116 KB | Binary | Icon |

**Total:** ~806 KB, 17,369 lines of code

#### External Dependencies (CDN)
```html
<!-- Google Fonts (index.html lines 8-9) -->
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap">

<!-- Chart.js (admin.js line 7361 - dynamically loaded) -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
```

#### API Base Configuration
```javascript
// admin.js line 2
const API_BASE = '/api';  // Relative URL - uses same origin
```
**Migration Impact:** Will work if new EC2 serves API at `/api` path. No code change needed.

#### Authentication Mechanism
```javascript
// admin.js lines 7-9
let apiKey = sessionStorage.getItem('shopnet_api_key') || '';
let userEmail = sessionStorage.getItem('shopnet_user_email') || '';
let sessionToken = sessionStorage.getItem('shopnet_session') || '';
```
- Login: `POST /api/auth/login` → returns `session_token` + `api_key`
- Storage: `sessionStorage` (cleared on tab close)
- Header: `X-API-Key` sent with authenticated requests

#### All 62 API Endpoints Called by Admin GUI

**Authentication (1 endpoint):**
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/auth/login` | POST | User login |

**TLD Management (12 endpoints):**
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/tlds` | GET | List TLDs (paginated) |
| `/api/tlds/<id>` | GET | Get single TLD |
| `/api/tlds` | POST | Create TLD |
| `/api/tlds/<id>` | PUT | Update TLD |
| `/api/tlds/<id>` | DELETE | Delete TLD |
| `/api/tlds/lookup` | GET | Lookup by punycode/unicode |
| `/api/tlds/random` | GET | Get random TLD |
| `/api/tlds/<id>/history` | GET | Get modification history |
| `/api/tlds/<id>/profile` | GET | Get full profile |
| `/api/tlds/bulk` | PUT | Bulk update |
| `/api/import/csv` | POST | Import from CSV |
| `/api/export/tlds` | GET | Export to CSV |

**Category Management (8 endpoints):**
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/categories` | GET | List categories |
| `/api/categories/<id>` | GET | Get single category |
| `/api/categories` | POST | Create category |
| `/api/categories/<id>` | PUT | Update category |
| `/api/categories/<id>` | DELETE | Delete category |
| `/api/categories/<id>/tlds` | GET | List TLDs in category |
| `/api/categories/<id>/apply-rule` | POST | Apply category rule |
| `/api/categories/preview-rule` | POST | Preview rule |

**TLD-Category Assignments (3 endpoints):**
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/tld-categories` | GET | List all assignments |
| `/api/tld-categories` | POST | Assign category |
| `/api/tld-categories` | DELETE | Remove assignment |

**Search (2 endpoints):**
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/search` | GET | Search TLDs |
| `/api/suggest` | GET | Autocomplete |

**Statistics (5 endpoints):**
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/stats` | GET | Overall statistics |
| `/api/stats/unique-chars` | GET | Character stats |
| `/api/stats/character-types` | GET | Detailed breakdown |
| `/api/stats/extended` | GET | Extended stats |
| `/api/stats/groups` | GET | Group stats |

**Client Management (7 endpoints):**
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/clients` | GET | List clients |
| `/api/clients/<id>` | GET | Get client config |
| `/api/clients/<id>` | PUT | Update client |
| `/api/clients/<id>/push` | POST | Trigger webhook |
| `/api/clients/<id>/stats` | GET | Get sync stats |
| `/api/clients/<id>/sync` | GET | Get sync data |
| `/api/clients/<id>/sync-manifest` | POST | Get manifest |
| `/api/clients/<id>/sync-history` | GET | Get history |

**Webhooks (4 endpoints):**
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/webhooks` | GET | List webhooks |
| `/api/webhooks` | POST | Create webhook |
| `/api/webhooks/<id>` | DELETE | Delete webhook |
| `/api/webhooks/test` | POST | Test delivery |

**Relevancy Scoring (3 endpoints):**
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/relevancy/preview` | POST | Preview scoring |
| `/api/relevancy/apply` | POST | Apply scoring |
| `/api/relevancy/test/<id>` | GET | Test single TLD |

**API Keys (4 endpoints):**
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/keys` | GET | List keys |
| `/api/keys` | POST | Create key |
| `/api/keys/<id>` | PUT | Update key |
| `/api/keys/<id>` | DELETE | Delete key |

**Audit & Backup (6 endpoints):**
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/audit-log` | GET | Get audit entries |
| `/api/backups` | GET | List backups |
| `/api/backups` | POST | Create backup |
| `/api/backups/<file>/restore` | POST | Restore backup |
| `/api/backups/<file>` | DELETE | Delete backup |
| `/api/health` | GET | Health check |

**Sync (3 endpoints):**
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/sync/push` | POST | Push to WordPress |
| `/api/sync/status` | GET | Sync status |
| `/api/docs` | GET | API documentation |

---

### 18.2 Flask API Inventory

#### File Structure
| File | Path | Purpose |
|------|------|---------|
| `app.py` | `/api/` | Main Flask app (3,261+ lines) |
| `requirements.txt` | `/api/` | Dependencies |
| `auth.py` | `/api/blueprints/` | Authentication (5 routes) |
| `tlds.py` | `/api/blueprints/` | TLD management (14 routes) |
| `categories.py` | `/api/blueprints/` | Category management (11 routes) |
| `clients.py` | `/api/blueprints/` | Client endpoints (8 routes) |
| `webhooks.py` | `/api/blueprints/` | Webhook management (4 routes) |
| `relevancy.py` | `/api/blueprints/` | Relevancy scoring (4 routes) |
| `sync.py` | `/api/blueprints/` | Stats & backup (16 routes) |

#### Environment Variables Required
```bash
# Database (MUST UPDATE for new EC2)
DB_HOST=amazon-products-db-1754023596.cenq4au2o7vl.us-east-1.rds.amazonaws.com
DB_PORT=5432
DB_NAME=shopnet_data
DB_USER=postgres
DB_PASSWORD=ShopnetData2026!

# API Configuration
FLASK_DEBUG=false
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=60

# Backup Directory (MUST CREATE on new EC2)
BACKUP_DIR=/opt/shopnet/backups

# WordPress Integration (UPDATE after API-first migration)
WP_WEBHOOK_URL=https://shopnet.domains/wp-json/domain-store/v1/webhook
WP_WEBHOOK_SECRET=your_secret_here
```

#### Python Dependencies (requirements.txt)
```
flask>=2.3.0
flask-cors>=4.0.0
psycopg2-binary>=2.9.0
gunicorn>=21.0.0
python-dotenv>=1.0.0
bcrypt
requests
redis  # optional
```

---

### 18.3 WordPress Theme Inventory (shopnet.domains)

#### Files That Query Local TLD/Category Data

| File | Path | Functions | Priority |
|------|------|-----------|----------|
| `module-loader.php` | `/theme/inc/` | 14 methods | CRITICAL |
| `data-sync.php` | `/theme/inc/` | 16 methods | CRITICAL |
| `domain-assist.php` | `/theme/inc/` | 7 functions | CRITICAL |
| `category-sync.php` | `/theme/inc/` | 3 functions | MEDIUM |
| `tld-importer.php` | `/theme/inc/` | 4 functions | LOW |
| `front-page.php` | `/theme/` | 3 wpdb queries | MEDIUM |
| `template-categories.php` | `/theme/` | 1 get_terms call | LOW |
| `domain-search.php` | `/theme/inc/` | 4 functions | MEDIUM |
| `rest-api.php` | `/theme/inc/` | 7 REST endpoints | CRITICAL |

**Total: 45+ functions/methods across 9 files**

---

### 18.4 WordPress Meta Keys in Use

#### Product Meta (wp_postmeta)
```
_ds_tld                    - TLD Unicode value
_ds_tld_punycode           - TLD Punycode
_ds_tld_emoji              - Emoji characters
_ds_tld_text_root          - Text portion only
_ds_tld_type               - Type of TLD
_ds_tld_group              - "ForSale", "Reserved", etc.
_ds_char_count             - Character count (UTF-8)
_ds_text_root_length       - Text root char count
_ds_is_emoji               - Boolean (1/0)
_ds_is_kanji               - Boolean (1/0)
_ds_is_text                - Boolean (1/0)
_ds_our_tld                - "yes"/"no" for royalties
_ds_api_tld_id             - API ID from data.shopnet.domains
_ds_text_hall_of_fame      - Boolean (1/0)
_ds_tld_description_line1  - Description text
```

#### Term Meta (wp_termmeta)
```
_ds_emoji        - Category emoji icon
_ds_category_id  - ID from data.shopnet.domains
```

#### WordPress Options (wp_options)
```
ds_domain_assist_prompts   - Domain.Assist config
ds_webhook_secret          - Webhook signing secret
ds_last_sync_time          - Last sync timestamp
ds_last_sync_result        - "success"/"failed"
ds_auto_sync_enabled       - "1"/"0"
ds_delete_orphans          - Safety flag
```

#### Transient Cache Keys
```
_transient_tlds_*                    - TLD cache (1 hour)
_transient_domainstore_categories    - Category cache (1 hour)
_transient_domainstore_prompts       - Prompts cache (1 hour)
_transient_ds_tld_urls_map           - URL map cache (5 min)
```

---

### 18.5 Critical Config Constants (functions.php)

```php
// Lines 20-42 of theme/functions.php
define('DOMAINSTORE_ENV', 'local');        // CHANGE TO: 'api'
define('DOMAINSTORE_API_KEY', '');         // ADD: License key
define('DOMAINSTORE_API_URL', 'https://data.shopnet.network/api');  // CHANGE TO: 'https://connect.shopnet.network/api/v1'
```

---

### 18.6 Module Loader Methods to Migrate

**Class:** `DomainStore_Module_Loader` in `/theme/inc/module-loader.php`

| Method | Current Behavior | API-First Behavior |
|--------|------------------|-------------------|
| `get_tlds($args)` | Loads from CSV/local | Call Connect API |
| `get_tld($identifier)` | Search local data | Call Connect API |
| `get_categories()` | Query wp_terms | Call Connect API |
| `load_categories_from_wordpress()` | Query wp_termmeta | REMOVE (use API) |
| `get_category($identifier)` | Filter local array | Call Connect API |
| `load_tld_data()` | Load CSV file | REMOVE (use API) |
| `load_tld_csv()` | Read `/data/tlds.csv` | REMOVE |
| `load_category_csv()` | Read `/data/categories.csv` | REMOVE |
| `clear_cache()` | Delete transients | Keep for API cache |
| `filter_by_category($tlds, $category)` | Local filtering | API-side filtering |
| `search_tlds($tlds, $search)` | Local search | API-side search |
| `fetch_api($endpoint)` | Call data.shopnet.domains | Call connect.shopnet.network |

---

### 18.7 Data Sync Class to Deprecate

**Class:** `DomainStore_Data_Sync` in `/theme/inc/data-sync.php`

After API-first migration, this entire class can be **DEPRECATED**:

| Method | Current Purpose | API-First Status |
|--------|----------------|------------------|
| `handle_webhook()` | Process sync events | DEPRECATE |
| `request_sync_push()` | Request data from API | DEPRECATE |
| `get_all_wp_punycodes()` | Query local MySQL | DEPRECATE |
| `apply_sync_changes()` | Update local DB | DEPRECATE |
| `process_tlds()` | Create/update products | DEPRECATE |
| `process_categories()` | Create/update terms | DEPRECATE |
| `create_tld_product()` | Create WC product | KEEP for display only |
| `update_tld_product()` | Update WC product | KEEP for display only |

**Note:** Keep product creation for WooCommerce display, but data comes from API, not sync.

---

### 18.8 Domain.Assist Functions to Update

**File:** `/theme/inc/domain-assist.php`

| Function | Current Data Source | API-First Data Source |
|----------|--------------------|-----------------------|
| `ds_generate_suggestions()` | `Module_Loader::get_tlds()` | Connect API |
| `ds_get_relevant_tlds()` | Module Loader + scoring | API with relevancy param |
| `ds_get_popular_tlds()` | `wc_get_products()` | API `?popular=true` |
| `ds_suggest_categories()` | Module Loader | Connect API |
| `ds_process_chat_message()` | Module Loader | Connect API |
| `ds_handle_chat_ajax()` | Module Loader | Connect API |
| `ds_find_similar_tlds()` | Module Loader | API with category filter |

---

### 18.9 Front-Page wpdb Queries to Replace

**File:** `/theme/front-page.php`

```php
// Line 16-24: Count ForSale TLDs
// CURRENT:
$wpdb->get_var("SELECT COUNT(DISTINCT p.ID) FROM {$wpdb->posts} p
    INNER JOIN {$wpdb->postmeta} pm ON p.ID = pm.post_id
    WHERE pm.meta_key = '_ds_tld_group' AND pm.meta_value = 'ForSale'");

// API-FIRST:
$response = wp_remote_get(CONNECT_API_URL . '/tlds/count?group=ForSale');
$count = json_decode(wp_remote_retrieve_body($response))->count;
```

```php
// Line 27-39: Get unique emojis
// CURRENT:
$wpdb->get_results("SELECT pm.meta_value as emoji, COUNT(*) as cnt
    FROM {$wpdb->postmeta} pm WHERE pm.meta_key = '_ds_tld_emoji'...");

// API-FIRST:
$response = wp_remote_get(CONNECT_API_URL . '/stats/emojis?group=ForSale');
$emojis = json_decode(wp_remote_retrieve_body($response));
```

---

### 18.10 REST API Endpoints to Update

**File:** `/theme/inc/rest-api.php`

| Endpoint | Current Implementation | API-First Implementation |
|----------|----------------------|--------------------------|
| `/domain-store/v1/tlds` | `Module_Loader::get_tlds()` | Proxy to Connect API |
| `/domain-store/v1/tlds/:id` | `Module_Loader::get_tld()` | Proxy to Connect API |
| `/domain-store/v1/categories` | `Module_Loader::get_categories()` | Proxy to Connect API |
| `/domain-store/v1/categories/:slug` | Module Loader | Proxy to Connect API |
| `/domain-store/v1/assist/suggest` | `ds_generate_suggestions()` | Call Domain.Assist Lambda |

---

### 18.11 AJAX Search to Migrate

**File:** `/theme/inc/rest-api.php` - Function `ds_ajax_inline_tld_search()`

**Current:** Lines 467-639 - Gets ALL products then filters in PHP
```php
$args = [
    'status' => 'publish',
    'limit' => -1,  // Gets ALL products!
    'meta_query' => [['key' => '_ds_tld_group', 'value' => 'ForSale']]
];
// Then PHP filters by emoji, char_count, category, text search...
```

**API-First:**
```php
$api_url = CONNECT_API_URL . '/tlds?' . http_build_query([
    'group' => 'ForSale',
    'emoji' => $emoji_filter,
    'char_count' => $char_count,
    'category' => $category,
    'search' => $search_term,
    'limit' => 50,
    'offset' => $page * 50
]);
$response = wp_remote_get($api_url);
```

---

### 18.12 NUMBERED EXECUTION STEPS (Master Checklist)

> **Instructions:** Check off each step as completed. Do not proceed to next phase until current phase is verified.

---

#### PHASE A: PRE-FLIGHT (Steps 1-10)

| # | Step | Command/Action | Verify | Status |
|---|------|----------------|--------|--------|
| **1** | Confirm AWS Console access | Login to AWS Console | Can see EC2 dashboard | ☐ |
| **2** | Confirm RDS credentials | Check data.shopnet README | Have password | ☐ |
| **3** | Confirm SSH key available | `ls /Users/tim001/VSCode/Keys/TLemmon.pem` | File exists | ☐ |
| **4** | Confirm DNS provider access | Login to Route 53 or registrar | Can edit records | ☐ |
| **5** | Backup current Admin GUI | `tar -czf admin-backup.tar.gz /opt/shopnet-data/admin/` | File created | ☐ |
| **6** | Backup current Flask API | `tar -czf api-backup.tar.gz /opt/shopnet-data/api/` | File created | ☐ |
| **7** | Note current EC2 IP | `curl ifconfig.me` on 54.236.245.127 | IP confirmed | ☐ |
| **8** | Test RDS from current EC2 | `psql -h RDS_HOST -U postgres -d shopnet_data -c "SELECT COUNT(*) FROM tlds;"` | Returns 2011 | ☐ |
| **9** | Document rollback contacts | Tim's phone, AWS support | Written down | ☐ |
| **10** | Schedule maintenance window | Notify users if needed | Time confirmed | ☐ |

---

#### PHASE B: NEW EC2 LAUNCH (Steps 11-20)

| # | Step | Command/Action | Verify | Status |
|---|------|----------------|--------|--------|
| **11** | Launch EC2 instance | AWS Console → EC2 → Launch Instance | Instance ID noted | ☐ |
| **12** | Select AMI | Ubuntu 22.04 LTS (64-bit x86) | AMI selected | ☐ |
| **13** | Select instance type | t3.small (2 vCPU, 2GB RAM) | Type confirmed | ☐ |
| **14** | Select key pair | TLemmon (existing) | Key selected | ☐ |
| **15** | Configure VPC | Same VPC as RDS | VPC matches | ☐ |
| **16** | Configure subnet | Public subnet in us-east-1a | Subnet selected | ☐ |
| **17** | Enable public IP | Auto-assign public IP: Enable | Enabled | ☐ |
| **18** | Configure storage | 20 GiB gp3 | Storage set | ☐ |
| **19** | Create security group | Name: `shopnet-backend-sg` | Group created | ☐ |
| **20** | Note public IP | Write down: _____________ | IP recorded | ☐ |

---

#### PHASE C: SECURITY GROUP RULES (Steps 21-26)

| # | Step | Port | Source | Status |
|---|------|------|--------|--------|
| **21** | Add SSH rule | 22 | Your IP or 0.0.0.0/0 | ☐ |
| **22** | Add HTTP rule | 80 | 0.0.0.0/0 | ☐ |
| **23** | Add HTTPS rule | 443 | 0.0.0.0/0 | ☐ |
| **24** | Update RDS security group | 5432 | shopnet-backend-sg | ☐ |
| **25** | Verify security groups | AWS Console | All rules visible | ☐ |
| **26** | Test SSH access | `ssh -i TLemmon.pem ubuntu@[NEW_IP]` | Login successful | ☐ |

---

#### PHASE D: SERVER SETUP (Steps 27-40)

| # | Step | Command | Verify | Status |
|---|------|---------|--------|--------|
| **27** | Update system | `sudo apt update && sudo apt upgrade -y` | No errors | ☐ |
| **28** | Install nginx | `sudo apt install -y nginx` | `nginx -v` works | ☐ |
| **29** | Install Python 3.11 | `sudo apt install -y python3.11 python3.11-venv python3-pip` | `python3.11 --version` | ☐ |
| **30** | Install PostgreSQL client | `sudo apt install -y postgresql-client` | `psql --version` | ☐ |
| **31** | Install certbot | `sudo apt install -y certbot python3-certbot-nginx` | `certbot --version` | ☐ |
| **32** | Install git | `sudo apt install -y git` | `git --version` | ☐ |
| **33** | Create shopnet user | `sudo useradd -m -s /bin/bash shopnet` | User exists | ☐ |
| **34** | Create /opt/shopnet | `sudo mkdir -p /opt/shopnet` | Directory exists | ☐ |
| **35** | Create subdirectories | `sudo mkdir -p /opt/shopnet/{admin,data-api,connect-api,backups}` | All exist | ☐ |
| **36** | Set ownership | `sudo chown -R shopnet:shopnet /opt/shopnet` | Owner is shopnet | ☐ |
| **37** | Create log directory | `sudo mkdir -p /var/log/shopnet && sudo chown shopnet:shopnet /var/log/shopnet` | Exists | ☐ |
| **38** | Test RDS connectivity | `psql -h amazon-products-db-*.rds.amazonaws.com -U postgres -d shopnet_data -c "SELECT 1;"` | Returns 1 | ☐ |
| **39** | Verify TLD count | `psql ... -c "SELECT COUNT(*) FROM tlds;"` | Returns 2011 | ☐ |
| **40** | Verify category count | `psql ... -c "SELECT COUNT(*) FROM categories;"` | Returns 37 | ☐ |

---

#### PHASE E: DEPLOY FLASK API (Steps 41-55)

| # | Step | Command | Verify | Status |
|---|------|---------|--------|--------|
| **41** | Create temp directory | `mkdir -p /tmp/data-api` | Exists | ☐ |
| **42** | Upload API from local | `scp -i TLemmon.pem -r /Users/tim001/VSCode/data.shopnet/api/* ubuntu@[IP]:/tmp/data-api/` | Files transferred | ☐ |
| **43** | Move to /opt/shopnet | `sudo mv /tmp/data-api/* /opt/shopnet/data-api/` | Files in place | ☐ |
| **44** | Set ownership | `sudo chown -R shopnet:shopnet /opt/shopnet/data-api` | Owner correct | ☐ |
| **45** | Create venv | `sudo -u shopnet bash -c "cd /opt/shopnet/data-api && python3.11 -m venv venv"` | venv/ exists | ☐ |
| **46** | Install dependencies | `sudo -u shopnet bash -c "source /opt/shopnet/data-api/venv/bin/activate && pip install -r requirements.txt"` | No errors | ☐ |
| **47** | Create .env file | See Step 47 details below | File exists | ☐ |
| **48** | Set .env permissions | `chmod 600 /opt/shopnet/data-api/.env` | Mode 600 | ☐ |
| **49** | Create systemd service | See Step 49 details below | File exists | ☐ |
| **50** | Reload systemd | `sudo systemctl daemon-reload` | No errors | ☐ |
| **51** | Enable service | `sudo systemctl enable shopnet-data-api` | Enabled | ☐ |
| **52** | Start service | `sudo systemctl start shopnet-data-api` | Started | ☐ |
| **53** | Check status | `sudo systemctl status shopnet-data-api` | Active (running) | ☐ |
| **54** | Test health endpoint | `curl http://127.0.0.1:5000/api/health` | Returns healthy | ☐ |
| **55** | Check logs | `sudo journalctl -u shopnet-data-api -n 50` | No errors | ☐ |

**Step 47 - .env file contents:**
```bash
cat > /opt/shopnet/data-api/.env << 'EOF'
DB_HOST=amazon-products-db-1754023596.cenq4au2o7vl.us-east-1.rds.amazonaws.com
DB_PORT=5432
DB_NAME=shopnet_data
DB_USER=postgres
DB_PASSWORD=ShopnetData2026!
FLASK_DEBUG=false
BACKUP_DIR=/opt/shopnet/backups
EOF
```

**Step 49 - systemd service file:**
```bash
sudo tee /etc/systemd/system/shopnet-data-api.service << 'EOF'
[Unit]
Description=Shopnet Data API (Flask)
After=network.target

[Service]
User=shopnet
Group=shopnet
WorkingDirectory=/opt/shopnet/data-api
Environment="PATH=/opt/shopnet/data-api/venv/bin"
EnvironmentFile=/opt/shopnet/data-api/.env
ExecStart=/opt/shopnet/data-api/venv/bin/gunicorn --workers 2 --bind 127.0.0.1:5000 "app:create_app()"
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF
```

---

#### PHASE F: DEPLOY ADMIN GUI (Steps 56-62)

| # | Step | Command | Verify | Status |
|---|------|---------|--------|--------|
| **56** | Create temp directory | `mkdir -p /tmp/admin` | Exists | ☐ |
| **57** | Upload Admin GUI | `scp -i TLemmon.pem -r /Users/tim001/VSCode/data.shopnet/admin/* ubuntu@[IP]:/tmp/admin/` | Files transferred | ☐ |
| **58** | Move to /opt/shopnet | `sudo mv /tmp/admin/* /opt/shopnet/admin/` | Files in place | ☐ |
| **59** | Set ownership | `sudo chown -R shopnet:shopnet /opt/shopnet/admin` | Owner correct | ☐ |
| **60** | Verify index.html | `ls -la /opt/shopnet/admin/index.html` | File exists | ☐ |
| **61** | Verify admin.js | `ls -la /opt/shopnet/admin/assets/js/admin.js` | File exists | ☐ |
| **62** | Verify admin.css | `ls -la /opt/shopnet/admin/assets/css/admin.css` | File exists | ☐ |

---

#### PHASE G: DEPLOY CONNECT GATEWAY (Steps 63-75)

| # | Step | Command | Verify | Status |
|---|------|---------|--------|--------|
| **63** | Create temp directory | `mkdir -p /tmp/connect-api` | Exists | ☐ |
| **64** | Upload Connect API | `scp -i TLemmon.pem -r /Users/tim001/VSCode/connect.shopnet/backend/* ubuntu@[IP]:/tmp/connect-api/` | Files transferred | ☐ |
| **65** | Move to /opt/shopnet | `sudo mv /tmp/connect-api/* /opt/shopnet/connect-api/` | Files in place | ☐ |
| **66** | Set ownership | `sudo chown -R shopnet:shopnet /opt/shopnet/connect-api` | Owner correct | ☐ |
| **67** | Create venv | `sudo -u shopnet bash -c "cd /opt/shopnet/connect-api && python3.11 -m venv venv"` | venv/ exists | ☐ |
| **68** | Install dependencies | `sudo -u shopnet bash -c "source /opt/shopnet/connect-api/venv/bin/activate && pip install fastapi uvicorn[standard] psycopg2-binary python-dotenv pydantic"` | No errors | ☐ |
| **69** | Create .env file | See Step 69 details below | File exists | ☐ |
| **70** | Set .env permissions | `chmod 600 /opt/shopnet/connect-api/.env` | Mode 600 | ☐ |
| **71** | Create systemd service | See Step 71 details below | File exists | ☐ |
| **72** | Reload systemd | `sudo systemctl daemon-reload` | No errors | ☐ |
| **73** | Enable service | `sudo systemctl enable shopnet-connect` | Enabled | ☐ |
| **74** | Start service | `sudo systemctl start shopnet-connect` | Started | ☐ |
| **75** | Test health endpoint | `curl http://127.0.0.1:8000/health` | Returns healthy | ☐ |

**Step 69 - Connect .env:**
```bash
cat > /opt/shopnet/connect-api/.env << 'EOF'
DATABASE_URL=postgresql://postgres:ShopnetData2026!@amazon-products-db-1754023596.cenq4au2o7vl.us-east-1.rds.amazonaws.com:5432/shopnet_data
ENV=production
EOF
```

**Step 71 - Connect systemd service:**
```bash
sudo tee /etc/systemd/system/shopnet-connect.service << 'EOF'
[Unit]
Description=Shopnet Connect Gateway (FastAPI)
After=network.target

[Service]
User=shopnet
Group=shopnet
WorkingDirectory=/opt/shopnet/connect-api
Environment="PATH=/opt/shopnet/connect-api/venv/bin"
EnvironmentFile=/opt/shopnet/connect-api/.env
ExecStart=/opt/shopnet/connect-api/venv/bin/uvicorn shopnet_connect_api:app --host 127.0.0.1 --port 8000 --workers 2
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF
```

---

#### PHASE H: CONFIGURE NGINX (Steps 76-85)

| # | Step | Command | Verify | Status |
|---|------|---------|--------|--------|
| **76** | Create nginx config | See Step 76 details below | File exists | ☐ |
| **77** | Remove default site | `sudo rm -f /etc/nginx/sites-enabled/default` | Removed | ☐ |
| **78** | Enable shopnet site | `sudo ln -sf /etc/nginx/sites-available/shopnet /etc/nginx/sites-enabled/` | Link exists | ☐ |
| **79** | Test nginx config | `sudo nginx -t` | Syntax OK | ☐ |
| **80** | Reload nginx | `sudo systemctl reload nginx` | No errors | ☐ |
| **81** | Test local Admin GUI | `curl -I http://127.0.0.1/` | HTTP 200 | ☐ |
| **82** | Test local API | `curl http://127.0.0.1/api/health` | Returns healthy | ☐ |
| **83** | Check nginx logs | `sudo tail -f /var/log/nginx/error.log` | No errors | ☐ |
| **84** | Test from external | `curl -I http://[NEW_EC2_IP]/` | HTTP 200 | ☐ |
| **85** | Test API externally | `curl http://[NEW_EC2_IP]/api/health` | Returns healthy | ☐ |

**Step 76 - Nginx configuration:**
```bash
sudo tee /etc/nginx/sites-available/shopnet << 'EOF'
server {
    listen 80;
    server_name shopnet.network connect.shopnet.network;

    root /opt/shopnet/admin;
    index index.html;

    # Admin GUI
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Flask API (data.shopnet)
    location /api/ {
        proxy_pass http://127.0.0.1:5000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        add_header Access-Control-Allow-Origin "*" always;
        add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS" always;
        add_header Access-Control-Allow-Headers "Content-Type, X-API-Key" always;

        if ($request_method = OPTIONS) {
            return 204;
        }
    }

    # Health check
    location /health {
        proxy_pass http://127.0.0.1:5000/api/health;
    }
}
EOF
```

---

#### PHASE I: DNS & SSL (Steps 86-95)

| # | Step | Command/Action | Verify | Status |
|---|------|----------------|--------|--------|
| **86** | Update DNS: shopnet.network | A record → [NEW_EC2_IP] | Record saved | ☐ |
| **87** | Update DNS: connect.shopnet.network | A record → [NEW_EC2_IP] | Record saved | ☐ |
| **88** | Wait for propagation | `dig shopnet.network` | Shows new IP | ☐ |
| **89** | Verify DNS from server | `dig +short shopnet.network` | Returns new IP | ☐ |
| **90** | Run certbot | `sudo certbot --nginx -d shopnet.network -d connect.shopnet.network` | Certificates issued | ☐ |
| **91** | Test HTTPS Admin GUI | `curl -I https://shopnet.network/` | HTTP 200 + SSL | ☐ |
| **92** | Test HTTPS API | `curl https://shopnet.network/api/health` | Returns healthy | ☐ |
| **93** | Test HTTPS Connect | `curl https://connect.shopnet.network/health` | Returns healthy | ☐ |
| **94** | Verify auto-renewal | `sudo certbot renew --dry-run` | Dry run OK | ☐ |
| **95** | Check nginx HTTPS config | `cat /etc/nginx/sites-available/shopnet` | SSL blocks present | ☐ |

---

#### PHASE J: ADMIN GUI VERIFICATION (Steps 96-105)

| # | Step | Action | Expected Result | Status |
|---|------|--------|-----------------|--------|
| **96** | Open browser | Navigate to https://shopnet.network/ | Login page loads | ☐ |
| **97** | Check for JS errors | Open browser console (F12) | No errors | ☐ |
| **98** | Login | admin@shopnet.domains / Admin2026 | Dashboard loads | ☐ |
| **99** | Check Dashboard stats | View total TLDs, categories | 2011 TLDs, 37 categories | ☐ |
| **100** | Open TLD Manager | Click TLD Manager | Table loads with TLDs | ☐ |
| **101** | Search TLD | Search for "love" | Results appear | ☐ |
| **102** | Edit TLD | Click edit on any TLD | Modal opens with data | ☐ |
| **103** | Save TLD | Change description, save | Toast: "TLD updated" | ☐ |
| **104** | Open Category Manager | Click Category Manager | Categories load | ☐ |
| **105** | Create test category | Add category "test-migration" | Category appears | ☐ |

---

#### PHASE K: WORDPRESS API-FIRST (Steps 106-120)

| # | Step | File | Change | Status |
|---|------|------|--------|--------|
| **106** | SSH to OLD EC2 | `ssh -i TLemmon.pem bitnami@54.236.245.127` | Connected | ☐ |
| **107** | Backup functions.php | `cp functions.php functions.php.backup` | Backup created | ☐ |
| **108** | Edit functions.php | Add `define('SHOPNET_API_MODE', false);` | Constant added (OFF) | ☐ |
| **109** | Add CONNECT_URL | Add `define('SHOPNET_CONNECT_URL', 'https://connect.shopnet.network/api/v1');` | URL added | ☐ |
| **110** | Add LICENSE_KEY | Add `define('SHOPNET_LICENSE_KEY', 'snc_shopnet_domains_2026');` | Key added | ☐ |
| **111** | Create API client | Create `/theme/inc/shopnet-api-client.php` | File created | ☐ |
| **112** | Add client code | Paste Shopnet_API_Client class | Code added | ☐ |
| **113** | Include client | Add `require_once 'inc/shopnet-api-client.php';` in functions.php | Included | ☐ |
| **114** | Update module-loader | Add API mode check to get_tlds() | Code updated | ☐ |
| **115** | Update get_categories | Add API mode check | Code updated | ☐ |
| **116** | Clear WP cache | `wp cache flush` or clear transients | Cache cleared | ☐ |
| **117** | Test with API OFF | Browse shopnet.domains | Site works normally | ☐ |
| **118** | Enable API mode | Set `SHOPNET_API_MODE` to `true` | Changed to true | ☐ |
| **119** | Clear cache again | `wp transient delete --all` | Cleared | ☐ |
| **120** | Test with API ON | Browse shopnet.domains | Site works via API | ☐ |

---

#### PHASE L: CHATBOT VERIFICATION (Steps 121-125)

| # | Step | Action | Expected Result | Status |
|---|------|--------|-----------------|--------|
| **121** | Open shopnet.domains | Navigate to homepage | Page loads | ☐ |
| **122** | Open chatbot | Click chatbot icon | Widget opens | ☐ |
| **123** | Send test message | Type "I want a domain about love" | Suggestions appear | ☐ |
| **124** | Verify TLDs shown | Check displayed TLDs | Valid TLDs from API | ☐ |
| **125** | Check network tab | F12 → Network | Calls to connect.shopnet.network | ☐ |

---

#### PHASE M: DISABLE MYSQL SYNC (Steps 126-130)

| # | Step | Command/Action | Verify | Status |
|---|------|----------------|--------|--------|
| **126** | Confirm API working | All Phase L tests pass | Confirmed | ☐ |
| **127** | Disable webhook | Comment out `register_rest_routes()` in data-sync.php | Commented | ☐ |
| **128** | Disable auto-sync | Set `ds_auto_sync_enabled` to '0' in wp_options | Disabled | ☐ |
| **129** | Clear sync transients | Delete `ds_last_sync_*` transients | Deleted | ☐ |
| **130** | Document completion | Note date/time in Deathstar | Logged | ☐ |

---

#### PHASE N: OLD EC2 CLEANUP (Steps 131-140)

| # | Step | Command/Action | Verify | Status |
|---|------|----------------|--------|--------|
| **131** | Confirm new EC2 stable | 24+ hours with no issues | Confirmed | ☐ |
| **132** | Stop Flask on old EC2 | `sudo systemctl stop shopnet-api` | Stopped | ☐ |
| **133** | Disable Flask on old EC2 | `sudo systemctl disable shopnet-api` | Disabled | ☐ |
| **134** | Remove admin nginx block | Edit nginx config, remove /admin location | Removed | ☐ |
| **135** | Reload nginx | `sudo systemctl reload nginx` | Reloaded | ☐ |
| **136** | Verify WordPress works | Browse shopnet.domains | Works via API | ☐ |
| **137** | Schedule EC2 downsize | Plan for t3.medium → t3.small | Scheduled | ☐ |
| **138** | Stop old EC2 | AWS Console → Stop | Stopped | ☐ |
| **139** | Change instance type | Instance settings → t3.small | Changed | ☐ |
| **140** | Start old EC2 | AWS Console → Start | Started + verified | ☐ |

---

### 18.13 Files That Need NO Changes

| File | Path | Reason |
|------|------|--------|
| `woocommerce-setup.php` | `/theme/inc/` | Product-agnostic |
| `recently-viewed.php` | `/theme/inc/` | Cookie-based only |
| `freename-reseller-api.php` | `/theme/inc/` | External API |
| `chatbot-widget.php` | `/theme/template-parts/` | UI only |
| `header.php` | `/theme/` | Static template |
| `footer.php` | `/theme/` | Static template |
| `archive-product.php` | `/theme/` | WooCommerce template |

---

### 18.14 Rollback Triggers

**Immediately rollback if:**
1. Connect API returns 500 errors for >1 minute
2. Chatbot fails to load TLD suggestions
3. Category pages show 0 products
4. Admin GUI cannot save changes
5. RDS connection fails from new EC2

**Rollback procedure:**
1. Set `SHOPNET_API_MODE = false` in wp-config.php
2. Clear all transients: `wp transient delete --all`
3. Re-enable sync webhook
4. Verify local data is still valid

---

## 19. UNIVERSAL STORE TEMPLATE ARCHITECTURE

### 19.1 Vision

Build a **reusable store template** that can be configured for any combination of:

| Dimension | Option A | Option B |
|-----------|----------|----------|
| **Product Type** | Physical/Digital Products | Domain Names |
| **Business Model** | Affiliate (send to partner) | Direct (own checkout) |
| **Backend** | Connect API | Custom API |

This creates **6 core configurations**:

| # | Config | Product | Model | Example |
|---|--------|---------|-------|---------|
| 1 | Products + Affiliate | Products | Affiliate links | Bestbird.com |
| 2 | Products + Direct | Products | WooCommerce cart | Standard e-commerce |
| 3 | Domains + Affiliate | TLDs/Domains | Freename/partner | shopnet.domains today |
| 4 | Domains + Direct | TLDs/Domains | WooCommerce cart | Future direct sales |
| 5 | Hybrid + Affiliate | Both | Mixed affiliate | Multi-vertical affiliate |
| 6 | Hybrid + Direct | Both | Full commerce | Full marketplace |

---

### 19.2 Component Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                     UNIVERSAL STORE TEMPLATE                        │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐     │
│  │  DATA LAYER     │  │  DISPLAY LAYER  │  │ COMMERCE LAYER  │     │
│  │  (Required)     │  │  (Required)     │  │ (Optional)      │     │
│  ├─────────────────┤  ├─────────────────┤  ├─────────────────┤     │
│  │ • Connect API   │  │ • Browse/Search │  │ • Cart          │     │
│  │ • module-loader │  │ • Cards/Grid    │  │ • Checkout      │     │
│  │ • Caching       │  │ • Detail Pages  │  │ • Orders        │     │
│  │                 │  │ • Categories    │  │ • Payments      │     │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘     │
│           │                    │                    │               │
│           ▼                    ▼                    ▼               │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    INTEGRATION LAYER                         │   │
│  ├─────────────────────────────────────────────────────────────┤   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │   │
│  │  │  AFFILIATE  │  │   DIRECT    │  │   HYBRID    │          │   │
│  │  │  HANDLER    │  │   HANDLER   │  │   HANDLER   │          │   │
│  │  ├─────────────┤  ├─────────────┤  ├─────────────┤          │   │
│  │  │ Freename    │  │ WooCommerce │  │ Route by    │          │   │
│  │  │ Bestbird    │  │ Stripe      │  │ product     │          │   │
│  │  │ Partner X   │  │ PayPal      │  │ type        │          │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘          │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

### 19.3 Component Definitions

#### A. DATA LAYER (Required)

**Purpose:** Fetch and cache item data from backend API.

| Component | File | Description |
|-----------|------|-------------|
| `module-loader.php` | `theme/inc/module-loader.php` | Central API client |
| `fetch_connect_api()` | In module-loader | HTTP client with caching |
| `get_items()` | Generic method | Returns items (TLDs or Products) |
| `get_categories()` | Generic method | Returns categories |
| `get_item($id)` | Generic method | Single item detail |

**Configuration:**
```php
// wp-config.php
define('STORE_API_URL', 'https://connect.shopnet.network/api/v1');
define('STORE_API_CACHE_TTL', 300);
define('STORE_ITEM_TYPE', 'domains'); // 'domains' | 'products' | 'hybrid'
```

#### B. DISPLAY LAYER (Required)

**Purpose:** Render items to users for browsing and selection.

| Component | Files | Description |
|-----------|-------|-------------|
| Homepage | `front-page.php` | Featured items, categories, search |
| Browse/Archive | `archive.php` | Grid of items with filters |
| Item Card | `template-parts/item-card.php` | Single item display in grid |
| Item Detail | `single-item.php` | Full item page with actions |
| Categories | `template-categories.php` | Category listing |
| Search | `search.php` | Search results |

**Key principle:** Display layer calls Data Layer directly. No MySQL middleman.

```php
// Example: Getting items for display
$items = StoreTemplate_Data::get_items([
    'category' => $current_category,
    'limit' => 24,
    'page' => $paged
]);

foreach ($items as $item) {
    get_template_part('template-parts/item-card', null, ['item' => $item]);
}
```

#### C. COMMERCE LAYER (Optional)

**Purpose:** Handle transactions when selling directly.

| Component | Files | Description |
|-----------|-------|-------------|
| Cart | `woocommerce/cart.php` | Shopping cart |
| Checkout | `woocommerce/checkout.php` | Payment flow |
| Orders | WooCommerce core | Order management |
| Products | Dynamic creation | Created at purchase time |

**When enabled:**
- WooCommerce plugin active
- Products created dynamically when user commits to purchase
- Syncs only commerce-required fields (price, SKU, inventory)

**When disabled:**
- WooCommerce can be deactivated entirely
- No local product storage needed

#### D. INTEGRATION LAYER (Required)

**Purpose:** Route user actions to appropriate handler.

| Handler | When Used | Action |
|---------|-----------|--------|
| **Affiliate** | `STORE_MODEL = 'affiliate'` | Redirect to partner with tracking |
| **Direct** | `STORE_MODEL = 'direct'` | Add to WooCommerce cart |
| **Hybrid** | `STORE_MODEL = 'hybrid'` | Route based on item type |

---

### 19.4 Configuration Matrix

```php
// wp-config.php - Master Configuration

// REQUIRED: Data source
define('STORE_API_URL', 'https://connect.shopnet.network/api/v1');
define('STORE_API_KEY', 'your-api-key');  // If required
define('STORE_API_CACHE_TTL', 300);

// REQUIRED: Item type
define('STORE_ITEM_TYPE', 'domains');  // 'domains' | 'products' | 'hybrid'

// REQUIRED: Business model
define('STORE_MODEL', 'affiliate');  // 'affiliate' | 'direct' | 'hybrid'

// AFFILIATE CONFIG (when STORE_MODEL includes affiliate)
define('STORE_AFFILIATE_PARTNER', 'freename');  // Partner identifier
define('STORE_AFFILIATE_BASE_URL', 'https://freename.io/register/');
define('STORE_AFFILIATE_TRACKING_PARAM', 'ref');
define('STORE_AFFILIATE_ID', 'shopnet');

// DIRECT CONFIG (when STORE_MODEL includes direct)
define('STORE_WOOCOMMERCE_ENABLED', false);  // Enable WooCommerce
define('STORE_DYNAMIC_PRODUCTS', true);  // Create products at purchase time
```

---

### 19.5 Implementation Patterns

#### Pattern 1: Domains + Affiliate (shopnet.domains today)

```
User browses TLDs → Connect API
User enters SLD → "mybrand"
User selects TLD → ".❤️love"
Check availability → Freename API
User clicks Register → Redirect to Freename with "mybrand.❤️love"
```

**Config:**
```php
define('STORE_ITEM_TYPE', 'domains');
define('STORE_MODEL', 'affiliate');
define('STORE_AFFILIATE_PARTNER', 'freename');
```

**Components active:**
- ✅ Data Layer (Connect API)
- ✅ Display Layer (browse TLDs)
- ❌ Commerce Layer (not needed)
- ✅ Affiliate Handler

#### Pattern 2: Products + Affiliate (Bestbird.com)

```
User browses products → Connect API / Product database
User selects product → View details
User clicks Buy → Redirect to partner (Amazon, etc.) with tracking
```

**Config:**
```php
define('STORE_ITEM_TYPE', 'products');
define('STORE_MODEL', 'affiliate');
define('STORE_AFFILIATE_PARTNER', 'amazon');
```

#### Pattern 3: Domains + Direct (Future)

```
User browses TLDs → Connect API
User enters SLD + selects TLD → "mybrand.❤️love"
Check availability → Registry API
User clicks Buy → Add to WooCommerce cart
Checkout → Process payment
Fulfill → Register domain via Registry API
```

**Config:**
```php
define('STORE_ITEM_TYPE', 'domains');
define('STORE_MODEL', 'direct');
define('STORE_WOOCOMMERCE_ENABLED', true);
define('STORE_DYNAMIC_PRODUCTS', true);
```

**Components active:**
- ✅ Data Layer (Connect API for TLD browsing)
- ✅ Display Layer (browse TLDs)
- ✅ Commerce Layer (checkout)
- ✅ Direct Handler

#### Pattern 4: Products + Direct (Standard E-commerce)

```
User browses products → Connect API
User adds to cart → WooCommerce cart
Checkout → Process payment
Fulfill → Ship product
```

**Config:**
```php
define('STORE_ITEM_TYPE', 'products');
define('STORE_MODEL', 'direct');
define('STORE_WOOCOMMERCE_ENABLED', true);
```

#### Pattern 5: Hybrid + Affiliate

```
User browses mixed catalog → Connect API returns domains + products
User selects domain → Freename affiliate
User selects product → Amazon affiliate
```

#### Pattern 6: Hybrid + Direct (Full Marketplace)

```
User browses mixed catalog
Domains → Own registry integration
Products → Own inventory/fulfillment
Unified cart and checkout
```

---

### 19.6 File Structure

```
theme/
├── inc/
│   ├── module-loader.php        # Data Layer - API client
│   ├── store-config.php         # Configuration reader
│   ├── affiliate-handler.php    # Affiliate redirects
│   └── commerce-handler.php     # WooCommerce integration
├── template-parts/
│   ├── item-card.php            # Generic item card
│   ├── item-card-domain.php     # Domain-specific card
│   ├── item-card-product.php    # Product-specific card
│   └── action-button.php        # Buy/Register/Redirect button
├── front-page.php               # Homepage
├── archive.php                  # Browse/grid
├── single-item.php              # Item detail
├── template-categories.php      # Categories
├── search.php                   # Search results
└── woocommerce/                 # Commerce Layer (optional)
    ├── cart.php
    ├── checkout.php
    └── ...
```

---

### 19.7 API Contract

The Data Layer expects Connect API to return consistent structure regardless of item type:

```json
// GET /api/v1/items?type=domains
{
  "data": [
    {
      "id": "xn--love-...",
      "type": "domain",
      "display_name": ".❤️love",
      "unicode": "❤️love",
      "punycode": "xn--love-...",
      "description": "Express love and passion",
      "category_slugs": ["emotions", "relationships"],
      "emoji": "❤️",
      "metadata": {
        "text_root": "love",
        "keywords": ["heart", "romance", "affection"]
      }
    }
  ],
  "pagination": { "page": 1, "pages": 10, "total": 240 }
}

// GET /api/v1/items?type=products
{
  "data": [
    {
      "id": "prod-123",
      "type": "product",
      "display_name": "Wireless Mouse",
      "description": "Ergonomic wireless mouse",
      "category_slugs": ["electronics", "accessories"],
      "price": 29.99,
      "currency": "USD",
      "image_url": "https://...",
      "metadata": {
        "sku": "WM-001",
        "brand": "TechCo"
      }
    }
  ],
  "pagination": { "page": 1, "pages": 5, "total": 100 }
}
```

---

### 19.8 Action Button Logic

The action button is the key integration point:

```php
// template-parts/action-button.php

<?php
$model = defined('STORE_MODEL') ? STORE_MODEL : 'affiliate';
$item = $args['item'];
$item_type = $item['type'] ?? STORE_ITEM_TYPE;

// For domains, we need the full domain (SLD.TLD)
$domain = isset($args['sld']) ? $args['sld'] . '.' . $item['unicode'] : null;
?>

<?php if ($model === 'affiliate' || ($model === 'hybrid' && should_affiliate($item))): ?>
    <?php
    $affiliate_url = build_affiliate_url($item, $domain);
    ?>
    <a href="<?php echo esc_url($affiliate_url); ?>"
       class="ds-btn ds-btn--primary"
       target="_blank"
       rel="noopener"
       data-track="affiliate-click"
       data-item="<?php echo esc_attr($item['id']); ?>">
        <?php echo $item_type === 'domain' ? 'Register at ' . STORE_AFFILIATE_PARTNER : 'Buy at ' . STORE_AFFILIATE_PARTNER; ?>
        <svg><!-- external link icon --></svg>
    </a>

<?php elseif ($model === 'direct' || ($model === 'hybrid' && !should_affiliate($item))): ?>
    <button type="button"
            class="ds-btn ds-btn--primary ds-add-to-cart"
            data-item-id="<?php echo esc_attr($item['id']); ?>"
            data-item-type="<?php echo esc_attr($item_type); ?>"
            <?php if ($domain): ?>data-domain="<?php echo esc_attr($domain); ?>"<?php endif; ?>>
        Add to Cart
    </button>
<?php endif; ?>
```

---

### 19.9 Migration Path for shopnet.domains

**Current state:** Display → MySQL (WooCommerce products) → synced from Connect API

**Target state:** Display → Connect API directly

**Steps:**

1. ✅ module-loader.php already calls Connect API
2. Update display templates to use `DomainStore_Module_Loader::get_tlds()` instead of `wc_get_products()`
3. Update item cards to use API data structure
4. Remove product sync webhook
5. Clear WooCommerce products from MySQL
6. Optionally deactivate WooCommerce entirely

**No WooCommerce needed** because shopnet.domains is Pattern 1 (Domains + Affiliate).

---

### 19.10 Replication Guide

To create a new store from this template:

1. **Clone theme:**
   ```bash
   cp -r theme/ new-store-theme/
   ```

2. **Configure wp-config.php:**
   ```php
   define('STORE_API_URL', 'https://your-api.com/v1');
   define('STORE_ITEM_TYPE', 'products');  // or 'domains' or 'hybrid'
   define('STORE_MODEL', 'direct');  // or 'affiliate' or 'hybrid'
   // ... additional config
   ```

3. **Connect API backend:**
   - Point `STORE_API_URL` to your data source
   - Ensure API returns expected structure (see 19.7)

4. **Customize display:**
   - Update CSS/branding
   - Customize card templates if needed

5. **If direct sales:**
   - Activate WooCommerce
   - Configure payment gateways
   - Set up fulfillment (domain registration API or shipping)

---

### 19.11 Endpoint Configuration System

The shopnet.network console will manage all endpoints through a unified configuration wizard that stores settings and controls site behavior.

---

#### 19.11.1 Add Endpoint GUI Wizard

**Location:** `shopnet.network/console/endpoints/add`

**Step 1: Site Type**
```
┌─────────────────────────────────────────────────────────────┐
│  What type of site is this?                                 │
├─────────────────────────────────────────────────────────────┤
│  ○ Brochure Only      - Single page, no commerce            │
│  ○ Store (Affiliate)  - Browse items, redirect to partner   │
│  ○ Store (Checkout)   - Full e-commerce with own cart       │
│  ○ Other              - Custom configuration                │
└─────────────────────────────────────────────────────────────┘
```

**Step 2: AI Agents**
```
┌─────────────────────────────────────────────────────────────┐
│  Which AI agents should be enabled? (Select all that apply) │
├─────────────────────────────────────────────────────────────┤
│  ☐ Domain.Assist   - Domain name suggestions & search       │
│  ☐ Purchase.Assist - Product recommendations & help         │
│  ☐ Other           - [Specify agent name]                   │
│  ☐ None                                                     │
└─────────────────────────────────────────────────────────────┘
```

**Step 3: Website Platform**
```
┌─────────────────────────────────────────────────────────────┐
│  What platform hosts this site?                             │
├─────────────────────────────────────────────────────────────┤
│  ○ Own/Lambda   → [Goes to Lambda endpoint setup flow]      │
│  ○ WordPress    → [Continue to Step 4]                      │
│  ○ Shopify      → [Continue to Step 4]                      │
│  ○ Other        → [Manual configuration]                    │
└─────────────────────────────────────────────────────────────┘
```

*If Own/Lambda selected: Redirect to existing shopnet.network Lambda brochure site builder.*

**Step 4: Product Type** (if WordPress or Shopify)
```
┌─────────────────────────────────────────────────────────────┐
│  What does this site sell? (Select all that apply)          │
├─────────────────────────────────────────────────────────────┤
│  ☐ Domains       - TLDs and domain names                    │
│  ☐ Products      - Physical or digital products             │
│  ☐ None/Other    - Information only                         │
└─────────────────────────────────────────────────────────────┘
```

**Step 5: Shopping Cart** (if Store type)
```
┌─────────────────────────────────────────────────────────────┐
│  Does this site have its own checkout?                      │
├─────────────────────────────────────────────────────────────┤
│  ○ Yes - Process payments on this site                      │
│      E-commerce Platform:                                   │
│      ○ WooCommerce (WordPress)                              │
│      ○ Shopify                                              │
│                                                             │
│  ○ No - Redirect to partner for checkout (affiliate)        │
└─────────────────────────────────────────────────────────────┘
```

**Step 6: Source Database** (auto-defaulted based on Product Type)
```
┌─────────────────────────────────────────────────────────────┐
│  Where does item data come from? (Select all that apply)    │
├─────────────────────────────────────────────────────────────┤
│  ☑ Connect API: Domains   [Default ON if Domains selected]  │
│  ☐ Connect API: Products  [Default ON if Products selected] │
│  ☐ Partner API: Domains   [e.g., Freename catalog]          │
│  ☐ Partner API: Products  [e.g., Amazon catalog]            │
│  ☐ Local Only             [No external data source]         │
└─────────────────────────────────────────────────────────────┘
```

**Step 7: Destination API** (if Affiliate model)
```
┌─────────────────────────────────────────────────────────────┐
│  Where do purchases complete? (Configure affiliate links)   │
├─────────────────────────────────────────────────────────────┤
│  Domain Registration:                                       │
│  ☑ Freename                                                 │
│      Base URL: https://freename.io/register/                │
│      Affiliate ID: [shopnet_____________]                   │
│                                                             │
│  Product Purchases:                                         │
│  ☐ Amazon                                                   │
│      Associate Tag: [____________________]                  │
│  ☐ Other                                                    │
│      Partner Name: [____________________]                   │
│      Base URL: [____________________]                       │
│      Tracking Param: [____________________]                 │
└─────────────────────────────────────────────────────────────┘
```

---

#### 19.11.2 Endpoint Configuration Data Model

**Stored in:** shopnet.network console database (SQLite or PostgreSQL)

```sql
CREATE TABLE endpoints (
    id UUID PRIMARY KEY,
    domain VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),

    -- Step 1: Site Type
    site_type ENUM('brochure', 'affiliate', 'checkout', 'other') NOT NULL,

    -- Step 2: AI Agents (JSON array)
    ai_agents JSONB DEFAULT '[]',
    -- e.g., ["domain_assist", "purchase_assist"]

    -- Step 3: Platform
    platform ENUM('lambda', 'wordpress', 'shopify', 'other') NOT NULL,

    -- Step 4: Product Types (JSON array)
    product_types JSONB DEFAULT '[]',
    -- e.g., ["domains", "products"]

    -- Step 5: Shopping Cart
    has_checkout BOOLEAN DEFAULT false,
    ecommerce_platform ENUM('woocommerce', 'shopify', null),

    -- Step 6: Source Databases (JSON array)
    data_sources JSONB DEFAULT '[]',
    -- e.g., ["connect_domains", "connect_products", "partner_freename"]

    -- Step 7: Destination APIs (JSON object)
    affiliate_config JSONB DEFAULT '{}',
    -- e.g., {
    --   "domains": {"partner": "freename", "base_url": "...", "affiliate_id": "shopnet"},
    --   "products": {"partner": "amazon", "associate_tag": "..."}
    -- }

    -- Metadata
    status ENUM('active', 'inactive', 'setup') DEFAULT 'setup',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    -- Generated configuration (sent to client plugin)
    client_config JSONB DEFAULT '{}'
);
```

---

#### 19.11.3 Example Configurations

**shopnet.domains (Current)**
```json
{
  "domain": "shopnet.domains",
  "site_type": "affiliate",
  "ai_agents": ["domain_assist"],
  "platform": "wordpress",
  "product_types": ["domains"],
  "has_checkout": false,
  "ecommerce_platform": null,
  "data_sources": ["connect_domains"],
  "affiliate_config": {
    "domains": {
      "partner": "freename",
      "base_url": "https://freename.io/register/",
      "affiliate_id": "shopnet"
    }
  }
}
```

**findyour.com (Future Hybrid)**
```json
{
  "domain": "findyour.com",
  "site_type": "affiliate",
  "ai_agents": ["domain_assist", "purchase_assist"],
  "platform": "wordpress",
  "product_types": ["domains", "products"],
  "has_checkout": false,
  "ecommerce_platform": null,
  "data_sources": ["connect_domains", "connect_products"],
  "affiliate_config": {
    "domains": {
      "partner": "freename",
      "base_url": "https://freename.io/register/",
      "affiliate_id": "findyour"
    },
    "products": {
      "partner": "amazon",
      "associate_tag": "findyour-20"
    }
  }
}
```

**Future Direct Checkout Site**
```json
{
  "domain": "mydomainstore.com",
  "site_type": "checkout",
  "ai_agents": ["domain_assist"],
  "platform": "wordpress",
  "product_types": ["domains"],
  "has_checkout": true,
  "ecommerce_platform": "woocommerce",
  "data_sources": ["connect_domains"],
  "affiliate_config": {}
}
```

---

#### 19.11.4 Shopnet Client Plugin Architecture

A single WordPress plugin manages all endpoint configuration and Connect API integration.

**Plugin Name:** `shopnet-connect`
**Location:** `wp-content/plugins/shopnet-connect/`

```
shopnet-connect/
├── shopnet-connect.php           # Main plugin file
├── includes/
│   ├── class-config.php          # Reads config from console API
│   ├── class-api-client.php      # Connect API client (module-loader.php logic)
│   ├── class-data-layer.php      # Abstract data fetching
│   ├── class-affiliate.php       # Affiliate link builder
│   ├── class-commerce.php        # WooCommerce integration (optional)
│   └── class-agents.php          # AI agent embedding
├── admin/
│   ├── settings-page.php         # WP Admin settings UI
│   └── sync-status.php           # Data sync status panel
└── assets/
    ├── css/
    └── js/
```

**Core Functionality:**

```php
<?php
/**
 * Shopnet Connect Plugin
 *
 * Single plugin that handles:
 * 1. Configuration sync from shopnet.network console
 * 2. Connect API data fetching
 * 3. Affiliate link generation
 * 4. WooCommerce integration (when enabled)
 * 5. AI agent embedding
 */

class Shopnet_Connect {

    private $config;
    private $api_client;

    public function __construct() {
        // Fetch config from console on activation or daily
        $this->config = $this->get_endpoint_config();

        // Initialize API client
        $this->api_client = new Shopnet_API_Client($this->config);

        // Register components based on config
        $this->init_components();
    }

    /**
     * Fetch endpoint configuration from shopnet.network console
     */
    private function get_endpoint_config() {
        $cached = get_transient('shopnet_endpoint_config');
        if ($cached) return $cached;

        $domain = parse_url(home_url(), PHP_URL_HOST);
        $response = wp_remote_get(
            "https://connect.shopnet.network/api/v1/endpoints/config?domain=" . $domain,
            ['headers' => ['X-API-Key' => SHOPNET_API_KEY]]
        );

        if (!is_wp_error($response)) {
            $config = json_decode(wp_remote_retrieve_body($response), true);
            set_transient('shopnet_endpoint_config', $config, DAY_IN_SECONDS);
            return $config;
        }

        return $this->get_fallback_config();
    }

    /**
     * Initialize components based on configuration
     */
    private function init_components() {
        // Always: Data Layer
        add_action('init', [$this, 'register_data_layer']);

        // If has AI agents
        if (!empty($this->config['ai_agents'])) {
            new Shopnet_Agents($this->config['ai_agents']);
        }

        // If affiliate model
        if ($this->config['site_type'] === 'affiliate') {
            new Shopnet_Affiliate($this->config['affiliate_config']);
        }

        // If checkout model with WooCommerce
        if ($this->config['has_checkout'] && $this->config['ecommerce_platform'] === 'woocommerce') {
            new Shopnet_Commerce($this->config, $this->api_client);
        }
    }

    /**
     * Data Layer - provides items to templates
     */
    public function register_data_layer() {
        // Make data available globally
        global $shopnet;
        $shopnet = new Shopnet_Data_Layer($this->api_client, $this->config);
    }
}

// Initialize
new Shopnet_Connect();
```

---

#### 19.11.5 Data Flow - CRITICAL: Per-Item Routing

**Key Insight:** A single site may have BOTH affiliate AND checkout items. The routing decision is per-item, not per-site.

**Item Routing Flag:**
Each item from Connect API includes a `checkout_mode` field:
- `affiliate` - Display only, redirect to partner for purchase
- `checkout` - Sync to WooCommerce, process payment locally
- `both` - Available in both modes (rare)

```
┌─────────────────────────────────────────────────────────────────────┐
│                    CONNECT API RESPONSE                             │
├─────────────────────────────────────────────────────────────────────┤
│  {                                                                  │
│    "id": "xn--love",                                                │
│    "type": "domain",                                                │
│    "display_name": ".❤️love",                                       │
│    "checkout_mode": "affiliate",  ← ROUTING FLAG                    │
│    "affiliate_partner": "freename",                                 │
│    ...                                                              │
│  }                                                                  │
└─────────────────────────────────────────────────────────────────────┘
```

**Data Flow Diagram:**

```
                        Connect API
                             │
                             ▼
                    ┌────────────────┐
                    │ Shopnet Plugin │
                    │  (per-item     │
                    │   routing)     │
                    └───────┬────────┘
                            │
            ┌───────────────┼───────────────┐
            │               │               │
            ▼               ▼               ▼
    checkout_mode=     checkout_mode=   checkout_mode=
      "affiliate"        "checkout"        "both"
            │               │               │
            ▼               ▼               ▼
    ┌───────────┐   ┌───────────────┐  ┌─────────┐
    │ Display   │   │ Sync to MySQL │  │ Both    │
    │ from API  │   │ WooCommerce   │  │ paths   │
    │ only      │   │ products      │  │         │
    └─────┬─────┘   └───────┬───────┘  └────┬────┘
          │                 │               │
          ▼                 ▼               ▼
    ┌───────────┐   ┌───────────────┐  ┌─────────┐
    │ Affiliate │   │ Add to Cart   │  │ User    │
    │ redirect  │   │ → Checkout    │  │ chooses │
    └───────────┘   └───────────────┘  └─────────┘
```

---

#### 19.11.5.1 Mode A: Pure Affiliate Site (shopnet.domains today)

**All items have `checkout_mode: "affiliate"`**

```
Connect API → Plugin fetches → Templates display from API
                                      │
                                      ▼
                              User clicks "Register"
                                      │
                                      ▼
                              Affiliate redirect to Freename
```

- WooCommerce **deactivated** (or never installed)
- No MySQL product storage
- All display from live API data
- **This is shopnet.domains target state**

---

#### 19.11.5.2 Mode B: Pure Checkout Site

**All items have `checkout_mode: "checkout"`**

```
Connect API → Plugin fetches → Sync to WooCommerce MySQL
                                      │
                                      ▼
                              Templates display from MySQL
                                      │
                                      ▼
                              Add to Cart → Checkout → Payment
```

- WooCommerce **required**
- MySQL stores commerce fields (price, SKU, inventory, tax)
- Display from MySQL (WooCommerce handles cart state)

---

#### 19.11.5.3 Mode C: Hybrid Site (Mixed Routing)

**Some items affiliate, some checkout**

Example: A site sells:
- Domains (affiliate → Freename)
- Branded merchandise (checkout → own cart)

```
Connect API returns both types
           │
           ├── Domain items (checkout_mode: "affiliate")
           │        └── Display from API → Affiliate link
           │
           └── Merch items (checkout_mode: "checkout")
                    └── Sync to MySQL → Add to Cart
```

- WooCommerce **required** (for checkout items)
- Plugin routes per-item based on `checkout_mode`
- Same template, different action buttons

---

#### 19.11.5.4 Plugin Routing Logic

```php
class Shopnet_Data_Layer {

    /**
     * Get items with routing metadata
     */
    public function get_items($args = []) {
        $items = $this->api_client->fetch('items', $args);

        foreach ($items as &$item) {
            // Add routing info
            $item->is_affiliate = ($item->checkout_mode === 'affiliate');
            $item->is_checkout = ($item->checkout_mode === 'checkout');
            $item->is_both = ($item->checkout_mode === 'both');

            // If checkout item, ensure synced to WooCommerce
            if ($item->is_checkout && $this->woo_enabled) {
                $item->wc_product_id = $this->ensure_wc_product($item);
            }
        }

        return $items;
    }

    /**
     * Render action button based on item routing
     */
    public function render_action_button($item, $args = []) {
        // For domains, we need the SLD from user input
        $sld = $args['sld'] ?? null;

        if ($item->is_affiliate) {
            $this->render_affiliate_button($item, $sld);
        } elseif ($item->is_checkout) {
            $this->render_cart_button($item);
        } elseif ($item->is_both) {
            // Show both options
            $this->render_affiliate_button($item, $sld);
            $this->render_cart_button($item);
        }
    }

    private function render_affiliate_button($item, $sld = null) {
        $url = $this->build_affiliate_url($item, $sld);
        $partner = $this->get_partner_display_name($item->affiliate_partner);
        ?>
        <a href="<?php echo esc_url($url); ?>"
           target="_blank"
           rel="noopener"
           class="shopnet-btn shopnet-btn--affiliate"
           data-track="affiliate-click"
           data-item-id="<?php echo esc_attr($item->id); ?>">
            <?php echo esc_html("Register at $partner"); ?>
            <svg><!-- external link icon --></svg>
        </a>
        <?php
    }

    private function render_cart_button($item) {
        if (!$item->wc_product_id) return;
        ?>
        <button type="button"
                class="shopnet-btn shopnet-btn--cart add_to_cart_button"
                data-product_id="<?php echo esc_attr($item->wc_product_id); ?>"
                data-quantity="1">
            Add to Cart
        </button>
        <?php
    }
}
```

---

#### 19.11.5.5 WooCommerce Selective Sync

**Only checkout items sync to MySQL. Affiliate items never touch WooCommerce.**

```php
class Shopnet_Commerce {

    /**
     * Sync checkout items to WooCommerce
     * Called on cron or when item accessed
     */
    public function ensure_wc_product($item) {
        // Skip affiliate items
        if ($item->checkout_mode === 'affiliate') {
            return null;
        }

        // Check if already synced
        $existing_id = $this->find_wc_product($item->id);
        if ($existing_id) {
            return $this->maybe_update_product($existing_id, $item);
        }

        // Create new WooCommerce product
        return $this->create_wc_product($item);
    }

    private function create_wc_product($item) {
        $product = new WC_Product_Simple();

        // Only sync commerce-required fields
        $product->set_name($item->display_name);
        $product->set_sku('shopnet_' . $item->id);
        $product->set_regular_price($item->price ?? 0);
        $product->set_manage_stock(false);
        $product->set_status('publish');

        // Store source reference
        $product->update_meta_data('_shopnet_item_id', $item->id);
        $product->update_meta_data('_shopnet_item_type', $item->type);

        $product->save();
        return $product->get_id();
    }
}
```

---

#### 19.11.6 Template Integration

Templates call the global `$shopnet` object instead of direct API calls or WooCommerce queries:

```php
<?php
// In any template file
global $shopnet;

// Get items - plugin handles routing automatically
$items = $shopnet->get_items([
    'type' => 'domains',  // or 'products'
    'category' => 'shopping',
    'limit' => 24
]);

foreach ($items as $item) {
    // Plugin normalizes data structure regardless of source
    ?>
    <div class="item-card">
        <h3><?php echo esc_html($item->display_name); ?></h3>
        <p><?php echo esc_html($item->description); ?></p>

        <?php
        // Action button - plugin handles affiliate vs cart
        $shopnet->render_action_button($item);
        ?>
    </div>
    <?php
}
?>
```

**Action Button Logic (handled by plugin):**
```php
public function render_action_button($item) {
    if ($this->config['site_type'] === 'affiliate') {
        $url = $this->build_affiliate_url($item);
        echo '<a href="' . esc_url($url) . '" target="_blank" class="btn-primary">
                Register at ' . esc_html($this->get_partner_name($item)) . '
              </a>';
    } else {
        // WooCommerce add to cart
        $product_id = $this->get_wc_product_id($item);
        woocommerce_template_loop_add_to_cart();
    }
}
```

---

#### 19.11.7 Implementation Plan

**Phase 1: Console Endpoint Manager (shopnet.network)**
1. Build `endpoints` database table
2. Create "Add Endpoint" wizard UI
3. Create endpoint config API: `GET /api/v1/endpoints/config?domain=X`
4. Manual entry for shopnet.domains as first endpoint

**Phase 2: Shopnet Connect Plugin**
1. Extract module-loader.php logic into plugin class
2. Add config fetching from console API
3. Add affiliate link builder
4. Refactor shopnet.domains theme to use plugin

**Phase 3: Theme Template Refactor**
1. Replace `wc_get_products()` with `$shopnet->get_items()`
2. Replace `get_post_meta()` with `$item->property`
3. Replace hardcoded Freename links with `$shopnet->render_action_button()`
4. Test affiliate flow end-to-end

**Phase 4: WooCommerce Integration (Future)**
1. Add commerce sync class to plugin
2. Selective field sync (price, SKU, inventory only)
3. Cart/checkout integration
4. Test checkout flow end-to-end

**Phase 5: Second Site (findyour.com)**
1. Install WordPress + Shopnet Connect plugin
2. Add endpoint in console with hybrid config
3. Plugin auto-configures based on console settings
4. Customize theme/branding

---

#### 19.11.8 shopnet.domains Migration Path

**Current State:**
- Theme has module-loader.php (API client)
- Templates use `wc_get_products()` and `get_post_meta()`
- WooCommerce products synced from Connect API (unnecessary for affiliate)
- Hardcoded Freename affiliate links in templates

**Target State:**
- Shopnet Connect plugin handles all data + routing
- Templates use `$shopnet->get_items()` and `$shopnet->render_action_button()`
- All TLDs have `checkout_mode: "affiliate"` → display from API only
- WooCommerce deactivated (can reactivate if checkout items added later)
- MySQL products table empty (no sync needed)

**Migration Steps:**

| Step | Action | Files Affected |
|------|--------|----------------|
| 1 | Create `shopnet-connect` plugin skeleton | `wp-content/plugins/shopnet-connect/` |
| 2 | Move `module-loader.php` logic into plugin | `class-api-client.php` |
| 3 | Add `checkout_mode` field to Connect API TLD response | Connect API `/api/v1/tlds` |
| 4 | Build `Shopnet_Data_Layer` class with `get_items()` | `class-data-layer.php` |
| 5 | Build affiliate link builder | `class-affiliate.php` |
| 6 | Update `front-page.php` to use `$shopnet->get_items()` | `theme/front-page.php` |
| 7 | Update `content-product.php` to use `$shopnet` | `theme/woocommerce/content-product.php` |
| 8 | Update `single-product.php` to use `$shopnet` | `theme/woocommerce/single-product.php` |
| 9 | Replace Freename hardcodes with `render_action_button()` | Multiple templates |
| 10 | Test affiliate flow end-to-end | Manual testing |
| 11 | Deactivate WooCommerce plugin | WP Admin |
| 12 | Delete orphaned products from MySQL | `wp post delete` |
| 13 | Remove unused `woocommerce/` template overrides | Theme cleanup |

---

#### 19.11.9 Template Refactor Map

**Files to update in shopnet.domains theme:**

| File | Current | Target |
|------|---------|--------|
| `front-page.php` | `wc_get_products()`, `get_post_meta()` | `$shopnet->get_items(['type' => 'domains'])` |
| `woocommerce/content-product.php` | `get_post_meta($product->get_id(), '_ds_tld')` | `$item->display_name` (passed from loop) |
| `woocommerce/single-product.php` | `get_post_meta()` for TLD data | `$shopnet->get_item($identifier)` |
| `template-categories.php` | `get_terms()` for WooCommerce categories | `$shopnet->get_categories()` |
| `archive-product.php` | WooCommerce product loop | `$shopnet->get_items(['category' => $slug])` |
| `search.php` | `wc_get_products(['s' => $query])` | `$shopnet->get_items(['search' => $query])` |

**Action buttons to update:**

| Location | Current | Target |
|----------|---------|--------|
| Single product page | Hardcoded Freename link | `$shopnet->render_action_button($item, ['sld' => $sld])` |
| Search results | Hardcoded Freename link | `$shopnet->render_action_button($item)` |
| Category archive | Link to product page | Keep as-is (leads to detail page) |

---

### 19.12 Decision Summary

| Component | shopnet.domains Now | shopnet.domains Target |
|-----------|---------------------|------------------------|
| Site Type | Affiliate | Affiliate |
| AI Agents | Domain.Assist | Domain.Assist |
| Platform | WordPress | WordPress |
| Product Types | Domains | Domains |
| Item `checkout_mode` | N/A | All `"affiliate"` |
| Checkout | No (via Freename) | No |
| Data Source | Connect API → MySQL → Display | Connect API → Display (direct) |
| WooCommerce | Installed, syncing products | **Deactivated** |
| Plugin | Theme's module-loader.php | **shopnet-connect plugin** |

**Future flexibility:** If checkout items are ever added, reactivate WooCommerce. Items with `checkout_mode: "checkout"` will auto-sync to MySQL. Affiliate items remain API-only.

---

## Appendices

### A. Glossary

| Term | Definition |
|------|------------|
| **Endpoint** | A branded website/landing page in the network |
| **Gateway** | The central API that routes all requests |
| **Backend** | A service that does actual work (AI, database) |
| **License** | Authentication and authorization credentials |
| **Tenant** | A customer/brand with their own endpoints |
| **Channel** | A category of API endpoints (chat, data, daily) |
| **HMAC** | Hash-based Message Authentication Code |
| **Noisy Neighbor** | A tenant whose usage impacts others |

### B. Related Documents

- [ARCHITECTURE-UNIFIED-API.md](./ARCHITECTURE-UNIFIED-API.md) - Detailed gateway design
- [ASSET-INVENTORY-JAN-16-2026.md](../data.shopnet/docs/ASSET-INVENTORY-JAN-16-2026.md) - Infrastructure inventory
- [README.md](./README.md) - connect.shopnet overview
- [SERVER-SETUP.md](./SERVER-SETUP.md) - Deployment guide

### C. Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-01-16 | Start with single server | Simplest path to working system, migrate later |
| 2026-01-16 | Use HMAC over JWT | Better performance, simpler for system-to-system |
| 2026-01-16 | Keep shopnet.network | Already has endpoint management |
| 2026-01-16 | Include nonce in HMAC | Prevents replay attacks |
| 2026-01-16 | Per-tenant rate limiting | Prevents noisy neighbor problems |
| 2026-01-16 | Add Web3 as Component 7 | Web3 domains require IP-based HTTPS, separate from main gateway |
| 2026-01-16 | Dedicated Web3 EC2 | Blockchain traffic has different patterns, needs direct IPFS/blockchain access |
| **2026-01-17** | **New EC2 for Backend (Connect + Flask + GUI)** | Proper tier separation - remove business logic from endpoint server |
| 2026-01-17 | Domain.Assist & Product.Assist on RDS | Lambda functions connect to RDS; agents share database layer |
| 2026-01-17 | shopnet.domains API-first | Remove local MySQL sync; fetch TLD/Category data from Connect API |
| 2026-01-17 | Keep brochure sites on S3/CloudFront | Static sites stay on current hosting; only admin console moves to EC2 |
| 2026-01-17 | Web3 infrastructure unchanged | Keep existing Web3 servers (3.81.115.9, 50.17.187.45) as-is |
| 2026-01-17 | One document (Deathstar) | All architecture planning in this document only; no side documents |
| **2026-01-18** | **Universal Store Template** | Design reusable template for 6 business model combinations |
| **2026-01-18** | **Endpoint Configuration System** | Console wizard to configure sites: type, agents, platform, checkout, data sources |
| **2026-01-18** | **Shopnet Connect Plugin** | Single WordPress plugin to manage config, API, affiliates, and optional commerce |
| **2026-01-18** | **Per-item checkout_mode routing** | Items flagged as affiliate OR checkout; plugin routes per-item, not per-site |
| **2026-01-18** | **shopnet.domains = first template** | All TLDs `checkout_mode: "affiliate"`, deactivate WooCommerce after migration |
| **2026-01-18** | **Unified Console** | Migrate Lambda admin into new console; one interface for all management |

---

## 20. Lambda Console Migration

### 20.1 Overview

Migrate all admin functionality from the old Lambda-based dashboard (`shopnet.network` on S3/CloudFront) into the new unified console (`shopnet.network` on Connect Server EC2).

**Goal:** One console to rule them all. The "Add Endpoint" wizard triggers Lambda brochure site creation when "Own/Lambda" platform is selected.

### 20.2 Current Architecture

```
OLD ARCHITECTURE (Before Migration)
===================================

┌─────────────────────────────┐     ┌─────────────────────────────┐
│  OLD Lambda Dashboard       │     │  NEW Connect Console        │
│  (S3/CloudFront)            │     │  (EC2 34.234.121.248)       │
├─────────────────────────────┤     ├─────────────────────────────┤
│  • CRUD for 47 sites        │     │  • Network map              │
│  • Route 53 hosted zones    │     │  • Connection monitor       │
│  • ACM SSL certificates     │     │  • Read-only brochure list  │
│  • CloudFront distributions │     │  • Placeholder wizard       │
│  • API Gateway domains      │     │  • Add Endpoint (WIP)       │
│  • Image upload to S3       │     │                             │
│  • AI SEO generation        │     │                             │
└──────────────┬──────────────┘     └─────────────────────────────┘
               │
               ▼
┌─────────────────────────────┐
│  Lambda API Backend         │
│  0q1t3d28ee.execute-api...  │
│  /api/domains CRUD          │
│  /api/domains/{d}/ssl       │
│  /api/domains/{d}/dns       │
│  /api/upload-image          │
└─────────────────────────────┘
```

### 20.3 Target Architecture

```
TARGET ARCHITECTURE (After Migration)
=====================================

┌────────────────────────────────────────────────────────────────┐
│            UNIFIED CONSOLE (shopnet.network)                   │
│                EC2 34.234.121.248                              │
├────────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │ Network Map  │  │  Monitoring  │  │ Brochure Mgmt│         │
│  └──────────────┘  └──────────────┘  └──────┬───────┘         │
│                                             │                  │
│  ┌──────────────────────────────────────────┴───────────────┐ │
│  │              LAMBDA ADMIN MODULE                          │ │
│  │  • Create/Edit/Delete brochure sites                     │ │
│  │  • Route 53 hosted zone creation                         │ │
│  │  • ACM SSL certificate provisioning                      │ │
│  │  • CloudFront distribution management                    │ │
│  │  • API Gateway custom domain setup                       │ │
│  │  • Image upload to S3                                    │ │
│  │  • AI SEO text generation                                │ │
│  └──────────────────────────────────────────────────────────┘ │
│                              │                                 │
│  ┌───────────────────────────┴───────────────────────────┐   │
│  │           ADD ENDPOINT WIZARD                          │   │
│  │  Step 3: Platform = "Own/Lambda" → triggers Lambda flow│   │
│  └────────────────────────────────────────────────────────┘   │
└───────────────────────────────┬────────────────────────────────┘
                                │
                                ▼
               ┌─────────────────────────────┐
               │  Lambda API Backend         │
               │  (Unchanged)                │
               │  0q1t3d28ee.execute-api...  │
               └─────────────────────────────┘
```

### 20.4 Functions to Migrate

| Category | Function | Lines | Purpose |
|----------|----------|-------|---------|
| **Auth** | `handleLogin()` | ~30 | Authenticate, get bearer token |
| **Domain CRUD** | `loadDomains()` | ~20 | Fetch all domains |
| | `configureDomain()` | ~80 | Load domain into edit modal |
| | `saveTabData()` | ~150 | Save UI/Agent/SEO/DNS tab |
| | `handleDeleteDomain()` | ~50 | Delete with confirmation |
| | `handleDuplicateDomain()` | ~50 | Clone domain config |
| **AWS Ops** | `checkAndCreateHostedZone()` | ~150 | Create Route 53 zone |
| | `createSSLCertificate()` | ~200 | Request ACM cert + validation |
| | `getAwsNameservers()` | ~30 | Fetch Route 53 nameservers |
| | `checkSSLCertificate()` | ~30 | Get SSL status |
| **Image** | `handleImageUpload()` | ~100 | Upload to S3 |
| **AI** | `generateAISeoText()` | ~50 | AI-generate SEO content |
| **UI** | `showTab()` | ~20 | Switch config modal tabs |
| | `updateColorBox()` | ~10 | Color picker preview |
| | `toggleChatbotButtons()` | ~15 | Show/hide agent buttons |
| | Progress functions | ~100 | Modal progress indicators |

**Total: ~1,100 lines of JavaScript to port**

### 20.5 Modals to Add

| Modal ID | Purpose | Trigger |
|----------|---------|---------|
| `domainConfigModal` | Full 4-tab domain configuration | Click brochure card |
| `hostedZoneModal` | Route 53 creation progress | New domain creation |
| `getSslModal` | SSL certificate progress | Get SSL button |
| `switchDnsModal` | Nameserver migration guide | Switch DNS button |
| `deleteModal` | Delete confirmation | Delete button |
| `duplicateModal` | Clone domain dialog | Duplicate button |

### 20.6 API Endpoints (Unchanged)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/login` | POST | Authenticate |
| `/domains` | GET | List all |
| `/domains` | POST | Create new |
| `/domains/{d}` | GET | Get config |
| `/domains/{d}` | PUT | Update |
| `/domains/{d}` | DELETE | Delete |
| `/domains/{d}/hosted-zone` | POST | Create Route 53 |
| `/domains/{d}/dns` | GET | DNS info |
| `/domains/{d}/ssl` | POST | Create SSL |
| `/domains/{d}/ssl` | GET | SSL status |
| `/upload-image` | POST | S3 upload |
| `/generate-seo-text` | POST | AI generation |

### 20.7 Implementation Plan

#### Sprint 1: Core Wizard Integration (Priority: HIGH)

| Step | Task | Files |
|------|------|-------|
| 1.1 | Create `static/js/lambda-admin.js` | New file |
| 1.2 | Port `checkAndCreateHostedZone()` | lambda-admin.js |
| 1.3 | Port `createSSLCertificate()` | lambda-admin.js |
| 1.4 | Add Hosted Zone Modal HTML | index.html |
| 1.5 | Add SSL Certificate Modal HTML | index.html |
| 1.6 | Update wizard submit for Lambda flow | console.js |
| 1.7 | Add Lambda auth handling | lambda-admin.js |

#### Sprint 2: Domain Configuration Modal (Priority: HIGH)

| Step | Task | Files |
|------|------|-------|
| 2.1 | Create domain config modal with 4 tabs | index.html |
| 2.2 | Port UI tab fields and handlers | lambda-admin.js |
| 2.3 | Port Agent Config tab | lambda-admin.js |
| 2.4 | Port SEO/GEO tab | lambda-admin.js |
| 2.5 | Port DNS & Cert tab with status | lambda-admin.js |
| 2.6 | Port image upload to S3 | lambda-admin.js |
| 2.7 | Add Quill.js for privacy policy | index.html |

#### Sprint 3: Complete CRUD (Priority: MEDIUM)

| Step | Task | Files |
|------|------|-------|
| 3.1 | Add Delete confirmation modal | index.html |
| 3.2 | Add Duplicate domain modal | index.html |
| 3.3 | Port delete/duplicate handlers | lambda-admin.js |
| 3.4 | Add "Add New Site" button to Brochure panel | index.html |
| 3.5 | Make brochure cards clickable for edit | console.js |
| 3.6 | Add Switch DNS modal | index.html |

#### Sprint 4: Polish & Test (Priority: MEDIUM)

| Step | Task |
|------|------|
| 4.1 | CSS styling for all modals |
| 4.2 | Error handling and edge cases |
| 4.3 | Test create → edit → delete flow |
| 4.4 | Test Route 53 hosted zone creation |
| 4.5 | Test SSL certificate provisioning |
| 4.6 | Deploy to production |

### 20.8 Files Inventory

**New Files:**
```
static/js/lambda-admin.js    # All ported Lambda admin functions
static/css/lambda-admin.css  # Modal and form styles
```

**Modified Files:**
```
static/index.html            # Add modals, update Brochure panel
static/js/console.js         # Import lambda-admin, wizard integration
static/css/console.css       # Additional styles
```

**External Dependencies:**
```
Quill.js (CDN)              # Rich text editor for privacy policy
```

### 20.9 Wizard Flow Update

When user reaches Step 3 (Platform) and selects "Own/Lambda":

```
┌─────────────────────────────────────────────────────────────────┐
│                    ADD ENDPOINT WIZARD                          │
├─────────────────────────────────────────────────────────────────┤
│  Step 1: Site Type     → Brochure Only / Store (Affiliate/etc) │
│  Step 2: AI Agents     → Domain.Assist / Product.Assist / None │
│  Step 3: Platform      → [Own/Lambda] / WordPress / Shopify    │
│           ↓                                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  LAMBDA SELECTED → Show simplified remaining steps:     │   │
│  │                                                         │   │
│  │  Step 4: Domain Name    [_________________.com]        │   │
│  │  Step 5: Display Name   [_________________ ]           │   │
│  │  Step 6: Agent Settings [Agent type dropdown]          │   │
│  │  Step 7: Submit → CREATE LAMBDA BROCHURE SITE          │   │
│  │                                                         │   │
│  │  On Submit:                                             │   │
│  │  1. Create domain record in Lambda DB                   │   │
│  │  2. Show Hosted Zone Modal → Create Route 53           │   │
│  │  3. Show SSL Modal → Create ACM certificate            │   │
│  │  4. Redirect to Brochure Sites panel                   │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### 20.10 Success Criteria

- [ ] All 47 existing Lambda brochure sites manageable from new console
- [ ] New Lambda sites can be created via wizard
- [ ] Full configuration editing works (all 4 tabs)
- [ ] Route 53, ACM, CloudFront operations work
- [ ] No need to access old dashboard
- [ ] Old CloudFront dashboard can be decommissioned

### 20.11 Rollback Plan

1. Old dashboard remains on CloudFront (don't delete until verified)
2. Can revert shopnet.network DNS if issues
3. Lambda API unchanged - works with either frontend

---

**Document Version:** 3.8
**Document Name:** SHOPNET-DEATHSTAR.md
**Created:** January 16, 2026
**Updated:** January 20, 2026 (shopnet.domains v2.0.82 - Domain Search module fixes)
**Author:** Claude (AI Assistant) + Tim
**Location:** /Users/tim001/VSCode/connect.shopnet/SHOPNET-DEATHSTAR.md

---

*This is the master architectural blueprint for the Shopnet platform. All implementation decisions should reference this document. When in doubt, start here.*
