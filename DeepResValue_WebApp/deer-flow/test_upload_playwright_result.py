from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        print("Navigating to /chat...")
        page.goto('http://localhost:2026/chat')
        page.wait_for_load_state('networkidle')
        
        print("Uploading file test_data_missing.csv...")
        page.set_input_files('input[type="file"]', '/workspace/deer-flow/test_data_missing.csv')
        time.sleep(2)
        
        print("Typing message...")
        input_box = page.locator('textarea').first
        input_box.fill("@DeepResValue-DataClean 帮我清洗一下刚上传的数据集里的缺失值。数值型用中位数填充，类别型用众数填充。如果 statspai 报错不支持，请自动用 pandas 处理。最后给我输出前5行清洗后的数据。")
        
        print("Sending message...")
        input_box.press('Enter')
        
        print("Waiting for agent to finish reasoning and execution (waiting 45 seconds)...")
        # 给模型更长的执行时间（思考、写代码、运行沙盒、回退）
        time.sleep(45)
        
        print("Capturing final state...")
        page.screenshot(path='/workspace/deer-flow/output/qa/screenshots/upload_test_final_result.png', full_page=True)
        
        print("\n--- Chat History (Last 2 Messages) ---")
        messages = page.locator('.prose').all_inner_texts()
        # 打印最后两个消息（即用户发送的问题和大模型的最终回复）
        for i, msg in enumerate(messages[-2:]):
            print(f"[{i}]: {msg}\n")
            
        browser.close()

if __name__ == "__main__":
    run()
