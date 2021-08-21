//model to represent a custom field value for a file/response from a custom form
const mongoose = require('mongoose');
const {IUser} = require('../../app-models/user');
const {IForm} = require('../../app-models/forms/ICustomForm');
const { IFormField } = require('../../app-models/forms/ICustomFormField');
const { IPFile } = require('../../app-models/IPFile');

//possible values
var valueSchema = mongoose.Schema({
    stringValue:{type:String, default:null},
    numberValue:{type:Number, default:null},
    arrayValue:{type:Array, default:null},
    objectValue:{type:Object, default:null},
    dateValue:{type:Date, default:null}
}, { _id : false });

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
    parentFile:{ type: mongoose.Schema.Types.ObjectId, ref: 'PFile', unique: false, required: [true, 'No parent file found']},
    value:{type:valueSchema,required:true}
});

fieldValueSchema.methods.serialize = function(){
    let owner = new IUser(this.owner);
    let parentForm = new IForm(this.parentForm);
    let parentField = new IFormField(this.parentField);
    let parentFile = new IPFile(this.parentFile);
	return{
		name: this.name || '',
        owner,
        ancestorSections: this.ancestorSections,
        parentSection: this.parentSection,
        sortOrder: this.sortOrder,
        createdAt: new Date(this.createdAt),
        fieldType:this.fieldType,
        fieldOptions:this.fieldOptions,
        min:this.min,
        max:this.max,
        parentForm,
        id:this._id,
        parentFile,
        parentField,
        value:this.value
	};
}

/**
 * @serialize return the data in a formatted object for optional use with interface models
 */
const FieldValue = mongoose.model('FieldValue',fieldValueSchema);

module.exports = {FieldValue};