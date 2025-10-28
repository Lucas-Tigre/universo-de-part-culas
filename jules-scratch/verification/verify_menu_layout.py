from playwright.sync_api import sync_playwright, expect
import time

def run(playwright):
    browser = playwright.chromium.launch()
    page = browser.new_page()

    # Listen for and print console messages for debugging
    page.on("console", lambda msg: print(f"BROWSER CONSOLE: {msg.text}"))

    try:
        # 1. Navigate to the login page and enter as a guest.
        page.goto("http://localhost:3000/login.html")
        page.locator("#guestModeBtn").click()
        page.locator("#guestConfirmBtn").click()

        # 2. Wait for the game page to load.
        page.wait_for_url("**/game.html", timeout=10000)

        # 3. Open the main menu.
        menu_toggle = page.locator("#menu-toggle")
        expect(menu_toggle).to_be_visible(timeout=10000)
        menu_toggle.click()

        # 4. Click the "Galaxies" menu item.
        galaxies_button = page.locator('.menu-item[data-action="showGalaxies"]')
        expect(galaxies_button).to_be_visible()
        galaxies_button.click()

        # 5. Wait for the galaxy map to appear and click the first unlocked galaxy.
        galaxy_map = page.locator("#galaxy-map")
        expect(galaxy_map).to_be_visible()
        first_galaxy = page.locator(".galaxy.unlocked").first
        expect(first_galaxy).to_be_visible()
        first_galaxy.click()

        # 6. Wait for the game UI to become visible after selecting a galaxy.
        expect(galaxy_map).to_be_hidden()
        health_bar = page.locator("#health-bar-container")
        expect(health_bar).to_be_visible()

        # 7. Now, with the game running, open the menu again to check the layout.
        menu_toggle.click()
        menu = page.locator("#menu")
        expect(menu).to_be_visible()

        # 8. Take the screenshot for verification.
        menu.screenshot(path="jules-scratch/verification/menu_layout_fixed.png")

    finally:
        browser.close()

with sync_playwright() as playwright:
    run(playwright)
