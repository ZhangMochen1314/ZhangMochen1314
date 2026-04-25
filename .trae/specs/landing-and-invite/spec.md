# Landing Page & Invite System Spec

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

## Why
当前系统缺乏一个吸引人的落地页（Landing Page），用户打开网站直接进入应用或登录界面，体验不佳。此外，系统目前开放注册，不利于初期的内测传播与用户控制。需要引入邀请码裂变机制：每个用户注册时必须填写邀请码，注册后获得专属邀请码；通过邀请可实现积分双向奖励（邀请人得 100 积分，被邀请人得 50 积分），从而激励用户传播。落地页需要加入动态效果，提升科技感与品牌调性。

## What Changes
- **Landing Page**: 
  - 新增首页 `/` 作为落地页，原有的应用界面移至 `/app` 或保持受保护状态。
  - 落地页包含动态背景效果（参考 `algorithmic-art` 技能，使用 p5.js 或 CSS 动画实现“计算美学”、“涌现行为”的动态效果）。
  - 使用 `brand-guidelines` 的配色（深色 `#141413`，亮色 `#faf9f5`，以及强调色 `#d97757`、`#6a9bcc`、`#788c5d`）和字体（Poppins / Lora 风格）来设计落地页文案与按钮。
  - 添加明确的“登录/注册”入口按钮。
- **Database (Auth Models)**: 
  - `User` 模型新增 `invite_code` 字段（唯一，用户自己的邀请码）。
  - `User` 模型新增 `invited_by` 字段（记录是谁邀请了他，外键或存 `invite_code`）。
  - 创建初始的系统级“内测码”（由管理员手动在数据库生成，如 `DEEPRESEARCH2026`）。
- **Auth API**:
  - `POST /auth/register` 接口要求必填 `invite_code` 参数。
  - 注册逻辑：
    1. 校验传入的 `invite_code` 是否存在（是否为某个用户的 `invite_code` 或管理员生成的全局码）。不存在则拒绝注册。
    2. 生成新用户的专属 `invite_code`（如 8 位随机字母数字）。
    3. 新用户注册成功后，额外获得 50 积分奖励（基础积分 + 50）。
    4. 找到 `invite_code` 的主人（邀请人），给其增加 100 积分。
- **Frontend Auth**:
  - 注册表单新增“邀请码”必填项。
  - 个人中心或设置页展示用户的专属邀请码，方便复制分享。

## Impact
- Affected specs: Auth, Frontend Routing, UI/UX
- Affected code:
  - `frontend/src/App.tsx` (路由调整)
  - `frontend/src/pages/Landing.tsx` (新建落地页)
  - `frontend/src/pages/Register.tsx` (注册表单修改)
  - `backend/app/auth/models.py` (数据库模型更新)
  - `backend/app/auth/router.py` (注册接口与积分奖励逻辑)
  - `backend/app/auth/schemas.py` (Pydantic 模型更新)

## ADDED Requirements
### Requirement: 动态落地页
系统 SHALL 提供一个带有动态生成艺术效果的落地页，展示系统价值并引导注册登录。

#### Scenario: Success case
- **WHEN** 未登录用户访问根路径 `/`
- **THEN** 看到带有科技感动态背景、品牌字体与配色的页面，包含“开始使用”或“登录”按钮。

### Requirement: 邀请码注册与奖励
系统 SHALL 限制仅拥有邀请码的用户才能注册，并自动分发奖励。

#### Scenario: Success case
- **WHEN** 用户使用邀请码 `ALICE123`（属于 Alice）注册 Bob 账号
- **THEN** Bob 注册成功并获得专属邀请码，Bob 初始积分增加 50，Alice 积分自动增加 100。数据库记录 Bob 被 `ALICE123` 邀请。

## MODIFIED Requirements
### Requirement: 注册表单
注册表单必填项由 Username, Email, Password 变更为 Username, Email, Password, Invite Code。