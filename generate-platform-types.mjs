#!/usr/bin/env node

/**
 * generate-platform-types.mjs
 *
 * Fetches taxonomy definitions from the live API, merges with local
 * enrichment data, and writes platform-types.js to both consuming modules.
 *
 * Usage:
 *   node generate-platform-types.mjs                # normal run
 *   node generate-platform-types.mjs --dry-run      # print to stdout, don't write
 *   node generate-platform-types.mjs --api-url URL  # override API base URL
 */

import { readFile, writeFile, access } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));

const DRY_RUN = process.argv.includes('--dry-run');
const API_BASE = process.argv.includes('--api-url')
    ? process.argv[process.argv.indexOf('--api-url') + 1]
    : 'http://50.19.186.215:8001';

const OUTPUT_TARGETS = [
    {
        path: resolve(SCRIPT_DIR, '../connect.shopnet/client-module/src/core/platform-types.js'),
        packageName: '@shopnet/client-module'
    },
    {
        path: resolve(SCRIPT_DIR, '../search.shopnet-module/src/core/platform-types.js'),
        packageName: '@shopnet/search-module'
    }
];

const ENRICHMENT_PATH = resolve(SCRIPT_DIR, 'platform-enrichments.json');

const LOG_PREFIX = '[generate-platform-types]';

// ---------------------------------------------------------------------------
// API Fetch
// ---------------------------------------------------------------------------

async function fetchApiData() {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
        const [optionsRes, labelsRes] = await Promise.all([
            fetch(`${API_BASE}/api/brochure/taxonomy-definitions/platform-options`, { signal: controller.signal }),
            fetch(`${API_BASE}/api/brochure/taxonomy-definitions/labels`, { signal: controller.signal })
        ]);

        if (!optionsRes.ok || !labelsRes.ok) {
            console.warn(`${LOG_PREFIX} API returned non-OK status (options: ${optionsRes.status}, labels: ${labelsRes.status})`);
            return null;
        }

        const optionsData = await optionsRes.json();
        const labelsData = await labelsRes.json();

        if (!optionsData.success || !labelsData.success) {
            console.warn(`${LOG_PREFIX} API returned success=false`);
            return null;
        }

        if (!optionsData.platform_options || typeof optionsData.platform_options !== 'object') {
            console.warn(`${LOG_PREFIX} API response missing platform_options`);
            return null;
        }

        return {
            platformOptions: optionsData.platform_options,
            labels: labelsData.labels
        };
    } catch (err) {
        console.warn(`${LOG_PREFIX} API unreachable at ${API_BASE}: ${err.message}`);
        return null;
    } finally {
        clearTimeout(timeout);
    }
}

// ---------------------------------------------------------------------------
// Merge Logic
// ---------------------------------------------------------------------------

function extractName(label) {
    return label.replace(/\s*\([^)]+\)\s*$/, '');
}

function mergeEndpointTypes(labels, enrichments) {
    const result = {};
    const apiTypes = labels.endpoint_type || {};
    const enrich = enrichments.endpoint_types || {};

    for (const [code, name] of Object.entries(apiTypes)) {
        result[code] = {
            code,
            name,
            description: enrich[code]?.description || `${name} endpoint`
        };
    }
    return result;
}

function mergeWebsitePlatforms(options, enrichments) {
    const result = {};
    const enrich = enrichments.website_platforms || {};

    for (const item of (options.W || [])) {
        const code = item.value;
        const e = enrich[code] || {};
        if (!enrich[code]) {
            console.warn(`${LOG_PREFIX} WARNING: No enrichment for W platform '${code}'`);
        }
        result[code] = {
            code,
            name: extractName(item.label),
            description: item.desc,
            ...(e.runtime && { runtime: e.runtime }),
            ...(e.host && { host: e.host }),
            ...(e.adapter && { adapter: e.adapter }),
            ...(e.features && { features: e.features })
        };
    }
    return result;
}

