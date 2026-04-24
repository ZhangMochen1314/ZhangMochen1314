import pandas as pd
from sklearn.cross_decomposition import PLSRegression
from .results import PLSResults

def pls(data: pd.DataFrame, x_features: list[str], y_features: list[str], n_components: int = 2) -> PLSResults:
    df = data[x_features + y_features].dropna()
    X, Y = df[x_features], df[y_features]
    
    model = PLSRegression(n_components=n_components)
    model.fit(X, Y)
    score = model.score(X, Y)
    
    cols = [f"Comp{i+1}" for i in range(n_components)]
    x_weights = pd.DataFrame(model.x_weights_, index=x_features, columns=cols)
    y_weights = pd.DataFrame(model.y_weights_, index=y_features, columns=cols)
    
    return PLSResults(n_components=n_components, x_weights=x_weights, y_weights=y_weights, score=score)
