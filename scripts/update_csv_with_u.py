#!/usr/bin/env python3
"""
Update complete-taxonomy CSV to replace DEV with U (User Device).
Date: February 9, 2026
"""
import csv
from pathlib import Path

def main():
    csv_file = Path(__file__).parent.parent / "complete-taxonomy-v5.1-WIP.csv"

    print(f"📄 Reading CSV: {csv_file}")

    # Read all rows
    with open(csv_file, 'r') as f:
        reader = csv.DictReader(f)
        rows = list(reader)
        fieldnames = reader.fieldnames

    print(f"  Before: {len(rows)} data rows")

    # Remove DEV-related rows
    original_count = len(rows)
    rows = [r for r in rows if not (
        (r['uid_type'] == 'sn_' and r['parent_code'] == 'I' and r['code'] == 'DEV') or
        (r['uid_type'] == 'sn_' and r['parent_code'] == 'I' and r['code'] in ('device_type', 'os_family'))
    )]
    removed_count = original_count - len(rows)
    print(f"  Removed {removed_count} DEV-related rows")

    # Update Infrastructure description
    for row in rows:
        if row['uid_type'] == 'sn_' and row['code'] == 'I' and row['parent_code'] == 'sn_':
            row['description'] = 'Infrastructure components'
            row['notes'] = '10 platform types'
            print(f"  Updated Infrastructure description")
            break

    # Add U (User Device) entries
    u_entries = []

    # L2: U endpoint_type
    u_entries.append({
        'level': 'L2',
        'uid_type': 'sn_',
        'parent_code': 'sn_',
        'code': 'U',
        'name': 'User Device',
        'description': 'End-user client devices (phones, tablets, laptops, desktops, watches, TVs)',
        'examples': 'iPhone, Android phone, MacBook, Windows PC',
        'target_database': 'shopnet_sites',
        'status': 'WIP',
        'active': 'TRUE',
        'notes': 'Added Feb 9, 2026 - Moved from Infrastructure. Pulse method: none (pending client app)'
    })

    # L2: Platform types (operating systems)
    platform_types = [
        ('iOS', 'Apple iOS', 'Apple iOS ecosystem', 'iPhone, iPad', 'iOS devices require Apple Developer account'),
        ('Android', 'Google Android', 'Android ecosystem', 'Samsung Galaxy, Google Pixel', 'Android devices use Google Play Services'),
        ('Windows', 'Microsoft Windows', 'Windows OS', 'Surface, Dell PC', 'Windows 10/11 desktop and tablet devices'),
        ('macOS', 'Apple macOS', 'Apple desktop/laptop OS', 'MacBook, iMac', 'macOS devices (Ventura, Sonoma, etc.)'),
        ('Linux', 'Linux', 'Linux distributions', 'Ubuntu laptop, Debian desktop', 'Various Linux distributions'),
        ('ChromeOS', 'Chrome OS', 'Google Chrome OS', 'Chromebook', 'Chrome OS laptops and tablets'),
        ('Other', 'Other OS', 'Other operating systems', 'Custom OS', 'Other or custom operating systems'),
    ]

    for code, name, desc, examples, notes in platform_types:
        u_entries.append({
            'level': 'L2',
            'uid_type': 'sn_',
            'parent_code': 'U',
            'code': code,
            'name': name,
            'description': desc,
            'examples': examples,
            'target_database': 'shopnet_sites',
            'status': 'WIP',
            'active': 'TRUE',
            'notes': notes
        })

    # L3: Form factors
    form_factors = [
        ('iOS', 'phone', 'Smartphone', 'Mobile phone device', 'iPhone 15, iPhone SE'),
        ('iOS', 'tablet', 'Tablet', 'Tablet device', 'iPad Pro, iPad Air'),
        ('iOS', 'watch', 'Smartwatch', 'Wearable watch device', 'Apple Watch Series 9'),
        ('iOS', 'tv', 'Smart TV', 'Television/streaming device', 'Apple TV 4K'),
        ('Android', 'phone', 'Smartphone', 'Mobile phone device', 'Samsung Galaxy S24, Pixel 8'),
        ('Android', 'tablet', 'Tablet', 'Tablet device', 'Samsung Tab S9, Pixel Tablet'),
        ('Android', 'watch', 'Smartwatch', 'Wearable watch device', 'Samsung Galaxy Watch, Wear OS watch'),
        ('Android', 'tv', 'Smart TV', 'Television/streaming device', 'Android TV, Google TV'),
        ('Windows', 'laptop', 'Laptop', 'Portable computer', 'Surface Laptop, Dell XPS'),
        ('Windows', 'desktop', 'Desktop', 'Desktop computer', 'Dell Desktop, HP Desktop'),
        ('Windows', 'tablet', 'Tablet', 'Tablet device', 'Surface Pro'),
        ('macOS', 'laptop', 'Laptop', 'Portable computer', 'MacBook Pro, MacBook Air'),
        ('macOS', 'desktop', 'Desktop', 'Desktop computer', 'iMac, Mac Studio, Mac Pro'),
        ('Linux', 'laptop', 'Laptop', 'Portable computer', 'Ubuntu laptop, System76'),
        ('Linux', 'desktop', 'Desktop', 'Desktop computer', 'Debian desktop, Fedora workstation'),
        ('ChromeOS', 'laptop', 'Laptop', 'Portable computer', 'Chromebook'),
        ('Other', 'other', 'Other', 'Other form factor', 'Custom device'),
    ]

    for parent, code, name, desc, examples in form_factors:
        u_entries.append({
            'level': 'L3',
            'uid_type': 'sn_',
            'parent_code': parent,
            'code': code,
            'name': name,
            'description': desc,
            'examples': examples,
            'target_database': 'shopnet_sites',
            'status': 'WIP',
            'active': 'TRUE',
            'notes': ''
        })

    print(f"  Adding {len(u_entries)} U entries (1 endpoint + 7 platforms + 17 form factors)")

    # Add U entries after Infrastructure section
    # Find where to insert (after last Infrastructure entry)
    insert_idx = 0
    for i, row in enumerate(rows):
        if row['uid_type'] == 'sn_' and (row['parent_code'] == 'I' or row['code'] == 'I'):
            insert_idx = i + 1

    # Insert U entries
    for entry in reversed(u_entries):
        rows.insert(insert_idx, entry)

    print(f"  After: {len(rows)} data rows")
    print(f"  Net change: {len(rows) - original_count:+d} rows")

    # Write updated CSV
    print(f"\n💾 Writing updated CSV...")
    with open(csv_file, 'w', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    print(f"✅ CSV updated successfully!")

    # Verify U entries
    u_count = sum(1 for r in rows if r['uid_type'] == 'sn_' and (r['code'] == 'U' or r['parent_code'] == 'U' or r['parent_code'] in ('iOS', 'Android', 'Windows', 'macOS', 'Linux', 'ChromeOS', 'Other')))
    print(f"\n📊 Verification:")
    print(f"  Total U entries in CSV: {u_count}")

    # Count by level
    u_l2 = sum(1 for r in rows if r['level'] == 'L2' and r['uid_type'] == 'sn_' and (r['code'] == 'U' or r['parent_code'] == 'U'))
    u_l3 = sum(1 for r in rows if r['level'] == 'L3' and r['uid_type'] == 'sn_' and r['parent_code'] in ('iOS', 'Android', 'Windows', 'macOS', 'Linux', 'ChromeOS', 'Other'))
    print(f"  L2 (endpoint_type + platforms): {u_l2}")
    print(f"  L3 (form factors): {u_l3}")

if __name__ == "__main__":
    main()
