---
name: deeptrace-datacollector
description: DeepTrace数据搜集技能：从外部数据源（CSMAR、Wind、统计局等）搜集实证分析所需数据，支持宏观经济、金融、企业等多类型数据获取
dependency:
  python:
    - pandas>=1.5.0
    - requests>=2.28.0
    - openpyxl>=3.0.0
    - statsmodels>=0.13.0
  system:
    - mkdir -p logs
---

# DeepTrace Data Collector

## 概述

DeepTrace Data Collector 是专为实证研究设计的数据搜集技能，支持从多种外部数据源获取标准化、高质量的数据，适用于宏观经济、金融、企业等多类型研究需求。

### 核心能力

- **多数据源接入**：支持 CSMAR、Wind、国家统计局、恒生 API 等多种数据源
- **标准化接口**：提供统一的数据下载和处理接口
- **数据格式转换**：支持 CSV、DTA、XLSX 等多种格式转换
- **精准数据提取**：只输出用户需要的数据和变量
- **错误处理**：完善的异常捕获和日志记录机制

## 适用场景

当用户需要以下数据时使用此技能：
- "获取上市公司的财务指标数据"
- "下载地级市面板数据"
- "查询宏观经济指标"
- "获取企业微观控制变量"
- "从 Wind 导入特定数据"
- "从 CSMAR 获取研究数据"
- "收集统计局公开数据"
- "数据格式转换（CSV转DTA等）"

## 数据源概览

| 数据源 | 数据类型 | 访问方式 | 主要内容 |
|--------|----------|----------|----------|
| CSMAR | 企业/金融 | API/客户端 | 上市公司财务、交易、公司治理 |
| Wind | 多维数据 | API/客户端 | 宏观、行业、企业、债券 |
| 国家统计局 | 宏观经济 | 公开接口 | GDP、CPI、PMI等宏观数据 |
| 恒生API | 股票数据 | API | 财务指标、行情、股东、高管 |
| 地级市面板 | 城市数据 | 本地 | 300个城市325个变量（2000-2024） |
| 省级面板 | 省份数据 | 本地 | 31个省份（1990-2024） |
| 县域面板 | 县域数据 | 本地 | 2708个县区（2000-2023） |
| 企业地理位置 | 企业特征 | 本地 | 上市公司行业和地区分布 |
| 微观控制变量 | 企业数据 | 本地 | 企业微观特征变量 |

## 操作流程

### 流程A：标准化数据获取

#### 步骤1：识别数据需求

分析用户请求，识别：
1. **数据源类型**：CSMAR、Wind、统计局、恒生API、本地数据集
2. **数据类型**：宏观经济、金融、企业、面板数据
3. **数据范围**：时间范围、地区范围、样本范围
4. **具体变量**：用户明确指定的变量或指标类型
5. **输出格式**：CSV、DTA、XLSX

#### 步骤2：选择数据源

根据需求选择最佳数据源：

| 需求 | 推荐数据源 | 优先级 |
|------|-----------|--------|
| 上市公司财务数据 | CSMAR > Wind > 恒生API | 1 |
| 实时行情数据 | 恒生API > Wind | 2 |
| 宏观经济指标 | 国家统计局 > Wind | 1 |
| 城市面板数据 | 本地地级市面板 | 1 |
| 省份面板数据 | 本地省级面板 | 1 |
| 县域面板数据 | 本地区域面板 | 1 |

#### 步骤3：调用标准化接口

使用 scripts/ 下的标准化接口获取数据：

```bash
# 示例：从恒生API获取财务数据
python scripts/data_fetcher.py --source hengsheng --type financial --code 000001

# 示例：获取地级市面板数据
python scripts/data_fetcher.py --source local --type city_panel --vars gdp,pop --years 2010-2020

# 示例：格式转换
python scripts/data_converter.py --input data.csv --output data.dta --format stata
```

#### 步骤4：数据验证和质量检查

执行数据验证：
- 检查缺失值
- 验证数据范围
- 确认数据格式
- 生成质量报告

#### 步骤5：精准输出

只输出用户需要的数据和变量（详见【精准输出原则】）

---

### 流程B：本地数据集查询

#### 步骤1：识别本地数据集需求

用户需要以下数据时使用本地数据集：
- 省级面板数据（1990-2024年）
- 地级市面板数据（2000-2024年，325个变量）
- 县域面板数据（2000-2023年）
- 企业地理位置特征数据
- 微观企业控制变量

#### 步骤2：查阅数据说明

读取对应数据说明文档：
- 省级面板：`references/data_sources.md` - 省级面板数据
- 地级市面板：`references/data_sources.md` - 地级市面板数据
- 县域面板：`references/data_sources.md` - 县域面板数据
- 企业地理位置：`references/data_sources.md` - 企业地理位置特征
- 微观控制变量：`references/data_sources.md` - 微观企业控制变量

#### 步骤3：提取精准数据

**强制原则：只输出用户需要的数据**

