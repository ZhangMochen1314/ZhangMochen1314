import pandas as pd
from typing import List
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from .results import KMeansResults

def kmeans(data: pd.DataFrame, features: List[str], n_clusters: int, random_state: int = 42) -> KMeansResults:
    """Perform K-Means clustering."""
    df = data[features].dropna()
    X = StandardScaler().fit_transform(df)
    
    model = KMeans(n_clusters=n_clusters, random_state=random_state)
    model.fit(X)
    
    centers = pd.DataFrame(model.cluster_centers_, columns=features)
    labels = pd.Series(model.labels_, index=df.index, name="Cluster")
    
    return KMeansResults(
        n_clusters=n_clusters, 
        cluster_centers=centers, 
        labels=labels, 
        inertia=model.inertia_
    )
