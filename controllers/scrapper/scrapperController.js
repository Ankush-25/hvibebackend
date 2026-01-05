import dotenv from "dotenv";

dotenv.config();
import { hiringCafeCardJobDetail } from "./playrightScript.js";
import { exportJobsToExcel } from "./htmlToxls.js";
import { cleanHtml } from "./scrapperCleaner.js";
import { addJobToWordPress } from "../wpDataInserter/datainserter.js";

export const Scrapper = async (req, res) => {
  try {
    const url = req.body.url;
    const data = await hiringCafeCardJobDetail(url);
    const JsonFormatJobsData = cleanHtml(data);

    // for (const job of JsonFormatJobsData) {
    //   await addJobToWordPress(job);
    //   console.log(`${job} is added`);
    // }
    // exportJobsToExcel(JsonFormatJobsData);
    res.status(200).send({ data: data }); // <-- use resp.data
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: error.message });
  }
};
