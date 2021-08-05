const express = require('express');
const router = express.Router();
const {auth} = require('../middleware/auth');

router.use(auth);

router.post('/',async (req,res,next) => {
    try{

    }
    catch(e){
        let message = 'Error creating form';
        console.error(message,e);
        res.err = e;
        res.errMessage = message;
        next();
    }
});

module.exports = {router};