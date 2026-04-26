import re
import sys

def fix_file(path):
    with open(path, 'r') as f:
        content = f.read()
    
    # Fix requires-python
    content = re.sub(r'requires-python\s*=\s*"==', 'requires-python = ">=', content)
    
    with open(path, 'w') as f:
        f.write(content)
    print(f"Fixed {path}")

fix_file('/workspace/DeepResValue_WebApp/deer-flow/backend/pyproject.toml')
fix_file('/workspace/DeepResValue_WebApp/deer-flow/backend/packages/harness/pyproject.toml')
fix_file('/workspace/DeepResValue_WebApp/deer-flow/StatsPAI/pyproject.toml')
