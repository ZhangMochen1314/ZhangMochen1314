# SaaS 商业化完整升级计划 (Coze-like Platform)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将开源版 DeerFlow 升级为一个具备完整商业闭环（用户体系、计费充值、高阶科研文件解析、云存储）的企业级 SaaS 平台。

**Architecture:** 
在现有 FastAPI + React + PostgreSQL 架构基础上，引入 JWT 鉴权中间件拦截所有 API 请求；在 TokenUsage 中间件中串联积分扣减逻辑；将文件上传由本地存储改造为阿里云 OSS 直传；并在文件预处理管道中深度集成 `StatsPAI` 和 `geopandas` 以解析科研数据格式（.dta, .sav, .shp, .zip）。

**Tech Stack:** FastAPI, React (Tailwind+Zustand), PostgreSQL, JWT, Aliyun OSS SDK, PyReadStat (用于 dta/sav), GeoPandas (用于 shp)

---

### 阶段一：用户管理与认证体系 (User Auth)

**Files:**
- Create: `backend/app/auth/models.py`
- Create: `backend/app/auth/router.py`
- Create: `backend/app/auth/jwt_utils.py`
- Modify: `backend/app/main.py`
- Create: `frontend/src/pages/Login.tsx`
- Create: `frontend/src/pages/Register.tsx`
- Modify: `frontend/src/App.tsx`
- Modify: `frontend/src/store/useAuthStore.ts`

- [ ] **Step 1: 创建 PostgreSQL 用户数据模型**
```python
# backend/app/auth/models.py
from sqlmodel import SQLModel, Field
from typing import Optional

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(index=True, unique=True)
    email: str = Field(index=True, unique=True)
    hashed_password: str
    credits: float = Field(default=100.0) # 初始赠送 100 积分
```

- [ ] **Step 2: 实现 JWT 鉴权依赖与路由**
```python
# backend/app/auth/jwt_utils.py
import jwt
from datetime import datetime, timedelta
SECRET_KEY = "your-secret-key" # 实际应从 .env 读取
ALGORITHM = "HS256"

def create_access_token(data: dict, expires_delta: timedelta):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# backend/app/auth/router.py
from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
router = APIRouter()

@router.post("/register")
def register(user_data: UserCreate):
    # Hash password and save to DB
    pass

@router.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # Verify user and return token
    pass
```

- [ ] **Step 3: 全局鉴权拦截器注入**
修改 `backend/app/main.py` 或相关 `Gateway`，确保所有 `/api/threads` 等核心接口必须携带有效的 `Authorization: Bearer <token>` 才能访问，并将会话绑定至当前 User ID。

- [ ] **Step 4: 前端增加登录/注册页面与路由守卫**
在 `frontend/src/App.tsx` 中配置路由。若 `useAuthStore` 中无 token，重定向至 `/login` 页面。

---

### 阶段二：积分消耗与充值系统 (Billing & Credits)

**Files:**
- Create: `backend/app/billing/router.py`
- Modify: `backend/packages/harness/deerflow/agents/middlewares/token_usage_middleware.py`
- Create: `frontend/src/components/BillingModal.tsx`

- [ ] **Step 1: 拦截 Token 消耗并扣减积分**
修改 `token_usage_middleware.py`，在大模型返回结果后：
```python
# 伪代码逻辑
user = get_current_user(session_id)
cost = calculate_cost(input_tokens, output_tokens, model_name)
if user.credits < cost:
    raise HTTPException(status_code=402, detail="Insufficient credits")
user.credits -= cost
db.commit()
```

- [ ] **Step 2: 开发支付宝/微信支付接口 (后端)**
在 `backend/app/billing/router.py` 中引入 `alipay-sdk-python`，提供 `/api/billing/recharge` 接口生成支付二维码（或跳转链接），以及 `/api/billing/webhook` 接收支付成功回调并为用户增加积分。

- [ ] **Step 3: 前端展示积分与充值弹窗**
在前端顶部导航栏显示当前用户的剩余 `Credits`，点击弹出 `BillingModal.tsx` 展示充值套餐（如 10元=1000积分），并展示支付二维码。

---

### 阶段三：云存储 (阿里云 OSS) 与文件直传

**Files:**
- Create: `backend/app/storage/oss_provider.py`
- Modify: `backend/app/gateway/routers/uploads.py`
- Modify: `frontend/src/pages/Chat.tsx`

- [ ] **Step 1: 实现 OSS 适配器**
```python
# backend/app/storage/oss_provider.py
import oss2
class OSSProvider:
    def __init__(self, endpoint, bucket_name, access_key, access_secret):
        auth = oss2.Auth(access_key, access_secret)
        self.bucket = oss2.Bucket(auth, endpoint, bucket_name)
    
    def generate_presigned_url(self, object_name: str, method='PUT'):
        return self.bucket.sign_url(method, object_name, 3600)
```

- [ ] **Step 2: 改造上传逻辑为前端直传**
后端 `uploads.py` 仅提供生成预签名 URL 的接口。前端 `Chat.tsx` 拿到 URL 后，使用 `PUT` 请求直接将文件推送到阿里云 OSS，减轻后端带宽压力。上传完成后前端通知后端文件 OSS 路径，后端将其记录到数据库中。

---

### 阶段四：高级科研文件解析 (zip, sav, dta, shp)

**Files:**
- Modify: `backend/packages/harness/deerflow/tools/file_conversion.py`
- Modify: `backend/requirements.txt` (添加 pyreadstat, geopandas)

- [ ] **Step 1: 自动解压 ZIP 压缩包**
在文件解析流水线中，检测到 MIME 类型为 `application/zip` 时：
```python
import zipfile
import tempfile
def extract_and_flatten_zip(zip_path):
    # 安全解压至临时目录，遍历内部所有支持的文件
    # 递归调用转换管道，生成文件树的 Markdown 目录结构
    pass
```

- [ ] **Step 2: 解析 SPSS/Stata 数据 (sav, dta)**
利用项目中已有的 `StatsPAI/src/statspai/utils/io.py` 逻辑：
```python
import pyreadstat
def parse_statistical_data(file_path):
    df, meta = pyreadstat.read_sav(file_path) # 或 read_dta
    # 提取变量名和标签 (Variable Labels)
    # 生成包含数据前 5 行和统计摘要的 Markdown，供大模型直接阅读
    return markdown_summary
```

- [ ] **Step 3: 解析 GIS 空间数据 (shp)**
要求用户将 `.shp, .shx, .dbf` 打包为 `.zip` 上传。结合 Step 1 解压后：
```python
import geopandas as gpd
def parse_shapefile(shp_path):
    gdf = gpd.read_file(shp_path)
    # 提取坐标系 (CRS) 和属性表结构
    # 生成 GeoJSON 或 Markdown 摘要，供大模型理解空间范围
    pass
```
