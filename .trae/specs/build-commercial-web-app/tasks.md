# Tasks

- [ ] Task 1: 完善应用的前端基础布局与状态管理
  - [ ] SubTask 1.1: 在全局 Store（`src/store/useStore.ts`）中增加用户积分状态，并定义动态积分计算的基础常量（如大小费率、复杂度费率）。
  - [ ] SubTask 1.2: 在全局导航栏实时展示当前积分余额，并设计精致的 UI。

- [ ] Task 2: 改造产品首页 (Frontend Design)
  - [ ] SubTask 2.1: 应用高级的 UI 设计理念，修改 `src/pages/Home.tsx` 的 Hero Section，增加针对“正大杯”、“统计建模大赛”及“论文需求”的定制化文案。
  - [ ] SubTask 2.2: 增加定价与积分充值方案卡片，明确不同维度的积分消耗规则（按数据大小、复杂度、执行时间、绘图数量计费）。

- [ ] Task 3: 完善学术数据集管理与多格式上传
  - [ ] SubTask 3.1: 优化 `src/pages/Datasets.tsx`，支持学术常见格式（Excel, CSV, Word, PDF, PPT, dta, sav, shp, py, R, do, zip等）。
  - [ ] SubTask 3.2: 增加前端校验拦截：单个文件限制 50MB，单次最多上传 5 个文件。
  - [ ] SubTask 3.3: 根据上传文件的大小，在 UI 上实时展示预计消耗的“容量积分”。

- [ ] Task 4: 完善核心对话工作区与学术级渲染
  - [ ] SubTask 4.1: 在 `src/pages/Chat.tsx` 中集成基于（复杂度、耗时、图表、大小）的动态积分扣减逻辑与 UI 提示。
  - [ ] SubTask 4.2: 配置 Markdown 渲染器（引入 `remark-math`, `rehype-katex`, `remark-gfm`），以原生支持复杂的数学公式和表格。
  - [ ] SubTask 4.3: 在 `src/index.css` 或 Tailwind 配置中编写自定义 CSS，将所有 Markdown 表格强制渲染为“学术标准三线表”（加粗上下边框和表头下边框，隐藏竖向边框）。
  - [ ] SubTask 4.4: 确保前端能够正确解析并渲染后端生成的图片链接或 Base64 图像。

- [ ] Task 5: 生产环境部署准备
  - [ ] SubTask 5.1: 创建用于前端静态构建的 `Dockerfile` 和 `nginx.conf`。
  - [ ] SubTask 5.2: 优化 `vite.config.ts` 中的生产环境构建配置。
