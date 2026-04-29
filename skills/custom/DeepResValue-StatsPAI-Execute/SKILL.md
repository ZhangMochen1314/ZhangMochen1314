---
name: DeepResValue-StatsPAI-Execute
description: 使用 StatsPAI 执行可复现的实证分析（函数检索→参数对齐→执行→结构化结果）。输入数据必须来自 thread uploads（virtual_path / artifact_url），禁止使用外部 OSS URL。
dependency:
  python:
    - statspai
    - pandas
---

# DeepResValue-StatsPAI-Execute

## 核心契约（必须遵守）
1. 数据输入只能来自当前对话 thread 的 uploads：
   - 优先使用 `<uploaded_files>` 中给出的 `path`（形如 `/mnt/user-data/uploads/<filename>`）
   - 允许使用系统返回的 `artifact_url`（形如 `/api/threads/{thread_id}/artifacts/mnt/user-data/uploads/<filename>`）
   - 允许仅传入文件名（形如 `xxx.csv`，等价于 uploads 下文件）
2. 禁止把任何外部 URL（例如 `https://...oss...`）作为数据输入传给执行工具。
3. 若你只有 presigned PUT 上传 URL：必须先完成 `uploads/confirm`（由前端/网关完成确认），然后再从 `<uploaded_files>` 获取 `path` 执行。

## 推荐流程（检索→对齐→执行）
1. 先检索：调用 `statspai_list_functions`，用关键词找到最合适的 StatsPAI 函数名。
2. 再对齐：调用 `statspai_describe_function` 获取 schema/参数说明，确保参数名与类型匹配。
3. 最后执行：调用 `statspai_execute(name=..., arguments=..., data_path=...)`，其中 `data_path` 必须来自 `<uploaded_files>` 的 `path` 或你们自己的 `artifact_url`。

## 输出要求
1. 主对话中输出学术论文风格结果：先给出核心回归表/估计结果解读，再给出方法与稳健性说明。
2. 若执行返回包含 `summary` 或 `tidy`，优先用于表格化展示与文字分析；必要时再补充关键系数、标准误与显著性。

