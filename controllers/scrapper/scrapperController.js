import Firecrawl from "@mendable/firecrawl-js";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
const firecrawl = new Firecrawl({ apiKey: process.env.fireCrawlApi });
// import * as cheerio from 'cheerio';


const scdata = [
    {
      company: "Tata Consultancy Services (TCS)",
      career_page: "https://www.tcs.com/careers",
    },
    { company: "Infosys", career_page: "https://www.infosys.com/careers" },
    { company: "Wipro", career_page: "https://careers.wipro.com" },
    {
      company: "HCL Technologies",
      career_page: "https://www.hcltech.com/careers",
    },
    { company: "Tech Mahindra", career_page: "https://careers.techmahindra.com" },
    {
      company: "Capgemini India",
      career_page: "https://www.capgemini.com/in-en/careers/",
    },
    {
      company: "IBM India",
      career_page: "https://www.ibm.com/in-en/employment/",
    },
    {
      company: "Accenture India",
      career_page: "https://www.accenture.com/in-en/careers",
    },
  {
    company: "Oracle India",
    career_page:
      "careers.oracle.com/en/sites/jobsearch/jobs?location=India&locationId=300000000106947",
  },
    {
      company: "Microsoft India",
      career_page:
        "https://careers.microsoft.com/v2/global/en/locations/india.html",
    },
];



// console.log(text);
export const Scrapper = async (req, res) => {
    try {
        const results = [];
       
        // / change this in the single file
        for (let i = 0; i < scdata.length; i++) {
            const item = scdata[i];
            const scrapedDoc = await firecrawl.scrape(item.career_page, {
                formats: ["markdown", "html"],
            });
            
            if (!scrapedDoc || scrapedDoc.length === 0) {
                throw new Error("Data not scraped");
            }
        // const $ = cheerio.load(results);
        // // Remove useless elements
        // $('script, style, nav, footer, header, svg, noscript, iframe, button, input, textarea, dialog').remove();

        // // Extract only visible text
        // let text = $('body').text();
        // console
        // // Clean extra whitespace
        // text = text.replace(/\s+/g, ' ').trim();

    //   results.push({
    //     company: item.company,
    //     data: scrapedDoc,
    //   });
    }

    res.send({ message: "working", text });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
};

export default Scrapper;
