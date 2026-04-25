import re
import sys

file_path = "/workspace/DeepResValue_WebApp/deer-flow/skills/public/skill-creator/eval-viewer/generate_review.py"
with open(file_path, "r") as f:
    content = f.read()

# Add import logging if not present
if "import logging" not in content:
    content = content.replace("import sys\n", "import sys\nimport logging\nlogging.basicConfig(level=logging.INFO)\n")

# Replace except ...:\n    pass
# Note: we need to match the indentation
def replacer(match):
    indent = match.group(1)
    except_line = match.group(2)
    # If the except line doesn't capture the exception, capture it
    if " as " not in except_line:
        except_line = except_line.replace(":", " as e:")
    
    return f"{indent}{except_line}\n{indent}    logging.debug('Ignored error: %s', getattr(e, 'message', str(e)))"

content = re.sub(r"^([ \t]+)(except [^:]+:)\n\s+pass\b", replacer, content, flags=re.MULTILINE)

with open(file_path, "w") as f:
    f.write(content)

print("Done")
