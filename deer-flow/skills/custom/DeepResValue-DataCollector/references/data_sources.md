# 数据源说明

## 目录

- [概述](#概述)
- [CSMAR](#csmar)
- [Wind](#wind)
- [国家统计局](#国家统计局)
- [恒生API](#恒生api)
- [本地数据集](#本地数据集)

---

## 概述

DeepTrace Data Collector 支持从多种外部数据源获取数据，包括：

| 数据源 | 数据类型 | 访问方式 | 实时性 | 主要用途 |
|--------|----------|----------|--------|----------|
| CSMAR | 企业/金融 | API/客户端 | T+1 | 学术研究、实证分析 |
| Wind | 多维数据 | API/客户端 | 实时 | 金融分析、宏观研究 |
| 国家统计局 | 宏观经济 | 公开接口 | 滞后 | 宏观经济研究 |
| 恒生API | 股票数据 | API | 实时 | 股票财务、行情 |
| 本地数据集 | 面板/企业 | 本地文件 | - | 快速访问历史数据 |

---

## CSMAR

### 数据源简介

CSMAR（China Stock Market & Accounting Research）是中国领先的学术数据库，提供高质量的金融和经济数据。

### 数据类型

- **上市公司财务数据**：资产负债表、利润表、现金流量表
- **股票交易数据**：日度行情、交易量、换手率
- **公司治理数据**：股权结构、董事会特征、高管薪酬
- **宏观数据**：宏观经济指标、行业数据
- **企业社会责任数据**：ESG评分、社会责任报告

### 访问方式

#### 方式1：API调用
```python
from scripts.data_fetcher import DataFetcher

fetcher = DataFetcher()
df = fetcher.fetch(
    source='csmar',
    data_type='financial',
    stock_code='000001',
    start_date='2020-01-01',
    end_date='2024-12-31'
)
```

#### 方式2：客户端导出
- 使用CSMAR客户端
- 选择数据模块
- 设置查询条件
- 导出为CSV/Excel

### 数据范围

- **时间范围**：1990年至今
- **覆盖范围**：沪深北三市A股、港股、美股
- **更新频率**：T+1（财务数据）、实时（行情数据）

### 注意事项

- 需要CSMAR账号和许可
- API调用有频率限制
- 某些数据需要额外购买

---

## Wind

### 数据源简介

Wind（万得）是中国领先的金融数据服务提供商，提供全面的金融和经济数据。

### 数据类型

- **股票数据**：实时行情、财务数据、技术指标
- **债券数据**：国债、企业债、可转债
- **基金数据**：开放式基金、封闭式基金
- **宏观数据**：宏观经济指标、行业数据
- **期货数据**：商品期货、金融期货

### 访问方式

#### 方式1：API调用
```python
from scripts.data_fetcher import DataFetcher

fetcher = DataFetcher()
df = fetcher.fetch(
    source='wind',
    data_type='stock',
    stock_code='000001.SZ',
    fields='open,high,low,close,volume',
    start_date='2020-01-01',
    end_date='2024-12-31'
)
```

#### 方式2：Wind终端
- 使用Wind终端
- 输入代码查询
- 导出数据

### 数据范围

- **时间范围**：1990年至今
- **覆盖范围**：全球市场
- **更新频率**：实时

### 注意事项

- 需要Wind账号和许可
- 实时数据需要额外许可
- API调用有限制

---

## 国家统计局

### 数据源简介

国家统计局（NBS）是中国政府官方统计机构，提供权威的宏观经济数据。

### 数据类型

- **国民经济核算**：GDP、GNI
- **价格指数**：CPI、PPI
- **就业数据**：失业率、就业人数
- **工业数据**：工业增加值、PMI
- **消费数据**：社会消费品零售总额
- **投资数据**：固定资产投资

### 访问方式

#### 方式1：公开API
```python
from scripts.data_fetcher import DataFetcher

fetcher = DataFetcher()
df = fetcher.fetch(
    source='stats',
    data_type='gdp',
    start_date='2010-01-01',
    end_date='2024-12-31'
)
```

#### 方式2：官方网站
- 访问国家统计局网站
- 选择数据类型
- 下载或复制数据

### 数据范围

- **时间范围**：1952年至今（部分数据）
- **覆盖范围**：全国及各省市区
- **更新频率**：月度、季度、年度

### 注意事项

- 部分数据可能滞后
- 历史数据可能修订
- 某些细分数据不公开

---

## 恒生API

### 数据源简介

恒生API提供沪深股票的实时和历史数据，包括财务指标、行情、股东等信息。

### 数据类型

- **财务指标**：盈利能力、偿债能力、营运能力
- **行情数据**：实时报价、K线数据
- **公司信息**：基本信息、公司简介
- **股东数据**：十大股东、股权结构
- **高管数据**：高管信息、薪酬

### 接口列表

| 接口模块 | 接口示例 | 用途 |
|----------|----------|------|
| 上市公司详情 | `hscp/cwzb` | 财务指标 |
| 上市公司详情 | `hscp/sdgd` | 十大股东 |
| 实时交易 | `hsgp/ssjy` | 实时行情 |
| 行情数据 | `hsstock/history` | 历史K线 |
| 技术指标 | `hstech/macd` | MACD指标 |

### 访问方式

```python
from scripts.data_fetcher import DataFetcher

fetcher = DataFetcher()
df = fetcher.fetch(
    source='hengsheng',
    data_type='financial',
    stock_code='000001',
    fields='roe,lev,eps'
)
```

### 数据范围

- **时间范围**：2000年至今
- **覆盖范围**：沪深A股
- **更新频率**：实时

### 注意事项

- 需要恒生API许可证
- 许可证通过环境变量配置
- API调用有频率限制

---

## 本地数据集

### 地级市面板数据

**数据位置**：`assets/city_panel/city_panel_processed.csv`

**覆盖范围**：全国300个地级市

**时间范围**：2000-2024年

**变量数量**：325个

**变量分类**：
- 标识变量（5个）：年份、城市、代码、省份、是否直辖市
- 经济指标（65个）：GDP、财政、金融、贸易
- 人口指标（15个）：总人口、城镇人口、城镇化率
- 创新指标（12个）：专利申请、授权、创新指数
- 教育指标（20个）：学校、教师、学生
- 医疗卫生（15个）：医院、医生、床位数
- 环境指标（20个）：空气质量、排放
- 其他指标（163个）

**访问方式**：
```python
from scripts.data_fetcher import DataFetcher

fetcher = DataFetcher()
df = fetcher.fetch(
    source='local',
    data_type='city_panel',
    cities='北京,上海,深圳',
    years='2015-2020',
    vars='gdp,pop,urbanization_rate'
)
```

### 省级面板数据

**数据位置**：`assets/province_panel/province_panel_processed.csv`

**覆盖范围**：31个省份

**时间范围**：1990-2024年

**变量数量**：约80个

**变量分类**：
- 标识变量：年份、省份、地区
- 经济指标：GDP、财政收入、固定资产投资
- 人口指标：总人口、城镇化率
- 其他指标：教育、医疗、科技

**访问方式**：
```python
from scripts.data_fetcher import DataFetcher

fetcher = DataFetcher()
df = fetcher.fetch(
    source='local',
    data_type='province_panel',
    provinces='北京,上海,广东',
    years='2000-2020'
)
```

### 县域面板数据

**数据位置**：`assets/county_panel/县域面板数据_2000-2023.xlsx`

**覆盖范围**：全国2708个县区

**时间范围**：2000-2023年

**变量数量**：91个

**变量分类**：
- 标识变量：年份、省份、城市、区县
- 数字金融（10个）：数字普惠金融指数及子指数
- 地理与行政区划：土地面积、乡镇、街道
- 人口统计：户数、总人口、户籍人口
- 就业统计：从业人员、产业分布
- 经济发展：GDP、人均GDP、收入
- 财政金融：财政收支、税收、存贷款
- 农业生产：播种面积、耕地、产量
- 教育医疗：学校、教师、学生、医院、医师

**访问方式**：
```python
from scripts.data_fetcher import DataFetcher

fetcher = DataFetcher()
df = fetcher.fetch(
    source='local',
    data_type='county_panel',
    provinces='浙江,江苏',
    years='2020-2023'
)
```

### 企业地理位置特征数据

**数据位置**：`assets/firm_location/行业与所属省份城市.dta`

**覆盖范围**：沪深北三市A股上市公司

**变量数量**：约10个

**变量内容**：
- 股票代码
- 股票简称
- 行业分类（申万一级/二级/三级）
- 所属省份
- 所属城市
- 所属县区
- 企业地址

**访问方式**：
```python
from scripts.data_fetcher import DataFetcher

fetcher = DataFetcher()
df = fetcher.fetch(
    source='local',
    data_type='firm_location',
    stock_code='000001'
)
```

### 微观企业控制变量

**数据位置**：`assets/firm_controls/firm_control_variables.csv`

**覆盖范围**：A股上市公司

**变量数量**：约50个

**变量分类**：
- 企业规模：总资产、营业收入、员工数
- 盈利能力：ROA、ROE、净利润率
- 偿债能力：资产负债率、流动比率
- 营运能力：总资产周转率、存货周转率
- 成长能力：营业收入增长率、净利润增长率
- 公司治理：董事会规模、独立董事比例

**访问方式**：
```python
from scripts.data_fetcher import DataFetcher

fetcher = DataFetcher()
df = fetcher.fetch(
    source='local',
    data_type='firm_controls',
    stock_code='000001'
)
```

---

## 数据源选择建议

### 根据研究需求选择

| 研究需求 | 推荐数据源 | 优先级 |
|----------|-----------|--------|
| 上市公司财务数据 | CSMAR > Wind > 恒生API | CSMAR |
| 实时行情数据 | 恒生API > Wind | 恒生API |
| 宏观经济指标 | 国家统计局 > Wind | 国家统计局 |
| 城市面板数据 | 本地地级市面板 | 本地 |
| 省份面板数据 | 本地省级面板 | 本地 |
| 县域面板数据 | 本地区域面板 | 本地 |
| 行业数据 | Wind > CSMAR | Wind |
| 债券数据 | Wind | Wind |

### 根据数据类型选择

| 数据类型 | 推荐数据源 | 说明 |
|----------|-----------|------|
| 横截面数据 | CSMAR、Wind | 适合截面回归 |
| 时间序列数据 | 国家统计局、Wind | 适合时间序列分析 |
| 面板数据 | 本地面板数据 | 适合固定效应/随机效应 |
| 实时数据 | 恒生API、Wind | 适合高频分析 |

---

## 数据质量说明

### 数据源可靠性

| 数据源 | 可靠性 | 更新频率 | 数据完整性 |
|--------|--------|----------|------------|
| CSMAR | 高 | T+1 | 完整 |
| Wind | 高 | 实时 | 完整 |
| 国家统计局 | 高 | 月/季/年 | 较完整 |
| 恒生API | 高 | 实时 | 完整 |
| 本地面板数据 | 中 | 不更新 | 较完整 |

### 数据缺失处理

- **CSMAR/Wind**：缺失值较少，一般有标注
- **国家统计局**：早期数据可能缺失
- **本地面板数据**：已进行缺失值处理，详见各数据说明文档

### 数据修订

- 宏观数据可能存在修订
- 财务数据可能存在重述
- 使用时请以最新版本为准
