# Tasks

- [ ] Task 1: 完善应用的前端基础布局与状态管理
  - [ ] SubTask 1.1: 在全局 Store（`src/store/useStore.ts`）中增加用户积分状态（例如：初始赠送 100 积分）。
  - [ ] SubTask 1.2: 在全局导航栏或用户面板中实时展示当前积分余额。

- [ ] Task 2: 改造产品首页以突出大学生科研与竞赛商业化卖点
  - [ ] SubTask 2.1: 修改 `src/pages/Home.tsx` 的 Hero Section，增加针对“正大杯”、“统计建模大赛”及“论文需求”的定制化文案。
  - [ ] SubTask 2.2: 增加定价与积分充值方案卡片，明确普通会员与高级会员（大量积分、专业报告生成等）的区别。

- [ ] Task 3: 完善数据集管理与上传机制
  - [ ] SubTask 3.1: 优化 `src/pages/Datasets.tsx` 的文件上传交互，限制为 CSV/Excel 格式。
  - [ ] SubTask 3.2: 增加“上传大型数据集将消耗积分”的 UI 提示和模拟扣减逻辑。

- [ ] Task 4: 完善核心对话工作区与分析报告渲染
  - [ ] SubTask 4.1: 在 `src/pages/Chat.tsx` 中集成消息发送时的积分拦截（积分不足时提示充值）和扣减逻辑。
  - [ ] SubTask 4.2: 引入 Markdown 渲染库（支持数学公式和代码高亮），以正确展示 StatsPAI 返回的专业数据分析报告。
  - [ ] SubTask 4.3: 引入基础图表库（如 Recharts），以便在前端动态渲染数据可视化图表。

- [ ] Task 5: 生产环境部署准备
  - [ ] SubTask 5.1: 在项目根目录创建用于前端静态构建的 `Dockerfile` 和 Nginx 配置文件。
  - [ ] SubTask 5.2: 优化 `vite.config.ts` 中的生产环境构建配置。