function mergeAgentPlatforms(options, enrichments) {
    const result = {};
    const enrich = enrichments.agent_platforms || {};

    for (const item of (options.A || [])) {
        const code = item.value;
        const e = enrich[code] || {};
        if (!enrich[code]) {
            console.warn(`${LOG_PREFIX} WARNING: No enrichment for A platform '${code}'`);
        }
        result[code] = {
            code,
            name: extractName(item.label),
            ...(e.provider && { provider: e.provider })
        };
    }
    return result;
}

function mergeSimplePlatforms(options, enrichments, endpointCode, enrichKey) {
    const result = {};
    const enrich = enrichments[enrichKey] || {};

    for (const item of (options[endpointCode] || [])) {
        const code = item.value;
        const e = enrich[code] || {};
        if (!enrich[code]) {
            console.warn(`${LOG_PREFIX} WARNING: No enrichment for ${endpointCode} platform '${code}'`);
        }
        result[code] = {
            code,
            name: extractName(item.label),
            ...(e.service && { service: e.service }),
            ...(item.desc && { description: item.desc })
        };
    }
    return result;
}

function mergeLabelSection(labels, enrichments, labelKey, enrichKey) {
    const result = {};
    const apiValues = labels[labelKey] || {};
    const enrich = enrichments[enrichKey] || {};

    for (const [code, name] of Object.entries(apiValues)) {
        result[code] = {
            code,
            name,
            ...(enrich[code]?.description && { description: enrich[code].description })
        };
    }
    return result;
}

// ---------------------------------------------------------------------------
// Renderer
// ---------------------------------------------------------------------------

function indent(obj, level = 2) {
    const spaces = ' '.repeat(level * 4);
    const innerSpaces = ' '.repeat((level + 1) * 4);
    const lines = [];

    for (const [key, val] of Object.entries(obj)) {
        if (Array.isArray(val)) {
            lines.push(`${innerSpaces}${key}: ${JSON.stringify(val)}`);
        } else if (typeof val === 'object' && val !== null) {
            lines.push(`${innerSpaces}${key}: ${JSON.stringify(val)}`);
        } else if (typeof val === 'string') {
            lines.push(`${innerSpaces}${key}: '${val}'`);
        } else if (typeof val === 'boolean') {
            lines.push(`${innerSpaces}${key}: ${val}`);
        } else {
            lines.push(`${innerSpaces}${key}: ${val}`);
        }
    }

    return `{\n${lines.join(',\n')}\n${spaces}}`;
}

function renderPlatformBlock(platforms, extraFields) {
    const entries = [];
    for (const [code, data] of Object.entries(platforms)) {
        const fields = [];
        for (const [key, val] of Object.entries(data)) {
            if (Array.isArray(val)) {
                fields.push(`        ${key}: ${JSON.stringify(val)}`);
            } else if (typeof val === 'string') {
                fields.push(`        ${key}: '${val}'`);
            } else if (typeof val === 'boolean') {
                fields.push(`        ${key}: ${val}`);
            }
        }
        entries.push(`    ${code}: {\n${fields.join(',\n')}\n    }`);
    }
    return entries.join(',\n');
}

function renderSimpleBlock(items) {
    const entries = [];
    for (const [code, data] of Object.entries(items)) {
        const fields = Object.entries(data)
            .map(([k, v]) => `${k}: '${v}'`)
            .join(', ');
        entries.push(`    ${code}: { ${fields} }`);
    }
    return entries.join(',\n');
}

