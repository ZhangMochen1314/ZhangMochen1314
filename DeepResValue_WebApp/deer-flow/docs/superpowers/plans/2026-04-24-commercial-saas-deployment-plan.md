# DeepResValue 2.0 Commercial SaaS Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Execute the end-to-end setup and deployment of DeepResValue 2.0 on Aliyun ECS (Ubuntu 22.04) with an external RDS PostgreSQL database, including infrastructure readiness, Docker Compose orchestration, and E2E validation.

**Architecture:** A separated architecture where a single ECS node runs the core containers (Nginx, Frontend, Gateway, LangGraph, and Sandbox provisioner) while persistent data (Better Auth sessions, checkpoints, billing) is stored in a managed Aliyun RDS PostgreSQL instance. Aliyun OSS handles object storage.

**Tech Stack:** Docker, Docker Compose, PostgreSQL, Nginx, Ubuntu 22.04.

---

## Prerequisites Checklist (Manual Actions for User)

Since an AI agent cannot click through the Aliyun Console or pay for resources, the **User MUST complete these steps** before handing over the rest of the plan to the execution agent.

- [ ] 1. Purchase Aliyun ECS (`ecs.g8i.2xlarge`, 8 vCPU, 32 GiB RAM) in China Mainland region, with Ubuntu 22.04 LTS, 100GB System Disk, 200GB Data Disk.
- [ ] 2. Purchase Aliyun RDS for PostgreSQL (2 Cores, 4GB, High Availability).
- [ ] 3. Create a database named `deerflow` and a database user in RDS.
- [ ] 4. Add the ECS private IP to the RDS whitelist.
- [ ] 5. Purchase Aliyun OSS (Standard) and create a bucket (e.g., `deepresvalue-assets`).
- [ ] 6. Obtain an Aliyun AccessKey ID and Secret for OSS access.
- [ ] 7. Ensure a domain name (e.g., `app.deepresvalue.com`) is resolved to the ECS public IP and ICP registered.
- [ ] 8. Provide the agent with SSH access to the ECS (or run the agent directly on the ECS instance).

*(The following tasks assume the agent is now executing commands directly on the newly provisioned ECS instance as `root`.)*

---

## Task 1: Format and Mount Data Disk

**Goal:** Ensure the 200GB data disk is formatted and mounted to `/var/lib/docker` to handle large sandbox images and intermediate data without exhausting the system disk.

**Files:**
- Modify: `/etc/fstab` (on ECS)

- [ ] **Step 1: Identify the data disk**
Run: `lsblk` and `fdisk -l`
Expected: Identify the 200GB disk device name (e.g., `/dev/vdb`).

- [ ] **Step 2: Format the disk to ext4**
Run: `mkfs.ext4 /dev/vdb` (Replace `/dev/vdb` with actual device).
Expected: Successful format.

- [ ] **Step 3: Create mount point and mount**
Run: 
```bash
mkdir -p /var/lib/docker
mount /dev/vdb /var/lib/docker
```
Expected: Disk mounted.

- [ ] **Step 4: Persist mount in fstab**
Run:
```bash
echo "/dev/vdb /var/lib/docker ext4 defaults 0 0" >> /etc/fstab
```
Expected: fstab updated.

---

## Task 2: Install Docker Engine and Git

**Goal:** Install the necessary container runtime and version control tools on the Ubuntu 22.04 ECS instance.

- [ ] **Step 1: Update apt and install prerequisites**
Run:
```bash
apt-get update
apt-get install -y ca-certificates curl gnupg git
```
Expected: Packages installed successfully.

- [ ] **Step 2: Add Docker's official GPG key and repo (using Aliyun mirror)**
Run:
```bash
curl -fsSL https://mirrors.aliyun.com/docker-ce/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://mirrors.aliyun.com/docker-ce/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```
Expected: Repository added.

- [ ] **Step 3: Install Docker Engine and Compose plugin**
Run:
```bash
apt-get update
apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
```
Expected: Docker installed.

