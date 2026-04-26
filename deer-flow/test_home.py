from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto('http://localhost:3000')
    page.wait_for_load_state('networkidle')
    
    print("Page Title:", page.title())
    
    # Take a screenshot to verify layout
    page.screenshot(path='/workspace/deer-flow/home_test.png', full_page=True)
    print("Home screenshot saved to /workspace/deer-flow/home_test.png")
    
    browser.close()