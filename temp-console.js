/**
 * shopnet.network - unified management console
 */

const DATA_API_URL = 'https://data.shopnet.domains/api';
const CONNECT_API_URL = 'https://connect.shopnet.network';

// Display label overrides (maps API labels to GUI labels)
const SECTION_LABEL_MAP = {
    'Product Web Stores': 'Product Stores',
    'Product + Domain Portals': 'Portal Sites',
    'Smart Connector API': 'connect.shopnet API',
    'Databases': 'Files & Data Sources',
    'Network Hubs': 'Network Nodes',
    'Web3 Hub': 'Network Nodes'
};

function getDisplayLabel(apiLabel) {
    return SECTION_LABEL_MAP[apiLabel] || apiLabel;
}

// EST Timezone Helpers - All times displayed in Eastern Time
const EST_TIMEZONE = 'America/New_York';

function toEST(date) {
    return new Date(date).toLocaleString('en-US', { timeZone: EST_TIMEZONE });
}

function toESTTime(date) {
    return new Date(date).toLocaleTimeString('en-US', { timeZone: EST_TIMEZONE, hour: '2-digit', minute: '2-digit' });
}

function toESTDate(date) {
    return new Date(date).toLocaleDateString('en-US', { timeZone: EST_TIMEZONE });
}

function toESTDateTime(date) {
    return new Date(date).toLocaleString('en-US', { timeZone: EST_TIMEZONE, month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

// Global map to store site cards by site_uid for click lookups
window.siteCardsMap = {};

// Current page's card site_uids (for wizard filtering)
window.currentPageCardUids = [];

// Show site card details modal by looking up site_uid
function showSiteCardDetails(siteUid) {
    console.log('showSiteCardDetails called with:', siteUid);
    console.log('siteCardsMap keys:', Object.keys(window.siteCardsMap));
    const card = window.siteCardsMap[siteUid];
    if (card) {
        console.log('Card found, opening modal');
        openSiteCardDetailsModal(card);
    } else {
        console.error('Card not found in siteCardsMap:', siteUid);
        // Fallback: try to fetch from taxonomy API
        fetch('/api/brochure/taxonomy')
            .then(r => r.json())
            .then(data => {
                if (data.success && data.endpoints) {
                    const endpoint = data.endpoints.find(e => e.site_uid === siteUid);
                    if (endpoint) {
                        console.log('Found endpoint via API fallback');
                        openSiteCardDetailsModal(endpoint);
                    } else {
                        alert('Endpoint not found: ' + siteUid);
                    }
                }
            })
            .catch(err => console.error('Fallback fetch failed:', err));
    }
}
window.showSiteCardDetails = showSiteCardDetails;

// ===== NAV SECTION TOGGLE =====
function toggleNavSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.toggle('collapsed');
    }
}

function toggleAllNavSections() {
    const sections = document.querySelectorAll('.nav-section');
    // Check if any non-Network section is collapsed (meaning we're in default or partial state)
    const otherSections = document.querySelectorAll('.nav-section:not(#nav-network)');
    const anyCollapsed = Array.from(otherSections).some(section => section.classList.contains('collapsed'));

    if (anyCollapsed) {
        // Expand all sections
        sections.forEach(section => section.classList.remove('collapsed'));
    } else {
        // Return to default: Network open, others collapsed
        sections.forEach(section => {
            if (section.id === 'nav-network') {
                section.classList.remove('collapsed');
            } else {
                section.classList.add('collapsed');
            }
        });
    }
}

let currentUser = null;
let apiKey = null;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    const storedUser = sessionStorage.getItem('console_user');
    const storedApiKey = sessionStorage.getItem('console_api_key');

    if (storedUser && storedApiKey) {
        currentUser = JSON.parse(storedUser);
        apiKey = storedApiKey;
        showApp();
    }
});

// ===== AUTHENTICATION =====
async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const btn = document.getElementById('loginBtn');
    const errorDiv = document.getElementById('loginError');

    btn.disabled = true;
    btn.textContent = 'Signing in...';
    errorDiv.style.display = 'none';

    try {
        // Use connect.shopnet console authentication endpoint
        // This is SEPARATE from data.shopnet.domains authentication
        const response = await fetch(`${CONNECT_API_URL}/api/v1/console/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success && data.api_key) {
            currentUser = { email: data.email, role: data.role };
            apiKey = data.api_key;

            sessionStorage.setItem('console_user', JSON.stringify(currentUser));
            sessionStorage.setItem('console_api_key', apiKey);
            sessionStorage.setItem('console_user_email', data.email);

            // Set data.shopnet API key directly - no separate login needed
            // This API key is for internal console access to RDS manager
            const DATA_API_KEY = 'snd_5c5259c18b43b384cc434752411d622eae71b28d0765c4d6';
            sessionStorage.setItem('data_api_key', DATA_API_KEY);
            sessionStorage.setItem('shopnet_api_key', DATA_API_KEY);
            sessionStorage.setItem('shopnet_user_email', 'admin@data.shopnet');
            sessionStorage.setItem('shopnet_session', 'integrated');
            console.log('Data API key set for RDS manager access');

            showApp();
        } else {
            throw new Error(data.error || 'Login failed');
        }
    } catch (error) {
        errorDiv.textContent = error.message;
        errorDiv.style.display = 'block';
    } finally {
        btn.disabled = false;
        btn.textContent = 'Sign In';
    }
}

function handleLogout() {
    sessionStorage.removeItem('console_user');
    sessionStorage.removeItem('console_api_key');
    sessionStorage.removeItem('console_user_email');
    // Also clear data.shopnet API keys
    sessionStorage.removeItem('data_api_key');
    sessionStorage.removeItem('shopnet_api_key');
    sessionStorage.removeItem('shopnet_user_email');
    sessionStorage.removeItem('shopnet_session');
    currentUser = null;
    apiKey = null;

    document.getElementById('loginPage').classList.add('login-page');
    document.getElementById('loginScreen').style.display = 'block';
    document.getElementById('appContainer').style.display = 'none';
}

function showApp() {
    document.getElementById('loginPage').classList.remove('login-page');
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('appContainer').style.display = 'flex';

    if (currentUser) {
        document.getElementById('userEmail').textContent = currentUser.email;
        document.getElementById('userName').textContent = currentUser.email.split('@')[0];
        document.getElementById('userAvatar').textContent = currentUser.email.charAt(0).toUpperCase();
    }

    const apiKeyInput = document.getElementById('apiKeyInput');
    if (apiKey && apiKeyInput) {
        apiKeyInput.value = apiKey;
    }

    // Auto-load network map on login (it's the home page)
    startNetworkMapRefresh();
}

// ===== PANEL NAVIGATION =====
function showPanel(panelId) {
    // Hide all panels
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));

    // Show selected panel
    const panel = document.getElementById(`panel-${panelId}`);
    if (panel) {
        panel.classList.add('active');
    }

    // Update nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.panel === panelId) {
            item.classList.add('active');
        }
    });

    // Refresh domain cloud when home panel is shown
    if (panelId === 'home' && typeof refreshDomainCloud === 'function') {
        setTimeout(refreshDomainCloud, 100);
    }

    // Initialize data.shopnet panels (functions from data-admin.js)
    if (panelId === 'dashboard' && typeof refreshDashboard === 'function') {
        refreshDashboard();
    }
    if (panelId === 'tlds' && typeof loadTlds === 'function') {
        loadTlds();
    }
    if (panelId === 'categories') {
        if (typeof loadCategoriesOverview === 'function') loadCategoriesOverview();
        if (typeof loadCategories === 'function') loadCategories();
    }

    // Load Endpoint Registry (Taxonomy RDS) when panel is shown
    if (panelId === 'endpoint-registry' && typeof loadEndpointRegistry === 'function') {
        loadEndpointRegistry();
        if (typeof loadPulseConfig === 'function') loadPulseConfig();
    }

    // Load Live Status (JSON Real-time) when panel is shown
    if (panelId === 'live-status' && typeof loadLiveStatus === 'function') {
        loadLiveStatus();
        if (typeof loadPulseConfig === 'function') loadPulseConfig();
    }

    // Load Network Nodes when panel is shown
    if (panelId === 'network-nodes' && typeof loadNetworkNodes === 'function') {
        loadNetworkNodes();
    }

    // Load Infrastructure data when panel is shown
    if (panelId === 'servers') {
        if (typeof loadCriticalInfrastructure === 'function') {
            loadCriticalInfrastructure().then(() => {
                if (typeof refreshInfrastructureStatus === 'function') refreshInfrastructureStatus();
            });
        }
        if (typeof loadRDSSection === 'function') {
            loadRDSSection();
        }
        if (typeof loadAWSInventoryTables === 'function') {
            loadAWSInventoryTables();
        }
    }
}

// ===== SETTINGS =====
function saveApiKey() {
    const newKey = document.getElementById('apiKeyInput').value;
    if (newKey) {
        apiKey = newKey;
        sessionStorage.setItem('console_api_key', apiKey);
        alert('API Key saved');
    }
}

async function checkApiHealth() {
    const dataStatus = document.getElementById('dataApiStatus');
    const connectStatus = document.getElementById('connectApiStatus');

    // Check Data API
    try {
        const response = await fetch(`${DATA_API_URL}/health`);
        const data = await response.json();
        dataStatus.textContent = data.database === 'healthy' ? 'Healthy' : 'Unhealthy';
        dataStatus.className = data.database === 'healthy' ? 'badge badge-success' : 'badge badge-error';
    } catch (error) {
        dataStatus.textContent = 'Error';
        dataStatus.className = 'badge badge-error';
    }

    // Check Connect API
    try {
        const response = await fetch(`${CONNECT_API_URL}/health`);
        const data = await response.json();
        const isHealthy = data.status === 'ok' || data.status === 'healthy';
        connectStatus.textContent = isHealthy ? 'Healthy' : 'Unhealthy';
        connectStatus.className = isHealthy ? 'badge badge-success' : 'badge badge-error';
    } catch (error) {
        connectStatus.textContent = 'Error';
        connectStatus.className = 'badge badge-error';
    }
}

// ===== NETWORK MAP =====
let networkData = null;
let networkRefreshInterval = null;

async function refreshNetworkMap() {
    try {
        const response = await fetch(`${CONNECT_API_URL}/api/v1/network/status`);
        networkData = await response.json();

        updateNetworkMapVisual();
        updateNetworkSummary();
        updateNetworkDataTable();
        updateEndpointsTable(); // Update the endpoints table
        updateStatusDots(); // Update nav and card status dots

        // Update timestamp
        const ts = new Date(networkData.timestamp);
        const mapTimestamp = document.getElementById('map-timestamp');
        if (mapTimestamp) mapTimestamp.textContent = toESTTime(ts);

        // Update overall status dot
        const overallStatus = getOverallStatus(networkData.summary);
        const statusDot = document.getElementById('map-overall-status');
        if (statusDot) statusDot.className = `status-dot status-dot-lg ${overallStatus}`;

    } catch (error) {
        console.error('Failed to load network status:', error);
    }
}

function getOverallStatus(summary) {
    if (summary.red > 0) return 'red';
    if (summary.orange > 0) return 'orange';
    if (summary.grey > summary.green) return 'grey';
    return 'green';
}

// Calculate section status based on components
// Priority: red > green > orange > grey > wip
// Card colors: grey=planned, orange=under construction, red=error, green=operational
function getSectionStatus(section) {
    if (!section || !section.components) return 'wip';

    const components = Object.values(section.components);
    if (components.length === 0) return 'wip';

    // If any red (error), section is red
    const hasRed = components.some(c => c.status === 'red');
    if (hasRed) return 'red';

    // If any green (operational), section is green
    const hasGreen = components.some(c => c.status === 'green');
    if (hasGreen) return 'green';

    // If any orange (under construction), section is orange
    const hasOrange = components.some(c => c.status === 'orange');
    if (hasOrange) return 'orange';

    // All components are grey (planned)
    return 'grey';
}

function updateNetworkDataTable() {
    if (!networkData || !networkData.sections) return;

    const tbody = document.getElementById('network-data-body');
    if (!tbody) return;

    let html = '';

    for (const [sectionId, section] of Object.entries(networkData.sections)) {
        // Section row - use calculated status
        const sectionStatus = getSectionStatus(section);
        html += `<tr style="background: var(--bg-tertiary);">
            <td><span class="status-dot ${sectionStatus === 'wip' ? 'grey' : sectionStatus}"></span></td>
            <td><strong>${getDisplayLabel(section.label)}</strong></td>
            <td>-</td>
            <td>Section</td>
            <td>${section.url ? `<a href="${section.url}" target="_blank">${section.url}</a>` : '-'}</td>
        </tr>`;

        // Component rows
        if (section.components) {
            for (const [compId, comp] of Object.entries(section.components)) {
                html += `<tr>
                    <td><span class="status-dot ${comp.status}"></span></td>
                    <td style="padding-left: 1.5rem;">${sectionId}</td>
                    <td>${comp.label}</td>
                    <td>${comp.type || 'component'}</td>
                    <td>${comp.url ? `<a href="${comp.url}" target="_blank">${comp.url}</a>` : '-'}</td>
                </tr>`;
            }
        }

        // Connector rows for connect.shopnet
        if (section.connectors) {
            for (const [connId, conn] of Object.entries(section.connectors)) {
                html += `<tr>
                    <td><span class="status-dot ${conn.status}"></span></td>
                    <td style="padding-left: 1.5rem;">${sectionId}</td>
                    <td>${connId} → ${conn.target}</td>
                    <td>connector</td>
                    <td>-</td>
                </tr>`;
            }
        }
    }

    tbody.innerHTML = html;
}

function updateNetworkSummary() {
    if (!networkData || !networkData.summary) return;

    const elements = {
        green: document.getElementById('summary-green'),
        orange: document.getElementById('summary-orange'),
        red: document.getElementById('summary-red'),
        grey: document.getElementById('summary-grey')
    };

    if (elements.green) elements.green.textContent = networkData.summary.green || 0;
    if (elements.orange) elements.orange.textContent = networkData.summary.orange || 0;
    if (elements.red) elements.red.textContent = networkData.summary.red || 0;
    if (elements.grey) elements.grey.textContent = networkData.summary.grey || 0;
}

// Update status dots on nav items and cards from network data
function updateStatusDots() {
    if (!networkData || !networkData.sections) return;

    const sections = networkData.sections;

    // Mapping of nav IDs to section IDs using getSectionStatus
    const navMapping = {
        'nav-status-network': getOverallStatus(networkData.summary), // Overall network status
        'nav-status-domains': getSectionStatus(sections['domains']),
        'nav-status-products': getSectionStatus(sections['products']),
        'nav-status-brochure-lambda': getSectionStatus(sections['brochure']),  // Lambda brochure sites
        'nav-status-brochure-radius': getSectionStatus(sections['brochure']),  // Radius brochure sites (same section for now)
        'nav-status-portals': getSectionStatus(sections['portals']),
        'nav-status-web3': getSectionStatus(sections['web3-sites']),
        'nav-status-databases': getSectionStatus(sections['data.shopnet']),
        'nav-status-agents': getSectionStatus(sections['assist.shopnet']),
        'nav-status-api': getSectionStatus(sections['connect.shopnet']),
        'nav-status-monitor': getSectionStatus(sections['connect.shopnet']),
        'nav-status-console': getSectionStatus(sections['shopnet.network'])
    };

    // Update nav status dots (handle 'wip' status specially)
    for (const [navId, status] of Object.entries(navMapping)) {
        const dot = document.getElementById(navId);
        if (dot) {
            if (status === 'wip') {
                // Replace dot with WIP badge if not already
                if (!dot.classList.contains('wip-badge')) {
                    dot.className = 'wip-badge';
                    dot.textContent = 'WIP';
                }
            } else {
                // Normal status dot
                dot.className = `nav-status-dot ${status}`;
                dot.textContent = '';
            }
        }
    }

    // Mapping of card IDs to component statuses
    const cardMapping = {
        // Domain stores
        'card-status-shopnet-domains': sections['domains']?.components?.['shopnet-domains']?.status || 'grey',
        'card-status-alien-domains': sections['domains']?.components?.['alien-domains']?.status || 'grey',
        'card-status-lasercat-domains': sections['domains']?.components?.['lasercat-domains']?.status || 'grey',
        // Product stores
        'card-status-bestbird': sections['products']?.components?.['bestbird']?.status || 'grey',
        'card-status-best-gifts': sections['products']?.components?.['best-gifts']?.status || 'grey',
        'card-status-toysforpets': sections['products']?.components?.['toysforpets']?.status || 'grey',
        // Brochure (Lambda and Radius)
        'card-status-brochure-lambda': sections['brochure']?.components?.['lambda']?.status || 'grey',
        'card-status-brochure-radius': sections['brochure']?.components?.['radius']?.status || 'grey',
        // Files & Data Sources
        'card-status-domains-db': sections['data.shopnet']?.components?.['domains']?.status || 'grey',
        'card-status-products-db': sections['data.shopnet']?.components?.['products']?.status || 'grey',
        'card-status-s3-filesvr': sections['data.shopnet']?.components?.['s3-filesvr']?.status || 'grey',
        // AI Agents
        'card-status-product-assist': sections['assist.shopnet']?.components?.['product-assist']?.status || 'grey',
        'card-status-domain-assist': sections['assist.shopnet']?.components?.['domain-assist']?.status || 'grey',
        'card-status-content-assist': sections['assist.shopnet']?.components?.['content-assist']?.status || 'grey',
        'card-status-kpi-assist': sections['assist.shopnet']?.components?.['kpi-assist']?.status || 'grey',
        'card-status-site-assist': sections['assist.shopnet']?.components?.['site-assist']?.status || 'grey',
        // API & Keys
        'card-status-connect-api': sections['connect.shopnet']?.status || 'grey',
        'card-status-api-keys': sections['shopnet.network']?.components?.['licenses']?.status || 'grey',
        'card-status-license-manager': sections['shopnet.network']?.components?.['licenses']?.status || 'grey'
    };

    // Update card status dots
    for (const [cardId, status] of Object.entries(cardMapping)) {
        const dot = document.getElementById(cardId);
        if (dot) {
            dot.className = `card-status-dot ${status}`;
        }
    }
}

// Define section order for the endpoints table (matching GUI structure)
const SECTION_ORDER = [
    'shopnet.network',
    'connect.shopnet',
    'data.shopnet',
    'assist.shopnet',
    'domains',
    'products',
    'portals',
    'brochure',
    'web3-gateway',
    'web3-sites',
    'web3-hub',
    'digital-land'
];

function updateEndpointsTable() {
    if (!networkData || !networkData.sections) return;

    const tbody = document.getElementById('endpoints-table-body');
    const countEl = document.getElementById('endpoints-count');
    if (!tbody) return;

    let html = '';
    let totalEndpoints = 0;

    // Sort sections by defined order
    const sortedSections = SECTION_ORDER
        .filter(id => networkData.sections[id])
        .map(id => [id, networkData.sections[id]]);

    for (const [sectionId, section] of sortedSections) {
        if (!section.components) continue;

        // Section header row
        html += `<tr class="section-header">
            <td colspan="5">${getDisplayLabel(section.label)}</td>
        </tr>`;

        // Component rows
        for (const [compId, comp] of Object.entries(section.components)) {
            totalEndpoints++;
            const ip = comp.ip || '-';
            const instance = comp.instance || '-';
            const instanceClass = getInstanceClass(instance);
            const url = comp.url;
            const label = comp.label;

            html += `<tr>
                <td><span class="status-dot ${comp.status}"></span></td>
                <td class="endpoint-name">${url ? `<a href="${url}" target="_blank" class="endpoint-url">${label}</a>` : label}</td>
                <td class="ip-address">${ip}</td>
                <td><span class="instance-badge ${instanceClass}">${instance}</span></td>
                <td>${sectionId}</td>
            </tr>`;
        }
    }

    tbody.innerHTML = html;
    if (countEl) countEl.textContent = `${totalEndpoints} endpoints`;
}

function getInstanceClass(instance) {
    if (!instance || instance === '-') return 'default';
    const lower = instance.toLowerCase();
    if (lower.includes('ec2')) return 'ec2';
    if (lower.includes('lightsail')) return 'lightsail';
    if (lower.includes('lambda')) return 'lambda';
    if (lower.includes('rds')) return 'rds';
    if (lower.includes('s3')) return 's3';
    if (lower.includes('shopify')) return 'shopify';
    if (lower.includes('partner')) return 'partner';
    if (lower.includes('cloudfront')) return 's3';
    return 'default';
}

function updateNetworkMapVisual() {
    if (!networkData || !networkData.sections) return;

    const svg = document.getElementById('network-svg');
    const sections = networkData.sections;

    // Node positions (x, y, width, height)
    const positions = {
        'shopnet.network': { x: 345, y: 80, w: 240, h: 50 },
        'data.shopnet': { x: 10, y: 80, w: 220, h: 95 },
        'assist.shopnet': { x: 10, y: 198, w: 220, h: 105 },
        'web3-hub': { x: 10, y: 326, w: 220, h: 100 },
        'connect.shopnet': { x: 345, y: 250, w: 240, h: 100 },
        'web3-gateway': { x: 10, y: 450, w: 220, h: 70 },
        'web3-sites': { x: 345, y: 450, w: 240, h: 70 },
        'products': { x: 700, y: 80, w: 220, h: 90 },
        'domains': { x: 700, y: 190, w: 220, h: 80 },
        'portals': { x: 700, y: 290, w: 220, h: 70 },
        'brochure-lambda': { x: 700, y: 380, w: 220, h: 50 },
        'brochure-radius': { x: 700, y: 450, w: 220, h: 70 }
    };

    let svgContent = '';

    // Draw connections first (so they appear behind nodes)
    const connectPos = positions['connect.shopnet'];
    const hubCx = connectPos.x + connectPos.w / 2;
    const hubCy = connectPos.y + connectPos.h / 2;

    // Helper to draw connection line
    function drawConnection(fromId, toId, status) {
        const from = positions[fromId];
        const to = positions[toId];
        if (!from || !to) return '';

        let x1, y1, x2, y2;

        // From connect hub to other nodes
        if (fromId === 'connect.shopnet') {
            x1 = hubCx;
            y1 = hubCy;

            // Determine connection point on target
            if (to.x < connectPos.x) { // Left side
                x2 = to.x + to.w;
                y2 = to.y + to.h / 2;
            } else if (to.x > connectPos.x + connectPos.w) { // Right side
                x2 = to.x;
                y2 = to.y + to.h / 2;
            } else if (to.y < connectPos.y) { // Top
                x2 = to.x + to.w / 2;
                y2 = to.y + to.h;
            } else { // Bottom
                x2 = to.x + to.w / 2;
                y2 = to.y;
            }
        } else {
            x1 = from.x + from.w / 2;
            y1 = from.y + from.h / 2;
            x2 = hubCx;
            y2 = hubCy;
        }

        const activeClass = status === 'green' ? ' active' : '';
        return `<line class="map-connection ${status}${activeClass}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/>`;
    }

    // Draw connections from connectors data
    if (sections['connect.shopnet'] && sections['connect.shopnet'].connectors) {
        const conns = sections['connect.shopnet'].connectors;

        // Map connector targets to position keys
        const targetMap = {
            'data.shopnet': 'data.shopnet',
            'assist.shopnet': 'assist.shopnet',
            'web3-hub': 'web3-hub',
            'products': 'products',
            'domains': 'domains',
            'portals': 'portals',
            'brochure': 'brochure-lambda',
            'brochure-lambda': 'brochure-lambda',
            'brochure-radius': 'brochure-radius',
            'web3-gateway': 'web3-gateway',
            'web3-sites': 'web3-sites',
            'shopnet.network': 'shopnet.network'
        };

        for (const [connId, conn] of Object.entries(conns)) {
            const targetKey = targetMap[conn.target];
            if (targetKey) {
                svgContent += drawConnection('connect.shopnet', targetKey, conn.status);
            }
        }
    }

    // Ensure connector to brochure-radius (persistent sites via Radius)
    // Draw if not already present from API data
    const hasRadiusConnector = sections['connect.shopnet']?.connectors &&
        Object.values(sections['connect.shopnet'].connectors).some(c => c.target === 'brochure-radius');
    if (!hasRadiusConnector && positions['brochure-radius']) {
        svgContent += drawConnection('connect.shopnet', 'brochure-radius', 'orange');
    }

    // Ensure connector to portals (Portal Sites)
    // Draw if not already present from API data
    const hasPortalsConnector = sections['connect.shopnet']?.connectors &&
        Object.values(sections['connect.shopnet'].connectors).some(c => c.target === 'portals');
    if (!hasPortalsConnector && positions['portals']) {
        svgContent += drawConnection('connect.shopnet', 'portals', 'orange');
    }

    // Draw nodes
    function drawNode(id, section, pos) {
        // Use getSectionStatus for calculated status based on components
        // Special case: shopnet.network is always green (map is operational)
        const calculatedStatus = (id === 'shopnet.network') ? 'green' : getSectionStatus(section);
        const statusColor = {
            'green': '#22c55e',
            'orange': '#f59e0b',
            'red': '#ef4444',
            'grey': '#9ca3af',
            'wip': '#9ca3af'
        }[calculatedStatus] || '#9ca3af';

        let componentsHtml = '';
        if (section.components) {
            let yOffset = 35;
            const seenLabels = new Set(); // Track labels to avoid duplicates
            for (const [compId, comp] of Object.entries(section.components)) {
                // Skip duplicate labels
                if (seenLabels.has(comp.label)) continue;
                seenLabels.add(comp.label);

                const compColor = {
                    'green': '#22c55e',
                    'orange': '#f59e0b',
                    'red': '#ef4444',
                    'grey': '#9ca3af'
                }[comp.status] || '#9ca3af';

                componentsHtml += `
                    <circle cx="${pos.x + 12}" cy="${pos.y + yOffset}" r="4" fill="${compColor}"/>
                    <text x="${pos.x + 20}" y="${pos.y + yOffset + 3}" class="map-node-sublabel">${comp.label}</text>
                `;
                yOffset += 14;
                if (yOffset > pos.h - 10) break; // Don't overflow
            }
        }

        const isHub = id === 'connect.shopnet';
        const boxClass = isHub ? 'map-hub' : 'map-node-box';

        return `
            <g class="map-node" onclick="handleMapNodeClick('${id}')" data-section="${id}">
                <rect class="${boxClass}" x="${pos.x}" y="${pos.y}" width="${pos.w}" height="${pos.h}"/>
                <circle cx="${pos.x + pos.w - 12}" cy="${pos.y + 12}" r="5" fill="${statusColor}"/>
                <text x="${pos.x + pos.w / 2}" y="${pos.y + 18}" class="map-node-label" text-anchor="middle">${getDisplayLabel(section.label)}</text>
                ${componentsHtml}
            </g>
        `;
    }

    // Draw all nodes
    for (const [sectionId, section] of Object.entries(sections)) {
        // Skip digital-land, old brochure (we split it below), and web3-gateway (synthetic below)
        if (sectionId === 'digital-land' || sectionId === 'brochure' || sectionId === 'web3-gateway') continue;

        const pos = positions[sectionId];
        if (pos) {
            svgContent += drawNode(sectionId, section, pos);
        }
    }

    // Draw split brochure nodes (synthetic sections from 'brochure')
    const brochureSection = sections['brochure'];
    if (brochureSection) {
        // Brochure Sites - OD (On Demand / Lambda)
        const lambdaPos = positions['brochure-lambda'];
        if (lambdaPos) {
            const lambdaSection = {
                label: 'Brochure Sites - OD',
                components: brochureSection.components ?
                    Object.fromEntries(Object.entries(brochureSection.components).filter(([k]) => k.includes('lambda') || k.includes('Lambda'))) : {}
            };
            svgContent += drawNode('brochure-lambda', lambdaSection, lambdaPos);
        }

        // Brochure Sites - P (Persistent / Radius)
        const radiusPos = positions['brochure-radius'];
        if (radiusPos) {
            const radiusSection = {
                label: 'Brochure Sites - P',
                components: brochureSection.components ?
                    Object.fromEntries(Object.entries(brochureSection.components).filter(([k]) => k.includes('radius') || k.includes('Radius'))) : {}
            };
            svgContent += drawNode('brochure-radius', radiusSection, radiusPos);
        }
    }

    // Draw Web3 Gateway with custom sublines (synthetic section)
    const gatewayPos = positions['web3-gateway'];
    if (gatewayPos) {
        const gatewaySection = {
            label: 'Web3 Gateway',
            components: {
                'web3-sn': { label: 'Web3.sn', status: sections['web3-gateway']?.components?.['web3-sn']?.status || 'orange' },
                'web3-smartlinks': { label: 'Web3Smartlinks.com', status: sections['web3-gateway']?.components?.['web3-smartlinks']?.status || 'orange' }
            }
        };
        svgContent += drawNode('web3-gateway', gatewaySection, gatewayPos);
    }

    svg.innerHTML = svgContent;
}

function handleMapNodeClick(sectionId) {
    // Map section IDs to panel IDs
    const panelMap = {
        'shopnet.network': 'settings',
        'data.shopnet': 'databases',
        'assist.shopnet': 'agents',
        'connect.shopnet': 'api',
        'products': 'products',
        'domains': 'domains',
        'portals': 'portals',
        'brochure': 'brochure-lambda',
        'brochure-lambda': 'brochure-lambda',
        'brochure-radius': 'brochure-radius',
        'web3-hub': 'network-nodes',
        'web3-gateway': 'web3-gateways',
        'web3-sites': 'web3'
    };

    const panelId = panelMap[sectionId];
    if (panelId) {
        showPanel(panelId);
    }
}

// Start auto-refresh when network map is shown
function startNetworkMapRefresh() {
    refreshNetworkMap();
    if (!networkRefreshInterval) {
        networkRefreshInterval = setInterval(refreshNetworkMap, 30000); // 30 seconds
    }
}

function stopNetworkMapRefresh() {
    if (networkRefreshInterval) {
        clearInterval(networkRefreshInterval);
        networkRefreshInterval = null;
    }
}

// ===== CONNECTION MONITOR =====
let currentGroupBy = 'endpoint';

async function refreshMonitor() {
    await Promise.all([loadSystemStatus(), loadConnections(currentGroupBy)]);
}

async function loadSystemStatus() {
    try {
        const response = await fetch(`${CONNECT_API_URL}/api/v1/monitor/status`);
        const data = await response.json();

        // Update database status
        const dbStatus = document.getElementById('monitor-db-status');
        if (data.database && data.database.includes('connected')) {
            dbStatus.textContent = 'Connected';
            dbStatus.style.color = '#22c55e';
        } else {
            dbStatus.textContent = 'Error';
            dbStatus.style.color = '#ef4444';
        }

        // Update request count
        document.getElementById('monitor-requests').textContent = data.request_log_size || 0;

        // Update timestamp
        const ts = new Date(data.timestamp);
        document.getElementById('monitor-timestamp').textContent = toESTTime(ts);

        // Update component statuses
        if (data.components) {
            updateComponentStatus('connect', data.components['connect.shopnet']);
            updateComponentStatus('data', data.components['data.shopnet']);
            // Handle shopnet.domains - may return 401 when basic auth enabled
            const domainsComp = data.components['shopnet.domains'];
            if (domainsComp && domainsComp.status === 'error' && domainsComp.latency_ms > 0) {
                domainsComp.status = 'online (auth)';
            }
            updateComponentStatus('domains', domainsComp);
        }
    } catch (error) {
        console.error('Failed to load system status:', error);
        document.getElementById('monitor-db-status').textContent = 'Offline';
        document.getElementById('monitor-db-status').style.color = '#ef4444';
    }
}

function updateComponentStatus(id, comp) {
    const badge = document.getElementById(`comp-${id}`);
    const latency = document.getElementById(`latency-${id}`);

    if (!badge || !latency) {
        console.warn(`Component status elements not found for: ${id}`);
        return;
    }

    if (!comp) {
        badge.textContent = 'Unknown';
        badge.className = 'badge badge-default';
        latency.textContent = '-';
        return;
    }

    if (comp.status === 'online') {
        badge.textContent = 'Online';
        badge.className = 'badge badge-success';
    } else if (comp.status === 'online (auth)') {
        badge.textContent = 'Online (Auth)';
        badge.className = 'badge badge-warning';
    } else if (comp.status && comp.status.includes('offline')) {
        badge.textContent = 'Offline';
        badge.className = 'badge badge-error';
    } else if (comp.status === 'error') {
        badge.textContent = 'Error';
        badge.className = 'badge badge-error';
    } else {
        badge.textContent = comp.status || 'Unknown';
        badge.className = 'badge badge-default';
    }

    latency.textContent = comp.latency_ms > 0 ? `${Math.round(comp.latency_ms)}ms` : '-';
}

async function loadConnections(groupBy) {
    currentGroupBy = groupBy;

    // Update button styles
    ['endpoint', 'backend', 'source'].forEach(g => {
        const btn = document.getElementById(`group-${g}`);
        if (g === groupBy) {
            btn.style.background = 'var(--primary)';
            btn.style.color = 'white';
            btn.classList.remove('btn-secondary');
        } else {
            btn.style.background = '';
            btn.style.color = '';
            btn.classList.add('btn-secondary');
        }
    });

    try {
        const response = await fetch(`${CONNECT_API_URL}/api/v1/monitor/connections?group_by=${groupBy}&limit=100`);
        const data = await response.json();

        // Update stats table
        const tbody = document.getElementById('monitor-stats-body');
        if (data.stats && Object.keys(data.stats).length > 0) {
            tbody.innerHTML = Object.entries(data.stats)
                .sort((a, b) => b[1].count - a[1].count)
                .map(([name, stats]) => `
                    <tr>
                        <td style="font-family: monospace; font-size: 0.875rem;">${name}</td>
                        <td style="text-align: right;">${stats.count}</td>
                        <td style="text-align: right; color: #22c55e;">${stats.success}</td>
                        <td style="text-align: right; color: ${stats.error > 0 ? '#ef4444' : 'inherit'};">${stats.error}</td>
                        <td style="text-align: right;">${stats.avg_duration_ms}ms</td>
                    </tr>
                `).join('');
        } else {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">No data yet</td></tr>';
        }

        // Update recent requests table
        const recentBody = document.getElementById('monitor-recent-body');
        if (data.recent && data.recent.length > 0) {
            recentBody.innerHTML = data.recent.map(req => {
                const time = toESTTime(req.timestamp);
                const statusClass = req.status < 400 ? '#22c55e' : '#ef4444';
                return `
                    <tr>
                        <td style="font-size: 0.875rem; color: var(--text-muted);">${time}</td>
                        <td style="font-family: monospace; font-size: 0.875rem;">${req.endpoint}</td>
                        <td style="font-size: 0.875rem;">${req.source}</td>
                        <td style="text-align: right; color: ${statusClass};">${req.status}</td>
                        <td style="text-align: right;">${req.duration_ms}ms</td>
                    </tr>
                `;
            }).join('');
        } else {
            recentBody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">No requests yet</td></tr>';
        }
    } catch (error) {
        console.error('Failed to load connections:', error);
        document.getElementById('monitor-stats-body').innerHTML =
            '<tr><td colspan="5" style="text-align: center; color: #ef4444;">Failed to load data</td></tr>';
    }
}

// Auto-refresh monitor when panel is shown
const originalShowPanel = showPanel;
showPanel = function(panelId) {
    originalShowPanel(panelId);

    // Handle network map panel
    if (panelId === 'network-map') {
        startNetworkMapRefresh();
    } else {
        stopNetworkMapRefresh();
    }

    // Handle monitor panel
    if (panelId === 'monitor') {
        refreshMonitor();
    }

    // Handle S3 Content panel
    if (panelId === 's3-content') {
        loadEndpoints();
        loadS3Folders();
    }

    // Handle brochure panels (split: Lambda on-demand vs Radius persistent)
    if (panelId === 'brochure-lambda') {
        loadBrochureLambda();
    }
    if (panelId === 'brochure-radius') {
        loadBrochureRadius();
    }

    // Handle web3 panel
    if (panelId === 'web3') {
        loadWeb3Sites();
    }

    // Handle web3-gateways panel
    if (panelId === 'web3-gateways') {
        loadWeb3Gateways();
    }

    // Handle products panel (Product Stores)
    if (panelId === 'products') {
        loadProductStores();
    }

    // Handle domains panel (Domain Stores)
    if (panelId === 'domains') {
        loadDomainStores();
    }

    // Handle portals panel (Client Portals)
    if (panelId === 'portals') {
        loadPortals();
    }

    // Handle databases panel (Files & Data Sources)
    if (panelId === 'databases') {
        loadDatabases();
    }

    // Handle AI Agents panel
    if (panelId === 'agents') {
        loadAgents();
    }

    // Handle DNS Manager panel - populate domain dropdowns
    if (panelId === 'dns') {
        if (typeof populateDnsSwitchDomainDropdown === 'function') {
            populateDnsSwitchDomainDropdown();
        }
        if (typeof populateSslManageDomainDropdown === 'function') {
            populateSslManageDomainDropdown();
        }
    }
};

// ===== ADD ENDPOINT WIZARD =====
let currentWizardStep = 1;
const totalWizardSteps = 7;

