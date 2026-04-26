import sys
import paramiko
from scp import SCPClient
import os

HOST = '121.199.9.224'
PORT = 2222
USER = 'root'
PASS = 'DeepResValue@2026'

def create_ssh_client():
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    ssh.connect(HOST, port=PORT, username=USER, password=PASS)
    return ssh

def sync_file(local_path, remote_path):
    ssh = create_ssh_client()
    try:
        with SCPClient(ssh.get_transport()) as scp:
            scp.put(local_path, remote_path)
            print(f"✅ 成功同步文件: {local_path} -> {remote_path}")
    except Exception as e:
        print(f"❌ 同步失败: {e}")
    finally:
        ssh.close()

def restart_service(service_name):
    ssh = create_ssh_client()
    try:
        cmd = f"cd /root/deer-flow/docker && docker-compose -f docker-compose.prod.yml restart {service_name}"
        stdin, stdout, stderr = ssh.exec_command(cmd)
        err = stderr.read().decode('utf-8')
        out = stdout.read().decode('utf-8')
        if err and "Restarting" not in err:
            print(f"⚠️ 服务重启警告或错误:\n{err}")
        print(f"✅ 成功重启服务: {service_name}")
        print(out)
    except Exception as e:
        print(f"❌ 重启服务失败: {e}")
    finally:
        ssh.close()

def execute_remote_cmd(cmd):
    ssh = create_ssh_client()
    try:
        stdin, stdout, stderr = ssh.exec_command(cmd)
        print(stdout.read().decode('utf-8'))
        err = stderr.read().decode('utf-8')
        if err:
            print(f"ERROR: {err}")
    finally:
        ssh.close()

if __name__ == '__main__':
    if len(sys.argv) < 3:
        print("Usage: python sync_to_ecs.py <local_path> <remote_path_under_deer_flow> [service_to_restart]")
        sys.exit(1)
    
    local_p = sys.argv[1]
    remote_p = f"/root/deer-flow/{sys.argv[2]}"
    
    sync_file(local_p, remote_p)
    
    if len(sys.argv) == 4:
        restart_service(sys.argv[3])
