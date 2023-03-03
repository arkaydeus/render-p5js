const playwright = require('playwright')

;(async () => {
  const browser = await playwright.chromium.launch()
  const page = await browser.newPage()
  await page.goto('http://[::]:9000/squiggle-renderer.html')
  await page.screenshot({ path: 'example.png' })

  await browser.close()
})()
