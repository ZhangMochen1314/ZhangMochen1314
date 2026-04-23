# 数据格式规范

## 概述

DeepTrace Data Collector 支持多种数据格式的输入输出，并提供统一的格式转换功能。

## 支持的格式

| 格式 | 扩展名 | 适用场景 | 特点 |
|------|--------|----------|------|
| CSV | .csv | 通用数据交换 | 简单、通用 |
| Stata DTA | .dta | Stata统计分析 | 支持变量标签、值标签 |
| Excel | .xlsx | Excel分析 | 支持多工作表、格式化 |
| JSON | .json | Web应用 | 轻量级、易解析 |

## 格式规范

### CSV格式

#### 文件编码

- **默认编码**：UTF-8 with BOM
- **备选编码**：GBK（兼容性需求）

#### 字段分隔符

- **默认分隔符**：逗号（`,`）
- **备选分隔符**：制表符（`\t`）

#### 行终止符

- **Windows**：`\r\n`
- **Unix/Linux**：`\n`

#### 第一行

- 必须包含列名
- 列名使用英文字母、数字、下划线
- 列名不包含中文（中文标签通过Stata变量标签实现）

#### 缺失值

- **表示方式**：空字符串（``）
- **备选方式**：`NA`、`NaN`

#### 示例

```csv
year,city,gdp,pop,urbanization_rate
2020,北京,36102.6,2189,86.2
2020,上海,38700.6,2487,89.3
2020,深圳,27670.2,1756,99.7
```

### Stata DTA格式

#### 版本

- **推荐版本**：Stata 14/15/16
- **兼容版本**：Stata 12及以上

#### 变量命名

- **格式**：小写字母 + 下划线
- **长度**：不超过32个字符
- **示例**：`gdp`, `total_assets`, `urbanization_rate`

#### 变量标签

- **格式**：中文标签
- **示例**：`label variable gdp "地区生产总值（亿元）"`

#### 值标签

- **用途**：分类变量（如行业、地区）
- **示例**：
  ```
  label define industry 1 "制造业" 2 "服务业" 3 "农业"
  label values industry industry
  ```

#### 缺失值

- **数值变量**：Stata缺失值（`.`、`.a`、`.b`等）
- **字符串变量**：空字符串（`""`）

#### 示例

```stata
* 变量定义
clear all
set obs 3
gen year = 2020
gen city = ""
gen gdp = .
gen pop = .
gen urbanization_rate = .

* 赋值
replace city = "北京" in 1
replace city = "上海" in 2
replace city = "深圳" in 3

replace gdp = 36102.6 in 1
replace gdp = 38700.6 in 2
replace gdp = 27670.2 in 3

replace pop = 2189 in 1
replace pop = 2487 in 2
replace pop = 1756 in 3

replace urbanization_rate = 86.2 in 1
replace urbanization_rate = 89.3 in 2
replace urbanization_rate = 99.7 in 3

* 变量标签
label variable year "年份"
label variable city "城市名称"
label variable gdp "地区生产总值（亿元）"
label variable pop "人口（万人）"
label variable urbanization_rate "城镇化率（%）"
```

### Excel格式

#### 工作表

- **单工作表**：默认工作表名称为"Data"
- **多工作表**：每个工作表代表一个数据集

#### 第一行

- 必须包含列名
- 列名使用中文（可选）

#### 数据类型

- **数值型**：Excel数值格式
- **日期型**：Excel日期格式
- **文本型**：Excel文本格式

#### 缺失值

- **数值型**：空单元格
- **文本型**：空单元格

#### 示例

| 年份 | 城市 | GDP（亿元） | 人口（万人） | 城镇化率（%） |
|------|------|-------------|-------------|---------------|
| 2020 | 北京 | 36102.6 | 2189 | 86.2 |
| 2020 | 上海 | 38700.6 | 2487 | 89.3 |
| 2020 | 深圳 | 27670.2 | 1756 | 99.7 |

### JSON格式

#### 结构

- **根节点**：数组（`[]`）
- **元素**：对象（`{}`）

#### 字段类型

- **字符串**：双引号（`"`）
- **数值**：整数或浮点数
- **布尔值**：`true`/`false`
- **空值**：`null`

#### 缺失值

- **所有类型**：`null`

#### 示例

