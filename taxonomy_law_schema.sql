-- ============================================================================
-- TAXONOMY LAW TABLE - Master Taxonomy Registry
-- Database: shopnet_connect
-- Purpose: Single source of truth for ALL UID type taxonomies
-- Version: v5.1 WIP
-- Date: February 9, 2026
-- ============================================================================

-- This table lives on shopnet_connect database as the master registry
-- Each operational database (shopnet_sites, shopnet_assist, etc.) has its
-- own local taxonomy table for performance, but this is the authoritative source

CREATE TABLE IF NOT EXISTS taxonomy_law (
    -- Primary Key
    id                  SERIAL PRIMARY KEY,

    -- Hierarchy Fields
    level               VARCHAR(10) NOT NULL,           -- L0, L1, L2, L3
    uid_type            VARCHAR(10),                    -- sn_, sg_, sc_, st_, sp_, sl_, su_, sa_, sv_ (NULL for L0)
    parent_code         VARCHAR(30),                    -- Parent taxonomy code (NULL for top level)
    code                VARCHAR(30) NOT NULL,           -- The taxonomy code itself

    -- Descriptive Fields
    name                VARCHAR(100) NOT NULL,          -- Human-readable name
    description         TEXT,                           -- Detailed description
    examples            TEXT,                           -- Example values or use cases

    -- System Fields
    target_database     VARCHAR(50) NOT NULL,           -- Which database stores this entity type
    status              VARCHAR(20) NOT NULL DEFAULT 'WIP',  -- live, designed, WIP, future, deprecated
    active              BOOLEAN NOT NULL DEFAULT TRUE,  -- Is this currently active/valid?
    notes               TEXT,                           -- Additional notes or context

    -- Metadata
    created_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMP NOT NULL DEFAULT NOW(),
    created_by          VARCHAR(100) DEFAULT 'system',

    -- Constraints
    CONSTRAINT taxonomy_law_unique UNIQUE(level, uid_type, parent_code, code),
    CONSTRAINT taxonomy_law_chk_level CHECK (level IN ('L0', 'L1', 'L2', 'L3')),
    CONSTRAINT taxonomy_law_chk_status CHECK (status IN ('live', 'designed', 'WIP', 'future', 'deprecated'))
);

-- ============================================================================
-- INDEXES
-- ============================================================================

-- Fast lookup by UID type
CREATE INDEX idx_taxonomy_law_uid_type ON taxonomy_law(uid_type) WHERE uid_type IS NOT NULL;

-- Fast lookup by level
CREATE INDEX idx_taxonomy_law_level ON taxonomy_law(level);

-- Fast lookup by parent (for hierarchical queries)
CREATE INDEX idx_taxonomy_law_parent ON taxonomy_law(parent_code) WHERE parent_code IS NOT NULL;

-- Fast lookup by status
CREATE INDEX idx_taxonomy_law_status ON taxonomy_law(status);

-- Fast lookup for active taxonomies
CREATE INDEX idx_taxonomy_law_active ON taxonomy_law(active) WHERE active = TRUE;

-- Composite index for common query pattern: uid_type + level + active
CREATE INDEX idx_taxonomy_law_lookup ON taxonomy_law(uid_type, level, active) WHERE active = TRUE;

-- ============================================================================
-- UPDATED_AT TRIGGER
-- ============================================================================

CREATE OR REPLACE FUNCTION update_taxonomy_law_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_taxonomy_law_updated_at
    BEFORE UPDATE ON taxonomy_law
    FOR EACH ROW
    EXECUTE FUNCTION update_taxonomy_law_timestamp();

-- ============================================================================
-- VALIDATION TRIGGER
-- ============================================================================

CREATE OR REPLACE FUNCTION validate_taxonomy_law()
RETURNS TRIGGER AS $$
BEGIN
    -- L0 must have uid_type = NULL
    IF NEW.level = 'L0' AND NEW.uid_type IS NOT NULL THEN
        RAISE EXCEPTION 'L0 (namespace level) must have uid_type = NULL';
    END IF;

    -- L1 must have parent_code = 'shopnet.network'
    IF NEW.level = 'L1' AND NEW.parent_code != 'shopnet.network' THEN
        RAISE EXCEPTION 'L1 must have parent_code = shopnet.network';
    END IF;

    -- L1 must have uid_type matching code
    IF NEW.level = 'L1' AND NEW.uid_type != NEW.code THEN
        RAISE EXCEPTION 'L1 uid_type must match code (e.g., sn_ for sn_)';
    END IF;

    -- L2+ must have uid_type set
    IF NEW.level IN ('L2', 'L3') AND NEW.uid_type IS NULL THEN
        RAISE EXCEPTION 'L2 and L3 must have uid_type set';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validate_taxonomy_law
    BEFORE INSERT OR UPDATE ON taxonomy_law
    FOR EACH ROW
    EXECUTE FUNCTION validate_taxonomy_law();

