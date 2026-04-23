import httpx
import json
import asyncio
import sys

API_BASE = "http://localhost:8001/api"

async def test_agent():
    print("=" * 60)
    print("🦌 DeerFlow 2.0 智能体连接测试 (Python)")
    print("=" * 60)
    
    # 设置较长的超时时间 (600秒)，因为 deepseek-reasoner 等大模型可能需要较长时间思考
    async with httpx.AsyncClient(timeout=600.0) as client:
        print("\n[1/3] 正在创建对话线程 (Thread)...")
        try:
            res = await client.post(f"{API_BASE}/threads", json={})
            if res.status_code != 200:
                print(f"❌ 创建线程失败: HTTP {res.status_code} - {res.text}")
                return
            
            thread_id = res.json().get("thread_id")
            print(f"✅ 线程创建成功! Thread ID: {thread_id}")
        except httpx.ConnectError:
            print(f"❌ 连接到 DeerFlow 网关失败！\n请确保后端服务 (端口 8001) 正在运行。可以尝试执行: cd /workspace/deer-flow/backend && make run")
            return
        except httpx.TimeoutException:
            print(f"❌ 创建线程请求超时！")
            return
            
        print("\n[2/3] 正在发送测试消息并等待流式响应...")
        payload = {
            "assistant_id": "lead_agent",  # 确保与你的 agent id 一致
            "input": {
                "messages": [
                    {"role": "user", "content": "你好，请简单介绍一下你能做什么？"}
                ]
            },
            "stream_mode": ["messages"]  # 要求返回 messages 事件流
        }
        
        try:
            async with client.stream("POST", f"{API_BASE}/threads/{thread_id}/runs/stream", json=payload) as response:
                if response.status_code != 200:
                    print(f"❌ 流式请求失败: HTTP {response.status_code}")
                    print(await response.aread())
                    return
                
                print("✅ 成功连接到流！开始接收数据：\n")
                print("-" * 60)
                
                current_event = None
                
                # 遍历服务器发送的每一行数据 (SSE 格式)
                async for line in response.aiter_lines():
                    if not line.strip():
                        continue
                        
                    if line.startswith("event: "):
                        current_event = line[7:].strip()
                        
                    elif line.startswith("data: "):
                        data_str = line[6:]
                        if data_str == "[DONE]":
                            print("\n\n✅ 响应结束。")
                            break
                            
                        # 捕捉 messages 或 messages/partial 事件
                        if current_event in ["messages", "messages/partial"]:
                            try:
                                chunk = json.loads(data_str)
                                if isinstance(chunk, list) and len(chunk) > 0:
                                    msg_data = chunk[0]
                                    if msg_data.get("type") == "AIMessageChunk":
                                        # 获取内容和推理过程 (思考过程)
                                        content = msg_data.get("content", "")
                                        reasoning = msg_data.get("additional_kwargs", {}).get("reasoning_content", "")
                                        
                                        # 打印思考过程 (灰色)
                                        if reasoning:
                                            sys.stdout.write(f"\033[90m{reasoning}\033[0m")
                                            sys.stdout.flush()
                                        
                                        # 打印最终内容 (绿色)
                                        if content:
                                            sys.stdout.write(f"\033[92m{content}\033[0m")
                                            sys.stdout.flush()
                            except json.JSONDecodeError:
                                pass
                                
        except httpx.TimeoutException:
            print(f"\n❌ 流式响应超时！(可能模型思考时间过长)")
        except Exception as e:
            print(f"\n❌ 连接错误: {str(e)}")
            
        print("\n" + "-" * 60)
        print("[3/3] 测试完成。")

if __name__ == "__main__":
    asyncio.run(test_agent())
