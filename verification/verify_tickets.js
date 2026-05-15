const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1440, height: 900 });

  try {
    console.log('Navigating to App...');
    await page.goto('http://localhost:5173');

    console.log('Navigating to Tickets Page...');
    // The navbar uses onNavigate(setCurrentPage)
    // We can try to find the button in the navbar or the dashboard
    const ticketButton = page.locator('button:has-text("TICKET SUMMARY")').first();
    if (await ticketButton.count() > 0) {
        await ticketButton.click();
    } else {
        // Try the Dashboard button
        await page.click('h3:has-text("Ticket Summary")');
    }

    await page.waitForTimeout(2000);
    await page.screenshot({ path: 'verification/screenshots/tickets.png' });

    console.log('Verifying Ticket detail selection...');
    const firstTicket = page.locator('div.group.relative').first();
    if (await firstTicket.count() > 0) {
        await firstTicket.click();
        await page.waitForTimeout(1000);
        await page.screenshot({ path: 'verification/screenshots/tickets_detail.png' });
    }

  } catch (err) {
    console.error('Verification failed:', err);
  } finally {
    await browser.close();
  }
})();
