import { chromium } from "playwright";

export async function hiringCafeCardJobDetail(url: string) {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);

  const cards = await page.$$("div.relative.bg-white.rounded-xl");
  console.log(`Found ${cards.length} cards`);

  const results: string[] = [];

  for (let i = 0; i < cards.length; i++) {
    const card = cards[i];
    try {
      await card.scrollIntoViewIfNeeded();
      await page.waitForTimeout(200);
      await card.hover();
      await page.waitForTimeout(900);

      let actualApplyUrl: string | null = null;
      let jobrawHtml: string | null = null;

      try {
        const popupPromise = page.waitForEvent("popup", { timeout: 3000 });

        await card.evaluate((el) => {
          const buttons = Array.from(el.querySelectorAll("button"));
          const applyButton = buttons.find((b: HTMLButtonElement) =>
            b.textContent?.trim().includes("Apply Directly"),
          );
          if (applyButton) applyButton.click();
        });

        const popup = await popupPromise;
        await popup.waitForLoadState("networkidle");
        jobrawHtml = await popup.content();
        if (jobrawHtml.length == 0) {
          console.log("I dont find the discription of the job");
        }
        actualApplyUrl = popup.url();
        await popup.close();
      } catch (error: any) {
        console.error(`✗ Card ${i + 1}: No popup (${error.message})`);
      }

      let cardHTML = await card.evaluate((el) => el.outerHTML);
      cardHTML = cardHTML.replace(
        /^<div/,
        `<div job-discription-actual="${(jobrawHtml || "").replace(/"/g, "&quot;")}"`,
      );
      if (actualApplyUrl) {
        cardHTML = cardHTML.replace(
          /^<div/,
          `<div data-actual-apply-url="${actualApplyUrl.replace(
            /"/g,
            "&quot;",
          )}"`,
        );
      }

      console.log(`✓ Card ${i + 1} processed`);
      results.push(cardHTML);
    } catch (err: any) {
      console.error(`Error scraping card ${i + 1}: ${err.message}`);
    }
  }

  await browser.close();
  return results.join("\n\n");
}
