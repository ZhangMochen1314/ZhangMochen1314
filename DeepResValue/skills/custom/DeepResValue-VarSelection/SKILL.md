---
name: DeepResValue-VarSelection
description: 专门用于实证分析的核心解释变量与控制变量筛选技能。结合大模型的语义理解与 Lasso/OLS 统计检验，从原始宽表中挑选出统计显著且符合用户研究主题的变量。
dependency:
  python:
    - pandas
    - numpy
    - statsmodels
    - scikit-learn
---

# DeepResValue-VarSelection 核心变量筛选

## 0. 意图与主题澄清 (Intent Clarification) - 【执行动作前必做】
1. **研究主题强制确认**：在执行任何变量筛选前，**必须主动询问**并确认用户的**具体研究主题**（例如：“您想研究数字化转型对企业创新的影响，还是环境规制对全要素生产率的影响？”）。
2. **被解释变量 (Y) 确认**：如果用户未明确指定因变量 Y，请根据其研究主题，结合数据集中已有的列名，向用户推荐合适的 Y，并等待用户确认。
3. **沙盒探针**：收到或确认用户数据文件后，执行 `pd.read_csv().head()` 和 `df.info()` 了解数据集全貌。

## 1. 核心任务与强制约束
- **核心约束 1**：必须确保挑选出的“核心解释变量”在 OLS 回归中具备统计显著性（通常要求 p < 0.05 或 p < 0.1）。
- **核心约束 2**：最终保留的“控制变量”数量**不得超过 10 个**。
- **核心约束 3**：选定的所有解释变量（核心 X 和控制 X）在字面含义和经济学逻辑上，必须与用户的研究主题高度相关。

## 2. 执行策略与算法管线 (Lasso + OLS Pipeline)

### Phase 1: LLM 语义初筛 (Semantic Filtering)
在运行复杂的统计代码前，请你发挥大模型的语义理解优势：
1. 观察 `df.columns` 中的所有列名。
2. 直接剔除与研究主题明显无关的列（例如：身份证号、随机ID、纯文本备注、与其他业务毫无关联的指标）。
3. 挑选出 1-3 个最可能作为**核心解释变量 (Core X)** 的候选列。
4. 挑选出一批合理的**控制变量候选列 (Control Xs)**。
5. *如果候选列中有包含非数值型字符串的分类变量，请在接下来的代码中将其转换为虚拟变量 (`pd.get_dummies`)*。

### Phase 2: 统计降维与显著性过滤 (编写 Python 脚本)
在沙盒中编写并执行 Python 代码，实现以下算法流：

```python
import pandas as pd
import numpy as np
import statsmodels.api as sm
from sklearn.linear_model import LassoCV
from sklearn.preprocessing import StandardScaler

# 1. 数据预处理
# (由智能体根据实际数据编写：处理缺失值，对数值型进行标准化等)
df = pd.read_csv("你的数据路径.csv")
# 填充缺失值，剔除极值等...

# 定义 Y, core_x, 和 control_candidates
y_col = '被解释变量'
core_x_cols = ['核心变量候选1']
control_cols = ['控制变量1', '控制变量2', ...]

# 准备数据
X_controls = df[control_cols]
y = df[y_col]

# 2. Lasso 初筛 (当控制变量过多时)
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_controls)
lasso = LassoCV(cv=5, random_state=42).fit(X_scaled, y)
# 提取系数非 0 的变量
selected_controls = [col for col, coef in zip(control_cols, lasso.coef_) if coef != 0]

# 3. OLS 迭代剔除 (向后逐步回归)
# 强制保留核心变量，每次剔除 p 值最大的控制变量，直到控制变量数 <= 10 且尽量显著
def stepwise_ols(df, y_col, core_cols, control_cols, max_controls=10, p_threshold=0.1):
    current_controls = list(control_cols)
    
    while True:
        X_cols = core_cols + current_controls
        X = sm.add_constant(df[X_cols])
        model = sm.OLS(df[y_col], X).fit()
        
        # 提取控制变量的 p 值
        pvalues = model.pvalues[current_controls]
        
        # 检查是否满足停止条件
        if len(current_controls) <= max_controls and (len(pvalues) == 0 or pvalues.max() < p_threshold):
            break
            
        # 如果控制变量为空，强制退出
        if len(current_controls) == 0:
            break
            
        # 剔除 p 值最大的控制变量
        worst_feature = pvalues.idxmax()
        current_controls.remove(worst_feature)
        
    return model, core_cols, current_controls

# 执行迭代
final_model, final_core, final_controls = stepwise_ols(df, y_col, core_x_cols, selected_controls)

# 打印最终结果
print(final_model.summary())
```
*注：以上代码为核心逻辑模板。如果核心变量在迭代后仍不显著（p > 0.1），请在代码中尝试替换为备选的核心变量并重试。*

## 3. 结果输出与学术解释
成功找出显著的变量组合后，请以 Markdown 格式向用户输出报告：
1. **最终变量清单**：列出被解释变量 (Y)、核心解释变量 (X) 以及最终保留的控制变量。
2. **经济学含义解释**：结合用户的研究主题，用严谨的学术语言解释**为什么选择这些变量**，它们在现实业务或经济学理论中分别代表了什么机制。
3. **统计结果摘要**：展示最终的 OLS 回归结果（包括 R-squared、核心变量的回归系数、t 值、p 值等），证明筛选结果的有效性。
