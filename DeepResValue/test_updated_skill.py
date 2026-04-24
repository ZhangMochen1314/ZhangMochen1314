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
        # 发送高级多重插补的指令，故意不提怎么填，看模型能不能调对 statspai.mice
        input_box.fill("@DeepResValue-DataClean 帮我用高级的多重插补方法填补刚上传数据集里的所有缺失值。请优先使用 statspai 进行处理，并给我输出前5行结果。")
        
        print("Sending message...")
        input_box.press('Enter')
        
        print("Waiting for agent to finish reasoning and execution (waiting 45 seconds)...")
        time.sleep(45)
        
        print("Capturing final state...")
        page.screenshot(path='/workspace/deer-flow/output/qa/screenshots/skill_update_test.png', full_page=True)
        
        print("\n--- Chat History (Last 2 Messages) ---")
        messages = page.locator('.prose').all_inner_texts()
        for i, msg in enumerate(messages[-2:]):
            print(f"[{i}]: {msg}\n")
            
        browser.close()

if __name__ == "__main__":
    run()
