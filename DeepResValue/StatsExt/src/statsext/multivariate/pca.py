import pandas as pd
from typing import List, Optional
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
from .results import PCAResults

def pca(data: pd.DataFrame, features: List[str], n_components: Optional[int] = None) -> PCAResults:
    """Perform Principal Component Analysis."""
    df = data[features].dropna()
    X = StandardScaler().fit_transform(df)
    
    model = PCA(n_components=n_components)
    scores_array = model.fit_transform(X)
    
    cols = [f"PC{i+1}" for i in range(model.n_components_)]
    loadings = pd.DataFrame(model.components_.T, index=features, columns=cols)
    scores = pd.DataFrame(scores_array, index=df.index, columns=cols)
    
    return PCAResults(
        n_components=model.n_components_, 
        explained_variance=model.explained_variance_ratio_.tolist(), 
        loadings=loadings, 
        scores=scores
    )
