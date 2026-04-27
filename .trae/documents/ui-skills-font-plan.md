# 技能面板UI升级与暗色模式字体修复计划

## 摘要 (Summary)
根据用户的要求，我们需要对前端右侧的“自定义技能”面板进行 UI 升级，将其从原本的药丸按钮样式（图1）修改为卡片列表样式（图2），但**去除简要描述文字**，并**提取显示其中文名称**。
同时，将技能的选择逻辑改为**前端单选**（智能体后端依然支持多技能解析），并修复暗色模式下中文字体显示发虚或异常的问题（采用类似 Solo 的系统默认无衬线字体）。

## 现状分析 (Current State Analysis)
1. **技能面板 UI**：当前 `customSkills` 渲染为简单的 `<button>`，只显示英文的 `skill.name`。而 `CORE_SKILLS` 是带有图标、标题、描述和单选圈的精美卡片。
2. **多选逻辑**：目前 `Chat.tsx` 中的 `selectedSkills` 是一个数组，允许用户无限多选。
3. **字体问题**：`index.css` 中配置了 `--font-heading: 'Poppins'` 和 `--font-body: 'Lora'`。这些英文字体在暗色模式下渲染中文字符时，由于字重和抗锯齿的差异，会导致显示发虚或异常。

## 建议变更 (Proposed Changes)

### 1. 后端：提取技能的中文展示名 (`display_name`)
**涉及文件**：
- `backend/packages/harness/deerflow/skills/types.py`
- `backend/packages/harness/deerflow/skills/parser.py`
- `backend/app/gateway/routers/skills.py`
**操作**：
- 在 `Skill` 类和 `SkillResponse` 模型中新增 `display_name` 字段。
- 修改 `parser.py`，通过正则 `re.search(r"^#\s+(.+)$", content, re.MULTILINE)` 提取 `SKILL.md` 中的一级标题。如果标题以英文 `name` 开头，则截取其后面的中文部分（如从 `# DeepResValue-BioMR 孟德尔随机化生信分析` 提取出 `孟德尔随机化生信分析`）作为 `display_name`。

### 2. 前端：重构技能面板与单选逻辑
**文件**: `frontend/src/pages/Chat.tsx`
**操作**:
- **状态重构**：将 `selectedSkills` 数组状态更改为支持存储单个选中技能的逻辑（统一处理 `CORE_SKILLS` 和 `customSkills` 的单选排他性）。
- **UI 重构**：将 `customSkills` 的渲染代码替换为与 `CORE_SKILLS` 完全一致的 `<motion.button>` 卡片结构。
- **去除描述与显示中文**：在 `customSkills` 的卡片中，去掉原本的 `<p>` 描述标签，标题直接渲染为 `skill.display_name || skill.name`，左侧图标统一使用闪电（`Zap`）图标。
- **前缀拼装**：在发送消息时，只将当前**唯一选中**的技能转为 `@技能名` 前缀发给后端。

### 3. 前端：修复暗色模式字体
**文件**: `frontend/src/index.css`
**操作**:
- 抛弃对中文支持不佳的 `Poppins` 和 `Lora` 字体，将 `:root` 下的 `--font-heading` 和 `--font-body` 统一修改为现代系统级无衬线字体栈：
  ```css
  system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif
  ```
- 这样能完美继承 Solo 及主流编辑器的原生暗色模式渲染效果，解决中文字体发虚的问题。

## 假设与决策 (Assumptions & Decisions)
- **决策**：前端限制每次只能点选一个技能（点击其他技能会替换当前选中状态，再次点击当前技能会取消选中）。但后端的 `prompt.py` 逻辑不变，这意味着如果用户在输入框里手动打字 `@技能A @技能B`，智能体依然可以同时触发多个技能，满足“前端单选，后端不限”的要求。

## 验证步骤 (Verification Steps)
- 检查 `frontend/src/index.css` 字体修改是否生效。
- 启动前后端服务，刷新页面，观察右侧自定义技能是否变成了带有中文标题、无描述的精美卡片。
- 验证点击技能卡片时，是否具有单选排他性效果。