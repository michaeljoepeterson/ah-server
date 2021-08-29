const express = require('express');
const router = express.Router();
const {auth} = require('../middleware/auth');
const {FieldValue} = require('../models/forms/custom-value');
const { Pfile } = require('../models/p-file');
const {Form} = require('../models/forms/custom-form');
const {FormSection} = require('../models/forms/custom-form-section');

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
/**
 * get and map form values for a file
 */
router.get('/form/values/:id',async (req,res,next) => {
    let {id} = req.params;
    try{
        let patientFile = await Pfile.findById(id);
        let patientForm = await Form.findById(patientFile.formType).populate('owner');;
        let form = patientForm.serialize();
        let formSections = await FormSection.getSectionsByForm(form.id);
        let patientValues = await FieldValue.find({parentFile:id});
        form = Form.buildFormValueTree(form,formSections,patientValues);
        return res.json({
            message:'Found form',
            form
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