function wizardNext() {
    if (currentWizardStep < totalWizardSteps) {
        // Mark current step as completed
        document.querySelector(`.wizard-step[data-step="${currentWizardStep}"]`).classList.add('completed');
        document.querySelector(`.wizard-step[data-step="${currentWizardStep}"]`).classList.remove('active');

        // Hide current content
        document.getElementById(`wizard-step-${currentWizardStep}`).style.display = 'none';

        // Move to next step
        currentWizardStep++;

        // Show next content
        document.getElementById(`wizard-step-${currentWizardStep}`).style.display = 'block';
        document.querySelector(`.wizard-step[data-step="${currentWizardStep}"]`).classList.add('active');

        // Update buttons
        updateWizardButtons();
    }
}

function wizardPrev() {
    if (currentWizardStep > 1) {
        // Remove active from current
        document.querySelector(`.wizard-step[data-step="${currentWizardStep}"]`).classList.remove('active');

        // Hide current content
        document.getElementById(`wizard-step-${currentWizardStep}`).style.display = 'none';

        // Move to previous step
        currentWizardStep--;

        // Remove completed, add active
        document.querySelector(`.wizard-step[data-step="${currentWizardStep}"]`).classList.remove('completed');
        document.querySelector(`.wizard-step[data-step="${currentWizardStep}"]`).classList.add('active');

        // Show previous content
        document.getElementById(`wizard-step-${currentWizardStep}`).style.display = 'block';

        // Update buttons
        updateWizardButtons();
    }
}

function updateWizardButtons() {
    const prevBtn = document.getElementById('wizard-prev');
    const nextBtn = document.getElementById('wizard-next');
    const submitBtn = document.getElementById('wizard-submit');

    // Prev button
    prevBtn.disabled = (currentWizardStep === 1);

    // Next/Submit buttons
    if (currentWizardStep === totalWizardSteps) {
        nextBtn.style.display = 'none';
        submitBtn.style.display = 'inline-flex';
    } else {
        nextBtn.style.display = 'inline-flex';
        submitBtn.style.display = 'none';
    }
}

function wizardSubmit() {
    // Collect all form data
    const formData = {
        site_type: document.querySelector('input[name="site_type"]:checked')?.value,
        ai_agents: Array.from(document.querySelectorAll('input[name="ai_agents"]:checked')).map(el => el.value),
        platform: document.querySelector('input[name="platform"]:checked')?.value,
        product_types: Array.from(document.querySelectorAll('input[name="product_types"]:checked')).map(el => el.value),
        has_checkout: document.querySelector('input[name="has_checkout"]:checked')?.value === 'yes',
        ecommerce_platform: document.querySelector('input[name="ecommerce_platform"]:checked')?.value || null,
        data_sources: Array.from(document.querySelectorAll('input[name="data_sources"]:checked')).map(el => el.value),
        affiliate_config: {
            domains: {
                partner: 'freename',
                base_url: 'https://freename.io/register/',
                affiliate_id: document.getElementById('freename-affiliate-id')?.value || ''
            }
        }
    };

    // For now, just log the config (automation will be added later)
    console.log('Endpoint Configuration:', JSON.stringify(formData, null, 2));
    alert('Endpoint configuration saved!\n\nNote: Automation coming soon. Configuration logged to console.');

    // Reset wizard
    resetWizard();
}

function resetWizard() {
    currentWizardStep = 1;

    // Reset all steps
    document.querySelectorAll('.wizard-step').forEach((step, index) => {
        step.classList.remove('active', 'completed');
        if (index === 0) step.classList.add('active');
    });

    // Hide all content except step 1
    document.querySelectorAll('.wizard-content').forEach((content, index) => {
        content.style.display = index === 0 ? 'block' : 'none';
    });

    // Reset buttons
    updateWizardButtons();
}

// Initialize wizard event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Step 5: Show e-commerce platform options when checkout is selected
    const checkoutRadios = document.querySelectorAll('input[name="has_checkout"]');
    checkoutRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const platformSection = document.getElementById('ecommerce-platform-section');
            if (this.value === 'yes') {
                platformSection.style.display = 'block';
            } else {
                platformSection.style.display = 'none';
            }
        });
    });

    // Step 7: Toggle affiliate fields
    const amazonCheckbox = document.querySelector('input[name="affiliate_products"][value="amazon"]');
    if (amazonCheckbox) {
        amazonCheckbox.addEventListener('change', function() {
            document.getElementById('amazon-fields').style.display = this.checked ? 'block' : 'none';
        });
    }

    const otherAffiliateCheckbox = document.querySelector('input[name="affiliate_products"][value="other"]');
    if (otherAffiliateCheckbox) {
        otherAffiliateCheckbox.addEventListener('change', function() {
            document.getElementById('other-affiliate-fields').style.display = this.checked ? 'block' : 'none';
        });
    }
});

// ===== SITE CARDS (THE LAW - RDS + Live Overlay) =====
let siteCardsCache = null;

/**
 * Unified Endpoint Card Loader - THE LAW
 * Loads cards from RDS endpoint_taxonomy based on filters
 * @param {Object} config - Configuration object
 * @param {string} config.containerId - Container element ID
 * @param {string} config.countElId - Count element ID (optional)
 * @param {string} config.statusDotId - Status dot element ID (optional)
 * @param {string} config.endpoint_type - Filter by endpoint type (W, A, D, ND)
 * @param {string} config.website_purpose - Filter by website purpose (brochure, product_store, etc.)
 * @param {string} config.platform_type - Filter by platform type (LM=Lambda, RA=Radius, etc.)
 * @param {string} config.sectionIcon - Icon for the section
 * @param {string} config.sectionTitle - Title for the section
 * @param {string} config.loadingText - Loading message
 * @param {string} config.emptyText - Empty message
 */
async function loadEndpointCards(config) {
    const container = document.getElementById(config.containerId);
    const countEl = config.countElId ? document.getElementById(config.countElId) : null;
    const statusDot = config.statusDotId ? document.getElementById(config.statusDotId) : null;

    if (!container) return;

    container.innerHTML = `<div class="brochure-loading">${config.loadingText || 'Loading cards from RDS...'}</div>`;

    try {
        // Build query params for THE LAW API
        const params = new URLSearchParams();
        if (config.endpoint_type) params.append('endpoint_type', config.endpoint_type);
        if (config.website_purpose) params.append('website_purpose', config.website_purpose);
        if (config.platform_type) params.append('platform_type', config.platform_type);
        params.append('limit', '200');

        const response = await fetch(`/api/v1/sites/cards?${params.toString()}`);
        const data = await response.json();

        if (!data.success) throw new Error(data.error || 'Failed to load cards');

        let cards = data.cards || [];

        // Client-side filtering for exclusions (THE LAW v3.5)
        if (config.exclude_platform_type) {
            cards = cards.filter(c => c.platform_type !== config.exclude_platform_type);
        }

        // Update count and status
        const onlineCount = cards.filter(c => c.live_status === 'online').length;
        const liveCount = cards.filter(c => c.taxonomy_status === 'live').length;
        if (countEl) countEl.textContent = `${cards.length} endpoints (${onlineCount} online)`;
        if (statusDot) statusDot.className = 'card-status-dot ' + (onlineCount > 0 ? 'green' : liveCount > 0 ? 'orange' : 'grey');

        // Map API data to Network Card format
        function mapToNetworkCard(card) {
            return {
                site_uid: card.site_uid,
                domain_name: card.domain_name,
                label: card.label || null,
                endpoint_type: card.endpoint_type || 'W',
                platform_type: card.platform_type || 'CO',
                managed_by: card.managed_by,
                status: card.taxonomy_status || card.status || 'live',
                pulse_status: card.live_status === 'online' ? 'online' :
                              card.live_status === 'degraded' ? 'degraded' :
                              card.live_status === 'offline' ? 'offline' :
                              card.live_status || null,
                notes: card.notes,
                updated_at: card.updated_at
            };
        }

        if (cards.length === 0) {
            container.innerHTML = `<div class="brochure-loading">${config.emptyText || 'No endpoints found.'}</div>`;
            return;
        }

        // Render cards
        let html = `
            <div class="brochure-section">
                <div class="brochure-section-header">
                    <span class="section-icon">${config.sectionIcon || '📄'}</span>
                    <h3>${config.sectionTitle || 'Endpoints'} (${cards.length})</h3>
                    <span class="section-status"><span class="card-status-dot ${onlineCount > 0 ? 'green' : liveCount > 0 ? 'orange' : 'grey'}"></span> ${cards.length} endpoints (${onlineCount} online)</span>
                    <span class="section-badge" style="background: rgba(100,116,139,0.15); color: var(--text-muted); font-size: 11px; font-weight: 500;">auto generated cards</span>
                    <span class="section-badge">THE LAW - RDS</span>
                </div>
                <div class="card-grid">
        `;
        // Track this page's cards for wizard filtering
        window.currentPageCardUids = cards.map(c => c.site_uid);

        cards.forEach(card => {
            const mappedCard = mapToNetworkCard(card);
            // Store in global map for click lookups
            window.siteCardsMap[mappedCard.site_uid] = mappedCard;
            html += renderNetworkCard(mappedCard);
        });
        html += '</div></div>';

        container.innerHTML = html;

    } catch (error) {
        console.error('Failed to load endpoint cards:', error);
        container.innerHTML = `
            <div class="brochure-error">
                <h3>Error Loading Cards</h3>
                <p>${error.message}</p>
                <button class="btn btn-primary btn-sm" onclick="loadEndpointCards(${JSON.stringify(config).replace(/"/g, '&quot;')})">Retry</button>
            </div>
        `;
    }
}

async function loadBrochureLambda() {
    // THE LAW: Load Lambda (on-demand) brochure sites
    // Note: No platform_type filter - shows all brochure sites (currently all are Lambda/CO)
    // Radius sites will explicitly have platform_type='RA' and show on Persistent tab
    await loadEndpointCards({
        containerId: 'brochure-lambda-container',
        countElId: 'brochure-lambda-count',
        statusDotId: 'card-status-brochure-lambda',
        endpoint_type: 'W',
        website_purpose: 'brochure',
        sectionIcon: '⚡',
        sectionTitle: 'On-Demand Sites (Lambda)',
        loadingText: 'Loading Lambda brochure sites from RDS...',
        emptyText: 'No Lambda brochure sites in RDS.'
    });
}

async function loadBrochureRadius() {
    // THE LAW: Load Radius (persistent) brochure sites
    await loadEndpointCards({
        containerId: 'brochure-radius-container',
        countElId: 'brochure-radius-count',
        statusDotId: 'card-status-brochure-radius',
        endpoint_type: 'W',
        website_purpose: 'brochure',
        platform_type: 'RA',
        sectionIcon: '🔄',
        sectionTitle: 'Persistent Sites (Radius)',
        loadingText: 'Loading Radius brochure sites from RDS...',
        emptyText: 'No Radius brochure sites yet. Use Radius Site Builder to create persistent sites.'
    });
}

// Load Product Stores (Shopify, etc.)
async function loadProductStores() {
    await loadEndpointCards({
        containerId: 'product-stores-container',
        countElId: 'product-count',
        statusDotId: 'card-status-product-stores',
        endpoint_type: 'W',
        website_purpose: 'product_store',
        sectionIcon: '🛒',
        sectionTitle: 'Product Stores',
        loadingText: 'Loading Product Stores from RDS...',
        emptyText: 'No product stores in RDS.'
    });
}

// Load Domain Stores (WooCommerce, etc.)
async function loadDomainStores() {
    await loadEndpointCards({
        containerId: 'domain-stores-container',
        countElId: 'domain-count',
        statusDotId: 'card-status-domain-stores',
        endpoint_type: 'W',
        website_purpose: 'domain_store',
        sectionIcon: '🌐',
        sectionTitle: 'Domain Stores',
        loadingText: 'Loading Domain Stores from RDS...',
        emptyText: 'No domain stores in RDS.'
    });
}

// Load Client Portals
async function loadPortals() {
    await loadEndpointCards({
        containerId: 'portals-container',
        countElId: 'portals-count',
        statusDotId: 'card-status-portals',
        endpoint_type: 'W',
        website_purpose: 'portal',
        sectionIcon: '🚪',
        sectionTitle: 'Client Portals',
        loadingText: 'Loading Portals from RDS...',
        emptyText: 'No portals in RDS.'
    });
}

// Load Shopnet Consoles
async function loadConsoles() {
    await loadEndpointCards({
        containerId: 'consoles-container',
        countElId: 'consoles-count',
        statusDotId: 'card-status-consoles',
        endpoint_type: 'W',
        website_purpose: 'console',
        sectionIcon: '🖥️',
        sectionTitle: 'Shopnet Consoles',
        loadingText: 'Loading Consoles from RDS...',
        emptyText: 'No consoles in RDS.'
    });
}

// Load AI Agents
async function loadAgents() {
    await loadEndpointCards({
        containerId: 'agents-container',
        countElId: 'agents-count',
        statusDotId: 'card-status-agents',
        endpoint_type: 'A',
        sectionIcon: '🤖',
        sectionTitle: 'AI Agents',
        loadingText: 'Loading AI Agents from RDS...',
        emptyText: 'No AI agents in RDS.'
    });
}

// Load Databases
async function loadDatabases() {
    await loadEndpointCards({
        containerId: 'databases-container',
        countElId: 'databases-count',
        statusDotId: 'card-status-databases',
        endpoint_type: 'D',
        sectionIcon: '💾',
        sectionTitle: 'Databases',
        loadingText: 'Loading Databases from RDS...',
        emptyText: 'No databases in RDS.'
    });
}

// Load Network Nodes - THE LAW v3.5: endpoint_type='N' excluding platform_type='W3G'
async function loadNetworkNodes() {
    await loadEndpointCards({
        containerId: 'network-nodes-container',
        countElId: 'network-nodes-count',
        statusDotId: 'card-status-network-nodes',
        endpoint_type: 'N',
        exclude_platform_type: 'W3G',
        sectionIcon: '🔗',
        sectionTitle: 'Network Nodes',
        loadingText: 'Loading Network Nodes from RDS...',
        emptyText: 'No network nodes in RDS. Add endpoints with endpoint_type=N.'
    });
}

// Load Web3 Gateways - THE LAW v3.5: endpoint_type='N' AND platform_type='W3G'
async function loadWeb3Gateways() {
    await loadEndpointCards({
        containerId: 'web3-gateways-container',
        countElId: 'web3-gateways-count',
        statusDotId: 'card-status-web3-gateways',
        endpoint_type: 'N',
        platform_type: 'W3G',
        sectionIcon: '🔗',
        sectionTitle: 'Web3 Gateways',
        loadingText: 'Loading Web3 Gateways from RDS...',
        emptyText: 'No Web3 gateways in RDS. Add endpoints with endpoint_type=N, platform_type=W3G.'
    });
}

// ========================================
// UNIFIED CARD RENDERERS - THE LAW v3.1
// ========================================

/**
 * Network Card Renderer (Type 1)
 * For endpoints with site_uid (RDS Tables 1-3 + JSON health)
 * Click action: Opens Radius "Change Site" modal
 */
function renderNetworkCard(data) {
    // Status mapping from THE LAW
    const statusDotMap = {
        'planned': 'grey',
        'wip': 'orange',
        'live': data.pulse_status === 'online' ? 'green' :
                data.pulse_status === 'degraded' ? 'orange' :
                data.pulse_status === 'offline' ? 'red' : 'grey'
    };

    const statusTextMap = {
        'planned': 'Placeholder',
        'wip': 'Building',
        'live': data.pulse_status || 'checking'
    };

    const dotColor = statusDotMap[data.status] || 'grey';
    const statusText = statusTextMap[data.status] || data.status;
    const statusClass = data.status === 'live' ? (data.pulse_status || 'unknown') : data.status;

    // Taxonomy labels from TAXONOMY_LABELS (THE LAW source of truth)
    const typeLabels = TAXONOMY_LABELS['endpoint_type'] || {};
    const platformLabels = TAXONOMY_LABELS['platform_type'] || {};
    const managedLabels = TAXONOMY_LABELS['managed_by'] || {};

    const lastUpdated = data.updated_at ? new Date(data.updated_at).toLocaleDateString() : '-';

    return `
        <div class="unified-card network-card" data-site-uid="${data.site_uid}" onclick="showSiteCardDetails('${data.site_uid}')">
            <a href="https://${data.domain_name}" target="_blank" class="card-link" onclick="event.stopPropagation()" title="Visit site">↗</a>

            <div class="card-header">
                <span class="status-dot ${dotColor}" title="${statusText}"></span>
                <span class="card-id-badge">${data.site_uid}</span>
            </div>

            <div class="card-title" title="${data.domain_name}">${data.label || data.domain_name}</div>

            <div class="card-badges">
                <span class="card-badge badge-type-${data.endpoint_type}" title="${typeLabels[data.endpoint_type] || data.endpoint_type}">${data.endpoint_type}</span>
                <span class="card-badge badge-platform-${data.platform_type}" title="${platformLabels[data.platform_type] || data.platform_type}">${data.platform_type}</span>
                ${data.managed_by ? `<span class="card-badge badge-managed-${data.managed_by}" title="${managedLabels[data.managed_by] || data.managed_by}">${data.managed_by}</span>` : ''}
            </div>

            ${data.notes ? `<div class="card-description">${data.notes}</div>` : ''}

            <div class="card-footer">
                <span>${lastUpdated}</span>
                <span class="status-text ${statusClass}">${statusText}</span>
            </div>
        </div>
    `;
}

/**
 * Open Radius "Change Site" modal for editing an endpoint
 * @param {string} siteUid - The site_uid to edit
 */
function openChangeSiteModal(siteUid) {
    console.log('Opening Change Site modal for:', siteUid);
    // Check if Radius modal function exists
    if (typeof openRadiusModal === 'function') {
        openRadiusModal('change-site', { site_uid: siteUid });
    } else if (typeof showSiteCardDetails === 'function') {
        // Fallback to existing detail view
        showSiteCardDetails(siteUid);
    } else {
        console.warn('Radius modal not available, showing alert');
        alert(`Edit endpoint: ${siteUid}\n\nRadius modal integration pending.`);
    }
}

// ========================================
// SITE CARD DETAILS MODAL
// ========================================

/**
 * Opens the enhanced site card details modal with full taxonomy info and action buttons
 * @param {Object} card - The card/endpoint data object
 */
