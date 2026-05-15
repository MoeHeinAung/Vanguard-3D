const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  const pages = [
    { name: 'dashboard', path: 'home', selector: 'h1:has-text("VANGUARD 3D")' },
    { name: 'draws', path: 'draws', selector: 'h1:has-text("DRAW CONTROL")' },
    { name: 'sales', path: 'sales', selector: 'h1:has-text("SALES ENGINE")' },
    { name: 'offload', path: 'offload', selector: 'h1:has-text("RISK MANAGEMENT")' },
    { name: 'tickets', path: 'tickets', selector: 'h1:has-text("TICKET SUMMARY")' },
    { name: 'agents', path: 'agents', selector: 'h1:has-text("NETWORK NODES")' },
    { name: 'dealers', path: 'master-dealers', selector: 'h1:has-text("MASTER DEALERS")' }
  ];

  try {
    console.log('Starting full visual audit...');
    for (const p of pages) {
      console.log(`Capturing ${p.name}...`);
      await page.goto('http://localhost:5173');

      // Click the navbar button for the page
      const navButton = page.locator(`button:has-text("${p.name}")`).first();
      // Special cases for naming differences
      if (p.name === 'dashboard') await page.goto('http://localhost:5173');
      else if (p.name === 'offload') await page.locator('button:has-text("Risk Management")').click();
      else if (p.name === 'dealers') await page.locator('button:has-text("Dealers")').click();
      else await page.locator(`button:has-text("${p.name}")`).first().click();

      await page.waitForTimeout(1000);
      await page.screenshot({ path: `verification/screenshots/${p.name}.png` });
    }
    console.log('Visual audit complete. Check verification/screenshots/');
  } catch (err) {
    console.error('Verification failed:', err);
  } finally {
    await browser.close();
  }
})();
