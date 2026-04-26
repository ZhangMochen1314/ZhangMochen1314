from playwright.sync_api import sync_playwright
import time

def test_admin_flow():
    print("Starting Admin Flow Test...")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()
        
        try:
            # 1. Go to homepage
            print("1. Navigating to homepage...")
            page.goto('http://localhost:3000')
            page.wait_for_load_state('networkidle')
            
            # 2. Click Login / Register button in Navbar
            print("2. Clicking Login/Register button...")
            page.locator('text="登录 / 注册"').click()
            page.wait_for_selector('text="欢迎回来"')
            
            # 3. Fill in admin credentials
            print("3. Filling admin credentials...")
            page.locator('input[type="email"]').fill('3398796693@qq.com')
            page.locator('input[type="password"]').fill('Zmc20010469')
            
            # 4. Submit login
            print("4. Submitting login...")
            page.locator('button:has-text("立即登录")').click()
            
            # 5. Wait for login to complete and modal to close
            print("5. Waiting for login to complete...")
            page.wait_for_selector('text="登录 / 注册"', state='hidden', timeout=5000)
            
            # 6. Verify Admin button appears in Navbar
            print("6. Verifying Admin button in Navbar...")
            admin_btn = page.locator('a[title="管理后台"]')
            admin_btn.wait_for(state='visible')
            print("   ✅ Admin button found in Navbar!")
            
            # 7. Click Admin button to go to Dashboard
            print("7. Navigating to Admin Dashboard...")
            admin_btn.click()
            page.wait_for_load_state('networkidle')
            page.wait_for_selector('text="Admin System"')
            print("   ✅ Reached Admin Dashboard!")
            
            # 8. Test generating a new Beta Code
            print("8. Testing Beta Code generation...")
            # Click the Invites tab
            page.locator('button:has-text("Access Control")').click()
            page.wait_for_selector('text="Access Control Matrix"')
            
            # Fill new code
            test_code = "TESTCODE2026"
            page.locator('input[placeholder="e.g. DEEPRESVALUE"]').fill(test_code)
            
            # Handle the alert dialog that will pop up
            page.on("dialog", lambda dialog: dialog.accept())
            
            # Click Generate
            page.locator('button:has-text("Generate Key")').click()
            
            # Wait for the table to update
            time.sleep(1) # Small wait for fetch to complete
            page.wait_for_selector(f'text="{test_code}"')
            print(f"   ✅ Successfully generated and verified new beta code: {test_code}!")
            
            print("\n🎉 ALL TESTS PASSED SUCCESSFULLY! The Admin flow works perfectly.")
            
        except Exception as e:
            print(f"\n❌ TEST FAILED: {str(e)}")
            page.screenshot(path='/workspace/admin_test_failure.png', full_page=True)
            print("Screenshot saved to /workspace/admin_test_failure.png")
            raise e
        finally:
            browser.close()

if __name__ == "__main__":
    test_admin_flow()