# 代码质量与安全性修复计划

## Summary
本次计划主要解决系统中的明显代码错误与安全隐患，涉及三个方面：
1. 清除隐式吞噬错误的空异常捕获（`except: pass`），替换为适当的日志记录或警告打印，以便于调试和追踪。
2. 修复代码示例与部署脚本中的硬编码密钥问题，强制依赖环境变量或随机生成管理敏感配置。
3. 完善基础功能模块的 TODO 遗留项，包括在前端引入真实用户信息获取（对接后端新增的 `/auth/me` 接口）和后端网关处理全部消息角色。

## Current State Analysis
1. **异常处理不当**：`analyze.py`、`generate_review.py`、`cleanup-containers.sh` 和 `test_upload.py` 中多处使用 `except Exception: pass` 或 `except: pass`，掩盖了底层系统、I/O或解析异常，可能导致静默失败。
2. **密钥硬编码**：`llm_clients.py` 的文档示例中直接使用 `sk-...` 形式，易误导开发者直接硬编码；`deploy.sh` 默认认证密钥 `placeholder` 过于简单且可能泄露。
3. **TODO 遗留**：
   - 后端缺少获取当前登录用户信息的 API（`/auth/me`），导致前端 `Login.tsx` 登录成功后只能使用写死的 `mockUser` 假数据。
   - 后端 `services.py` 在消息转换时未正确处理 `system`、`ai` 和 `tool` 等角色，全部作为 `HumanMessage` 处理。

## Proposed Changes

### 1. 修复空异常捕获
- **`skills/public/data-analysis/scripts/analyze.py`**: 将 `preview_data` 函数中的 `except Exception: pass` 改为 `except Exception as e: print(f"Warning: Failed to fetch non-null counts: {e}")`。
- **`scripts/cleanup-containers.sh`**: 将内嵌 Python 脚本中的全局裸捕获 `except: pass` 改为捕获特定异常并打印警告：`except Exception as e: print("Container cleanup warning:", e)`。
- **`test_upload.py`**: 修改流式读取处的 `except json.JSONDecodeError: pass` 为打印错误日志 `print(f"Skipping JSON decode error: {e}")`。
- **`skills/public/skill-creator/eval-viewer/generate_review.py`**: 将各处的 `except OSError: pass`、`except (json.JSONDecodeError, OSError): pass` 替换为打印提示，如 `except Exception as e: logging.debug(f"Ignored error: {e}")`。

### 2. 清理硬编码密钥
- **`StatsPAI/src/statspai/causal_llm/llm_clients.py`**: 移除类和函数文档字符串（Docstring）中的 `api_key="sk-..."` 硬编码示范，改为说明推荐使用环境变量，例如：`api_key=os.environ.get("OPENAI_API_KEY")`。
- **`scripts/deploy.sh`**: 将 `BETTER_AUTH_SECRET="${BETTER_AUTH_SECRET:-placeholder}"` 替换为生成强随机字符串（如：`BETTER_AUTH_SECRET="${BETTER_AUTH_SECRET:-$(openssl rand -hex 32)}"`）。

### 3. 补全基础 TODO/Mock 逻辑
- **后端 `backend/app/auth/router.py`**: 新增 `GET /me` 路由接口，通过复用 `get_current_user` 依赖，直接返回当前已鉴权的真实用户信息。
- **前端 `frontend/src/pages/Login.tsx`**: 移除 `mockUser` 定义，在 `fetch('/auth/login')` 成功获取 token 后，紧接着增加对 `/auth/me` 的 fetch 请求（带上 Authorization Bearer Token），使用后端返回的真实用户数据更新系统状态。
- **后端 `backend/app/gateway/services.py`**: 完善 `normalize_input` 函数中对其他消息角色的处理逻辑。引入 `langchain_core.messages` 中的 `SystemMessage`, `AIMessage`, `ToolMessage`，根据 `role` 正确实例化对应的消息类。

## Assumptions & Decisions
- **假设**：`backend/app/auth/router.py` 中的用户模型能被直接序列化返回，或者可以直接复用现有的 Response 模型。
- **假设**：不修复 `tests/` 目录中的 `test-key` 占位符，因为它们是用于验证鉴权工厂内部行为的测试用例，并非实际的密钥泄露风险。
- **决策**：对于前端 `/auth/me` 的调用，在遇到网络错误时将回退到错误处理逻辑（抛出登录失败异常），以确保不会存在无效的半登录状态。

## Verification steps
- [ ] 全局搜索 `except Exception: pass` 和 `except: pass`，确认已被彻底清理。
- [ ] 检查 `llm_clients.py` 中的文档说明是否不再包含 `sk-...`。
- [ ] 检查 `deploy.sh` 脚本是否能够成功执行且默认生成安全密钥。
- [ ] 运行后端服务并访问 `/auth/me`（携带有效 token），测试接口是否正常返回用户数据。
- [ ] 编译并访问前端应用，验证登录流程是否已成功替换为真实用户数据。