分析用户需求，提取：
- **需要的变量**：用户明确指定的变量
- **需要的样本**：用户指定的时间、地区、企业
- **需要的格式**：CSV、DTA、XLSX

示例代码：

```python
import pandas as pd

# 读取完整数据
df = pd.read_csv('assets/city_panel/city_panel_processed.csv')

# 用户需求：北京、上海、深圳 2015-2020年 GDP和人口
selected_vars = ['year', 'city', 'gdp', 'pop']
selected_cities = ['北京', '上海', '深圳']
selected_years = range(2015, 2021)

# 筛选数据
df_filtered = df[
    df['city'].isin(selected_cities) &
    df['year'].isin(selected_years)
][selected_vars]

# 保存
df_filtered.to_csv('city_data_filtered.csv', index=False)
```

#### 步骤4：输出简洁结果

**输出内容**：
1. 数据文件（只包含用户需要的变量和样本）
2. 简要说明（覆盖范围、变量列表、观测数）

**禁止输出**：
- ❌ 完整数据集
- ❌ 未请求的变量
- ❌ 未请求的样本
- ❌ 所有辅助文档

---

## 精准输出原则

### 核心原则

**只输出用户需要的数据和文件**

### 执行规范

1. **变量选择**
   - 用户明确指定变量 → 提取指定变量
   - 用户未指定变量 → 询问用户或推荐核心变量

2. **样本筛选**
   - 用户指定时间范围 → 筛选指定年份
   - 用户指定地区范围 → 筛选指定地区
   - 用户指定企业范围 → 筛选指定企业

3. **输出格式**
   - 数据文件：只包含用户需要的变量和样本
   - 简要说明：覆盖范围、变量列表、观测数量

### 禁止行为

- ❌ 直接输出完整数据集
- ❌ 包含未请求的变量列
- ❌ 包含未请求的样本行
- ❌ 打包所有辅助文档（缺失值说明、变量清单等）

### 示例对比

**错误示例**（违反精准输出原则）：
- 用户："需要北京的GDP数据"
- 错误输出：完整的地级市面板数据集（300城市 × 25年 × 325变量）

**正确示例**（遵循精准输出原则）：
- 用户："需要北京的GDP数据"
- 输出：北京2000-2024年GDP数据（仅25条，包含year, city, gdp变量）
- 或询问："您需要北京哪几年的GDP数据？是否需要其他相关变量？"

---

## 数据格式转换

### 支持的格式

| 格式 | 扩展名 | 适用场景 | 转换命令 |
|------|--------|----------|----------|
| CSV | .csv | 通用数据交换 | `python scripts/data_converter.py --input file.csv --output file.dta --format stata` |
| Stata DTA | .dta | Stata统计分析 | `python scripts/data_converter.py --input file.csv --output file.dta --format stata` |
| Excel | .xlsx | Excel分析 | `python scripts/data_converter.py --input file.csv --output file.xlsx --format excel` |
| JSON | .json | Web应用 | `python scripts/data_converter.py --input file.csv --output file.json --format json` |

### 转换示例

```bash
# CSV转DTA
python scripts/data_converter.py \
  --input data.csv \
  --output data.dta \
  --format stata \
  --encoding utf-8

# Excel转CSV
python scripts/data_converter.py \
  --input data.xlsx \
  --output data.csv \
  --format csv

# 批量转换
python scripts/data_converter.py \
  --input-dir ./raw_data \
  --output-dir ./processed_data \
  --format stata
```

---

## 错误处理和日志记录

### 错误处理策略

1. **数据源连接失败**
   - 记录错误日志
   - 提供备用数据源建议
   - 返回用户友好的错误信息

2. **数据获取失败**
   - 记录详细错误信息
   - 提供数据范围和格式建议
   - 建议检查数据源权限

3. **格式转换失败**
   - 记录转换错误
   - 提供格式规范参考
   - 建议检查输入数据

### 日志记录

所有操作都会记录到 `logs/` 目录：

```bash
# 查看日志
tail -f logs/data_fetcher.log
tail -f logs/data_converter.log

# 日志级别
- DEBUG: 详细调试信息
- INFO: 一般操作信息
- WARNING: 警告信息
- ERROR: 错误信息
```

### 日志格式

```
[2024-01-15 10:30:45] [INFO] [data_fetcher.py:123] Starting data fetch from hengsheng
[2024-01-15 10:30:46] [INFO] [data_fetcher.py:145] Successfully fetched 4 quarters of data
[2024-01-15 10:30:47] [INFO] [data_fetcher.py:167] Data saved to /output/data.csv
```

---

## 典型使用场景

### 场景1：从恒生API获取上市公司财务数据

**用户请求**：
"获取平安银行(000001)近4个季度的ROE和资产负债率"

**处理流程**：
1. 识别数据源：恒生API
2. 识别变量：ROE、资产负债率
3. 调用接口：`hscp/cwzb`（财务指标接口）
4. 筛选数据：平安银行、近4季度、指定变量
5. 输出格式：CSV

