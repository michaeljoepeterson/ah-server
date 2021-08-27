const express = require('express');
const router = express.Router();
const {auth} = require('../middleware/auth');
const {FieldValue} = require('../models/forms/custom-value');

router.use(auth);

//get all values for a file
router.get('/values/:id',async (req,res,next) => {
    let {id} = req.params;
    try{
        let values = await FieldValue.find({parentFile:id});
        
        return res.json({
            message:'Found values',
            fieldValues:values
        });
    }
    catch(e){
        let message = 'Error retrieving custom values';
        console.error(message,e);
        res.err = e;
        res.errMessage = message;
        next();
    }
});

module.exports = {router};