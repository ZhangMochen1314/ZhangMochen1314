---
name: DeepResValue-StatsPAI-Execute
description: 使用 DeerFlow 工具链封装 StatsPAI（先检索函数与参数，再在沙盒/FC 中执行），输出论文式结果（表格/图片/Markdown + 下载链接）。
dependency:
  python:
    - statspai
---

# DeepResValue-StatsPAI-Execute

## 1. 强制流程（必须遵守）
1. 先做函数选择：使用 `statspai_list_functions`（按关键词检索）锁定候选函数名。
2. 再做参数对齐：对候选函数调用 `statspai_describe_function`，严格按 schema 组织参数。
3. 最后执行：调用 `statspai_execute`，并传入：
   - `name`：函数名
   - `arguments`：JSON 参数（不要传 data）
   - `data_path`：优先使用 `/mnt/user-data/uploads/...` 的文件路径
4. 输出必须“论文式”：
   - 主对话：给出简短的文字解读（研究问题 → 识别策略 → 核心结论）
   - 产物：至少包含 `report.md`；如可用则包含 `figure.png`、`regtable.xlsx`

## 2. 输出规范（最小验收）
1. `report.md`：包含方法、数据路径、以及 StatsPAI 的 `.summary()` 输出。
2. `figure.png`（如适用）：使用 StatsPAI 结果对象的 `.plot(type='auto')` 生成。
3. 其他产物（如适用）：`regtable.xlsx`、`tidy.csv`、`result.json`、`run.log`、`manifest.json`。

## 3. 常见任务模板
### 3.1 回归（OLS/FE/IV）
- 检索：`statspai_list_functions(query="regress feols ivreg")`
- 描述：`statspai_describe_function(name="regress")`
- 执行：`statspai_execute(name="regress", arguments={...}, data_path="/mnt/user-data/uploads/xxx.csv")`

### 3.2 因果推断（DID/RD/Synth）
- 检索：`statspai_list_functions(query="did callaway santanna rdrobust synth")`
- 描述：`statspai_describe_function(name="rdrobust")`
- 执行：`statspai_execute(name="rdrobust", arguments={...}, data_path="/mnt/user-data/uploads/xxx.csv")`

