# 统计方法速查手册

## 目录
- 数据类型与方法映射
- 描述统计方法
- 回归分析方法
- 多元统计方法
- 时间序列方法
- 机器学习方法
- 因果推断方法
- Python代码示例

## 数据类型与方法映射

### 横截面数据（Cross-sectional Data）
单一时间点上多个个体的观测数据。
**适用方法**：描述统计、相关性分析、回归分析、因子分析、聚类分析、判别分析
**典型场景**：消费者行为调查、企业绩效分析、地区经济比较

### 时间序列数据（Time Series Data）
单个个体在多个时间点上的观测数据。
**适用方法**：时间序列分析、ARIMA模型、趋势分解、周期性分析、平稳性检验
**典型场景**：GDP趋势预测、股票价格分析、季节性商品销售预测

### 面板数据（Panel Data）
多个个体在多个时间点上的观测数据。
**适用方法**：面板回归模型、固定效应模型、随机效应模型、动态面板模型
**典型场景**：省级经济增长研究、企业绩效追踪、家庭收入调查

## 描述统计方法

### 基本统计量
**适用场景**：初步了解数据特征，进行数据探索
**Python实现**：
```python
import pandas as pd
import numpy as np

# 均值、标准差、中位数、四分位数
df.describe()

# 相关系数矩阵
df.corr()

# 偏度、峰度
df.skew()  # 偏度
df.kurtosis()  # 峰度
```

### 数据分布检验
**适用场景**：检验数据是否符合正态分布等假设
**Python实现**：
```python
from scipy import stats

# Shapiro-Wilk正态性检验
stats.shapiro(df['variable'])

# Kolmogorov-Smirnov检验
stats.kstest(df['variable'], 'norm')

# Anderson-Darling检验
stats.anderson(df['variable'], dist='norm')
```

## 回归分析方法

### 线性回归
**适用场景**：分析连续因变量与自变量的线性关系
**适用条件**：线性关系、误差项独立同分布、无多重共线性
**Python实现**：
```python
import statsmodels.api as sm

# OLS回归
X = sm.add_constant(df[['x1', 'x2', 'x3']])
model = sm.OLS(df['y'], X).fit()
print(model.summary())

# 检验
model.f_test()  # F检验（整体显著性）
model.t_test()  # t检验（系数显著性）
```

### Logistic回归
**适用场景**：因变量为二分类变量（0/1）
**适用条件**：二分类因变量、大样本
**Python实现**：
```python
import statsmodels.api as sm

X = sm.add_constant(df[['x1', 'x2']])
y = df['binary_var']
model = sm.Logit(y, X).fit()
print(model.summary())
```

### 面板回归模型
**适用场景**：面板数据，控制个体异质性
**Python实现**：
```python
import linearmodels as plm

# 固定效应模型
model_fe = plm.PanelOLS(df['y'], df[['x1', 'x2']], entity_effects=True).fit()

# 随机效应模型
model_re = plm.RandomEffects(df['y'], df[['x1', 'x2']]).fit()

# 豪斯曼检验（选择固定效应或随机效应）
import numpy as np
from scipy import stats
def hausman(fe, re):
    beta_diff = fe.params - re.params
    v_diff = fe.cov - re.cov
    chi2 = beta_diff.T @ np.linalg.inv(v_diff) @ beta_diff
    p_value = 1 - stats.chi2.cdf(chi2, len(beta_diff))
    return chi2, p_value
```

## 多元统计方法

### 主成分分析（PCA）
**适用场景**：降维、提取主要信息、消除多重共线性
**适用条件**：变量间存在相关性
**Python实现**：
```python
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler

# 标准化
scaler = StandardScaler()
X_scaled = scaler.fit_transform(df[['x1', 'x2', 'x3', 'x4']])

# PCA
pca = PCA(n_components=2)
X_pca = pca.fit_transform(X_scaled)

# 解释方差
print(f"解释方差比例: {pca.explained_variance_ratio_}")
```

### 因子分析
**适用场景**：识别潜在因子、构建综合评价指标
**适用条件**：变量间存在相关性、样本量充足（建议样本量>变量数的5倍）
**Python实现**：
```python
from factor_analyzer import FactorAnalyzer

# 因子分析
fa = FactorAnalyzer(n_factors=3, rotation='varimax')
fa.fit(df[['x1', 'x2', 'x3', 'x4', 'x5']])

# 因子载荷
print(fa.loadings_)

# KMO检验（检验是否适合因子分析）
from factor_analyzer.factor_analyzer import calculate_kmo
kmo_all, kmo_model = calculate_kmo(df)
print(f"KMO值: {kmo_model}")  # KMO>0.7适合
```

### 聚类分析
**适用场景**：数据分组、模式识别
**Python实现**：
```python
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

# K-means聚类
scaler = StandardScaler()
X_scaled = scaler.fit_transform(df[['x1', 'x2', 'x3']])

kmeans = KMeans(n_clusters=3, random_state=42)
clusters = kmeans.fit_predict(X_scaled)

# 确定最优聚类数（肘部法则）
from sklearn.metrics import silhouette_score
silhouette_scores = []
for n in range(2, 10):
    kmeans = KMeans(n_clusters=n, random_state=42)
    clusters = kmeans.fit_predict(X_scaled)
    score = silhouette_score(X_scaled, clusters)
    silhouette_scores.append(score)
```

## 时间序列方法

### 平稳性检验
**适用场景**：检验时间序列是否平稳
**Python实现**：
```python
from statsmodels.tsa.stattools import adfuller

# ADF检验
result = adfuller(df['series'])
print(f'ADF统计量: {result[0]}')
print(f'p值: {result[1]}')  # p<0.05拒绝原假设，序列平稳
```

