---
name: DeepResValue-DID
description: 双重差分(DID)分析技能。支持平行趋势检验与倾向得分匹配(PSM)。强制优先使用 StatsPAI 库，无法满足时回退到 Python 脚本。
dependency:
  python:
    - pandas
    - statsmodels
    - linearmodels
---

# DeepResValue-DID 双重差分分析

## 0. 意图澄清与数据预检 (Data Validation & Clarification) - 【执行动作前必做】
1. **沙盒探针**：收到用户文件后，**必须**首先执行沙盒代码（如 `pd.read_csv().head()` 和 `df.info()`）探测数据结构。
2. **要素逼问 (Intent Clarification)**：若用户需求模糊或数据中缺少关键变量，必须“踩刹车”并**主动询问用户**，禁止盲目猜测和运行代码。
   - DID 模型强依赖面板结构与处理状态。如果用户只说“做个 DID”，**必须主动询问**并确认以下关键参数：
     - **被解释变量 (y)** 是什么？
     - **时间变量 (t)** 和 **个体标识变量 (id)** 是什么？
     - **处理变量 (treatment/policy)** 是什么？或者谁是实验组，政策发生的具体年份是多少？
   - 根据数据探针的结果，如果发现不同个体受政策干预的时间不一样，**必须主动提醒用户**：“您的数据属于交错 DID (Staggered DID) 结构，传统的双向固定效应可能存在负权重偏误，我将为您采用更前沿的 Callaway & Sant'Anna (2021) 异质性稳健估计量”。
3. **数据约束检查 (Data Constraints)**：查阅该技能相关模型的隐性要求，并在代码中显式进行数据对齐与清洗。

## 1. 核心任务与强制规则
1. **任务目标**：进行因果推断中的 DID 分析，包含基准回归、平行趋势检验、安慰剂检验及 PSM-DID。

## 2. 执行策略与 StatsPAI 准确调用规范（严格遵守）
1. **StatsPAI 首选原则**：编写模型代码时，**必须优先尝试导入并使用预装在 Sandbox 里的 `statspai` 库**。
   
   - **现代异质性 DID (交错 DID - 首选)**：
     处理多期/错期 DID 时，必须使用前沿估计量 Callaway & Sant'Anna (2021)：
     ```python
     import pandas as pd
     from statspai.did.callaway_santanna import callaway_santanna
     
     # 读取数据
     df = pd.read_csv('/mnt/user-data/workspace/uploads/你的数据.csv')
     
     # 调用 CS2021 估计量
     # 参数要求：data(数据集), y(被解释变量列名), g(队列期列名, 未受处理填0), t(时间列名), id_col(个体标识列名)
     res = callaway_santanna(data=df, y='你的y', g='处理年份列', t='年份列', id_col='企业id')
     
     # 1. 打印学术标准的回归结果表格
     print(res.summary())
     
     # 2. 绘制事件研究平行趋势图并保存
     fig = res.plot()
     fig.savefig('/mnt/user-data/workspace/outputs/did_event_study.png', dpi=300)
     ```
   
   - **平行趋势敏感性分析**：如果用户要求做稳健性检验，必须调用 `from statspai.did.honest_did import honest_did` (Rambachan & Roth 2023) 进行“诚实 DID”敏感性分析。
   
   - **异常自修复 (Self-Repair)**：如果在执行 `statspai` 时报错，请**仔细阅读错误栈中的 `recovery_hint`（修复提示）**。如果提示缺少变量、数据类型不匹配（如面板不平衡、包含非数值字符），请根据提示编写数据清洗或转换代码（如 `pd.to_numeric()`, `df.dropna()`），修复数据后**重新尝试调用 `statspai`**。

2. **容错与降级机制 (Fallback to Native Python)**：
   如果你连续尝试修复并执行 `statspai` 代码 **3次均失败**，或者遇到 `statspai` 明确提示“该模型/方法未实现 (NotImplemented)”，你必须触发**平滑降级**：
   - **立即放弃使用 `statspai`**。
   - 转而使用原生的 `linearmodels.PanelOLS` 编写双向固定效应 DID 回归代码。
   - **降级代码示例 (Fallback Code)**：
     ```python
     import pandas as pd
     from linearmodels.panel import PanelOLS
     
     # 设定面板双重索引
     df = df.set_index(['企业id', '年份列'])
     
     # 使用双向固定效应 (个体 + 时间)
     # y ~ treatment + EntityEffects + TimeEffects
     mod = PanelOLS(df['你的y'], df[['处理变量']], entity_effects=True, time_effects=True)
     res = mod.fit(cov_type='clustered', cluster_entity=True)
     print(res.summary)
     ```
   - 在向用户解释时，请礼貌地说明：“由于数据结构的复杂性导致高级估计量暂时无法收敛，我已自动为您切换到经典的双向固定效应（TWFE）面板模型进行评估。”
3. **输出**：调用结果对象的 `.summary()` 或 `CSReport` 生成学术标准的回归结果表格（Markdown），并调用结果对象的 `.plot()` 绘制事件研究平行趋势图（保存为高分辨率图片）。