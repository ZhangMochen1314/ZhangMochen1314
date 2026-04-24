import pandas as pd
from statspai.core.results import EconometricResults

class CCAResults(EconometricResults):
    def __init__(self, n_components: int, x_weights: pd.DataFrame, y_weights: pd.DataFrame):
        self.n_components = n_components
        self.x_weights = x_weights
        self.y_weights = y_weights
        super().__init__(params=pd.Series(dtype=float), std_errors=pd.Series(dtype=float), model_info={})
    
    def summary(self) -> str:
        return f"Canonical Correlation Analysis (CCA)\n" + "="*60 + f"\nComponents: {self.n_components}\n"

class PLSResults(EconometricResults):
    def __init__(self, n_components: int, x_weights: pd.DataFrame, y_weights: pd.DataFrame, score: float):
        self.n_components = n_components
        self.x_weights = x_weights
        self.y_weights = y_weights
        self.score = score
        super().__init__(params=pd.Series(dtype=float), std_errors=pd.Series(dtype=float), model_info={})
        
    def summary(self) -> str:
        return f"Partial Least Squares (PLS)\n" + "="*60 + f"\nComponents: {self.n_components}\nR-squared Score: {self.score:.4f}\n"
