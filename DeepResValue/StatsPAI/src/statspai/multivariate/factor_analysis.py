import pandas as pd
from typing import List
from sklearn.decomposition import FactorAnalysis
from sklearn.preprocessing import StandardScaler
from .results import FactorAnalysisResults

def factor_analysis(data: pd.DataFrame, features: List[str], n_factors: int, random_state: int = 42) -> FactorAnalysisResults:
    """Perform Exploratory Factor Analysis."""
    df = data[features].dropna()
    X = StandardScaler().fit_transform(df)
    
    model = FactorAnalysis(n_components=n_factors, random_state=random_state)
    model.fit(X)
    
    cols = [f"Factor{i+1}" for i in range(n_factors)]
    loadings = pd.DataFrame(model.components_.T, index=features, columns=cols)
    uniquenesses = pd.Series(model.noise_variance_, index=features)
    
    return FactorAnalysisResults(
        n_factors=n_factors, 
        loadings=loadings, 
        uniquenesses=uniquenesses
    )
