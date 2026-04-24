import pandas as pd
import numpy as np
import statsext as se
import statspai as sp

def test_all():
    print("=== Testing Correlation (CCA/PLS) ===")
    df_corr = pd.DataFrame(np.random.randn(50, 4), columns=['X1', 'X2', 'Y1', 'Y2'])
    res_cca = se.cca(df_corr, x_features=['X1', 'X2'], y_features=['Y1', 'Y2'], n_components=1)
    print(res_cca.summary())
    res_pls = se.pls(df_corr, x_features=['X1', 'X2'], y_features=['Y1', 'Y2'], n_components=1)
    print(res_pls.summary())

    print("\n=== Testing Machine Learning (RF/GBM) ===")
    df_ml = pd.DataFrame(np.random.randn(50, 3), columns=['X1', 'X2', 'Y'])
    df_ml['Y_class'] = (df_ml['Y'] > 0).astype(int)
    res_rf = se.random_forest(df_ml, features=['X1', 'X2'], target='Y', task_type='regression', n_estimators=10)
    print(res_rf.summary())
    res_gbm = se.gbm(df_ml, features=['X1', 'X2'], target='Y_class', task_type='classification', n_estimators=10)
    print(res_gbm.summary())

    print("\n=== Testing NLP (TF-IDF/LDA) ===")
    df_nlp = pd.DataFrame({'text': ["apple orange banana", "apple apple", "banana kiwi"]})
    res_tf = se.tfidf(df_nlp, text_column='text', max_features=5)
    print(res_tf.summary())
    # Needs at least 2 words per topic for LDA
    res_lda = se.lda(pd.DataFrame({'text': ["apple orange banana", "apple apple", "banana kiwi", "orange kiwi"]}), text_column='text', n_topics=2, n_top_words=2)
    print(res_lda.summary())
    
    print("\n=== Testing Registry ===")
    funcs = sp.list_functions()
    expected = ["cca", "pls", "random_forest", "gbm", "tfidf", "lda"]
    for e in expected:
        assert e in funcs, f"{e} missing from registry"
        
    print("\nAll advanced methods executed successfully!")

if __name__ == "__main__":
    test_all()