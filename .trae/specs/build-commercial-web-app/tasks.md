# Tasks

- [x] Task 1: 完善应用的前端基础布局与状态管理
  - [x] SubTask 1.1: 在全局 Store（`src/store/useStore.ts`）中增加用户积分状态，并定义精细化积分计算的基础常量（如：微观/县/市/省费率、大小费率、复杂度费率、文献检索费率）。
  - [x] SubTask 1.2: 在全局导航栏实时展示当前积分余额，并设计精致的 UI。

- [x] Task 2: 改造产品首页 (Frontend Design)
  - [x] SubTask 2.1: 应用高级的 UI 设计理念，修改 `src/pages/Home.tsx` 的 Hero Section，文案突出“海量内置科研数据（宏微观）”、“自动文献综述”、“国家级竞赛指导”。
  - [x] SubTask 2.2: 增加定价与积分充值方案卡片，明确不同维度的积分消耗规则（重点说明：调用微观企业数据比宏观省级数据消耗更多积分，输出数据越大消耗越多）。
  - [x] SubTask 2.3: 使用 byted-seedance/seedream 技能生成学术科研感的高级图片/动图素材，应用于首页背景或功能插图。

- [x] Task 3: 完善数据中心与数据集管理
  - [x] SubTask 3.1: 优化 `src/pages/Datasets.tsx`，除了用户上传（支持常见学术格式），增加“系统内置科研数据”展示面板（分类展示微观企业、县域、市级、省级等）。
  - [x] SubTask 3.2: 在前端增加调用内置数据的交互链路与预估积分扣减提示（基于数据级别和预估文件大小）。

- [x] Task 4: 完善核心对话工作区与学术级渲染
  - [x] SubTask 4.1: 在 `src/pages/Chat.tsx` 中集成文献检索指令与内置数据提取指令的交互反馈，展示动态积分扣减逻辑（检索广度、数据提取量）。
  - [x] SubTask 4.2: 配置 Markdown 渲染器（引入 `remark-math`, `rehype-katex`, `remark-gfm`），以原生支持复杂的数学公式和表格。
  - [x] SubTask 4.3: 在 `src/index.css` 或 Tailwind 配置中编写自定义 CSS，将所有 Markdown 表格强制渲染为“学术标准三线表”。
  - [x] SubTask 4.4: 确保前端能够正确解析并渲染后端生成的图片链接或 Base64 图像。

- [x] Task 5: 生产环境部署准备
  - [x] SubTask 5.1: 创建用于前端静态构建的 `Dockerfile` 和 `nginx.conf`。
  - [x] SubTask 5.2: 优化 `vite.config.ts` 中的生产环境构建配置。
