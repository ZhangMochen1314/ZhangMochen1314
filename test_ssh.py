import paramiko
import sys

HOST = '121.199.9.224'
PORT = 2222
USER = 'root'
PASS = 'DeepResValue@2026'

def test_connection():
    print(f"🔄 正在尝试连接到 {USER}@{HOST}:{PORT} ...")
    ssh = paramiko.SSHClient()
    ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
    try:
        ssh.connect(HOST, port=PORT, username=USER, password=PASS, timeout=10)
        print("✅ SSH 连接成功！\n")
        
        # 执行几个基础命令证明连接成功
        commands = [
            "hostname",
            "uptime",
            "pwd",
            "ls -la /root/deer-flow | head -n 5"
        ]
        
        for cmd in commands:
            print(f"▶ 执行命令: {cmd}")
            stdin, stdout, stderr = ssh.exec_command(cmd)
            out = stdout.read().decode('utf-8').strip()
            err = stderr.read().decode('utf-8').strip()
            
            if out:
                print(out)
            if err:
                print(f"错误输出: {err}")
            print("-" * 40)
            
    except Exception as e:
        print(f"❌ 连接失败: {e}")
        sys.exit(1)
    finally:
        ssh.close()

if __name__ == '__main__':
    test_connection()
