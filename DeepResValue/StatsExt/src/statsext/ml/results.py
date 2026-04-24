import pandas as pd
from statspai.core.results import EconometricResults

class MLResults(EconometricResults):
    def __init__(self, model_name: str, task_type: str, score: float, feature_importances: pd.Series):
        self.model_name = model_name
        self.task_type = task_type
        self.score = score
        self.feature_importances = feature_importances
        super().__init__(params=pd.Series(dtype=float), std_errors=pd.Series(dtype=float), model_info={})
        
    def summary(self) -> str:
        score_name = "Accuracy" if self.task_type == "classification" else "R-squared"
        lines = [
            f"{self.model_name} ({self.task_type.capitalize()})",
            "="*60,
            f"{score_name} Score: {self.score:.4f}\n",
            "Feature Importances:"
        ]
        for idx, val in self.feature_importances.items():
            lines.append(f"  {idx:<14}: {val:.4f}")
        return "\n".join(lines)