function openSiteCardDetailsModal(card) {
    // Taxonomy labels from TAXONOMY_LABELS (THE LAW source of truth)
    const typeLabels = TAXONOMY_LABELS['endpoint_type'] || {};
    const platformLabels = TAXONOMY_LABELS['platform_type'] || {};
    const purposeLabels = TAXONOMY_LABELS['website_purpose'] || {
        'portal': 'Portal', 'console': 'Console', 'brochure': 'Brochure',
        'store': 'Store', 'other': 'Other'
    };
    const checkoutLabels = TAXONOMY_LABELS['store_checkout'] || {
        'stripe': 'Stripe', 'paypal': 'PayPal', 'square': 'Square',
        'shopify': 'Shopify Native', 'woo': 'WooCommerce', 'none': 'No Checkout'
    };
    const managedLabels = TAXONOMY_LABELS['managed_by'] || {};
    const statusLabels = TAXONOMY_LABELS['status'] || {};

    // Build modal content
    const modalHtml = `
        <div id="siteCardDetailsModal" class="modal-overlay" style="display: flex;" onclick="if(event.target===this) closeSiteCardDetailsModal()">
            <div class="modal-container" style="max-width: 600px;">
                <div class="modal-header">
                    <h2 style="display: flex; align-items: center; gap: 0.75rem;">
                        <span class="status-dot ${card.live_status || card.status || 'grey'}" style="width: 12px; height: 12px;"></span>
                        ${card.label || card.domain_name}
                    </h2>
                    <button class="modal-close" onclick="closeSiteCardDetailsModal()">&times;</button>
                </div>
                <div class="modal-body" style="padding: 1.5rem;">
                    <!-- Domain and UID -->
                    <div style="margin-bottom: 1.5rem;">
                        <a href="https://${card.domain_name}" target="_blank" style="color: var(--primary); font-size: 1.1rem; text-decoration: none;">
                            ${card.domain_name} ↗
                        </a>
                        <div style="font-family: monospace; font-size: 0.85rem; color: var(--text-muted); margin-top: 0.25rem;">
                            ${card.site_uid}
                        </div>
                    </div>

                    <!-- Taxonomy Grid -->
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem;">
                        <div class="taxonomy-field">
                            <label style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">L1: Endpoint Type</label>
                            <div style="font-weight: 600; display: flex; align-items: center; gap: 0.5rem;">
                                <span class="card-badge badge-type-${card.endpoint_type}" style="font-size: 0.75rem;">${card.endpoint_type}</span>
                                ${typeLabels[card.endpoint_type] || card.endpoint_type || '—'}
                            </div>
                        </div>
                        <div class="taxonomy-field">
                            <label style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">L2: Platform Type</label>
                            <div style="font-weight: 600; display: flex; align-items: center; gap: 0.5rem;">
                                <span class="card-badge badge-platform-${card.platform_type}" style="font-size: 0.75rem;">${card.platform_type || '—'}</span>
                                ${platformLabels[card.platform_type] || card.platform_type || '—'}
                            </div>
                        </div>
                        <div class="taxonomy-field">
                            <label style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">L3: Website Purpose</label>
                            <div style="font-weight: 600;">${purposeLabels[card.website_purpose] || card.website_purpose || '—'}</div>
                        </div>
                        <div class="taxonomy-field">
                            <label style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">L4: Store Checkout</label>
                            <div style="font-weight: 600;">${checkoutLabels[card.store_checkout] || card.store_checkout || '—'}</div>
                        </div>
                    </div>

                    <!-- Status and Management -->
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.5rem; padding: 1rem; background: var(--bg-secondary); border-radius: var(--radius);">
                        <div>
                            <label style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">Status</label>
                            <div style="font-weight: 600;">${statusLabels[card.live_status] || statusLabels[card.status] || card.live_status || card.status || '—'}</div>
                        </div>
                        <div>
                            <label style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">Managed By</label>
                            <div style="font-weight: 600; display: flex; align-items: center; gap: 0.5rem;">
                                ${card.managed_by ? `<span class="card-badge badge-managed-${card.managed_by}" style="font-size: 0.75rem;">${card.managed_by}</span>` : ''}
                                ${managedLabels[card.managed_by] || card.managed_by || '—'}
                            </div>
                        </div>
                    </div>

                    ${card.notes ? `
                    <div style="margin-bottom: 1.5rem;">
                        <label style="font-size: 0.75rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.5px;">Notes</label>
                        <div style="margin-top: 0.25rem; color: var(--text-secondary);">${card.notes}</div>
                    </div>
                    ` : ''}

                    <!-- Timestamps -->
                    <div style="font-size: 0.8rem; color: var(--text-muted); border-top: 1px solid var(--border); padding-top: 1rem;">
                        ${card.created_at ? `<div>Created: ${new Date(card.created_at).toLocaleString()}</div>` : ''}
                        ${card.updated_at ? `<div>Updated: ${new Date(card.updated_at).toLocaleString()}</div>` : ''}
                    </div>
                </div>
                <div class="modal-footer" style="display: flex; gap: 0.75rem; justify-content: flex-end; padding: 1rem 1.5rem; border-top: 1px solid var(--border);">
                    <button class="btn btn--outline" onclick="closeSiteCardDetailsModal()">Close</button>
                    <button class="btn btn--warning" onclick="closeSiteCardDetailsModal(); confirmRemoveEndpointDirect('${card.site_uid}', '${(card.label || card.domain_name).replace(/'/g, "\\'")}')">
                        Remove
                    </button>
                    <button class="btn btn--primary" onclick="closeSiteCardDetailsModal(); openEndpointEditorWizard('${card.site_uid}')">
                        Change Taxonomy
                    </button>
                </div>
            </div>
        </div>
    `;

    // Remove any existing modal
    const existingModal = document.getElementById('siteCardDetailsModal');
    if (existingModal) existingModal.remove();

    // Add modal to DOM
    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function closeSiteCardDetailsModal() {
    const modal = document.getElementById('siteCardDetailsModal');
    if (modal) modal.remove();
}

/**
 * Direct remove confirmation (called from card details modal)
 */
function confirmRemoveEndpointDirect(siteUid, label) {
    selectedEndpointToRemove = { site_uid: siteUid, label: label, domain_name: label };
    document.getElementById('remove-endpoint-confirm-name').textContent = label;
    document.getElementById('remove-endpoint-confirm-uid').textContent = siteUid;
    document.getElementById('removeEndpointConfirmModal').style.display = 'flex';
}

window.openSiteCardDetailsModal = openSiteCardDetailsModal;
window.closeSiteCardDetailsModal = closeSiteCardDetailsModal;
window.confirmRemoveEndpointDirect = confirmRemoveEndpointDirect;

// ===== WEB3 SITES =====
// Web3 emoji TLD domains - THE LAW: Load from RDS endpoint_taxonomy

async function loadWeb3Sites() {
    // THE LAW: Load Web3 sites (website_purpose = 'other') from RDS
    await loadEndpointCards({
        containerId: 'web3-sites-container',
        countElId: 'web3-count',
        statusDotId: 'card-status-web3-sites',
        endpoint_type: 'W',
        website_purpose: 'other',
        sectionIcon: '🌐',
        sectionTitle: 'Web3 Emoji Domains',
        loadingText: 'Loading Web3 sites from RDS...',
        emptyText: 'No Web3 sites in RDS.'
    });
}

// ===== ENDPOINT MANAGEMENT =====
let endpointRegistry = [];

async function loadEndpoints() {
    const listEl = document.getElementById('endpoint-list');
    if (!listEl) return;

    if (!apiKey) {
        listEl.innerHTML = `<tr class="endpoint-empty-row"><td colspan="8">Login required to view endpoints</td></tr>`;
        return;
    }

    listEl.innerHTML = `<tr class="endpoint-empty-row"><td colspan="8"><div class="s3-loading">Loading endpoints...</div></td></tr>`;

    try {
        const response = await fetch(`${CONNECT_API_URL}/api/v1/endpoints`, {
            headers: { 'X-API-Key': apiKey }
        });
        const data = await response.json();

        if (data.success) {
            endpointRegistry = data.endpoints || [];
            renderEndpointStats(data.stats);
            renderEndpointList(endpointRegistry);
        } else {
            listEl.innerHTML = `<tr class="endpoint-empty-row"><td colspan="8">Error loading endpoints</td></tr>`;
        }
    } catch (error) {
        console.error('Failed to load endpoints:', error);
        listEl.innerHTML = `<tr class="endpoint-empty-row"><td colspan="8">Error: ${error.message}</td></tr>`;
    }
}

function renderEndpointStats(stats) {
    const totalEl = document.getElementById('ep-stat-total');
    const activeEl = document.getElementById('ep-stat-active');
    const syncsEl = document.getElementById('ep-stat-syncs');
    const errorsEl = document.getElementById('ep-stat-errors');

    if (totalEl) totalEl.textContent = stats?.total || 0;
    if (activeEl) activeEl.textContent = stats?.active || 0;
    if (syncsEl) syncsEl.textContent = stats?.syncs_24h || 0;
    if (errorsEl) errorsEl.textContent = stats?.errors || 0;
}

function renderEndpointList(endpoints) {
    const listEl = document.getElementById('endpoint-list');
    if (!listEl) return;

    if (!endpoints || endpoints.length === 0) {
        listEl.innerHTML = `<tr class="endpoint-empty-row"><td colspan="8">No endpoints registered</td></tr>`;
        return;
    }

    // Sort by site_uid if available
    endpoints.sort((a, b) => {
        if (a.site_uid && b.site_uid) return a.site_uid.localeCompare(b.site_uid);
        if (a.site_uid) return -1;
        if (b.site_uid) return 1;
        return 0;
    });

    let html = '';
    endpoints.forEach(ep => {
        const statusClass = ep.sync_enabled
            ? (ep.last_sync_status === 'success' ? 'active' : ep.last_sync_status === 'failed' ? 'error' : 'pending')
            : 'inactive';
        const statusText = ep.sync_enabled
            ? (ep.last_sync_status === 'success' ? 'Active' : ep.last_sync_status === 'failed' ? 'Error' : 'Pending')
            : 'Disabled';
        const lastSync = ep.last_sync_at ? formatTimeAgo(ep.last_sync_at) : 'Never';
        const filesCount = ep.active_files || 0;
        const siteId = ep.site_uid || '-';

        html += `
            <tr data-domain="${ep.domain_name}" data-site-uid="${ep.site_uid || ''}">
                <td><code style="font-size:0.75rem;color:#3b82f6;">${siteId}</code></td>
                <td>
                    <strong>${ep.domain_name}</strong>
                    ${ep.license_key ? '<span class="endpoint-mode manual" style="margin-left:0.5rem;font-size:0.6rem;">Licensed</span>' : ''}
                </td>
                <td>
                    <span class="endpoint-status">
                        <span class="endpoint-status-dot ${statusClass}"></span>
                        ${statusText}
                    </span>
                </td>
                <td><span class="endpoint-mode ${ep.sync_mode}">${ep.sync_mode}</span></td>
                <td>${ep.sync_schedule || '-'}</td>
                <td>${lastSync}</td>
                <td>${filesCount} files</td>
                <td>
                    <div class="endpoint-actions">
                        <button class="endpoint-action-btn sync" onclick="triggerEndpointSync('${ep.domain_name}')" title="Sync Now">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                                <path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                            </svg>
                        </button>
                        <button class="endpoint-action-btn" onclick="showEndpointConfig('${ep.domain_name}')" title="Configure">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                                <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    listEl.innerHTML = html;
}

function formatTimeAgo(isoString) {
    if (!isoString) return 'Never';
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hr ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
}

async function triggerEndpointSync(domain) {
    if (!apiKey) return;

    // Update UI to show syncing
    const row = document.querySelector(`tr[data-domain="${domain}"]`);
    if (row) {
        const statusCell = row.querySelector('.endpoint-status');
        if (statusCell) {
            statusCell.innerHTML = `<span class="endpoint-status-dot pending"></span> Syncing...`;
        }
    }

    try {
        const response = await fetch(`${CONNECT_API_URL}/api/v1/endpoints/${domain}/sync`, {
            method: 'POST',
            headers: { 'X-API-Key': apiKey }
        });
        const data = await response.json();

        if (data.success) {
            // Reload endpoints to show updated status
            await loadEndpoints();
        } else {
            alert(`Sync failed: ${data.detail || 'Unknown error'}`);
        }
    } catch (error) {
        console.error('Sync failed:', error);
        alert(`Sync failed: ${error.message}`);
    }
}

function showEndpointConfig(domain) {
    // TODO: Implement endpoint configuration modal
    alert(`Configure endpoint: ${domain}\n\nThis feature is coming soon.`);
}

// Expose to window
window.loadEndpoints = loadEndpoints;
window.triggerEndpointSync = triggerEndpointSync;
window.showEndpointConfig = showEndpointConfig;

// ===== S3 MANAGER =====
let s3CurrentDomain = null;
let s3CurrentFiles = [];
let s3FileToDelete = null;
let s3SelectedFile = null;

async function loadS3Folders() {
    const select = document.getElementById('s3-domain-select');
    const filesList = document.getElementById('s3-files-list');
    if (!select) return;

    // Check if logged in
    if (!apiKey) {
        select.innerHTML = '<option value="">Login required</option>';
        if (filesList) {
            filesList.innerHTML = `
                <tr class="s3-empty-row"><td colspan="5">
                    <div class="s3-empty-state">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="48" height="48">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                        <p><strong>Authentication Required</strong></p>
                        <p>Please log in via Settings to access S3 Manager</p>
                    </div>
                </td></tr>
            `;
        }
        const statusDot = document.getElementById('nav-status-s3-manager');
        if (statusDot) statusDot.className = 'nav-status-dot grey';
        return;
    }

    select.innerHTML = '<option value="">Loading domains...</option>';

    try {
        const response = await fetch(`${CONNECT_API_URL}/api/v1/assets/folders`, {
            headers: {
                'X-API-Key': apiKey
            }
        });

        if (response.status === 401) {
            select.innerHTML = '<option value="">Session expired</option>';
            if (filesList) {
                filesList.innerHTML = `
                    <tr class="s3-empty-row"><td colspan="5">
                        <div class="s3-empty-state">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="48" height="48">
                                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                            </svg>
                            <p><strong>Session Expired</strong></p>
                            <p>Please log out and log in again to refresh your session.</p>
                            <button class="btn btn-primary btn-sm" onclick="handleLogout()" style="margin-top: 1rem;">Log Out</button>
                        </div>
                    </td></tr>
                `;
            }
            const statusDot = document.getElementById('nav-status-s3-manager');
            if (statusDot) statusDot.className = 'nav-status-dot red';
            return;
        }

        const data = await response.json();

        if (data.success && data.folders) {
            select.innerHTML = '<option value="">Select a domain...</option>';
            data.folders.forEach(folder => {
                const option = document.createElement('option');
                option.value = folder;
                option.textContent = folder;
                select.appendChild(option);
            });

            // Update status dot
            const statusDot = document.getElementById('nav-status-s3-manager');
            if (statusDot) statusDot.className = 'nav-status-dot green';
        } else {
            select.innerHTML = '<option value="">No domains found</option>';
        }
    } catch (error) {
        console.error('Failed to load S3 folders:', error);
        select.innerHTML = '<option value="">Error loading domains</option>';
        if (filesList) {
            filesList.innerHTML = `
                <tr class="s3-empty-row"><td colspan="5">
                    <div class="s3-empty-state">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="48" height="48">
                            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        <p><strong>Connection Error</strong></p>
                        <p>${error.message}</p>
                    </div>
                </td></tr>
            `;
        }
        const statusDot = document.getElementById('nav-status-s3-manager');
        if (statusDot) statusDot.className = 'nav-status-dot red';
    }
}

function refreshS3Folders() {
    loadS3Folders();
}

async function loadS3DomainFiles() {
    const select = document.getElementById('s3-domain-select');
    const domain = select?.value;
    const filesList = document.getElementById('s3-files-list');
    const uploadBtn = document.getElementById('s3-upload-btn');

    if (!domain) {
        s3CurrentDomain = null;
        s3CurrentFiles = [];
        if (uploadBtn) uploadBtn.disabled = true;
        if (filesList) {
            filesList.innerHTML = `
                <tr class="s3-empty-row"><td colspan="5">
                    <div class="s3-empty-state">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="48" height="48">
                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                        </svg>
                        <p>Select a domain to view files</p>
                    </div>
                </td></tr>
            `;
        }
        updateS3Stats();
        return;
    }

    s3CurrentDomain = domain;
    if (uploadBtn) uploadBtn.disabled = false;
    if (filesList) filesList.innerHTML = '<tr class="s3-empty-row"><td colspan="5"><div class="s3-loading">Loading files...</div></td></tr>';

    try {
        const response = await fetch(`${CONNECT_API_URL}/api/v1/assets/${domain}/list`, {
            headers: {
                'X-API-Key': apiKey
            }
        });
        const data = await response.json();

        if (data.success) {
            s3CurrentFiles = data.files || [];
            renderS3FilesList(s3CurrentFiles);
            updateS3Stats();
        } else {
            filesList.innerHTML = `<tr class="s3-empty-row"><td colspan="5"><div class="s3-error">Error: ${data.detail || 'Failed to load files'}</div></td></tr>`;
        }
    } catch (error) {
        console.error('Failed to load domain files:', error);
        filesList.innerHTML = `<tr class="s3-empty-row"><td colspan="5"><div class="s3-error">Error: ${error.message}</div></td></tr>`;
    }
}

let s3SortColumn = 'name';
let s3SortDirection = 'asc';

function renderS3FilesList(files) {
    const filesList = document.getElementById('s3-files-list');
    if (!filesList) return;

    if (files.length === 0) {
        filesList.innerHTML = `
            <tr class="s3-empty-row">
                <td colspan="5">
                    <div class="s3-empty-state">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="48" height="48">
                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                        </svg>
                        <p>No files found</p>
                    </div>
                </td>
            </tr>
        `;
        return;
    }

    // Sort files
    const sortedFiles = [...files].sort((a, b) => {
        let aVal, bVal;
        switch (s3SortColumn) {
            case 'name': aVal = a.path.toLowerCase(); bVal = b.path.toLowerCase(); break;
            case 'size': aVal = a.size; bVal = b.size; break;
            case 'modified': aVal = new Date(a.last_modified); bVal = new Date(b.last_modified); break;
            default: aVal = a.path; bVal = b.path;
        }
        if (aVal < bVal) return s3SortDirection === 'asc' ? -1 : 1;
        if (aVal > bVal) return s3SortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    let html = '';
    sortedFiles.forEach(file => {
        const size = formatFileSize(file.size);
        const modified = formatDateShort(file.last_modified);
        const filename = file.path.split('/').pop();
        const fileType = file.type.toUpperCase();
        const isImage = file.type === 'image';
        const thumbnailUrl = isImage ? `https://shopnet-domain-images.s3.us-east-1.amazonaws.com/${s3CurrentDomain}/${file.path}` : null;

        html += `
            <tr data-path="${file.path}">
                <td>
                    ${isImage
                        ? `<img src="${thumbnailUrl}" class="s3-thumbnail" alt="" style="width:40px;height:40px;object-fit:cover;border-radius:4px;" onerror="this.outerHTML='<div class=\\'s3-thumbnail-placeholder\\'>🖼️</div>'">`
                        : `<div class="s3-thumbnail-placeholder">${getFileIcon(file.type)}</div>`
                    }
                </td>
                <td>
                    <div class="s3-file-name">
                        <span class="s3-file-name-main" title="${file.path}">${filename}</span>
                        <span class="s3-file-name-type">${fileType}</span>
                    </div>
                </td>
                <td><span class="s3-file-size">${size}</span></td>
                <td><span class="s3-file-date">${modified}</span></td>
                <td>
                    <div class="s3-actions-cell">
                        <button class="s3-action-btn" onclick="previewS3File('${file.path}', '${file.type}')" title="Preview">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                            </svg>
                        </button>
                        <button class="s3-action-btn" onclick="downloadS3File('${file.path}')" title="Download">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                        </button>
                        <button class="s3-action-btn delete" onclick="showS3DeleteModal('${file.path}')" title="Delete">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="16" height="16">
                                <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });

    filesList.innerHTML = html;
    updateS3TableHeaders();
}

function formatDateShort(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
}

function sortS3Files(column) {
    if (s3SortColumn === column) {
        s3SortDirection = s3SortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        s3SortColumn = column;
        s3SortDirection = 'asc';
    }
    renderS3FilesList(s3CurrentFiles);
}

function updateS3TableHeaders() {
    const headers = document.querySelectorAll('.s3-table th[data-sort]');
    headers.forEach(th => {
        th.classList.remove('sorted-asc', 'sorted-desc');
        if (th.dataset.sort === s3SortColumn) {
            th.classList.add(s3SortDirection === 'asc' ? 'sorted-asc' : 'sorted-desc');
        }
    });
}

function filterS3Files() {
    const query = document.getElementById('s3-search')?.value.toLowerCase() || '';
    if (!query) {
        renderS3FilesList(s3CurrentFiles);
        return;
    }
    const filtered = s3CurrentFiles.filter(f => f.path.toLowerCase().includes(query));
    renderS3FilesList(filtered);
}

function getFileIcon(type) {
    const icons = {
        'image': '🖼️',
        'json': '📋',
        'text': '📄',
        'html': '🌐',
        'css': '🎨',
        'javascript': '⚡',
        'pdf': '📕',
        'markdown': '📝',
        'binary': '📦'
    };
    return icons[type] || '📄';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

function formatDate(isoString) {
    return toESTDateTime(isoString);
}

function updateS3Stats() {
    const countEl = document.getElementById('s3-file-count');
    const sizeEl = document.getElementById('s3-total-size');

    if (countEl) countEl.textContent = s3CurrentFiles.length;
    if (sizeEl) {
        const totalSize = s3CurrentFiles.reduce((sum, f) => sum + f.size, 0);
        sizeEl.textContent = formatFileSize(totalSize);
    }
}

// Preview functions
async function previewS3File(path, type) {
    const previewPanel = document.getElementById('s3-preview-panel');
    const previewContent = document.getElementById('s3-preview-content');
    const previewFilename = document.getElementById('s3-preview-filename');

    if (!previewPanel || !previewContent) return;

    previewFilename.textContent = path;
    previewContent.innerHTML = '<div class="s3-loading">Loading preview...</div>';
    previewPanel.style.display = 'block';

    const url = `${CONNECT_API_URL}/api/v1/assets/${s3CurrentDomain}/${path}`;

    try {
        if (type === 'image') {
            previewContent.innerHTML = `<img src="${url}" alt="${path}" style="max-width: 100%; max-height: 400px; object-fit: contain;">`;
        } else if (type === 'json' || type === 'text' || type === 'html' || type === 'css' || type === 'javascript' || type === 'markdown') {
            const response = await fetch(url, {
                headers: { 'X-API-Key': apiKey }
            });
            const text = await response.text();
            previewContent.innerHTML = `<pre style="white-space: pre-wrap; max-height: 400px; overflow: auto; background: var(--bg-tertiary); padding: 1rem; border-radius: var(--radius);">${escapeHtml(text)}</pre>`;
        } else {
            previewContent.innerHTML = `<p>Preview not available for this file type.</p><a href="${url}" target="_blank" class="btn btn-primary btn-sm">Download File</a>`;
        }
    } catch (error) {
        previewContent.innerHTML = `<div class="s3-error">Failed to load preview: ${error.message}</div>`;
    }
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function closeS3Preview() {
    const previewPanel = document.getElementById('s3-preview-panel');
    if (previewPanel) previewPanel.style.display = 'none';
}

function downloadS3File(path) {
    const url = `${CONNECT_API_URL}/api/v1/assets/${s3CurrentDomain}/${path}`;
    window.open(url, '_blank');
}

// Upload functions
function showS3UploadModal() {
    const modal = document.getElementById('s3UploadModal');
    const domainInput = document.getElementById('s3-upload-domain');
    const filenameSpan = document.getElementById('s3-upload-filename');
    const submitBtn = document.getElementById('s3-upload-submit-btn');

    if (!modal || !s3CurrentDomain) return;

    domainInput.value = s3CurrentDomain;
    filenameSpan.textContent = '';
    submitBtn.disabled = true;
    s3SelectedFile = null;

    // Reset file input
    const fileInput = document.getElementById('s3-upload-file');
    if (fileInput) fileInput.value = '';

    modal.style.display = 'flex';

    // Setup drag and drop
    setupS3DropZone();
}

function closeS3UploadModal() {
    const modal = document.getElementById('s3UploadModal');
    if (modal) modal.style.display = 'none';
}

function setupS3DropZone() {
    const dropzone = document.getElementById('s3-upload-dropzone');
    if (!dropzone) return;

    dropzone.ondragover = (e) => {
        e.preventDefault();
        dropzone.classList.add('dragover');
    };

    dropzone.ondragleave = () => {
        dropzone.classList.remove('dragover');
    };

    dropzone.ondrop = (e) => {
        e.preventDefault();
        dropzone.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
            handleS3FileSelect({ target: { files: e.dataTransfer.files } });
        }
    };

    dropzone.onclick = () => {
        document.getElementById('s3-upload-file').click();
    };
}

function handleS3FileSelect(event) {
    const file = event.target.files[0];
    const filenameSpan = document.getElementById('s3-upload-filename');
    const submitBtn = document.getElementById('s3-upload-submit-btn');

    if (file) {
        s3SelectedFile = file;
        filenameSpan.textContent = file.name;
        submitBtn.disabled = false;
    } else {
        s3SelectedFile = null;
        filenameSpan.textContent = '';
        submitBtn.disabled = true;
    }
}

async function submitS3Upload() {
    if (!s3SelectedFile || !s3CurrentDomain) return;

    const submitBtn = document.getElementById('s3-upload-submit-btn');
    const subfolder = document.getElementById('s3-upload-subfolder').value;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Uploading...';

    const formData = new FormData();
    formData.append('file', s3SelectedFile);
    if (subfolder) {
        formData.append('path', subfolder);
    }

    try {
        const response = await fetch(`${CONNECT_API_URL}/api/v1/assets/${s3CurrentDomain}/upload`, {
            method: 'POST',
            headers: {
                'X-API-Key': apiKey
            },
            body: formData
        });

        const data = await response.json();

        if (data.success) {
            showToast('File uploaded successfully', 'success');
            closeS3UploadModal();
            loadS3DomainFiles(); // Refresh file list
        } else {
            showToast('Upload failed: ' + (data.detail || 'Unknown error'), 'error');
        }
    } catch (error) {
        console.error('Upload error:', error);
        showToast('Upload failed: ' + error.message, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Upload';
    }
}

// Delete functions
function showS3DeleteModal(path) {
    const modal = document.getElementById('s3DeleteModal');
    const filenameEl = document.getElementById('s3-delete-filename');

    if (!modal) return;

    s3FileToDelete = path;
    filenameEl.textContent = `${s3CurrentDomain}/${path}`;
    modal.style.display = 'flex';
}

function closeS3DeleteModal() {
    const modal = document.getElementById('s3DeleteModal');
    if (modal) modal.style.display = 'none';
    s3FileToDelete = null;
}

async function confirmS3Delete() {
    if (!s3FileToDelete || !s3CurrentDomain) return;

    try {
        const response = await fetch(`${CONNECT_API_URL}/api/v1/assets/${s3CurrentDomain}/${s3FileToDelete}`, {
            method: 'DELETE',
            headers: {
                'X-API-Key': apiKey
            }
        });

        const data = await response.json();

        if (data.success) {
            showToast('File deleted successfully', 'success');
            closeS3DeleteModal();
            loadS3DomainFiles(); // Refresh file list
        } else {
            showToast('Delete failed: ' + (data.detail || 'Unknown error'), 'error');
        }
    } catch (error) {
        console.error('Delete error:', error);
        showToast('Delete failed: ' + error.message, 'error');
    }
}

// ===== SITE REGISTRY =====
// Site Index - website records from shopnet_site_index RDS table

let siteRegistryData = [];
let siteRegistrySortField = 'site_uid';
let siteRegistrySortAsc = true;

async function loadSiteRegistry() {
    const tbody = document.getElementById('site-registry-body');
    const totalEl = document.getElementById('site-total-count');
    const activeEl = document.getElementById('site-active-count');
    const deletedEl = document.getElementById('site-deleted-count');

    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem;">Loading...</td></tr>';

    try {
        // Fetch from Lambda API - Site Index (shopnet_site_index RDS)
        const response = await fetch(`${LAMBDA_API_URL}/site-index`);
        const data = await response.json();

        if (data.sites) {
            siteRegistryData = data.sites;

            // Update stats
            const total = siteRegistryData.length;
            const active = siteRegistryData.filter(s => s.status === 'active').length;
            const deleted = siteRegistryData.filter(s => s.status === 'deleted').length;

            if (totalEl) totalEl.textContent = total;
            if (activeEl) activeEl.textContent = active;
            if (deletedEl) deletedEl.textContent = deleted;

            renderSiteRegistry();
        } else {
            throw new Error(data.error || 'Failed to load registry');
        }
    } catch (error) {
        console.error('Error loading Site Index:', error);
        tbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--status-red);">Error: ${error.message}</td></tr>`;
    }
}

function renderSiteRegistry() {
    const tbody = document.getElementById('site-registry-body');
    if (!tbody || !siteRegistryData.length) return;

    // Sort data
    const sortedData = [...siteRegistryData].sort((a, b) => {
        let aVal = a[siteRegistrySortField] || '';
        let bVal = b[siteRegistrySortField] || '';

        if (siteRegistrySortField === 'assigned_at') {
            aVal = new Date(aVal || 0);
            bVal = new Date(bVal || 0);
        }

        if (aVal < bVal) return siteRegistrySortAsc ? -1 : 1;
        if (aVal > bVal) return siteRegistrySortAsc ? 1 : -1;
        return 0;
    });

    let html = '';
    sortedData.forEach(site => {
        const statusClass = site.status === 'active' ? 'status-green' : 'status-gray';
        const assignedDate = site.assigned_at ? toEST(site.assigned_at) : '-';

        html += `
            <tr>
                <td><code style="background:#e0f2fe;padding:2px 6px;border-radius:3px;font-size:0.8rem;color:#0369a1;border:1px solid #bae6fd;">${site.site_uid}</code></td>
                <td>${site.domain_name}</td>
                <td style="font-size:0.85rem;color:var(--text-secondary);">${assignedDate}</td>
                <td style="font-size:0.85rem;color:var(--text-secondary);">${site.assigned_by || '-'}</td>
                <td><span class="status-badge ${statusClass}">${site.status || 'unknown'}</span></td>
                <td><code style="font-size:0.75rem;">${site.s3_folder || site.site_uid || '-'}</code></td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

function sortSiteRegistry(field) {
    if (siteRegistrySortField === field) {
        siteRegistrySortAsc = !siteRegistrySortAsc;
    } else {
        siteRegistrySortField = field;
        siteRegistrySortAsc = true;
    }
    renderSiteRegistry();
}

// ===== ENDPOINT REGISTRY (TAXONOMY RDS) =====

let endpointRegistryData = [];
let endpointRegistrySortField = 'site_uid';
let endpointRegistrySortAsc = true;
let endpointRegistryFilter = 'all';
let endpointColumnFilters = {}; // { columnKey: Set of selected values }
let activeFilterDropdown = null; // Currently open filter dropdown

// Column configuration - all available columns with defaults
// align: 'center' (default) or 'left' for text alignment
const REGISTRY_COLUMNS = [
    { key: 'site_uid', label: 'Site UID', sortable: true, visible: true, required: true, filterable: false, align: 'center' },
    { key: 'pulse_status', label: 'Live Pulse', sortable: true, visible: true, filterable: true, align: 'center' },
    { key: 'pulse_method', label: 'Pulse Method', sortable: true, visible: true, filterable: true, align: 'center' },
    { key: 'pulse_url', label: 'Pulse Endpoint', sortable: true, visible: true, filterable: false, align: 'left' },
    // L1-L4 = Taxonomy hierarchy levels (display labels only, NOT platform_type codes).
    // "L3" here means "Level 3: Website Purpose" — NOT the platform_type code "L3" (Layer3 Web3) in taxonomy_definition.
    { key: 'endpoint_type', label: 'L1 Type', sortable: true, visible: true, filterable: true, align: 'center' },
    { key: 'platform_type', label: 'L2 Platform', sortable: true, visible: true, filterable: true, align: 'center' },
    { key: 'website_purpose', label: 'L3 Purpose', sortable: true, visible: true, filterable: true, align: 'center' },
    { key: 'store_checkout', label: 'L4 Checkout', sortable: true, visible: false, filterable: true, align: 'center' },
    { key: 'domain_name', label: 'Domain', sortable: true, visible: true, filterable: false, align: 'left' },
    { key: 'web_protocol', label: 'Protocol', sortable: true, visible: false, filterable: true, align: 'center' },
    { key: 'status', label: 'Status', sortable: true, visible: true, filterable: true, align: 'center' },
    { key: 'ip_address', label: 'IP/Instance', sortable: true, visible: false, filterable: false, align: 'left' },
    { key: 'managed_by', label: 'Managed', sortable: false, visible: true, filterable: true, align: 'center' },
    { key: 'persistence', label: 'Persist', sortable: false, visible: false, filterable: true, align: 'center' },
    { key: 'agent_type', label: 'Agent Type', sortable: true, visible: false, filterable: true, align: 'center' },
    { key: 'runtime', label: 'Runtime', sortable: true, visible: false, filterable: true, align: 'center' },
    { key: 'host', label: 'Host', sortable: true, visible: false, filterable: true, align: 'left' },
    { key: 'created_at', label: 'Created', sortable: true, visible: true, filterable: false, align: 'center' },
    { key: 'notes', label: 'Notes', sortable: false, visible: false, filterable: false, align: 'left' },
    { key: 'created_by', label: 'Created By', sortable: true, visible: false, filterable: true, align: 'center' },
];

// Default column order for reset
const DEFAULT_COLUMN_ORDER = ['site_uid', 'pulse_status', 'pulse_method', 'pulse_url', 'endpoint_type', 'platform_type', 'website_purpose', 'store_checkout', 'domain_name', 'web_protocol', 'status', 'ip_address', 'managed_by', 'persistence', 'agent_type', 'runtime', 'host', 'created_at', 'notes', 'created_by'];

// Load column config from localStorage (visibility and order)
function loadRegistryConfig() {
    const saved = localStorage.getItem('registryColumnConfig');
    if (saved) {
        try {
            const config = JSON.parse(saved);
            // Load visibility settings
            REGISTRY_COLUMNS.forEach(col => {
                if (config.visibility && config.visibility[col.key] !== undefined && !col.required) {
                    col.visible = config.visibility[col.key];
                } else if (config[col.key] !== undefined && !col.required) {
                    // Legacy format support
                    col.visible = config[col.key];
                }
            });
            // Load column order
            if (config.order && Array.isArray(config.order)) {
                const orderedColumns = [];
                config.order.forEach(key => {
                    const col = REGISTRY_COLUMNS.find(c => c.key === key);
                    if (col) orderedColumns.push(col);
                });
                // Add any columns not in saved order (new columns)
                REGISTRY_COLUMNS.forEach(col => {
                    if (!orderedColumns.find(c => c.key === col.key)) {
                        orderedColumns.push(col);
                    }
                });
                // Reorder REGISTRY_COLUMNS in place
                REGISTRY_COLUMNS.length = 0;
                orderedColumns.forEach(col => REGISTRY_COLUMNS.push(col));
            }
        } catch (e) {
            console.error('Error loading registry config:', e);
        }
    }
}

// Save column config to localStorage (visibility and order)
function saveRegistryConfig() {
    const config = {
        visibility: {},
        order: REGISTRY_COLUMNS.map(col => col.key)
    };
    REGISTRY_COLUMNS.forEach(col => {
        config.visibility[col.key] = col.visible;
    });
    localStorage.setItem('registryColumnConfig', JSON.stringify(config));
}

// Initialize column checkboxes in config modal
function initColumnCheckboxes() {
    const container = document.getElementById('column-checkboxes');
    if (!container) return;

    container.innerHTML = REGISTRY_COLUMNS.map(col => `
        <label class="config-checkbox ${col.required ? 'disabled' : ''}">
            <input type="checkbox"
                   data-column="${col.key}"
                   ${col.visible ? 'checked' : ''}
                   ${col.required ? 'disabled' : ''}
                   onchange="toggleRegistryColumn('${col.key}', this.checked)">
            ${col.label}
        </label>
    `).join('');
}

// Initialize column order list in config modal
function initColumnOrderList() {
    const container = document.getElementById('column-order-list');
    if (!container) return;

    container.innerHTML = REGISTRY_COLUMNS.map((col, idx) => `
        <div class="column-order-item" data-key="${col.key}" style="display: flex; align-items: center; padding: 4px 8px; margin-bottom: 4px; background: var(--bg-tertiary); border-radius: 4px; border: 1px solid var(--border-color);">
            <span style="flex: 1; ${col.required ? 'font-weight: 600;' : ''}">${col.label}</span>
            <button class="btn btn-sm" onclick="moveColumnUp('${col.key}')" ${idx === 0 ? 'disabled' : ''} style="padding: 2px 6px; font-size: 0.75rem; margin-right: 4px;" title="Move Up">&#9650;</button>
            <button class="btn btn-sm" onclick="moveColumnDown('${col.key}')" ${idx === REGISTRY_COLUMNS.length - 1 ? 'disabled' : ''} style="padding: 2px 6px; font-size: 0.75rem;" title="Move Down">&#9660;</button>
        </div>
    `).join('');
}

function moveColumnUp(key) {
    const idx = REGISTRY_COLUMNS.findIndex(c => c.key === key);
    if (idx > 0) {
        const temp = REGISTRY_COLUMNS[idx - 1];
        REGISTRY_COLUMNS[idx - 1] = REGISTRY_COLUMNS[idx];
        REGISTRY_COLUMNS[idx] = temp;
        saveRegistryConfig();
        initColumnOrderList();
        initColumnCheckboxes();
        renderEndpointRegistry();
    }
}

function moveColumnDown(key) {
    const idx = REGISTRY_COLUMNS.findIndex(c => c.key === key);
    if (idx >= 0 && idx < REGISTRY_COLUMNS.length - 1) {
        const temp = REGISTRY_COLUMNS[idx + 1];
        REGISTRY_COLUMNS[idx + 1] = REGISTRY_COLUMNS[idx];
        REGISTRY_COLUMNS[idx] = temp;
        saveRegistryConfig();
        initColumnOrderList();
        initColumnCheckboxes();
        renderEndpointRegistry();
    }
}

function toggleRegistryColumn(key, visible) {
    const col = REGISTRY_COLUMNS.find(c => c.key === key);
    if (col && !col.required) {
        col.visible = visible;
        saveRegistryConfig();
        renderEndpointRegistry();
    }
}

function openRegistryConfigModal() {
    initColumnCheckboxes();
    initColumnOrderList();
    // Set current filter radio
    const filterRadio = document.querySelector(`input[name="registry-type-filter"][value="${endpointRegistryFilter}"]`);
    if (filterRadio) filterRadio.checked = true;
    document.getElementById('registry-config-modal').style.display = 'flex';
}

function closeRegistryConfigModal() {
    document.getElementById('registry-config-modal').style.display = 'none';
}

function resetRegistryConfig() {
    // Reset to defaults - THE LAW v3.5 taxonomy columns
    // Reset visibility
    REGISTRY_COLUMNS.forEach(col => {
        col.visible = ['site_uid', 'pulse_status', 'endpoint_type', 'platform_type', 'website_purpose', 'domain_name', 'status', 'managed_by', 'created_at'].includes(col.key);
    });
    // Reset order to default
    const orderedColumns = [];
    DEFAULT_COLUMN_ORDER.forEach(key => {
        const col = REGISTRY_COLUMNS.find(c => c.key === key);
        if (col) orderedColumns.push(col);
    });
    REGISTRY_COLUMNS.length = 0;
    orderedColumns.forEach(col => REGISTRY_COLUMNS.push(col));

    saveRegistryConfig();
    initColumnCheckboxes();
    initColumnOrderList();
    renderEndpointRegistry();
}

function openExportModal() {
    const filteredCount = getFilteredData().length;
    const allCount = endpointRegistryData.length;
    document.getElementById('export-filtered-count').textContent = filteredCount;
    document.getElementById('export-all-count').textContent = allCount;
    document.getElementById('export-csv-modal').style.display = 'flex';
}

function closeExportModal() {
    document.getElementById('export-csv-modal').style.display = 'none';
}

function getFilteredData() {
    let data = endpointRegistryData;

    // Apply type filter from stat pills (W, A, D, N, I, O)
    if (endpointRegistryFilter !== 'all') {
        data = data.filter(e => e.endpoint_type === endpointRegistryFilter);
    }

    // Apply column filters
    for (const [colKey, selectedValues] of Object.entries(endpointColumnFilters)) {
        if (selectedValues && selectedValues.size > 0) {
            data = data.filter(row => {
                const val = row[colKey] || '';
                return selectedValues.has(val);
            });
        }
    }

    return data;
}

// Column filter dropdown functions
function getUniqueColumnValues(columnKey) {
    const values = new Set();
    endpointRegistryData.forEach(row => {
        const val = row[columnKey];
        if (val !== undefined && val !== null) {
            values.add(val);
        }
    });
    return Array.from(values).sort();
}

function toggleColumnFilter(columnKey, event) {
    event.stopPropagation();

    const existingDropdown = document.getElementById('column-filter-dropdown');
    if (existingDropdown) {
        const wasOpen = existingDropdown.dataset.column === columnKey;
        existingDropdown.remove();
        activeFilterDropdown = null;
        if (wasOpen) return; // Toggle off
    }

    const uniqueValues = getUniqueColumnValues(columnKey);
    if (uniqueValues.length === 0) return;

    const currentFilter = endpointColumnFilters[columnKey] || new Set();
    const allSelected = currentFilter.size === 0; // Empty means all selected

    // Create dropdown
    const dropdown = document.createElement('div');
    dropdown.id = 'column-filter-dropdown';
    dropdown.className = 'column-filter-dropdown';
    dropdown.dataset.column = columnKey;

    dropdown.innerHTML = `
        <div class="filter-dropdown-header">
            <span>Filter: ${REGISTRY_COLUMNS.find(c => c.key === columnKey)?.label || columnKey}</span>
            <button class="filter-close-btn" onclick="closeColumnFilter()">&times;</button>
        </div>
        <div class="filter-dropdown-actions">
            <button class="btn btn-sm" onclick="selectAllColumnFilter('${columnKey}')">Select All</button>
            <button class="btn btn-sm" onclick="clearColumnFilter('${columnKey}')">Clear All</button>
        </div>
        <div class="filter-dropdown-list">
            ${uniqueValues.map(val => {
                const checked = allSelected || currentFilter.has(val);
                const displayVal = val === '' ? '(empty)' : val;
                return `<label class="filter-checkbox">
                    <input type="checkbox" value="${val}" ${checked ? 'checked' : ''}
                           onchange="toggleColumnFilterValue('${columnKey}', '${val.toString().replace(/'/g, "\\'")}', this.checked)">
                    <span>${displayVal}</span>
                </label>`;
            }).join('')}
        </div>
        <div class="filter-dropdown-footer">
            <button class="btn btn-primary btn-sm" onclick="applyColumnFilter('${columnKey}')">Apply</button>
        </div>
    `;

    // Position dropdown near the header
    const th = event.target.closest('th');
    const rect = th.getBoundingClientRect();
    dropdown.style.position = 'absolute';
    dropdown.style.top = (rect.bottom + window.scrollY) + 'px';
    dropdown.style.left = Math.max(0, rect.left + window.scrollX - 50) + 'px';
    dropdown.style.zIndex = '1000';

    document.body.appendChild(dropdown);
    activeFilterDropdown = columnKey;
}

function toggleColumnFilterValue(columnKey, value, checked) {
    if (!endpointColumnFilters[columnKey]) {
        // Initialize with all values selected
        endpointColumnFilters[columnKey] = new Set(getUniqueColumnValues(columnKey));
    }
    if (checked) {
        endpointColumnFilters[columnKey].add(value);
    } else {
        endpointColumnFilters[columnKey].delete(value);
    }
}

function selectAllColumnFilter(columnKey) {
    const checkboxes = document.querySelectorAll('#column-filter-dropdown .filter-checkbox input');
    checkboxes.forEach(cb => cb.checked = true);
    endpointColumnFilters[columnKey] = new Set(getUniqueColumnValues(columnKey));
}

function clearColumnFilter(columnKey) {
    const checkboxes = document.querySelectorAll('#column-filter-dropdown .filter-checkbox input');
    checkboxes.forEach(cb => cb.checked = false);
    endpointColumnFilters[columnKey] = new Set();
}

function applyColumnFilter(columnKey) {
    const checkboxes = document.querySelectorAll('#column-filter-dropdown .filter-checkbox input');
    const selectedValues = new Set();
    checkboxes.forEach(cb => {
        if (cb.checked) selectedValues.add(cb.value);
    });

    const allValues = getUniqueColumnValues(columnKey);
    // If all selected, remove the filter (show all)
    if (selectedValues.size === allValues.length) {
        delete endpointColumnFilters[columnKey];
    } else {
        endpointColumnFilters[columnKey] = selectedValues;
    }

    closeColumnFilter();
    renderEndpointRegistry();
}

function closeColumnFilter() {
    const dropdown = document.getElementById('column-filter-dropdown');
    if (dropdown) dropdown.remove();
    activeFilterDropdown = null;
}

function clearAllColumnFilters() {
    endpointColumnFilters = {};
    renderEndpointRegistry();
}

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    if (activeFilterDropdown && !e.target.closest('#column-filter-dropdown') && !e.target.closest('.filter-icon')) {
        closeColumnFilter();
    }
});

function exportRegistryCSV() {
    const exportOption = document.querySelector('input[name="export-option"]:checked').value;
    const exportScope = document.querySelector('input[name="export-scope"]:checked').value;

    // Determine columns to export
    const columns = exportOption === 'visible'
        ? REGISTRY_COLUMNS.filter(c => c.visible)
        : REGISTRY_COLUMNS;

    // Determine data to export
    const data = exportScope === 'filtered' ? getFilteredData() : endpointRegistryData;

    // Build CSV
    const headers = columns.map(c => c.label).join(',');
    const rows = data.map(row => {
        return columns.map(col => {
            let value = row[col.key] || '';
            // Escape quotes and wrap in quotes if contains comma
            if (typeof value === 'string') {
                value = value.replace(/"/g, '""');
                if (value.includes(',') || value.includes('"') || value.includes('\n')) {
                    value = `"${value}"`;
                }
            }
            return value;
        }).join(',');
    });

    const csv = [headers, ...rows].join('\n');

    // Download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `endpoint-registry-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    closeExportModal();
    showToast(`Exported ${data.length} rows to CSV`, 'success');
}

async function loadEndpointRegistry() {
    loadRegistryConfig();

    const tbody = document.getElementById('endpoint-registry-body');
    const totalEl = document.getElementById('registry-total-count');
    const websiteEl = document.getElementById('registry-website-count');
    const agentEl = document.getElementById('registry-agent-count');
    const dbEl = document.getElementById('registry-db-count');
    const nodeEl = document.getElementById('registry-node-count');
    const infraEl = document.getElementById('registry-infra-count');
    const otherEl = document.getElementById('registry-other-count');

    if (!tbody) return;

    const visibleCols = REGISTRY_COLUMNS.filter(c => c.visible).length;
    tbody.innerHTML = `<tr><td colspan="${visibleCols}" style="text-align: center; padding: 2rem;">Loading...</td></tr>`;

    try {
        const response = await fetch('/api/brochure/taxonomy');
        const data = await response.json();

        if (data.success && data.endpoints) {
            // Normalize endpoint_type values (trim whitespace from DB CHAR fields)
            endpointRegistryData = data.endpoints.map(e => ({
                ...e,
                endpoint_type: (e.endpoint_type || '').trim()
            }));

            const total = endpointRegistryData.length;
            const websites = endpointRegistryData.filter(e => e.endpoint_type === 'W').length;
            const agents = endpointRegistryData.filter(e => e.endpoint_type === 'A').length;
            const databases = endpointRegistryData.filter(e => e.endpoint_type === 'D').length;
            // THE LAW v3.5: N, I, O are separate endpoint types
            const nodes = endpointRegistryData.filter(e => e.endpoint_type === 'N').length;
            const infra = endpointRegistryData.filter(e => e.endpoint_type === 'I').length;
            const other = endpointRegistryData.filter(e => e.endpoint_type === 'O').length;

            if (totalEl) totalEl.textContent = total;
            if (websiteEl) websiteEl.textContent = websites;
            if (agentEl) agentEl.textContent = agents;
            if (dbEl) dbEl.textContent = databases;
            if (nodeEl) nodeEl.textContent = nodes;
            if (infraEl) infraEl.textContent = infra;
            if (otherEl) otherEl.textContent = other;

            // Auto-load pulse status from DATABASE (THE LAW Feb 2026 - DB is source of truth)
            try {
                const dbResponse = await fetch('https://connect.shopnet.network/api/v1/pulse/status/db');
                const dbData = await dbResponse.json();
                if (dbData.endpoints) {
                    const pulseMap = {};
                    dbData.endpoints.forEach(ep => {
                        if (ep.site_uid) {
                            pulseMap[ep.site_uid] = {
                                pulse_status: ep.last_pulse_status || 'grey',
                                pulse_latency: ep.last_pulse_latency_ms,
                                pulse_error: ep.last_pulse_error,
                                pulse_at: ep.last_pulse_at
                            };
                        }
                    });
                    // Merge pulse data from database
                    endpointRegistryData = endpointRegistryData.map(ep => ({
                        ...ep,
                        pulse_status: pulseMap[ep.site_uid]?.pulse_status || ep.pulse_status || '',
                        pulse_latency: pulseMap[ep.site_uid]?.pulse_latency || null,
                        pulse_at: pulseMap[ep.site_uid]?.pulse_at || null
                    }));
                }
            } catch (pulseErr) {
                console.log('Could not auto-load pulse status:', pulseErr);
            }

            window.currentPageCardUids = endpointRegistryData.map(e => e.site_uid);
            renderEndpointRegistry();
        } else {
            throw new Error(data.error || 'Failed to load taxonomy');
        }
    } catch (error) {
        console.error('Error loading Endpoint Registry:', error);
        const visibleCols = REGISTRY_COLUMNS.filter(c => c.visible).length;
        tbody.innerHTML = `<tr><td colspan="${visibleCols}" style="text-align: center; color: var(--status-red);">Error: ${error.message}</td></tr>`;
    }
}

function renderEndpointRegistry() {
    const thead = document.getElementById('endpoint-registry-thead');
    const tbody = document.getElementById('endpoint-registry-body');
    const rowCountEl = document.getElementById('registry-row-count');
    const filterInfoEl = document.getElementById('registry-filter-info');
    const filterLabelEl = document.getElementById('registry-filter-label');

    if (!tbody) return;

    const visibleColumns = REGISTRY_COLUMNS.filter(c => c.visible);

    // Render table header (with Actions column)
    if (thead) {
        const sortIndicator = (key) => {
            if (endpointRegistrySortField !== key) return '';
            return endpointRegistrySortAsc ? ' ▲' : ' ▼';
        };

        const filterIcon = (col) => {
            if (!col.filterable) return '';
            const hasFilter = endpointColumnFilters[col.key] && endpointColumnFilters[col.key].size > 0;
            const activeClass = hasFilter ? 'filter-active' : '';
            return `<span class="filter-icon ${activeClass}" onclick="toggleColumnFilter('${col.key}', event)" title="Filter ${col.label}">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
                </svg>
            </span>`;
        };

        thead.innerHTML = `<tr>${visibleColumns.map(col => {
            const align = col.align || 'center';
            const sortStyle = col.sortable ? 'cursor:pointer;' : '';
            return `<th style="text-align: ${align}; ${sortStyle}" ${col.sortable ? `onclick="sortEndpointRegistry('${col.key}')"` : ''}>
                <span class="th-content">
                    <span class="th-label">${col.label}${col.sortable ? sortIndicator(col.key) : ''}</span>
                    ${filterIcon(col)}
                </span>
            </th>`;
        }).join('')}<th style="width: 60px; text-align: center;">Actions</th></tr>`;
    }

    if (!endpointRegistryData.length) {
        tbody.innerHTML = `<tr><td colspan="${visibleColumns.length + 1}" style="text-align: center; padding: 2rem;">No endpoints found</td></tr>`;
        return;
    }

    // Filter data
    let filteredData = getFilteredData();

    // Update filter info display
    if (filterInfoEl) {
        if (endpointRegistryFilter !== 'all') {
            const labels = { 'W': 'Websites', 'A': 'Agents', 'D': 'Databases', 'N': 'Nodes', 'I': 'Infrastructure', 'O': 'Other' };
            filterLabelEl.textContent = labels[endpointRegistryFilter] || endpointRegistryFilter;
            filterInfoEl.style.display = 'inline-block';
        } else {
            filterInfoEl.style.display = 'none';
        }
    }

    // Update stat pills active state
    document.querySelectorAll('.stat-pill').forEach(pill => {
        pill.classList.remove('active');
        if (pill.dataset.filter === endpointRegistryFilter) {
            pill.classList.add('active');
        }
    });

    // Sort data
    const sortedData = [...filteredData].sort((a, b) => {
        let aVal = a[endpointRegistrySortField] || '';
        let bVal = b[endpointRegistrySortField] || '';
        if (endpointRegistrySortField === 'created_at') {
            aVal = new Date(aVal || 0);
            bVal = new Date(bVal || 0);
        }
        if (aVal < bVal) return endpointRegistrySortAsc ? -1 : 1;
        if (aVal > bVal) return endpointRegistrySortAsc ? 1 : -1;
        return 0;
    });

    // Value formatters
    const formatters = {
        site_uid: (v) => `<span class="registry-uid">${v || '-'}</span>`,
        endpoint_type: (v) => {
            const labels = TAXONOMY_LABELS['endpoint_type'] || {};
            const cls = v ? `type-${v.toLowerCase()}` : '';
            return `<span class="registry-badge ${cls}">${labels[v] || v || '-'}</span>`;
        },
        platform_type: (v) => `<code style="font-size:0.8rem;">${v || '-'}</code>`,
        domain_name: (v) => `<span class="registry-domain" title="${v || ''}">${v || '-'}</span>`,
        web_protocol: (v) => {
            const cls = v === 'W3' ? 'protocol-w3' : 'protocol-w2';
            return `<span class="registry-badge ${cls}">${v || 'W2'}</span>`;
        },
        status: (v) => {
            // WIP is treated as Live - only Live or Planned are valid display values
            const isLive = v === 'live' || v === 'wip';
            const cls = isLive ? 'status-live' : 'status-planned';
            const label = isLive ? 'live' : 'planned';
            return `<span class="registry-badge ${cls}">${label}</span>`;
        },
        pulse_status: (v) => {
            if (!v) return '<span class="registry-muted">—</span>';
            const colorMap = { 'green': '#22c55e', 'online': '#22c55e', 'orange': '#f59e0b', 'degraded': '#f59e0b', 'red': '#ef4444', 'offline': '#ef4444', 'grey': '#9ca3af', 'pending': '#9ca3af' };
            const labelMap = { 'green': 'Online', 'online': 'Online', 'orange': 'Degraded', 'degraded': 'Degraded', 'red': 'Offline', 'offline': 'Offline', 'grey': 'Pending', 'pending': 'Pending' };
            const color = colorMap[v] || '#9ca3af';
            const label = labelMap[v] || v;
            return `<span style="display:flex;align-items:center;gap:4px;justify-content:center;"><span style="width:10px;height:10px;border-radius:50%;background:${color};"></span>${label}</span>`;
        },
        ip_address: (v) => `<span class="registry-muted" style="font-family:monospace;font-size:0.8rem;">${v || '-'}</span>`,
        managed_by: (v) => `<span class="registry-muted">${v || '-'}</span>`,
        persistence: (v) => `<span class="registry-muted">${v || '-'}</span>`,
        agent_type: (v) => {
            const labels = { 'product_assist': 'Product', 'domain_assist': 'Domain', 'content_assist': 'Content' };
            return `<span class="registry-muted">${labels[v] || v || '-'}</span>`;
        },
        website_purpose: (v) => {
            const labels = { 'brochure': 'Brochure', 'product_store': 'Products', 'domain_store': 'Domains', 'portal': 'Portal', 'console': 'Console' };
            return `<span class="registry-muted">${labels[v] || v || '-'}</span>`;
        },
        runtime: (v) => `<span class="registry-muted">${v || '-'}</span>`,
        host: (v) => `<span class="registry-muted">${v || '-'}</span>`,
        created_at: (v) => `<span class="registry-muted">${v ? new Date(v).toLocaleDateString() : '-'}</span>`,
        notes: (v) => {
            const truncated = v && v.length > 25 ? v.substring(0, 25) + '...' : (v || '-');
            return `<span class="registry-notes" title="${(v || '').replace(/"/g, '&quot;')}">${truncated}</span>`;
        },
        created_by: (v) => `<span class="registry-muted">${v || '-'}</span>`,
    };

    // Render rows (with Actions column) - apply column alignment
    const html = sortedData.map(row => {
        const cells = visibleColumns.map(col => {
            const formatter = formatters[col.key] || ((v) => v || '-');
            const align = col.align || 'center';
            return `<td style="text-align: ${align};">${formatter(row[col.key])}</td>`;
        }).join('');
        const actionsCell = `<td style="text-align: center;">
            <button class="btn btn-secondary btn-sm" onclick="openEndpointEditorWizard('${row.site_uid}')" title="Edit Taxonomy" style="padding: 4px 8px;">
                ✏️
            </button>
        </td>`;
        return `<tr>${cells}${actionsCell}</tr>`;
    }).join('');

    tbody.innerHTML = html || `<tr><td colspan="${visibleColumns.length + 1}" style="text-align: center; padding: 2rem;">No endpoints match filter</td></tr>`;

    // Update row count
    if (rowCountEl) {
        rowCountEl.textContent = `${sortedData.length} row${sortedData.length !== 1 ? 's' : ''}${endpointRegistryFilter !== 'all' ? ' (filtered)' : ''}`;
    }
}

function sortEndpointRegistry(field) {
    if (endpointRegistrySortField === field) {
        endpointRegistrySortAsc = !endpointRegistrySortAsc;
    } else {
        endpointRegistrySortField = field;
        endpointRegistrySortAsc = true;
    }
    renderEndpointRegistry();
}

function filterRegistry(filter) {
    endpointRegistryFilter = filter;

    // Update radio in modal if open
    const filterRadio = document.querySelector(`input[name="registry-type-filter"][value="${filter}"]`);
    if (filterRadio) filterRadio.checked = true;

    renderEndpointRegistry();
}

// ===== LIVE STATUS (JSON REAL-TIME) =====

let liveStatusData = [];
let liveStatusSortField = 'site_uid';
let liveStatusSortAsc = true;

async function loadLiveStatus() {
    const tbody = document.getElementById('live-status-body');
    const totalEl = document.getElementById('live-total-count');
    const onlineEl = document.getElementById('live-online-count');
    const warningEl = document.getElementById('live-warning-count');
    const offlineEl = document.getElementById('live-offline-count');
    const lastUpdatedEl = document.getElementById('live-last-updated');

    if (!tbody) return;

    tbody.innerHTML = '<tr><td colspan="7" style="text-align: center; padding: 2rem;">Loading...</td></tr>';

    try {
        // Fetch from Connect Gateway - network-endpoints.json live status
        const response = await fetch('https://connect.shopnet.network/api/v1/network/live');
        const data = await response.json();

        if (data.components) {
            liveStatusData = data.components;

            // Update stats - map status values (green=online, red=offline, orange=warning, grey=inactive)
            const total = liveStatusData.length;
            const online = liveStatusData.filter(s => s.status === 'green').length;
            const warning = liveStatusData.filter(s => s.status === 'orange' || s.status === 'grey').length;
            const offline = liveStatusData.filter(s => s.status === 'red').length;

            if (totalEl) totalEl.textContent = total;
            if (onlineEl) onlineEl.textContent = online;
            if (warningEl) warningEl.textContent = warning;
            if (offlineEl) offlineEl.textContent = offline;
            if (lastUpdatedEl) lastUpdatedEl.textContent = `Updated: ${data.updated_at ? new Date(data.updated_at).toLocaleTimeString() : new Date().toLocaleTimeString()}`;

            renderLiveStatus();
        } else {
            throw new Error(data.error || 'Failed to load live status');
        }
    } catch (error) {
        console.error('Error loading Live Status:', error);
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--status-red);">Error: ${error.message}</td></tr>`;
    }
}

function renderLiveStatus() {
    const tbody = document.getElementById('live-status-body');
    if (!tbody || !liveStatusData.length) return;

    // Sort data
    const sortedData = [...liveStatusData].sort((a, b) => {
        let aVal = a[liveStatusSortField] || '';
        let bVal = b[liveStatusSortField] || '';

        if (aVal < bVal) return liveStatusSortAsc ? -1 : 1;
        if (aVal > bVal) return liveStatusSortAsc ? 1 : -1;
        return 0;
    });

    // Status color map
    const statusColors = {
        'green': '#22c55e',
        'orange': '#f59e0b',
        'red': '#ef4444',
        'gray': '#9ca3af',
        'grey': '#9ca3af'
    };

    let html = '';
    sortedData.forEach(comp => {
        let statusColor = statusColors.gray;
        let statusText = 'inactive';

        // Map status to display values
        if (comp.status === 'green') {
            statusColor = statusColors.green;
            statusText = 'online';
        } else if (comp.status === 'orange') {
            statusColor = statusColors.orange;
            statusText = 'degraded';
        } else if (comp.status === 'red') {
            statusColor = statusColors.red;
            statusText = 'offline';
        } else if (comp.status === 'grey' || !comp.status) {
            statusColor = statusColors.gray;
            statusText = comp.site_uid ? 'pending' : 'inactive';
        }

        html += `
            <tr>
                <td><code style="background:#e0f2fe;padding:2px 6px;border-radius:3px;font-size:0.8rem;color:#0369a1;border:1px solid #bae6fd;">${comp.site_uid || '-'}</code></td>
                <td><span style="display:inline-block;width:10px;height:10px;border-radius:50%;margin-right:8px;background:${statusColor};"></span>${statusText}</td>
                <td style="font-weight:500;">${comp.label || comp.component_key || '-'}</td>
                <td style="font-size:0.85rem;color:var(--text-secondary);">${comp.section || '-'}</td>
                <td style="font-size:0.85rem;color:var(--text-secondary);">${comp.type || '-'}</td>
                <td style="font-size:0.85rem;color:var(--text-secondary);">${comp.instance || comp.ip || '-'}</td>
                <td style="font-size:0.85rem;color:var(--text-secondary);max-width:200px;overflow:hidden;text-overflow:ellipsis;">${comp.notes || '-'}</td>
            </tr>
        `;
    });

    tbody.innerHTML = html || '<tr><td colspan="7" style="text-align: center; padding: 2rem;">No components found</td></tr>';
}

function sortLiveStatus(field) {
    if (liveStatusSortField === field) {
        liveStatusSortAsc = !liveStatusSortAsc;
    } else {
        liveStatusSortField = field;
        liveStatusSortAsc = true;
    }
    renderLiveStatus();
}

// ===== PULSE.SHOPNET - LIVE PULSE MONITORING =====
// Automatic pulse monitoring for registered endpoints
// Only endpoints with site_uid are monitored; others remain grey

/**
 * Run a pulse check on all endpoints with dynamic:* status
 * Calls Connect Gateway GET /api/v1/pulse/run
 */
async function runPulseCheck() {
    const runBtn = document.getElementById('pulse-run-btn');
    const statusBadge = document.getElementById('pulse-status-badge');
    const lastRunEl = document.getElementById('pulse-last-run');
    const resultsEl = document.getElementById('pulse-results');

    // Update UI to show running state
    if (runBtn) {
        runBtn.disabled = true;
        runBtn.innerHTML = PULSE_SVG + ' Running...';
    }
    if (statusBadge) {
        statusBadge.textContent = 'Running';
        statusBadge.style.background = '#3b82f6';
        statusBadge.style.color = 'white';
    }

    try {
        // Call the synchronous pulse endpoint for immediate results
        const response = await fetch('https://connect.shopnet.network/api/v1/pulse/run', {
            method: 'GET'
        });
        const data = await response.json();

        if (data.success) {
            // Update last run time
            if (lastRunEl) {
                lastRunEl.textContent = `Last check: ${toESTTime(data.checked_at)}`;
            }

            // Update status badge
            if (statusBadge) {
                statusBadge.textContent = 'Complete';
                statusBadge.style.background = '#22c55e';
                statusBadge.style.color = 'white';
                setTimeout(() => {
                    statusBadge.textContent = 'Idle';
                    statusBadge.style.background = 'var(--bg-tertiary)';
                    statusBadge.style.color = 'var(--text-secondary)';
                }, 3000);
            }

            // Show results summary
            if (resultsEl && data.results) {
                resultsEl.style.display = 'block';
                const green = data.results.filter(r => r.result.status === 'green').length;
                const orange = data.results.filter(r => r.result.status === 'orange').length;
                const red = data.results.filter(r => r.result.status === 'red').length;

                document.getElementById('pulse-total').textContent = data.checks_performed;
                document.getElementById('pulse-green').textContent = green;
                document.getElementById('pulse-orange').textContent = orange;
                document.getElementById('pulse-red').textContent = red;
            }

            // Refresh the Live Status table to show updated statuses
            await loadLiveStatus();

        } else {
            throw new Error(data.error || 'Pulse check failed');
        }

    } catch (error) {
        console.error('Pulse check error:', error);
        if (statusBadge) {
            statusBadge.textContent = 'Error';
            statusBadge.style.background = '#ef4444';
            statusBadge.style.color = 'white';
        }
    } finally {
        if (runBtn) {
            runBtn.disabled = false;
            runBtn.innerHTML = PULSE_SVG + ' Run Pulse Check';
        }
    }
}

/**
 * Run pulse check from Endpoint Registry panel
 * Merges pulse data into the registry table
 */
async function runRegistryPulseCheck() {
    const runBtn = document.getElementById('registry-pulse-btn');
    const lastRunEl = document.getElementById('registry-pulse-last');
    const resultsEl = document.getElementById('registry-pulse-results');

    if (runBtn) {
        runBtn.disabled = true;
        runBtn.style.opacity = '0.5';
        runBtn.title = 'Running...';
    }

    try {
        // Step 1: Run the pulse check
        const pulseResponse = await fetch('https://connect.shopnet.network/api/v1/pulse/run', {
            method: 'GET'
        });
        const pulseData = await pulseResponse.json();

        // Step 2: Fetch pulse status from DATABASE (THE LAW Feb 2026)
        // Database is source of truth for pulse results, not JSON
        const dbResponse = await fetch('https://connect.shopnet.network/api/v1/pulse/status/db');
        const dbData = await dbResponse.json();

        if (dbData.endpoints) {
            console.log('Database pulse endpoints:', dbData.endpoints.length);

            // Build a lookup map by site_uid from database results
            const pulseMap = {};
            dbData.endpoints.forEach(ep => {
                if (ep.site_uid) {
                    pulseMap[ep.site_uid] = {
                        // Map database field last_pulse_status to pulse_status
                        pulse_status: ep.last_pulse_status || 'grey',
                        pulse_latency: ep.last_pulse_latency_ms,
                        pulse_error: ep.last_pulse_error,
                        pulse_at: ep.last_pulse_at
                    };
                }
            });

            console.log('Pulse map keys:', Object.keys(pulseMap).length);
            console.log('Registry data site_uids:', endpointRegistryData.slice(0, 5).map(e => e.site_uid));

            // Merge pulse data into endpointRegistryData (THE LAW: database is source of truth)
            let matchCount = 0;
            endpointRegistryData = endpointRegistryData.map(ep => {
                const pulse = pulseMap[ep.site_uid];
                if (pulse) matchCount++;
                return {
                    ...ep,
                    pulse_status: pulse?.pulse_status || '',
                    pulse_latency: pulse?.pulse_latency || null,
                    pulse_error: pulse?.pulse_error || null,
                    pulse_at: pulse?.pulse_at || null
                };
            });
            console.log('Matched pulse records:', matchCount, 'of', endpointRegistryData.length);

            // Update results display
            if (resultsEl) {
                resultsEl.style.display = 'block';
                const green = endpointRegistryData.filter(e => e.pulse_status === 'green').length;
                const orange = endpointRegistryData.filter(e => e.pulse_status === 'orange').length;
                const red = endpointRegistryData.filter(e => e.pulse_status === 'red').length;
                const total = endpointRegistryData.filter(e => e.pulse_status).length;

                document.getElementById('registry-pulse-total').textContent = total;
                document.getElementById('registry-pulse-green').textContent = green;
                document.getElementById('registry-pulse-orange').textContent = orange;
                document.getElementById('registry-pulse-red').textContent = red;
            }

            // Re-render the table with pulse data
            renderEndpointRegistry();
        }

        if (lastRunEl) {
            lastRunEl.textContent = `Last: ${new Date().toLocaleTimeString()}`;
        }

    } catch (error) {
        console.error('Registry pulse check error:', error);
    } finally {
        if (runBtn) {
            runBtn.disabled = false;
            runBtn.style.opacity = '1';
            runBtn.title = 'Run Pulse Check';
        }
    }
}

/**
 * Set the check interval for a specific endpoint type
 * @param {string} checkType - Type: http, http_ondemand, db, agent
 * @param {string} seconds - Interval in seconds, or "0" for manual only
 */
async function setPulseInterval(checkType, seconds) {
    try {
        const response = await fetch('https://connect.shopnet.network/api/v1/pulse/config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                check_type: checkType,
                interval_seconds: parseInt(seconds, 10)
            })
        });
        const data = await response.json();

        if (data.success) {
            console.log(`Pulse interval for ${checkType} set to ${seconds}s`);
        } else {
            console.error('Failed to update pulse interval:', data);
        }
    } catch (error) {
        console.error('Error setting pulse interval:', error);
    }
}

