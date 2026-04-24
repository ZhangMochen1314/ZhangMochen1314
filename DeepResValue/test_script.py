from playwright.sync_api import sync_playwright

print("Starting playwright testing...")
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    
    print("Navigating to http://localhost:2026...")
    page.goto('http://localhost:2026')
    
    print("Waiting for networkidle...")
    page.wait_for_load_state('networkidle')
    
    print("Taking screenshot...")
    page.screenshot(path='/workspace/deer-flow/output/qa/screenshots/playwright_initial.png', full_page=True)
    
    print("Checking page content...")
    title = page.title()
    print(f"Page title: {title}")
    
    # print some element counts to verify rendering
    buttons = page.locator('button').count()
    inputs = page.locator('input').count()
    print(f"Found {buttons} buttons and {inputs} inputs.")
    
    browser.close()
    print("Playwright test complete!")
