import os
import glob
import re

router_files = glob.glob("/workspace/deer-flow/backend/app/gateway/routers/*.py")

for file_path in router_files:
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    if "dependencies=[Depends(get_current_user)]" in content:
        continue
    
    if "router = APIRouter(" not in content:
        continue
        
    print(f"Patching {file_path}")
    
    # 1. Add Depends to fastapi import if not there
    if "Depends" not in content and "from fastapi import " in content:
        content = re.sub(r"(from fastapi import [^\n]+)", r"\1, Depends", content, count=1)
    elif "Depends" not in content:
        content = "from fastapi import Depends\n" + content
        
    # 2. Add get_current_user to app.gateway.deps import
    if "get_current_user" not in content:
        if "from app.gateway.deps import " in content:
            content = re.sub(r"(from app.gateway.deps import [^\n]+)", r"\1, get_current_user", content, count=1)
        else:
            # Need to insert the import
            content = re.sub(r"(from fastapi[^\n]+\n)", r"\1from app.gateway.deps import get_current_user\n", content, count=1)
            
    # 3. Patch APIRouter
    content = re.sub(
        r'router = APIRouter\((prefix="[^"]+",\s*tags=\[[^\]]+\])\)',
        r'router = APIRouter(\1, dependencies=[Depends(get_current_user)])',
        content
    )
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)
