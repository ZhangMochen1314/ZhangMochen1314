---
name: deeptrace-datacollector
description: Use this skill to query and extract specific subsets of data from local or cloud-mounted large-scale academic datasets (e.g., 500MB+ firm micro-data, province panel data). It uses DuckDB to efficiently query large Parquet/CSV files without OOM issues. Outputs results as CSV/Parquet and provides a Markdown summary.
dependency:
  python:
    - duckdb>=0.9.0
    - pyyaml>=6.0
    - pandas>=1.5.0
---

# DeepTrace Data Collector

## Overview
This skill allows users to query large-scale academic datasets (like firm-level micro data or macroeconomic panels) conversationally. The underlying engine uses **DuckDB** to query Parquet/CSV files stored on the server's disk or object storage, ensuring lightning-fast performance and negligible memory consumption even for 500MB+ datasets.

## Available Datasets
The list of available datasets and their columns is defined in `references/data_manifest.yaml`. 
Always check this file to map the user's natural language request (e.g., "return on assets") to the actual database column (e.g., `roa`).

- `firm_micro_data`: A-share listed companies data (stkcd, year, roa, roe, rd_expense, etc.)
- `province_macro_data`: Provincial panel data (gdp, population, cpi, etc.)

## Workflow

### 1. Understand User Request
- Identify the target **dataset** (e.g., `firm_micro_data`).
- Identify the required **columns** (e.g., `stkcd`, `year`, `roa`, `rd_expense`).
- Identify the **filter conditions** (e.g., year between 2015 and 2020).

### 2. Execute Query
Run the DuckDB query script to extract the data.

```bash
python /workspace/deer-flow/skills/public/deeptrace-datacollector/scripts/data_fetcher.py \
  --dataset firm_micro_data \
  --select "stkcd, year, roa, rd_expense" \
  --where "year >= 2015 AND year <= 2020" \
  --output "/workspace/user_requested_data.csv"
```
*(You can also set `--output /workspace/xxx.parquet` if the user wants a Parquet file).*

### 3. Deliver Results
The script will output a JSON summary of the execution (e.g., rows exported, output file path). 
**You MUST reply to the user using Markdown.** Do NOT use HTML.
Provide a clean summary containing:
- The dataset queried
- The filters applied
- The columns extracted
- The total number of rows found
- A direct file path (or download link instruction) for the exported `.csv` or `.parquet`.

Example:
```markdown
# 数据提取完成

已为您从**企业微观数据库**中提取了所需数据。

- **筛选条件**: 2015年至2020年
- **提取变量**: 股票代码 (stkcd), 年份 (year), 总资产收益率 (roa), 研发支出 (rd_expense)
- **数据量**: 共计 15,230 条记录
- **下载路径**: `/workspace/user_requested_data.csv`
```