**输出**：
- `pingan_bank_financial.csv`（仅包含 stock_code, report_date, roe, lev）

---

### 场景2：获取地级市面板特定数据

**用户请求**：
"需要北京、上海、深圳2015-2020年的GDP和人口数据"

**处理流程**：
1. 识别数据源：本地地级市面板数据
2. 识别变量：gdp, pop
3. 识别样本：北京、上海、深圳，2015-2020年
4. 提取数据：从完整数据集中筛选
5. 输出格式：CSV

**输出**：
- `city_data_filtered.csv`（18条数据：3城市 × 6年）
- 简要说明

---

### 场景3：数据格式转换

**用户请求**：
"将CSV文件转换为Stata DTA格式"

**处理流程**：
1. 识别需求：格式转换
2. 调用转换接口
3. 执行转换
4. 返回转换后的文件

**输出**：
- `data.dta`（Stata格式）
- 转换日志

---

### 场景4：获取CSMAR数据

**用户请求**：
"从CSMAR获取2010-2020年所有上市公司的总资产数据"

**处理流程**：
1. 识别数据源：CSMAR
2. 识别变量：总资产
3. 识别样本：2010-2020年、所有上市公司
4. 调用CSMAR接口或客户端
5. 数据提取和处理
6. 输出格式：DTA

**输出**：
- `csmar_assets.dta`（包含所有上市公司总资产数据）
- 数据说明文档

---

### 场景5：获取宏观经济指标

**用户请求**：
"获取2010-2024年中国的GDP和CPI数据"

**处理流程**：
1. 识别数据源：国家统计局
2. 识别变量：GDP、CPI
3. 识别样本：2010-2024年、中国
4. 调用统计局公开接口
5. 数据提取和处理
6. 输出格式：CSV

**输出**：
- `macro_indicators.csv`（包含年份、GDP、CPI）
- 数据说明

---

## 资源索引

### 脚本

- [scripts/data_fetcher.py](scripts/data_fetcher.py)
  - 用途：标准化数据获取接口
  - 支持数据源：CSMAR、Wind、恒生API、国家统计局、本地数据集

- [scripts/data_converter.py](scripts/data_converter.py)
  - 用途：数据格式转换
  - 支持格式：CSV、DTA、XLSX、JSON

- [scripts/data_validator.py](scripts/data_validator.py)
  - 用途：数据验证和质量检查
  - 检查项：缺失值、数据范围、格式验证

### 参考文档

- [references/data_sources.md](references/data_sources.md)
  - 用途：数据源详细说明
  - 何时读取：查询数据源详细信息时

- [references/api_standards.md](references/api_standards.md)
  - 用途：API接口标准文档
  - 何时读取：调用外部API时

- [references/data_formats.md](references/data_formats.md)
  - 用途：数据格式规范
  - 何时读取：进行数据格式转换时

- [references/variables_index.md](references/variables_index.md)
  - 用途：变量索引和含义
  - 何时读取：查询变量定义时

- [references/data_examples.md](references/data_examples.md)
  - 用途：数据示例和使用案例
  - 何时读取：参考数据处理方法时

### 数据资产

#### 宏观面板数据

- [assets/province_panel/](assets/province_panel/)
  - 用途：省级面板数据
  - 覆盖：31个省份，1990-2024年
  - 格式：CSV

- [assets/city_panel/](assets/city_panel/)
  - 用途：地级市面板数据
  - 覆盖：300个城市，2000-2024年
  - 变量：325个
  - 格式：CSV

- [assets/county_panel/](assets/county_panel/)
  - 用途：县域面板数据
  - 覆盖：2708个县区，2000-2023年
  - 变量：91个
  - 格式：XLSX

#### 企业数据

- [assets/firm_location/](assets/firm_location/)
  - 用途：企业地理位置特征
  - 覆盖：沪深北三市A股上市公司
  - 格式：DTA

- [assets/firm_controls/](assets/firm_controls/)
  - 用途：微观企业控制变量
  - 覆盖：A股上市公司
  - 格式：CSV

---

## 注意事项

1. **精准输出原则**（强制）：只输出用户需要的数据和文件
2. **数据源优先级**：根据数据类型选择最佳数据源
3. **格式规范**：统一使用UTF-8编码，遵循命名规范
4. **错误处理**：完善的异常捕获和日志记录
5. **数据验证**：获取数据后必须进行质量检查
6. **API限制**：注意各数据源的API调用限制和权限
7. **数据更新**：定期检查数据更新频率和版本
8. **引用规范**：使用数据时需注明数据来源
9. **安全原则**：凭证信息通过环境变量传递，不暴露在代码中

---

## 版本历史

- v2.0 (2024-01-15)：重构为DeepTrace系列，支持多数据源，添加标准化接口
- v1.0 (2025-04-12)：基于恒生数据查询技能创建
