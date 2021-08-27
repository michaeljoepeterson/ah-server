const express = require('express');
const rateLimit = require("express-rate-limit");
const router = express.Router();
const {router: userRouter} = require('./user-router');
const {router: folderRouter} = require('./folder-router');
const {router: formRouter} = require('./form-router');
const {router: fileRouter} = require('./patient-file-router');

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 30,
    message:'An error occured.'
});
router.use(limiter);
router.use('/users',userRouter);
router.use('/folders',folderRouter);
router.use('/form',formRouter);
router.use('/files',fileRouter);

module.exports = {router};