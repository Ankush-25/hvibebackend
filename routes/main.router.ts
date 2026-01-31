import express from 'express';
import userRouter from './user.router.js';
import jobRouter from './job.Router.js';
import ScrapeRouter from "./Scrape.Router.js";
import companyRouter from './companies.Router.js';

const mainRouter = express.Router();
const basepath = process.env.NDE_ENV === 'production' ? '/api' : '/';

mainRouter.use(userRouter);
mainRouter.use(jobRouter);
mainRouter.use(companyRouter);
mainRouter.use(ScrapeRouter);
mainRouter.get(basepath, (req, res) => (
    res.send("Welcome to HiringStores!"))
);

export default mainRouter;    