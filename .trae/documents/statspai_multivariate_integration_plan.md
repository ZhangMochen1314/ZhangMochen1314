# StatsPAI 多元统计与降维分析 (Multivariate) 集成计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `StatsPAI` 中新增多元统计方法（主成分分析 PCA、K-Means 聚类、因子分析 Factor Analysis），并通过 `statspai.registry` 注册为 Agent-Native 函数，最后生成对应的 Agent 技能文件（`DeepResValue-Multivariate/SKILL.md`）以集成到当前 SaaS 系统中。

**Architecture:** 
1. **StatsPAI 库内修改**：
   - 新建目录 `StatsPAI/src/statspai/multivariate/`
   - 依赖现有的 `scikit-learn`（已在 requirements 中）实现底层算法。
   - 创建 `PCAResults`, `KMeansResults`, `FactorAnalysisResults` 类，继承自 `EconometricResults` 或 `CausalResult` 以兼容现有的 `.summary()` 与 `.to_agent_summary()` 机制。
   - 修改 `StatsPAI/src/statspai/registry.py` 注入这些新函数。
2. **应用层技能集成**：
   - 在 `skills/custom/DeepResValue-Multivariate/SKILL.md` 生成专属提示词。
   - 遵循“数据探针 -> StatsPAI 优先 -> 3次失败降级”的规范。

**Tech Stack:** Python, Pandas, Scikit-learn, LangGraph Skills 体系

---

### Task 1: 创建 Multivariate 结果类与基础结构

**Files:**
- Create: `/workspace/DeepResValue/StatsPAI/src/statspai/multivariate/__init__.py`
- Create: `/workspace/DeepResValue/StatsPAI/src/statspai/multivariate/results.py`
- Modify: `/workspace/DeepResValue/StatsPAI/src/statspai/__init__.py`

- [ ] **Step 1: Write the failing test**

```python
# /workspace/DeepResValue/StatsPAI/tests/test_multivariate_results.py
import pandas as pd
from statspai.multivariate.results import PCAResults

def test_pca_results():
    res = PCAResults(
        n_components=2, 
        explained_variance=[0.6, 0.3], 
        loadings=pd.DataFrame(), 
        scores=pd.DataFrame()
    )
    summary = res.summary()
    assert "Principal Component Analysis" in summary
    assert "0.6000" in summary
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest /workspace/DeepResValue/StatsPAI/tests/test_multivariate_results.py -v`
Expected: FAIL (ModuleNotFoundError)

- [ ] **Step 3: Write minimal implementation**

```python
# /workspace/DeepResValue/StatsPAI/src/statspai/multivariate/__init__.py
from .pca import pca
from .kmeans import kmeans
from .factor_analysis import factor_analysis

__all__ = ["pca", "kmeans", "factor_analysis"]

# /workspace/DeepResValue/StatsPAI/src/statspai/multivariate/results.py
import pandas as pd
from typing import List
from ..core.results import EconometricResults

class PCAResults(EconometricResults):
    def __init__(self, n_components: int, explained_variance: List[float], loadings: pd.DataFrame, scores: pd.DataFrame):
        self.n_components = n_components
        self.explained_variance = explained_variance
        self.loadings = loadings
        self.scores = scores
        # 初始化父类
        super().__init__(params=pd.Series(dtype=float), std_errors=pd.Series(dtype=float), model_info={})

    def summary(self) -> str:
        lines = [
            "Principal Component Analysis (PCA)",
            "=" * 60,
            f"Components retained : {self.n_components}",
            f"Total variance expl : {sum(self.explained_variance):.4f}",
            "",
            "Explained Variance Ratio per PC:",
        ]
        for i, v in enumerate(self.explained_variance):
            lines.append(f"  PC{i+1:<5}: {v:.4f}")
        return "\n".join(lines)

class KMeansResults(EconometricResults):
    def __init__(self, n_clusters: int, cluster_centers: pd.DataFrame, labels: pd.Series, inertia: float):
        self.n_clusters = n_clusters
        self.cluster_centers = cluster_centers
        self.labels = labels
        self.inertia = inertia
        super().__init__(params=pd.Series(dtype=float), std_errors=pd.Series(dtype=float), model_info={})

    def summary(self) -> str:
        return f"K-Means Clustering\n" + "="*60 + f"\nClusters: {self.n_clusters}\nInertia: {self.inertia:.4f}\n"

class FactorAnalysisResults(EconometricResults):
    def __init__(self, n_factors: int, loadings: pd.DataFrame, uniquenesses: pd.Series):
        self.n_factors = n_factors
        self.loadings = loadings
        self.uniquenesses = uniquenesses
        super().__init__(params=pd.Series(dtype=float), std_errors=pd.Series(dtype=float), model_info={})

    def summary(self) -> str:
        return f"Factor Analysis\n" + "="*60 + f"\nFactors: {self.n_factors}\n"

# Modify /workspace/DeepResValue/StatsPAI/src/statspai/__init__.py
# Add near other imports:
# from .multivariate import pca, kmeans, factor_analysis
# Add to __all__: "pca", "kmeans", "factor_analysis"
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest /workspace/DeepResValue/StatsPAI/tests/test_multivariate_results.py -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
cd /workspace/DeepResValue/StatsPAI
git add src/statspai/multivariate/__init__.py src/statspai/multivariate/results.py src/statspai/__init__.py tests/test_multivariate_results.py
git commit -m "feat: add multivariate results base classes"
```

