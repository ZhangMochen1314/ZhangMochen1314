# Aliyun FC Sandbox Integration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement an `AliyunFCSandboxProvider` and `AliyunFCSandbox` to replace the local Docker sandbox. This allows Python code execution and file manipulation to be securely offloaded to Aliyun Function Compute (FC) serverless containers.

**Architecture:** 
The solution has two parts:
1. **Cloud Function (FC)**: A lightweight HTTP server running in Aliyun FC, mounting an Aliyun NAS for persistent storage. It provides API endpoints to execute bash commands, read files, and write files.
2. **DeerFlow Backend**: An `AliyunFCSandboxProvider` that manages sandbox allocation, and an `AliyunFCSandbox` adapter that implements the `Sandbox` interface by making HTTP requests to the FC endpoint.

**Tech Stack:** Python, FastAPI/Flask (for FC), Aliyun FC SDK / `requests`, Aliyun NAS.

---

### Task 1: Create the Aliyun FC Executor App

**Files:**
- Create: `backend/packages/harness/deerflow/sandbox/aliyun_fc/executor/app.py`
- Create: `backend/packages/harness/deerflow/sandbox/aliyun_fc/executor/requirements.txt`

- [ ] **Step 1: Write the FC executor requirements**
```text
fastapi==0.109.2
uvicorn==0.27.1
pydantic==2.6.1
```

- [ ] **Step 2: Write the FC HTTP server implementation**
This app will be deployed to Aliyun FC. It acts as a bridge to execute bash commands and manipulate files on the NAS mount.

```python
import os
import subprocess
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

# In Aliyun FC, NAS is typically mounted to /mnt/auto
MOUNT_DIR = os.getenv("NAS_MOUNT_DIR", "/mnt/auto")

class CommandRequest(BaseModel):
    command: str

class FileReadRequest(BaseModel):
    path: str

class FileWriteRequest(BaseModel):
    path: str
    content: str
    append: bool = False

@app.post("/exec_command")
def exec_command(req: CommandRequest):
    try:
        # We run the command with bash. The client is responsible for CD'ing into the right dir
        result = subprocess.run(
            req.command, 
            shell=True, 
            capture_output=True, 
            text=True,
            timeout=300
        )
        output = result.stdout
        if result.stderr:
            output += f"\\n[stderr]:\\n{result.stderr}"
        return {"output": output, "exit_code": result.returncode}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/read_file")
def read_file(req: FileReadRequest):
    try:
        with open(req.path, "r", encoding="utf-8") as f:
            return {"content": f.read()}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/write_file")
def write_file(req: FileWriteRequest):
    try:
        mode = "a" if req.append else "w"
        os.makedirs(os.path.dirname(req.path), exist_ok=True)
        with open(req.path, mode, encoding="utf-8") as f:
            f.write(req.content)
        return {"success": True}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

### Task 2: Implement AliyunFCSandbox Adapter

**Files:**
- Create: `backend/packages/harness/deerflow/sandbox/aliyun_fc/aliyun_fc_sandbox.py`

- [ ] **Step 1: Write the Sandbox implementation**
This class translates DeerFlow's `Sandbox` interface into HTTP calls to the FC executor.

```python
import os
import requests
from typing import Optional
from deerflow.sandbox.sandbox import Sandbox

