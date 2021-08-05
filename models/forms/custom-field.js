const mongoose = require('mongoose');

const formFieldSchema = mongoose.Schema({
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
    parentForm:{ type: mongoose.Schema.Types.ObjectId, ref: 'Form', unique: false, required: [true, 'No form found']}
});

formFieldSchema.methods.serialize = function(){
	return{
		name: this.name || '',
        owner:this.owner ? this.owner.serialize() : null,
        ancestorSections: this.ancestorSections,
        parentSection: this.parentSection,
        sortOrder: this.sortOrder,
        createdAt: new Date(this.createdAt),
        fieldType:this.fieldType,
        fieldOptions:this.fieldOptions,
        min:this.min,
        max:this.max,
        parentForm: this.parentForm ? this.parentForm.serialize() : null,
        id:this._id
	};
}

/**
 * model a form field
 */
 const FormField = mongoose.model('FormField',formFieldSchema);

 module.exports = {FormField};