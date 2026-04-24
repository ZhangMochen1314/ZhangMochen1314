---
name: DeepResValue-Correlation
description: 多元关联分析技能。当用户要求进行典型相关分析(CCA)、偏最小二乘回归(PLS)等探索变量组之间关联性时调用。
dependency:
  python:
    - pandas
    - scikit-learn
    - statsext
---

# DeepResValue-Correlation 关联分析技能

## 1. 适用场景
当用户希望探讨**两组变量之间的整体相关性**（如 CCA）或处理多重共线性进行**预测建模**（如 PLS）时使用。

## 2. 执行策略与准确调用规范
1. **优先使用预装在 Sandbox 里的 `statsext` 库**：
   - **典型相关分析 (CCA)**：
     ```python
     from statsext.correlation.cca import cca
     res = cca(data=df, x_features=['x1', 'x2'], y_features=['y1', 'y2'], n_components=1)
     print(res.summary())
     ```
   - **偏最小二乘回归 (PLS)**：
     ```python
     from statsext.correlation.pls import pls
     res = pls(data=df, x_features=['x1', 'x2'], y_features=['y1', 'y2'], n_components=1)
     print(res.summary())
     ```

2. **异常自修复 (Self-Repair)**：如果在执行 `statsext` 时报错（如传入了包含字符串的非数值列、或者存在缺失值），请仔细阅读错误提示，清洗数据后重新尝试。

3. **容错与降级机制 (Fallback to Native Python)**：
   如果尝试修复 3 次均失败，则退回使用原生 `scikit-learn`（`sklearn.cross_decomposition.CCA` 或 `PLSRegression`）。
