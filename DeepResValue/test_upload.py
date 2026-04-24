import requests
import json
import time

def test_upload_and_chat():
    print("1. Creating a new thread...")
    res = requests.post("http://localhost:8001/api/threads", json={})
    if res.status_code != 200:
        print("Failed to create thread:", res.text)
        return
    thread_id = res.json().get("thread_id")
    print(f"Created thread: {thread_id}")

    print("2. Uploading test_data_missing.csv...")
    with open("/workspace/deer-flow/test_data_missing.csv", "rb") as f:
        files = {"files": ("test_data_missing.csv", f, "text/csv")}
        upload_res = requests.post(f"http://localhost:8001/api/threads/{thread_id}/uploads", files=files)
        
    if upload_res.status_code != 200:
        print("Upload failed:", upload_res.text)
        return
    print("Upload successful:", upload_res.json())

    print("3. Sending chat request to clean data...")
    payload = {
        "assistant_id": "lead_agent",
        "input": {
            "messages": [{
                "role": "user", 
                "content": "@DeepResValue-DataClean 帮我用 statspai 清洗一下刚上传的数据集里的缺失值。数值型用中位数填充，类别型用众数填充。如果 statspai 报错不支持，请自动用 pandas 处理。最后给我输出前5行清洗后的数据。"
            }]
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

    # Stream the response
    response = requests.post(f"http://localhost:2024/threads/{thread_id}/runs/stream", json=payload, stream=True)
    
    print("\n--- Assistant Response ---")
    buffer = ""
    for line in response.iter_lines():
        if line:
            line = line.decode('utf-8')
            if line.startswith("data: "):
                data_str = line[6:]
                if data_str == "[DONE]":
                    break
                try:
                    data = json.loads(data_str)
                    if isinstance(data, list) and len(data) > 0:
                        chunk = data[0]
                        if chunk.get("type") == "AIMessageChunk":
                            # Handle thinking/reasoning content
                            kwargs = chunk.get("additional_kwargs", {})
                            if "reasoning_content" in kwargs and kwargs["reasoning_content"]:
                                print(f"\033[90m{kwargs['reasoning_content']}\033[0m", end="", flush=True)
                            
                            # Handle actual content
                            if chunk.get("content"):
                                print(f"\033[92m{chunk['content']}\033[0m", end="", flush=True)
                            elif "kwargs" in chunk and "content" in chunk["kwargs"] and chunk["kwargs"]["content"]:
                                print(f"\033[92m{chunk['kwargs']['content']}\033[0m", end="", flush=True)
                except json.JSONDecodeError:
                    pass

    print("\n\n--- Test Complete ---")

if __name__ == "__main__":
    test_upload_and_chat()
