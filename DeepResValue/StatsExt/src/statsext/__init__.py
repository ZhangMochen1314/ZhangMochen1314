from .multivariate import pca, kmeans, factor_analysis
from .correlation import cca, pls
from .ml import random_forest, gbm
from .nlp import tfidf, lda

from statspai.registry import register, FunctionSpec, ParamSpec

__all__ = ["pca", "kmeans", "factor_analysis", "cca", "pls", "random_forest", "gbm", "tfidf", "lda"]

# Register PCA
register(FunctionSpec(
    name="pca",
    category="multivariate",
    description="Principal Component Analysis (PCA) for dimensionality reduction.",
    params=[
        ParamSpec("data", "DataFrame", True),
        ParamSpec("features", "list", True, description="List of column names"),
        ParamSpec("n_components", "int", False, None, "Number of components to keep"),
    ],
    returns="PCAResults",
    example='import statsext as se\nse.pca(data=df, features=["x1", "x2"], n_components=2)',
    tags=["pca", "dimensionality reduction"],
))

# Register KMeans
register(FunctionSpec(
    name="kmeans",
    category="multivariate",
    description="K-Means Clustering.",
    params=[
        ParamSpec("data", "DataFrame", True),
        ParamSpec("features", "list", True),
        ParamSpec("n_clusters", "int", True),
        ParamSpec("random_state", "int", False, 42),
    ],
    returns="KMeansResults",
    example='import statsext as se\nse.kmeans(data=df, features=["x1", "x2"], n_clusters=3)',
    tags=["clustering", "kmeans"],
))

# Register Factor Analysis
register(FunctionSpec(
    name="factor_analysis",
    category="multivariate",
    description="Exploratory Factor Analysis.",
    params=[
        ParamSpec("data", "DataFrame", True),
        ParamSpec("features", "list", True),
        ParamSpec("n_factors", "int", True),
        ParamSpec("random_state", "int", False, 42),
    ],
    returns="FactorAnalysisResults",
    example='import statsext as se\nse.factor_analysis(data=df, features=["x1", "x2", "x3"], n_factors=2)',
    tags=["factor analysis", "dimensionality reduction"],
))

# Register CCA
register(FunctionSpec(
    name="cca",
    category="correlation",
    description="Canonical Correlation Analysis (CCA).",
    params=[
        ParamSpec("data", "DataFrame", True),
        ParamSpec("x_features", "list", True),
        ParamSpec("y_features", "list", True),
        ParamSpec("n_components", "int", False, 2),
    ],
    returns="CCAResults",
    example='import statsext as se\nse.cca(data=df, x_features=["x1", "x2"], y_features=["y1", "y2"], n_components=1)',
    tags=["correlation", "cca"],
))

# Register PLS
register(FunctionSpec(
    name="pls",
    category="correlation",
    description="Partial Least Squares Regression (PLS).",
    params=[
        ParamSpec("data", "DataFrame", True),
        ParamSpec("x_features", "list", True),
        ParamSpec("y_features", "list", True),
        ParamSpec("n_components", "int", False, 2),
    ],
    returns="PLSResults",
    example='import statsext as se\nse.pls(data=df, x_features=["x1", "x2"], y_features=["y1", "y2"], n_components=1)',
    tags=["correlation", "pls", "regression"],
))

# Register Random Forest
register(FunctionSpec(
    name="random_forest",
    category="ml",
    description="Random Forest model for regression or classification.",
    params=[
        ParamSpec("data", "DataFrame", True),
        ParamSpec("features", "list", True),
        ParamSpec("target", "str", True),
        ParamSpec("task_type", "str", False, "regression"),
        ParamSpec("n_estimators", "int", False, 100),
    ],
    returns="MLResults",
    example='import statsext as se\nse.random_forest(data=df, features=["x1", "x2"], target="y", task_type="classification")',
    tags=["ml", "random forest", "prediction", "ensemble"],
))

# Register GBM
register(FunctionSpec(
    name="gbm",
    category="ml",
    description="Gradient Boosting model for regression or classification.",
    params=[
        ParamSpec("data", "DataFrame", True),
        ParamSpec("features", "list", True),
        ParamSpec("target", "str", True),
        ParamSpec("task_type", "str", False, "regression"),
        ParamSpec("n_estimators", "int", False, 100),
    ],
    returns="MLResults",
    example='import statsext as se\nse.gbm(data=df, features=["x1", "x2"], target="y", task_type="regression")',
    tags=["ml", "gbm", "prediction", "ensemble"],
))

# Register TF-IDF
register(FunctionSpec(
    name="tfidf",
    category="nlp",
    description="TF-IDF feature extraction for text data.",
    params=[
        ParamSpec("data", "DataFrame", True),
        ParamSpec("text_column", "str", True),
        ParamSpec("max_features", "int", False, 100),
    ],
    returns="TFIDFResults",
    example='import statsext as se\nse.tfidf(data=df, text_column="review", max_features=50)',
    tags=["nlp", "text", "tfidf", "feature extraction"],
))

# Register LDA
register(FunctionSpec(
    name="lda",
    category="nlp",
    description="Latent Dirichlet Allocation (LDA) for topic modeling.",
    params=[
        ParamSpec("data", "DataFrame", True),
        ParamSpec("text_column", "str", True),
        ParamSpec("n_topics", "int", False, 5),
        ParamSpec("n_top_words", "int", False, 10),
    ],
    returns="LDAResults",
    example='import statsext as se\nse.lda(data=df, text_column="review", n_topics=3, n_top_words=5)',
    tags=["nlp", "text", "lda", "topic modeling"],
))