```json
[
  {
    "year": 2020,
    "city": "北京",
    "gdp": 36102.6,
    "pop": 2189,
    "urbanization_rate": 86.2
  },
  {
    "year": 2020,
    "city": "上海",
    "gdp": 38700.6,
    "pop": 2487,
    "urbanization_rate": 89.3
  },
  {
    "year": 2020,
    "city": "深圳",
    "gdp": 27670.2,
    "pop": 1756,
    "urbanization_rate": 99.7
  }
]
```

## 字段命名规范

### 基本原则

1. **变量名**：小写字母 + 下划线
2. **中文标签**：使用中文，包含单位
3. **一致性**：相同概念使用相同命名

### 常见字段命名

| 字段名 | 英文标签 | 中文标签 | 数据类型 |
|--------|----------|----------|----------|
| year | year | 年份 | Int |
| city | city | 城市名称 | String |
| province | province | 省份名称 | String |
| gdp | gdp | 地区生产总值 | Float |
| pop | population | 人口 | Float |
| urbanization_rate | urbanization_rate | 城镇化率 | Float |
| roe | roe | 净资产收益率 | Float |
| lev | leverage | 资产负债率 | Float |
| eps | eps | 每股收益 | Float |

### 命名示例

#### 经济指标

- `gdp`: 地区生产总值
- `gdp_per_capita`: 人均GDP
- `gdp_growth`: GDP增长率
- `fiscal_revenue`: 财政收入
- `fiscal_expenditure`: 财政支出

#### 人口指标

- `population`: 总人口
- `urban_population`: 城镇人口
- `urbanization_rate`: 城镇化率
- `population_density`: 人口密度

#### 企业指标

- `total_assets`: 总资产
- `total_revenue`: 营业收入
- `net_profit`: 净利润
- `roe`: 净资产收益率
- `lev`: 资产负债率

## 数据类型规范

### 数值型

#### 整数（Int）

- **用途**：年份、代码、计数
- **示例**：2020, 10001, 1000

#### 浮点数（Float）

- **用途**：金额、比率、指数
- **精度**：保留2-4位小数
- **示例**：36102.6, 12.56, 0.8562

### 字符串（String）

- **用途**：名称、代码、描述
- **编码**：UTF-8
- **示例**："北京", "000001", "制造业"

### 日期（Date）

- **格式**：YYYY-MM-DD
- **示例**：2020-12-31

### 布尔值（Boolean）

- **值**：0/1 或 true/false
- **用途**：是否标识、二分类变量
- **示例**：1（是），0（否）

## 缺失值处理规范

### 缺失值表示

| 格式 | 缺失值表示 |
|------|-----------|
| CSV | 空字符串 |
| DTA | Stata缺失值（`.`） |
| Excel | 空单元格 |
| JSON | `null` |

### 缺失值处理策略

1. **保留缺失值**：不填充，保持原始缺失状态
2. **标注缺失**：在数据说明文档中说明缺失率
3. **特殊处理**：对于特定研究，可进行插值填充

## 格式转换

### CSV转DTA

```bash
python scripts/data_converter.py \
  --input data.csv \
  --output data.dta \
  --format stata \
  --encoding utf-8
```

### DTA转CSV

```bash
python scripts/data_converter.py \
  --input data.dta \
  --output data.csv \
  --format csv
```

### Excel转CSV

```bash
python scripts/data_converter.py \
  --input data.xlsx \
  --output data.csv \
  --format csv
```

### CSV转JSON

```bash
python scripts/data_converter.py \
  --input data.csv \
  --output data.json \
  --format json
```

## 批量转换

### 转换目录中的所有文件

```bash
python scripts/data_converter.py \
  --input-dir ./raw_data \
  --output-dir ./processed_data \
  --format stata
```

### 转换特定类型的文件

```bash
# 转换所有CSV文件
for file in raw_data/*.csv; do
  python scripts/data_converter.py \
    --input "$file" \
    --output "processed_data/$(basename $file .csv).dta" \
    --format stata
done
```

## 验证规则

### CSV验证

- ✅ 第一行包含列名
- ✅ 每行列数相同
- ✅ 数值字段可以转换为浮点数
- ✅ 日期字段符合YYYY-MM-DD格式

### DTA验证

- ✅ 文件可以被Stata读取
- ✅ 变量名符合规范
- ✅ 变量标签存在（推荐）

### Excel验证

- ✅ 第一行包含列名
- ✅ 没有合并单元格
- ✅ 数值格式正确

### JSON验证

- ✅ 符合JSON语法
- ✅ 所有对象字段一致
- ✅ 数据类型正确