/**
 * Load current pulse configuration from Connect Gateway
 */
async function loadPulseConfig() {
    try {
        const response = await fetch('https://connect.shopnet.network/api/v1/pulse/config');
        const data = await response.json();

        if (data.intervals) {
            // Update dropdowns to match server config - both Live Pulse and Endpoint Registry panels
            for (const [checkType, interval] of Object.entries(data.intervals)) {
                // Live Pulse panel dropdowns
                const select = document.getElementById(`pulse-interval-${checkType}`);
                if (select) {
                    select.value = interval.toString();
                }
                // Endpoint Registry panel dropdowns
                const regSelect = document.getElementById(`reg-pulse-interval-${checkType}`);
                if (regSelect) {
                    regSelect.value = interval.toString();
                }
            }
        }

        // Update last run time on both panels
        if (data.last_run) {
            const lastRunEl = document.getElementById('pulse-last-run');
            if (lastRunEl) {
                lastRunEl.textContent = `Last check: ${toESTTime(data.last_run)}`;
            }
            const regLastRunEl = document.getElementById('registry-pulse-last');
            if (regLastRunEl) {
                regLastRunEl.textContent = `Last: ${toESTTime(data.last_run)}`;
            }
        }
    } catch (error) {
        console.error('Error loading pulse config:', error);
    }
}

// ===== ENDPOINT ADDER WIZARD (THE LAW) =====

let endpointWizardStep = 1;
let endpointWizardData = {};

// Platform options by endpoint type (THE LAW taxonomy v3.5)
// FALLBACK values — overwritten by loadPlatformOptions() from taxonomy_definition API
// Source of truth: taxonomy_definition table in shopnet_sites DB
let PLATFORM_OPTIONS = {
    'W': [
        { value: 'CO', label: 'CloudFront On-Demand (CO)', desc: 'Lambda-backed, scales to zero' },
        { value: 'CP', label: 'CloudFront Persistent (CP)', desc: 'nginx on EC2, always running' },
        { value: 'WP', label: 'WordPress (WP)', desc: 'PHP on EC2 with WordPress' },
        { value: 'SH', label: 'Shopify (SH)', desc: 'External Shopify store' },
        { value: 'WW', label: 'WooCommerce (WW)', desc: 'WordPress with WooCommerce' },
        { value: 'CL', label: 'Custom Lambda (CL)', desc: 'Custom Lambda function' },
        { value: 'S3', label: 'S3 Static (S3)', desc: 'Static files on S3' },
        { value: 'LM', label: 'Lightsail (LM)', desc: 'Amazon Lightsail instance' },
        { value: 'L3', label: 'Layer3 Web3 (L3)', desc: 'Lambda@Edge with IP certs for emoji TLDs' },
    ],
    'A': [
        { value: 'CL', label: 'Claude Agent (CL)', desc: 'Anthropic Claude-based agent' },
        { value: 'GP', label: 'GPT Agent (GP)', desc: 'OpenAI GPT-based agent' },
        { value: 'GM', label: 'Gemini Agent (GM)', desc: 'Google Gemini-based agent' },
        { value: 'CA', label: 'Custom Agent (CA)', desc: 'Custom AI agent implementation' },
        { value: 'OT', label: 'Other Agent (OT)', desc: 'Other AI agent' },
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
        { value: 'AGW', label: 'API Gateway (AGW)', desc: 'Amazon API Gateway' },
        { value: 'CF', label: 'CloudFront Distribution (CF)', desc: 'Amazon CloudFront CDN distribution' },
        { value: 'EC2', label: 'EC2 Instance (EC2)', desc: 'Amazon EC2 virtual server' },
        { value: 'LMB', label: 'Lambda Function (LMB)', desc: 'Standalone Lambda' },
        { value: 'LS', label: 'Lightsail Instance (LS)', desc: 'Amazon Lightsail virtual server' },
        { value: 'RDS', label: 'RDS Instance (RDS)', desc: 'Amazon RDS database server instance' },
        { value: 'S3B', label: 'S3 Bucket (S3B)', desc: 'S3 storage bucket' },
        { value: 'SNS', label: 'SNS Topic (SNS)', desc: 'Notification topic' },
        { value: 'SQS', label: 'SQS Queue (SQS)', desc: 'Message queue' },
    ],
    'O': [
        { value: 'OTH', label: 'Other (OTH)', desc: 'Uncategorized endpoint' },
    ]
};

/**
 * Load platform options from taxonomy_definition table via API.
 * THE LAW: taxonomy_definition is the source of truth.
 * Falls back to hardcoded PLATFORM_OPTIONS if API is unavailable.
 */
async function loadPlatformOptions() {
    try {
        const response = await fetch('/api/brochure/taxonomy-definitions/platform-options');
        if (!response.ok) {
            console.warn('Failed to load platform options from API, using hardcoded fallback');
            return;
        }
        const data = await response.json();
        if (data.success && data.platform_options) {
            PLATFORM_OPTIONS = data.platform_options;
            console.log('Platform options loaded from taxonomy_definition:',
                Object.keys(PLATFORM_OPTIONS).map(k => `${k}:${PLATFORM_OPTIONS[k].length}`).join(', '));
        }
    } catch (error) {
        console.warn('Error loading platform options, using hardcoded fallback:', error.message);
    }
}

// TAXONOMY LABELS — display names for taxonomy codes
// FALLBACK values — overwritten by loadTaxonomyLabels() from taxonomy_definition API
// Source of truth: taxonomy_definition table in shopnet_sites DB
let TAXONOMY_LABELS = {
    'endpoint_type': { 'W': 'Website', 'A': 'Agent', 'D': 'Database', 'N': 'Node', 'I': 'Infrastructure', 'O': 'Other' },
    'managed_by': { 'R': 'Radius', 'L': 'Lambda', 'M': 'Manual', 'E': 'External' },
    'persistence': { 'P': 'Persistent', 'D': 'On-Demand' },
    'status': { 'planned': 'Planned', 'wip': 'Work in Progress', 'live': 'Live' },
    'console_section': {
        'brochure': 'Brochure Sites', 'products': 'Product Stores', 'domains': 'Domain Stores',
        'data.shopnet': 'Data Layer', 'assist.shopnet': 'AI Agents', 'network-nodes': 'Network Nodes',
        'web3-gateways': 'Web3 Gateways', 'infrastructure': 'Infrastructure',
        'shopnet.network': 'Core Platform', 'connect.shopnet': 'Connect Services'
    }
};

/**
 * Load taxonomy labels from taxonomy_definition table via API.
 * THE LAW: taxonomy_definition is the source of truth.
 * Falls back to hardcoded TAXONOMY_LABELS if API is unavailable.
 */
async function loadTaxonomyLabels() {
    try {
        const response = await fetch('/api/brochure/taxonomy-definitions/labels');
        if (!response.ok) {
            console.warn('Failed to load taxonomy labels from API, using hardcoded fallback');
            return;
        }
        const data = await response.json();
        if (data.success && data.labels) {
            TAXONOMY_LABELS = data.labels;
            console.log('Taxonomy labels loaded from taxonomy_definition:',
                Object.keys(TAXONOMY_LABELS).map(k => `${k}:${Object.keys(TAXONOMY_LABELS[k]).length}`).join(', '));
        }
    } catch (error) {
        console.warn('Error loading taxonomy labels, using hardcoded fallback:', error.message);
    }
}

// Pulse method auto-determination based on endpoint_type and platform_type
// Dynamic: reads pulse_method from PLATFORM_OPTIONS (loaded from taxonomy_definition API)
// Fallback: hardcoded defaults if PLATFORM_OPTIONS doesn't have pulse_method yet
function getPulseMethod(endpointType, platformType) {
    // Dynamic lookup from taxonomy_definition (THE LAW source of truth)
    const options = PLATFORM_OPTIONS[endpointType] || [];
    const match = options.find(opt => opt.value === platformType);
    if (match && match.pulse_method) {
        return match.pulse_method;
    }

    // Hardcoded fallback (used if API hasn't loaded yet or pulse_method not populated)
    if (endpointType === 'W') {
        if (platformType === 'L3') return 'http_web3';
        if (platformType === 'CO' || platformType === 'CL') return 'http_ondemand';
        if (platformType === 'SH' || platformType === 'WP' || platformType === 'WW') return 'http_store';
        return 'http';
    }
    if (endpointType === 'A') return 'agent';
    if (endpointType === 'D') {
        if (platformType === 'RD') return 'db';
        if (platformType === 'GIT') return 'github';
        if (platformType === 'S3') return 'fileserver';
        return 'api';
    }
    if (endpointType === 'N') return 'api';
    if (endpointType === 'I') {
        if (platformType === 'LS' || platformType === 'EC2') return 'PING';
        if (platformType === 'RDS') return 'db';
        if (platformType === 'S3B') return 'fileserver';
        return 'api';
    }
    return 'http';
}

// Update pulse fields in wizard based on endpoint_type and platform_type
function updatePulseFields(prefix = 'endpoint') {
    const endpointType = prefix === 'endpoint' ? endpointWizardData.endpoint_type : editorWizardData.endpoint_type;
    const platformType = prefix === 'endpoint' ? endpointWizardData.platform_type : editorWizardData.platform_type;
    const pulseMethod = getPulseMethod(endpointType, platformType);

    const methodField = document.getElementById(`${prefix}-pulse-method`);
    const enabledField = document.getElementById(`${prefix}-pulse-enabled`);

    if (methodField) methodField.value = pulseMethod;
    if (enabledField) enabledField.value = 'true';
}

/**
 * Load secrets from Connect Gateway into Auth Reference dropdowns.
 * Called when Add/Change Endpoint wizards open.
 * THE LAW (Feb 2026): Secrets stored in shopnet_connect.secrets
 * Security: Only shows key names (configured), never reveals values
 */
async function loadSecretsIntoDropdowns() {
    try {
        const response = await fetch(`${CONNECT_API_URL}/api/v1/secrets/keys`);
        if (!response.ok) {
            console.warn('Failed to load secrets, auth dropdown will show None only');
            return;
        }
        const data = await response.json();
        const secrets = data.secrets || [];

        // Populate both Add and Edit wizard dropdowns
        ['endpoint-pulse-auth-ref', 'editor-pulse-auth-ref'].forEach(dropdownId => {
            const dropdown = document.getElementById(dropdownId);
            if (dropdown) {
                // Keep "None" option, add secrets with (configured) indicator, then "Create new..."
                dropdown.innerHTML = '<option value="">None (public endpoint)</option>';
                secrets.forEach(s => {
                    const opt = document.createElement('option');
                    opt.value = s.key;
                    // Show key name with (configured) - never shows actual value
                    opt.textContent = `${s.key} (configured)`;
                    dropdown.appendChild(opt);
                });
                // Add "Create new..." option at end
                const createOpt = document.createElement('option');
                createOpt.value = '__CREATE_NEW__';
                createOpt.textContent = '+ Create new secret...';
                dropdown.appendChild(createOpt);
            }
        });
    } catch (error) {
        console.warn('Error loading secrets for dropdown:', error.message);
    }
}

/**
 * Toggle the new secret input form when "Create new..." is selected.
 * Also handles showing "Replace value" option when existing secret is selected.
 */
function toggleSecretInput(prefix) {
    const dropdown = document.getElementById(`${prefix}-pulse-auth-ref`);
    const form = document.getElementById(`${prefix}-new-secret-form`);
    const keyInput = document.getElementById(`${prefix}-secret-key`);

    if (!dropdown || !form) return;

    if (dropdown.value === '__CREATE_NEW__') {
        form.style.display = 'block';
        if (keyInput) keyInput.value = '';  // Clear for new entry
        keyInput.readOnly = false;
    } else if (dropdown.value && dropdown.value !== '') {
        // Existing secret selected - show form to optionally replace value
        form.style.display = 'block';
        if (keyInput) {
            keyInput.value = dropdown.value;  // Pre-fill with existing key
            keyInput.readOnly = true;  // Can't change the key name
        }
    } else {
        form.style.display = 'none';
    }
}

async function openEndpointAdderWizard() {
    endpointWizardStep = 1;
    endpointWizardData = {};

    // Reset all steps
    document.querySelectorAll('.endpoint-wizard-step').forEach(step => step.style.display = 'none');
    document.getElementById('endpoint-step-1').style.display = 'block';

    // Reset progress indicators
    document.querySelectorAll('.wizard-step-indicator').forEach((indicator, i) => {
        const stepNum = indicator.querySelector('.step-number');
        if (i === 0) {
            stepNum.style.background = '#3b82f6';
            stepNum.style.color = 'white';
        } else {
            stepNum.style.background = '#e5e7eb';
            stepNum.style.color = '#6b7280';
        }
    });

    // Reset buttons
    document.getElementById('endpoint-wizard-prev').style.display = 'none';
    document.getElementById('endpoint-wizard-next').style.display = 'inline-block';
    document.getElementById('endpoint-wizard-submit').style.display = 'none';

    // Reset form inputs
    document.querySelectorAll('input[name="endpoint_type"]').forEach(r => r.checked = false);
    document.querySelectorAll('.endpoint-type-card').forEach(c => c.style.borderColor = 'var(--border)');

    // Load from taxonomy_definition (THE LAW source of truth)
    await loadPlatformOptions();
    await loadTaxonomyLabels();

    // Load secrets for auth reference dropdown
    loadSecretsIntoDropdowns();

    // Show modal
    document.getElementById('endpointAdderModal').style.display = 'flex';
}

function closeEndpointAdderWizard() {
    document.getElementById('endpointAdderModal').style.display = 'none';
}

function endpointWizardNext() {
    // Validate current step
    if (endpointWizardStep === 1) {
        const selectedType = document.querySelector('input[name="endpoint_type"]:checked');
        if (!selectedType) {
            showToast('Please select an endpoint type', 'error');
            return;
        }
        endpointWizardData.endpoint_type = selectedType.value;
        populatePlatformOptions(selectedType.value);
    } else if (endpointWizardStep === 2) {
        const selectedPlatform = document.querySelector('input[name="platform_type"]:checked');
        if (!selectedPlatform) {
            showToast('Please select a platform type', 'error');
            return;
        }
        endpointWizardData.platform_type = selectedPlatform.value;
        // Update pulse fields based on endpoint_type + platform_type
        updatePulseFields('endpoint');
    } else if (endpointWizardStep === 3) {
        const domain = document.getElementById('endpoint-domain').value.trim();
        if (!domain) {
            showToast('Domain name is required', 'error');
            return;
        }
        endpointWizardData.domain_name = domain;
        endpointWizardData.display_name = document.getElementById('endpoint-display-name').value.trim() || domain;
        endpointWizardData.managed_by = document.getElementById('endpoint-managed-by').value;
        endpointWizardData.persistence = document.getElementById('endpoint-persistence').value;
        endpointWizardData.runtime = document.getElementById('endpoint-runtime').value;
        endpointWizardData.host = document.getElementById('endpoint-host').value;
        endpointWizardData.notes = document.getElementById('endpoint-notes').value.trim();
        endpointWizardData.status = document.getElementById('endpoint-status').value;
        endpointWizardData.website_purpose = document.getElementById('endpoint-website-purpose')?.value || null;

        // Collect pulse fields (pulse_url and pulse_auth_ref are user-editable, others are auto-populated)
        endpointWizardData.pulse_url = document.getElementById('endpoint-pulse-url')?.value.trim() || null;
        endpointWizardData.pulse_method = document.getElementById('endpoint-pulse-method')?.value || 'http';
        endpointWizardData.pulse_enabled = true;

        // Handle auth reference - either existing key or new secret creation
        const authRefValue = document.getElementById('endpoint-pulse-auth-ref')?.value;
        if (authRefValue === '__CREATE_NEW__' || (authRefValue && document.getElementById('endpoint-secret-value')?.value)) {
            // New secret or replacement value - collect form data
            const secretKey = document.getElementById('endpoint-secret-key')?.value.trim();
            const secretValue = document.getElementById('endpoint-secret-value')?.value;
            if (secretKey && secretValue) {
                endpointWizardData._newSecret = {
                    key: secretKey,
                    value: secretValue,
                    type: document.getElementById('endpoint-secret-type')?.value || 'token',
                    description: document.getElementById('endpoint-secret-desc')?.value.trim() || ''
                };
                endpointWizardData.pulse_auth_ref = secretKey;
            } else if (authRefValue !== '__CREATE_NEW__') {
                // Existing key selected but no new value - keep the key
                endpointWizardData.pulse_auth_ref = authRefValue;
            } else {
                endpointWizardData.pulse_auth_ref = null;
            }
        } else {
            endpointWizardData.pulse_auth_ref = authRefValue || null;
        }

        // Auto-select console section based on taxonomy
        autoSelectConsoleSection();
    } else if (endpointWizardStep === 4) {
        // Collect console card configuration
        endpointWizardData.console_section = document.getElementById('endpoint-console-section').value;
        endpointWizardData.card_label = document.getElementById('endpoint-card-label').value.trim() || endpointWizardData.domain_name;
        endpointWizardData.show_on_map = document.getElementById('endpoint-show-on-map').checked;

        // Populate confirmation
        populateConfirmation();
    }

    // Move to next step
    endpointWizardStep++;
    updateWizardUI();
}

function endpointWizardPrev() {
    if (endpointWizardStep > 1) {
        endpointWizardStep--;
        updateWizardUI();
    }
}

function updateWizardUI() {
    // Hide all steps, show current
    document.querySelectorAll('.endpoint-wizard-step').forEach(step => step.style.display = 'none');
    document.getElementById(`endpoint-step-${endpointWizardStep}`).style.display = 'block';

    // Update progress indicators
    document.querySelectorAll('.wizard-step-indicator').forEach((indicator, i) => {
        const stepNum = indicator.querySelector('.step-number');
        const connector = indicator.nextElementSibling;

        if (i + 1 <= endpointWizardStep) {
            stepNum.style.background = '#3b82f6';
            stepNum.style.color = 'white';
            if (connector && connector.classList.contains('wizard-connector') && i + 1 < endpointWizardStep) {
                connector.style.background = '#3b82f6';
            }
        } else {
            stepNum.style.background = '#e5e7eb';
            stepNum.style.color = '#6b7280';
        }
    });

    // Update buttons (5 steps now)
    document.getElementById('endpoint-wizard-prev').style.display = endpointWizardStep > 1 ? 'inline-block' : 'none';
    document.getElementById('endpoint-wizard-next').style.display = endpointWizardStep < 5 ? 'inline-block' : 'none';
    document.getElementById('endpoint-wizard-submit').style.display = endpointWizardStep === 5 ? 'inline-block' : 'none';
}

// Auto-select console section based on taxonomy (THE LAW v3.5)
function autoSelectConsoleSection() {
    const endpointType = endpointWizardData.endpoint_type;
    const platformType = endpointWizardData.platform_type;
    const websitePurpose = endpointWizardData.website_purpose;

    // Section mapping based on THE LAW taxonomy v3.5
    let section = 'brochure'; // default

    if (endpointType === 'W') {
        switch (websitePurpose) {
            case 'brochure': section = 'brochure'; break;
            case 'product_store': section = 'products'; break;
            case 'domain_store': section = 'domains'; break;
            case 'portal':
            case 'console': section = 'shopnet.network'; break;
            default: section = 'brochure';
        }
    } else if (endpointType === 'A') {
        section = 'assist.shopnet';
    } else if (endpointType === 'D') {
        section = 'data.shopnet';
    } else if (endpointType === 'N') {
        // Node: W3G goes to web3-gateways, others to network-nodes
        section = platformType === 'W3G' ? 'web3-gateways' : 'network-nodes';
    } else if (endpointType === 'I') {
        section = 'infrastructure';
    } else if (endpointType === 'O') {
        section = 'shopnet.network';
    }

    // Set the dropdown
    const sectionSelect = document.getElementById('endpoint-console-section');
    if (sectionSelect) {
        sectionSelect.value = section;
        updateCardPreview();
    }
}

// Update card preview in step 4
function updateCardPreview() {
    const section = document.getElementById('endpoint-console-section')?.value || 'brochure';
    const status = endpointWizardData.status || 'planned';

    const sectionNames = {
        'brochure': 'Brochure Sites',
        'products': 'Product Stores',
        'domains': 'Domain Stores',
        'data.shopnet': 'Data Layer',
        'assist.shopnet': 'AI Agents',
        'network-nodes': 'Network Nodes',
        'web3-gateways': 'Web3 Gateways',
        'infrastructure': 'Infrastructure',
        'shopnet.network': 'Core Platform'
    };

    const statusInfo = {
        'planned': { color: '#9ca3af', text: 'Grey (Placeholder)' },
        'wip': { color: '#f59e0b', text: 'Orange (Work in Progress)' },
        'live': { color: '#22c55e', text: 'Green (Live - health checked)' }
    };

    const previewSection = document.getElementById('preview-section-name');
    const previewDot = document.getElementById('preview-status-dot');
    const previewText = document.getElementById('preview-status-text');

    if (previewSection) previewSection.textContent = sectionNames[section] || section;
    if (previewDot) previewDot.style.background = statusInfo[status]?.color || '#9ca3af';
    if (previewText) previewText.textContent = statusInfo[status]?.text || 'Unknown';
}

function populatePlatformOptions(endpointType) {
    const container = document.getElementById('platform-options-container');
    const options = PLATFORM_OPTIONS[endpointType] || [];

    let html = '<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">';
    options.forEach(opt => {
        html += `
            <label class="platform-type-card" style="border: 2px solid var(--border); border-radius: 8px; padding: 1rem; cursor: pointer; transition: all 0.2s;">
                <input type="radio" name="platform_type" value="${opt.value}" style="display: none;">
                <div>
                    <div style="font-weight: 600;">${opt.label}</div>
                    <div style="color: var(--text-muted); font-size: 0.875rem;">${opt.desc}</div>
                </div>
            </label>
        `;
    });
    html += '</div>';
    container.innerHTML = html;

    // Add click handlers for visual feedback
    container.querySelectorAll('.platform-type-card').forEach(card => {
        card.addEventListener('click', () => {
            container.querySelectorAll('.platform-type-card').forEach(c => c.style.borderColor = 'var(--border)');
            card.style.borderColor = '#3b82f6';
        });
    });
}

function populateConfirmation() {
    // Dynamic labels from taxonomy_definition (loaded by loadTaxonomyLabels())
    const typeLabels = TAXONOMY_LABELS['endpoint_type'] || {};
    const managedByLabels = TAXONOMY_LABELS['managed_by'] || {};
    const persistenceLabels = TAXONOMY_LABELS['persistence'] || {};
    const statusLabels = TAXONOMY_LABELS['status'] || {};
    const sectionLabels = TAXONOMY_LABELS['console_section'] || {};

    document.getElementById('confirm-endpoint-type').textContent = `${typeLabels[endpointWizardData.endpoint_type] || endpointWizardData.endpoint_type} (${endpointWizardData.endpoint_type})`;
    document.getElementById('confirm-platform-type').textContent = endpointWizardData.platform_type;
    document.getElementById('confirm-domain').textContent = endpointWizardData.domain_name;
    document.getElementById('confirm-display-name').textContent = endpointWizardData.display_name;
    document.getElementById('confirm-managed-by').textContent = managedByLabels[endpointWizardData.managed_by] || endpointWizardData.managed_by;
    document.getElementById('confirm-persistence').textContent = persistenceLabels[endpointWizardData.persistence] || endpointWizardData.persistence;
    document.getElementById('confirm-runtime').textContent = endpointWizardData.runtime;
    document.getElementById('confirm-host').textContent = endpointWizardData.host;
    document.getElementById('confirm-status').textContent = statusLabels[endpointWizardData.status] || endpointWizardData.status;
    document.getElementById('confirm-console-section').textContent = sectionLabels[endpointWizardData.console_section] || endpointWizardData.console_section;
}

