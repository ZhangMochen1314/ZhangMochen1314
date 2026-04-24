import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer, CountVectorizer
from sklearn.decomposition import LatentDirichletAllocation
from .results import TFIDFResults, LDAResults

def tfidf(data: pd.DataFrame, text_column: str, max_features: int = 100) -> TFIDFResults:
    texts = data[text_column].dropna().astype(str)
    vectorizer = TfidfVectorizer(max_features=max_features, stop_words='english')
    X = vectorizer.fit_transform(texts)
    
    features_df = pd.DataFrame(X.toarray(), index=texts.index, columns=vectorizer.get_feature_names_out())
    return TFIDFResults(features_df=features_df, feature_names=vectorizer.get_feature_names_out().tolist())

def lda(data: pd.DataFrame, text_column: str, n_topics: int = 5, n_top_words: int = 10) -> LDAResults:
    texts = data[text_column].dropna().astype(str)
    tf_vectorizer = CountVectorizer(max_df=0.95, min_df=2, stop_words='english')
    tf = tf_vectorizer.fit_transform(texts)
    
    model = LatentDirichletAllocation(n_components=n_topics, random_state=42)
    model.fit(tf)
    
    feature_names = tf_vectorizer.get_feature_names_out()
    topic_words = {}
    for topic_idx, topic in enumerate(model.components_):
        top_features_ind = topic.argsort()[:-n_top_words - 1:-1]
        top_features = [feature_names[i] for i in top_features_ind]
        topic_words[topic_idx] = top_features
        
    cols = [f"Topic{i}" for i in range(n_topics)]
    components_df = pd.DataFrame(model.components_.T, index=feature_names, columns=cols)
    
    return LDAResults(n_topics=n_topics, components=components_df, topic_words=topic_words)