---

### Task 2: 实现 PCA, KMeans, Factor Analysis 核心逻辑

**Files:**
- Create: `/workspace/DeepResValue/StatsPAI/src/statspai/multivariate/pca.py`
- Create: `/workspace/DeepResValue/StatsPAI/src/statspai/multivariate/kmeans.py`
- Create: `/workspace/DeepResValue/StatsPAI/src/statspai/multivariate/factor_analysis.py`

- [ ] **Step 1: Write the failing test**

```python
# /workspace/DeepResValue/StatsPAI/tests/test_multivariate_methods.py
import pandas as pd
import numpy as np
from statspai.multivariate.pca import pca
from statspai.multivariate.kmeans import kmeans
from statspai.multivariate.factor_analysis import factor_analysis

def test_methods():
    df = pd.DataFrame(np.random.randn(100, 3), columns=['A', 'B', 'C'])
    res_pca = pca(df, features=['A', 'B', 'C'], n_components=2)
    assert res_pca.n_components == 2

    res_km = kmeans(df, features=['A', 'B'], n_clusters=3)
    assert res_km.n_clusters == 3

    res_fa = factor_analysis(df, features=['A', 'B', 'C'], n_factors=1)
    assert res_fa.n_factors == 1
```

- [ ] **Step 2: Run test to verify it fails**

- [ ] **Step 3: Write minimal implementation**

```python
# pca.py
import pandas as pd
from typing import List, Optional
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from .results import PCAResults

def pca(data: pd.DataFrame, features: List[str], n_components: Optional[int] = None) -> PCAResults:
    df = data[features].dropna()
    X = StandardScaler().fit_transform(df)
    model = PCA(n_components=n_components).fit(X)
    cols = [f"PC{i+1}" for i in range(model.n_components_)]
    loadings = pd.DataFrame(model.components_.T, index=features, columns=cols)
    scores = pd.DataFrame(model.transform(X), index=df.index, columns=cols)
    return PCAResults(model.n_components_, model.explained_variance_ratio_.tolist(), loadings, scores)

# kmeans.py
import pandas as pd
from typing import List
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from .results import KMeansResults

def kmeans(data: pd.DataFrame, features: List[str], n_clusters: int, random_state: int = 42) -> KMeansResults:
    df = data[features].dropna()
    X = StandardScaler().fit_transform(df)
    model = KMeans(n_clusters=n_clusters, random_state=random_state).fit(X)
    centers = pd.DataFrame(model.cluster_centers_, columns=features)
    labels = pd.Series(model.labels_, index=df.index, name="Cluster")
    return KMeansResults(n_clusters, centers, labels, model.inertia_)

# factor_analysis.py
import pandas as pd
from typing import List
from sklearn.decomposition import FactorAnalysis
from sklearn.preprocessing import StandardScaler
from .results import FactorAnalysisResults

def factor_analysis(data: pd.DataFrame, features: List[str], n_factors: int, random_state: int = 42) -> FactorAnalysisResults:
    df = data[features].dropna()
    X = StandardScaler().fit_transform(df)
    model = FactorAnalysis(n_components=n_factors, random_state=random_state).fit(X)
    loadings = pd.DataFrame(model.components_.T, index=features, columns=[f"Factor{i+1}" for i in range(n_factors)])
    uniquenesses = pd.Series(model.noise_variance_, index=features)
    return FactorAnalysisResults(n_factors, loadings, uniquenesses)
```

