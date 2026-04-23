import yaml
with open('/workspace/deer-flow/config.yaml', 'r') as f:
    config = yaml.safe_load(f)

if 'models' not in config or config['models'] is None:
    config['models'] = []
config['models'].append({
    'name': 'deepseek-reasoner',
    'display_name': 'DeepSeek Reasoner',
    'use': 'deerflow.models.patched_deepseek:PatchedChatDeepSeek',
    'model': 'deepseek-reasoner',
    'api_base': 'https://api.deepseek.com/v1',
    'api_key': '$DEEPSEEK_API_KEY',
    'timeout': 600.0,
    'max_retries': 2,
    'supports_thinking': True
})

with open('/workspace/deer-flow/config.yaml', 'w') as f:
    yaml.dump(config, f)
