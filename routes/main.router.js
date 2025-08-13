const express = require('express');
const userRouter = require('./user.router');
const jobRouter = require('./job.Router');
const mainRouter = express.Router();
const basepath = process.env.NDE_ENV === 'production' ? '/api' : '/';
mainRouter.use(userRouter);
mainRouter.use(jobRouter);

mainRouter.get(basepath,(req, res)=>(
    res.send("Welcome to HiringStores!"))
);

module.exports = mainRouter;