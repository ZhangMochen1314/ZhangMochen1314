from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        page.on("pageerror", lambda exc: print(f"ERROR: {exc}"))
        
        print("Navigating to /chat...")
        page.goto('http://localhost:2026/chat')
        page.wait_for_load_state('networkidle')
        
        print("Looking for textarea...")
        try:
            # 等待 textarea 出现
            input_box = page.locator('textarea').first
            input_box.wait_for(state="visible", timeout=10000)
            
            print("Input box found. Typing message...")
            input_box.fill("你好，DeepResValue！能帮我做个简单的数据清洗吗？")
            
            # 点击发送按钮（通过寻找包含 Send 图标或 disabled 属性相关的 button）
            # 或者直接按下 Enter 触发发送逻辑
            input_box.press('Enter')
            print("Message sent! Waiting for agent response...")
            
            # 记录发送前后的截图
            page.screenshot(path='/workspace/deer-flow/output/qa/screenshots/playwright_chat_sent.png', full_page=True)
            
            # 等待较长时间让模型（尤其是 DeepSeek 思考模型）返回
            time.sleep(20)
            
            print("Capturing final state...")
            page.screenshot(path='/workspace/deer-flow/output/qa/screenshots/playwright_chat_result.png', full_page=True)
            
            # 抓取页面上的回复内容以验证是否得到了回答
            print("Chat History:")
            messages = page.locator('.prose').all_inner_texts()
            for i, msg in enumerate(messages):
                print(f"[{i}]: {msg[:100]}...")
                
            print("Test finished successfully!")
        except Exception as e:
            print(f"Test failed: {e}")
            page.screenshot(path='/workspace/deer-flow/output/qa/screenshots/playwright_error.png', full_page=True)
            
        browser.close()

if __name__ == "__main__":
    run()
