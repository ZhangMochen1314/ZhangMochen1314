# 大数据分析方法（聚类、PCA、因子分析）Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 扩展 `statspai` 库，新增大数据分析（无监督学习）方法，包括 K-Means 聚类、主成分分析（PCA）和因子分析（Factor Analysis），使其完全兼容 `statspai` 原生的 `Agent-native` 架构（注册至 MCP 并在大语言模型中可用）。

**Architecture:** 
- 在 `src/statspai/` 下新建 `multivariate`（多元分析）模块目录。
- 基于 `scikit-learn` 和基础矩阵运算实现底层算法。
- 封装 `EconometricResults` 的子类（如 `PCAResults`, `KMeansResults`, `FactorAnalysisResults`），提供统一的 `.summary()` 和 `.to_agent_summary()` 输出。
- 在 `src/statspai/registry.py` 中通过 `register` 函数，为新方法注册 `FunctionSpec`，以便大语言模型/MCP能够调用。

**Tech Stack:** Python, Pandas, Numpy, Scikit-learn (已有依赖)

---

### Task 1: 创建 Multivariate 模块基础与结果类

**Files:**
- Create: `/workspace/DeepResValue/StatsPAI/src/statspai/multivariate/__init__.py`
- Create: `/workspace/DeepResValue/StatsPAI/src/statspai/multivariate/results.py`

- [ ] **Step 1: Write the failing test**

```python
# tests/test_multivariate_results.py
import pandas as pd
from statspai.multivariate.results import PCAResults

def test_pca_results_summary():
    res = PCAResults(n_components=2, explained_variance=[0.5, 0.3], loadings=pd.DataFrame())
    assert "Principal Component Analysis" in res.summary()
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest tests/test_multivariate_results.py -v`
Expected: FAIL (module not found)

- [ ] **Step 3: Write minimal implementation**

```python
# /workspace/DeepResValue/StatsPAI/src/statspai/multivariate/__init__.py
from .pca import pca
from .kmeans import kmeans
from .factor_analysis import factor_analysis

__all__ = ["pca", "kmeans", "factor_analysis"]

# /workspace/DeepResValue/StatsPAI/src/statspai/multivariate/results.py
from typing import List, Dict, Any
import pandas as pd
from ..core.results import EconometricResults

class PCAResults(EconometricResults):
    def __init__(self, n_components: int, explained_variance: List[float], loadings: pd.DataFrame, scores: pd.DataFrame):
        self.n_components = n_components
        self.explained_variance = explained_variance
        self.loadings = loadings
        self.scores = scores
        # Dummy init for EconometricResults
        super().__init__(params=pd.Series(dtype=float), std_errors=pd.Series(dtype=float), model_info={})
        
    def summary(self) -> str:
        lines = [
            "Principal Component Analysis (PCA)",
            "=" * 60,
            f"Number of components: {self.n_components}",
            "Explained Variance Ratio:",
        ]
        for i, v in enumerate(self.explained_variance):
            lines.append(f"  PC{i+1}: {v:.4f}")
        return "\n".join(lines)
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest tests/test_multivariate_results.py -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/statspai/multivariate/__init__.py src/statspai/multivariate/results.py tests/test_multivariate_results.py
git commit -m "feat(multivariate): add base module and PCAResults class"
```

---

### Task 2: 实现主成分分析 (PCA) 函数

**Files:**
- Create: `/workspace/DeepResValue/StatsPAI/src/statspai/multivariate/pca.py`
- Modify: `/workspace/DeepResValue/StatsPAI/src/statspai/__init__.py:120-125` (添加导出)

- [ ] **Step 1: Write the failing test**

```python
# tests/test_pca.py
import pandas as pd
import numpy as np
from statspai.multivariate.pca import pca

def test_pca_function():
    df = pd.DataFrame(np.random.randn(100, 3), columns=['A', 'B', 'C'])
    res = pca(data=df, features=['A', 'B', 'C'], n_components=2)
    assert res.n_components == 2
    assert len(res.explained_variance) == 2
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest tests/test_pca.py -v`
Expected: FAIL (module not found)

- [ ] **Step 3: Write minimal implementation**

