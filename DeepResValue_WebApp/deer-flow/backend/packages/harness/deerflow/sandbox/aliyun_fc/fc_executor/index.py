import os
import json
import subprocess
import traceback
import oss2
import tempfile
import time

def get_oss_bucket():
    access_key_id = os.environ.get('OSS_ACCESS_KEY_ID')
    access_key_secret = os.environ.get('OSS_ACCESS_KEY_SECRET')
    endpoint = os.environ.get('OSS_ENDPOINT')
    bucket_name = os.environ.get('OSS_BUCKET_NAME')
    
    if not all([access_key_id, access_key_secret, endpoint, bucket_name]):
        raise ValueError("Missing OSS configuration in environment variables.")
        
    auth = oss2.Auth(access_key_id, access_key_secret)
    return oss2.Bucket(auth, endpoint, bucket_name)

def sync_from_oss(bucket, prefix, local_dir):
    """
    Download all files from OSS prefix to local_dir
    """
    for obj in oss2.ObjectIterator(bucket, prefix=prefix):
        if obj.key.endswith('/'):
            continue
        # Remove prefix to get relative path
        rel_path = obj.key[len(prefix):].lstrip('/')
        local_path = os.path.join(local_dir, rel_path)
        
        # Create directories if they don't exist
        os.makedirs(os.path.dirname(local_path), exist_ok=True)
        
        # Download file
        bucket.get_object_to_file(obj.key, local_path)

def sync_to_oss(bucket, prefix, local_dir, initial_state=None):
    """
    Upload changed/new files from local_dir to OSS prefix.
    If initial_state is provided, we can optimize by only uploading modified files.
    Here we simply upload all files or check modified time.
    """
    for root, dirs, files in os.walk(local_dir):
        for file in files:
            local_path = os.path.join(root, file)
            rel_path = os.path.relpath(local_path, local_dir)
            oss_key = f"{prefix.rstrip('/')}/{rel_path}"
            
            # Simple approach: upload all files
            # In a production environment, we should compare file hashes or mtimes
            bucket.put_object_from_file(oss_key, local_path)

def get_dir_state(local_dir):
    """
    Get a dictionary of filepath -> mtime for all files in the directory
    """
    state = {}
    for root, dirs, files in os.walk(local_dir):
        for file in files:
            local_path = os.path.join(root, file)
            rel_path = os.path.relpath(local_path, local_dir)
            state[rel_path] = os.path.getmtime(local_path)
    return state

def upload_diff_to_oss(bucket, prefix, local_dir, initial_state):
    """
    Upload files that are new or modified compared to initial_state,
    and delete files from OSS that were deleted locally.
    """
    current_state = get_dir_state(local_dir)
    
    # Upload new or modified files
    for rel_path, mtime in current_state.items():
        if rel_path not in initial_state or initial_state[rel_path] != mtime:
            local_path = os.path.join(local_dir, rel_path)
            oss_key = f"{prefix.rstrip('/')}/{rel_path}"
            bucket.put_object_from_file(oss_key, local_path)
            
    # Delete files that are in initial_state but not in current_state
    for rel_path in initial_state:
        if rel_path not in current_state:
            oss_key = f"{prefix.rstrip('/')}/{rel_path}"
            bucket.delete_object(oss_key)

def handler(event, context):
    """
    Aliyun FC entry point
    event: JSON string containing:
        - command (str): The command to execute
        - command_type (str): "shell" or "python"
        - session_id (str): Used as the OSS prefix for this sandbox session
    """
    try:
        # Parse event
        if isinstance(event, dict):
            event_data = event
        else:
            if isinstance(event, bytes):
                event = event.decode('utf-8')
            
            try:
                event_data = json.loads(event)
            except json.JSONDecodeError:
                return {
                    "statusCode": 400,
                    "body": json.dumps({"error": "Invalid JSON in event"})
                }
            
        command = event_data.get("command")
        command_type = event_data.get("command_type", "shell")
        session_id = event_data.get("session_id", "default")
        
        if not command:
            return {
                "statusCode": 400,
                "body": json.dumps({"error": "Missing 'command' in event"})
            }
            
        # Initialize OSS bucket
        try:
            bucket = get_oss_bucket()
        except Exception as e:
            return {
                "statusCode": 500,
                "body": json.dumps({"error": f"Failed to initialize OSS: {str(e)}"})
            }
            
        # Define local workspace in /tmp
        # Aliyun FC provides /tmp for writable temporary storage (up to 512MB or 10GB depending on config)
        workspace_dir = os.path.join("/tmp", session_id)
        os.makedirs(workspace_dir, exist_ok=True)
        
        # OSS Prefix for this session
        oss_prefix = f"sandbox/{session_id}/"
        
        # Step 1: Sync from OSS to local workspace
        sync_from_oss(bucket, oss_prefix, workspace_dir)
        
        # Record initial state to find diffs later
        initial_state = get_dir_state(workspace_dir)
        
        # Step 2: Execute command
        stdout_data = ""
        stderr_data = ""
        exit_code = 0
        
        try:
            if command_type == "python":
                # Execute as python script
                script_path = os.path.join(workspace_dir, f"script_{int(time.time())}.py")
                with open(script_path, "w") as f:
                    f.write(command)
                
                result = subprocess.run(
                    ["python", script_path],
                    cwd=workspace_dir,
                    capture_output=True,
                    text=True,
                    timeout=300 # 5 minutes timeout
                )
                
                # Cleanup the temporary script
                if os.path.exists(script_path):
                    os.remove(script_path)
            else:
                # Execute as shell command
                result = subprocess.run(
                    command,
                    shell=True,
                    cwd=workspace_dir,
                    capture_output=True,
                    text=True,
                    timeout=300
                )
                
            stdout_data = result.stdout
            stderr_data = result.stderr
            exit_code = result.returncode
            
        except subprocess.TimeoutExpired as e:
            stdout_data = e.stdout.decode('utf-8') if e.stdout else ""
            stderr_data = e.stderr.decode('utf-8') if e.stderr else "Command timed out."
            exit_code = 124
        except Exception as e:
            stderr_data = str(e)
            exit_code = 1
            
        # Step 3: Sync diffs back to OSS
        try:
            upload_diff_to_oss(bucket, oss_prefix, workspace_dir, initial_state)
        except Exception as e:
            stderr_data += f"\nFailed to sync back to OSS: {str(e)}"
            
        # Return result
        return {
            "statusCode": 200,
            "body": json.dumps({
                "stdout": stdout_data,
                "stderr": stderr_data,
                "exit_code": exit_code
            })
        }
        
    except Exception as e:
        return {
            "statusCode": 500,
            "body": json.dumps({
                "error": str(e),
                "traceback": traceback.format_exc()
            })
        }
