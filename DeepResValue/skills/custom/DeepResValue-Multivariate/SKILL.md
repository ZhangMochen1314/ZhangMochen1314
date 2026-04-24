---
name: DeepResValue-Multivariate
description: 大数据降维与无监督学习技能。当用户要求进行主成分分析(PCA)、K-Means聚类、因子分析(Factor Analysis)等探索性分析时调用。
dependency:
  python:
    - pandas
    - scikit-learn
---

# DeepResValue-Multivariate 大数据分析与降维技能

## 1. 适用场景
当用户希望进行**数据降维**（PCA、因子分析）或**样本分组**（K-Means聚类）时，使用此技能。

## 2. 执行策略与 StatsPAI 准确调用规范（严格遵守）
1. **StatsPAI 首选原则**：在生成 Python 分析代码时，**必须优先尝试导入并使用预装在 Sandbox 里的 `statspai` 库**。
   
   - **主成分分析 (PCA)**：
     ```python
     import pandas as pd
     from statspai.multivariate.pca import pca
     
     df = pd.read_csv('/mnt/user-data/workspace/uploads/你的数据.csv')
     # 参数要求：data(数据集), features(需要降维的特征列名列表), n_components(保留的主成分个数，可选)
     res = pca(data=df, features=['x1', 'x2', 'x3'], n_components=2)
     print(res.summary())
     
     # 可以将降维后的得分并入原数据
     df = df.join(res.scores)
     ```
   
   - **K-Means 聚类**：
     ```python
     from statspai.multivariate.kmeans import kmeans
     
     res = kmeans(data=df, features=['x1', 'x2', 'x3'], n_clusters=3)
     print(res.summary())
     # 将聚类标签并入原数据
     df['cluster'] = res.labels
     ```

   - **异常自修复 (Self-Repair)**：如果在执行 `statspai` 时报错（如传入了包含字符串的非数值列、或者存在缺失值），请**仔细阅读错误栈中的 `recovery_hint`（修复提示）**。根据提示编写数据清洗或转换代码（如 `df.dropna()`, `pd.to_numeric()`），修复数据后**重新尝试调用 `statspai`**。

2. **容错与降级机制 (Fallback to Native Python)**：
   如果你连续尝试修复并执行 `statspai` 代码 **3次均失败**，或者遇到库暂未支持的功能，你必须触发**平滑降级**：
   - **立即放弃使用 `statspai`**。
   - 转而使用原生的 `scikit-learn` 编写稳健的备用代码。
   - **降级代码示例 (Fallback Code)**：
     ```python
     from sklearn.decomposition import PCA
     from sklearn.preprocessing import StandardScaler
     
     X = StandardScaler().fit_transform(df[['x1', 'x2']].dropna())
     pca_model = PCA(n_components=2).fit(X)
     print("Explained Variance:", pca_model.explained_variance_ratio_)
     ```
   - 在向用户解释时，请礼貌地说明：“由于数据复杂性导致高级分析接口无法执行，我已自动为您切换到原生的 scikit-learn 底层引擎进行评估。”
