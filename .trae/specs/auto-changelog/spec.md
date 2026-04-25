# 自动记录更新日志 (Auto Changelog) Spec

## Why
项目中缺乏统一的更新日志记录机制。为了方便追踪代码变更、功能迭代和 bug 修复，需要建立标准的 `CHANGELOG.md` 并在其中自动/规范地记录最近的更新。此外，作为自动化 Agent，需要有能力自动总结并写入最近完成的代码更改。

## What Changes
- 在项目根目录创建 `CHANGELOG.md` 更新日志文件。
- 编写一个 Python 脚本 `scripts/update_changelog.py`，支持通过命令行快速追加日志。
- 将刚刚完成的代码质量修复（空异常捕获修复、硬编码密钥清理、前端登录及后端 auth/me 接口完善）作为第一批日志自动记录进去。

## Impact
- Affected specs: 无
- Affected code: `/workspace/DeepResValue_WebApp/CHANGELOG.md`, `/workspace/DeepResValue_WebApp/scripts/update_changelog.py`

## ADDED Requirements
### Requirement: 更新日志文件
系统 SHALL 包含一个标准的 Markdown 格式的更新日志文件，遵循 Keep a Changelog 规范。

#### Scenario: 成功记录
- **WHEN** 开发者查看根目录
- **THEN** 可以看到结构化的 `CHANGELOG.md`，包含版本、日期和具体的更新条目（如 Added, Changed, Fixed, Security）。

### Requirement: 日志更新脚本
系统 SHALL 提供一个自动化脚本，能通过命令行参数向 `CHANGELOG.md` 的 Unreleased 或指定版本下追加新的更新条目。

#### Scenario: 运行更新脚本
- **WHEN** 运行 `python scripts/update_changelog.py --version "v2.5.1" --type "Fixed" --message "修复空异常捕获"`
- **THEN** `CHANGELOG.md` 顶部自动增加对应的更新记录。