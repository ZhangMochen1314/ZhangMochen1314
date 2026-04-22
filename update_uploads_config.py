import yaml
with open('/workspace/deer-flow/config.yaml', 'r') as f:
    config = yaml.safe_load(f)

if 'uploads' not in config or config['uploads'] is None:
    config['uploads'] = {}
config['uploads']['auto_convert_documents'] = True

with open('/workspace/deer-flow/config.yaml', 'w') as f:
    yaml.dump(config, f)
