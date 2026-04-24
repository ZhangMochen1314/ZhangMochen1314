import pandas as pd
from statspai.core.results import EconometricResults

class TFIDFResults(EconometricResults):
    def __init__(self, features_df: pd.DataFrame, feature_names: list[str]):
        self.features_df = features_df
        self.feature_names = feature_names
        super().__init__(params=pd.Series(dtype=float), std_errors=pd.Series(dtype=float), model_info={})
        
    def summary(self) -> str:
        words = ", ".join(self.feature_names[:10]) + ("..." if len(self.feature_names) > 10 else "")
        return f"TF-IDF Feature Extraction\n" + "="*60 + f"\nVocabulary Size: {len(self.feature_names)}\nTop words: {words}\n"

class LDAResults(EconometricResults):
    def __init__(self, n_topics: int, components: pd.DataFrame, topic_words: dict[int, list[str]]):
        self.n_topics = n_topics
        self.components = components
        self.topic_words = topic_words
        super().__init__(params=pd.Series(dtype=float), std_errors=pd.Series(dtype=float), model_info={})
        
    def summary(self) -> str:
        lines = [
            "LDA Topic Modeling",
            "="*60,
            f"Number of Topics: {self.n_topics}\n"
        ]
        for topic_idx, words in self.topic_words.items():
            lines.append(f"Topic {topic_idx}: {', '.join(words)}")
        return "\n".join(lines)
