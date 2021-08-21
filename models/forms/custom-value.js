//model to represent a custom field value for a file/response from a custom form
const mongoose = require('mongoose');
//create standalone instance of field value when filling out form
const fieldValueSchema = mongoose.Schema({
    name:{type:String,required:true},
    createdAt:{type:Date},
    owner:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: false, required: [true, 'No owner found']},
    ancestorSections:{type:Array,default:[]},
    parentSection:{type:String,default:null},
    sortOrder:{type:Number,default:0},
    fieldType:{type:String,required:true},
    fieldOptions:{type:Array},
    min:{type:String},
    max:{type:String},
    parentForm:{ type: mongoose.Schema.Types.ObjectId, ref: 'Form', unique: false, required: [true, 'No form found']},
    parentField:{ type: mongoose.Schema.Types.ObjectId, ref: 'FormField', unique: false, required: [true, 'No field found']},
    parentFile:{ type: mongoose.Schema.Types.ObjectId, ref: 'PFile', unique: false, required: [true, 'No parent file found']}
});

const FieldValue = mongoose.model('FieldValue',fieldValueSchema);

module.exports = {FieldValue};