async function submitEndpointWizard() {
    try {
        // Store secret data temporarily - will be created AFTER we get site_uid
        const pendingSecret = endpointWizardData._newSecret;
        delete endpointWizardData._newSecret;

        // Determine section based on endpoint type and console section (THE LAW mapping)
        let section;
        if (endpointWizardData.endpoint_type === 'D') {
            section = 'data.shopnet';
        } else if (endpointWizardData.endpoint_type === 'A') {
            section = 'assist.shopnet';
        } else if (endpointWizardData.endpoint_type === 'N') {
            // Node: use console_section (web3-gateways or network-nodes)
            section = endpointWizardData.console_section || 'network-nodes';
        } else if (endpointWizardData.endpoint_type === 'I') {
            section = 'infrastructure';
        } else if (endpointWizardData.endpoint_type === 'O') {
            section = 'shopnet.network';
        } else {
            // Website - use console section or default to brochure
            section = endpointWizardData.console_section || 'brochure';
        }

        // Step 1: Get a new site_uid from Connect Gateway (THE LAW - Connect Gateway is ONLY authority)
        let siteUid = null;
        try {
            const uidResponse = await fetch(`${CONNECT_API_URL}/api/v1/site-uid/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    domain_name: endpointWizardData.domain_name,
                    section: section,
                    endpoint_type: endpointWizardData.endpoint_type,
                    platform_type: endpointWizardData.platform_type,
                    assigned_by: 'console_wizard'
                })
            });

            if (!uidResponse.ok) {
                const errorData = await uidResponse.json().catch(() => ({}));
                throw new Error(errorData.detail || `Connect Gateway returned ${uidResponse.status}`);
            }

            const uidData = await uidResponse.json();
            if (uidData.site_uid) {
                siteUid = uidData.site_uid;
            } else {
                throw new Error('Connect Gateway did not return a site_uid');
            }
        } catch (e) {
            // THE LAW: Connect Gateway is the ONLY authority - do NOT generate local IDs
            console.error('Connect Gateway error:', e);
            showToast(`Cannot create endpoint: Connect Gateway unavailable. ${e.message}`, 'error');
            return; // Exit without creating endpoint
        }

        endpointWizardData.site_uid = siteUid;

        // Step 1.5: Create secret if provided (now that we have site_uid)
        // THE LAW (Feb 2026): Secrets MUST be associated with a site_uid
        if (pendingSecret) {
            try {
                const secretResponse = await fetch(`${CONNECT_API_URL}/api/v1/secrets`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        secret_key: pendingSecret.key,
                        secret_value: pendingSecret.value,
                        secret_type: pendingSecret.type,
                        description: pendingSecret.description,
                        site_uid: siteUid,
                        created_by: sessionStorage.getItem('console_user_email') || 'console'
                    })
                });
                if (!secretResponse.ok) {
                    const errData = await secretResponse.json().catch(() => ({}));
                    throw new Error(errData.detail || 'Failed to create secret');
                }
                showToast(`Secret "${pendingSecret.key}" created for ${siteUid}`, 'success');
            } catch (secretError) {
                showToast(`Error creating secret: ${secretError.message}`, 'error');
                // Continue - endpoint can still work without the secret
            }
        }

        // Add created_by from logged-in user (THE LAW audit trail)
        endpointWizardData.created_by = sessionStorage.getItem('console_user_email') || 'unknown';

        // Step 2: Create taxonomy record in local RDS via Console API
        const taxonomyResponse = await fetch('/api/brochure/taxonomy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(endpointWizardData)
        });
        const taxonomyData = await taxonomyResponse.json();

        if (taxonomyData.success) {
            showToast(`Endpoint created: ${siteUid}`, 'success');
            closeEndpointAdderWizard();

            // Refresh the endpoint registry if visible
            if (typeof loadEndpointRegistry === 'function') {
                loadEndpointRegistry();
            }
            // Also refresh site cards
            if (typeof loadBrochureSites === 'function') {
                loadBrochureSites();
            }
        } else {
            throw new Error(taxonomyData.error || 'Failed to create endpoint');
        }
    } catch (error) {
        console.error('Error creating endpoint:', error);
        showToast(`Error: ${error.message}`, 'error');
    }
}

// ===== ENDPOINT EDITOR WIZARD (Change Endpoint - THE LAW) =====

let editorWizardStep = 1;
let editorWizardData = {};
let editorOriginalData = {}; // Store original for comparison

async function openEndpointEditorWizard(siteUid) {
    if (!siteUid) {
        showToast('No site_uid provided', 'error');
        return;
    }

    editorWizardStep = 1;
    editorWizardData = {};
    editorOriginalData = {};

    // Fetch existing endpoint data
    try {
        const response = await fetch(`/api/brochure/taxonomy/${siteUid}`);
        const data = await response.json();

        if (!data.success || !data.taxonomy) {
            showToast(`Endpoint not found: ${siteUid}`, 'error');
            return;
        }

        editorOriginalData = { ...data.taxonomy };
        editorWizardData = { ...data.taxonomy };

        // Display site_uid (read-only)
        document.getElementById('editor-site-uid').textContent = siteUid;

        // Reset all steps
        document.querySelectorAll('.editor-wizard-step').forEach(s => s.style.display = 'none');
        document.getElementById('editor-step-1').style.display = 'block';

        // Pre-select endpoint type
        document.querySelectorAll('input[name="editor_endpoint_type"]').forEach(radio => {
            radio.checked = radio.value === editorWizardData.endpoint_type;
            const card = radio.closest('.editor-type-card');
            if (card) {
                card.style.borderColor = radio.checked ? '#eab308' : 'var(--border)';
            }
        });

        // Reset progress indicators
        updateEditorWizardProgress();

        // Load from taxonomy_definition (THE LAW source of truth)
        await loadPlatformOptions();
        await loadTaxonomyLabels();

        // Load secrets for auth reference dropdown
        await loadSecretsIntoDropdowns();

        // Show modal
        document.getElementById('endpointEditorModal').style.display = 'flex';

    } catch (error) {
        console.error('Error loading endpoint:', error);
        showToast(`Error loading endpoint: ${error.message}`, 'error');
    }
}

function closeEndpointEditorWizard() {
    document.getElementById('endpointEditorModal').style.display = 'none';
}

function editorWizardNext() {
    // Validate current step
    if (editorWizardStep === 1) {
        const selectedType = document.querySelector('input[name="editor_endpoint_type"]:checked');
        if (!selectedType) {
            showToast('Please select an endpoint type', 'error');
            return;
        }
        editorWizardData.endpoint_type = selectedType.value;
        populateEditorPlatformOptions(editorWizardData.endpoint_type);
    } else if (editorWizardStep === 2) {
        const selectedPlatform = document.querySelector('input[name="editor_platform_type"]:checked');
        if (!selectedPlatform) {
            showToast('Please select a platform type', 'error');
            return;
        }
        editorWizardData.platform_type = selectedPlatform.value;
        // Pre-fill form fields with existing data
        prefillEditorDetailsForm();
        // Update pulse fields based on endpoint_type + platform_type
        updatePulseFields('editor');
    } else if (editorWizardStep === 3) {
        // Collect form data
        const domain = document.getElementById('editor-domain').value.trim();
        if (!domain) {
            showToast('Domain name is required', 'error');
            return;
        }
        editorWizardData.domain_name = domain;
        editorWizardData.display_name = document.getElementById('editor-display-name').value.trim() || domain;
        editorWizardData.managed_by = document.getElementById('editor-managed-by').value;
        editorWizardData.persistence = document.getElementById('editor-persistence').value;
        editorWizardData.runtime = document.getElementById('editor-runtime').value;
        editorWizardData.host = document.getElementById('editor-host').value;
        editorWizardData.notes = document.getElementById('editor-notes').value.trim();
        editorWizardData.status = document.getElementById('editor-status').value;
        editorWizardData.website_purpose = document.getElementById('editor-website-purpose')?.value || null;

        // Collect pulse fields (pulse_url and pulse_auth_ref are user-editable, others are auto-populated)
        editorWizardData.pulse_url = document.getElementById('editor-pulse-url')?.value.trim() || null;
        editorWizardData.pulse_method = document.getElementById('editor-pulse-method')?.value || 'http';
        editorWizardData.pulse_enabled = true;

        // Handle auth reference - either existing key or new/replacement secret
        const authRefValue = document.getElementById('editor-pulse-auth-ref')?.value;
        if (authRefValue === '__CREATE_NEW__' || (authRefValue && document.getElementById('editor-secret-value')?.value)) {
            // New secret or replacement value - collect form data
            const secretKey = document.getElementById('editor-secret-key')?.value.trim();
            const secretValue = document.getElementById('editor-secret-value')?.value;
            if (secretKey && secretValue) {
                editorWizardData._newSecret = {
                    key: secretKey,
                    value: secretValue,
                    type: document.getElementById('editor-secret-type')?.value || 'token',
                    description: document.getElementById('editor-secret-desc')?.value.trim() || ''
                };
                editorWizardData.pulse_auth_ref = secretKey;
            } else if (authRefValue !== '__CREATE_NEW__') {
                // Existing key selected but no new value - keep the key
                editorWizardData.pulse_auth_ref = authRefValue;
            } else {
                editorWizardData.pulse_auth_ref = null;
            }
        } else {
            editorWizardData.pulse_auth_ref = authRefValue || null;
        }

        // Auto-determine console section and pre-fill
        prefillEditorConsoleSectionForm();
    } else if (editorWizardStep === 4) {
        // Collect console card config
        editorWizardData.console_section = document.getElementById('editor-console-section').value;
        editorWizardData.card_label = document.getElementById('editor-card-label').value.trim() || editorWizardData.domain_name;
        editorWizardData.show_on_map = document.getElementById('editor-show-on-map').checked;

        // Populate confirmation screen
        populateEditorConfirmation();
    }

    editorWizardStep++;
    updateEditorWizardProgress();
}

function editorWizardPrev() {
    if (editorWizardStep > 1) {
        editorWizardStep--;
        updateEditorWizardProgress();
    }
}

function updateEditorWizardProgress() {
    // Hide all steps
    document.querySelectorAll('.editor-wizard-step').forEach(s => s.style.display = 'none');
    // Show current step
    document.getElementById(`editor-step-${editorWizardStep}`).style.display = 'block';

    // Update progress indicators
    document.querySelectorAll('.editor-step-indicator').forEach((indicator, i) => {
        const stepNum = indicator.querySelector('.step-number');
        const connector = indicator.nextElementSibling;
        if (i + 1 <= editorWizardStep) {
            stepNum.style.background = '#eab308';
            stepNum.style.color = 'black';
            if (connector && connector.classList.contains('wizard-connector') && i + 1 < editorWizardStep) {
                connector.style.background = '#eab308';
            }
        } else {
            stepNum.style.background = '#e5e7eb';
            stepNum.style.color = '#6b7280';
            if (connector && connector.classList.contains('wizard-connector')) {
                connector.style.background = '#e5e7eb';
            }
        }
    });

    // Update buttons
    document.getElementById('editor-wizard-prev').style.display = editorWizardStep > 1 ? 'inline-block' : 'none';
    document.getElementById('editor-wizard-next').style.display = editorWizardStep < 5 ? 'inline-block' : 'none';
    document.getElementById('editor-wizard-submit').style.display = editorWizardStep === 5 ? 'inline-block' : 'none';
}

function populateEditorPlatformOptions(endpointType) {
    const container = document.getElementById('editor-platform-options-container');
    const options = PLATFORM_OPTIONS[endpointType] || [];

    let html = '<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem;">';
    options.forEach(opt => {
        const isSelected = opt.value === editorWizardData.platform_type;
        html += `
            <label class="editor-platform-card" style="border: 2px solid ${isSelected ? '#eab308' : 'var(--border)'}; border-radius: 8px; padding: 1rem; cursor: pointer; transition: all 0.2s;">
                <input type="radio" name="editor_platform_type" value="${opt.value}" ${isSelected ? 'checked' : ''} style="display: none;">
                <div style="font-weight: 600;">${opt.label}</div>
                <div style="color: var(--text-muted); font-size: 0.875rem;">${opt.desc}</div>
            </label>
        `;
    });
    html += '</div>';
    container.innerHTML = html;

    // Add click handlers
    container.querySelectorAll('.editor-platform-card').forEach(card => {
        card.addEventListener('click', () => {
            container.querySelectorAll('.editor-platform-card').forEach(c => c.style.borderColor = 'var(--border)');
            card.style.borderColor = '#eab308';
        });
    });
}

function prefillEditorDetailsForm() {
    document.getElementById('editor-domain').value = editorWizardData.domain_name || '';
    document.getElementById('editor-display-name').value = editorWizardData.display_name || '';
    document.getElementById('editor-managed-by').value = editorWizardData.managed_by || 'M';
    document.getElementById('editor-persistence').value = editorWizardData.persistence || 'P';
    document.getElementById('editor-runtime').value = editorWizardData.runtime || 'external';
    document.getElementById('editor-host').value = editorWizardData.host || 'external';
    document.getElementById('editor-status').value = editorWizardData.status || 'live';
    document.getElementById('editor-notes').value = editorWizardData.notes || '';

    // Website purpose (only for W type)
    const purposeGroup = document.getElementById('editor-website-purpose-group');
    if (purposeGroup) {
        purposeGroup.style.display = editorWizardData.endpoint_type === 'W' ? 'block' : 'none';
        if (editorWizardData.endpoint_type === 'W') {
            document.getElementById('editor-website-purpose').value = editorWizardData.website_purpose || 'brochure';
        }
    }

    // Pulse fields - populate from existing data, pulse_method will be auto-updated by updatePulseFields()
    const pulseUrlField = document.getElementById('editor-pulse-url');
    if (pulseUrlField) {
        pulseUrlField.value = editorWizardData.pulse_url || '';
    }

    // Set pulse_auth_ref dropdown if endpoint has an auth reference
    const pulseAuthRefField = document.getElementById('editor-pulse-auth-ref');
    if (pulseAuthRefField && editorWizardData.pulse_auth_ref) {
        pulseAuthRefField.value = editorWizardData.pulse_auth_ref;
    }
}

function prefillEditorConsoleSectionForm() {
    // Auto-determine console section based on endpoint type and website purpose (THE LAW v3.5)
    const endpointType = editorWizardData.endpoint_type;
    const platformType = editorWizardData.platform_type;
    const websitePurpose = editorWizardData.website_purpose;

    let autoSection = 'brochure';
    if (endpointType === 'D') {
        autoSection = 'data.shopnet';
    } else if (endpointType === 'A') {
        autoSection = 'assist.shopnet';
    } else if (endpointType === 'N') {
        // Node: W3G goes to web3-gateways, others to network-nodes
        autoSection = platformType === 'W3G' ? 'web3-gateways' : 'network-nodes';
    } else if (endpointType === 'I') {
        autoSection = 'infrastructure';
    } else if (endpointType === 'O') {
        autoSection = 'shopnet.network';
    } else if (endpointType === 'W') {
        if (websitePurpose === 'product_store') autoSection = 'products';
        else if (websitePurpose === 'domain_store') autoSection = 'domains';
        else if (websitePurpose === 'portal') autoSection = 'shopnet.network';
        else if (websitePurpose === 'console') autoSection = 'shopnet.network';
        else autoSection = 'brochure';
    }

    // Use existing console_section if set, otherwise use auto-determined
    const section = editorWizardData.console_section || autoSection;
    document.getElementById('editor-console-section').value = section;
    document.getElementById('editor-card-label').value = editorWizardData.card_label || editorWizardData.domain_name || '';
    // Default to actual current value (handle boolean, int 0/1, or undefined)
    document.getElementById('editor-show-on-map').checked = !!editorWizardData.show_on_map;

    // Update preview
    updateEditorCardPreview();
}

function updateEditorCardPreview() {
    const sectionLabels = TAXONOMY_LABELS['console_section'] || {};

    const status = editorWizardData.status || 'planned';
    const statusInfo = {
        'planned': { color: '#9ca3af', text: 'Grey (Placeholder)' },
        'wip': { color: '#f97316', text: 'Orange (WIP)' },
        'live': { color: '#22c55e', text: 'Green/Red (Health-checked)' }
    };

    const section = document.getElementById('editor-console-section')?.value || 'brochure';
    document.getElementById('editor-preview-section-name').textContent = sectionLabels[section] || section;

    const previewDot = document.getElementById('editor-preview-status-dot');
    const previewText = document.getElementById('editor-preview-status-text');
    if (previewDot) previewDot.style.background = statusInfo[status]?.color || '#9ca3af';
    if (previewText) previewText.textContent = statusInfo[status]?.text || 'Unknown';
}

function populateEditorConfirmation() {
    const typeLabels = TAXONOMY_LABELS['endpoint_type'] || {};
    const managedByLabels = TAXONOMY_LABELS['managed_by'] || {};
    const persistenceLabels = TAXONOMY_LABELS['persistence'] || {};
    const statusLabels = TAXONOMY_LABELS['status'] || {};
    const sectionLabels = TAXONOMY_LABELS['console_section'] || {};

    document.getElementById('editor-confirm-endpoint-type').textContent = `${typeLabels[editorWizardData.endpoint_type]} (${editorWizardData.endpoint_type})`;
    document.getElementById('editor-confirm-platform-type').textContent = editorWizardData.platform_type;
    document.getElementById('editor-confirm-domain').textContent = editorWizardData.domain_name;
    document.getElementById('editor-confirm-display-name').textContent = editorWizardData.display_name;
    document.getElementById('editor-confirm-managed-by').textContent = managedByLabels[editorWizardData.managed_by] || editorWizardData.managed_by;
    document.getElementById('editor-confirm-persistence').textContent = persistenceLabels[editorWizardData.persistence] || editorWizardData.persistence;
    document.getElementById('editor-confirm-runtime').textContent = editorWizardData.runtime;
    document.getElementById('editor-confirm-host').textContent = editorWizardData.host;
    document.getElementById('editor-confirm-status').textContent = statusLabels[editorWizardData.status] || editorWizardData.status;
    document.getElementById('editor-confirm-console-section').textContent = sectionLabels[editorWizardData.console_section] || editorWizardData.console_section;
    document.getElementById('editor-confirm-site-uid').textContent = editorWizardData.site_uid;
}

async function submitEndpointEditor() {
    try {
        const siteUid = editorWizardData.site_uid;

        // Step 0: Create/update secret if provided
        // THE LAW (Feb 2026): Secrets MUST be associated with a site_uid
        if (editorWizardData._newSecret) {
            try {
                const secretResponse = await fetch(`${CONNECT_API_URL}/api/v1/secrets`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        secret_key: editorWizardData._newSecret.key,
                        secret_value: editorWizardData._newSecret.value,
                        secret_type: editorWizardData._newSecret.type,
                        description: editorWizardData._newSecret.description,
                        site_uid: siteUid,
                        created_by: sessionStorage.getItem('console_user_email') || 'console'
                    })
                });
                if (!secretResponse.ok) {
                    const errData = await secretResponse.json().catch(() => ({}));
                    throw new Error(errData.detail || 'Failed to create/update secret');
                }
                showToast(`Secret "${editorWizardData._newSecret.key}" saved for ${siteUid}`, 'success');
            } catch (secretError) {
                showToast(`Error saving secret: ${secretError.message}`, 'error');
                // Continue anyway - endpoint can still be updated without the secret
            }
            delete editorWizardData._newSecret;  // Clean up
        }

        // Add updated_by from logged-in user (THE LAW audit trail)
        editorWizardData.updated_by = sessionStorage.getItem('console_user_email') || 'unknown';

        // Call PUT endpoint to update taxonomy record
        const response = await fetch(`/api/brochure/taxonomy/${siteUid}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editorWizardData)
        });
        const data = await response.json();

        if (data.success) {
            showToast(`Endpoint updated: ${siteUid}`, 'success');
            closeEndpointEditorWizard();

            // Refresh views
            if (typeof loadEndpointRegistry === 'function') {
                loadEndpointRegistry();
            }
            // Refresh active panel's cards
            refreshActivePanelCards();
        } else {
            throw new Error(data.error || 'Failed to update endpoint');
        }
    } catch (error) {
        console.error('Error updating endpoint:', error);
        showToast(`Error: ${error.message}`, 'error');
    }
}

// Helper to refresh cards on the currently active panel
function refreshActivePanelCards() {
    const activePanel = document.querySelector('.panel[style*="display: block"], .panel.active');
    if (activePanel) {
        const panelId = activePanel.id;
        if (panelId === 'panel-brochure-lambda') loadBrochureLambda();
        else if (panelId === 'panel-brochure-radius') loadBrochureRadius();
        else if (panelId === 'panel-agents') loadAgents();
        else if (panelId === 'panel-products') loadProducts();
        else if (panelId === 'panel-domains') loadDomains();
        else if (panelId === 'panel-web3-gateways') loadWeb3Gateways();
    }
}

// ====== ENDPOINT SELECTOR MODAL (for Change Endpoint) ======
let allEndpointsForSelector = [];

async function openEndpointSelectorModal() {
    document.getElementById('endpointSelectorModal').style.display = 'flex';
    document.getElementById('endpoint-selector-search').value = '';
    document.getElementById('endpoint-selector-list').innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--text-muted);">Loading endpoints...</div>';

    // Clear context filters - show all endpoints
    window.currentEndpointSelectorContext = null;
    window.filteredEndpointsForSelector = null;

    // Load all endpoints from taxonomy
    try {
        const response = await fetch('/api/brochure/taxonomy');
        const data = await response.json();

        if (data.success && data.endpoints) {
            allEndpointsForSelector = data.endpoints;
            renderEndpointSelectorList(allEndpointsForSelector);
        } else {
            document.getElementById('endpoint-selector-list').innerHTML = '<div style="text-align: center; padding: 2rem; color: #ef4444;">Failed to load endpoints: ' + (data.error || 'Unknown error') + '</div>';
        }
    } catch (error) {
        console.error('Error loading endpoints:', error);
        document.getElementById('endpoint-selector-list').innerHTML = `<div style="text-align: center; padding: 2rem; color: #ef4444;">Error: ${error.message}</div>`;
    }
}

function closeEndpointSelectorModal() {
    document.getElementById('endpointSelectorModal').style.display = 'none';
}

function filterEndpointSelector(query) {
    const q = query.toLowerCase().trim();
    // Use context-filtered list if available, otherwise all endpoints
    const baseList = window.filteredEndpointsForSelector || allEndpointsForSelector;
    if (!q) {
        renderEndpointSelectorList(baseList);
        return;
    }
    const filtered = baseList.filter(ep =>
        (ep.domain_name && ep.domain_name.toLowerCase().includes(q)) ||
        (ep.site_uid && ep.site_uid.toLowerCase().includes(q)) ||
        (ep.label && ep.label.toLowerCase().includes(q))
    );
    renderEndpointSelectorList(filtered);
}

