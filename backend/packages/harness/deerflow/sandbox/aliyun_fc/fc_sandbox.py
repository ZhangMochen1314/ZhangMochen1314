import os
import json
import base64
import logging
from typing import Optional, List, Tuple
from pathlib import Path

import fc2
import oss2

from deerflow.sandbox.sandbox import Sandbox
from deerflow.sandbox.search import GrepMatch

logger = logging.getLogger(__name__)

class AliyunFCSandbox(Sandbox):
    """Aliyun Function Compute based Sandbox implementation with OSS storage."""

    def __init__(self, id: str, fc_endpoint: str, fc_function_name: str, access_key_id: str, access_key_secret: str,
                 oss_endpoint: str, oss_bucket: str, oss_ak_id: str, oss_ak_secret: str):
        super().__init__(id)
        
        self.fc_endpoint = fc_endpoint
        self.fc_function_name = fc_function_name
        self.access_key_id = access_key_id
        self.access_key_secret = access_key_secret
        
        # Initialize FC client
        if self.fc_endpoint and self.access_key_id:
            self.fc_client = fc2.Client(
                endpoint=self.fc_endpoint,
                accessKeyID=self.access_key_id,
                accessKeySecret=self.access_key_secret
            )
        else:
            self.fc_client = None

        # Initialize OSS bucket
        self.oss_prefix = f"sandbox/{self.id}/"
        if oss_ak_id and oss_endpoint and oss_bucket:
            auth = oss2.Auth(oss_ak_id, oss_ak_secret)
            self.oss_bucket = oss2.Bucket(auth, oss_endpoint, oss_bucket)
        else:
            self.oss_bucket = None

    def _call_fc(self, command: str, command_type: str = "shell") -> dict:
        """Invoke FC function to execute code."""
        if not self.fc_client:
            raise RuntimeError("Aliyun FC client is not configured properly.")
            
        payload = {
            "command": command,
            "command_type": command_type,
            "session_id": self.id
        }
        
        try:
            result = self.fc_client.invoke_function(
                self.fc_function_name,
                self.fc_function_name,
                payload=json.dumps(payload).encode('utf-8')
            )
            
            data = result.data.decode('utf-8')
            try:
                response = json.loads(data)
                return response
            except json.JSONDecodeError:
                return {"stdout": data, "stderr": "", "exit_code": 0}
        except Exception as e:
            logger.error(f"FC invocation failed: {e}")
            return {"stdout": "", "stderr": str(e), "exit_code": -1}

    def _get_oss_key(self, path: str) -> str:
        """Convert a local container path to an OSS key."""
        # Remove leading slash to make it relative
        if path.startswith("/"):
            path = path[1:]
        return f"{self.oss_prefix}{path}"

    def execute_command(self, command: str) -> str:
        """Execute a shell command in the FC container."""
        logger.info(f"FC Sandbox [{self.id}] executing: {command}")
        response = self._call_fc(command, "shell")
        
        output = response.get("stdout", "")
        stderr = response.get("stderr", "")
        
        # Combine stdout and stderr if needed
        if stderr:
            output = output + "\n" + stderr if output else stderr
            
        return output.strip()

    def read_file(self, path: str) -> str:
        """Read a file from OSS."""
        if not self.oss_bucket:
            raise RuntimeError("OSS client is not configured properly.")
            
        key = self._get_oss_key(path)
        try:
            result = self.oss_bucket.get_object(key)
            return result.read().decode('utf-8')
        except oss2.exceptions.NoSuchKey:
            raise FileNotFoundError(f"No such file: {path}")
        except Exception as e:
            logger.error(f"Failed to read file {path} from OSS: {e}")
            raise RuntimeError(f"Failed to read file: {e}")

    def update_file(self, path: str, content: bytes) -> None:
        """Write binary content to OSS."""
        if not self.oss_bucket:
            raise RuntimeError("OSS client is not configured properly.")
            
        key = self._get_oss_key(path)
        try:
            self.oss_bucket.put_object(key, content)
        except Exception as e:
            logger.error(f"Failed to write binary file {path} to OSS: {e}")
            raise RuntimeError(f"Failed to write file: {e}")

    def write_file(self, path: str, content: str, append: bool = False) -> None:
        """Write text content to OSS."""
        if append:
            try:
                existing = self.read_file(path)
                content = existing + content
            except FileNotFoundError:
                pass
                
        self.update_file(path, content.encode('utf-8'))

    def list_dir(self, path: str, max_depth: int = 2) -> List[str]:
        """List files in an OSS directory."""
        if not self.oss_bucket:
            raise RuntimeError("OSS client is not configured properly.")
            
        key_prefix = self._get_oss_key(path)
        if not key_prefix.endswith('/'):
            key_prefix += '/'
            
        results = []
        try:
            for obj in oss2.ObjectIterator(self.oss_bucket, prefix=key_prefix):
                # Remove the base prefix to get relative paths
                rel_path = obj.key[len(key_prefix):]
                if rel_path:  # Ignore the directory itself
                    results.append(rel_path)
            return results
        except Exception as e:
            logger.error(f"Failed to list directory {path} in OSS: {e}")
            return []

    def glob(
        self, 
        path: str, 
        pattern: str, 
        *, 
        include_dirs: bool = False, 
        max_results: int = 200
    ) -> Tuple[List[str], bool]:
        """Glob search via FC command."""
        # For simplicity, execute 'find' in FC and return results
        cmd = f"cd /tmp/{self.id} && find {path} -name '{pattern}' | head -n {max_results + 1}"
        response = self._call_fc(cmd, "shell")
        stdout = response.get("stdout", "").strip()
        
        if not stdout:
            return [], False
            
        lines = stdout.split('\n')
        truncated = len(lines) > max_results
        return lines[:max_results], truncated

    def grep(
        self,
        path: str,
        pattern: str,
        *,
        glob: Optional[str] = None,
        literal: bool = False,
        case_sensitive: bool = False,
        max_results: int = 100,
    ) -> Tuple[List[GrepMatch], bool]:
        """Grep search via FC command."""
        # Build grep command
        flags = "-r"
        if literal:
            flags += " -F"
        else:
            flags += " -E"
        if not case_sensitive:
            flags += " -i"
            
        include_flag = f"--include='{glob}'" if glob else ""
        
        # We need line numbers and file names
        flags += " -n"
        
        # Escape pattern carefully
        escaped_pattern = pattern.replace("'", "'\\''")
        
        cmd = f"cd /tmp/{self.id} && grep {flags} {include_flag} '{escaped_pattern}' {path} | head -n {max_results + 1}"
        response = self._call_fc(cmd, "shell")
        stdout = response.get("stdout", "").strip()
        
        matches = []
        if not stdout:
            return matches, False
            
        lines = stdout.split('\n')
        truncated = len(lines) > max_results
        
        # Parse grep output format: filename:line_num:content
        for line in lines[:max_results]:
            parts = line.split(":", 2)
            if len(parts) >= 3:
                filename = parts[0]
                try:
                    line_num = int(parts[1])
                    content = parts[2]
                    matches.append(GrepMatch(path=filename, line=line_num, match=content))
                except ValueError:
                    pass
                    
        return matches, truncated
