---
name: DeepResValue-NLP
description: 文本分析模型技能。当用户要求进行 TF-IDF 词频特征提取、LDA 主题模型分析等基础文本处理任务时调用。
dependency:
  python:
    - pandas
    - scikit-learn
    - statsext
---

# DeepResValue-NLP 文本分析技能

## 1. 适用场景
当用户提供文本数据，需要提取**TF-IDF 特征**或通过**LDA 发现潜在主题**时使用。

## 2. 执行策略与准确调用规范
1. **优先使用预装在 Sandbox 里的 `statsext` 库**：
   - **TF-IDF 特征提取**：
     ```python
     from statsext.nlp.text_models import tfidf
     res = tfidf(data=df, text_column='review', max_features=50)
     print(res.summary())
     # res.features_df 包含了提取后的特征矩阵
     ```
   - **LDA 主题模型**：
     ```python
     from statsext.nlp.text_models import lda
     res = lda(data=df, text_column='review', n_topics=3, n_top_words=5)
     print(res.summary())
     ```

2. **异常自修复 (Self-Repair)**：如果在执行时报错（如传入了全为数字的列，或样本量极少），请确保目标列转为字符串并重试。

3. **容错与降级机制 (Fallback to Native Python)**：
   如果尝试修复 3 次均失败，则退回使用原生 `scikit-learn`（`sklearn.feature_extraction.text.TfidfVectorizer` 等）。