function renderEndpointSelectorList(endpoints) {
    const container = document.getElementById('endpoint-selector-list');

    if (!endpoints || endpoints.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--text-muted);">No endpoints found</div>';
        return;
    }

    const typeLabels = TAXONOMY_LABELS['endpoint_type'] || {};

    let html = '';
    endpoints.forEach(ep => {
        const typeLabel = typeLabels[ep.endpoint_type] || ep.endpoint_type;
        html += `
            <div class="endpoint-selector-item" onclick="selectEndpointForEdit('${ep.site_uid}')"
                 style="padding: 0.75rem 1rem; border: 1px solid var(--border); border-radius: 6px; margin-bottom: 0.5rem; cursor: pointer; transition: all 0.2s;"
                 onmouseover="this.style.borderColor='#eab308'; this.style.background='rgba(234, 179, 8, 0.1)';"
                 onmouseout="this.style.borderColor='var(--border)'; this.style.background='transparent';">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-weight: 600; color: var(--text-primary);">${ep.label || ep.domain_name}</div>
                        <div style="font-size: 0.8rem; color: var(--text-muted);">${ep.site_uid}</div>
                    </div>
                    <div style="text-align: right;">
                        <span style="font-size: 0.75rem; background: var(--bg-secondary); padding: 2px 8px; border-radius: 4px;">${typeLabel}</span>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function selectEndpointForEdit(siteUid) {
    closeEndpointSelectorModal();
    openEndpointEditorWizard(siteUid);
}

// ===== CONTEXT-AWARE TOOLBAR FUNCTIONS =====
// These functions filter the selector modals by page context (THE LAW taxonomy)

/**
 * Page context to filter mapping - based on THE LAW v3.5 taxonomy
 * Maps panel IDs to endpoint taxonomy filters
 */
const PAGE_CONTEXT_FILTERS = {
    'portals': { endpoint_type: 'W', website_purpose: 'portal' },
    'domains': { endpoint_type: 'W', website_purpose: 'domain_store' },
    'products': { endpoint_type: 'W', website_purpose: 'product_store' },
    'brochure-lambda': { endpoint_type: 'W', website_purpose: 'brochure', platform_type: 'CO' },
    'brochure-radius': { endpoint_type: 'W', website_purpose: 'brochure', platform_type: 'CP' },
    'web3': { endpoint_type: 'W', website_purpose: 'other' },
    'databases': { endpoint_type: 'D' },
    'agents': { endpoint_type: 'A' },
    'network-nodes': { endpoint_type: 'N', exclude_platform: 'W3G' },
    'web3-gateways': { endpoint_type: 'N', platform_type: 'W3G' },
    'endpoint-registry': null // Show all endpoints
};

/**
 * Filters endpoints by page context
 * @param {Array} endpoints - Array of endpoint objects
 * @param {string} context - The panel context
 * @returns {Array} Filtered endpoints
 */
function filterEndpointsByContext(endpoints, context) {
    const filter = PAGE_CONTEXT_FILTERS[context];
    if (!filter) return endpoints; // No filter = show all

    return endpoints.filter(ep => {
        if (filter.endpoint_type && ep.endpoint_type !== filter.endpoint_type) return false;
        if (filter.platform_type && ep.platform_type !== filter.platform_type) return false;
        if (filter.website_purpose && ep.website_purpose !== filter.website_purpose) return false;
        if (filter.exclude_platform && ep.platform_type === filter.exclude_platform) return false;
        return true;
    });
}

/**
 * Opens the endpoint selector modal filtered by page context.
 * Shows only endpoints relevant to the current panel.
 * @param {string} context - The panel context (e.g., 'portals', 'domains', etc.)
 */
async function openEndpointSelectorModalWithContext(context) {
    document.getElementById('endpointSelectorModal').style.display = 'flex';
    document.getElementById('endpoint-selector-search').value = '';
    document.getElementById('endpoint-selector-list').innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--text-muted);">Loading endpoints...</div>';

    // Store context for filtering during search
    window.currentEndpointSelectorContext = context;

    try {
        const response = await fetch('/api/brochure/taxonomy');
        const data = await response.json();

        if (data.success && data.endpoints) {
            allEndpointsForSelector = data.endpoints;
            // Filter to show only endpoints currently visible on this page
            const pageCardUids = window.currentPageCardUids || [];
            const filtered = context && pageCardUids.length > 0
                ? allEndpointsForSelector.filter(ep => pageCardUids.includes(ep.site_uid))
                : allEndpointsForSelector;
            window.filteredEndpointsForSelector = filtered;
            renderEndpointSelectorList(filtered);
        } else {
            document.getElementById('endpoint-selector-list').innerHTML = '<div style="text-align: center; padding: 2rem; color: #ef4444;">Failed to load endpoints: ' + (data.error || 'Unknown error') + '</div>';
        }
    } catch (error) {
        console.error('Error loading endpoints:', error);
        document.getElementById('endpoint-selector-list').innerHTML = `<div style="text-align: center; padding: 2rem; color: #ef4444;">Error: ${error.message}</div>`;
    }
}

/**
 * Opens the remove endpoint modal filtered by page context.
 * Shows only endpoints relevant to the current panel.
 * @param {string} context - The panel context (e.g., 'portals', 'domains', etc.)
 */
async function openRemoveEndpointModalWithContext(context) {
    document.getElementById('removeEndpointSelectorModal').style.display = 'flex';
    document.getElementById('remove-endpoint-search').value = '';
    document.getElementById('remove-endpoint-list').innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--text-muted);">Loading endpoints...</div>';

    // Store context for filtering during search
    window.currentRemoveEndpointContext = context;

    try {
        const response = await fetch('/api/brochure/taxonomy');
        const data = await response.json();

        if (data.success && data.endpoints) {
            removeEndpointsForSelector = data.endpoints;
            // Filter to show only endpoints currently visible on this page
            const pageCardUids = window.currentPageCardUids || [];
            const filtered = context && pageCardUids.length > 0
                ? removeEndpointsForSelector.filter(ep => pageCardUids.includes(ep.site_uid))
                : removeEndpointsForSelector;
            window.filteredRemoveEndpointsForSelector = filtered;
            renderRemoveEndpointList(filtered);
        } else {
            document.getElementById('remove-endpoint-list').innerHTML = '<div style="text-align: center; padding: 2rem; color: #ef4444;">Failed to load endpoints: ' + (data.error || 'Unknown error') + '</div>';
        }
    } catch (error) {
        console.error('Error loading endpoints:', error);
        document.getElementById('remove-endpoint-list').innerHTML = `<div style="text-align: center; padding: 2rem; color: #ef4444;">Error: ${error.message}</div>`;
    }
}

// Export context-aware functions
window.openEndpointSelectorModalWithContext = openEndpointSelectorModalWithContext;
window.openRemoveEndpointModalWithContext = openRemoveEndpointModalWithContext;
window.filterEndpointsByContext = filterEndpointsByContext;
window.PAGE_CONTEXT_FILTERS = PAGE_CONTEXT_FILTERS;

// ===== PULSE SELECTOR MODAL FUNCTIONS =====
// Context-aware pulse selector — mirrors openEndpointSelectorModalWithContext pattern

let pulseSelectorEndpoints = [];
let selectedPulseSiteUid = null;
let currentPulseContext = null;

const PULSE_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>';

/**
 * Opens the pulse selector modal filtered by page context.
 * Shows only endpoints relevant to the current panel with pulse status info.
 */
async function openPulseSelectorModalWithContext(context) {
    document.getElementById('pulseSelectorModal').style.display = 'flex';
    document.getElementById('pulse-selector-search').value = '';
    document.getElementById('pulse-selector-list').innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--text-muted);">Loading endpoints...</div>';

    selectedPulseSiteUid = null;
    currentPulseContext = context;
    const selectedBtn = document.getElementById('pulse-selected-btn');
    if (selectedBtn) { selectedBtn.disabled = true; selectedBtn.style.opacity = '0.5'; }

    try {
        const response = await fetch('/api/brochure/taxonomy');
        const data = await response.json();

        if (data.success && data.endpoints) {
            const pageCardUids = window.currentPageCardUids || [];
            const filtered = context && pageCardUids.length > 0
                ? data.endpoints.filter(ep => pageCardUids.includes(ep.site_uid))
                : data.endpoints;

            pulseSelectorEndpoints = filtered;

            // Fetch latest pulse status from DB
            let pulseStatusMap = {};
            try {
                const pulseResp = await fetch(`${CONNECT_API_URL}/api/v1/pulse/status/db`);
                const pulseData = await pulseResp.json();
                if (pulseData.endpoints) {
                    pulseData.endpoints.forEach(ep => {
                        if (ep.site_uid) {
                            pulseStatusMap[ep.site_uid] = {
                                status: ep.last_pulse_status || 'grey',
                                latency: ep.last_pulse_latency_ms,
                                at: ep.last_pulse_at
                            };
                        }
                    });
                }
            } catch (e) { console.log('Could not load pulse status:', e); }

            renderPulseSelectorList(filtered, pulseStatusMap);
        } else {
            document.getElementById('pulse-selector-list').innerHTML = '<div style="text-align: center; padding: 2rem; color: #ef4444;">Failed to load endpoints</div>';
        }
    } catch (error) {
        console.error('Error loading pulse selector:', error);
        document.getElementById('pulse-selector-list').innerHTML = `<div style="text-align: center; padding: 2rem; color: #ef4444;">Error: ${error.message}</div>`;
    }
}

function closePulseSelectorModal() {
    document.getElementById('pulseSelectorModal').style.display = 'none';
    selectedPulseSiteUid = null;
    currentPulseContext = null;
}

function renderPulseSelectorList(endpoints, pulseStatusMap) {
    const container = document.getElementById('pulse-selector-list');
    if (!endpoints || endpoints.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--text-muted);">No endpoints found for this page</div>';
        return;
    }

    const statusColors = { 'green': '#22c55e', 'orange': '#f59e0b', 'red': '#ef4444', 'grey': '#9ca3af' };
    let html = '';
    endpoints.forEach(ep => {
        const pulseInfo = pulseStatusMap[ep.site_uid] || {};
        const statusColor = statusColors[pulseInfo.status] || statusColors.grey;
        const pulseMethod = ep.pulse_method || getPulseMethod(ep.endpoint_type, ep.platform_type);

        html += `
            <div class="pulse-selector-item" data-site-uid="${ep.site_uid}" onclick="selectPulseEndpoint('${ep.site_uid}')">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <span class="pulse-status-indicator" style="background: ${statusColor};"></span>
                        <div>
                            <div style="font-weight: 600; color: var(--text-primary);">${ep.label || ep.domain_name}</div>
                            <div style="font-size: 0.8rem; color: var(--text-muted);">${ep.site_uid}</div>
                        </div>
                    </div>
                    <span class="pulse-method-badge">${pulseMethod}</span>
                </div>
            </div>`;
    });
    container.innerHTML = html;
}

function selectPulseEndpoint(siteUid) {
    document.querySelectorAll('.pulse-selector-item--selected').forEach(el => el.classList.remove('pulse-selector-item--selected'));
    const item = document.querySelector(`.pulse-selector-item[data-site-uid="${siteUid}"]`);
    if (item) item.classList.add('pulse-selector-item--selected');
    selectedPulseSiteUid = siteUid;
    const selectedBtn = document.getElementById('pulse-selected-btn');
    if (selectedBtn) { selectedBtn.disabled = false; selectedBtn.style.opacity = '1'; }
}

function filterPulseSelector(query) {
    const q = query.toLowerCase().trim();
    document.querySelectorAll('.pulse-selector-item').forEach(item => {
        item.style.display = item.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
}

async function pulseSelectedEndpoint() {
    if (!selectedPulseSiteUid) return;
    const endpoint = pulseSelectorEndpoints.find(ep => ep.site_uid === selectedPulseSiteUid);
    if (!endpoint) return;

    const selectedBtn = document.getElementById('pulse-selected-btn');
    if (selectedBtn) { selectedBtn.disabled = true; selectedBtn.textContent = 'Pulsing...'; }

    const method = endpoint.pulse_method || getPulseMethod(endpoint.endpoint_type, endpoint.platform_type);
    const url = endpoint.pulse_url || endpoint.domain_name;

    try {
        const response = await fetch(`${CONNECT_API_URL}/api/v1/pulse/check?method=${encodeURIComponent(method)}&url=${encodeURIComponent(url)}`);
        const data = await response.json();

        const item = document.querySelector(`.pulse-selector-item[data-site-uid="${selectedPulseSiteUid}"]`);
        if (item) {
            const dot = item.querySelector('.pulse-status-indicator');
            const colors = { 'green': '#22c55e', 'orange': '#f59e0b', 'red': '#ef4444' };
            if (dot) dot.style.background = colors[data.status] || '#9ca3af';
        }
        showToast(`Pulse: ${endpoint.domain_name || endpoint.site_uid} — ${data.status} (${data.latency_ms}ms)`,
            data.status === 'green' ? 'success' : data.status === 'orange' ? 'warning' : 'error');
    } catch (error) {
        console.error('Single endpoint pulse error:', error);
        showToast(`Pulse failed: ${error.message}`, 'error');
    } finally {
        if (selectedBtn) { selectedBtn.disabled = false; selectedBtn.textContent = 'Pulse Selected'; }
    }
}

async function pulseAllOnPage() {
    const allBtn = document.getElementById('pulse-all-btn');
    if (allBtn) { allBtn.disabled = true; allBtn.textContent = 'Running All...'; }

    try {
        console.log('[PulseAll] Calling:', `${CONNECT_API_URL}/api/v1/pulse/run`);
        const response = await fetch(`${CONNECT_API_URL}/api/v1/pulse/run`);
        console.log('[PulseAll] Response status:', response.status);
        const data = await response.json();
        console.log('[PulseAll] Response keys:', Object.keys(data), 'success:', data.success, 'results count:', data.results?.length);

        if (data.success && data.results) {
            const statusColors = { 'green': '#22c55e', 'orange': '#f59e0b', 'red': '#ef4444' };
            const resultMap = {};
            data.results.forEach(r => { if (r.site_uid) resultMap[r.site_uid] = r.result; });

            document.querySelectorAll('.pulse-selector-item').forEach(item => {
                const uid = item.getAttribute('data-site-uid');
                const result = resultMap[uid];
                if (result) {
                    const dot = item.querySelector('.pulse-status-indicator');
                    if (dot) dot.style.background = statusColors[result.status] || '#9ca3af';
                }
            });

            const green = data.results.filter(r => r.result?.status === 'green').length;
            showToast(`Pulse complete: ${green}/${data.checks_performed} healthy`, green === data.checks_performed ? 'success' : 'warning');
        } else {
            throw new Error(data.error || 'Pulse check failed');
        }
    } catch (error) {
        console.error('Pulse all error:', error);
        showToast(`Pulse All failed: ${error.message}`, 'error');
    } finally {
        if (allBtn) { allBtn.disabled = false; allBtn.textContent = 'Pulse All on Page'; }
    }
}

window.openPulseSelectorModalWithContext = openPulseSelectorModalWithContext;
window.closePulseSelectorModal = closePulseSelectorModal;
window.filterPulseSelector = filterPulseSelector;
window.selectPulseEndpoint = selectPulseEndpoint;
window.pulseSelectedEndpoint = pulseSelectedEndpoint;
window.pulseAllOnPage = pulseAllOnPage;

// ===== REMOVE ENDPOINT FUNCTIONS =====
let removeEndpointsForSelector = [];
let selectedEndpointToRemove = null;

async function openRemoveEndpointModal() {
    document.getElementById('removeEndpointSelectorModal').style.display = 'flex';
    document.getElementById('remove-endpoint-search').value = '';
    document.getElementById('remove-endpoint-list').innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--text-muted);">Loading endpoints...</div>';

    // Clear context filters - show all endpoints
    window.currentRemoveEndpointContext = null;
    window.filteredRemoveEndpointsForSelector = null;

    // Load all endpoints from taxonomy
    try {
        const response = await fetch('/api/brochure/taxonomy');
        const data = await response.json();

        if (data.success && data.endpoints) {
            removeEndpointsForSelector = data.endpoints;
            renderRemoveEndpointList(removeEndpointsForSelector);
        } else {
            document.getElementById('remove-endpoint-list').innerHTML = '<div style="text-align: center; padding: 2rem; color: #ef4444;">Failed to load endpoints: ' + (data.error || 'Unknown error') + '</div>';
        }
    } catch (error) {
        console.error('Error loading endpoints:', error);
        document.getElementById('remove-endpoint-list').innerHTML = `<div style="text-align: center; padding: 2rem; color: #ef4444;">Error: ${error.message}</div>`;
    }
}

function closeRemoveEndpointModal() {
    document.getElementById('removeEndpointSelectorModal').style.display = 'none';
}

function filterRemoveEndpointSelector(query) {
    const q = query.toLowerCase().trim();
    // Use context-filtered list if available, otherwise all endpoints
    const baseList = window.filteredRemoveEndpointsForSelector || removeEndpointsForSelector;
    if (!q) {
        renderRemoveEndpointList(baseList);
        return;
    }
    const filtered = baseList.filter(ep =>
        (ep.domain_name && ep.domain_name.toLowerCase().includes(q)) ||
        (ep.site_uid && ep.site_uid.toLowerCase().includes(q)) ||
        (ep.label && ep.label.toLowerCase().includes(q))
    );
    renderRemoveEndpointList(filtered);
}

function renderRemoveEndpointList(endpoints) {
    const container = document.getElementById('remove-endpoint-list');

    if (!endpoints || endpoints.length === 0) {
        container.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--text-muted);">No endpoints found</div>';
        return;
    }

    const typeLabels = TAXONOMY_LABELS['endpoint_type'] || {};
    const typeColors = { 'W': '#3b82f6', 'A': '#8b5cf6', 'D': '#22c55e', 'N': '#f59e0b', 'I': '#06b6d4', 'O': '#6b7280' };

    let html = '';
    endpoints.forEach(ep => {
        const typeLabel = typeLabels[ep.endpoint_type] || ep.endpoint_type;
        const typeColor = typeColors[ep.endpoint_type] || '#6b7280';
        html += `
            <div class="endpoint-selector-item" onclick="selectEndpointForRemove('${ep.site_uid}')"
                 style="padding: 0.75rem 1rem; border: 1px solid var(--border); border-radius: 6px; margin-bottom: 0.5rem; cursor: pointer; transition: all 0.2s;"
                 onmouseover="this.style.borderColor='#ef4444'; this.style.background='rgba(239, 68, 68, 0.1)';"
                 onmouseout="this.style.borderColor='var(--border)'; this.style.background='transparent';">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-weight: 600; color: var(--text-primary);">${ep.label || ep.domain_name}</div>
                        <div style="font-size: 0.8rem; color: var(--text-muted);">${ep.site_uid}</div>
                    </div>
                    <div style="text-align: right;">
                        <span style="font-size: 0.75rem; background: ${typeColor}; color: white; padding: 2px 8px; border-radius: 4px;">${typeLabel}</span>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function selectEndpointForRemove(siteUid) {
    // Find the endpoint data
    selectedEndpointToRemove = removeEndpointsForSelector.find(ep => ep.site_uid === siteUid);
    if (!selectedEndpointToRemove) {
        showToast('Endpoint not found', 'error');
        return;
    }

    closeRemoveEndpointModal();
    openRemoveEndpointConfirm();
}

function openRemoveEndpointConfirm() {
    if (!selectedEndpointToRemove) return;

    const ep = selectedEndpointToRemove;
    const typeLabels = TAXONOMY_LABELS['endpoint_type'] || {};
    const typeColors = { 'W': '#3b82f6', 'A': '#8b5cf6', 'D': '#22c55e', 'N': '#f59e0b', 'I': '#06b6d4', 'O': '#6b7280' };

    document.getElementById('remove-ep-domain').textContent = ep.label || ep.domain_name || '-';
    document.getElementById('remove-ep-uid').textContent = ep.site_uid;

    const badge = document.getElementById('remove-ep-type-badge');
    badge.textContent = typeLabels[ep.endpoint_type] || ep.endpoint_type;
    badge.style.background = typeColors[ep.endpoint_type] || '#6b7280';
    badge.style.color = 'white';

    // Reset S3 checkbox
    document.getElementById('remove-s3-content').checked = false;

    document.getElementById('removeEndpointConfirmModal').style.display = 'flex';
}

function closeRemoveEndpointConfirm() {
    document.getElementById('removeEndpointConfirmModal').style.display = 'none';
    selectedEndpointToRemove = null;
}

function confirmRemoveEndpoint() {
    // First confirmation done - now open the final confirmation modal
    if (!selectedEndpointToRemove) {
        showToast('No endpoint selected', 'error');
        return;
    }

    // Populate the final confirmation modal with endpoint details
    const ep = selectedEndpointToRemove;
    document.getElementById('final-remove-ep-domain').textContent = ep.label || ep.domain_name || '-';
    document.getElementById('final-remove-ep-uid').textContent = ep.site_uid;

    // Open the final confirmation modal (keep first modal hidden behind it)
    document.getElementById('removeEndpointFinalModal').style.display = 'flex';
}

function closeRemoveEndpointFinal() {
    document.getElementById('removeEndpointFinalModal').style.display = 'none';
}

async function finalConfirmRemoveEndpoint() {
    if (!selectedEndpointToRemove) {
        showToast('No endpoint selected', 'error');
        return;
    }

    const siteUid = selectedEndpointToRemove.site_uid;
    const deleteS3 = document.getElementById('remove-s3-content').checked;

    // Disable the button while processing
    const confirmBtn = document.querySelector('#removeEndpointFinalModal .btn[onclick="finalConfirmRemoveEndpoint()"]');
    if (confirmBtn) {
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = '<span style="margin-right: 4px;">⏳</span> Deleting...';
    }

    try {
        // THE LAW (Feb 2026): Delete associated secrets before deleting endpoint
        try {
            const secretsResponse = await fetch(`${CONNECT_API_URL}/api/v1/secrets/by-site/${siteUid}`, {
                method: 'DELETE'
            });
            if (secretsResponse.ok) {
                const secretsResult = await secretsResponse.json();
                if (secretsResult.deleted_count > 0) {
                    showToast(`Deleted ${secretsResult.deleted_count} secret(s) for ${siteUid}`, 'info');
                }
            }
        } catch (secretErr) {
            console.warn('Could not delete secrets (may not exist):', secretErr.message);
            // Continue with endpoint deletion
        }

        const response = await fetch('/api/brochure/taxonomy/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                site_uid: siteUid,
                delete_s3_content: deleteS3
            })
        });

        const result = await response.json();

        if (result.success) {
            showToast(`Endpoint ${siteUid} removed successfully`, 'success');
            closeRemoveEndpointFinal();
            closeRemoveEndpointConfirm();

            // Refresh the endpoint registry if visible
            if (typeof loadEndpointRegistry === 'function') {
                loadEndpointRegistry();
            }

            // Refresh any card pages that might show this endpoint
            if (typeof loadPortals === 'function') loadPortals();
            if (typeof loadBrochureSitesLambda === 'function') loadBrochureSitesLambda();
            if (typeof loadBrochureSitesRadius === 'function') loadBrochureSitesRadius();
            if (typeof loadWeb3Gateways === 'function') loadWeb3Gateways();
            if (typeof loadNetworkNodes === 'function') loadNetworkNodes();
        } else {
            throw new Error(result.error || 'Failed to remove endpoint');
        }
    } catch (error) {
        console.error('Error removing endpoint:', error);
        showToast(`Error: ${error.message}`, 'error');
    } finally {
        // Re-enable button
        if (confirmBtn) {
            confirmBtn.disabled = false;
            confirmBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="vertical-align: middle; margin-right: 6px;">
                    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    <line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/>
                </svg>
                Delete Permanently
            `;
        }
    }
}

// Export remove endpoint functions
window.openRemoveEndpointModal = openRemoveEndpointModal;
window.closeRemoveEndpointModal = closeRemoveEndpointModal;
window.filterRemoveEndpointSelector = filterRemoveEndpointSelector;
window.selectEndpointForRemove = selectEndpointForRemove;
window.closeRemoveEndpointConfirm = closeRemoveEndpointConfirm;
window.confirmRemoveEndpoint = confirmRemoveEndpoint;
window.closeRemoveEndpointFinal = closeRemoveEndpointFinal;
window.finalConfirmRemoveEndpoint = finalConfirmRemoveEndpoint;

// Add click handlers for endpoint type cards and console section dropdown
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.endpoint-type-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.endpoint-type-card').forEach(c => c.style.borderColor = 'var(--border)');
            card.style.borderColor = '#3b82f6';
        });
    });

    // Editor type card handlers
    document.querySelectorAll('.editor-type-card').forEach(card => {
        card.addEventListener('click', () => {
            document.querySelectorAll('.editor-type-card').forEach(c => c.style.borderColor = 'var(--border)');
            card.style.borderColor = '#eab308';
        });
    });

    // Editor console section change handler
    const editorSectionSelect = document.getElementById('editor-console-section');
    if (editorSectionSelect) {
        editorSectionSelect.addEventListener('change', updateEditorCardPreview);
    }

    // Editor website purpose visibility based on endpoint type
    document.querySelectorAll('input[name="editor_endpoint_type"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const purposeGroup = document.getElementById('editor-website-purpose-group');
            if (purposeGroup) {
                purposeGroup.style.display = this.value === 'W' ? 'block' : 'none';
            }
        });
    });

    // Update preview when console section changes
    const sectionSelect = document.getElementById('endpoint-console-section');
    if (sectionSelect) {
        sectionSelect.addEventListener('change', updateCardPreview);
    }

    // Show/hide website purpose based on endpoint type
    document.querySelectorAll('input[name="endpoint_type"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const purposeGroup = document.getElementById('website-purpose-group');
            if (purposeGroup) {
                purposeGroup.style.display = this.value === 'W' ? 'block' : 'none';
            }
        });
    });
});

// ===== ENDPOINT REGISTRY TABS =====

function switchEndpointTab(tabName) {
    // Update tab buttons
    document.querySelectorAll('.endpoint-registry-tab').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById(`tab-${tabName}`).classList.add('active');

    // Update tab content
    document.querySelectorAll('.endpoint-registry-tab-content').forEach(content => {
        content.classList.remove('active');
    });
    document.getElementById(`tab-content-${tabName}`).classList.add('active');
}

// ===== SITES DATABASE MANAGEMENT =====
// For RDS Sites Database (shopnet_sites)

let currentSitesPage = 1;
let sitesPerPage = 50;
let sitesRegistry = [];

async function loadSites(page = 1) {
    const tableBody = document.getElementById('sites-table-body');
    if (!tableBody) return;

    if (!apiKey) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 40px; color: #6b7280;">Login required to view sites</td></tr>`;
        return;
    }

    currentSitesPage = page;

    // Show loading state
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 40px; color: #6b7280;">
        <div class="s3-loading">Loading sites...</div>
    </td></tr>`;

    // Get filter values
    const hostingType = document.getElementById('sites-filter-hosting')?.value || '';
    const agentType = document.getElementById('sites-filter-agent')?.value || '';
    const isActive = document.getElementById('sites-filter-status')?.value || '';
    const search = document.getElementById('sites-filter-search')?.value || '';

    try {
        let url = `${CONNECT_API_URL}/api/v1/sites?page=${page}&per_page=${sitesPerPage}`;
        if (hostingType) url += `&hosting_type=${hostingType}`;
        if (agentType) url += `&agent_type=${agentType}`;
        if (isActive) url += `&is_active=${isActive}`;
        if (search) url += `&search=${encodeURIComponent(search)}`;

        const response = await fetch(url, {
            headers: { 'X-API-Key': apiKey }
        });
        const data = await response.json();

        if (data.sites) {
            sitesRegistry = data.sites;
            renderSitesStats(data);
            renderSitesTable(data.sites);
            renderSitesPagination(data.pagination);
        } else {
            tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 40px; color: #ef4444;">Error loading sites: ${data.detail || 'Unknown error'}</td></tr>`;
        }
    } catch (error) {
        console.error('Failed to load sites:', error);
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 40px; color: #ef4444;">Error: ${error.message}</td></tr>`;
    }
}

function renderSitesStats(data) {
    const sites = data.sites || [];
    const total = data.pagination?.total || sites.length;

    // Calculate stats
    const lambdaCount = sites.filter(s => s.hosting_type === 'lambda').length;
    const radiusCount = sites.filter(s => s.hosting_type === 'radius').length;
    const activeCount = sites.filter(s => s.is_active).length;

    document.getElementById('sites-stat-total').textContent = total;
    document.getElementById('sites-stat-lambda').textContent = lambdaCount;
    document.getElementById('sites-stat-radius').textContent = radiusCount;
    document.getElementById('sites-stat-active').textContent = activeCount;
}

function renderSitesTable(sites) {
    const tableBody = document.getElementById('sites-table-body');
    if (!tableBody) return;

    if (!sites || sites.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 40px; color: #6b7280;">
            No sites found. Click "Add Site" to create one.
        </td></tr>`;
        return;
    }

    tableBody.innerHTML = sites.map(site => `
        <tr>
            <td>
                <div style="font-weight: 500;">${site.domain_name}</div>
                <div style="font-size: 0.75rem; color: #6b7280;">${site.display_name || '-'}</div>
            </td>
            <td>
                <span class="status-badge ${site.hosting_type === 'radius' ? 'status-warning' : 'status-success'}">
                    ${site.hosting_type || 'lambda'}
                </span>
            </td>
            <td>${site.agent_type || '-'}</td>
            <td>${site.template_id || '-'}</td>
            <td>
                <span class="status-badge ${site.is_active ? 'status-success' : 'status-error'}">
                    ${site.is_active ? 'Active' : 'Inactive'}
                </span>
            </td>
            <td>
                <button class="s3-btn s3-btn-secondary" onclick="editSite('${site.domain_name}')" title="Edit">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                </button>
                ${site.hosting_type === 'radius' ? `
                <button class="s3-btn s3-btn-primary" onclick="triggerSiteBuild('${site.domain_name}')" title="Build">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                        <polygon points="5 3 19 12 5 21 5 3"/>
                    </svg>
                </button>
                ` : ''}
            </td>
        </tr>
    `).join('');
}

function renderSitesPagination(pagination) {
    if (!pagination) return;

    const infoEl = document.getElementById('sites-pagination-info');
    const prevBtn = document.getElementById('sites-prev-btn');
    const nextBtn = document.getElementById('sites-next-btn');

    const start = ((pagination.page - 1) * pagination.per_page) + 1;
    const end = Math.min(pagination.page * pagination.per_page, pagination.total);

    infoEl.textContent = `Showing ${start}-${end} of ${pagination.total} sites`;

    prevBtn.disabled = pagination.page <= 1;
    nextBtn.disabled = pagination.page >= pagination.total_pages;
}

async function editSite(domain) {
    showToast(`Loading site: ${domain}...`, 'info');

    try {
        const response = await fetch(`${CONNECT_API_URL}/api/v1/sites/${domain}`, {
            headers: { 'X-API-Key': apiKey }
        });
        const data = await response.json();

        if (data.site) {
            showSiteEditModal(data.site, data.infrastructure, data.latest_build);
        } else {
            showToast(`Error loading site: ${data.detail || 'Unknown error'}`, 'error');
        }
    } catch (error) {
        console.error('Failed to load site:', error);
        showToast(`Error: ${error.message}`, 'error');
    }
}

function showSiteEditModal(site, infrastructure, latestBuild) {
    // Create modal HTML
    const modalHtml = `
    <div id="site-edit-modal" class="modal" style="display: flex; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center;">
        <div class="modal-content" style="background: white; border-radius: 12px; width: 90%; max-width: 800px; max-height: 90vh; overflow-y: auto; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);">
            <div class="modal-header" style="padding: 20px 24px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;">
                <h2 style="margin: 0; font-size: 1.25rem; font-weight: 600;">Edit Site: ${site.domain_name}</h2>
                <button onclick="closeSiteEditModal()" style="background: none; border: none; cursor: pointer; padding: 8px;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
            </div>
            <div class="modal-body" style="padding: 24px;">
                <form id="site-edit-form">
                    <input type="hidden" name="domain_name" value="${site.domain_name}">

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                        <div class="form-group">
                            <label style="display: block; margin-bottom: 4px; font-weight: 500; font-size: 0.875rem;">Display Name</label>
                            <input type="text" name="display_name" value="${site.display_name || ''}" style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px;">
                        </div>
                        <div class="form-group">
                            <label style="display: block; margin-bottom: 4px; font-weight: 500; font-size: 0.875rem;">Hosting Type</label>
                            <select name="hosting_type" style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px;">
                                <option value="lambda" ${site.hosting_type === 'lambda' ? 'selected' : ''}>Lambda</option>
                                <option value="radius" ${site.hosting_type === 'radius' ? 'selected' : ''}>Radius</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label style="display: block; margin-bottom: 4px; font-weight: 500; font-size: 0.875rem;">Agent Type</label>
                            <select name="agent_type" style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px;">
                                <option value="product_assist" ${site.agent_type === 'product_assist' ? 'selected' : ''}>Product Assist</option>
                                <option value="domain_assist" ${site.agent_type === 'domain_assist' ? 'selected' : ''}>Domain Assist</option>
                                <option value="none" ${site.agent_type === 'none' ? 'selected' : ''}>None</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label style="display: block; margin-bottom: 4px; font-weight: 500; font-size: 0.875rem;">Template</label>
                            <select name="template_id" style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px;">
                                <option value="brochure-standard-v1" ${site.template_id === 'brochure-standard-v1' ? 'selected' : ''}>Brochure Standard v1</option>
                                <option value="brochure-minimal-v1" ${site.template_id === 'brochure-minimal-v1' ? 'selected' : ''}>Brochure Minimal v1</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label style="display: block; margin-bottom: 4px; font-weight: 500; font-size: 0.875rem;">Primary Color</label>
                            <input type="text" name="primary_color" value="${site.primary_color || '#007bff'}" style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px;">
                        </div>
                        <div class="form-group">
                            <label style="display: block; margin-bottom: 4px; font-weight: 500; font-size: 0.875rem;">Secondary Color</label>
                            <input type="text" name="secondary_color" value="${site.secondary_color || '#6c757d'}" style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px;">
                        </div>
                    </div>

                    <div class="form-group" style="margin-top: 16px;">
                        <label style="display: block; margin-bottom: 4px; font-weight: 500; font-size: 0.875rem;">Header Text</label>
                        <input type="text" name="header_text" value="${site.header_text || ''}" style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px;">
                    </div>

                    <div class="form-group" style="margin-top: 16px;">
                        <label style="display: block; margin-bottom: 4px; font-weight: 500; font-size: 0.875rem;">Intro Message</label>
                        <textarea name="intro_message" rows="3" style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px; resize: vertical;">${site.intro_message || ''}</textarea>
                    </div>

                    <div class="form-group" style="margin-top: 16px;">
                        <label style="display: flex; align-items: center; gap: 8px; font-weight: 500; font-size: 0.875rem;">
                            <input type="checkbox" name="is_active" ${site.is_active ? 'checked' : ''}>
                            Site Active
                        </label>
                    </div>

                    ${infrastructure ? `
                    <div style="margin-top: 24px; padding: 16px; background: #f3f4f6; border-radius: 8px;">
                        <h3 style="margin: 0 0 12px 0; font-size: 1rem; font-weight: 600;">Infrastructure Status</h3>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; font-size: 0.875rem;">
                            <div><strong>DNS:</strong> ${infrastructure.dns_status || 'pending'}</div>
                            <div><strong>SSL:</strong> ${infrastructure.ssl_status || 'pending'}</div>
                            <div><strong>CloudFront:</strong> ${infrastructure.cloudfront_status || 'pending'}</div>
                        </div>
                    </div>
                    ` : ''}

                    ${latestBuild ? `
                    <div style="margin-top: 16px; padding: 16px; background: #f3f4f6; border-radius: 8px;">
                        <h3 style="margin: 0 0 12px 0; font-size: 1rem; font-weight: 600;">Latest Build</h3>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; font-size: 0.875rem;">
                            <div><strong>Build #:</strong> ${latestBuild.build_number}</div>
                            <div><strong>Status:</strong> ${latestBuild.build_status}</div>
                            <div><strong>Completed:</strong> ${latestBuild.build_completed_at ? new Date(latestBuild.build_completed_at).toLocaleString() : '-'}</div>
                        </div>
                    </div>
                    ` : ''}
                </form>
            </div>
            <div class="modal-footer" style="padding: 16px 24px; border-top: 1px solid #e5e7eb; display: flex; justify-content: flex-end; gap: 12px;">
                <button onclick="closeSiteEditModal()" class="s3-btn s3-btn-secondary">Cancel</button>
                <button onclick="saveSite('${site.domain_name}')" class="s3-btn s3-btn-primary">Save Changes</button>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function closeSiteEditModal() {
    const modal = document.getElementById('site-edit-modal');
    if (modal) modal.remove();
}

async function saveSite(domain) {
    const form = document.getElementById('site-edit-form');
    if (!form) return;

    const formData = new FormData(form);
    const siteData = {};

    formData.forEach((value, key) => {
        if (key === 'is_active') {
            siteData[key] = form.querySelector('[name="is_active"]').checked;
        } else if (value !== '') {
            siteData[key] = value;
        }
    });

    // Handle checkbox if unchecked (won't be in formData)
    if (!formData.has('is_active')) {
        siteData.is_active = false;
    }

    try {
        const response = await fetch(`${CONNECT_API_URL}/api/v1/sites/${domain}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': apiKey
            },
            body: JSON.stringify(siteData)
        });

        const data = await response.json();

        if (data.site) {
            showToast('Site updated successfully', 'success');
            closeSiteEditModal();
            loadSites(currentSitesPage);
        } else {
            showToast(`Error: ${data.detail || 'Unknown error'}`, 'error');
        }
    } catch (error) {
        console.error('Failed to save site:', error);
        showToast(`Error: ${error.message}`, 'error');
    }
}

function showCreateSiteModal() {
    const modalHtml = `
    <div id="site-create-modal" class="modal" style="display: flex; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center;">
        <div class="modal-content" style="background: white; border-radius: 12px; width: 90%; max-width: 600px; max-height: 90vh; overflow-y: auto; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);">
            <div class="modal-header" style="padding: 20px 24px; border-bottom: 1px solid #e5e7eb; display: flex; justify-content: space-between; align-items: center;">
                <h2 style="margin: 0; font-size: 1.25rem; font-weight: 600;">Create New Site</h2>
                <button onclick="closeCreateSiteModal()" style="background: none; border: none; cursor: pointer; padding: 8px;">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
            </div>
            <div class="modal-body" style="padding: 24px;">
                <form id="site-create-form">
                    <div class="form-group">
                        <label style="display: block; margin-bottom: 4px; font-weight: 500; font-size: 0.875rem;">Domain Name *</label>
                        <input type="text" name="domain_name" required placeholder="example.com" style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px;">
                    </div>

                    <div class="form-group" style="margin-top: 16px;">
                        <label style="display: block; margin-bottom: 4px; font-weight: 500; font-size: 0.875rem;">Display Name</label>
                        <input type="text" name="display_name" placeholder="My Site" style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px;">
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 16px;">
                        <div class="form-group">
                            <label style="display: block; margin-bottom: 4px; font-weight: 500; font-size: 0.875rem;">Hosting Type</label>
                            <select name="hosting_type" style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px;">
                                <option value="lambda">Lambda (On Demand)</option>
                                <option value="radius">Radius (Persistent)</option>
                            </select>
                        </div>
                        <div class="form-group">
                            <label style="display: block; margin-bottom: 4px; font-weight: 500; font-size: 0.875rem;">Agent Type</label>
                            <select name="agent_type" style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px;">
                                <option value="product_assist">Product Assist</option>
                                <option value="domain_assist">Domain Assist</option>
                                <option value="none">None</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group" style="margin-top: 16px;">
                        <label style="display: block; margin-bottom: 4px; font-weight: 500; font-size: 0.875rem;">Header Text</label>
                        <input type="text" name="header_text" placeholder="find your ideal product" style="width: 100%; padding: 8px 12px; border: 1px solid #d1d5db; border-radius: 6px;">
                    </div>
                </form>
            </div>
            <div class="modal-footer" style="padding: 16px 24px; border-top: 1px solid #e5e7eb; display: flex; justify-content: flex-end; gap: 12px;">
                <button onclick="closeCreateSiteModal()" class="s3-btn s3-btn-secondary">Cancel</button>
                <button onclick="createSite()" class="s3-btn s3-btn-primary">Create Site</button>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
}

function closeCreateSiteModal() {
    const modal = document.getElementById('site-create-modal');
    if (modal) modal.remove();
}

async function createSite() {
    const form = document.getElementById('site-create-form');
    if (!form) return;

    const formData = new FormData(form);
    const siteData = {};

    formData.forEach((value, key) => {
        if (value !== '') {
            siteData[key] = value;
        }
    });

    if (!siteData.domain_name) {
        showToast('Domain name is required', 'error');
        return;
    }

    try {
        const response = await fetch(`${CONNECT_API_URL}/api/v1/sites`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': apiKey
            },
            body: JSON.stringify(siteData)
        });

        const data = await response.json();

        if (data.site) {
            showToast(`Site created: ${siteData.domain_name}`, 'success');
            closeCreateSiteModal();
            loadSites();
        } else {
            showToast(`Error: ${data.detail || 'Unknown error'}`, 'error');
        }
    } catch (error) {
        console.error('Failed to create site:', error);
        showToast(`Error: ${error.message}`, 'error');
    }
}

async function triggerSiteBuild(domain) {
    if (!confirm(`Trigger a new build for ${domain}?`)) return;

    try {
        const response = await fetch(`${CONNECT_API_URL}/api/v1/sites/${domain}/build`, {
            method: 'POST',
            headers: { 'X-API-Key': apiKey }
        });

        const data = await response.json();

        if (data.build) {
            showToast(`Build #${data.build.build_number} queued for ${domain}`, 'success');
            loadSites(currentSitesPage);
        } else {
            showToast(`Error: ${data.detail || 'Unknown error'}`, 'error');
        }
    } catch (error) {
        console.error('Failed to trigger build:', error);
        showToast(`Error: ${error.message}`, 'error');
    }
}

// Debounce helper for search
let debounceTimer;
function debounce(func, delay) {
    return function(...args) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(this, args), delay);
    };
}

// ===== GLOBAL EXPORTS =====
window.handleLogin = handleLogin;
window.handleLogout = handleLogout;
window.showPanel = showPanel;
window.saveApiKey = saveApiKey;
window.checkApiHealth = checkApiHealth;
window.refreshMonitor = refreshMonitor;
window.loadConnections = loadConnections;
window.loadSystemStatus = loadSystemStatus;
window.refreshNetworkMap = refreshNetworkMap;
window.handleMapNodeClick = handleMapNodeClick;
window.startNetworkMapRefresh = startNetworkMapRefresh;
window.wizardNext = wizardNext;
window.wizardPrev = wizardPrev;
window.wizardSubmit = wizardSubmit;
window.resetWizard = resetWizard;
window.loadBrochureLambda = loadBrochureLambda;
window.loadBrochureRadius = loadBrochureRadius;
window.loadWeb3Sites = loadWeb3Sites;
window.loadProductStores = loadProductStores;
window.loadDomainStores = loadDomainStores;
window.loadPortals = loadPortals;
window.loadConsoles = loadConsoles;
window.loadAgents = loadAgents;
window.loadDatabases = loadDatabases;
window.loadNetworkNodes = loadNetworkNodes;
window.loadWeb3Gateways = loadWeb3Gateways;
window.loadEndpointCards = loadEndpointCards;
window.openChangeSiteModal = openChangeSiteModal;
window.showSiteCardDetails = showSiteCardDetails;
window.loadSiteRegistry = loadSiteRegistry;
window.sortSiteRegistry = sortSiteRegistry;
// Endpoint Registry (Taxonomy RDS)
window.loadEndpointRegistry = loadEndpointRegistry;
window.sortEndpointRegistry = sortEndpointRegistry;
window.filterRegistry = filterRegistry;
window.openRegistryConfigModal = openRegistryConfigModal;
window.closeRegistryConfigModal = closeRegistryConfigModal;
window.resetRegistryConfig = resetRegistryConfig;
window.toggleRegistryColumn = toggleRegistryColumn;
window.moveColumnUp = moveColumnUp;
window.moveColumnDown = moveColumnDown;
window.initColumnOrderList = initColumnOrderList;
window.openExportModal = openExportModal;
window.closeExportModal = closeExportModal;
window.exportRegistryCSV = exportRegistryCSV;
// Live Status (JSON Real-time)
window.loadLiveStatus = loadLiveStatus;
window.sortLiveStatus = sortLiveStatus;
// pulse.shopnet Live Pulse Monitoring
window.runPulseCheck = runPulseCheck;
window.runRegistryPulseCheck = runRegistryPulseCheck;
window.setPulseInterval = setPulseInterval;
window.loadPulseConfig = loadPulseConfig;
window.toggleSecretInput = toggleSecretInput;
// Endpoint Adder Wizard (THE LAW)
window.openEndpointAdderWizard = openEndpointAdderWizard;
window.closeEndpointAdderWizard = closeEndpointAdderWizard;
window.endpointWizardNext = endpointWizardNext;
window.endpointWizardPrev = endpointWizardPrev;
window.submitEndpointWizard = submitEndpointWizard;
// Endpoint Editor Wizard (Change Endpoint - THE LAW)
window.openEndpointEditorWizard = openEndpointEditorWizard;
window.closeEndpointEditorWizard = closeEndpointEditorWizard;
window.editorWizardNext = editorWizardNext;
window.editorWizardPrev = editorWizardPrev;
window.submitEndpointEditor = submitEndpointEditor;
// Endpoint Selector Modal (Change Endpoint picker)
window.openEndpointSelectorModal = openEndpointSelectorModal;
window.closeEndpointSelectorModal = closeEndpointSelectorModal;
window.filterEndpointSelector = filterEndpointSelector;
window.selectEndpointForEdit = selectEndpointForEdit;
window.switchEndpointTab = switchEndpointTab;
window.loadS3Folders = loadS3Folders;
window.refreshS3Folders = refreshS3Folders;
window.loadS3DomainFiles = loadS3DomainFiles;
window.previewS3File = previewS3File;
window.closeS3Preview = closeS3Preview;
window.downloadS3File = downloadS3File;
window.showS3UploadModal = showS3UploadModal;
window.closeS3UploadModal = closeS3UploadModal;
window.handleS3FileSelect = handleS3FileSelect;
window.submitS3Upload = submitS3Upload;
window.showS3DeleteModal = showS3DeleteModal;
window.closeS3DeleteModal = closeS3DeleteModal;
window.confirmS3Delete = confirmS3Delete;
window.sortS3Files = sortS3Files;
window.filterS3Files = filterS3Files;
// Sites Database exports
window.loadSites = loadSites;
window.editSite = editSite;
window.saveSite = saveSite;
window.showCreateSiteModal = showCreateSiteModal;
window.closeCreateSiteModal = closeCreateSiteModal;
window.createSite = createSite;
window.triggerSiteBuild = triggerSiteBuild;
window.closeSiteEditModal = closeSiteEditModal;
window.showSiteEditModal = showSiteEditModal;

// =========================================================================
// RADIUS CONTROL PANEL
// =========================================================================

/**
 * Radius Control Panel State
 */
let radiusState = {
    activeWorkflow: null,
    currentStep: 0,
    totalSteps: 0,
    sites: [],
    modules: [
        'config_fetcher', 'site_registry', 'rds_manager', 's3_content',
        'template_renderer', 'deployer', 'nginx_manager', 'aws_infra',
        'health_monitor', 'status_reporter', 'ai_assistant'
    ]
};

/**
 * Refresh Radius server status
 */
async function refreshRadiusStatus() {
    try {
        // Update server status indicator
        document.getElementById('radius-server-status').textContent = 'Checking...';
        document.getElementById('radius-server-status').className = 'badge badge--warning';

        // Simulate status check (replace with actual API call)
        const response = await fetch('/api/v1/radius/status', {
            headers: { 'X-API-Key': apiKey }
        }).catch(() => null);

        if (response && response.ok) {
            const data = await response.json();
            const isOnline = data.status === 'online';
            document.getElementById('radius-server-status').textContent = isOnline ? 'Server Online' : 'Server Offline';
            document.getElementById('radius-server-status').className = isOnline ? 'badge badge--success' : 'badge badge--danger';
            document.getElementById('radius-ec2-status').textContent = isOnline ? 'Running' : 'Stopped';
            document.getElementById('radius-active-sites').textContent = data.active_sites || '0';
            document.getElementById('radius-last-workflow').textContent = data.last_check ? new Date(data.last_check).toLocaleTimeString() : 'None';
            document.getElementById('radius-ssl-status').textContent = data.workflows_available ? 'Ready' : 'N/A';
        } else {
            // Fallback for demo/offline mode
            document.getElementById('radius-server-status').textContent = 'Connecting...';
            document.getElementById('radius-server-status').className = 'badge badge--warning';
            document.getElementById('radius-ec2-status').textContent = 'Unknown';
            document.getElementById('radius-active-sites').textContent = '--';
            document.getElementById('radius-last-workflow').textContent = '--';
            document.getElementById('radius-ssl-status').textContent = '--';
        }
    } catch (error) {
        console.error('Failed to refresh Radius status:', error);
        document.getElementById('radius-server-status').textContent = 'Offline';
        document.getElementById('radius-server-status').className = 'badge badge--danger';
    }
}

/**
 * Refresh Radius managed sites list
 */
async function refreshRadiusSites() {
    const tbody = document.getElementById('radius-sites-tbody');
    tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">Loading sites...</td></tr>';

    try {
        const response = await fetch('/api/v1/radius/sites', {
            headers: { 'X-API-Key': apiKey }
        }).catch(() => null);

        if (response && response.ok) {
            const sites = await response.json();
            radiusState.sites = sites;
            renderRadiusSites(sites);
        } else {
            // Demo data
            const demoSites = [
                { site_uid: 'SN-00000048', domain: 'example.com', site_type: 'R', status: 'active', ssl_status: 'valid', cloudfront_status: 'deployed', updated_at: '2025-01-24' },
                { site_uid: 'SN-00000052', domain: 'demo-site.net', site_type: 'R', status: 'active', ssl_status: 'valid', cloudfront_status: 'deployed', updated_at: '2025-01-23' }
            ];
            radiusState.sites = demoSites;
            renderRadiusSites(demoSites);
        }
    } catch (error) {
        console.error('Failed to load Radius sites:', error);
        tbody.innerHTML = '<tr><td colspan="8" class="text-center text-danger">Failed to load sites</td></tr>';
    }
}

/**
 * Render Radius sites table
 */
