import os
import glob
import re

directories = [
    '/workspace/DeepResValue_WebApp/deer-flow/frontend/src/**/*.tsx',
]

replacements = {
    '#faf9f5': 'var(--theme-light)',
    '#141413': 'var(--theme-dark)',
    '#e8e6dc': 'var(--theme-border)',
    '#b0aea5': 'var(--theme-muted)',
    '#d97757': 'var(--theme-accent1)',
    '#6a9bcc': 'var(--theme-accent2)',
    '#788c5d': 'var(--theme-accent3)',
    '#1a1a19': 'var(--theme-dark-hover)',
    '#2a2a29': 'var(--theme-card-dark)',
    '#c4684a': 'var(--theme-accent1-hover)',
    '#5885b5': 'var(--theme-accent2-hover)',
    "font-['Poppins']": 'font-heading',
    "font-['Lora']": 'font-body',
    'fontFamily: "\'Poppins\', Arial, sans-serif"': 'fontFamily: "var(--font-heading)"',
    "fontFamily: \"'Lora', Georgia, serif\"": 'fontFamily: "var(--font-body)"',
    "fontFamily: \"'Poppins', sans-serif\"": 'fontFamily: "var(--font-heading)"',
    "fontFamily: \"'Lora', serif\"": 'fontFamily: "var(--font-body)"',
    "style={{ fontFamily: \"'Poppins', Arial, sans-serif\" }}": "className=\"font-heading\"",
    "style={{ fontFamily: \"'Lora', Georgia, serif\" }}": "className=\"font-body\"",
    "style={{ fontFamily: '\\'Poppins\\', Arial, sans-serif' }}": "className=\"font-heading\"",
    "style={{ fontFamily: '\\'Lora\\', Georgia, serif' }}": "className=\"font-body\"",
}

files = glob.glob('/workspace/DeepResValue_WebApp/deer-flow/frontend/src/**/*.tsx', recursive=True)

for file_path in files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    new_content = content
    for old, new in replacements.items():
        new_content = new_content.replace(old, new)
        
    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {file_path}")

