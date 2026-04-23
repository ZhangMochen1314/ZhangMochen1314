# DeepTrace DataCollector 商业化部署实施计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将本地的 500MB+ 科研微观数据转化为适用于云端高并发查询的 Parquet 格式，并部署到购买的云服务器/对象存储上，完成 deeptrace-datacollector 技能的商业化上线配置。

**Architecture:** 数据清洗层 (Pandas) -> 云端存储层 (OSS/挂载云盘) -> 查询层 (DuckDB in Deerflow 2.0)。通过将全量 CSV 转换为 Parquet 格式，实现云端零内存消耗的高速按需查询。

**Tech Stack:** Python (pandas, pyarrow), 云服务 (阿里云/腾讯云 OSS, ECS/轻量应用服务器), YAML 配置。

---

## 商业化部署需要购买的资源与指南

在执行具体的配置任务前，你需要购买以下云资源（以阿里云/腾讯云为例，适用于初创商业化项目）：

1. **云服务器 (ECS / 轻量应用服务器)**
   - **用途**：运行 Deerflow 2.0 系统以及大模型 Agent 框架。
   - **推荐配置**：2核 4G 或 4核 8G（因为 DuckDB 查询效率极高，不需要超大内存机器）。
   - **系统**：Ubuntu 22.04 LTS 或 Debian 12。
   - **购买指南**：对于早期商业化，推荐购买“轻量应用服务器”（腾讯云/阿里云），性价比高且带固定带宽。

2. **对象存储服务 (OSS / COS) 或 额外云盘**
   - **用途**：存放 500MB（转换后可能约 150MB）的微观数据以及未来可能增加的 TB 级科研数据。
   - **方案对比**：
     - **方案A（挂载云盘）**：在购买服务器时额外挂载一块 50GB-100GB 的数据盘（挂载到 `/mnt/data`）。优点：无需配置网络访问，直接走本地 I/O，配置最简单。
     - **方案B（对象存储 OSS/S3）**：优点：无限扩容，数据与计算完全分离。缺点：需要配置云服务的 AccessKey 和内网访问端点。
   - **推荐方案**：早期商业化推荐 **方案A（挂载云盘）**，性价比最高，配置最简单。

3. **域名与 SSL 证书**
   - **用途**：为你的商业化网页应用提供合法的 HTTPS 访问地址。
   - **购买指南**：在云服务商处注册域名并申请免费的单域名 SSL 证书。

---

## 实施任务拆解

### Task 1: 将本地数据转换为 Parquet 格式

**Files:**
- Create: `scripts/convert_to_parquet.py` (在本地执行，无需随代码提交到服务器)

- [ ] **Step 1: 编写本地数据转换脚本**
  在你的本地电脑（不是云服务器）上编写并运行以下脚本。

```python
import pandas as pd

# 读取你本地 500MB 的 CSV 数据
print("正在加载 CSV 数据...")
# 如果是 DTA 文件，请使用 pd.read_stata('firm_micro_data.dta')
df = pd.read_csv('firm_micro_data.csv') 

# 转换为 Parquet 格式（启用 snappy 压缩）
print("正在转换为 Parquet 格式...")
df.to_parquet('firm_micro_data.parquet', engine='pyarrow', compression='snappy')
print("转换完成！你可以检查 firm_micro_data.parquet 的文件大小。")
```

- [ ] **Step 2: 验证转换后的文件**
  运行脚本后，确认生成的 `firm_micro_data.parquet` 文件大小（通常会缩小至原大小的 20%-30%）。

### Task 2: 部署数据文件到云服务器

**Files:**
- 无代码修改，仅执行系统操作。

- [ ] **Step 1: 上传 Parquet 文件至云服务器**
  通过 SCP 或 SFTP 工具，将 `firm_micro_data.parquet` 上传到你购买的云服务器的指定数据目录。

```bash
# 在本地电脑终端执行（替换 IP 为你的云服务器 IP）
scp firm_micro_data.parquet root@<你的云服务器IP>:/mnt/data/
```

- [ ] **Step 2: 确认服务器文件权限**
  登录云服务器，确保运行 Deerflow 2.0 的用户对该文件有读取权限。

```bash
ssh root@<你的云服务器IP>
ls -la /mnt/data/firm_micro_data.parquet
chmod 644 /mnt/data/firm_micro_data.parquet
```

### Task 3: 修改生产环境配置 (Manifest)

**Files:**
- Modify: `deer-flow/skills/public/deeptrace-datacollector/references/data_manifest.yaml`

- [ ] **Step 1: 更新生产环境的数据路径**
  确保云服务器上的技能配置文件指向了刚刚上传的真实文件路径。

```yaml
datasets:
  firm_micro_data:
    description: "企业微观数据，包含A股上市公司历年的财务、治理、研发等核心变量。"
    # 修改为云服务器上真实的绝对路径
    path: "/mnt/data/firm_micro_data.parquet"
    format: "parquet"
    primary_keys:
      - "stkcd"
      - "year"
    available_columns:
      - "stkcd"
      - "year"
      # ... 确保此处列出了数据中真实存在的所有可用列名
```

- [ ] **Step 2: 提交并拉取代码至云端**

```bash
git add deer-flow/skills/public/deeptrace-datacollector/references/data_manifest.yaml
git commit -m "chore: update data manifest path for production deployment"
git push
# 然后在云服务器上执行 git pull 同步最新配置
```

### Task 4: 部署验证与测试

**Files:**
- Test: 交互式调用测试

- [ ] **Step 1: 模拟 Agent 调用查询脚本进行测试**
  在云服务器的 Deerflow 工作目录下，手动执行一次 DuckDB 查询脚本，确保其能正确读取并过滤刚上传的 Parquet 文件。

```bash
python /workspace/deer-flow/skills/public/deeptrace-datacollector/scripts/data_fetcher.py \
  --dataset firm_micro_data \
  --select "stkcd, year" \
  --limit 5 \
  --output "/tmp/test_output.csv"
```
**Expected Output**: 
返回包含 `"status": "success"` 和 `"rows_exported": 5` 的 JSON，且不报错。

- [ ] **Step 2: 在网页应用端进行全链路对话测试**
  在你的商业化网页前端，输入：“帮我提取前5家企业的股票代码和年份数据”。验证 Agent 是否成功返回 Markdown 摘要，并提供了可下载的 CSV/Parquet 链接。