function renderRadiusSites(sites) {
    const tbody = document.getElementById('radius-sites-tbody');

    if (!sites || sites.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center text-muted">No Radius sites found</td></tr>';
        return;
    }

    tbody.innerHTML = sites.map(site => `
        <tr>
            <td><code>${site.site_uid || '--'}</code></td>
            <td><a href="https://${site.domain}" target="_blank">${site.domain}</a></td>
            <td><span class="badge badge--info">${site.site_type || 'R'}</span></td>
            <td><span class="badge badge--${site.status === 'active' ? 'success' : 'warning'}">${site.status || 'unknown'}</span></td>
            <td><span class="badge badge--${site.ssl_status === 'valid' ? 'success' : 'danger'}">${site.ssl_status || '--'}</span></td>
            <td><span class="badge badge--${site.cloudfront_status === 'deployed' ? 'success' : 'warning'}">${site.cloudfront_status || '--'}</span></td>
            <td>${site.updated_at || '--'}</td>
            <td>
                <button class="btn btn-secondary btn-xs" onclick="radiusSiteAction('${site.domain}', 'UPDATE_CONTENT')">Update</button>
                <button class="btn btn-secondary btn-xs" onclick="radiusSiteAction('${site.domain}', 'MONITOR')">Check</button>
            </td>
        </tr>
    `).join('');
}

/**
 * Filter Radius sites
 */
function filterRadiusSites() {
    const search = document.getElementById('radius-sites-search').value.toLowerCase();
    const filtered = radiusState.sites.filter(site =>
        site.domain.toLowerCase().includes(search) ||
        (site.site_uid && site.site_uid.toLowerCase().includes(search))
    );
    renderRadiusSites(filtered);
}

/**
 * Refresh Radius modules status
 */
function refreshRadiusModules() {
    radiusState.modules.forEach(module => {
        const card = document.getElementById(`module-${module}`);
        if (card) {
            const dot = card.querySelector('.module-status-dot');
            dot.className = 'module-status-dot grey';
        }
    });
    addRadiusLog('Modules status refreshed', 'info');
}

/**
 * Update module status during workflow execution
 */
function updateModuleStatus(moduleName, status) {
    const card = document.getElementById(`module-${moduleName}`);
    if (card) {
        const dot = card.querySelector('.module-status-dot');
        dot.className = `module-status-dot ${status}`;
    }
}

/**
 * Add entry to Radius execution log
 */
function addRadiusLog(message, type = 'info') {
    const log = document.getElementById('radius-execution-log');
    const timestamp = new Date().toLocaleTimeString();
    const entry = document.createElement('div');
    entry.className = `log-entry log-entry--${type}`;
    entry.textContent = `[${timestamp}] ${message}`;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
}

/**
 * Start workflow progress display
 */
function startWorkflowProgress(workflowName, totalSteps) {
    radiusState.activeWorkflow = workflowName;
    radiusState.currentStep = 0;
    radiusState.totalSteps = totalSteps;

    const progressSection = document.getElementById('radius-workflow-progress');
    progressSection.style.display = 'block';

    document.getElementById('active-workflow-name').textContent = workflowName;
    document.getElementById('active-workflow-status').textContent = 'Running';
    document.getElementById('active-workflow-status').className = 'badge badge--warning';
    document.getElementById('workflow-progress-fill').style.width = '0%';
    document.getElementById('workflow-step-indicator').textContent = `Step 0 of ${totalSteps}`;
}

/**
 * Update workflow progress
 */
function updateWorkflowProgress(step, moduleName, status) {
    radiusState.currentStep = step;
    const progress = (step / radiusState.totalSteps) * 100;

    document.getElementById('workflow-progress-fill').style.width = `${progress}%`;
    document.getElementById('workflow-step-indicator').textContent = `Step ${step} of ${radiusState.totalSteps}`;

    updateModuleStatus(moduleName, status);
    addRadiusLog(`${moduleName}: ${status === 'green' ? 'completed' : status === 'blue' ? 'running' : 'failed'}`, status === 'green' ? 'success' : status === 'red' ? 'error' : 'step');
}

/**
 * Complete workflow
 */
function completeWorkflow(success) {
    document.getElementById('active-workflow-status').textContent = success ? 'Completed' : 'Failed';
    document.getElementById('active-workflow-status').className = `badge badge--${success ? 'success' : 'danger'}`;
    document.getElementById('workflow-progress-fill').style.width = '100%';

    addRadiusLog(`Workflow ${radiusState.activeWorkflow} ${success ? 'completed successfully' : 'failed'}`, success ? 'success' : 'error');

    // Reset module statuses after delay
    setTimeout(() => {
        refreshRadiusModules();
    }, 3000);
}

/**
 * Trigger Radius site action
 */
async function radiusSiteAction(domain, action) {
    if (!confirm(`Are you sure you want to run ${action} on ${domain}?`)) return;

    addRadiusLog(`Starting ${action} workflow for ${domain}...`, 'info');

    // Show modules panel to see progress
    showPanel('radius-modules');

    try {
        const response = await fetch('/api/v1/radius/workflow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-Key': apiKey
            },
            body: JSON.stringify({ domain, action, site_type: 'R' })
        });

        if (response.ok) {
            const result = await response.json();
            startWorkflowProgress(`${action} - ${domain}`, result.total_steps || 10);
            // Real implementation would use WebSocket/SSE for progress updates
            simulateWorkflowProgress(action);
        } else {
            addRadiusLog(`Failed to start workflow: ${response.statusText}`, 'error');
        }
    } catch (error) {
        console.error('Workflow error:', error);
        addRadiusLog(`Workflow error: ${error.message}`, 'error');
        // Simulate for demo
        simulateWorkflowProgress(action);
    }
}

/**
 * Simulate workflow progress (for demo/offline mode)
 */
function simulateWorkflowProgress(action) {
    const workflows = {
        'CREATE': ['config_fetcher', 'site_registry', 'rds_manager', 's3_content', 'template_renderer', 'deployer', 'nginx_manager', 'aws_infra', 'status_reporter'],
        'UPDATE_CONTENT': ['config_fetcher', 'template_renderer', 'deployer', 'aws_infra', 'status_reporter'],
        'UPDATE_INFRA': ['config_fetcher', 'nginx_manager', 'aws_infra', 'status_reporter'],
        'MONITOR': ['health_monitor', 'status_reporter'],
        'DELETE': ['aws_infra', 'nginx_manager', 'deployer', 's3_content', 'rds_manager', 'site_registry', 'status_reporter']
    };

    const steps = workflows[action] || workflows['UPDATE_CONTENT'];
    startWorkflowProgress(`${action}`, steps.length);

    let i = 0;
    const interval = setInterval(() => {
        if (i > 0) updateModuleStatus(steps[i-1], 'green');
        if (i < steps.length) {
            updateModuleStatus(steps[i], 'blue');
            updateWorkflowProgress(i + 1, steps[i], 'blue');
        }
        i++;
        if (i > steps.length) {
            clearInterval(interval);
            completeWorkflow(true);
        }
    }, 800);
}

/**
 * Open Create Site Modal
 */
function openRadiusCreateSiteModal() {
    const modal = document.createElement('div');
    modal.id = 'radius-create-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal" style="max-width: 500px;">
            <div class="modal-header">
                <h3 class="modal-title">Create Radius Site</h3>
                <button class="modal-close" onclick="closeRadiusModal('radius-create-modal')">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label class="form-label">Domain Name</label>
                    <input type="text" class="form-input" id="radius-new-domain" placeholder="example.com">
                </div>
                <div class="form-group">
                    <label class="form-label">Template</label>
                    <select class="form-input" id="radius-template">
                        <option value="brochure-standard">Standard Brochure</option>
                        <option value="brochure-premium">Premium Brochure</option>
                        <option value="landing-page">Landing Page</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">
                        <input type="checkbox" id="radius-setup-dns" checked> Setup DNS (Route53)
                    </label>
                </div>
                <div class="form-group">
                    <label class="form-label">
                        <input type="checkbox" id="radius-setup-ssl" checked> Request SSL (ACM)
                    </label>
                </div>
                <div class="form-group">
                    <label class="form-label">
                        <input type="checkbox" id="radius-setup-cdn" checked> Setup CDN (CloudFront)
                    </label>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeRadiusModal('radius-create-modal')">Cancel</button>
                <button class="btn btn-primary" onclick="submitRadiusCreateSite()">Create Site</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'flex';
}

/**
 * Submit Create Site
 */
async function submitRadiusCreateSite() {
    const domain = document.getElementById('radius-new-domain').value.trim();
    if (!domain) {
        alert('Please enter a domain name');
        return;
    }

    closeRadiusModal('radius-create-modal');
    radiusSiteAction(domain, 'CREATE');
}

/**
 * Open Update Content Modal
 */
function openRadiusUpdateContentModal() {
    openRadiusSiteSelectModal('UPDATE_CONTENT', 'Update Site Content');
}

/**
 * Open Update Infra Modal
 */
function openRadiusUpdateInfraModal() {
    openRadiusSiteSelectModal('UPDATE_INFRA', 'Update Site Infrastructure');
}

/**
 * Open Rebuild Modal
 */
function openRadiusRebuildModal() {
    openRadiusSiteSelectModal('REBUILD', 'Rebuild Site');
}

/**
 * Open Health Check Modal
 */
function openRadiusHealthCheckModal() {
    openRadiusSiteSelectModal('MONITOR', 'Health Check');
}

/**
 * Open Delete Modal
 */
function openRadiusDeleteModal() {
    openRadiusSiteSelectModal('DELETE', 'Delete Site');
}

/**
 * Open site selection modal for actions
 */
function openRadiusSiteSelectModal(action, title) {
    const sites = radiusState.sites.length > 0 ? radiusState.sites : [
        { domain: 'example.com', site_uid: 'SN-00000048' },
        { domain: 'demo-site.net', site_uid: 'SN-00000052' }
    ];

    const modal = document.createElement('div');
    modal.id = 'radius-select-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal" style="max-width: 450px;">
            <div class="modal-header">
                <h3 class="modal-title">${title}</h3>
                <button class="modal-close" onclick="closeRadiusModal('radius-select-modal')">&times;</button>
            </div>
            <div class="modal-body">
                <div class="form-group">
                    <label class="form-label">Select Site</label>
                    <select class="form-input" id="radius-select-site">
                        ${sites.map(s => `<option value="${s.domain}">${s.domain} (${s.site_uid})</option>`).join('')}
                    </select>
                </div>
                ${action === 'DELETE' ? '<p class="text-danger"><strong>Warning:</strong> This will permanently remove the site from Radius.</p>' : ''}
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeRadiusModal('radius-select-modal')">Cancel</button>
                <button class="btn ${action === 'DELETE' ? 'btn-danger' : 'btn-primary'}" onclick="submitRadiusSiteSelect('${action}')">${title}</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'flex';
}

/**
 * Submit site selection
 */
function submitRadiusSiteSelect(action) {
    const domain = document.getElementById('radius-select-site').value;
    closeRadiusModal('radius-select-modal');
    radiusSiteAction(domain, action);
}

/**
 * Open AI Console
 */
function openRadiusAIConsole() {
    const modal = document.createElement('div');
    modal.id = 'radius-ai-modal';
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal" style="max-width: 700px; max-height: 80vh;">
            <div class="modal-header">
                <h3 class="modal-title">Radius AI Assistant</h3>
                <button class="modal-close" onclick="closeRadiusModal('radius-ai-modal')">&times;</button>
            </div>
            <div class="modal-body" style="max-height: 60vh; overflow-y: auto;">
                <div class="ai-console">
                    <div class="ai-console__info">
                        <p>The AI Assistant is automatically invoked when workflow steps fail. It analyzes errors, suggests fixes, and can escalate issues for human review.</p>
                        <h4>Recent AI Interactions</h4>
                        <div class="ai-interactions-list" id="ai-interactions">
                            <div class="ai-interaction">
                                <span class="ai-interaction__time">No recent interactions</span>
                            </div>
                        </div>
                    </div>
                    <div class="ai-console__manual">
                        <h4>Manual Diagnosis Request</h4>
                        <textarea class="form-input" id="ai-diagnosis-input" rows="3" placeholder="Describe an issue for AI analysis..."></textarea>
                        <button class="btn btn-primary" onclick="submitAIDiagnosis()" style="margin-top: 0.5rem;">Request Diagnosis</button>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button class="btn btn-secondary" onclick="closeRadiusModal('radius-ai-modal')">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    modal.style.display = 'flex';
}

/**
 * Submit AI diagnosis request
 */
async function submitAIDiagnosis() {
    const input = document.getElementById('ai-diagnosis-input').value.trim();
    if (!input) return;

    addRadiusLog('AI diagnosis requested...', 'info');
    alert('AI diagnosis request submitted. This feature requires the ai_assistant module to be active.');
}

/**
 * Close Radius modal
 */
function closeRadiusModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.remove();
}

// Export Radius functions
window.refreshRadiusStatus = refreshRadiusStatus;
window.refreshRadiusSites = refreshRadiusSites;
window.filterRadiusSites = filterRadiusSites;
window.refreshRadiusModules = refreshRadiusModules;
window.radiusSiteAction = radiusSiteAction;
window.openRadiusCreateSiteModal = openRadiusCreateSiteModal;
window.openRadiusUpdateContentModal = openRadiusUpdateContentModal;
window.openRadiusUpdateInfraModal = openRadiusUpdateInfraModal;
window.openRadiusRebuildModal = openRadiusRebuildModal;
window.openRadiusHealthCheckModal = openRadiusHealthCheckModal;
window.openRadiusDeleteModal = openRadiusDeleteModal;
window.openRadiusAIConsole = openRadiusAIConsole;
window.closeRadiusModal = closeRadiusModal;
window.submitRadiusCreateSite = submitRadiusCreateSite;
window.submitRadiusSiteSelect = submitRadiusSiteSelect;
window.submitAIDiagnosis = submitAIDiagnosis;

// ============================================================================
// INFRASTRUCTURE PANEL FUNCTIONS
// ============================================================================

/**
 * Infrastructure endpoints loaded dynamically from endpoint_taxonomy (type I)
 */
let infrastructureEndpoints = [];

/**
 * Load Critical Infrastructure table from endpoint_taxonomy (endpoint_type=I)
 * Fetches all I-type endpoints and renders them into the critical-servers-table
 */
async function loadCriticalInfrastructure() {
    console.log('[Infrastructure] Loading critical infrastructure from taxonomy...');
    const tbody = document.getElementById('critical-servers-table');
    if (!tbody) return;

    try {
        const response = await fetch('/api/brochure/taxonomy?endpoint_type=I');
        const data = await response.json();

        if (!data.success || !data.endpoints) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #ef4444;">Failed to load infrastructure</td></tr>';
            return;
        }

        infrastructureEndpoints = data.endpoints;
        const platformBadges = {
            'LS': { label: 'Lightsail', cls: 'badge-info' },
            'RDS': { label: 'RDS', cls: 'badge-warning' },
            'EC2': { label: 'EC2', cls: 'badge-info' },
            'S3B': { label: 'S3', style: 'background: #f97316; color: white;' },
            'LMB': { label: 'Lambda', style: 'background: #f59e0b; color: white;' },
            'CF': { label: 'CloudFront', cls: 'badge-info' },
            'AGW': { label: 'API Gateway', style: 'background: #ec4899; color: white;' },
            'SNS': { label: 'SNS', cls: 'badge-secondary' },
            'SQS': { label: 'SQS', cls: 'badge-secondary' }
        };

        if (infrastructureEndpoints.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--text-muted);">No infrastructure endpoints found</td></tr>';
            return;
        }

        tbody.innerHTML = infrastructureEndpoints.map(ep => {
            const pt = (ep.platform_type || '').trim();
            const badge = platformBadges[pt] || { label: pt, cls: 'badge-secondary' };
            const badgeHtml = badge.style
                ? `<span class="badge" style="${badge.style}">${badge.label}</span>`
                : `<span class="badge ${badge.cls}">${badge.label}</span>`;

            // Show domain_name or pulse_url as address, truncated
            const addr = ep.pulse_url || ep.domain_name || '-';
            const addrDisplay = addr.length > 50 ? addr.substring(0, 50) + '...' : addr;
            const displayName = ep.display_name || ep.domain_name.split('.')[0] || ep.domain_name;
            const statusId = `infra-${ep.site_uid}-status`;

            return `<tr>
                <td><code style="font-size: 0.75rem;">${ep.site_uid}</code></td>
                <td><strong>${displayName}</strong></td>
                <td><code style="font-size: 0.7rem;">${addrDisplay}</code></td>
                <td>${badgeHtml}</td>
                <td style="font-size: 0.8rem;">${ep.notes || ''}</td>
                <td id="${statusId}"><span class="status-dot grey"></span> Pending</td>
            </tr>`;
        }).join('');

        console.log(`[Infrastructure] Loaded ${infrastructureEndpoints.length} infrastructure endpoints`);
    } catch (e) {
        console.error('[Infrastructure] Failed to load:', e);
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #ef4444;">Error loading infrastructure</td></tr>';
    }
}

/**
 * Refresh infrastructure status - pings each endpoint via its pulse_method
 * Uses infrastructureEndpoints loaded by loadCriticalInfrastructure()
 */
async function refreshInfrastructureStatus() {
    if (infrastructureEndpoints.length === 0) {
        console.log('[Infrastructure] No endpoints loaded yet, loading first...');
        await loadCriticalInfrastructure();
    }

    console.log('[Infrastructure] Refreshing server status via Pulse...');

    const pulseTimeEl = document.getElementById('infra-pulse-sync-time');
    if (pulseTimeEl) pulseTimeEl.textContent = 'Checking...';

    let successCount = 0;
    const totalCount = infrastructureEndpoints.length;

    for (const ep of infrastructureEndpoints) {
        const statusId = `infra-${ep.site_uid}-status`;
        const statusEl = document.getElementById(statusId);
        if (statusEl) statusEl.innerHTML = '<span class="status-dot grey"></span> Checking...';

        const method = (ep.pulse_method || '').trim();
        const pulseUrl = ep.pulse_url || ep.domain_name || '';
        if (!method || !pulseUrl) {
            if (statusEl) statusEl.innerHTML = '<span class="status-dot grey"></span> No pulse';
            continue;
        }

        try {
            // Build pulse check URL based on method
            let checkUrl;
            if (method === 'http_ip') {
                // Extract IP from pulse_url for http_ip method
                checkUrl = `${CONNECT_API_URL}/api/v1/pulse/check?method=http_ip&url=ip:${pulseUrl}`;
            } else if (method === 'tcp') {
                checkUrl = `${CONNECT_API_URL}/api/v1/pulse/check?method=tcp&url=${encodeURIComponent(pulseUrl)}`;
            } else {
                checkUrl = `${CONNECT_API_URL}/api/v1/pulse/check?method=${method}&url=${encodeURIComponent(pulseUrl)}`;
            }

            const result = await fetch(checkUrl);
            const data = await result.json();

            const displayName = ep.display_name || ep.domain_name;
            console.log(`[Infrastructure] ${displayName}: ${data.status} ${data.latency_ms}ms`);

            if (statusEl) {
                const statusClass = data.status === 'green' ? 'green' : data.status === 'orange' ? 'orange' : 'red';
                const statusText = data.status === 'green' ? 'Running' :
                                   data.status === 'orange' ? `Slow (${data.latency_ms}ms)` :
                                   data.error ? data.error : 'Down';
                statusEl.innerHTML = `<span class="status-dot ${statusClass}"></span> ${statusText}`;
            }

            if (data.status === 'green' || data.status === 'orange') successCount++;
        } catch (e) {
            console.error(`[Infrastructure] Failed to check ${ep.site_uid}:`, e);
            if (statusEl) statusEl.innerHTML = '<span class="status-dot red"></span> Error';
        }
    }

    if (pulseTimeEl) pulseTimeEl.textContent = new Date().toLocaleString();

    // Update nav status dot
    const navStatusEl = document.getElementById('nav-status-servers');
    if (navStatusEl) {
        if (successCount === totalCount) navStatusEl.className = 'nav-status-dot green';
        else if (successCount > 0) navStatusEl.className = 'nav-status-dot orange';
        else navStatusEl.className = 'nav-status-dot red';
    }

    console.log(`[Infrastructure] Status check complete: ${successCount}/${totalCount} endpoints online`);
}

/**
 * Load RDS section: instances (I/RDS) and databases (D/RD) from taxonomy
 */
async function loadRDSSection() {
    console.log('[Infrastructure] Loading RDS section from taxonomy...');

    const instancesTbody = document.getElementById('rds-instances-tbody');
    const dbsTbody = document.getElementById('rds-databases-tbody');

    try {
        // Fetch I/RDS instances and D/RD databases in parallel
        const [instancesRes, dbsRes] = await Promise.all([
            fetch('/api/brochure/taxonomy?endpoint_type=I&platform_type=RDS'),
            fetch('/api/brochure/taxonomy?endpoint_type=D&platform_type=RD')
        ]);
        const instancesData = await instancesRes.json();
        const dbsData = await dbsRes.json();

        const instances = (instancesData.success && instancesData.endpoints) ? instancesData.endpoints : [];
        const databases = (dbsData.success && dbsData.endpoints) ? dbsData.endpoints : [];

        // Update counts
        const countRdsTotal = document.getElementById('count-rds-total');
        if (countRdsTotal) countRdsTotal.textContent = instances.length;
        const countRdsDatabases = document.getElementById('count-rds-databases');
        if (countRdsDatabases) countRdsDatabases.textContent = databases.length;
        const countRdsDbTotal = document.getElementById('count-rds-db-total');
        if (countRdsDbTotal) countRdsDbTotal.textContent = databases.length;
        // Update stat card
        const statRds = document.getElementById('stat-rds-running');
        if (statRds) statRds.textContent = instances.length;

        // Build instance-to-hostname map for database instance column
        const instanceMap = {};
        instances.forEach((inst, idx) => {
            const host = (inst.pulse_url || inst.domain_name || '').split(':')[0];
            instanceMap[host] = inst.display_name || inst.domain_name.split('.')[0] || `Instance ${idx + 1}`;
        });

        // Render RDS instances
        if (instancesTbody) {
            if (instances.length === 0) {
                instancesTbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">No RDS instances found</td></tr>';
            } else {
                instancesTbody.innerHTML = instances.map(inst => {
                    const host = inst.pulse_url || inst.domain_name || '-';
                    const hostDisplay = host.replace(':5432', '');
                    const displayName = inst.display_name || inst.domain_name.split('.')[0];
                    // Count databases on this instance
                    const instHost = host.split(':')[0];
                    const dbCount = databases.filter(db => (db.pulse_url || '').split(':')[0] === instHost).length;
                    const statusId = `rds-inst-${inst.site_uid}-status`;

                    return `<tr>
                        <td><code style="font-size: 0.75rem;">${inst.site_uid}</code></td>
                        <td><strong>${displayName}</strong></td>
                        <td><code style="font-size: 0.7rem;">${hostDisplay}</code></td>
                        <td>${dbCount} databases</td>
                        <td id="${statusId}"><span class="status-dot grey"></span> Pending</td>
                    </tr>`;
                }).join('');
            }
        }

        // Render databases
        if (dbsTbody) {
            if (databases.length === 0) {
                dbsTbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-muted);">No databases found</td></tr>';
            } else {
                dbsTbody.innerHTML = databases.map(db => {
                    const dbHost = (db.pulse_url || '').split(':')[0];
                    const instanceName = instanceMap[dbHost] || 'Unknown';
                    const displayName = db.display_name || db.domain_name;
                    const statusId = `rds-db-${db.site_uid}-status`;

                    return `<tr>
                        <td><code style="font-size: 0.75rem;">${db.site_uid}</code></td>
                        <td><strong>${displayName}</strong></td>
                        <td>${instanceName}</td>
                        <td style="font-size: 0.8rem;">${db.notes || ''}</td>
                        <td id="${statusId}"><span class="status-dot grey"></span> Pending</td>
                    </tr>`;
                }).join('');
            }
        }

        console.log(`[Infrastructure] RDS loaded: ${instances.length} instances, ${databases.length} databases`);

        // Run pulse checks on RDS instances
        for (const inst of instances) {
            const statusId = `rds-inst-${inst.site_uid}-status`;
            const statusEl = document.getElementById(statusId);
            if (!statusEl || !inst.pulse_url) continue;

            try {
                const res = await fetch(`${CONNECT_API_URL}/api/v1/pulse/check?method=tcp&url=${encodeURIComponent(inst.pulse_url)}`);
                const pulse = await res.json();
                const cls = pulse.status === 'green' ? 'green' : pulse.status === 'orange' ? 'orange' : 'red';
                const txt = pulse.status === 'green' ? `Available (${pulse.latency_ms}ms)` :
                           pulse.status === 'orange' ? `Slow (${pulse.latency_ms}ms)` :
                           pulse.error || 'Unavailable';
                statusEl.innerHTML = `<span class="status-dot ${cls}"></span> ${txt}`;
            } catch (e) {
                statusEl.innerHTML = '<span class="status-dot red"></span> Error';
            }
        }

        // Run pulse checks on databases (tcp to verify RDS connectivity)
        // Deduplicate by host — databases on the same instance share status
        const checkedHosts = {};
        for (const db of databases) {
            const statusId = `rds-db-${db.site_uid}-status`;
            const statusEl = document.getElementById(statusId);
            if (!statusEl || !db.pulse_url) {
                if (statusEl) statusEl.innerHTML = '<span class="status-dot grey"></span> No pulse_url';
                continue;
            }

            const host = db.pulse_url;
            // Reuse result if we already checked this host
            if (checkedHosts[host]) {
                const cached = checkedHosts[host];
                statusEl.innerHTML = `<span class="status-dot ${cached.cls}"></span> ${cached.txt}`;
                continue;
            }

            try {
                const res = await fetch(`${CONNECT_API_URL}/api/v1/pulse/check?method=tcp&url=${encodeURIComponent(host)}`);
                const pulse = await res.json();
                const cls = pulse.status === 'green' ? 'green' : pulse.status === 'orange' ? 'orange' : 'red';
                const txt = pulse.status === 'green' ? `Online (${pulse.latency_ms}ms)` :
                           pulse.status === 'orange' ? `Slow (${pulse.latency_ms}ms)` :
                           pulse.error || 'Offline';
                statusEl.innerHTML = `<span class="status-dot ${cls}"></span> ${txt}`;
                checkedHosts[host] = { cls, txt };
            } catch (e) {
                statusEl.innerHTML = '<span class="status-dot red"></span> Error';
                checkedHosts[host] = { cls: 'red', txt: 'Error' };
            }
        }

    } catch (e) {
        console.error('[Infrastructure] Failed to load RDS section:', e);
        if (instancesTbody) instancesTbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #ef4444;">Error loading RDS data</td></tr>';
        if (dbsTbody) dbsTbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #ef4444;">Error loading database data</td></tr>';
    }
}

/**
 * Scroll to an infrastructure section when clicking a stat card
 * @param {string} sectionId - The ID of the section to scroll to
 */
function scrollToInfraSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Brief highlight effect
        section.style.transition = 'background-color 0.3s';
        section.style.backgroundColor = 'rgba(99, 102, 241, 0.1)';
        setTimeout(() => {
            section.style.backgroundColor = '';
        }, 1000);
    }
}

/**
 * Sync infrastructure stat card counts with actual table row counts
 * Called when Infrastructure panel is shown
 */
function syncInfrastructureCounts() {
    // Count rows in each table (exclude header rows)
    const tables = {
        'lightsail': { tableId: 'lightsail-table', statId: 'stat-lightsail-running', countId: 'count-lightsail-total', countRunning: true },
        'ec2': { tableId: 'ec2-table', statId: 'stat-ec2-running', countId: 'count-ec2-total', countRunning: true },
        'rds': { tableId: 'rds-table', statId: 'stat-rds-running', countId: 'count-rds-total', countRunning: false },
        'cloudfront': { tableId: 'cloudfront-table', statId: 'stat-cloudfront', countId: 'count-cloudfront-total', countRunning: false },
        'lambda': { tableId: 'lambda-table', statId: 'stat-lambda', countId: 'count-lambda-total', countRunning: false },
        's3': { tableId: 's3-table', statId: 'stat-s3', countId: 'count-s3-total', countRunning: false },
        'apigateway': { tableId: 'apigateway-table', statId: 'stat-apigateway', countId: 'count-apigateway-total', countRunning: false }
    };

    for (const [name, config] of Object.entries(tables)) {
        const table = document.getElementById(config.tableId);
        if (!table) continue;

        const rows = table.querySelectorAll('tbody tr');
        const totalCount = rows.length;

        // Update total count in section header
        const countEl = document.getElementById(config.countId);
        if (countEl) {
            countEl.textContent = totalCount;
        }

        // For Lightsail and EC2, count running instances
        if (config.countRunning) {
            let runningCount = 0;
            rows.forEach(row => {
                if (row.innerHTML.includes('status-dot green') || row.innerHTML.includes('running') || row.innerHTML.includes('available')) {
                    runningCount++;
                }
            });
            const statEl = document.getElementById(config.statId);
            if (statEl) {
                statEl.textContent = runningCount;
            }
        } else {
            // For other resources, use total count
            const statEl = document.getElementById(config.statId);
            if (statEl) {
                statEl.textContent = totalCount;
            }
        }
    }
    console.log('[Infrastructure] Counts synced with table data');
}

/**
 * Load AWS inventory tables from database (populated by sync endpoint)
 * Renders Lightsail, EC2, CloudFront, Lambda, S3, API Gateway tables
 */
async function loadAWSInventoryTables() {
    console.log('[Infrastructure] Loading AWS inventory from database...');

    try {
        const response = await fetch('/api/v1/infrastructure/inventory');
        const data = await response.json();

        if (!data.success) {
            console.error('[Infrastructure] Inventory load failed:', data.error);
            return;
        }

        const inv = data.inventory || {};
        const counts = data.counts || {};

        // Lightsail
        const lsTbody = document.getElementById('lightsail-tbody');
        if (lsTbody) {
            const items = inv.lightsail || [];
            if (items.length === 0) {
                lsTbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--text-muted);">No data — click Sync to load from AWS</td></tr>';
            } else {
                lsTbody.innerHTML = items.map(i => {
                    const d = i.data || {};
                    const statusDot = d.state === 'running' ? 'green' : d.state === 'stopped' ? 'red' : 'grey';
                    return `<tr><td>${d.name || i.name}</td><td><code>${d.ip || '-'}</code></td><td>${d.blueprint || '-'}</td><td><span class="status-dot ${statusDot}"></span> ${d.state || '-'}</td></tr>`;
                }).join('');
            }
            const countEl = document.getElementById('count-lightsail-total');
            if (countEl) countEl.textContent = items.length;
            // Count running for stat card
            const running = items.filter(i => (i.data || {}).state === 'running').length;
            const statEl = document.getElementById('stat-lightsail-running');
            if (statEl) statEl.textContent = running;
        }

        // EC2
        const ec2Tbody = document.getElementById('ec2-tbody');
        if (ec2Tbody) {
            const items = inv.ec2 || [];
            if (items.length === 0) {
                ec2Tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--text-muted);">No data — click Sync to load from AWS</td></tr>';
            } else {
                ec2Tbody.innerHTML = items.map(i => {
                    const d = i.data || {};
                    const statusDot = d.state === 'running' ? 'green' : d.state === 'stopped' ? 'red' : 'grey';
                    return `<tr><td>${d.name || i.name}</td><td><code>${d.instance_id || i.id}</code></td><td>${d.type || '-'}</td><td><code>${d.ip || '-'}</code></td><td><span class="status-dot ${statusDot}"></span> ${d.state || '-'}</td></tr>`;
                }).join('');
            }
            const countEl = document.getElementById('count-ec2-total');
            if (countEl) countEl.textContent = items.length;
            const running = items.filter(i => (i.data || {}).state === 'running').length;
            const statEl = document.getElementById('stat-ec2-running');
            if (statEl) statEl.textContent = running;
        }

        // CloudFront
        const cfTbody = document.getElementById('cloudfront-tbody');
        if (cfTbody) {
            const items = inv.cloudfront || [];
            if (items.length === 0) {
                cfTbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--text-muted);">No data — click Sync to load from AWS</td></tr>';
            } else {
                cfTbody.innerHTML = items.map(i => {
                    const d = i.data || {};
                    const aliases = (d.aliases || []).join(', ') || '-';
                    const origins = (d.origins || []).join(', ') || '-';
                    return `<tr><td><code>${d.distribution_id || i.id}</code></td><td><strong>${aliases}</strong></td><td>${origins}</td><td>${d.status || '-'}</td></tr>`;
                }).join('');
            }
            const countEl = document.getElementById('count-cloudfront-total');
            if (countEl) countEl.textContent = items.length;
            const statEl = document.getElementById('stat-cloudfront');
            if (statEl) statEl.textContent = items.length;
        }

        // Lambda
        const lambdaTbody = document.getElementById('lambda-tbody');
        if (lambdaTbody) {
            const items = inv.lambda || [];
            if (items.length === 0) {
                lambdaTbody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:var(--text-muted);">No data — click Sync to load from AWS</td></tr>';
            } else {
                lambdaTbody.innerHTML = items.map(i => {
                    const d = i.data || {};
                    return `<tr><td>${d.name || i.name}</td><td>${d.runtime || '-'}</td><td>${d.memory || 0}MB / ${d.timeout || 0}s</td><td style="font-size:0.8rem;">${d.description || ''}</td></tr>`;
                }).join('');
            }
            const countEl = document.getElementById('count-lambda-total');
            if (countEl) countEl.textContent = items.length;
            const statEl = document.getElementById('stat-lambda');
            if (statEl) statEl.textContent = items.length;
        }

        // S3
        const s3Tbody = document.getElementById('s3-tbody');
        if (s3Tbody) {
            const items = inv.s3 || [];
            if (items.length === 0) {
                s3Tbody.innerHTML = '<tr><td colspan="3" style="text-align:center;color:var(--text-muted);">No data — click Sync to load from AWS</td></tr>';
            } else {
                s3Tbody.innerHTML = items.map(i => {
                    const d = i.data || {};
                    const created = d.created ? new Date(d.created).toLocaleDateString() : '-';
                    return `<tr><td>${d.name || i.name}</td><td>${created}</td><td>-</td></tr>`;
                }).join('');
            }
            const countEl = document.getElementById('count-s3-total');
            if (countEl) countEl.textContent = items.length;
            const statEl = document.getElementById('stat-s3');
            if (statEl) statEl.textContent = items.length;
        }

        // API Gateway
        const agwTbody = document.getElementById('apigateway-tbody');
        if (agwTbody) {
            const items = inv.apigateway || [];
            if (items.length === 0) {
                agwTbody.innerHTML = '<tr><td colspan="3" style="text-align:center;color:var(--text-muted);">No data — click Sync to load from AWS</td></tr>';
            } else {
                agwTbody.innerHTML = items.map(i => {
                    const d = i.data || {};
                    return `<tr><td><strong>${d.name || i.name}</strong></td><td><code>${d.api_id || i.id}</code></td><td style="font-size:0.8rem;">${d.description || ''}</td></tr>`;
                }).join('');
            }
            const countEl = document.getElementById('count-apigateway-total');
            if (countEl) countEl.textContent = items.length;
            const statEl = document.getElementById('stat-apigateway');
            if (statEl) statEl.textContent = items.length;
        }

        // Update AWS sync timestamp
        const allItems = Object.values(inv).flat();
        if (allItems.length > 0 && allItems[0].last_synced) {
            const syncTime = new Date(allItems[0].last_synced);
            const awsSyncEl = document.getElementById('infra-aws-sync-time');
            if (awsSyncEl) {
                awsSyncEl.textContent = syncTime.toLocaleString();
            }
        }

        console.log(`[Infrastructure] Inventory loaded: ${data.total} resources across ${Object.keys(inv).length} types`);
    } catch (e) {
        console.error('[Infrastructure] Failed to load inventory:', e);
    }
}

/**
 * Trigger AWS inventory sync (calls POST /api/v1/infrastructure/sync)
 * Then reloads all inventory tables
 */
async function syncAWSInventory() {
    console.log('[Infrastructure] Syncing AWS inventory...');

    const awsSyncEl = document.getElementById('infra-aws-sync-time');
    if (awsSyncEl) awsSyncEl.textContent = 'Syncing...';

    try {
        const response = await fetch('/api/v1/infrastructure/sync', { method: 'POST' });
        const data = await response.json();

        if (data.success) {
            console.log('[Infrastructure] Sync complete:', data.results);
            await loadAWSInventoryTables();
            if (awsSyncEl) awsSyncEl.textContent = new Date().toLocaleString();
        } else {
            console.error('[Infrastructure] Sync failed:', data.error);
            if (awsSyncEl) awsSyncEl.textContent = 'Sync failed';
        }
    } catch (e) {
        console.error('[Infrastructure] Sync error:', e);
        if (awsSyncEl) awsSyncEl.textContent = 'Sync error';
    }
}

/**
 * Download all Infrastructure page data as a structured CSV file
 */
