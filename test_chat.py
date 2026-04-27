from playwright.sync_api import sync_playwright
import time

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        # 捕捉任何错误
        page.on("pageerror", lambda exc: print(f"ERROR: {exc}"))
        page.on("console", lambda msg: print(f"CONSOLE: {msg.text}"))
        
        print("Navigating...")
        page.goto('http://localhost:2026')
        page.wait_for_load_state('networkidle')
        
        # 等待 React 挂载到 root
        page.wait_for_selector("#root > div", timeout=10000)
        
        print("Finding input box...")
        # 查找通用的输入框 (比如 placeholder 包含输入、Message 或类名相关的 textarea)
        input_box = page.locator('textarea').first
        if not input_box.is_visible():
            input_box = page.locator('input[type="text"]').first
            
        if input_box.is_visible():
            print("Input box found. Typing message...")
            input_box.fill("Hello, DeepResValue! Are you there?")
            
            # 寻找发送按钮并点击，或者直接按 Enter
            input_box.press('Enter')
            print("Message sent! Waiting for response...")
            
            # 等待几秒钟让后台处理
            time.sleep(10)
            
            print("Capturing final state...")
            page.screenshot(path='/workspace/deer-flow/output/qa/screenshots/playwright_chat_result.png', full_page=True)
            print("Test finished successfully!")
        else:
            print("Could not find an input box to test chat.")
            page.screenshot(path='/workspace/deer-flow/output/qa/screenshots/playwright_no_input.png', full_page=True)
            
        browser.close()

if __name__ == "__main__":
    run()
