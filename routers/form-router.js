const express = require('express');
const router = express.Router();
const {auth} = require('../middleware/auth');
const {Form} = require('../models/forms/custom-form');
const {FormSection} = require('../models/forms/custom-form-section');
const {IForm} = require('../app-models/forms/ICustomForm');
const { IFormSection } = require('../app-models/forms/ICustomFormSection');
const { IFormField } = require('../app-models/forms/ICustomFormField');
const { FormField } = require('../models/forms/custom-field');

router.use(auth);

router.get('/:id',async (req,res,next) => {
    let {id} = req.params;
    try{
        let formDoc = await Form.findById(id).populate('owner');
        let form = formDoc.serialize();
        let formSections = await FormSection.getSectionsByForm(id);
        let formFields = await FormField.getFieldsByForm(id);
        form = Form.buildFormTree(form,formSections,formFields);
        return res.json({
            message:'Form created',
            form
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

//create a new form
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

//create a new form section
router.post('/section',async (req,res,next) => {
    let {section} = req.body;
    try{
        let newFormSection = new IFormSection(section);
        newFormSection.owner = req.userData.id;
        let newFormSectionData = newFormSection.serialize();
        let createdFormSection = await FormSection.create(newFormSectionData);
        createdFormSection = await FormSection.findById(createdFormSection._id).populate('owner').populate('parentForm').populate({
            path:'parentForm',
            populate:{
                path:'owner'
            }
        });
        res.status(200);
        return res.json({
            message:'Form section created',
            section:createdFormSection.serialize()
        });
    }
    catch(e){
        let message = 'Error creating form section';
        console.error(message,e);
        res.err = e;
        res.errMessage = message;
        next();
    }
});

//create a new form field
router.post('/field',async (req,res,next) => {
    let {field} = req.body;
    try{
        let newFormField = new IFormField(field);
        newFormField.owner = req.userData.id;
        let newFormFieldData = newFormField.serialize();
        let createdFormField = await FormField.create(newFormFieldData);
        createdFormField = await FormField.findById(createdFormField._id).populate('owner').populate('parentForm').populate({
            path:'parentForm',
            populate:{
                path:'owner'
            }
        });
        res.status(200);
        return res.json({
            message:'Form Field created',
            field:createdFormField.serialize()
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