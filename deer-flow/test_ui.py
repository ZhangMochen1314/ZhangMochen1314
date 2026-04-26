from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page()
    page.goto('http://localhost:3000/chat')
    page.wait_for_load_state('networkidle')
    
    print("Page Title:", page.title())
    
    # Check if the user profile section is rendered
    profile_button = page.locator('button', has_text='积分')
    if profile_button.count() > 0:
        print("Profile button found. Clicking it...")
        profile_button.first.click()
        page.wait_for_timeout(1000) # Wait for modal
        
        # Take a screenshot of the modal
        page.screenshot(path='/workspace/deer-flow/modal_test.png')
        print("Modal screenshot saved to /workspace/deer-flow/modal_test.png")
        
        # Check if logout button is in the modal
        logout_modal_btn = page.locator('button', has_text='退出登录')
        print("Logout button in modal count:", logout_modal_btn.count())
    else:
        print("Profile button not found. User might not be logged in or selector is wrong.")
        page.screenshot(path='/workspace/deer-flow/page_test.png', full_page=True)
        print("Full page screenshot saved to /workspace/deer-flow/page_test.png")
        
    browser.close()