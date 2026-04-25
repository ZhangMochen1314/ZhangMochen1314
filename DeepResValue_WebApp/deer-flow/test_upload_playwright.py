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
        # 找到隐藏的 input file 并上传
        page.set_input_files('input[type="file"]', '/workspace/deer-flow/test_data_missing.csv')
        time.sleep(2)
        
        print("Typing message...")
        input_box = page.locator('textarea').first
        input_box.fill("@DeepResValue-DataClean 帮我清洗一下刚上传的数据集里的缺失值。如果 statspai 报错不支持，请自动用 pandas 处理。最后给我输出前5行清洗后的数据。")
        
        print("Sending message...")
        input_box.press('Enter')
        
        print("Waiting for agent to process (30 seconds)...")
        time.sleep(30)
        
        print("Capturing final state...")
        page.screenshot(path='/workspace/deer-flow/output/qa/screenshots/upload_test_result.png', full_page=True)
        
        print("Chat History:")
        messages = page.locator('.prose').all_inner_texts()
        for i, msg in enumerate(messages):
            print(f"[{i}]: {msg[:150]}...")
            
        browser.close()

if __name__ == "__main__":
    run()
