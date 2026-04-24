import os
import re
from typing import Optional, List, Tuple
from e2b_code_interpreter import Sandbox as E2BCoreSandbox

from deerflow.sandbox.sandbox import Sandbox, GrepMatch

class E2BSandbox(Sandbox):
    """
    Adapter for E2B Cloud Sandbox.
    Executes commands and file operations remotely in E2B's secure micro-VM.
    """
    def __init__(self, e2b_sandbox: E2BCoreSandbox, root_dir: str = "/home/user"):
        super().__init__(root_dir=root_dir)
        self.sandbox = e2b_sandbox

    def execute_command(self, command: str) -> str:
        # Check if the command looks like python code to use E2B's notebook execution
        # Otherwise execute as bash command
        if command.strip().startswith("import ") or "print(" in command or "pd." in command:
            try:
                execution = self.sandbox.run_code(command)
                output = ""
                if execution.text:
                    output += execution.text
                if execution.error:
                    output += f"\nError: {execution.error.name}: {execution.error.value}\n{execution.error.traceback}"
                return output
            except Exception as e:
                return f"Error executing python code: {str(e)}"
        else:
            try:
                result = self.sandbox.commands.run(command, cwd=self.root_dir)
                output = result.stdout
                if result.stderr:
                    output += "\n" + result.stderr
                return output
            except Exception as e:
                return f"Error executing command: {str(e)}"

    def read_file(self, path: str) -> str:
        try:
            return self.sandbox.files.read(path)
        except Exception as e:
            raise FileNotFoundError(f"Failed to read file {path} in E2B sandbox: {e}")

    def write_file(self, path: str, content: str, append: bool = False) -> None:
        try:
            if append:
                # E2B doesn't have a direct append, so we read, concat and write
                try:
                    existing = self.sandbox.files.read(path)
                    content = existing + content
                except Exception:
                    pass # File might not exist
            self.sandbox.files.write(path, content)
        except Exception as e:
            raise IOError(f"Failed to write file {path} in E2B sandbox: {e}")

    def update_file(self, path: str, content: bytes) -> None:
        try:
            # E2B SDK usually expects string or byte-like objects
            self.sandbox.files.write(path, content)
        except Exception as e:
            raise IOError(f"Failed to update file {path} in E2B sandbox: {e}")

    def list_dir(self, path: str, max_depth=2) -> list[str]:
        # Using shell command to find files since SDK list might not support recursive depth natively
        cmd = f"find {path} -maxdepth {max_depth} -type f -o -type d"
        result = self.execute_command(cmd)
        files = [f.strip() for f in result.split('\n') if f.strip() and f.strip() != path]
        return files

    def glob(self, path: str, pattern: str, *, include_dirs: bool = False, max_results: int = 200) -> tuple[list[str], bool]:
        type_flag = "" if include_dirs else "-type f"
        cmd = f"find {path} {type_flag} -name '{pattern}' | head -n {max_results + 1}"
        result = self.execute_command(cmd)
        files = [f.strip() for f in result.split('\n') if f.strip()]
        
        is_truncated = len(files) > max_results
        if is_truncated:
            files = files[:max_results]
            
        return files, is_truncated

    def grep(self, path: str, pattern: str, *, glob: str | None = None, literal: bool = False, case_sensitive: bool = False, max_results: int = 100) -> tuple[list[GrepMatch], bool]:
        flags = "-n "
        if not case_sensitive:
            flags += "-i "
        if literal:
            flags += "-F "
        else:
            flags += "-E "
            
        glob_cmd = f"--include='{glob}'" if glob else ""
        
        cmd = f"grep -r {flags} {glob_cmd} '{pattern}' {path} | head -n {max_results + 1}"
        result = self.execute_command(cmd)
        
        matches = []
        lines = result.split('\n')
        is_truncated = len(lines) > max_results
        
        for line in lines[:max_results]:
            if not line.strip(): continue
            parts = line.split(':', 2)
            if len(parts) >= 3:
                file_path = parts[0]
                try:
                    line_number = int(parts[1])
                    content = parts[2]
                    matches.append(GrepMatch(path=file_path, line=line_number, content=content))
                except ValueError:
                    pass
                    
        return matches, is_truncated