```python
# /workspace/DeepResValue/StatsPAI/src/statspai/multivariate/pca.py
from typing import List, Optional
import pandas as pd
from sklearn.decomposition import PCA as SklearnPCA
from sklearn.preprocessing import StandardScaler
from .results import PCAResults

def pca(data: pd.DataFrame, features: List[str], n_components: Optional[int] = None) -> PCAResults:
    """Perform Principal Component Analysis."""
    df = data[features].dropna()
    X = StandardScaler().fit_transform(df)
    
    model = SklearnPCA(n_components=n_components)
    scores_array = model.fit_transform(X)
    
    loadings = pd.DataFrame(model.components_.T, index=features, columns=[f"PC{i+1}" for i in range(model.n_components_)])
    scores = pd.DataFrame(scores_array, index=df.index, columns=[f"PC{i+1}" for i in range(model.n_components_)])
    
    return PCAResults(n_components=model.n_components_, explained_variance=model.explained_variance_ratio_.tolist(), loadings=loadings, scores=scores)

# Update /workspace/DeepResValue/StatsPAI/src/statspai/__init__.py
# Add: from .multivariate.pca import pca
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest tests/test_pca.py -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/statspai/multivariate/pca.py src/statspai/__init__.py tests/test_pca.py
git commit -m "feat(multivariate): implement PCA function using scikit-learn"
```

---

### Task 3: 在 Registry 中注册 PCA (Agent-Native)

**Files:**
- Modify: `/workspace/DeepResValue/StatsPAI/src/statspai/registry.py`

- [ ] **Step 1: Write the failing test**

```python
# tests/test_registry_pca.py
import statspai as sp

def test_pca_in_registry():
    funcs = sp.list_functions()
    assert "pca" in [f['name'] for f in funcs]
    schema = sp.function_schema('pca')
    assert schema['name'] == 'pca'
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pytest tests/test_registry_pca.py -v`
Expected: FAIL

- [ ] **Step 3: Write minimal implementation**

Modify `/workspace/DeepResValue/StatsPAI/src/statspai/registry.py` inside `_build_registry()`:

```python
    register(FunctionSpec(
        name="pca",
        category="multivariate",
        description="Principal Component Analysis (PCA) for dimensionality reduction.",
        params=[
            ParamSpec("data", "DataFrame", True, description="pandas DataFrame"),
            ParamSpec("features", "list", True, description="List of column names to include in PCA"),
            ParamSpec("n_components", "int", False, None, "Number of components to keep"),
        ],
        returns="PCAResults",
        example='sp.pca(data=df, features=["x1", "x2", "x3"], n_components=2)',
        tags=["pca", "dimensionality reduction", "unsupervised"],
        pre_conditions=[
            "features columns must be numeric",
            "data must not contain infinite values",
        ],
        assumptions=[
            "Linear relationships among variables",
            "Large variances represent important structure (data is automatically standardized internally)",
        ],
        failure_modes=[],
        alternatives=["factor_analysis"],
        typical_n_min=50,
    ))
```

- [ ] **Step 4: Run test to verify it passes**

Run: `pytest tests/test_registry_pca.py -v`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/statspai/registry.py tests/test_registry_pca.py
git commit -m "feat(registry): register pca function for agent access"
```

---

### Task 4: 实现 K-Means 聚类与 Factor Analysis (因子分析) 

*注：实现步骤与 Task 2 和 3 完全相同，此处略写代码，由执行 Agent 补充完整。*

**Files:**
- Create: `/workspace/DeepResValue/StatsPAI/src/statspai/multivariate/kmeans.py`
- Create: `/workspace/DeepResValue/StatsPAI/src/statspai/multivariate/factor_analysis.py`
- Modify: `src/statspai/multivariate/results.py` (Add KMeansResults, FactorAnalysisResults)
- Modify: `src/statspai/registry.py` (Add `kmeans` and `factor_analysis` to registry)

- [ ] **Step 1: Write the failing tests for KMeans and FA**
- [ ] **Step 2: Verify test fails**
- [ ] **Step 3: Implement KMeans (using sklearn.cluster.KMeans) and FA (using sklearn.decomposition.FactorAnalysis)**
- [ ] **Step 4: Register both functions in `registry.py` under the "multivariate" category**
- [ ] **Step 5: Run tests and commit**

```bash
git commit -m "feat(multivariate): add kmeans and factor_analysis with agent registry support"
```
