from playwright.sync_api import sync_playwright

print("Starting playwright testing...")
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    
    # 监听 console 输出
    page.on("console", lambda msg: print(f"Browser Console: {msg.text}"))
    page.on("pageerror", lambda exc: print(f"Browser Error: {exc}"))
    
    print("Navigating to http://localhost:2026...")
    page.goto('http://localhost:2026')
    
    print("Waiting for networkidle...")
    page.wait_for_load_state('networkidle')
    
    print("Page content:")
    print(page.content()[:500])
    
    browser.close()
    print("Playwright test complete!")
