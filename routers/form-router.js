const express = require('express');
const router = express.Router();
const {auth} = require('../middleware/auth');
const {Form} = require('../models/forms/custom-form');
const {IForm} = require('../app-models/forms/ICustomForm');

router.use(auth);

router.post('/',async (req,res,next) => {
    let {form} = req.body;
    try{
        let newForm = new IForm(form);
        newForm.owner = req.userData.id;
        let newFormData = newForm.serialize();
        let createdForm = await Form.create(newFormData);
        createdForm = await Form.findById(createdForm._id).populate('owner');
        res.status(200);
        return res.json({
            message:'Form created',
            form:createdForm.serialize()
        });
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