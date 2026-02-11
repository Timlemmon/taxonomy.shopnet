#!/usr/bin/env python3
"""
READ-ONLY: Check shopnet_sites.taxonomy_definition for U entries.
"""
import psycopg2
from psycopg2.extras import RealDictCursor
import os

DB_HOST = os.environ.get("DB_HOST", "shopnet-things.cenq4au2o7vl.us-east-1.rds.amazonaws.com")
DB_PORT = int(os.environ.get("DB_PORT", 5432))
DB_USER = os.environ.get("DB_USER", "postgres")
DB_PASSWORD = os.environ.get("DB_PASSWORD", "J09GsxbZqFsWEuCH1nWIDG48uY4FFghG")

def main():
    print("📊 READ-ONLY: Checking shopnet_sites.taxonomy_definition")

    conn = psycopg2.connect(
        host=DB_HOST,
        port=DB_PORT,
        database="shopnet_sites",
        user=DB_USER,
        password=DB_PASSWORD,
        cursor_factory=RealDictCursor
    )

    cur = conn.cursor()

    # Check for U endpoint_type
    print("\n1. Checking for U endpoint_type:")
    cur.execute("""
        SELECT * FROM taxonomy_definition
        WHERE level = 'endpoint_type' AND code = 'U'
    """)
    u_endpoint = cur.fetchall()
    if u_endpoint:
        print(f"   ✅ Found U endpoint_type: {len(u_endpoint)} rows")
        for row in u_endpoint:
            print(f"      {dict(row)}")
    else:
        print("   ❌ U endpoint_type NOT found in taxonomy_definition")

    # Check for U platform_types
    print("\n2. Checking for U platform_types:")
    cur.execute("""
        SELECT * FROM taxonomy_definition
        WHERE parent_code = 'U'
        ORDER BY code
    """)
    u_platforms = cur.fetchall()
    if u_platforms:
        print(f"   ✅ Found {len(u_platforms)} platform_types under U:")
        for row in u_platforms:
            print(f"      {row['code']:10} - {row['name']}")
    else:
        print("   ❌ NO platform_types found under U")

    # Check all endpoint_types
    print("\n3. All endpoint_types in taxonomy_definition:")
    cur.execute("""
        SELECT code, name, active FROM taxonomy_definition
        WHERE level = 'endpoint_type'
        ORDER BY code
    """)
    all_endpoints = cur.fetchall()
    for row in all_endpoints:
        status = "✅" if row['active'] else "❌"
        print(f"   {status} {row['code']} - {row['name']}")

    # Count platform_types by endpoint_type
    print("\n4. Platform type counts by endpoint_type:")
    cur.execute("""
        SELECT parent_code, COUNT(*) as count
        FROM taxonomy_definition
        WHERE level = 'platform_type'
        GROUP BY parent_code
        ORDER BY parent_code
    """)
    counts = cur.fetchall()
    for row in counts:
        print(f"   {row['parent_code']}: {row['count']} platform_types")

    cur.close()
    conn.close()

    print("\n✅ READ-ONLY check complete. No changes made.")

if __name__ == "__main__":
    main()