function renderFile(data, packageName) {
    const now = new Date().toISOString();

    return `/**
 * Site Taxonomy Types
 * Defines endpoint classification and website configuration
 *
 * AUTO-GENERATED by taxonomy.shopnet/generate-platform-types.mjs
 * Generated: ${now}
 * API source: ${API_BASE}
 * SOURCE OF TRUTH: taxonomy_definition table (RDS) + platform-enrichments.json
 *
 * DO NOT EDIT MANUALLY — re-run: node taxonomy.shopnet/generate-platform-types.mjs
 *
 * @package ${packageName}
 */

// =============================================================================
// LEVEL 1: ENDPOINT TYPES
// =============================================================================

/**
 * Endpoint type definitions
 * @readonly
 * @enum {Object}
 */
export const ENDPOINT_TYPES = {
${renderSimpleBlock(data.endpointTypes)}
};

// =============================================================================
// LEVEL 2: PLATFORM TYPES (by endpoint_type)
// =============================================================================

/**
 * Website platform types (endpoint_type = W)
 * @readonly
 * @enum {Object}
 */
export const WEBSITE_PLATFORMS = {
${renderPlatformBlock(data.websitePlatforms)}
};

/**
 * Agent platform types (endpoint_type = A)
 * @readonly
 * @enum {Object}
 */
export const AGENT_PLATFORMS = {
${renderSimpleBlock(data.agentPlatforms)}
};

/**
 * Database platform types (endpoint_type = D)
 * @readonly
 * @enum {Object}
 */
export const DATABASE_PLATFORMS = {
${renderSimpleBlock(data.databasePlatforms)}
};

/**
 * Node platform types (endpoint_type = N)
 * @readonly
 * @enum {Object}
 */
export const NODE_PLATFORMS = {
${renderSimpleBlock(data.nodePlatforms)}
};

/**
 * Infrastructure platform types (endpoint_type = I)
 * @readonly
 * @enum {Object}
 */
export const INFRASTRUCTURE_PLATFORMS = {
${renderSimpleBlock(data.infrastructurePlatforms)}
};

/**
 * Other platform types (endpoint_type = O)
 * @readonly
 * @enum {Object}
 */
export const OTHER_PLATFORMS = {
${renderSimpleBlock(data.otherPlatforms)}
};

// =============================================================================
// UNIVERSAL FIELDS
// =============================================================================

/**
 * Web protocol values
 * @readonly
 */
export const WEB_PROTOCOLS = {
${renderSimpleBlock(data.webProtocols)}
};

/**
 * Status values
 * @readonly
 */
export const STATUS_VALUES = {
${Object.entries(data.statusValues).map(([key, val]) =>
    `    ${key}: { value: '${val.value}', display: '${val.display}', color: '${val.color}' }`
).join(',\n')}
};

// =============================================================================
// WEBSITE-SPECIFIC FIELDS
// =============================================================================

/**
 * Managed by values (website only)
 * @readonly
 */
export const MANAGED_BY = {
${renderSimpleBlock(data.managedBy)}
};

/**
 * Persistence values (website only)
 * @readonly
 */
export const PERSISTENCE = {
${renderSimpleBlock(data.persistence)}
};

/**
 * Website purpose values
 * @readonly
 */
export const WEBSITE_PURPOSE = {
${Object.entries(data.websitePurpose).map(([key, val]) =>
    `    ${key}: '${val}'`
).join(',\n')}
};

// =============================================================================
// PLATFORM CONFIGURATION (for module initialization)
// =============================================================================

/**
 * Platform-specific configuration overrides
 * Applied based on the site's platform_type
 */
export const PLATFORM_CONFIG = {
${Object.entries(data.platformConfig).map(([code, config]) => {
    const fields = Object.entries(config).map(([k, v]) => {
        if (typeof v === 'string') return `        ${k}: '${v}'`;
        return `        ${k}: ${v}`;
    }).join(',\n');
    return `    ${code}: {\n${fields}\n    }`;
}).join(',\n')}
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get platform type by code (website only)
 * @param {string} code - Platform code (e.g., 'WW', 'SH')
 * @returns {Object|null}
 */
export function getPlatformType(code) {
    return WEBSITE_PLATFORMS[code] || null;
}

/**
 * Get recommended adapter for platform type
 * @param {string} code - Platform code
 * @returns {string|null}
 */
export function getAdapterForPlatform(code) {
    const platform = getPlatformType(code);
    return platform?.adapter || null;
}

/**
 * Check if platform supports a feature
 * @param {string} code - Platform code
 * @param {string} feature - Feature name
 * @returns {boolean}
 */
export function platformHasFeature(code, feature) {
    const platform = getPlatformType(code);
    return platform?.features?.includes(feature) || false;
}

/**
 * Get all platforms that support a feature
 * @param {string} feature - Feature name
 * @returns {string[]} Array of platform codes
 */
export function getPlatformsWithFeature(feature) {
    return Object.entries(WEBSITE_PLATFORMS)
        .filter(([_, platform]) => platform.features?.includes(feature))
        .map(([code]) => code);
}

/**
 * Get platform-specific configuration
 * @param {string} code - Platform code
 * @returns {Object}
 */
export function getPlatformConfig(code) {
    return PLATFORM_CONFIG[code] || {};
}

/**
 * Get endpoint type definition
 * @param {string} code - Endpoint type code (W, A, D, N, I, O)
 * @returns {Object|null}
 */
export function getEndpointType(code) {
    return ENDPOINT_TYPES[code] || null;
}

/**
 * Get all platform types for an endpoint type
 * @param {string} endpointType - W, A, D, N, I, or O
 * @returns {Object}
 */
export function getPlatformsForEndpoint(endpointType) {
    switch (endpointType) {
        case 'W': return WEBSITE_PLATFORMS;
        case 'A': return AGENT_PLATFORMS;
        case 'D': return DATABASE_PLATFORMS;
        case 'N': return NODE_PLATFORMS;
        case 'I': return INFRASTRUCTURE_PLATFORMS;
        case 'O': return OTHER_PLATFORMS;
        default: return {};
    }
}

// =============================================================================
// LEGACY COMPATIBILITY (maps old codes to new)
// =============================================================================

/**
 * Legacy code mapping for migration
 * @deprecated Use new codes directly
 */
export const LEGACY_CODE_MAP = {
${Object.entries(data.legacyCodeMap).map(([old, neu]) =>
    `    '${old}': '${neu}'`
).join(',\n')}
};

/**
 * Convert legacy platform code to new code
 * @param {string} legacyCode
 * @returns {string}
 */
export function fromLegacyCode(legacyCode) {
    return LEGACY_CODE_MAP[legacyCode] || legacyCode;
}

// =============================================================================
// BACKWARD COMPATIBILITY ALIAS
// =============================================================================

/**
 * Alias for WEBSITE_PLATFORMS (backward compatibility)
 * @deprecated Use WEBSITE_PLATFORMS instead
 */
export const PLATFORM_TYPES = WEBSITE_PLATFORMS;

// =============================================================================
// DEFAULT EXPORT
// =============================================================================

export default {
    // Endpoint types
    ENDPOINT_TYPES,
    getEndpointType,
    getPlatformsForEndpoint,

    // Website platforms (primary use case for client module)
    WEBSITE_PLATFORMS,
    getPlatformType,
    getAdapterForPlatform,
    platformHasFeature,
    getPlatformsWithFeature,

    // Other endpoint platforms
    AGENT_PLATFORMS,
    DATABASE_PLATFORMS,
    NODE_PLATFORMS,
    INFRASTRUCTURE_PLATFORMS,
    OTHER_PLATFORMS,

    // Universal fields
    WEB_PROTOCOLS,
    STATUS_VALUES,

    // Website-specific fields
    MANAGED_BY,
    PERSISTENCE,
    WEBSITE_PURPOSE,

    // Configuration
    PLATFORM_CONFIG,
    getPlatformConfig,

    // Legacy support
    LEGACY_CODE_MAP,
    fromLegacyCode
};
`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
    console.log(`${LOG_PREFIX} Fetching taxonomy from ${API_BASE}...`);

    // Load enrichments
    let enrichments;
    try {
        enrichments = JSON.parse(await readFile(ENRICHMENT_PATH, 'utf-8'));
    } catch (err) {
        console.error(`${LOG_PREFIX} ERROR: Cannot read ${ENRICHMENT_PATH}: ${err.message}`);
        process.exit(1);
    }

    // Fetch API
    const apiData = await fetchApiData();

    if (!apiData) {
        // Check if target files exist (fallback is OK)
        let allExist = true;
        for (const target of OUTPUT_TARGETS) {
            try {
                await access(target.path);
            } catch {
                allExist = false;
                break;
            }
        }

        if (allExist) {
            console.warn(`${LOG_PREFIX} WARNING: API unreachable. Keeping existing files.`);
            process.exit(0);
        } else {
            console.error(`${LOG_PREFIX} ERROR: API unreachable and target files do not exist. Cannot proceed.`);
            process.exit(1);
        }
    }

    console.log(`${LOG_PREFIX} API data received. Merging with enrichments...`);

    // Merge
    const merged = {
        endpointTypes: mergeEndpointTypes(apiData.labels, enrichments),
        websitePlatforms: mergeWebsitePlatforms(apiData.platformOptions, enrichments),
        agentPlatforms: mergeAgentPlatforms(apiData.platformOptions, enrichments),
        databasePlatforms: mergeSimplePlatforms(apiData.platformOptions, enrichments, 'D', 'database_platforms'),
        nodePlatforms: mergeSimplePlatforms(apiData.platformOptions, enrichments, 'N', 'node_platforms'),
        infrastructurePlatforms: mergeSimplePlatforms(apiData.platformOptions, enrichments, 'I', 'infrastructure_platforms'),
        otherPlatforms: mergeSimplePlatforms(apiData.platformOptions, enrichments, 'O', 'other_platforms'),
        webProtocols: mergeLabelSection(apiData.labels, enrichments, 'web_protocol', 'web_protocols'),
        statusValues: buildStatusValues(apiData.labels, enrichments),
        managedBy: mergeLabelSection(apiData.labels, enrichments, 'managed_by', 'managed_by'),
        persistence: mergeLabelSection(apiData.labels, enrichments, 'persistence', 'persistence'),
        websitePurpose: buildWebsitePurpose(apiData.labels, enrichments),
        platformConfig: enrichments.platform_config || {},
        legacyCodeMap: enrichments.legacy_code_map || {}
    };

    // Write
    for (const target of OUTPUT_TARGETS) {
        const content = renderFile(merged, target.packageName);

        if (DRY_RUN) {
            console.log(`\n${'='.repeat(70)}`);
            console.log(`DRY RUN — would write to: ${target.path}`);
            console.log(`${'='.repeat(70)}\n`);
            console.log(content);
            continue;
        }

        // Diff check
        try {
            const existing = await readFile(target.path, 'utf-8');
            // Compare ignoring the Generated timestamp line
            const stripTimestamp = s => s.replace(/^ \* Generated: .+$/m, '');
            if (stripTimestamp(existing) === stripTimestamp(content)) {
                console.log(`${LOG_PREFIX} No changes for ${target.path} (skipping write)`);
                continue;
            }
        } catch {
            // File doesn't exist yet, that's fine
        }

        await writeFile(target.path, content, 'utf-8');
        console.log(`${LOG_PREFIX} Wrote ${target.path} (${Buffer.byteLength(content)} bytes)`);
    }

    if (!DRY_RUN) {
        console.log(`${LOG_PREFIX} Done.`);
    }
}

// ---------------------------------------------------------------------------
// Status + Purpose builders (special shapes)
// ---------------------------------------------------------------------------

function buildStatusValues(labels, enrichments) {
    const result = {};
    const apiValues = labels.status || {};
    const enrich = enrichments.status_values || {};

    for (const [code, name] of Object.entries(apiValues)) {
        result[code] = {
            value: code,
            display: enrich[code]?.display || name,
            color: enrich[code]?.color || 'gray'
        };
    }
    return result;
}

function buildWebsitePurpose(labels, enrichments) {
    const result = {};
    const apiValues = labels.website_purpose || {};
    const enrichPurpose = enrichments.website_purpose || {};

    for (const [code, name] of Object.entries(apiValues)) {
        result[code] = enrichPurpose[code] || name;
    }
    return result;
}

// ---------------------------------------------------------------------------
// Run
// ---------------------------------------------------------------------------

main().catch(err => {
    console.error(`${LOG_PREFIX} FATAL: ${err.message}`);
    process.exit(1);
});
