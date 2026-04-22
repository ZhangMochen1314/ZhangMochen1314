## 1. 架构设计
```mermaid
graph TD
    subgraph "前端应用 (React + Vite)"
        UI["UI 组件层"]
        State["状态管理 (Zustand)"]
        API_Client["API 客户端"]
    end
    
    subgraph "后端服务"
        Gateway["API 网关 & 计费拦截器"]
        Agent["Deerflow 2.0 智能体"]
        Statspai["statspai 数据分析引擎"]
        DataExtractor["本地科研数据提取引擎"]
        LitSearch["文献检索爬虫与 API"]
    end
    
    subgraph "数据层"
        DB["PostgreSQL (业务数据 & 计费账单)"]
        VectorDB["向量数据库 (知识检索)"]
        LocalResearchDB["内置科研数据库 (DuckDB/PostgreSQL/Parquet)"]
    end
    
    UI --> State
    State --> API_Client
    API_Client --> Gateway
    Gateway --> Agent
    Agent --> Statspai
    Agent --> DataExtractor
    Agent --> LitSearch
    DataExtractor --> LocalResearchDB
    Agent --> VectorDB
    Gateway --> DB
```

## 2. 技术说明
- **前端**：React@18 + tailwindcss@3 + vite
- **路由**：react-router-dom
- **状态管理**：zustand
- **图标与组件库**：lucide-react, shadcn/ui (Radix UI)
- **图表可视化**：recharts 或 echarts-for-react
- **Markdown渲染**：react-markdown (支持数学公式 rehype-mathjax 和代码高亮)
- **初始化工具**：vite-init
- **后端**：基于 Node.js/Python 构建 API，集成 Deerflow 2.0 智能体框架以及 statspai 进行核心业务处理。

## 3. 路由定义
| 路由 | 目的 |
|-------|---------|
| `/` | 商业化落地首页，产品介绍与定价 |
| `/chat` | 核心对话工作区 |
| `/chat/:id` | 特定历史对话工作区 |
| `/datasets` | 数据集管理页面 |
| `/login` | 用户登录/注册页 |

## 4. API 定义 (对接后端)
```typescript
// 1. 发送对话消息
interface SendMessageRequest {
  chatId: string;
  message: string;
  datasetIds?: string[];
}
interface SendMessageResponse {
  messageId: string;
  role: 'assistant';
  content: string; // Markdown 格式的回复或分析报告
  chartData?: any; // 结构化图表数据
}

// 2. 上传数据集
interface UploadDatasetResponse {
  datasetId: string;
  filename: string;
  rowCount: number;
  columns: string[];
}
```

## 5. 服务端架构图
```mermaid
graph TD
    Controller["API Controller"] --> Billing["计费与权限拦截器"]
    Billing --> AgentService["智能体服务 (Deerflow 2.0)"]
    Billing --> DataService["用户数据管理服务"]
    AgentService --> AnalysisEngine["分析引擎 (statspai)"]
    AgentService --> LLM["大语言模型"]
    AgentService --> LitEngine["文献检索引擎 (Scholar/CNKI)"]
    AgentService --> BuiltInDataService["内置科研数据引擎 (Text2SQL/DuckDB)"]
    BuiltInDataService --> BillingModule["积分结算模块"]
    DataService --> Repository["数据库访问层"]
    BuiltInDataService --> LocalDB["本地科研数据库"]
    Repository --> Database["PostgreSQL / S3"]
```

## 6. 数据模型
### 6.1 数据模型定义
```mermaid
erDiagram
    USER ||--o{ CHAT_SESSION : owns
    USER ||--o{ DATASET : uploads
    CHAT_SESSION ||--o{ MESSAGE : contains
    USER {
        string id PK
        string email
        string membership_tier
        datetime created_at
    }
    DATASET {
        string id PK
        string user_id FK
        string filename
        string file_url
        datetime uploaded_at
    }
    CHAT_SESSION {
        string id PK
        string user_id FK
        string title
        datetime updated_at
    }
    MESSAGE {
        string id PK
        string session_id FK
        string role
        text content
        json chart_data
        datetime created_at
    }
```
