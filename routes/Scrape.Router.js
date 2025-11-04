const express = require("express");
const ScrapRouter = express.Router();
const scrapControllers = require("../controllers/scrapper/scrapperController");


ScrapRouter.get("/scraped", scrapControllers.Scrapper)


module.exports=ScrapRouter