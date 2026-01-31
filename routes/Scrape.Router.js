import express from "express";
import * as scrapControllers from "../controllers/scrapper/scrapperController.js";

const ScrapRouter = express.Router();

ScrapRouter.get("/scraped", scrapControllers.Scrapper);

export default ScrapRouter;