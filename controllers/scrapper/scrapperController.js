import dotenv from "dotenv";

dotenv.config();
import { hiringCafeCardJobDetail } from "./playrightScript.js";
import { exportJobsToExcel } from "./htmlToxls.js";
import {cleanHtml} from "./scrapperCleaner.js"

export const Scrapper = async (req, res) => {
  try {
    const url = req.body.url
    const data = await hiringCafeCardJobDetail(url)
    const JsonFormatJobsData = cleanHtml(data)

    exportJobsToExcel(JsonFormatJobsData)
    res.status(200).send({data: JsonFormatJobsData }); // <-- use resp.data
  } catch (error) {
    console.error(error); 
    res.status(500).send({ error: error.message });
  }
};