function downloadInfrastructureCSV() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const rows = [];

    // Helper to escape CSV values
    function esc(val) {
        if (val == null) return '';
        const s = String(val).replace(/"/g, '""');
        return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s}"` : s;
    }

    // Helper to extract text from a table tbody
    function extractTable(tbodyId, sectionName, headers) {
        const tbody = document.getElementById(tbodyId);
        if (!tbody) return;
        const trs = tbody.querySelectorAll('tr');
        trs.forEach(tr => {
            const tds = tr.querySelectorAll('td');
            if (tds.length < 2) return; // skip loading/empty rows
            const vals = [sectionName];
            tds.forEach(td => {
                // Get text, stripping status dots
                let text = td.textContent.trim().replace(/\s+/g, ' ');
                vals.push(text);
            });
            // Pad to match header count
            while (vals.length < headers.length) vals.push('');
            rows.push(headers.map((_, i) => esc(vals[i])).join(','));
        });
    }

    // Section: Critical Infrastructure
    const critHeaders = ['Section', 'Site UID', 'Name', 'Address', 'Type', 'Notes', 'Status'];
    rows.push(critHeaders.join(','));
    extractTable('critical-servers-table', 'Critical Infrastructure', critHeaders);

    rows.push(''); // blank line separator

    // Section: RDS Instances
    const rdsInstHeaders = ['Section', 'Site UID', 'Identifier', 'Endpoint', 'Databases', 'Status'];
    rows.push(rdsInstHeaders.join(','));
    extractTable('rds-instances-tbody', 'RDS Instance', rdsInstHeaders);

    rows.push('');

    // Section: RDS Databases
    const rdsDbHeaders = ['Section', 'Site UID', 'Database Name', 'Instance', 'Notes', 'Status'];
    rows.push(rdsDbHeaders.join(','));
    extractTable('rds-databases-tbody', 'RDS Database', rdsDbHeaders);

    rows.push('');

    // Section: Lightsail
    const lsHeaders = ['Section', 'Name', 'IP Address', 'Blueprint', 'Status'];
    rows.push(lsHeaders.join(','));
    extractTable('lightsail-tbody', 'Lightsail', lsHeaders);

    rows.push('');

    // Section: EC2
    const ec2Headers = ['Section', 'Name', 'Instance ID', 'Type', 'IP Address', 'Status'];
    rows.push(ec2Headers.join(','));
    extractTable('ec2-tbody', 'EC2', ec2Headers);

    rows.push('');

    // Section: CloudFront
    const cfHeaders = ['Section', 'ID', 'Domain Alias', 'Origin', 'Purpose'];
    rows.push(cfHeaders.join(','));
    extractTable('cloudfront-tbody', 'CloudFront', cfHeaders);

    rows.push('');

    // Section: Lambda
    const lambdaHeaders = ['Section', 'Function Name', 'Runtime', 'Memory / Timeout', 'Description'];
    rows.push(lambdaHeaders.join(','));
    extractTable('lambda-tbody', 'Lambda', lambdaHeaders);

    rows.push('');

    // Section: S3
    const s3Headers = ['Section', 'Bucket Name', 'Created', 'Status'];
    rows.push(s3Headers.join(','));
    extractTable('s3-tbody', 'S3', s3Headers);

    rows.push('');

    // Section: API Gateway
    const agwHeaders = ['Section', 'API Name', 'API ID', 'Description'];
    rows.push(agwHeaders.join(','));
    extractTable('apigateway-tbody', 'API Gateway', agwHeaders);

    // Build and download file
    const csv = rows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shopnet-infrastructure-${timestamp}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    // Update CSV timestamp
    const csvTimeEl = document.getElementById('infra-csv-time');
    if (csvTimeEl) csvTimeEl.textContent = new Date().toLocaleString();

    console.log(`[Infrastructure] CSV downloaded: ${rows.filter(r => r).length} rows`);
}

// Export Infrastructure functions
window.loadCriticalInfrastructure = loadCriticalInfrastructure;
window.refreshInfrastructureStatus = refreshInfrastructureStatus;
window.loadRDSSection = loadRDSSection;
window.loadAWSInventoryTables = loadAWSInventoryTables;
window.syncAWSInventory = syncAWSInventory;
window.scrollToInfraSection = scrollToInfraSection;
window.syncInfrastructureCounts = syncInfrastructureCounts;
window.downloadInfrastructureCSV = downloadInfrastructureCSV;


// ============================================
// AGENT INSTANCE WIZARDS (Level 1 — agent_uid)
// ============================================
// THE LAW: These wizards manage agent INSTANCES in shopnet_assist.agents.
// They issue agent_uid (SA-XXXXXXXX) via Connect Gateway.
// Level 1 wizards CANNOT modify Level 0 data (endpoint_taxonomy, site_uid).
// ============================================

let agentWizardStep = 1;
let agentWizardData = {};
let allAgentsForSelector = [];
let removeAgentsForSelector = [];
let selectedAgentToRemove = null;
let currentEditAgentUid = null;

// --- ADD AGENT WIZARD ---

async function openAgentAdderWizard() {
    agentWizardStep = 1;
    agentWizardData = {};
    document.getElementById('agentAdderModal').style.display = 'flex';
    showAgentWizardStep(1);
    await loadAgentPlatforms();
}

function closeAgentAdderWizard() {
    document.getElementById('agentAdderModal').style.display = 'none';
    agentWizardStep = 1;
    agentWizardData = {};
}

function showAgentWizardStep(step) {
    // Hide all steps
    document.querySelectorAll('.agent-wizard-step').forEach(el => el.style.display = 'none');
    // Show requested step
    const stepEl = document.getElementById(`agent-step-${step}`);
    if (stepEl) stepEl.style.display = 'block';

    // Update step indicators
    document.querySelectorAll('.agent-step-indicator').forEach(el => {
        const s = parseInt(el.dataset.step);
        if (s < step) {
            el.style.border = '2px solid #22c55e';
            el.style.color = '#22c55e';
            el.style.background = 'rgba(34,197,94,0.1)';
        } else if (s === step) {
            el.style.border = '2px solid #8b5cf6';
            el.style.color = '#8b5cf6';
            el.style.background = 'transparent';
        } else {
            el.style.border = '2px solid var(--border)';
            el.style.color = 'var(--text-secondary)';
            el.style.background = 'transparent';
        }
    });

    // Back button visibility
    const backBtn = document.getElementById('agent-wiz-back-btn');
    if (backBtn) backBtn.style.display = step > 1 ? 'inline-block' : 'none';

    // Next button text
    const nextBtn = document.getElementById('agent-wiz-next-btn');
    if (nextBtn) nextBtn.textContent = step === 3 ? 'Create Agent' : 'Next';
}

async function loadAgentPlatforms() {
    const container = document.getElementById('agent-platform-list');
    try {
        const response = await fetch(`${CONNECT_API_URL}/api/v1/agent-platforms`);
        const data = await response.json();
        if (data.success && data.platforms.length > 0) {
            container.innerHTML = data.platforms.map(p => `
                <div onclick="selectAgentPlatform('${p.site_uid}', '${(p.display_name || p.domain_name).replace(/'/g, "\\'")}', '${p.domain_name}')"
                     style="padding: 1rem; border: 2px solid var(--border); border-radius: 8px; cursor: pointer; transition: all 0.2s;"
                     onmouseover="this.style.borderColor='#8b5cf6'" onmouseout="this.style.borderColor='var(--border)'">
                    <div style="font-weight: 600; color: var(--text-primary);">${p.display_name || p.card_label || p.domain_name}</div>
                    <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 4px;">
                        <code>${p.site_uid}</code> &middot; ${p.domain_name}
                    </div>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; color: var(--text-secondary); padding: 2rem;">No agent platforms found. Register platforms via the Endpoint Taxonomy wizards first.</div>';
        }
    } catch (err) {
        container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #ef4444;">Error loading platforms: ${err.message}</div>`;
    }
}

function selectAgentPlatform(siteUid, displayName, domainName) {
    agentWizardData.site_uid = siteUid;
    agentWizardData.platform_name = displayName;
    agentWizardData.platform_domain = domainName;
    // Highlight selected
    document.querySelectorAll('#agent-platform-list > div').forEach(el => {
        el.style.borderColor = el.querySelector('code')?.textContent === siteUid ? '#8b5cf6' : 'var(--border)';
        el.style.background = el.querySelector('code')?.textContent === siteUid ? 'rgba(139,92,246,0.08)' : 'transparent';
    });
}

function agentWizardNext() {
    if (agentWizardStep === 1) {
        if (!agentWizardData.site_uid) {
            showToast('Please select an agent platform', 'error');
            return;
        }
        agentWizardStep = 2;
        // Populate step 2 header
        document.getElementById('agent-step2-platform-name').textContent = agentWizardData.platform_name;
        document.getElementById('agent-step2-site-uid').textContent = agentWizardData.site_uid;
        showAgentWizardStep(2);
    } else if (agentWizardStep === 2) {
        // Validate required fields
        const agentId = document.getElementById('agent-wiz-agent-id').value.trim();
        const agentName = document.getElementById('agent-wiz-agent-name').value.trim();
        if (!agentId || !agentName) {
            showToast('Agent ID and Agent Name are required', 'error');
            return;
        }
        // Collect all step 2 data
        agentWizardData.agent_id = agentId;
        agentWizardData.agent_name = agentName;
        agentWizardData.agent_type = document.getElementById('agent-wiz-agent-type').value;
        agentWizardData.agent_skill = document.getElementById('agent-wiz-agent-skill').value;
        agentWizardData.status = document.getElementById('agent-wiz-status').value;
        agentWizardData.model_tier = document.getElementById('agent-wiz-model-tier').value;
        agentWizardData.agent_role = document.getElementById('agent-wiz-agent-role').value.trim() || null;
        agentWizardData.agent_title = document.getElementById('agent-wiz-agent-title').value.trim() || null;
        agentWizardData.agent_ui_name = document.getElementById('agent-wiz-ui-name').value.trim() || null;
        agentWizardData.agent_ui_icon = document.getElementById('agent-wiz-ui-icon').value.trim() || null;
        agentWizardData.agent_ui_color = document.getElementById('agent-wiz-ui-color').value || null;
        agentWizardData.enabled = document.getElementById('agent-wiz-enabled').checked;
        agentWizardData.primary_mode = document.getElementById('agent-wiz-primary-mode').value.trim() || null;
        agentWizardData.catchphrase = document.getElementById('agent-wiz-catchphrase').value.trim() || null;
        agentWizardData.personality = document.getElementById('agent-wiz-personality').value.trim() || null;
        agentWizardData.agent_notes = document.getElementById('agent-wiz-agent-notes').value.trim() || null;

        // Build confirmation summary
        const summary = document.getElementById('agent-confirm-summary');
        summary.innerHTML = `
            <div><strong>Platform:</strong> ${agentWizardData.platform_name}</div>
            <div><strong>site_uid:</strong> <code>${agentWizardData.site_uid}</code></div>
            <div><strong>Agent ID:</strong> ${agentWizardData.agent_id}</div>
            <div><strong>Agent Name:</strong> ${agentWizardData.agent_name}</div>
            <div><strong>Type:</strong> ${agentWizardData.agent_type}</div>
            <div><strong>Skill:</strong> ${agentWizardData.agent_skill}</div>
            <div><strong>Status:</strong> ${agentWizardData.status}</div>
            <div><strong>Model:</strong> ${agentWizardData.model_tier}</div>
            ${agentWizardData.agent_role ? `<div><strong>Role:</strong> ${agentWizardData.agent_role}</div>` : ''}
            ${agentWizardData.agent_title ? `<div><strong>Title:</strong> ${agentWizardData.agent_title}</div>` : ''}
            ${agentWizardData.agent_ui_name ? `<div><strong>UI Name:</strong> ${agentWizardData.agent_ui_name}</div>` : ''}
            ${agentWizardData.agent_ui_icon ? `<div><strong>Icon:</strong> ${agentWizardData.agent_ui_icon}</div>` : ''}
            <div><strong>Enabled:</strong> ${agentWizardData.enabled ? 'Yes' : 'No'}</div>
            ${agentWizardData.primary_mode ? `<div style="grid-column: 1/-1;"><strong>Primary Mode:</strong> ${agentWizardData.primary_mode}</div>` : ''}
            ${agentWizardData.catchphrase ? `<div style="grid-column: 1/-1;"><strong>Catchphrase:</strong> ${agentWizardData.catchphrase}</div>` : ''}
        `;

        agentWizardStep = 3;
        showAgentWizardStep(3);
    } else if (agentWizardStep === 3) {
        submitAgentWizard();
    }
}

function agentWizardBack() {
    if (agentWizardStep > 1) {
        agentWizardStep--;
        showAgentWizardStep(agentWizardStep);
    }
}

async function submitAgentWizard() {
    const nextBtn = document.getElementById('agent-wiz-next-btn');
    nextBtn.disabled = true;
    nextBtn.textContent = 'Creating...';

    try {
        // STEP 1: Get agent_uid from Connect Gateway (THE LAW)
        const uidResponse = await fetch(`${CONNECT_API_URL}/api/v1/agent-uid/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                site_uid: agentWizardData.site_uid,
                agent_id: agentWizardData.agent_id,
                agent_name: agentWizardData.agent_name,
                assigned_by: 'console_wizard'
            })
        });

        if (!uidResponse.ok) {
            const err = await uidResponse.json();
            throw new Error(`agent_uid creation failed: ${err.detail || uidResponse.statusText}`);
        }

        const uidData = await uidResponse.json();
        const agentUid = uidData.agent_uid;

        // STEP 2: Create agent record in shopnet_assist (via Connect Gateway)
        const agentPayload = {
            agent_uid: agentUid,
            site_uid: agentWizardData.site_uid,
            agent_id: agentWizardData.agent_id,
            agent_name: agentWizardData.agent_name,
            agent_type: agentWizardData.agent_type,
            agent_skill: agentWizardData.agent_skill,
            status: agentWizardData.status,
            model_tier: agentWizardData.model_tier,
            enabled: agentWizardData.enabled,
            agent_role: agentWizardData.agent_role,
            agent_title: agentWizardData.agent_title,
            agent_ui_name: agentWizardData.agent_ui_name,
            agent_ui_icon: agentWizardData.agent_ui_icon,
            agent_ui_color: agentWizardData.agent_ui_color,
            primary_mode: agentWizardData.primary_mode,
            catchphrase: agentWizardData.catchphrase,
            personality: agentWizardData.personality,
            agent_notes: agentWizardData.agent_notes
        };

        const agentResponse = await fetch(`${CONNECT_API_URL}/api/v1/agents`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(agentPayload)
        });

        if (!agentResponse.ok) {
            const err = await agentResponse.json();
            throw new Error(`Agent record creation failed: ${err.detail || agentResponse.statusText}`);
        }

        const agentData = await agentResponse.json();
        showToast(`Agent created: ${agentData.agent_uid} — ${agentWizardData.agent_name}`, 'success');
        closeAgentAdderWizard();

    } catch (err) {
        showToast(err.message, 'error');
        console.error('[Agent Wizard] Error:', err);
    } finally {
        nextBtn.disabled = false;
        nextBtn.textContent = 'Create Agent';
    }
}

// --- CHANGE AGENT (Selector + Editor) ---

async function openAgentSelectorModal() {
    document.getElementById('agentSelectorModal').style.display = 'flex';
    document.getElementById('agent-selector-search').value = '';
    await loadAgentsForSelector();
}

function closeAgentSelectorModal() {
    document.getElementById('agentSelectorModal').style.display = 'none';
}

async function loadAgentsForSelector() {
    const container = document.getElementById('agent-selector-list');
    try {
        const response = await fetch(`${CONNECT_API_URL}/api/v1/agents`);
        const data = await response.json();
        if (data.success) {
            allAgentsForSelector = data.agents;
            renderAgentSelectorList(allAgentsForSelector);
        } else {
            container.innerHTML = '<div style="text-align: center; color: var(--text-secondary); padding: 2rem;">No agents found.</div>';
        }
    } catch (err) {
        container.innerHTML = `<div style="text-align: center; color: #ef4444; padding: 2rem;">Error: ${err.message}</div>`;
    }
}

function renderAgentSelectorList(agents) {
    const container = document.getElementById('agent-selector-list');
    if (!agents.length) {
        container.innerHTML = '<div style="text-align: center; color: var(--text-secondary); padding: 2rem;">No agents found.</div>';
        return;
    }
    container.innerHTML = agents.map(a => `
        <div onclick="selectAgentForEdit('${a.agent_uid}')" style="padding: 0.75rem 1rem; border: 1px solid var(--border); border-radius: 8px; margin-bottom: 0.5rem; cursor: pointer; transition: border-color 0.2s;"
             onmouseover="this.style.borderColor='#eab308'" onmouseout="this.style.borderColor='var(--border)'">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <span style="font-weight: 600;">${a.agent_ui_icon || ''} ${a.agent_name}</span>
                    <span style="font-size: 0.8rem; color: var(--text-secondary); margin-left: 0.5rem;">${a.agent_type}</span>
                </div>
                <code style="font-size: 0.8rem; color: #8b5cf6;">${a.agent_uid}</code>
            </div>
            <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 4px;">
                Platform: <code>${a.site_uid}</code> &middot; Skill: ${a.agent_skill} &middot; Status: ${a.status || 'future'}
            </div>
        </div>
    `).join('');
}

function filterAgentSelector(query) {
    const q = query.toLowerCase();
    const filtered = allAgentsForSelector.filter(a =>
        (a.agent_name || '').toLowerCase().includes(q) ||
        (a.agent_uid || '').toLowerCase().includes(q) ||
        (a.site_uid || '').toLowerCase().includes(q) ||
        (a.agent_id || '').toLowerCase().includes(q)
    );
    renderAgentSelectorList(filtered);
}

async function selectAgentForEdit(agentUid) {
    closeAgentSelectorModal();
    openAgentEditorModal(agentUid);
}

// Agent Editor fields configuration (easily changeable)
const AGENT_EDITOR_FIELDS = [
    { key: 'agent_id', label: 'Agent ID', type: 'text' },
    { key: 'agent_name', label: 'Agent Name', type: 'text' },
    { key: 'agent_type', label: 'Agent Type', type: 'select', options: ['internal', 'client'] },
    { key: 'agent_skill', label: 'Agent Skill', type: 'select', options: ['chat', 'code', 'content', 'data', 'documents', 'promotion'] },
    { key: 'status', label: 'Status', type: 'select', options: ['future', 'wip', 'live', 'disabled'] },
    { key: 'model_tier', label: 'Model Tier', type: 'select', options: ['haiku', 'sonnet', 'opus'] },
    { key: 'agent_role', label: 'Agent Role', type: 'text' },
    { key: 'agent_title', label: 'Agent Title', type: 'text' },
    { key: 'agent_user_name', label: 'Username', type: 'text' },
    { key: 'agent_ui_name', label: 'UI Name', type: 'text' },
    { key: 'agent_ui_icon', label: 'UI Icon', type: 'text' },
    { key: 'agent_ui_color', label: 'UI Color', type: 'color' },
    { key: 'enabled', label: 'Enabled', type: 'checkbox' },
    { key: 'max_tokens_output', label: 'Max Tokens', type: 'number' },
    { key: 'daily_invocation_limit', label: 'Daily Limit', type: 'number' },
    { key: 'primary_mode', label: 'Primary Mode', type: 'text', fullWidth: true },
    { key: 'catchphrase', label: 'Catchphrase', type: 'text', fullWidth: true },
    { key: 'personality', label: 'Personality', type: 'textarea', fullWidth: true },
    { key: 'key_tasks', label: 'Key Tasks', type: 'textarea', fullWidth: true },
    { key: 'agent_notes', label: 'Agent Notes', type: 'textarea', fullWidth: true },
    { key: 'rd_notes', label: 'R&D Notes', type: 'textarea', fullWidth: true },
    { key: 'portrait_url', label: 'Portrait URL', type: 'text', fullWidth: true },
    { key: 'icon_url', label: 'Icon URL', type: 'text', fullWidth: true },
];

async function openAgentEditorModal(agentUid) {
    currentEditAgentUid = agentUid;
    document.getElementById('agentEditorModal').style.display = 'flex';

    try {
        const response = await fetch(`${CONNECT_API_URL}/api/v1/agents/${agentUid}`);
        const data = await response.json();
        if (!data.success) throw new Error('Agent not found');

        const agent = data.agent;
        document.getElementById('editor-agent-uid').textContent = agent.agent_uid;
        document.getElementById('editor-agent-site-uid').textContent = agent.site_uid;

        // Build editor fields dynamically
        const container = document.getElementById('agent-editor-fields');
        container.innerHTML = AGENT_EDITOR_FIELDS.map(field => {
            const val = agent[field.key] ?? '';
            const style = field.fullWidth ? 'grid-column: 1/-1;' : '';

            if (field.type === 'select') {
                const opts = field.options.map(o => `<option value="${o}" ${val === o ? 'selected' : ''}>${o}</option>`).join('');
                return `<div class="form-group" style="${style}">
                    <label style="font-weight:500;margin-bottom:0.25rem;display:block;">${field.label}</label>
                    <select data-field="${field.key}" class="form-input" style="width:100%;padding:0.6rem;border:1px solid var(--border);border-radius:6px;background:var(--bg-secondary);color:var(--text-primary);">${opts}</select>
                </div>`;
            } else if (field.type === 'checkbox') {
                return `<div class="form-group" style="${style}">
                    <label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;margin-top:1.5rem;">
                        <input type="checkbox" data-field="${field.key}" ${val ? 'checked' : ''} style="width:18px;height:18px;">
                        <span style="font-weight:500;">${field.label}</span>
                    </label>
                </div>`;
            } else if (field.type === 'textarea') {
                return `<div class="form-group" style="${style}">
                    <label style="font-weight:500;margin-bottom:0.25rem;display:block;">${field.label}</label>
                    <textarea data-field="${field.key}" rows="3" class="form-input" style="width:100%;padding:0.6rem;border:1px solid var(--border);border-radius:6px;background:var(--bg-secondary);color:var(--text-primary);resize:vertical;">${val}</textarea>
                </div>`;
            } else if (field.type === 'color') {
                return `<div class="form-group" style="${style}">
                    <label style="font-weight:500;margin-bottom:0.25rem;display:block;">${field.label}</label>
                    <input type="color" data-field="${field.key}" value="${val || '#8b5cf6'}" style="width:100%;height:38px;border:1px solid var(--border);border-radius:6px;cursor:pointer;">
                </div>`;
            } else if (field.type === 'number') {
                return `<div class="form-group" style="${style}">
                    <label style="font-weight:500;margin-bottom:0.25rem;display:block;">${field.label}</label>
                    <input type="number" data-field="${field.key}" value="${val}" class="form-input" style="width:100%;padding:0.6rem;border:1px solid var(--border);border-radius:6px;background:var(--bg-secondary);color:var(--text-primary);">
                </div>`;
            } else {
                return `<div class="form-group" style="${style}">
                    <label style="font-weight:500;margin-bottom:0.25rem;display:block;">${field.label}</label>
                    <input type="text" data-field="${field.key}" value="${val}" class="form-input" style="width:100%;padding:0.6rem;border:1px solid var(--border);border-radius:6px;background:var(--bg-secondary);color:var(--text-primary);">
                </div>`;
            }
        }).join('');

    } catch (err) {
        showToast(`Error loading agent: ${err.message}`, 'error');
        closeAgentEditorModal();
    }
}

function closeAgentEditorModal() {
    document.getElementById('agentEditorModal').style.display = 'none';
    currentEditAgentUid = null;
}

async function submitAgentEdit() {
    if (!currentEditAgentUid) return;

    const updates = {};
    document.querySelectorAll('#agent-editor-fields [data-field]').forEach(el => {
        const key = el.dataset.field;
        if (el.type === 'checkbox') {
            updates[key] = el.checked;
        } else if (el.type === 'number') {
            updates[key] = el.value ? parseInt(el.value) : null;
        } else {
            updates[key] = el.value.trim() || null;
        }
    });

    try {
        const response = await fetch(`${CONNECT_API_URL}/api/v1/agents/${currentEditAgentUid}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates)
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.detail || response.statusText);
        }

        const data = await response.json();
        showToast(`Agent ${currentEditAgentUid} updated (${data.updated_fields.length} fields)`, 'success');
        closeAgentEditorModal();
    } catch (err) {
        showToast(`Error updating agent: ${err.message}`, 'error');
    }
}

// --- REMOVE AGENT ---

async function openRemoveAgentModal() {
    document.getElementById('removeAgentSelectorModal').style.display = 'flex';
    document.getElementById('remove-agent-search').value = '';
    await loadAgentsForRemoveSelector();
}

function closeRemoveAgentModal() {
    document.getElementById('removeAgentSelectorModal').style.display = 'none';
}

async function loadAgentsForRemoveSelector() {
    const container = document.getElementById('remove-agent-list');
    try {
        const response = await fetch(`${CONNECT_API_URL}/api/v1/agents`);
        const data = await response.json();
        if (data.success) {
            removeAgentsForSelector = data.agents;
            renderRemoveAgentList(removeAgentsForSelector);
        } else {
            container.innerHTML = '<div style="text-align: center; color: var(--text-secondary); padding: 2rem;">No agents found.</div>';
        }
    } catch (err) {
        container.innerHTML = `<div style="text-align: center; color: #ef4444; padding: 2rem;">Error: ${err.message}</div>`;
    }
}

function renderRemoveAgentList(agents) {
    const container = document.getElementById('remove-agent-list');
    if (!agents.length) {
        container.innerHTML = '<div style="text-align: center; color: var(--text-secondary); padding: 2rem;">No agents found.</div>';
        return;
    }
    container.innerHTML = agents.map(a => `
        <div onclick="selectAgentForRemove('${a.agent_uid}')" style="padding: 0.75rem 1rem; border: 1px solid var(--border); border-radius: 8px; margin-bottom: 0.5rem; cursor: pointer; transition: border-color 0.2s;"
             onmouseover="this.style.borderColor='#ef4444'" onmouseout="this.style.borderColor='var(--border)'">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <span style="font-weight: 600;">${a.agent_ui_icon || ''} ${a.agent_name}</span>
                </div>
                <code style="font-size: 0.8rem; color: #ef4444;">${a.agent_uid}</code>
            </div>
            <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 4px;">
                Platform: <code>${a.site_uid}</code> &middot; Status: ${a.status || 'future'}
            </div>
        </div>
    `).join('');
}

function filterRemoveAgentSelector(query) {
    const q = query.toLowerCase();
    const filtered = removeAgentsForSelector.filter(a =>
        (a.agent_name || '').toLowerCase().includes(q) ||
        (a.agent_uid || '').toLowerCase().includes(q) ||
        (a.site_uid || '').toLowerCase().includes(q)
    );
    renderRemoveAgentList(filtered);
}

function selectAgentForRemove(agentUid) {
    selectedAgentToRemove = removeAgentsForSelector.find(a => a.agent_uid === agentUid);
    if (!selectedAgentToRemove) return;

    closeRemoveAgentModal();
    document.getElementById('removeAgentConfirmModal').style.display = 'flex';
    document.getElementById('remove-agent-confirm-details').innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; font-size: 0.9rem;">
            <div><strong>Agent Name:</strong> ${selectedAgentToRemove.agent_name}</div>
            <div><strong>agent_uid:</strong> <code>${selectedAgentToRemove.agent_uid}</code></div>
            <div><strong>Platform:</strong> <code>${selectedAgentToRemove.site_uid}</code></div>
            <div><strong>Type:</strong> ${selectedAgentToRemove.agent_type}</div>
            <div><strong>Status:</strong> ${selectedAgentToRemove.status || 'future'}</div>
            <div><strong>Skill:</strong> ${selectedAgentToRemove.agent_skill}</div>
        </div>
    `;
}

function closeRemoveAgentConfirmModal() {
    document.getElementById('removeAgentConfirmModal').style.display = 'none';
    selectedAgentToRemove = null;
}

async function confirmDeleteAgent() {
    if (!selectedAgentToRemove) return;

    try {
        const response = await fetch(`${CONNECT_API_URL}/api/v1/agents/${selectedAgentToRemove.agent_uid}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.detail || response.statusText);
        }

        const data = await response.json();
        showToast(`Agent ${data.agent_name} (${data.agent_uid}) deleted`, 'success');
        closeRemoveAgentConfirmModal();
    } catch (err) {
        showToast(`Error deleting agent: ${err.message}`, 'error');
    }
}

// --- ASSIST.SHOPNET: Agent Overview Page ---

async function loadAssistOverview() {
    const container = document.getElementById('assist-agent-cards');
    if (!container) return;

    try {
        const response = await fetch(`${CONNECT_API_URL}/api/v1/agents`);
        const data = await response.json();
        if (!data.success || !data.agents.length) {
            container.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--text-secondary); grid-column: 1/-1;">No agents registered yet.</div>';
            return;
        }

        container.innerHTML = data.agents.map(a => {
            const statusColor = { live: '#22c55e', wip: '#f59e0b', future: '#9ca3af', disabled: '#ef4444' }[a.status] || '#9ca3af';
            const iconUrl = a.icon_url || '';
            const iconHtml = iconUrl
                ? `<img src="${iconUrl}" alt="${a.agent_name}" style="width: 56px; height: 56px; border-radius: 50%; object-fit: cover; border: 2px solid ${a.agent_ui_color || '#8b5cf6'};">`
                : `<div style="width: 56px; height: 56px; border-radius: 50%; background: ${a.agent_ui_color || '#8b5cf6'}; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; color: white;">${a.agent_ui_icon || a.agent_name.charAt(0)}</div>`;

            return `
                <div style="background: var(--bg-secondary); border: 1px solid var(--border); border-radius: 10px; padding: 1.25rem; display: flex; gap: 1rem; align-items: flex-start; transition: border-color 0.2s;" onmouseover="this.style.borderColor='${a.agent_ui_color || '#8b5cf6'}'" onmouseout="this.style.borderColor='var(--border)'">
                    ${iconHtml}
                    <div style="flex: 1; min-width: 0;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
                            <div style="font-weight: 600; color: var(--text-primary);">${a.agent_ui_icon || ''} ${a.agent_name}</div>
                            <span style="width: 8px; height: 8px; border-radius: 50%; background: ${statusColor}; display: inline-block;" title="${a.status}"></span>
                        </div>
                        <div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 6px;">
                            <code style="color: #8b5cf6;">${a.agent_uid}</code> on <code>${a.site_uid}</code>
                        </div>
                        ${a.primary_mode ? `<div style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 4px;">${a.primary_mode}</div>` : ''}
                        <div style="font-size: 0.75rem; color: var(--text-secondary); display: flex; gap: 0.75rem; flex-wrap: wrap;">
                            <span>Type: <strong>${a.agent_type}</strong></span>
                            <span>Skill: <strong>${a.agent_skill}</strong></span>
                            <span>Model: <strong>${a.model_tier}</strong></span>
                            ${a.agent_role ? `<span>Role: <strong>${a.agent_role}</strong></span>` : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        // Update database control panel counts
        const countEl = document.getElementById('assist-db-agent-count');
        if (countEl) countEl.textContent = data.count;

    } catch (err) {
        container.innerHTML = `<div style="text-align: center; padding: 2rem; color: #ef4444; grid-column: 1/-1;">Error loading agents: ${err.message}</div>`;
    }
}

// Hook into showPanel to auto-load assist data and database panels
const _origShowPanel = window.showPanel;
if (_origShowPanel) {
    window.showPanel = function(panelId) {
        _origShowPanel(panelId);
        if (panelId === 'assist-overview') {
            loadAssistOverview();
        }
        if (panelId === 'rds-agent') {
            loadAgentDbTables();
        }
        if (panelId === 'rds-crm') {
            loadCrmDbTables();
        }
        if (panelId === 'rds-registry') {
            loadRegistryDbTables();
        }
    };
}

window.loadAssistOverview = loadAssistOverview;

// ============================================
// DATABASE PANEL LOAD FUNCTIONS (data.shopnet)
// ============================================

async function loadAgentDbTables() {
    try {
        const response = await fetch(`${CONNECT_API_URL}/api/v1/assist/tables`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        const tbody = document.getElementById('agent-db-tables-body');
        const statTables = document.getElementById('agent-db-stat-tables');
        const statRecords = document.getElementById('agent-db-stat-records');
        const statAgents = document.getElementById('agent-db-stat-agents');
        const statInstance = document.getElementById('agent-db-stat-instance');
        if (statTables) statTables.textContent = data.table_count || 0;
        if (statInstance) statInstance.textContent = data.instance || 'Instance 1';
        let totalRecords = 0;
        let agentCount = 0;
        if (tbody && data.tables) {
            tbody.innerHTML = data.tables.map(t => {
                totalRecords += t.row_count;
                if (t.table_name === 'agents') agentCount = t.row_count;
                return `<tr><td><strong>${t.table_name}</strong></td><td>${t.row_count.toLocaleString()}</td><td>—</td><td><button class="s3-btn s3-btn-secondary s3-btn-sm" disabled>Browse</button></td></tr>`;
            }).join('');
        }
        if (statRecords) statRecords.textContent = totalRecords.toLocaleString();
        if (statAgents) statAgents.textContent = agentCount.toLocaleString();
        const dot = document.getElementById('nav-status-rds-agent');
        if (dot) { dot.className = 'nav-status-dot green'; }
    } catch (e) {
        console.error('[AgentDB] Load error:', e);
        const dot = document.getElementById('nav-status-rds-agent');
        if (dot) { dot.className = 'nav-status-dot red'; }
    }
}

async function loadCrmDbTables() {
    try {
        const response = await fetch(`${CONNECT_API_URL}/api/v1/crm/tables`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        const tbody = document.getElementById('crm-db-tables-body');
        const statTables = document.getElementById('crm-db-stat-tables');
        const statRecords = document.getElementById('crm-db-stat-records');
        const statUsers = document.getElementById('crm-db-stat-users');
        const statInstance = document.getElementById('crm-db-stat-instance');
        if (statTables) statTables.textContent = data.table_count || 0;
        if (statInstance) statInstance.textContent = data.instance || 'Instance 2';
        let totalRecords = 0;
        let userCount = 0;
        if (tbody && data.tables) {
            tbody.innerHTML = data.tables.map(t => {
                totalRecords += t.row_count;
                if (t.table_name === 'user_taxonomy') userCount = t.row_count;
                return `<tr><td><strong>${t.table_name}</strong></td><td>${t.row_count.toLocaleString()}</td><td>—</td><td><button class="s3-btn s3-btn-secondary s3-btn-sm" disabled>Browse</button></td></tr>`;
            }).join('');
        }
        if (statRecords) statRecords.textContent = totalRecords.toLocaleString();
        if (statUsers) statUsers.textContent = userCount.toLocaleString();
        const dot = document.getElementById('nav-status-rds-crm');
        if (dot) { dot.className = 'nav-status-dot green'; }
    } catch (e) {
        console.error('[CrmDB] Load error:', e);
        const dot = document.getElementById('nav-status-rds-crm');
        if (dot) { dot.className = 'nav-status-dot red'; }
    }
}

async function loadRegistryDbTables() {
    try {
        const response = await fetch(`${CONNECT_API_URL}/api/v1/registry/tables`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        const tbody = document.getElementById('registry-db-tables-body');
        const statTables = document.getElementById('registry-db-stat-tables');
        const statRecords = document.getElementById('registry-db-stat-records');
        const statLists = document.getElementById('registry-db-stat-lists');
        const statInstance = document.getElementById('registry-db-stat-instance');
        if (statTables) statTables.textContent = data.table_count || 0;
        if (statInstance) statInstance.textContent = data.instance || 'Instance 2';
        let totalRecords = 0;
        let listCount = 0;
        if (tbody && data.tables) {
            tbody.innerHTML = data.tables.map(t => {
                totalRecords += t.row_count;
                if (t.table_name === 'list_taxonomy') listCount = t.row_count;
                return `<tr><td><strong>${t.table_name}</strong></td><td>${t.row_count.toLocaleString()}</td><td>—</td><td><button class="s3-btn s3-btn-secondary s3-btn-sm" disabled>Browse</button></td></tr>`;
            }).join('');
        }
        if (statRecords) statRecords.textContent = totalRecords.toLocaleString();
        if (statLists) statLists.textContent = listCount.toLocaleString();
        const dot = document.getElementById('nav-status-rds-registry');
        if (dot) { dot.className = 'nav-status-dot green'; }
    } catch (e) {
        console.error('[RegistryDB] Load error:', e);
        const dot = document.getElementById('nav-status-rds-registry');
        if (dot) { dot.className = 'nav-status-dot red'; }
    }
}

window.loadAgentDbTables = loadAgentDbTables;
window.loadCrmDbTables = loadCrmDbTables;
window.loadRegistryDbTables = loadRegistryDbTables;

// Export Agent wizard functions
window.openAgentAdderWizard = openAgentAdderWizard;
window.closeAgentAdderWizard = closeAgentAdderWizard;
window.agentWizardNext = agentWizardNext;
window.agentWizardBack = agentWizardBack;
window.selectAgentPlatform = selectAgentPlatform;
window.openAgentSelectorModal = openAgentSelectorModal;
window.closeAgentSelectorModal = closeAgentSelectorModal;
window.filterAgentSelector = filterAgentSelector;
window.selectAgentForEdit = selectAgentForEdit;
window.closeAgentEditorModal = closeAgentEditorModal;
window.submitAgentEdit = submitAgentEdit;
window.openRemoveAgentModal = openRemoveAgentModal;
window.closeRemoveAgentModal = closeRemoveAgentModal;
window.filterRemoveAgentSelector = filterRemoveAgentSelector;
window.selectAgentForRemove = selectAgentForRemove;
window.closeRemoveAgentConfirmModal = closeRemoveAgentConfirmModal;
window.confirmDeleteAgent = confirmDeleteAgent;
window.openAgentEditorModal = openAgentEditorModal;
