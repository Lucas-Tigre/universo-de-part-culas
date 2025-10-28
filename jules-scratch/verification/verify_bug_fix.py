
import asyncio
from playwright.async_api import async_playwright
import subprocess
import os
import time

async def main():
    # Inicia o servidor web em segundo plano
    server_process = subprocess.Popen(["python", "-m", "http.server", "8000"])

    # Aguarda um momento para o servidor iniciar
    await asyncio.sleep(2)

    try:
        async with async_playwright() as p:
            browser = await p.chromium.launch()
            page = await browser.new_page()

            # Navega para a página do jogo
            await page.goto("http://localhost:8000/game.html")

            # Aguarda um momento para o jogo carregar
            await asyncio.sleep(5)

            # Tira uma captura de tela
            await page.screenshot(path="jules-scratch/verification/verification.png")

            await browser.close()
    finally:
        # Encerra o processo do servidor
        server_process.terminate()

if __name__ == "__main__":
    asyncio.run(main())
