with open('/workspace/deer-flow/frontend/index.html', 'r') as f:
    content = f.read()

fonts = [
    'family=Poppins:wght@300;400;500;600;700;800;900',
    'family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400',
    'family=Space+Grotesk:wght@300;400;500;600;700',
    'family=Inter:wght@300;400;500;600',
    'family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400',
    'family=Montserrat:wght@300;400;500;600;700;800;900',
    'family=Cinzel:wght@400;500;600;700;800;900',
    'family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400'
]

font_url = "https://fonts.googleapis.com/css2?" + "&".join(fonts) + "&display=swap"

link_tag = f'    <link href="{font_url}" rel="stylesheet">\n  </head>'
if 'fonts.googleapis.com' not in content:
    content = content.replace('  </head>', link_tag)
else:
    # replace existing google fonts link
    import re
    content = re.sub(r'<link href="https://fonts.googleapis.com[^>]+>', f'<link href="{font_url}" rel="stylesheet">', content)

with open('/workspace/deer-flow/frontend/index.html', 'w') as f:
    f.write(content)
