import re

with open('/workspace/deer-flow/frontend/src/pages/Landing.tsx', 'r') as f:
    content = f.read()

# Replace hardcoded tailwind classes with dynamic ones
# We will just write a new file instead of regex replacing, it's safer.
