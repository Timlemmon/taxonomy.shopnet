#!/usr/bin/env python3
"""
Execute SQL to add U to shopnet_sites.taxonomy_definition.
Step A of Console GUI update.
"""
import psycopg2
from psycopg2.extras import RealDictCursor
import os
from pathlib import Path

DB_HOST = os.environ.get("DB_HOST", "shopnet-things.cenq4au2o7vl.us-east-1.rds.amazonaws.com")
DB_PORT = int(os.environ.get("DB_PORT", 5432))
DB_USER = os.environ.get("DB_USER", "postgres")
DB_PASSWORD = os.environ.get("DB_PASSWORD", "J09GsxbZqFsWEuCH1nWIDG48uY4FFghG")

def main():
    sql_file = Path(__file__).parent.parent.parent / "connect.shopnet" / "backend" / "sql" / "007_add_u_to_sites_taxonomy.sql"

    print(f"📄 Reading SQL: {sql_file}")
    with open(sql_file, 'r') as f:
        sql_content = f.read()

    print(f"\n🔗 Connecting to shopnet_sites database...")
    conn = psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        database="shopnet_sites",
        user=DB_USER,
        password=DB_PASSWORD,
        cursor_factory=RealDictCursor
    )

    cur = conn.cursor()
    print("✅ Connected")

    # BEFORE state
    print("\n📊 BEFORE - Current state:")
    cur.execute("SELECT COUNT(*) as count FROM taxonomy_definition WHERE level = 'endpoint_type'")
    before_endpoints = cur.fetchone()['count']
    print(f"  Endpoint types: {before_endpoints}")

    cur.execute("SELECT COUNT(*) as count FROM taxonomy_definition WHERE level = 'platform_type'")
    before_platforms = cur.fetchone()['count']
    print(f"  Platform types: {before_platforms}")

    # Check if U already exists
    cur.execute("SELECT COUNT(*) as count FROM taxonomy_definition WHERE code = 'U'")
    u_exists = cur.fetchone()['count']
    if u_exists > 0:
        print(f"\n⚠️  WARNING: U already exists ({u_exists} rows). Aborting to prevent duplicates.")
        conn.close()
        return 1

    # EXECUTE
    print("\n🔄 Executing SQL...")
    cur.execute(sql_content)
    conn.commit()
    print("✅ SQL executed successfully")

    # AFTER state
    print("\n📊 AFTER - Verifying changes:")
    cur.execute("SELECT COUNT(*) as count FROM taxonomy_definition WHERE level = 'endpoint_type'")
    after_endpoints = cur.fetchone()['count']
    print(f"  Endpoint types: {after_endpoints} (+{after_endpoints - before_endpoints})")

    cur.execute("SELECT COUNT(*) as count FROM taxonomy_definition WHERE level = 'platform_type'")
    after_platforms = cur.fetchone()['count']
    print(f"  Platform types: {after_platforms} (+{after_platforms - before_platforms})")

    # Verify U entries
    print("\n  U endpoint_type:")
    cur.execute("SELECT * FROM taxonomy_definition WHERE level = 'endpoint_type' AND code = 'U'")
    u_endpoint = cur.fetchone()
    if u_endpoint:
        print(f"    ✅ {u_endpoint['code']}: {u_endpoint['name']} - {u_endpoint['description']}")
    else:
        print(f"    ❌ U endpoint_type NOT found!")

    print("\n  U platform_types:")
    cur.execute("SELECT code, name FROM taxonomy_definition WHERE parent_code = 'U' ORDER BY code")
    u_platforms = cur.fetchall()
    for row in u_platforms:
        print(f"    ✅ {row['code']:10} - {row['name']}")

    if len(u_platforms) != 7:
        print(f"\n⚠️  WARNING: Expected 7 platform_types, found {len(u_platforms)}")

    cur.close()
    conn.close()

    print("\n✅ Step A Complete: shopnet_sites.taxonomy_definition updated")
    return 0

if __name__ == "__main__":
    exit(main())
