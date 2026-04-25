import subprocess

result = subprocess.run(['python3', 'clean_missing.py'], capture_output=True, text=True, cwd='/mnt/user-data/workspace')
print(result.stdout)
print(result.stderr)
