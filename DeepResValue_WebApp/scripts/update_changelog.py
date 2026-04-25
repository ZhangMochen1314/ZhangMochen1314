#!/usr/bin/env python3
"""
Update Changelog Script

This script automatically inserts a new entry into CHANGELOG.md 
following the "Keep a Changelog" specification.

Usage:
  python update_changelog.py --version "v2.5.1" --type "Fixed" --message "Fix empty exception blocks"
  python update_changelog.py --version "Unreleased" --type "Added" --message "New feature X"
"""

import argparse
import datetime
import os
import re
import sys

def parse_args():
    parser = argparse.ArgumentParser(description="Update CHANGELOG.md")
    parser.add_argument("--file", default="CHANGELOG.md", help="Path to CHANGELOG.md")
    parser.add_argument("--version", required=True, help="Version (e.g., v1.0.0 or Unreleased)")
    parser.add_argument("--type", required=True, choices=["Added", "Changed", "Deprecated", "Removed", "Fixed", "Security"], help="Type of change")
    parser.add_argument("--message", required=True, help="Description of the change")
    return parser.parse_args()

def main():
    args = parse_args()
    
    if not os.path.exists(args.file):
        print(f"Error: File '{args.file}' not found.")
        sys.exit(1)
        
    with open(args.file, "r", encoding="utf-8") as f:
        lines = f.readlines()
        
    # Find the target version section
    version_pattern = re.compile(rf"^##\s+\[?{re.escape(args.version)}\]?(?:\s+-.*)?$")
    target_idx = -1
    for i, line in enumerate(lines):
        if version_pattern.match(line.strip()):
            target_idx = i
            break
            
    if target_idx == -1:
        # Version section not found, we need to create it
        # Insert after the main header and description, before the first "## [Version]"
        insert_idx = -1
        for i, line in enumerate(lines):
            if line.startswith("## "):
                insert_idx = i
                break
        
        if insert_idx == -1:
            insert_idx = len(lines)
            
        today = datetime.datetime.now().strftime("%Y-%m-%d")
        if args.version.lower() == "unreleased":
            header = "## [Unreleased]\n\n"
        else:
            header = f"## [{args.version}] - {today}\n\n"
            
        lines.insert(insert_idx, header)
        target_idx = insert_idx

    # Find the end of the target version section (next "## ")
    next_version_idx = len(lines)
    for i in range(target_idx + 1, len(lines)):
        if lines[i].startswith("## "):
            next_version_idx = i
            break
            
    version_section = lines[target_idx:next_version_idx]
    
    # Find the target type section (e.g., "### Fixed")
    type_pattern = re.compile(rf"^###\s+{re.escape(args.type)}$")
    type_idx = -1
    for i, line in enumerate(version_section):
        if type_pattern.match(line.strip()):
            type_idx = target_idx + i
            break
            
    if type_idx == -1:
        # Type section not found, create it after the version header
        # Usually insert after the version header and any blank lines
        insert_type_idx = target_idx + 1
        while insert_type_idx < next_version_idx and lines[insert_type_idx].strip() == "":
            insert_type_idx += 1
            
        lines.insert(insert_type_idx, f"### {args.type}\n")
        lines.insert(insert_type_idx + 1, f"- {args.message}\n")
        lines.insert(insert_type_idx + 2, "\n")
    else:
        # Type section found, insert the new message as the first item or last item
        # We will insert it right after the type header
        lines.insert(type_idx + 1, f"- {args.message}\n")

    with open(args.file, "w", encoding="utf-8") as f:
        f.writelines(lines)
        
    print(f"Successfully added '{args.type}' entry to version '{args.version}' in {args.file}")

if __name__ == "__main__":
    main()
