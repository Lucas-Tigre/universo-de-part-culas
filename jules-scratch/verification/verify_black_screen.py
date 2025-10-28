import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()

        # Capture all console messages
        messages = []
        page.on("console", lambda msg: messages.append(msg.text))

        await page.goto("http://localhost:8080/game.html")
        await page.wait_for_timeout(2000)  # Wait for the game to load

        await page.screenshot(path="jules-scratch/verification/black_screen_with_logs.png")

        await browser.close()

        if messages:
            print("Console messages found:")
            for msg in messages:
                print(msg)
        else:
            print("No console messages.")

if __name__ == "__main__":
    asyncio.run(main())
