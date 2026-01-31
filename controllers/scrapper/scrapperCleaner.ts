import * as cheerio from "cheerio";

export function cleanHtml(html: string) {
  try {
    const $ = cheerio.load(html);
    const jobs: any[] = [];

    // ✅ Loop through each job card
    $("[data-actual-apply-url]").each((i, elem) => {
      const $card = $(elem);

      const applyUrl = $card.attr("data-actual-apply-url") || "";
      let rawHtml = $card.attr("job-discription-actual") || "";
      console.log(rawHtml);
      const jobTitle = $card
        .find(
          "span.w-full.font-bold.text-start.line-clamp-3, span.w-full.font-bold.text-start.line-clamp-2",
        )
        .first()
        .text()
        .trim();

      const location = $card
        .find("svg + span.line-clamp-2")
        .first()
        .text()
        .trim();

      const badges: string[] = [];
      $card.find("span.border.rounded.text-xs").each((i, el) => {
        badges.push($(el).text().trim());
      });

      const type = badges.find((b) => b.includes("Time")) || "";
      const mode =
        badges.find((b) => ["Onsite", "Remote", "Hybrid"].includes(b)) || "";

      const yoe =
        $card
          .find("span.bg-sky-50\\/30.border.border-violet-600\\/30")
          .first()
          .text()
          .trim() || "";

      const companyBlock = $card.find("div.flex.mb-4.mt-2");

      const companyName = companyBlock
        .find("span.font-bold")
        .first()
        .text()
        .replace(":", "")
        .trim();

      let CompShortDescription = companyBlock
        .find("span.font-light")
        .first()
        .text()
        .trim();

      // Remove company name part from description
      CompShortDescription = CompShortDescription.replace(companyName, "")
        .replace(":", "")
        .trim();

      const companyLogo = $card.find("img").attr("src") || "";

      const description = $card
        .find("span.line-clamp-6.font-light, span.line-clamp-5.font-light")
        .first()
        .text()
        .replace(/\s+/g, " ")
        .trim();

      const skillsText = $card
        .find("div.flex.flex-col.space-y-1 span.line-clamp-2.font-light")
        .text()
        .trim();

      const skills = skillsText
        ? skillsText
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

      jobs.push({
        jobTitle,
        companyName,
        CompShortDescription,
        companyLogo,
        description,
        skills,
        location,
        yoe,
        type,
        mode,
        applyUrl,
      });
    });

    return jobs;
  } catch (error: any) {
    console.error("Error parsing HTML:", error.message);
    return [];
  }
}
