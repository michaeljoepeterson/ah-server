const express = require('express');
const rateLimit = require("express-rate-limit");
const router = express.Router();
const {router: userRouter} = require('./user-router');

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 30,
    message:'An error occured.'
});

router.use(limiter);
router.use('/users',userRouter);

module.exports = {router};