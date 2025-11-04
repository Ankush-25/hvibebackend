const express = require('express');
const userRouter = require('./user.router');
const jobRouter = require('./job.Router');
const ScrapeRouter = require("./Scrape.Router")
const companyRouter = require('./companies.Router');
const mainRouter = express.Router();
const basepath = process.env.NDE_ENV === 'production' ? '/api' : '/';
mainRouter.use(userRouter);
mainRouter.use(jobRouter);
mainRouter.use(companyRouter);
mainRouter.use(ScrapeRouter);
mainRouter.get(basepath,(req, res)=>(
    res.send("Welcome to HiringStores!"))
);

module.exports = mainRouter;