-- ============================================================================
-- HELPER VIEWS
-- ============================================================================

-- View: Active taxonomies only
CREATE OR REPLACE VIEW taxonomy_law_active AS
SELECT * FROM taxonomy_law
WHERE active = TRUE
ORDER BY level, uid_type, parent_code, code;

-- View: Live taxonomies only (deployed)
CREATE OR REPLACE VIEW taxonomy_law_live AS
SELECT * FROM taxonomy_law
WHERE active = TRUE AND status = 'live'
ORDER BY level, uid_type, parent_code, code;

-- View: Hierarchical tree for a specific UID type
-- Usage: SELECT * FROM taxonomy_tree('sn_')
CREATE OR REPLACE FUNCTION taxonomy_tree(p_uid_type VARCHAR(10))
RETURNS TABLE (
    level VARCHAR(10),
    depth INTEGER,
    code VARCHAR(30),
    name VARCHAR(100),
    parent_code VARCHAR(30),
    full_path TEXT
) AS $$
WITH RECURSIVE taxonomy_hierarchy AS (
    -- Base case: L1 (the UID type itself)
    SELECT
        t.level,
        1 as depth,
        t.code,
        t.name,
        t.parent_code,
        t.code::TEXT as full_path
    FROM taxonomy_law t
    WHERE t.uid_type = p_uid_type AND t.level = 'L1'

    UNION ALL

    -- Recursive case: children
    SELECT
        t.level,
        th.depth + 1,
        t.code,
        t.name,
        t.parent_code,
        th.full_path || ' → ' || t.code
    FROM taxonomy_law t
    INNER JOIN taxonomy_hierarchy th ON t.parent_code = th.code
    WHERE t.uid_type = p_uid_type
)
SELECT * FROM taxonomy_hierarchy
ORDER BY depth, code;
$$ LANGUAGE sql;

-- ============================================================================
-- OPERATIONAL MODEL DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE taxonomy_law IS
'Master taxonomy registry for all UID types in the SND namespace.
Lives on shopnet_connect database as the authoritative source.
Each operational database has its own local taxonomy table for performance.';

COMMENT ON COLUMN taxonomy_law.level IS
'Taxonomy level: L0 (namespace), L1 (UID type), L2 (subtype), L3 (attributes)';

COMMENT ON COLUMN taxonomy_law.uid_type IS
'UID prefix: sn_, sg_, sc_, st_, sp_, sl_, su_, sa_, sv_ (NULL for L0)';

COMMENT ON COLUMN taxonomy_law.target_database IS
'Which database stores entities of this type (shopnet_sites, shopnet_crm, etc.)';

COMMENT ON COLUMN taxonomy_law.status IS
'Deployment status: live (deployed), designed (SQL ready), WIP (in progress), future (planned)';

-- ============================================================================
-- SAMPLE QUERIES
-- ============================================================================

-- Get all L1 UID types
-- SELECT * FROM taxonomy_law WHERE level = 'L1' AND active = TRUE;

-- Get all L2 subtypes for sn_
-- SELECT * FROM taxonomy_law WHERE level = 'L2' AND uid_type = 'sn_' AND active = TRUE;

-- Get complete hierarchy for sa_ (agents)
-- SELECT * FROM taxonomy_tree('sa_');

-- Get all live taxonomies
-- SELECT * FROM taxonomy_law_live;

-- Get taxonomy by code
-- SELECT * FROM taxonomy_law WHERE code = 'CL' AND uid_type = 'sn_';

-- Count by status
-- SELECT status, COUNT(*) FROM taxonomy_law GROUP BY status;

-- Count by UID type
-- SELECT uid_type, COUNT(*) FROM taxonomy_law WHERE uid_type IS NOT NULL GROUP BY uid_type ORDER BY uid_type;
