# 恒生数据API模块化总结

## 概述
恒生数据API提供沪深基础数据的全面接口，涵盖股票列表、指数行业概念、涨跌股池、上市公司详情、实时交易、行情数据、技术指标等多个模块。所有接口均需使用许可证（licence）进行认证，返回标准JSON格式数据。

**基础URL**: `https://api.mairuiapi.com/`
**许可证格式**: 替换接口URL中的"您的licence"为实际许可证（示例：C841AA1C-5254-4A61-8D67-784345430241）

## 模块目录
1. [股票列表](#股票列表)
2. [指数、行业、概念](#指数行业概念)
3. [涨跌股池](#涨跌股池)
4. [上市公司详情](#上市公司详情)
5. [实时交易](#实时交易)
6. [行情数据](#行情数据)
7. [技术指标](#技术指标)

---

## 股票列表

### 1. 股票列表
**接口**: `https://api.mairuiapi.com/hslt/list/您的licence`  
**说明**: 获取基础的股票代码和名称，用于后续接口的参数传入。  
**数据更新**: 每日16:20  
**请求频率**: 1分钟300次 | 包月版、体验版1分钟1千次 | 包年版1分钟3千次 | 钻石版1分钟6千次  

| 字段名称 | 数据类型 | 字段说明 |
|----------|----------|----------|
| dm | string | 股票代码，如：000001 |
| mc | string | 股票名称，如：平安银行 |
| jys | string | 交易所，"sh"表示上证，"sz"表示深证 |

### 2. 新股日历
**接口**: `https://api.mairuiapi.com/hslt/new/您的licence`  
**说明**: 新股日历，按申购日期倒序。  
**数据更新**: 每日17:00  
**请求频率**: 1分钟300次 | 包月版、体验版1分钟1千次 | 包年版1分钟3千次 | 钻石版1分钟6千次  

| 字段名称 | 数据类型 | 字段说明 |
|----------|----------|----------|
| zqdm | string | 股票代码 |
| zqjc | string | 股票简称 |
| sgdm | string | 申购代码 |
| fxsl | number | 发行总数（股） |
| swfxsl | number | 网上发行（股） |
| sgsx | number | 申购上限（股） |
| dgsz | number | 顶格申购需配市值(元) |
| sgrq | string | 申购日期 |
| fxjg | number | 发行价格（元），null为"未知" |
| zxj | number | 最新价（元），null为"未知" |
| srspj | number | 首日收盘价（元），null为"未知" |
| zqgbrq | string | 中签号公布日，null为未知 |
| zqjkrq | string | 中签缴款日，null为未知 |
| ssrq | string | 上市日期，null为未知 |
| syl | number | 发行市盈率，null为"未知" |
| hysyl | number | 行业市盈率 |
| wszql | number | 中签率（%），null为"未知" |
| yzbsl | number | 连续一字板数量，null为"未知" |
| zf | number | 涨幅（%），null为"未知" |
| yqhl | number | 每中一签获利（元），null为"未知" |
| zyyw | string | 主营业务 |

### 3. 概念指数列表（券商数据）
**接口**: `https://api.mairuiapi.com/hslt/sectorslist/您的licence`  
**说明**: 获取基础的概念指数代码和名称，用于后续接口的参数传入。  
**数据更新**: 每日16:20  
**请求频率**: 1分钟300次 | 包月版、体验版1分钟1千次 | 包年版1分钟3千次 | 钻石版1分钟6千次  

| 字段名称 | 数据类型 | 字段说明 |
|----------|----------|----------|
| dm | string | 概念指数代码，如：101076.BKZS |
| mc | string | 概念指数名称，如：GN玻璃 |
| jys | string | 交易所 |

### 4. 一级市场板块列表（券商数据）
**接口**: `https://api.mairuiapi.com/hslt/primarylist/您的licence`  
**说明**: 获取基础的一级市场板块名称，用于后续接口的参数传入。  
**数据更新**: 每日16:20  
**请求频率**: 1分钟300次 | 包月版、体验版1分钟1千次 | 包年版1分钟3千次 | 钻石版1分钟6千次  

| 字段名称 | 数据类型 | 字段说明 |
|----------|----------|----------|
| mc | string | 一级市场名称，如：1000SW1基础化工 |

### 5. 板块明细列表（券商数据）
**接口**: `https://api.mairuiapi.com/hslt/sectors/板块指数名称（例如：概念指数）/您的licence`  
**说明**: 依据《一级市场板块列表》获取的一级市场板块名称，获取对应的板块列表。  
**数据更新**: 每日16:20  
**请求频率**: 1分钟300次 | 包月版、体验版1分钟1千次 | 包年版1分钟3千次 | 钻石版1分钟6千次  

| 字段名称 | 数据类型 | 字段说明 |
|----------|----------|----------|
| dm | string | 板块代码，如：101076.BKZS |
| mc | string | 板块名称，如：GN玻璃 |
| jys | string | 交易所 |

---

## 指数、行业、概念

### 1. 指数、行业、概念树
**接口**: `https://api.mairuiapi.com/hszg/list/您的licence`  
**说明**: 获取指数、行业、概念（包括基金，债券，美股，外汇，期货，黄金等的代码），其中isleaf为1（叶子节点）的记录的code（代码）可以作为下方接口的参数传入，从而得到某个指数、行业、概念下的相关股票。  
**数据更新**: 每周六03:05  
**请求频率**: 1分钟300次 | 包月版、体验版1分钟1千次 | 包年版1分钟3千次 | 钻石版1分钟6千次  

| 字段名称 | 数据类型 | 字段说明 |
|----------|----------|----------|
| name | string | 名称 |
| code | string | 代码 |
| type1 | number | 一级分类（0:A股,1:创业板,2:科创板,3:基金,4:香港股市,5:债券,6:美国股市,7:外汇,8:期货,9:黄金,10:英国股市） |
| type2 | number | 二级分类（0:A股-申万行业,1:A股-申万二级,2:A股-热门概念,3:A股-概念板块,4:A股-地域板块,5:A股-证监会行业,6:A股-分类,7:A股-指数成分,8:A股-风险警示,9:A股-大盘指数,10:A股-次新股,11:A股-沪港通,12:A股-深港通,13:基金-封闭式基金,14:基金-开放式基金,15:基金-货币型基金,16:基金-ETF基金净值,17:基金-ETF基金行情,18:基金-LOF基金行情,21:基金-科创板基金,22:香港股市-恒生行业,23:香港股市-全部港股,24:香港股市-热门港股,25:香港股市-蓝筹股,26:香港股市-红筹股,27:香港股市-国企股,28:香港股市-创业板,29:香港股市-指数,30:香港股市-A+H,31:香港股市-窝轮,32:香港股市-ADR,33:香港股市-沪港通,34:香港股市-深港通,35:香港股市-中华系列指数,36:债券-沪深债券,37:债券-深市债券,38:债券-沪市债券,39:债券-沪深可转债,40:美国股市-中国概念股,41:美国股市-科技类,42:美国股市-金融类,43:美国股市-制造零售类,44:美国股市-汽车能源类,45:美国股市-媒体类,46:美国股市-医药食品类,48:外汇-基本汇率,49:外汇-热门汇率,50:外汇-所有汇率,51:外汇-交叉盘汇率,52:外汇-美元相关汇率,53:外汇-人民币相关汇率,54:期货-全球期货,55:期货-中国金融期货交易所,56:期货-上海期货交易所,57:期货-大连商品交易所,58:期货-郑州商品交易所,59:黄金-黄金现货,60:黄金-黄金期货） |
| level | number | 层级，从0开始，根节点为0，二级节点为1，以此类推 |
| pcode | string | 父节点代码 |
| pname | string | 父节点名称 |
| isleaf | number | 是否为叶子节点，0：否，1：是 |

### 2. 根据指数、行业、概念找相关股票
**接口**: `https://api.mairuiapi.com/hszg/gg/指数、行业、概念代码/您的licence`  
**说明**: 根据"指数、行业、概念树"接口得到的代码作为参数，得到相关的股票。  
**数据更新**: 每周六11:00  
**请求频率**: 1分钟300次 | 包月版、体验版1分钟1千次 | 包年版1分钟3千次 | 钻石版1分钟6千次  

| 字段名称 | 数据类型 | 字段说明 |
|----------|----------|----------|
| dm | string | 代码（根据接口参数可能是A股股票代码，也可能是其他指数、行业、概念的股票代码） |
| mc | string | 名称（根据接口参数可能是A股股票代码，也可能是其他指数、行业、概念的股票名称） |
| jys | string | 交易所，"sh"表示上证，"sz"表示深证（如果返回的是A股的股票，那么有值，否则是null） |

### 3. 根据股票找相关指数、行业、概念
**接口**: `https://api.mairuiapi.com/hszg/zg/股票代码(如000001)/您的licence`  
**说明**: 根据《股票列表》得到的股票代码作为参数，得到相关的指数、行业、概念。  
**数据更新**: 每周六11:00  
**请求频率**: 1分钟300次 | 包月版、体验版1分钟1千次 | 包年版1分钟3千次 | 钻石版1分钟6千次  

| 字段名称 | 数据类型 | 字段说明 |
|----------|----------|----------|
| code | string | 指数、行业、概念代码，如：sw2_650300 |
| name | string | 指数、行业、概念名称，如：沪深股市-申万二级-国防军工-地面兵装 |

---

## 涨跌股池

### 1. 涨停股池
**接口**: `https://api.mairuiapi.com/hslt/ztgc/日期(如2020-01-15)/您的licence`  
**说明**: 根据日期（格式yyyy-MM-dd，从2019-11-28开始到现在的每个交易日）作为参数，得到每天的涨停股票列表，根据封板时间升序。  
**数据更新**: 交易时间段每10分钟  
**请求频率**: 1分钟300次 | 包月版、体验版1分钟1千次 | 包年版1分钟3千次 | 钻石版1分钟6千次  

| 字段名称 | 数据类型 | 字段说明 |
|----------|----------|----------|
| dm | string | 代码 |
| mc | string | 名称 |
| p | number | 价格（元） |
| zf | number | 涨幅（%） |
| cje | number | 成交额（元） |
| lt | number | 流通市值（元） |
| zsz | number | 总市值（元） |
| hs | number | 换手率（%） |
| lbc | number | 连板数 |
| fbt | string | 首次封板时间（HH:mm:ss） |
| lbt | string | 最后封板时间（HH:mm:ss） |
| zj | number | 封板资金（元） |
| zbc | number | 炸板次数 |
| tj | string | 涨停统计（x天/y板） |
| hy | string | 所属行业 |

### 2. 跌停股池
**接口**: `https://api.mairuiapi.com/hslt/dtgc/日期(如2020-01-15)/您的licence`  
**说明**: 根据日期（格式yyyy-MM-dd，从2019-11-28开始到现在的每个交易日）作为参数，得到每天的跌停股票列表，根据封单资金升序。  
**数据更新**: 交易时间段每10分钟  
**请求频率**: 1分钟300次 | 包月版、体验版1分钟1千次 | 包年版1分钟3千次 | 钻石版1分钟6千次  

| 字段名称 | 数据类型 | 字段说明 |
|----------|----------|----------|
| dm | string | 代码 |
| mc | string | 名称 |
| p | number | 价格（元） |
| zf | number | 跌幅（%） |
| cje | number | 成交额（元） |
| lt | number | 流通市值（元） |
| zsz | number | 总市值（元） |
| pe | number | 动态市盈率 |
| hs | number | 换手率（%） |
| lbc | number | 连续跌停次数 |
| lbt | string | 最后封板时间（HH:mm:ss） |
| zj | number | 封单资金（元） |
| fba | number | 板上成交额（元） |
| zbc | number | 开板次数 |

### 3. 强势股池
**接口**: `https://api.mairuiapi.com/hslt/qsgc/日期(如2020-01-15)/您的licence`  
**说明**: 根据日期（格式yyyy-MM-dd，从2019-11-28开始到现在的每个交易日）作为参数，得到每天的强势股票列表，根据涨幅倒序。  
**数据更新**: 交易时间段每10分钟  
**请求频率**: 1分钟300次 | 包月版、体验版1分钟1千次 | 包年版1分钟3千次 | 钻石版1分钟6千次  

| 字段名称 | 数据类型 | 字段说明 |
|----------|----------|----------|
| dm | string | 代码 |
| mc | string | 名称 |
| p | number | 价格（元） |
| ztp | number | 涨停价（元） |
| zf | number | 涨幅（%） |
| cje | number | 成交额（元） |
| lt | number | 流通市值（元） |
| zsz | number | 总市值（元） |
| zs | number | 涨速（%） |
| nh | number | 是否新高（0：否，1：是） |
| lb | number | 量比 |
| hs | number | 换手率（%） |
| tj | string | 涨停统计（x天/y板） |

### 4. 次新股池
**接口**: `https://api.mairuiapi.com/hslt/cxgc/日期(如2020-01-15)/您的licence`  
**说明**: 根据日期（格式yyyy-MM-dd，从2019-11-28开始到现在的每个交易日）作为参数，得到每天的次新股票列表，根据开板几日升序。  
**数据更新**: 交易时间段每10分钟  
**请求频率**: 1分钟300次 | 包月版、体验版1分钟1千次 | 包年版1分钟3千次 | 钻石版1分钟6千次  

| 字段名称 | 数据类型 | 字段说明 |
|----------|----------|----------|
| dm | string | 代码 |
| mc | string | 名称 |
| p | number | 价格（元） |
| ztp | number | 涨停价（元，无涨停价为null） |
| zf | number | 涨跌幅（%） |
| cje | number | 成交额（元） |
| lt | number | 流通市值（元） |
| zsz | number | 总市值（元） |
| nh | number | 是否新高（0：否，1：是） |
| hs | number | 转手率（%） |
| tj | string | 涨停统计（x天/y板） |
| kb | number | 开板几日 |
| od | string | 开板日期（yyyyMMdd） |
| ipod | string | 上市日期（yyyyMMdd） |

### 5. 炸板股池
**接口**: `https://api.mairuiapi.com/hslt/zbgc/日期(如2020-01-15)/您的licence`  
**说明**: 根据日期（格式yyyy-MM-dd，从2019-11-28开始到现在的每个交易日）作为参数，得到每天的炸板股票列表，根据首次封板时间升序。  
**数据更新**: 交易时间段每10分钟  
**请求频率**: 1分钟300次 | 包月版、体验版1分钟1千次 | 包年版1分钟3千次 | 钻石版1分钟6千次  

| 字段名称 | 数据类型 | 字段说明 |
|----------|----------|----------|
| dm | string | 代码 |
| mc | string | 名称 |
| p | number | 价格（元） |
| ztp | number | 涨停价（元） |
| zf | number | 涨跌幅（%） |
| cje | number | 成交额（元） |
| lt | number | 流通市值（元） |
| zsz | number | 总市值（元） |
| zs | number | 涨速（%） |
| hs | number | 转手率（%） |
| tj | string | 涨停统计（x天/y板） |
| fbt | string | 首次封板时间（HH:mm:ss） |
| zbc | number | 炸板次数 |

---

## 上市公司详情

### 1. 公司简介
**接口**: `https://api.mairuiapi.com/hscp/gsjj/股票代码(如000001)/您的licence`  
**说明**: 根据《股票列表》得到的股票代码获取上市公司的简介。包括公司基本信息，概念以及发行信息等。  
**数据更新**: 每日03:30  
**请求频率**: 1分钟300次 | 包月版、体验版1分钟1千次 | 包年版1分钟3千次 | 钻石版1分钟6千次  

| 字段名称 | 数据类型 | 字段说明 |
|----------|----------|----------|
| name | string | 公司名称 |
| ename | string | 公司英文名称 |
| market | string | 上市市场 |
| idea | string | 概念及板块，多个概念由英文逗号分隔 |
| ldate | string | 上市日期，格式yyyy-MM-dd |
| sprice | string | 发行价格（元） |
| principal | string | 主承销商 |
| rdate | string | 成立日期 |
| rprice | string | 注册资本 |
| instype | string | 机构类型 |
| organ | string | 组织形式 |
| secre | string | 董事会秘书 |
| phone | string | 公司电话 |
| sphone | string | 董秘电话 |
| fax | string | 公司传真 |
| sfax | string | 董秘传真 |
| email | string | 公司电子邮箱 |
| semail | string | 董秘电子邮箱 |
| site | string | 公司网站 |
| post | string | 邮政编码 |
| infosite | string | 信息披露网址 |
| oname | string | 证券简称更名历史 |
| addr | string | 注册地址 |
| oaddr | string | 办公地址 |
| desc | string | 公司简介 |
| bscope | string | 经营范围 |
| printype | string | 承销方式 |
| referrer | string | 上市推荐人 |
| putype | string | 发行方式 |
| pe | string | 发行市盈率（按发行后总股本） |
| firgu | string | 首发前总股本（万股） |
| lastgu | string | 首发后总股本（万股） |
| realgu | string | 实际发行量（万股） |
| planm | string | 预计募集资金（万元） |
| realm | string | 实际募集资金合计（万元） |
| pubfee | string | 发行费用总额（万元） |
| collect | string | 募集资金净额（万元） |
| signfee | string | 承销费用（万元） |
| pdate | string | 招股公告日 |

### 2. 所属指数
**接口**: `https://api.mairuiapi.com/hscp/sszs/股票代码(如000001)/您的licence`  
**说明**: 根据《股票列表》得到的股票代码获取上市公司的所属指数。  
**数据更新**: 每日03:30  
**请求频率**: 1分钟300次 | 包月版、体验版1分钟1千次 | 包年版1分钟3千次 | 钻石版1分钟6千次  

| 字段名称 | 数据类型 | 字段说明 |
|----------|----------|----------|
| mc | string | 指数名称 |
| dm | string | 指数代码 |
| ind | string | 进入日期yyyy-MM-dd |
| outd | string | 退出日期yyyy-MM-dd |

### 3. 历届高管成员
**接口**: `https://api.mairuiapi.com/hscp/ljgg/股票代码(如000001)/您的licence`  
**说明**: 根据《股票列表》得到的股票代码获取上市公司的历届高管成员名单。  
**数据更新**: 每日03:30  
**请求频率**: 1分钟300次 | 包月版、体验版1分钟1千次 | 包年版1分钟3千次 | 钻石版1分钟6千次  

| 字段名称 | 数据类型 | 字段说明 |
|----------|----------|----------|
| name | string | 姓名 |
| title | string | 职务 |
| sdate | string | 起始日期yyyy-MM-dd |
| edate | string | 终止日期yyyy-MM-dd |

### 4. 历届董事会成员
**接口**: `https://api.mairuiapi.com/hscp/ljds/股票代码(如000001)/您的licence`  
**说明**: 根据《股票列表》得到的股票代码获取上市公司的历届董事会成员名单。  
**数据更新**: 每日03:30  
**请求频率**: 1分钟300次 | 包月版、体验版1分钟1千次 | 包年版1分钟3千次 | 钻石版1分钟6千次  

| 字段名称 | 数据类型 | 字段说明 |
|----------|----------|----------|
| name | string | 姓名 |
| title | string | 职务 |
| sdate | string | 起始日期yyyy-MM-dd |
| edate | string | 终止日期yyyy-MM-dd |

### 5. 历届监事会成员
**接口**: `https://api.mairuiapi.com/hscp/ljjj/股票代码(如000001)/您的licence`  
**说明**: 根据《股票列表》得到的股票代码获取上市公司的历届监事会成员名单。  
**数据更新**: 每日03:30  
**请求频率**: 1分钟300次 | 包月版、体验版1分钟1千次 | 包年版1分钟3千次 | 钻石版1分钟6千次  

| 字段名称 | 数据类型 | 字段说明 |
|----------|----------|----------|
| name | string | 姓名 |
| title | string | 职务 |
| sdate | string | 起始日期yyyy-MM-dd |
| edate | string | 终止日期yyyy-MM-dd |

### 6. 近年分红
**接口**: `https://api.mairuiapi.com/hscp/jnfh/股票代码(如000001)/您的licence`  
**说明**: 根据《股票列表》得到的股票代码获取上市公司的近年来的分红实施结果。按公告日期倒序。  
**数据更新**: 每日03:30  
**请求频率**: 1分钟300次 | 包月版、体验版1分钟1千次 | 包年版1分钟3千次 | 钻石版1分钟6千次  

| 字段名称 | 数据类型 | 字段说明 |
|----------|----------|----------|
| sdate | string | 公告日期yyyy-MM-dd |
| give | string | 每10股送股(单位：股) |
| change | string | 每10股转增(单位：股) |
| send | string | 每10股派息(税前，单位：元) |
| line | string | 进度 |
| cdate | string | 除权除息日yyyy-MM-dd |
| edate | string | 股权登记日yyyy-MM-dd |
| hdate | string | 红股上市日yyyy-MM-dd |

### 7. 近年增发
**接口**: `https://api.mairuiapi.com/hscp/jnzf/股票代码(如000001)/您的licence`  
**说明**: 根据《股票列表》得到的股票代码获取上市公司的近年来的增发情况。按公告日期倒序。  
**数据更新**: 每日03:30  
**请求频率**: 1分钟300次 | 包月版、体验版1分钟1千次 | 包年版1分钟3千次 | 钻石版1分钟6千次  

| 字段名称 | 数据类型 | 字段说明 |
|----------|----------|----------|
| sdate | string | 公告日期yyyy-MM-dd |
| type | string | 发行方式 |
| price | string | 发行价格 |
| tprice | string | 实际公司募集资金总额 |
| fprice | string | 发行费用总额 |
| amount | string | 实际发行数量 |

### 8. 解禁限售
**接口**: `https://api.mairuiapi.com/hscp/jjxs/股票代码(如000001)/您的licence`  
**说明**: 根据《股票列表》得到的股票代码获取上市公司的解禁限售情况。按解禁日期倒序。  
**数据更新**: 每日03:30  
**请求频率**: 1分钟300次 | 包月版、体验版1分钟1千次 | 包年版1分钟3千次 | 钻石版1分钟6千次  

| 字段名称 | 数据类型 | 字段说明 |
|----------|----------|----------|
| rdate | string | 解禁日期yyyy-MM-dd |
| ramount | number | 解禁数量(万股) |
| rprice | number | 解禁股流通市值(亿元) |
| batch | number | 上市批次 |
| pdate | string | 公告日期yyyy-MM-dd |

### 9. 近一年各季度利润
**接口**: `https://api.mairuiapi.com/hscp/jdlr/股票代码(如000001)/您的licence`  
**说明**: 根据《股票列表》得到的股票代码获取上市公司近一年各个季度的利润。按截止日期倒序。  
**数据更新**: 每日03:30  
**请求频率**: 1分钟300次 | 包月版、体验版1分钟1千次 | 包年版1分钟3千次 | 钻石版1分钟6千次  

| 字段名称 | 数据类型 | 字段说明 |
|----------|----------|----------|
| date | string | 截止日期yyyy-MM-dd |
| income | string | 营业收入（万元） |
| expend | string | 营业支出（万元） |
| profit | string | 营业利润（万元） |
| totalp | string | 利润总额（万元） |
| reprofit | string | 净利润（万元） |
| basege | string | 基本每股收益(元/股) |
| ettege | string | 稀释每股收益(元/股) |
| otherp | string | 其他综合收益（万元） |
| totalcp | string | 综合收益总额（万元） |

### 10. 近一年各季度现金流
**接口**: `https://api.mairuiapi.com/hscp/jdxj/股票代码(如000001)/您的licence`  
**说明**: 根据《股票列表》得到的股票代码获取上市公司近一年各个季度的现金流。按截止日期倒序。  
**数据更新**: 每日03:30  
**请求频率**: 1分钟300次 | 包月版、体验版1分钟1千次 | 包年版1分钟3千次 | 钻石版1分钟6千次  

| 字段名称 | 数据类型 | 字段说明 |
|----------|----------|----------|
| date | string | 截止日期yyyy-MM-dd |
| jyin | string | 经营活动现金流入小计（万元） |
| jyout | string | 经营活动现金流出小计（万元） |
| jyfinal | string | 经营活动产生的现金流量净额（万元） |
| tzin | string | 投资活动现金流入小计（万元） |
| tzout | string | 投资活动现金流出小计（万元） |
| tzfinal | string | 投资活动产生的现金流量净额（万元） |
| czin | string | 筹资活动现金流入小计（万元） |
| czout | string | 筹资活动现金流出小计（万元） |
| czfinal | string | 筹资活动产生的现金流量净额（万元） |
| hl | string | 汇率变动对现金及现金等价物的影响（万元） |
| cashinc | string | 现金及现金等价物净增加额（万元） |
| cashs | string | 期初现金及现金等价物余额（万元） |
| cashe | string | 期末现金及现金等价物余额（万元） |

### 11. 近年业绩预告
**接口**: `https://api.mairuiapi.com/hscp/yjyg/股票代码(如000001)/您的licence`  
**说明**: 根据《股票列表》得到的股票代码获取上市公司近年来的业绩预告。按公告日期倒序。  
**数据更新**: 每日03:30  
**请求频率**: 1分钟300次 | 包月版、体验版1分钟1千次 | 包年版1分钟3千次 | 钻石版1分钟6千次  

| 字段名称 | 数据类型 | 字段说明 |
|----------|----------|----------|
| pdate | string | 公告日期yyyy-MM-dd |
| rdate | string | 报告期yyyy-MM-dd |
| type | string | 类型 |
| abs | string | 业绩预告摘要 |
| old | string | 上年同期每股收益(元) |

### 12. 财务指标
**接口**: `https://api.mairuiapi.com/hscp/cwzb/股票代码(如000001)/您的licence`  
**说明**: 根据《股票列表》得到的股票代码获取上市公司近四个季度的主要财务指标。按报告日期倒序。  
**数据更新**: 每日03:30  
**请求频率**: 1分钟300次 | 包月版、体验版1分钟1千次 | 包年版1分钟3千次 | 钻石版1分钟6千次  

| 字段名称 | 数据类型 | 字段说明 |
|----------|----------|----------|
| date | string | 报告日期yyyy-MM-dd |
| tbmg | string | 摊薄每股收益(元)d |
| jqmg | string | 加权每股收益(元)型 |
| mgsy | string | 每股收益_调整后(元) |
| kfmg | string | 扣除非经常性损益后的每股收益(元) |
| mgjz | string | 每股净资产_调整前(元) |
| mgjzad | string | 每股净资产_调整后(元) |
| mgjy | string | 每股经营性现金流(元) |
| mggjj | string | 每股资本公积金(元) |
| mgwly | string | 每股未分配利润(元) |
| zclr | string | 总资产利润率(%) |
| zylr | string | 主营业务利润率(%) |
| zzlr | string | 总资产净利润率(%) |
| cblr | string | 成本费用利润率(%) |
| yylr | string | 营业利润率(%) |
| zycb | string | 主营业务成本率(%) |
| xsjl | string | 销售净利率(%) |
| gbbc | string | 股本报酬率(%) |
| jzbc | string | 净资产报酬率(%) |
| zcbc | string | 资产报酬率(%) |
| xsml | string | 销售毛利率(%) |
| xxbz | string | 三项费用比重 |
| fzy | string | 非主营比重 |
| zybz | string | 主营利润比重 |
| gxff | string | 股息发放率(%) |
| tzsy | string | 投资收益率(%) |
| zyyw | string | 主营业务利润(元) |
| jzsy | string | 净资产收益率(%) |
| jqjz | string | 加权净资产收益率(%) |
| kflr | string | 扣除非经常性损益后的净利润(元) |
| zysr | string | 主营业务收入增长率(%) |
| jlzz | string | 净利润增长率(%) |
| jzzz | string | 净资产增长率(%) |
| zzzz | string | 总资产增长率(%) |
| yszz | string | 应收账款周转率(次) |
| yszzt | string | 应收账款周转天数(天) |
| chzz | string | 存货周转天数(天) |
| chzzl | string | 存货周转率(次) |
| gzzz | string | 固定资产周转率(次) |
| zzzzl | string | 总资产周转率(次) |
| zzzzt | string | 总资产周转天数(天) |
| ldzz | string | 流动资产周转率(次) |
| ldzzt | string | 流动资产周转天数(天) |
| gdzz | string | 股东权益周转率(次) |
| ldbl | string | 流动比率 |
| sdbl | string | 速动比率 |
| xjbl | string | 现金比率(%) |
| lxzf | string | 利息支付倍数 |
| zjbl | string | 长期债务与营运资金比率(%) |
| gdqy | string | 股东权益比率(%) |
| cqfz | string | 长期负债比率(%) |
| gdgd | string | 股东权益与固定资产比率(%) |
| fzqy | string | 负债与所有者权益比率(%) |
| zczjbl | string | 长期资产与长期资金比率(%) |
| zblv | string | 资本化比率(%) |
| gdzcjz | string | 固定资产净值率(%) |
| zbgdh | string | 资本固定化比率(%) |
| cqbl | string | 产权比率(%) |
| qxjzb | string | 清算价值比率(%) |
| gdzcbz | string | 固定资产比重(%) |
| zcfzl | string | 资产负债率(%) |
| zzc | string | 总资产(元) |
| jyxj | string | 经营现金净流量对销售收入比率(%) |
| zcjyxj | string | 资产的经营现金流量回报率(%) |
| jylrb | string | 经营现金净流量与净利润的比率(%) |
| jyfzl | string | 经营现金净流量对负债比率(%) |
| xjlbl | string | 现金流量比率(%) |
| dqgptz | string | 短期股票投资(元) |
| dqzctz | string | 短期债券投资(元) |
| dqjytz | string | 短期其它经营性投资(元) |
| qcgptz | string | 长期股票投资(元) |
| cqzqtz | string | 长期债券投资(元) |
| cqjyxtz | string | 长期其它经营性投资(元) |
| yszk1 | string | 1年以内应收帐款(元) |
| yszk12 | string | 1-2年以内应收帐款(元) |
| yszk23 | string | 2-3年以内应收帐款(元) |
| yszk3 | string | 3年以内应收帐款(元) |
| yfhk1 | string | 1年以内预付货款(元) |
| yfhk12 | string | 1-2年以内预付货款(元) |
| yfhk23 | string | 2-3年以内预付货款(元) |
| yfhk3 | string | 3年以内预付货款(元) |
| ysk1 | string | 1年以内其它应收款(元) |
| ysk12 | string | 1-2年以内其它应收款(元) |
| ysk23 | string | 2-3年以内其它应收款(元) |
| ysk3 | string | 3年以内其它应收款(元) |

### 13. 十大股东
**接口**: `https://api.mairuiapi.com/hscp/sdgd/股票代码(如000001)/您的licence`  
**说明**: 根据《股票列表》得到的股票代码获取上市公司的十大股东数据。按截止日期倒序。  
**数据更新**: 每日03:30  
**请求频率**: 1分钟300次 | 包月版、体验版1分钟1千次 | 包年版1分钟3千次 | 钻石版1分钟6千次  

| 字段名称 | 数据类型 | 字段说明 |
|----------|----------|----------|
| jzrq | string | 截止日期yyyy-MM-dd |
| ggrq | string | 公告日期yyyy-MM-dd |
| gdsm | string | 股东说明 |
| gdzs | number | 股东总数 |
| pjcg | number | 平均持股(单位：股，按总股本计算) |
| sdgd | array<ZygdSdgd> | 十大股东，其中ZygdSdgd对象见下方说明 |

### 14. 十大流通股东
**接口**: `https://api.mairuiapi.com/hscp/ltgd/股票代码(如000001)/您的licence`  
**说明**: 根据《股票列表》得到的股票代码获取上市公司的十大流通股东数据。按公告日期倒序。  
**数据更新**: 每日03:30  
**请求频率**: 1分钟300次 | 包月版、体验版1分钟1千次 | 包年版1分钟3千次 | 钻石版1分钟6千次  

| 字段名称 | 数据类型 | 字段说明 |
|----------|----------|----------|
| jzrq | string | 截止日期yyyy-MM-dd |
| ggrq | string | 公告日期yyyy-MM-dd |
| sdgd | array<ZygdSdgd> | 十大流通股东，其中ZygdSdgd对象见下方说明 |

### 15. 股东变化趋势
**接口**: `https://api.mairuiapi.com/hscp/gdbh/股票代码(如000001)/您的licence`  
**说明**: 根据《股票列表》得到的股票代码获取上市公司的股东变化趋势数据。按截止日期倒序。  
**数据更新**: 每日03:30  
**请求频率**: 1分钟300次 | 包月版、体验版1分钟1千次 | 包年版1分钟3千次 | 钻石版1分钟6千次  

| 字段名称 | 数据类型 | 字段说明 |
|----------|----------|----------|
| jzrq | string | 截止日期yyyy-MM-dd |
| gdhs | string | 股东户数 |
| bh | string | 比上期变化情况 |

### 16. 基金持股
**接口**: `https://api.mairuiapi.com/hscp/jjcg/股票代码(如000001)/您的licence`  
**说明**: 根据《股票列表》得到的股票代码获取该股票最近500家左右的基金持股情况。按截止日期倒序。  
**数据更新**: 每周六18:00  
**请求频率**: 1分钟300次 | 包月版、体验版1分钟1千次 | 包年版1分钟3千次 | 钻石版1分钟6千次  

| 字段名称 | 数据类型 | 字段说明 |
|----------|----------|----------|
| jzrq | string | 截止日期yyyy-MM-dd |
| jjmc | string | 基金名称 |
| jjdm | string | 基金代码 |
| ccsl | number | 持仓数量(股) |
| ltbl | number | 占流通股比例(%) |
| cgsz | number | 持股市值（元） |
| jzbl | number | 占净值比例（%） |

---

## 实时交易

### 1. 实时交易数据（网络数据源）
**接口**: `https://api.mairuiapi.com/hsrl/ssjy/股票代码(如000001)/您的licence`  
**说明**: 根据《股票列表》得到的股票代码获取实时交易数据（您可以理解为日线的最新数据），该接口为网络公开数据源，非券商数据源。  
**数据更新**: 交易时间段每1分钟  
**请求频率**: 1分钟300次 | 包月版、体验版1分钟1千次 | 包年版1分钟3千次 | 钻石版1分钟6千次  

| 字段名称 | 数据类型 | 字段说明 |
|----------|----------|----------|
| fm | number | 五分钟涨跌幅（%） |
| h | number | 最高价（元） |
| hs | number | 换手（%） |
| lb | number | 量比（%） |
| l | number | 最低价（元） |
| lt | number | 流通市值（元） |
| o | number | 开盘价（元） |
| pe | number | 市盈率（动态，总市值除以预估全年净利润） |
| pc | number | 涨跌幅（%） |
| p | number | 当前价格（元） |
| sz | number | 总市值（元） |
| cje | number | 成交额（元） |
| ud | number | 涨跌额（元） |
| v | number | 成交量（手） |
| yc | number | 昨日收盘价（元） |
| zf | number | 振幅（%） |
| zs | number | 涨速（%） |
| sjl | number | 市净率 |
| zdf60 | number | 60日涨跌幅（%） |
| zdfnc | number | 年初至今涨跌幅（%） |
| t | string | 更新时间yyyy-MM-ddHH:mm:ss |

### 2. 当天逐笔交易
**接口**: `https://api.mairuiapi.com/hsrl/zbjy/股票代码(如000001)/您的licence`  
**说明**: 根据《股票列表》得到的股票代码获取当天逐笔交易数据，按时间倒序。  
**数据更新**: 每日21:00  
**请求频率**: 1分钟300次 | 包月版、体验版1分钟1千次 | 包年版1分钟3千次 | 钻石版1分钟6千次  

| 字段名称 | 数据类型 | 字段说明 |
|----------|----------|----------|
| d | string | 数据归属日期（yyyy-MM-dd） |
| t | string | 时间（HH:mm:dd） |
| v | number | 成交量（股） |
| p | number | 成交价 |
| ts | number | 交易方向（0：中性盘，1：买入，2：卖出） |

### 3. 实时交易数据（券商数据源）
**接口**: `https://api.mairuiapi.com/hsstock/real/time/股票代码/证书您的licence`  
**说明**: 根据《股票列表》得到的股票代码获取实时交易数据（您可以理解为日线的最新数据）。  
**数据更新**: 实时  
**请求频率**: 1分钟300次 | 包月版、体验版1分钟1千次 | 包年版1分钟3千次 | 钻石版1分钟6千次  

| 字段名称 | 数据类型 | 字段说明 |
|----------|----------|----------|
| p | number | 最新价 |
| o | number | 开盘价 |
| h | number | 最高价 |
| l | number | 最低价 |
| yc | number | 前收盘价 |
| cje | number | 成交总额 |
| v | number | 成交总量 |
| pv | number | 原始成交总量 |
| ud | float | 涨跌额 |
| pc | float | 涨跌幅 |
| zf | float | 振幅 |
| t | string | 更新时间 |
| pe | number | 市盈率 |
| tr | number | 换手率 |
| pb_ratio | number | 市净率 |
| tv | number | 成交量 |

### 4. 买卖五档盘口
**接口**: `https://api.mairuiapi.com/hsstock/real/five/股票代码/证书您的licence`  
**说明**: 根据《股票列表》得到的股票代码获取实时买卖五档盘口数据。  
**数据更新**: 实时  
**请求频率**: 1分钟300次 | 包月版、体验版1分钟1千次 | 包年版1分钟3千次 | 钻石版1分钟6千次  

| 字段名称 | 数据类型 | 字段说明 |
|----------|----------|----------|
| ps | number | 委卖价 |
| pb | number | 委买价 |
| vs | number | 委卖量 |
| vb | number | 委买量 |
| t | string | 更新时间 |

### 5. 实时交易数据（全部 | 券商数据源）
**接口**: `https://a.mairuiapi.com/hsrl/ssjy/all/您的licence`  
**说明**: 一次性获取《股票列表》中所有股票的实时交易数据（您可以理解为日线的最新数据），该接口仅限钻石版和包年版证书使用且限制每分钟请求1次。  
**数据更新**: 实时  
**请求频率**: 1分钟300次 | 包月版、体验版1分钟1千次 | 包年版1分钟3千次 | 钻石版1分钟6千次  

| 字段名称 | 数据类型 | 字段说明 |
|----------|----------|----------|
| dm | string | 股票代码 |
| p | number | 最新价 |
| o | number | 开盘价 |
| h | number | 最高价 |
| l | number | 最低价 |
| yc | number | 前收盘价 |
| cje | number | 成交总额 |
| v | number | 成交总量 |
| pv | number | 原始成交总量 |
| ud | float | 涨跌额 |
| pc | float | 涨跌幅 |
| zf | float | 振幅 |
| t | string | 更新时间 |
| pe | number | 市盈率 |
| tr | number | 换手率 |
| pb_ratio | number | 市净率 |
| tv | number | 成交量 |

### 6. 实时交易数据（多股）
**接口**: `https://api.mairuiapi.com/hsrl/ssjy_more/您的licence?stock_codes=股票代码1,股票代码2……股票代码20`  
**说明**: 一次性获取《股票列表》中不超过20支股票的实时交易数据（您可以理解为日线的最新数据）。  
**数据更新**: 实时  
**请求频率**: 1分钟300次 | 包月版、体验版1分钟1千次 | 包年版1分钟3千次 | 钻石版1分钟6千次  

| 字段名称 | 数据类型 | 字段说明 |
|----------|----------|----------|
| p | number | 最新价 |
| o | number | 开盘价 |
| h | number | 最高价 |
| l | number | 最低价 |
| yc | number | 前收盘价 |
| cje | number | 成交总额 |
| v | number | 成交总量 |
| pv | number | 原始成交总量 |
| ud | float | 涨跌额 |
| pc | float | 涨跌幅 |
| zf | float | 振幅 |
| t | string | 更新时间 |
| pe | number | 市盈率 |
| tr | number | 换手率 |
| pb_ratio | number | 市净率 |
| tv | number | 成交量 |

### 7. 实时交易数据（全部 | 网络数据源）
**接口**: `https://a.mairuiapi.com/hsrl/real/all/您的licence`  
**说明**: 一次性获取《股票列表》中所有股票的实时交易数据（您可以理解为日线的最新数据），该接口仅限钻石版和包年版证书使用且限制每分钟请求1次。  
**数据更新**: 交易时间段每1分钟  
**请求频率**: 1分钟300次 | 包月版、体验版1分钟1千次 | 包年版1分钟3千次 | 钻石版1分钟6千次  

| 字段名称 | 数据类型 | 字段说明 |
|----------|----------|----------|
| dm | string | 股票代码 |
| fm | number | 五分钟涨跌幅（%） |
| h | number | 最高价（元） |
| hs | number | 换手（%） |
| lb | number | 量比（%） |
| l | number | 最低价（元） |
| lt | number | 流通市值（元） |
| o | number | 开盘价（元） |
| pe | number | 市盈率（动态） |
| pc | number | 涨跌幅（%） |
| p | number | 当前价格（元） |
| sz | number | 总市值（元） |
| cje | number | 成交额（元） |
| ud | number | 涨跌额（元） |
| v | number | 成交量（手） |
| yc | number | 昨日收盘价（元） |
| zf | number | 振幅（%） |
| zs | number | 涨速（%） |
| sjl | number | 市净率 |
| zdf60 | number | 60日涨跌幅（%） |
| zdfnc | number | 年初至今涨跌幅（%） |
| t | string | 更新时间yyyy-MM-ddHH:mm:ss |

### 8. 资金流向数据
**接口**: `https://api.mairuiapi.com/hsstock/history/transaction/股票代码(如000001)/您的licence?st=开始时间&et=结束时间&lt=最新条数`  
**说明**: 根据《股票列表》得到的股票代码获取资金流向数据。开始时间以及结束时间的格式均为 YYYYMMDD，例如：'20240101'，不设置开始时间和结束时间则为全部历史数据。同时可以指定获取数据条数，例如指定lt=10，则获取最新的10条数据。下列字段中，特大单为成交金额大于或等于100万元或成交量大于或等于5000手，大单为成交金额大于或等于20万元或成交量大于或等于1000手，中单为成交金额大于或等于4万元或成交量大于或等于200手，其他为小单。  
**数据更新**: 每日21:30更新  
**请求频率**: 1分钟300次 | 包月版、体验版1分钟1千次 | 包年版1分钟3千次 | 钻石版1分钟6千次  

| 字段名称 | 数据类型 | 字段说明 |
|----------|----------|----------|
| t | int | 交易时间 |
| zmbzds | int | 主买单总单数 |
| zmszds | int | 主卖单总单数 |
| dddx | float | 大单动向 |
| zddy | float | 涨跌动因 |
| ddcf | float | 大单差分 |
| zmbzdszl | int | 主买单总单数增量 |
| zmszdszl | int | 主卖单总单数增量 |
| cjbszl | int | 成交笔数增量 |
| zmbtdcje | float | 主买特大单成交额 |
| zmbddcje | float | 主买大单成交额 |
| zmbzdcje | float | 主买中单成交额 |
| zmbxdcje | float | 主买小单成交额 |
| zmstdcje | float | 主卖特大单成交额 |
| zmsddcje | float | 主卖大单成交额 |
| zmszdcje | float | 主卖中单成交额 |
| zmsxdcje | float | 主卖小单成交额 |
| bdmbtdcje | float | 被动买特大单成交额 |
| bdmbddcje | float | 被动买大单成交额 |
| bdmbzdcje | float | 被动买中单成交额 |
| bdmbxdcje | float | 被动买小单成交额 |
| bdmstdcje | float | 被动卖特大单成交额 |
| bdmsddcje | float | 被动卖大单成交额 |
| bdmszdcje | float | 被动卖中单成交额 |
| bdmsxdcje | float | 被动卖小单成交额 |
| bdmsljcje | float | 被动卖累计成交额 |
| zmbtdcjl | int | 主买特大单成交量 |
| zmbddcjl | int | 主买大单成交量 |
| zmbzdcjl | int | 主买中单成交量 |
| zmbxdcjl | int | 主买小单成交量 |
| zmstdcjl | int | 主卖特大单成交量 |
| zmsddcjl | int | 主卖大单成交量 |
| zmszdcjl | int | 主卖中单成交量 |
| zmsxdcjl | int | 主卖小单成交量 |
| bdmbtdcjl | int | 被动买特大单成交量 |
| bdmbddcjl | int | 被动买大单成交量 |
| bdmbzdcjl | int | 被动买中单成交量 |
| bdmbxdcjl | int | 被动买小单成交量 |
| bdmstdcjl | int | 被动卖特大单成交量 |
| bdmsddcjl | int | 被动卖大单成交量 |
| bdmszdcjl | int | 被动卖中单成交量 |
| bdmsxdcjl | int | 被动卖小单成交量 |
| zmbtdcjzl | float | 主买特大单成交额增量 |
| zmbddcjzl | float | 主买大单成交额增量 |
| zmbzdcjzl | float | 主买中单成交额增量 |
| zmbxdcjzl | float | 主买小单成交额增量 |
| zmstdcjzl | float | 主卖特大单成交额增量 |
| zmsddcjzl | float | 主卖大单成交额增量 |
| zmszdcjzl | float | 主卖中单成交额增量 |
| zmsxdcjzl | float | 主卖小单成交额增量 |
| bdmbtdcjzl | float | 被动买特大单成交额增量 |
| bdmbddcjzl | float | 被动买大单成交额增量 |
| bdmbzdcjzl | float | 被动买中单成交额增量 |
| bdmbxdcjzl | float | 被动买小单成交额增量 |
| bdmstdcjzl | float | 被动卖特大单成交额增量 |
| bdmsddcjzl | float | 被动卖大单成交额增量 |
| bdmszdcjzl | float | 被动卖中单成交额增量 |
| bdmsxdcjzl | float | 被动卖小单成交额增量 |
| zmbtdcjzlv | int | 主买特大单成交量增量 |
| zmbddcjzlv | int | 主买大单成交量增量 |
| zmbzdcjzlv | int | 主买中单成交量增量 |
| zmbxdcjzlv | int | 主买小单成交量增量 |
| zmstdcjzlv | int | 主卖特大单成交量增量 |
| zmsddcjzlv | int | 主卖大单成交量增量 |
| zmszdcjzlv | int | 主卖中单成交量增量 |
| zmsxdcjzlv | int | 主卖小单成交量增量 |
| bdmbtdcjzlv | int | 被动买特大单成交量增量 |
| bdmbddcjzlv | int | 被动买大单成交量增量 |
| bdmbzdcjzlv | int | 被动买中单成交量增量 |
| bdmbxdcjzlv | int | 被动买小单成交量增量 |
| bdmstdcjzlv | int | 被动卖特大单成交量增量 |
| bdmsddcjzlv | int | 被动卖大单成交量增量 |
| bdmszdcjzlv | int | 被动卖中单成交量增量 |
| bdmsxdcjzlv | int | 被动卖小单成交量增量 |

---

## 行情数据

### 1. 最新分时交易
**接口**: `https://api.mairuiapi.com/hsstock/latest/股票代码.市场（如000001.SZ）/分时级别(如d)/除权方式/您的licence?lt=最新条数(如5)`  
**说明**: 根据《股票列表》得到的股票代码和分时级别获取最新交易数据，交易时间升序。目前分时级别支持5分钟、15分钟、30分钟、60分钟、日线、周线、月线、年线，对应的请求参数分别为5、15、30、60、d、w、m、y，日线以上除权方式有不复权、前复权、后复权、等比前复权、等比后复权，对应的参数分别为n、f、b、fr、br，分钟级无除权数据，对应的参数为n。同时可以指定获取数据条数，例如指定lt=10，则获取最新的10条数据。  
**数据更新**: 实时  
**请求频率**: 1分钟300次 | 包月版、体验版1分钟1千次 | 包年版1分钟3千次 | 钻石版1分钟6千次  

| 字段名称 | 数据类型 | 字段说明 |
|----------|----------|----------|
| t | string | 交易时间 |
| o | float | 开盘价 |
| h | float | 最高价 |
| l | float | 最低价 |
| c | float | 收盘价 |
| v | float | 成交量 |
| a | float | 成交额 |
| pc | float | 前收盘价 |
| sf | int | 停牌 1停牌，0 不停牌 |

### 2. 历史分时交易
**接口**: `https://api.mairuiapi.com/hsstock/history/股票代码.市场（如000001.SZ）/分时级别(如d)/除权方式/您的licence?st=开始时间(如20240601)&et=结束时间(如20250430)&lt=最新条数(如100)`  
**说明**: 根据《股票列表》得到的股票代码和分时级别获取历史交易数据，交易时间升序。目前分时级别支持5分钟、15分钟、30分钟、60分钟、日线、周线、月线、年线，对应的请求参数分别为5、15、30、60、d、w、m、y，日线以上除权方式有不复权、前复权、后复权、等比前复权、等比后复权，对应的参数分别为n、f、b、fr、br，分钟级无除权数据，对应的参数为n。开始时间以及结束时间的格式均为 YYYYMMDD 或 YYYYMMDDhhmmss，例如：'20240101' 或'20241231235959'。不设置开始时间和结束时间则为全部历史数据。同时可以指定获取数据条数，例如指定lt=10，则获取最新的10条数据。  
**数据更新**: 分钟级别数据盘中更新，分时越小越优先更新，日线及以上级别每日15:30开始更新，预计17:10完成  
**请求频率**: 1分钟300次 | 包月版、体验版1分钟1千次 | 包年版1分钟3千次 | 钻石版1分钟6千次  

| 字段名称 | 数据类型 | 字段说明 |
|----------|----------|----------|
| t | string | 交易时间 |
| o | float | 开盘价 |
| h | float | 最高价 |
| l | float | 最低价 |
| c | float | 收盘价 |
| v | float | 成交量 |
| a | float | 成交额 |
| pc | float | 前收盘价 |
| sf | int | 停牌 1停牌，0 不停牌 |

### 3. 历史涨跌停价格
**接口**: `https://api.mairuiapi.com/hsstock/stopprice/history/股票代码（如000001.SZ）/您的licence?st=开始时间&et=结束时间`  
**说明**: 根据《股票列表》得到的股票代码获取历史涨跌停价格，开始时间以及结束时间的格式均为 YYYYMMDD，例如：'20240101'。不设置开始时间和结束时间则为全部历史数据。  
**数据更新**: 每日0点  
**请求频率**: 1分钟300次 | 包月版、体验版1分钟1千次 | 包年版1分钟3千次 | 钻石版1分钟6千次  

| 字段名称 | 数据类型 | 字段说明 |
|----------|----------|----------|
| t | string | 交易日期 |
| h | float | 涨停价格 |
| l | float | 跌停价格 |

### 4. 行情指标
**接口**: `https://api.mairuiapi.com/hsstock/indicators/股票代码（如000001.SZ）/您的licence?st=开始时间&et=结束时间`  
**说明**: 根据《股票列表》得到的股票代码获取各项行情指标，开始时间以及结束时间的格式均为 YYYYMMDD，例如：'20240101'。不设置开始时间和结束时间则为全部数据。  
**数据更新**: 实时  
**请求频率**: 1分钟300次 | 包月版、体验版1分钟1千次 | 包年版1分钟3千次 | 钻石版1分钟6千次  

| 字段名称 | 数据类型 | 字段说明 |
|----------|----------|----------|
| t | string | 交易时间 |
| o | float | 开盘价 |
| h | float | 最高价 |
| l | float | 最低价 |
| c | float | 收盘价 |
| v | float | 成交量 |
| a | float | 成交额 |
| pc | float | 前收盘价 |
| sf | int | 停牌 1停牌，0 不停牌 |
| ei | string | 市场代码 |
| ii | string | 股票代码 |
| name | string | 股票名称 |
| od | string | 上市日期(股票IPO日期) |
| pc | float | 前收盘价格 |
| up | float | 当日涨停价 |
| dp | float | 当日跌停价 |
| fv | float | 流通股本 |
| tv | float | 总股本 |
| pk | float | 最小价格变动单位 |
| is | int | 股票停牌状态(<=0:正常交易;>=1停牌天数) |

---

## 技术指标

### 1. MACD指标
**接口**: 行情数据接口返回的指标数据  
**说明**: MACD（异同移动平均线）技术指标，包括DIFF、DEA、MACD等值。  

| 字段名称 | 数据类型 | 字段说明 |
|----------|----------|----------|
| t | string | 交易时间，短分时级别格式为yyyy-MM-ddHH:mm:ss，日线级别为yyyy-MM-dd |
| diff | number | DIFF值 |
| dea | number | DEA值 |
| macd | number | MACD值 |
| ema12 | number | EMA（12）值 |
| ema26 | number | EMA（26）值 |

### 2. MA均线指标
**接口**: 行情数据接口返回的指标数据  
**说明**: 移动平均线指标，包括MA3、MA5、MA10、MA15、MA20、MA30、MA60、MA120、MA200、MA250等值。  

| 字段名称 | 数据类型 | 字段说明 |
|----------|----------|----------|
| t | string | 交易时间，短分时级别格式为yyyy-MM-ddHH:mm:ss，日线级别为yyyy-MM-dd |
| ma3 | number | MA3，没有则为null |
| ma5 | number | MA5，没有则为null |
| ma10 | number | MA10，没有则为null |
| ma15 | number | MA15，没有则为null |
| ma20 | number | MA20，没有则为null |
| ma30 | number | MA30，没有则为null |
| ma60 | number | MA60，没有则为null |
| ma120 | number | MA120，没有则为null |
| ma200 | number | MA200，没有则为null |
| ma250 | number | MA250，没有则为null |

### 3. BOLL指标
**接口**: 行情数据接口返回的指标数据  
**说明**: 布林带指标，包括上轨、中轨、下轨等值。  

| 字段名称 | 数据类型 | 字段说明 |
|----------|----------|----------|
| t | string | 交易时间，短分时级别格式为yyyy-MM-ddHH:mm:ss，日线级别为yyyy-MM-dd |
| u | number | 上轨 |
| d | number | 下轨 |
| m | number | 中轨 |

### 4. KDJ指标
**接口**: 行情数据接口返回的指标数据  
**说明**: 随机指标，包括K值、D值、J值等值。  

| 字段名称 | 数据类型 | 字段说明 |
|----------|----------|----------|
| t | string | 交易时间，短分时级别格式为yyyy-MM-ddHH:mm:ss，日线级别为yyyy-MM-dd |
| k | number | K值 |
| d | number | D值 |
| j | number | J值 |

---

## 调用示例
```bash
# 获取股票列表
curl "https://api.mairuiapi.com/hslt/list/C841AA1C-5254-4A61-8D67-784345430241"

# 获取平安银行实时交易数据
curl "https://api.mairuiapi.com/hsrl/ssjy/000001/C841AA1C-5254-4A61-8D67-784345430241"

# 获取平安银行历史分时交易数据（2025年1月1日至2025年4月30日）
curl "https://api.mairuiapi.com/hsstock/history/000001.SZ/d/n/C841AA1C-5254-4A61-8D67-784345430241?st=20250101&et=20250430&lt=100"
```

## 注意事项
1. **许可证认证**: 所有接口必须使用有效的许可证，替换URL中的"您的licence"部分。
2. **请求频率限制**: 根据证书类型不同，每分钟请求次数有限制，请勿超过限制。
3. **数据更新频率**: 不同接口的数据更新频率不同，请注意接口说明中的更新时间。
4. **参数格式**: 日期参数请严格按照指定格式（yyyy-MM-dd或YYYYMMDD）。
5. **返回格式**: 所有接口返回标准JSON格式数组。
6. **错误处理**: 当许可证无效或参数错误时，接口可能返回错误信息或空数组。
7. **券商数据源**: 部分接口使用券商数据源，提供更准确的数据，但可能有访问限制。

---

**文档版本**: 1.0  
**最后更新**: 2026-04-01  
**数据源**: 恒生数据API (https://www.mairui.club/hsdata)  
**许可证**: C841AA1C-5254-4A61-8D67-784345430241