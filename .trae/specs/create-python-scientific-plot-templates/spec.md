# Python 科研绘图模板库 Spec

## Why
人文社科领域的数据分析（如正大杯竞赛、期刊论文）对科研图片的规范性和美观度有较高要求。为了让 deerflow2.0 智能体在使用科研绘图技能时能够直接输出高质量、符合A4排版标准且美观的图片，需要建立一套标准的 Python 科研绘图模板库。

## What Changes
- 创建一个 Python 绘图模板/配置库（基于 Matplotlib/Seaborn 等）。
- 设定默认图片宽度适配 A4 纸张（约 6.3 英寸宽），高度按黄金比例或常用比例适配。
- 移除图片内部默认生成的图标题（Title），以适应学术论文图注（Figure Caption）在外部排版的规范。
- 设定符合人文社科审美的配色方案和字体规范（如中文宋体、英文 Times New Roman，字号规范等）。
- 预留接口以集成用户后续提供的 `.doc` 文档中的具体要求。

## Impact
- Affected specs: deerflow2.0 智能体的绘图输出规范。
- Affected code: 绘图模板配置模块（如 `plot_config.py` 或 `style` 文件）。

## ADDED Requirements
### Requirement: A4 尺寸适配与无标题规范
系统应提供预设的绘图上下文或全局配置，自动将图表尺寸和标题规范化。

#### Scenario: 智能体调用绘图
- **WHEN** deerflow2.0 智能体生成数据分析图表时
- **THEN** 图表宽度自动设为适应 A4 页面的尺寸，且图表内部不包含标题，配色和字体符合学术规范。

### Requirement: 整合用户 Doc 文档规范
系统需要能够吸收和应用用户特定的排版规范。

#### Scenario: 补充具体要求
- **WHEN** 用户提供包含具体要求的 `.doc` 文档时
- **THEN** 模板库更新配色、线宽、字号等参数以严格对齐文档标准。