class AliyunFCSandbox(Sandbox):
    def __init__(self, id: str, tenant_id: str, endpoint: str, auth_token: Optional[str] = None):
        super().__init__(id)
        self.tenant_id = tenant_id
        self.endpoint = endpoint.rstrip("/")
        self.auth_token = auth_token
        # Map tenant_id to a specific NAS path
        self.nas_mount = os.getenv("ALIYUN_FC_NAS_MOUNT", "/mnt/auto")
        self.workdir = f"{self.nas_mount}/tenant_{tenant_id}/workspace"
        
    def _get_headers(self):
        headers = {}
        if self.auth_token:
            headers["Authorization"] = f"Bearer {self.auth_token}"
        return headers

    def execute_command(self, command: str) -> str:
        # Wrap command to execute inside the tenant's isolated workspace
        wrapped_command = f"mkdir -p {self.workdir} && cd {self.workdir} && {command}"
        try:
            resp = requests.post(
                f"{self.endpoint}/exec_command",
                json={"command": wrapped_command},
                headers=self._get_headers(),
                timeout=310
            )
            resp.raise_for_status()
            return resp.json().get("output", "")
        except Exception as e:
            return f"Error executing command in FC: {str(e)}"

    def read_file(self, path: str) -> str:
        # Ensure path is absolute and within workdir
        abs_path = path if path.startswith("/") else f"{self.workdir}/{path}"
        try:
            resp = requests.post(
                f"{self.endpoint}/read_file",
                json={"path": abs_path},
                headers=self._get_headers(),
                timeout=30
            )
            resp.raise_for_status()
            return resp.json().get("content", "")
        except Exception as e:
            return f"Error reading file from FC: {str(e)}"

    def write_file(self, path: str, content: str, append: bool = False) -> None:
        abs_path = path if path.startswith("/") else f"{self.workdir}/{path}"
        try:
            resp = requests.post(
                f"{self.endpoint}/write_file",
                json={"path": abs_path, "content": content, "append": append},
                headers=self._get_headers(),
                timeout=30
            )
            resp.raise_for_status()
        except Exception as e:
            print(f"Error writing file to FC: {str(e)}")
            
    # Other methods like list_dir, grep, etc. can be implemented by calling execute_command
    # e.g. ls -la {path} or grep -rn {pattern} {path}
```

### Task 3: Implement AliyunFCSandboxProvider

**Files:**
- Create: `backend/packages/harness/deerflow/sandbox/aliyun_fc/aliyun_fc_provider.py`
- Modify: `backend/packages/harness/deerflow/sandbox/__init__.py`

- [ ] **Step 1: Write the Provider implementation**

```python
import os
from typing import Optional
from deerflow.sandbox.sandbox_provider import SandboxProvider
from deerflow.sandbox.sandbox import Sandbox
from .aliyun_fc_sandbox import AliyunFCSandbox

class AliyunFCSandboxProvider(SandboxProvider):
    uses_thread_data_mounts: bool = False
    
    def __init__(self):
        self._sandboxes = {}
        self.endpoint = os.getenv("ALIYUN_FC_ENDPOINT")
        self.auth_token = os.getenv("ALIYUN_FC_AUTH_TOKEN")
        
        if not self.endpoint:
            print("WARNING: ALIYUN_FC_ENDPOINT is not set. Sandbox calls will fail.")

    def _extract_tenant_id(self, thread_id: str | None) -> str:
        if not thread_id:
            return "default"
        if thread_id.startswith("tenant_"):
            parts = thread_id.split("-", 1)
            if len(parts) > 1:
                return parts[0].replace("tenant_", "")
        return "default"

    def acquire(self, thread_id: str | None = None) -> str:
        tenant_id = self._extract_tenant_id(thread_id)
        sandbox_id = f"fc-sandbox-{tenant_id}"
        
        if sandbox_id not in self._sandboxes:
            self._sandboxes[sandbox_id] = AliyunFCSandbox(
                id=sandbox_id,
                tenant_id=tenant_id,
                endpoint=self.endpoint,
                auth_token=self.auth_token
            )
            
        return sandbox_id

    def get(self, sandbox_id: str) -> Optional[Sandbox]:
        return self._sandboxes.get(sandbox_id)

    def release(self, sandbox_id: str) -> None:
        if sandbox_id in self._sandboxes:
            # We don't necessarily delete the files on release if we want to keep state,
            # or we could send a cleanup command via FC if required.
            self._sandboxes.pop(sandbox_id)
```

- [ ] **Step 2: Register in __init__.py**
Update `backend/packages/harness/deerflow/sandbox/__init__.py` to export the new provider if necessary, or just rely on dynamic loading via `config.yaml`.