### ARIMA模型
**适用场景**：时间序列预测
**Python实现**：
```python
from statsmodels.tsa.arima.model import ARIMA

# ARIMA(p,d,q)
model = ARIMA(df['series'], order=(1, 1, 1))
results = model.fit()
print(results.summary())

# 预测
forecast = results.forecast(steps=12)
```

## 机器学习方法

### 决策树
**适用场景**：分类和回归、可解释性强
**Python实现**：
```python
from sklearn.tree import DecisionTreeClassifier, DecisionTreeRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, mean_squared_error

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=42)

# 分类
clf = DecisionTreeClassifier(max_depth=3, random_state=42)
clf.fit(X_train, y_train)
y_pred = clf.predict(X_test)
print(f'准确率: {accuracy_score(y_test, y_pred)}')

# 回归
reg = DecisionTreeRegressor(max_depth=3, random_state=42)
reg.fit(X_train, y_train)
y_pred = reg.predict(X_test)
print(f'MSE: {mean_squared_error(y_test, y_pred)}')
```

### 随机森林
**适用场景**：提高决策树性能、降低过拟合风险
**Python实现**：
```python
from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor

# 分类
rf_clf = RandomForestClassifier(n_estimators=100, random_state=42)
rf_clf.fit(X_train, y_train)
y_pred = rf_clf.predict(X_test)

# 特征重要性
print(f'特征重要性: {rf_clf.feature_importances_}')
```

### 支持向量机（SVM）
**适用场景**：分类、回归，适合小样本高维数据
**Python实现**：
```python
from sklearn.svm import SVC, SVR

# 分类
svm_clf = SVC(kernel='rbf', C=1.0, random_state=42)
svm_clf.fit(X_train, y_train)
y_pred = svm_clf.predict(X_test)

# 回归
svm_reg = SVR(kernel='rbf', C=1.0)
svm_reg.fit(X_train, y_train)
y_pred = svm_reg.predict(X_test)
```

## 因果推断方法

### 双重差分（DID）
**适用场景**：评估政策效应，需要处理组和对照组
**Python实现**：
```python
import statsmodels.formula.api as smf

# DID模型
model = smf.ols('y ~ treat * post + controls', data=df).fit()
print(model.summary())

# 交互系数为DID估计量
```

### 倾向得分匹配（PSM）
**适用场景**：减少选择偏差，构建反事实
**Python实现**：
```python
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import NearestNeighbors

# 计算倾向得分
lr = LogisticRegression()
lr.fit(df[['x1', 'x2', 'x3']], df['treat'])
df['propensity'] = lr.predict_proba(df[['x1', 'x2', 'x3']])[:, 1]

# 匹配
treated = df[df['treat'] == 1]
control = df[df['treat'] == 0]
nn = NearestNeighbors(n_neighbors=1)
nn.fit(control[['propensity']])
distances, indices = nn.kneighbors(treated[['propensity']])
```

### 工具变量法（IV）
**适用场景**：解决内生性问题
**Python实现**：
```python
import linearmodels.iv as iv

# 2SLS
model_iv = iv.IV2SLS(df['y'], sm.add_constant(df[['x1']]), df['x2'], df['z']).fit()
print(model_iv.summary)
```

## 模型评估与稳健性检验

### 模型拟合度评估
```python
from sklearn.metrics import r2_score, mean_squared_error, mean_absolute_error

# R²
r2 = r2_score(y_true, y_pred)

# RMSE
rmse = np.sqrt(mean_squared_error(y_true, y_pred))

# MAE
mae = mean_absolute_error(y_true, y_pred)
```

### 稳健性检验方法
1. **替换变量**：使用不同的变量衡量同一概念
2. **改变样本**：删除极端值或改变时间范围
3. **不同方法**：使用不同的估计方法
4. **交互效应**：加入交互项检验异质性

## 方法选择决策树

```
开始
  │
  ├─ 数据类型？
  │   ├─ 横截面数据
  │   │   ├─ 因变量类型？
  │   │   │   ├─ 连续变量 → 线性回归
  │   │   │   ├─ 二分类变量 → Logistic回归
  │   │   │   └─ 多分类变量 → 多项Logit/判别分析
  │   │   └─ 是否需要降维/综合评价？→ 因子分析/PCA
  │   ├─ 时间序列数据
  │   │   ├─ 是否平稳？→ ARIMA
  │   │   └─ 非平稳 → 差分后ARIMA/协整分析
  │   └─ 面板数据
  │       ├─ 豪斯曼检验
  │       │   ├─ 拒绝原假设 → 固定效应模型
  │       │   └─ 不拒绝 → 随机效应模型
  │
  └─ 研究目的？
      ├─ 描述现状 → 描述统计
      ├─ 分析影响因素 → 回归分析
      ├─ 预测 → 时间序列/机器学习
      ├─ 因果推断 → DID/PSM/IV
      └─ 降维/综合评价 → 因子分析/PCA
```

## 常见问题

Q1：如何判断模型是否合适？
A1：检查R²、F检验、t检验的显著性，验证模型假设（残差正态性、同方差性、无多重共线性）。

Q2：多重共线性如何处理？
A2：计算VIF（方差膨胀因子），VIF>10表示存在严重共线性，可使用逐步回归、岭回归、主成分回归等方法。

Q3：样本量要求多少？
A3：回归分析建议样本量≥30，因子分析建议样本量≥变量数的5倍，面板数据建议时间长度≥3。

Q4：如何选择机器学习模型？
A4：根据数据特征和研究目标选择，分类用决策树/SVM/随机森林，回归用线性回归/随机森林/神经网络。

Q5：是否必须进行稳健性检验？
A5：建议进行，至少包含一种稳健性检验，以提高结果的可信度。
