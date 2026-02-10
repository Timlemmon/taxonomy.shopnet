#!/usr/bin/env python3
"""
Update console.js to add U (User Device) endpoint type.
Makes surgical edits to 5 specific locations.
"""
import re
from pathlib import Path

def main():
    console_file = Path("/Users/tim001/VSCode/HMCG/taxonomy.shopnet/temp-console.js")

    print(f"📄 Reading: {console_file}")
    with open(console_file, 'r') as f:
        content = f.read()

    original_content = content
    changes_made = []

    # CHANGE 1: Add U to PLATFORM_OPTIONS (around line 3546)
    print("\n🔧 Change 1: Adding U to PLATFORM_OPTIONS...")

    # Find the 'O' section and add 'U' before it
    u_platform_options = """    'U': [
        { value: 'iOS', label: 'Apple iOS (iOS)', desc: 'Apple iOS ecosystem (iPhone, iPad)' },
        { value: 'Android', label: 'Google Android (Android)', desc: 'Android ecosystem (Samsung, Pixel)' },
        { value: 'Windows', label: 'Microsoft Windows (Windows)', desc: 'Windows OS (Surface, Dell PC)' },
        { value: 'macOS', label: 'Apple macOS (macOS)', desc: 'Apple desktop/laptop OS (MacBook, iMac)' },
        { value: 'Linux', label: 'Linux (Linux)', desc: 'Linux distributions (Ubuntu, Debian)' },
        { value: 'ChromeOS', label: 'Chrome OS (ChromeOS)', desc: 'Google Chrome OS (Chromebook)' },
        { value: 'Other', label: 'Other OS (Other)', desc: 'Other operating systems' },
    ],
    'O': ["""

    if "'O': [" in content:
        content = content.replace("    'O': [", u_platform_options)
        changes_made.append("✅ Added U to PLATFORM_OPTIONS")
    else:
        print("  ⚠️  Could not find 'O': [ to insert U before")

    # CHANGE 2: Add U to endpoint labels (line ~3052)
    print("🔧 Change 2: Adding U to endpoint labels (first location)...")
    old_labels_1 = "{ 'W': 'Websites', 'A': 'Agents', 'D': 'Databases', 'N': 'Nodes', 'I': 'Infrastructure', 'O': 'Other' }"
    new_labels_1 = "{ 'W': 'Websites', 'A': 'Agents', 'D': 'Databases', 'N': 'Nodes', 'I': 'Infrastructure', 'U': 'User Devices', 'O': 'Other' }"

    if old_labels_1 in content:
        content = content.replace(old_labels_1, new_labels_1)
        changes_made.append("✅ Updated endpoint labels (location 1)")
    else:
        print("  ⚠️  Could not find exact match for labels location 1")

    # CHANGE 3: Add U to endpoint_type object (line ~3623)
    print("🔧 Change 3: Adding U to endpoint_type object...")
    old_endpoint_type = "'endpoint_type': { 'W': 'Website', 'A': 'Agent', 'D': 'Database', 'N': 'Node', 'I': 'Infrastructure', 'O': 'Other' }"
    new_endpoint_type = "'endpoint_type': { 'W': 'Website', 'A': 'Agent', 'D': 'Database', 'N': 'Node', 'I': 'Infrastructure', 'U': 'User Device', 'O': 'Other' }"

    if old_endpoint_type in content:
        content = content.replace(old_endpoint_type, new_endpoint_type)
        changes_made.append("✅ Updated endpoint_type object")
    else:
        print("  ⚠️  Could not find exact match for endpoint_type object")

    # CHANGE 4 & 5: Add U to color mappings (lines ~5026, 5070)
    print("🔧 Change 4 & 5: Adding U to color mappings...")
    old_colors = "{ 'W': '#3b82f6', 'A': '#8b5cf6', 'D': '#22c55e', 'N': '#f59e0b', 'I': '#06b6d4', 'O': '#6b7280' }"
    new_colors = "{ 'W': '#3b82f6', 'A': '#8b5cf6', 'D': '#22c55e', 'N': '#f59e0b', 'I': '#06b6d4', 'U': '#ec4899', 'O': '#6b7280' }"

    count = content.count(old_colors)
    content = content.replace(old_colors, new_colors)
    if count > 0:
        changes_made.append(f"✅ Updated color mappings ({count} locations)")
    else:
        print("  ⚠️  Could not find color mapping pattern")

    # Show summary
    print(f"\n📊 Changes Made:")
    for change in changes_made:
        print(f"  {change}")

    if len(changes_made) < 4:
        print(f"\n⚠️  WARNING: Expected 4+ changes, only made {len(changes_made)}")
        print("  Review carefully before uploading!")

    # Calculate diff size
    size_before = len(original_content)
    size_after = len(content)
    print(f"\n📏 File size: {size_before} → {size_after} bytes ({size_after - size_before:+d})")

    # Save modified file
    output_file = Path("/Users/tim001/VSCode/HMCG/taxonomy.shopnet/temp-console-modified.js")
    with open(output_file, 'w') as f:
        f.write(content)

    print(f"\n💾 Saved modified version to: {output_file}")
    print(f"\n✅ Ready to upload to server")

    return 0

if __name__ == "__main__":
    exit(main())
