# Trae Solo 服务端配置修复任务

## 测试结果摘要

| 项目 | 状态 | 说明 |
|-----|------|------|
| 服务运行 | ✅ | deer-flow.service 正常运行 |
| 百炼API Key | ✅ | `sk-c5628e7c238143dda8a264e26eef6999` 测试通过 |
| DeepSeek官方API | ✅ | `sk-f2e8ec9bfcef452b962a757ec92dbc77` 测试通过 |
| OSS连接 | ✅ | Bucket `deeptrace-data-hz` 可访问 |
| Redis连接 | ✅ | 阿里云Redis连接正常 |
| 用户注册 | ✅ | 测试用户创建成功 |
| **Agent运行** | ❌ | 目录缺失，需要配置 |

---

## 🔧 需要修复的问题

### 问题1: Agent目录不存在

**错误日志**:
```
Agent directory not found: /var/www/deepresvalue/deer-flow/backend/.deer-flow/agents/agent
```

**修复命令**:
```bash
# SSH到服务器后执行
cd /var/www/deepresvalue/deer-flow/backend/.deer-flow
mkdir -p agents/agent
```

**创建默认agent配置** (`agents/agent/SOUL.md`):
```markdown
# Agent

你是一个AI助手，帮助用户完成各种任务。

## 能力
- 回答问题和提供建议
- 分析数据和生成报告
- 编写和调试代码
```

---

### 问题2: config.yaml 未配置阿里云百炼模型

**现状**: 当前config.yaml只配置了DeepSeek官方API，需要添加阿里云百炼模型。

**修复方案**: 在 `/var/www/deepresvalue/deer-flow/config.yaml` 的 `models:` 部分添加以下配置：

```yaml
models:
  # ===== 主模型：阿里云百炼 DeepSeek V4-Pro（支持联网搜索） =====
  - name: deepseek-v4-pro-bailian
    display_name: DeepSeek-V4-Pro (百炼+联网)
    use: deerflow.models.patched_openai:PatchedChatOpenAI
    model: deepseek-v4-pro
    api_key: $DASHSCOPE_API_KEY
    base_url: https://dashscope.aliyuncs.com/compatible-mode/v1
    timeout: 600.0
    max_retries: 2
    max_tokens: 8192
    supports_thinking: true
    supports_vision: false
    # 联网搜索功能（通过extra_body传入）
    extra_body:
      enable_search: true

  - name: deepseek-v4-flash-bailian
    display_name: DeepSeek-V4-Flash (百炼)
    use: deerflow.models.patched_openai:PatchedChatOpenAI
    model: deepseek-v4-flash
    api_key: $DASHSCOPE_API_KEY
    base_url: https://dashscope.aliyuncs.com/compatible-mode/v1
    timeout: 300.0
    max_retries: 2
    max_tokens: 4096
    supports_thinking: false
    supports_vision: false

  # ===== 备用模型：DeepSeek官方 =====
  - name: deepseek-v4-pro
    display_name: DeepSeek-V4-Pro (官方)
    use: deerflow.models.patched_deepseek:PatchedChatDeepSeek
    model: deepseek-v4-pro
    api_key: $DEEPSEEK_API_KEY
    base_url: https://api.deepseek.com/v1
    timeout: 600.0
    max_retries: 2
    max_tokens: 8192
    supports_thinking: true
    supports_vision: false

  - name: deepseek-reasoner
    display_name: DeepSeek-V3.2 (Thinking)
    use: deerflow.models.patched_deepseek:PatchedChatDeepSeek
    model: deepseek-reasoner
    api_key: $DEEPSEEK_API_KEY
    timeout: 600.0
    max_retries: 2
    max_tokens: 8192
    supports_thinking: true
    supports_vision: false
```

**注意**: 将上述配置放在 `models:` 列表的最前面，作为默认模型。

---

### 问题3: 设置默认模型

在 `config.yaml` 中找到 `default_model` 配置，修改为：

```yaml
# Default model for agent
default_model: deepseek-v4-pro-bailian
```

---

### 问题4: Redis配置（可选优化）

**现状**: Redis有认证警告 `Redis save failed: Authentication required.`

**修复**: 在 `.env` 文件中添加完整的Redis URL：

```bash
# 编辑 /var/www/deepresvalue/deer-flow/.env
# 添加或修改：
REDIS_URL=redis://:DeepResValue@2026@r-bp1tlzw152y94uncz5.redis.rds.aliyuncs.com:6379/0
```

或者在 `config.yaml` 中添加Redis配置（如果支持的话）。

---

## 📋 完整操作清单

```bash
# 1. SSH连接服务器
ssh -p 2222 root@121.199.9.224
# 密码: DeepResValue@2026

# 2. 创建agent目录
cd /var/www/deepresvalue/deer-flow/backend/.deer-flow
mkdir -p agents/agent

# 3. 创建默认agent配置
cat > agents/agent/SOUL.md << 'EOF'
# Agent

你是一个AI助手，帮助用户完成各种任务。

## 能力
- 回答问题和提供建议
- 分析数据和生成报告
- 编写和调试代码
EOF

# 4. 备份并修改config.yaml
cd /var/www/deepresvalue/deer-flow
cp config.yaml config.yaml.bak.$(date +%Y%m%d%H%M%S)

# 5. 编辑config.yaml，在models部分添加百炼配置
# (建议使用vim/nano编辑，或直接替换文件)

# 6. 重启服务
systemctl restart deer-flow

# 7. 验证服务状态
systemctl status deer-flow
curl http://localhost:8000/health

# 8. 查看日志确认无错误
journalctl -u deer-flow -f
```

---

## ✅ 验证方法

修改完成后，执行以下命令验证：

```bash
# 检查模型列表是否包含百炼模型
curl -s http://localhost:8000/api/models | python3 -c "
import sys, json
data = json.load(sys.stdin)
for m in data.get('models', []):
    print(f\"{m.get('name')}: {m.get('display_name')}\")"

# 创建测试对话验证LLM调用
TOKEN='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0dXNlciIsImV4cCI6MTc3Nzg2ODYyOH0.icZOHWXif4-9J6fCBeAB5ZEm44j3IKAPSsTo226V4_0'

# 创建线程
THREAD=$(curl -s -X POST http://localhost:8000/api/threads \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{}' | python3 -c "import sys,json;print(json.load(sys.stdin)['thread_id'])")

# 发送消息测试
curl -s -X POST "http://localhost:8000/api/threads/$THREAD/runs" \
  -H "Authorization: Bearer $TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "assistant_id": "agent",
    "input": {"messages": [{"role": "user", "content": "你好"}]}
  }'
```

---

## 🔑 API Key 参考

已配置在 `.env` 文件中：
- **阿里云百炼**: `sk-c5628e7c238143dda8a264e26eef6999` → 环境变量 `DASHSCOPE_API_KEY`
- **DeepSeek官方**: `sk-f2e8ec9bfcef452b962a757ec92dbc77` → 环境变量 `DEEPSEEK_API_KEY`

---

## 联系方式

如有问题，请将错误日志发送给 Coze 进行诊断：
```bash
journalctl -u deer-flow --no-pager -n 50
```
