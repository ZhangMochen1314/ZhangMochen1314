import os
import csv
import random
import httpx
import json
import asyncio

# 1. 生成模拟的空间计量数据
random.seed(42)
n_regions = 50
file_path = '/workspace/spatial_mock.csv'

with open(file_path, 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow(['region', 'gdp', 'pop', 'edu', 'lon', 'lat'])
    for i in range(1, n_regions + 1):
        writer.writerow([
            f"Region_{i}",
            round(random.gauss(50000, 10000), 2),  # GDP
            round(random.gauss(500, 100), 2),      # 人口
            round(random.gauss(12, 2), 2),         # 教育水平
            round(random.uniform(110, 120), 4),    # 经度
            round(random.uniform(30, 40), 4)       # 纬度
        ])
print("============================================================")
print("✅ 1. 模拟空间面板数据 spatial_mock.csv (50个区域) 已生成")

# 2. 运行端到端测试
async def run_test():
    base_url = "http://localhost:8001/api"
    
    async with httpx.AsyncClient(timeout=600.0) as client:
        # Create Thread
        res = await client.post(f"{base_url}/threads", json={})
        tid = res.json()['thread_id']
        print(f"✅ 2. 线程已创建: {tid}")
        
        # Upload File
        with open(file_path, 'rb') as f:
            files = {'files': ('spatial_mock.csv', f, 'text/csv')}
            res = await client.post(f"{base_url}/threads/{tid}/uploads", files=files)
            if res.status_code == 200:
                print(f"✅ 3. 文件已成功上传至智能体!")
            else:
                print(f"❌ 文件上传失败: {res.text}")
                return
            
        # Send Message
        payload = {
            "assistant_id": "lead_agent",
            "input": {
                "messages": [{"role": "user", "content": "我刚刚上传了 spatial_mock.csv 数据集。请以 gdp 为因变量，pop 和 edu 为自变量，利用 lon 和 lat 作为地理坐标计算距离权重矩阵，帮我进行一个空间自回归模型(SAR)分析，并解释核心变量的回归结果和空间溢出效应。"}]
            },
            "config": {
                "recursion_limit": 100,
                "configurable": {
                    "model_name": "deepseek-reasoner",
                    "thinking_enabled": True
                }
            },
            "stream_mode": ["messages"]
        }
        
        print("⏳ 4. 正在请求空间计量分析，等待大模型调用 StatsPAI 引擎处理（由于涉及模型训练和空间权重矩阵计算，请耐心等待）...")
        print("-" * 60)

        async with client.stream("POST", f"{base_url}/threads/{tid}/runs/stream", json=payload) as response:
            async for line in response.aiter_lines():
                if line.startswith("data: "):
                    data_str = line[6:]
                    if data_str == "[DONE]":
                        break
                    try:
                        data = json.loads(data_str)
                        if isinstance(data, list) and len(data) > 0:
                            msg = data[0]
                            if msg.get("type") == "AIMessageChunk":
                                content = msg.get("content", "")
                                reasoning = msg.get("additional_kwargs", {}).get("reasoning_content", "")
                                if reasoning:
                                    print(f"\033[90m{reasoning}\033[0m", end="", flush=True)
                                if content:
                                    print(f"\033[92m{content}\033[0m", end="", flush=True)
                    except json.JSONDecodeError:
                        pass
        print("\n" + "-" * 60)
        print("✅ 端到端测试完成")

if __name__ == "__main__":
    asyncio.run(run_test())
