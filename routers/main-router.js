const express = require('express');
const rateLimit = require("express-rate-limit");
const router = express.Router();
const {router: userRouter} = require('./user-router');
const {router: folderRouter} = require('./folder-router');
const {UserColleciton} = require('../fb-models/user-collection');

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 30,
    message:'An error occured.'
});
router.use(limiter);
router.get('/test',async(req,res,next) => {
    try{
        let db = new UserColleciton();
        let docs = await db.testGet();
        return res.json({
            docs
        });
    }
    catch(e){
        let message = 'Error test';
        console.warn(message,e);
        res.err = e;
        res.errMessage = message;
        next();
    }
})
router.use('/users',userRouter);
router.use('/folders',folderRouter);

module.exports = {router};