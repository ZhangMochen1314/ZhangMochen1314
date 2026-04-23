# API接口标准

## 概述

DeepTrace Data Collector 提供标准化的API接口，支持从多种数据源获取数据。所有接口遵循统一的规范。

## 接口规范

### 基本原则

1. **RESTful风格**：使用REST风格的API设计
2. **统一返回格式**：所有接口返回统一的JSON格式
3. **错误处理**：完善的错误码和错误信息
4. **日志记录**：所有调用都记录日志
5. **权限控制**：支持API密钥认证

### 请求格式

#### HTTP方法

| 方法 | 用途 | 说明 |
|------|------|------|
| GET | 获取数据 | 查询数据 |
| POST | 提交请求 | 复杂查询、批量操作 |

#### 请求头

```
Content-Type: application/json
Authorization: Bearer {api_key}
```

#### 请求参数

```json
{
  "source": "csmar",
  "data_type": "financial",
  "params": {
    "stock_code": "000001",
    "start_date": "2020-01-01",
    "end_date": "2024-12-31",
    "fields": ["roe", "lev", "eps"]
  }
}
```

### 响应格式

#### 成功响应

```json
{
  "status": "success",
  "data": [
    {
      "stock_code": "000001",
      "report_date": "2024-09-30",
      "roe": 12.5,
      "lev": 45.2,
      "eps": 1.23
    }
  ],
  "metadata": {
    "total_rows": 4,
    "columns": 4,
    "source": "csmar",
    "fetched_at": "2024-01-15T10:30:00Z"
  }
}
```

#### 错误响应

```json
{
  "status": "error",
  "error_code": "API_1001",
  "error_message": "Invalid stock code format",
  "details": {
    "field": "stock_code",
    "value": "invalid_code"
  }
}
```

## 错误码

### 通用错误码

| 错误码 | 说明 | HTTP状态码 |
|--------|------|-----------|
| API_0000 | 成功 | 200 |
| API_1001 | 参数错误 | 400 |
| API_1002 | 缺少必需参数 | 400 |
| API_1003 | 参数格式错误 | 400 |
| API_2001 | 未授权 | 401 |
| API_2002 | API密钥无效 | 401 |
| API_2003 | 权限不足 | 403 |
| API_3001 | 数据源不可用 | 503 |
| API_3002 | 数据获取超时 | 504 |
| API_3003 | 数据不存在 | 404 |
| API_4001 | 服务器内部错误 | 500 |

### 数据源特定错误码

#### CSMAR

| 错误码 | 说明 |
|--------|------|
| CSMAR_0001 | CSMAR连接失败 |
| CSMAR_0002 | CSMAR查询失败 |
| CSMAR_0003 | 股票代码不存在 |

#### Wind

| 错误码 | 说明 |
|--------|------|
| WIND_0001 | Wind连接失败 |
| WIND_0002 | Wind查询失败 |
| WIND_0003 | 数据权限不足 |

#### 恒生API

| 错误码 | 说明 |
|--------|------|
| HS_0001 | 恒生API连接失败 |
| HS_0002 | 许可证无效 |
| HS_0003 | 接口调用超限 |

## 数据源接口

### CSMAR接口

#### 财务数据

**接口路径**：`/api/csmar/financial`

**请求参数**：
- `stock_code`（必需）：股票代码
- `start_date`（可选）：开始日期
- `end_date`（可选）：结束日期
- `fields`（可选）：字段列表

**示例**：
```bash
GET /api/csmar/financial?stock_code=000001&start_date=2020-01-01&fields=roe,lev
```

#### 股票行情

**接口路径**：`/api/csmar/market`

**请求参数**：
- `stock_code`（必需）：股票代码
- `start_date`（可选）：开始日期
- `end_date`（可选）：结束日期

**示例**：
```bash
GET /api/csmar/market?stock_code=000001&start_date=2020-01-01
```

### Wind接口

#### 股票数据

**接口路径**：`/api/wind/stock`

**请求参数**：
- `stock_code`（必需）：股票代码（Wind格式）
- `fields`（可选）：字段列表
- `start_date`（可选）：开始日期
- `end_date`（可选）：结束日期

**示例**：
```bash
GET /api/wind/stock?stock_code=000001.SZ&fields=open,high,low,close,volume
```

#### 宏观数据

**接口路径**：`/api/wind/macro`

**请求参数**：
- `indicator`（必需）：指标代码
- `start_date`（可选）：开始日期
- `end_date`（可选）：结束日期

**示例**：
```bash
GET /api/wind/macro?indicator=M0017133&start_date=2020-01-01
```

### 国家统计局接口

#### GDP数据

**接口路径**：`/api/stats/gdp`

