import { chromium } from 'playwright'


// export async function hiringCafeCardJobDetail(url) {
//   const browser = await chromium.launch({ headless: true });
//   const page = await browser.newPage();

//   await page.goto(url, { waitUntil: "networkidle" });
//   await page.waitForTimeout(1500);

//   const cards = await page.$$('div.relative.bg-white.rounded-xl');
//   console.log(`Found ${cards.length} cards`);

//   let combinedHTML = '';

//   for (let i = 0; i < cards.length; i++) {
//     const card = cards[i];
    
//     await card.scrollIntoViewIfNeeded();
//     await page.waitForTimeout(200);
//     await card.hover();
//     await page.waitForTimeout(900);

//     let actualApplyUrl = null;

//     try {
//       // Set up listener for new tab BEFORE clicking
//       const popupPromise = page.waitForEvent('popup', { timeout: 5000 });

//       // Click the Apply button
//       await card.evaluate((el) => {
//         const buttons = Array.from(el.querySelectorAll('button'));
//         const applyButton = buttons.find(b => 
//           b.textContent.trim().includes('Apply Directly')
//         );
//         if (applyButton) {
//           applyButton.click();
//         }
//       });

//       // Wait for popup and capture URL
//       const popup = await popupPromise;
//       actualApplyUrl = popup.url();
//       // Close immediately without waiting for load
//       await popup.close();
      
//     } catch (error) {
//       console.error(`✗ Card ${i + 1}: No popup opened (${error.message})`);
//     }

//     // Get card HTML
//     let cardHTML = await card.evaluate(el => el.outerHTML);
    
//     if (actualApplyUrl) {
//       cardHTML = cardHTML.replace(
//         /^<div/,
//         `<div data-actual-apply-url="${actualApplyUrl.replace(/"/g, '&quot;')}"`
//       );
//     }
    
//     combinedHTML += cardHTML + '\n\n';
//     console.log(`${i+1}card Scraped`)
//   }

//   await browser.close();
//   return combinedHTML;
// }

export async function hiringCafeCardJobDetail(url) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);

  const cards = await page.$$('div.relative.bg-white.rounded-xl');
  console.log(`Found ${cards.length} cards`);

  // ✅ Process all cards in parallel
  const results = await Promise.all(
    cards.map(async (card, index) => {
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
          actualApplyUrl = popup.url();
          await popup.close();

        } catch (error) {
          console.error(`✗ Card ${index + 1}: No popup (${error.message})`);
        }

        // Extract card HTML
        let cardHTML = await card.evaluate(el => el.outerHTML);

        if (actualApplyUrl) {
          cardHTML = cardHTML.replace(
            /^<div/,
            `<div data-actual-apply-url="${actualApplyUrl.replace(/"/g, '&quot;')}"`
          );
        }

        console.log(`✓ Card ${index + 1} scraped`);
        return cardHTML;

      } catch (err) {
        console.error(`Error scraping card ${index + 1}: ${err.message}`);
        return null;
      }
    })
  );

  await browser.close();

  // Combine all HTML into a single string
  return results.filter(Boolean).join('\n\n');
}
