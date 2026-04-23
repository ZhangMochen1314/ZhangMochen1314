# DeepTrace Data Collector

## 概述

DeepTrace Data Collector 是专为实证研究设计的数据搜集技能，支持从多种外部数据源获取标准化、高质量的数据。

## 主要特性

- **多数据源支持**：CSMAR、Wind、国家统计局、恒生API等
- **标准化接口**：统一的数据获取和处理接口
- **格式转换**：支持CSV、DTA、XLSX、JSON等格式
- **精准输出**：只输出用户需要的数据和变量
- **错误处理**：完善的异常捕获和日志记录

## 数据源

| 数据源 | 数据类型 | 更新频率 |
|--------|----------|----------|
| CSMAR | 企业/金融 | T+1 |
| Wind | 多维数据 | 实时 |
| 国家统计局 | 宏观经济 | 月/季/年 |
| 恒生API | 股票数据 | 实时 |
| 地级市面板 | 城市数据 | 固定 |
| 省级面板 | 省份数据 | 固定 |
| 县域面板 | 县域数据 | 固定 |

## 快速开始

### 获取地级市面板数据

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

df.to_csv('city_data.csv', index=False)
```

### 格式转换

```bash
python scripts/data_converter.py \
  --input data.csv \
  --output data.dta \
  --format stata
```

### 数据验证

```bash
python scripts/data_validator.py \
  --input data.csv \
  --output validation_result.json
```

## 文档结构

```
deeptrace-datacollector/
├── SKILL.md                      # 技能主文档
├── scripts/                      # 脚本目录
│   ├── __init__.py              # 包初始化
│   ├── logger.py                # 日志记录
│   ├── data_fetcher.py          # 数据获取
│   ├── data_converter.py        # 格式转换
│   └── data_validator.py        # 数据验证
├── references/                   # 参考文档
│   ├── data_sources.md          # 数据源说明
│   ├── api_standards.md         # API标准
│   ├── data_formats.md          # 数据格式规范
│   ├── variables_index.md       # 变量索引
│   └── data_examples.md         # 数据示例
├── assets/                       # 数据资产
│   ├── city_panel/              # 地级市面板
│   ├── province_panel/          # 省级面板
│   ├── county_panel/            # 县域面板
│   ├── firm_location/           # 企业地理位置
│   └── firm_controls/           # 微观控制变量
└── logs/                         # 日志目录
    ├── data_fetcher.log
    ├── data_converter.log
    └── data_validator.log
```

## 版本历史

- v2.0 (2024-01-15)：重构为DeepTrace系列，支持多数据源
- v1.0 (2025-04-12)：基于恒生数据查询技能创建

## 许可证

DeepTrace Data Collector

## 联系方式

DeepTrace Team