**请求参数**：
- `region`（可选）：地区代码（全国默认为"CN"）
- `frequency`（可选）：频率（year/quarter/month，默认为year）
- `start_date`（可选）：开始日期
- `end_date`（可选）：结束日期

**示例**：
```bash
GET /api/stats/gdp?frequency=quarter&start_date=2020-01-01
```

#### CPI数据

**接口路径**：`/api/stats/cpi`

**请求参数**：
- `region`（可选）：地区代码
- `frequency`（可选）：频率（month/year，默认为month）
- `start_date`（可选）：开始日期
- `end_date`（可选）：结束日期

**示例**：
```bash
GET /api/stats/cpi?frequency=month&start_date=2020-01-01
```

### 恒生API接口

#### 财务指标

**接口路径**：`/api/hengsheng/financial`

**请求参数**：
- `stock_code`（必需）：股票代码
- `fields`（可选）：字段列表

**示例**：
```bash
GET /api/hengsheng/financial?stock_code=000001&fields=roe,lev,eps
```

#### 实时行情

**接口路径**：`/api/hengsheng/quote`

**请求参数**：
- `stock_code`（必需）：股票代码

**示例**：
```bash
GET /api/hengsheng/quote?stock_code=000001
```

### 本地数据接口

#### 地级市面板数据

**接口路径**：`/api/local/city_panel`

**请求参数**：
- `cities`（可选）：城市列表（逗号分隔）
- `years`（可选）：年份范围（如2010-2020）
- `vars`（可选）：变量列表（逗号分隔）

**示例**：
```bash
GET /api/local/city_panel?cities=北京,上海,深圳&years=2015-2020&vars=gdp,pop
```

#### 省级面板数据

**接口路径**：`/api/local/province_panel`

**请求参数**：
- `provinces`（可选）：省份列表（逗号分隔）
- `years`（可选）：年份范围（如2010-2020）
- `vars`（可选）：变量列表（逗号分隔）

**示例**：
```bash
GET /api/local/province_panel?provinces=北京,上海&years=2010-2020
```

## 字段规范

### 财务数据字段

| 字段名 | 英文标签 | 中文标签 | 数据类型 | 单位 |
|--------|----------|----------|----------|------|
| stock_code | 股票代码 | Stock Code | String | - |
| report_date | 报告期 | Report Date | Date | YYYY-MM-DD |
| roe | 净资产收益率 | ROE | Float | % |
| lev | 资产负债率 | Leverage | Float | % |
| eps | 每股收益 | EPS | Float | 元 |
| total_assets | 总资产 | Total Assets | Float | 亿元 |
| total_revenue | 营业收入 | Total Revenue | Float | 亿元 |

### 宏观数据字段

| 字段名 | 英文标签 | 中文标签 | 数据类型 | 单位 |
|--------|----------|----------|----------|------|
| year | 年份 | Year | Int | - |
| gdp | 国内生产总值 | GDP | Float | 亿元 |
| gdp_growth | GDP增长率 | GDP Growth | Float | % |
| cpi | 居民消费价格指数 | CPI | Float | - |
| pmi | 制造业PMI | PMI | Float | - |

### 城市面板字段

| 字段名 | 英文标签 | 中文标签 | 数据类型 | 单位 |
|--------|----------|----------|----------|------|
| year | 年份 | Year | Int | - |
| city | 城市名称 | City | String | - |
| city_code | 城市代码 | City Code | Int | - |
| gdp | GDP | GDP | Float | 亿元 |
| pop | 人口 | Population | Float | 万人 |
| urbanization_rate | 城镇化率 | Urbanization Rate | Float | % |

## 限流规则

### 全局限流

- 每分钟最多：100次请求
- 每小时最多：1000次请求
- 每天最多：10000次请求

### 数据源限流

| 数据源 | 每分钟限制 | 每小时限制 |
|--------|-----------|-----------|
| CSMAR | 20次 | 200次 |
| Wind | 30次 | 300次 |
| 国家统计局 | 10次 | 100次 |
| 恒生API | 20次 | 200次 |
| 本地数据 | 无限制 | 无限制 |

### 限流响应

当触发限流时，返回以下响应：

```json
{
  "status": "error",
  "error_code": "API_4002",
  "error_message": "Rate limit exceeded",
  "details": {
    "limit": 100,
    "window": "1 minute",
    "retry_after": 30
  }
}
```

## 安全规范

### API密钥

- API密钥通过HTTP Header传递
- 格式：`Authorization: Bearer {api_key}`
- 密钥有效期：365天

### 数据加密

- 所有API通信使用HTTPS
- 敏感数据（如许可证）不记录在日志中

### 访问控制

- 每个API密钥有特定的访问权限
- 超出权限的请求将被拒绝
