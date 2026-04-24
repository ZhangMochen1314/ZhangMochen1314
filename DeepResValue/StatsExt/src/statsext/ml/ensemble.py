import pandas as pd
from sklearn.ensemble import RandomForestRegressor, RandomForestClassifier, GradientBoostingRegressor, GradientBoostingClassifier
from .results import MLResults

def random_forest(data: pd.DataFrame, features: list[str], target: str, task_type: str = "regression", n_estimators: int = 100) -> MLResults:
    df = data[features + [target]].dropna()
    X, y = df[features], df[target]
    
    if task_type == "classification":
        model = RandomForestClassifier(n_estimators=n_estimators, random_state=42)
    else:
        model = RandomForestRegressor(n_estimators=n_estimators, random_state=42)
        
    model.fit(X, y)
    score = model.score(X, y)
    importances = pd.Series(model.feature_importances_, index=features).sort_values(ascending=False)
    
    return MLResults(model_name="Random Forest", task_type=task_type, score=score, feature_importances=importances)

def gbm(data: pd.DataFrame, features: list[str], target: str, task_type: str = "regression", n_estimators: int = 100) -> MLResults:
    df = data[features + [target]].dropna()
    X, y = df[features], df[target]
    
    if task_type == "classification":
        model = GradientBoostingClassifier(n_estimators=n_estimators, random_state=42)
    else:
        model = GradientBoostingRegressor(n_estimators=n_estimators, random_state=42)
        
    model.fit(X, y)
    score = model.score(X, y)
    importances = pd.Series(model.feature_importances_, index=features).sort_values(ascending=False)
    
    return MLResults(model_name="Gradient Boosting", task_type=task_type, score=score, feature_importances=importances)
