import re

with open('/workspace/deer-flow/frontend/src/pages/Landing.tsx', 'r') as f:
    content = f.read()

# Remove the THEMES definition and type
content = re.sub(r"type ThemeKey = .*?};\n", "", content, flags=re.DOTALL)

# Add the import
content = content.replace("import { motion } from 'framer-motion';", "import { motion } from 'framer-motion';\nimport { THEMES, ThemeKey } from '@/config/themes';")

with open('/workspace/deer-flow/frontend/src/pages/Landing.tsx', 'w') as f:
    f.write(content)
