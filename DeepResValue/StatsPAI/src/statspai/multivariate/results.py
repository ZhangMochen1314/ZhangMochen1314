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
