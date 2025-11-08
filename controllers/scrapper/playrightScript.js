import { chromium } from "playwright";export async function hiringCafeCardJobDetail(url) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);

  const cards = await page.$$('div.relative.bg-white.rounded-xl');
  console.log(`Found ${cards.length} cards`);

  const results = [];

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    try {
      await card.scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      await card.hover();
      await page.waitForTimeout(900);

      let actualApplyUrl = null;

      try {
        const popupPromise = page.waitForEvent('popup', { timeout: 5000 });

        await card.evaluate((el) => {
          const buttons = Array.from(el.querySelectorAll('button'));
          const applyButton = buttons.find(b =>
            b.textContent.trim().includes('Apply Directly')
          );
          if (applyButton) applyButton.click();
        });

        const popup = await popupPromise;
        await popup.waitForLoadState('networkidle');
        actualApplyUrl = popup.url();
        await popup.close();

      } catch (error) {
        console.error(`✗ Card ${i + 1}: No popup (${error.message})`);
      }

      let cardHTML = await card.evaluate(el => el.outerHTML);

      if (actualApplyUrl) {
        cardHTML = cardHTML.replace(
          /^<div/,
          `<div data-actual-apply-url="${actualApplyUrl.replace(/"/g, '&quot;')}"`
        );
      }

      console.log(`✓ Card ${i + 1} processed`);
      results.push(cardHTML);

    } catch (err) {
      console.error(`Error scraping card ${i + 1}: ${err.message}`);
    }
  }

  await browser.close();
  return results.join('\n\n');
}
