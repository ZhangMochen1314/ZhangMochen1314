---
name: DeepResValue-ML
description: 基础机器学习预测技能。当用户要求使用随机森林(Random Forest)、梯度提升树(GBM/XGBoost)进行分类或回归预测，并输出特征重要性时调用。
dependency:
  python:
    - pandas
    - scikit-learn
    - statsext
---

# DeepResValue-ML 机器学习预测技能

## 1. 适用场景
当用户需要进行**基于树模型的机器学习预测**（如随机森林、GBM）来解决分类或回归问题时使用。

## 2. 执行策略与准确调用规范
1. **优先使用预装在 Sandbox 里的 `statsext` 库**：
   - **随机森林 (Random Forest)**：
     ```python
     from statsext.ml.ensemble import random_forest
     res = random_forest(data=df, features=['x1', 'x2'], target='y', task_type='classification', n_estimators=100)
     print(res.summary())
     ```
   - **梯度提升树 (GBM)**：
     ```python
     from statsext.ml.ensemble import gbm
     res = gbm(data=df, features=['x1', 'x2'], target='y', task_type='regression')
     print(res.summary())
     ```

2. **异常自修复 (Self-Repair)**：如果在执行时报错，请清洗数据（如去除缺失值，编码分类变量）后重试。

3. **容错与降级机制 (Fallback to Native Python)**：
   如果尝试修复 3 次均失败，则退回使用原生 `scikit-learn`（`sklearn.ensemble.RandomForestRegressor` 等）。