- [ ] **Step 4: Verify Docker installation**
Run: `docker compose version`
Expected: Outputs Docker Compose version.

- [ ] **Step 5: Configure Docker daemon mirror (Optional but recommended in CN)**
Run:
```bash
cat <<EOF > /etc/docker/daemon.json
{
  "registry-mirrors": ["https://registry.cn-hangzhou.aliyuncs.com"]
}
EOF
systemctl restart docker
```
Expected: Docker restarts successfully.

---

## Task 3: Clone Repository and Configure Environment

**Goal:** Fetch the codebase and prepare the `.env` and `config.yaml` files with production credentials.

- [ ] **Step 1: Clone the repository**
Run:
```bash
mkdir -p /data
cd /data
git clone https://github.com/bytedance/deer-flow.git
cd deer-flow
```
Expected: Repository cloned into `/data/deer-flow`.

- [ ] **Step 2: Generate config templates**
Run:
```bash
make config
```
Expected: `config.yaml` is generated in `/data/deer-flow`.

- [ ] **Step 3: Generate Better Auth Secret**
Run:
```bash
SECRET=$(openssl rand -base64 32)
echo "BETTER_AUTH_SECRET=$SECRET" > .env
```
Expected: `.env` file created with `BETTER_AUTH_SECRET`.

- [ ] **Step 4: Inject Database and Model Keys**
*(The agent should prompt the user for the RDS URL and Model API keys if not provided in the prompt, or use placeholders that the user must fill.)*
Run:
```bash
cat <<EOF >> .env
DATABASE_URL="postgresql://user:pass@rm-xxx.pg.rds.aliyuncs.com/deerflow"
OPENAI_API_KEY="your-api-key"
EOF
```
Expected: `.env` populated.

- [ ] **Step 5: Modify config.yaml for Docker Sandbox**
Use `sed` or a Python script to ensure `sandbox.use` is set to `AioSandboxProvider` in `config.yaml`.
Run:
```bash
sed -i 's/use: deerflow.sandbox.local:LocalSandboxProvider/use: deerflow.community.aio_sandbox:AioSandboxProvider/' config.yaml
```
Expected: `config.yaml` updated.

---

## Task 4: Pre-pull Sandbox Image and Build Production Services

**Goal:** Build the Docker images for Gateway, Frontend, and Nginx, and pull the heavy Sandbox image beforehand to prevent timeouts during runtime.

- [ ] **Step 1: Pull Sandbox Image**
Run:
```bash
make setup-sandbox
```
Expected: The `enterprise-public-cn-beijing...all-in-one-sandbox:latest` image is downloaded successfully.

- [ ] **Step 2: Build and Start Production Services**
Run:
```bash
make up
```
Expected: Docker Compose builds the `prod` targets and starts `nginx`, `frontend`, `gateway`, and `langgraph`.

- [ ] **Step 3: Verify Container Status**
Run:
```bash
docker ps
```
Expected: `deer-flow-nginx`, `deer-flow-frontend`, `deer-flow-gateway`, `deer-flow-langgraph` all show `Up`.

---

## Task 5: End-to-End Health Check & Validation

**Goal:** Verify that the system is accessible, the database connection works, and the sandbox can execute code.

- [ ] **Step 1: Check Gateway Health**
Run:
```bash
curl -s http://localhost:2026/health | grep -q "ok" && echo "PASS" || echo "FAIL"
```
Expected: PASS

- [ ] **Step 2: Check Nginx/Frontend Accessibility**
Run:
```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:2026/
```
Expected: `200`

- [ ] **Step 3: Inspect Database Initialization**
Run:
```bash
docker logs deer-flow-gateway | grep "Database"
```
Expected: Logs indicating successful connection or migrations applied to the RDS instance.

- [ ] **Step 4: Check LangGraph Agent Readiness**
Run:
```bash
curl -s http://localhost:2026/api/langgraph/ok | grep -q "ok" && echo "PASS" || echo "FAIL"
```
Expected: PASS

---
