import pandas as pd
import numpy as np
from statspai.multivariate.pca import pca
from statspai.multivariate.kmeans import kmeans
from statspai.multivariate.factor_analysis import factor_analysis
import statspai as sp

def test_multivariate():
    print("Testing PCA...")
    df = pd.DataFrame(np.random.randn(100, 3), columns=['A', 'B', 'C'])
    res_pca = pca(df, features=['A', 'B', 'C'], n_components=2)
    print(res_pca.summary())
    assert res_pca.n_components == 2

    print("\nTesting KMeans...")
    res_km = kmeans(df, features=['A', 'B'], n_clusters=3)
    print(res_km.summary())
    assert res_km.n_clusters == 3

    print("\nTesting Factor Analysis...")
    res_fa = factor_analysis(df, features=['A', 'B', 'C'], n_factors=1)
    print(res_fa.summary())
    assert res_fa.n_factors == 1
    
    print("\nTesting Registry...")
    funcs = [f['name'] for f in sp.list_functions()]
    assert "pca" in funcs
    assert "kmeans" in funcs
    assert "factor_analysis" in funcs
    print("All tests passed successfully!")

if __name__ == "__main__":
    test_multivariate()