- [ ] **Step 4: Run test to verify it passes**

- [ ] **Step 5: Commit**

```bash
cd /workspace/DeepResValue/StatsPAI
git add src/statspai/multivariate/ tests/test_multivariate_methods.py
git commit -m "feat: implement PCA, KMeans, and Factor Analysis"
```

---

### Task 3: 注册至 Agent-Native Registry

**Files:**
- Modify: `/workspace/DeepResValue/StatsPAI/src/statspai/registry.py`

- [ ] **Step 1: Write the failing test**

```python
# /workspace/DeepResValue/StatsPAI/tests/test_registry_multivariate.py
import statspai as sp
def test_registry_has_multivariate():
    funcs = [f['name'] for f in sp.list_functions()]
    assert "pca" in funcs
    assert "kmeans" in funcs
    assert "factor_analysis" in funcs
```

- [ ] **Step 2: Run test to verify it fails**

- [ ] **Step 3: Write minimal implementation**

在 `registry.py` 的 `_build_registry()` 函数中，找到合适的位置（如 `# -- End of manual list --` 之前），插入注册代码：

```python
    register(FunctionSpec(
        name="pca",
        category="multivariate",
        description="Principal Component Analysis (PCA) for dimensionality reduction.",
        params=[
            ParamSpec("data", "DataFrame", True),
            ParamSpec("features", "list", True, description="List of column names"),
            ParamSpec("n_components", "int", False, None, "Number of components to keep"),
        ],
        returns="PCAResults",
        example='sp.pca(data=df, features=["x1", "x2"], n_components=2)',
        tags=["pca", "dimensionality reduction"],
    ))

    register(FunctionSpec(
        name="kmeans",
        category="multivariate",
        description="K-Means Clustering.",
        params=[
            ParamSpec("data", "DataFrame", True),
            ParamSpec("features", "list", True),
            ParamSpec("n_clusters", "int", True),
            ParamSpec("random_state", "int", False, 42),
        ],
        returns="KMeansResults",
        example='sp.kmeans(data=df, features=["x1", "x2"], n_clusters=3)',
        tags=["clustering", "kmeans"],
    ))

    register(FunctionSpec(
        name="factor_analysis",
        category="multivariate",
        description="Exploratory Factor Analysis.",
        params=[
            ParamSpec("data", "DataFrame", True),
            ParamSpec("features", "list", True),
            ParamSpec("n_factors", "int", True),
        ],
        returns="FactorAnalysisResults",
        example='sp.factor_analysis(data=df, features=["x1", "x2", "x3"], n_factors=2)',
        tags=["factor analysis", "dimensionality reduction"],
    ))
```

- [ ] **Step 4: Run test to verify it passes**

- [ ] **Step 5: Commit**

```bash
cd /workspace/DeepResValue/StatsPAI
git add src/statspai/registry.py tests/test_registry_multivariate.py
git commit -m "feat: register multivariate functions in registry"
```

---

### Task 4: 创建 Agent Skill 文件

**Files:**
- Create: `/workspace/DeepResValue/skills/custom/DeepResValue-Multivariate/SKILL.md`

- [ ] **Step 1: 创建技能目录**

```bash
mkdir -p /workspace/DeepResValue/skills/custom/DeepResValue-Multivariate
```

- [ ] **Step 2: 写入 SKILL.md 内容**

将以下内容写入 `SKILL.md`：

```markdown
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
```

- [ ] **Step 3: Commit**

```bash
cd /workspace/DeepResValue
git add skills/custom/DeepResValue-Multivariate/SKILL.md
git commit -m "feat: add Multivariate agent skill definition"
```