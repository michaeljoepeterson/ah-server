const mongoose = require('mongoose');

const formSectionSchema = mongoose.Schema({
    name:{type:String,required:true},
    fields:[{ type: mongoose.Schema.Types.ObjectId, ref: 'FormField', unique: false, required: [false, 'No fields found']}],
    createdAt:{type:Date},
    owner:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: false, required: [true, 'No owner found']},
    ancestorSections:{type:Array,default:[]},
    parentSection:{type:String,default:null},
    parentForm:{ type: mongoose.Schema.Types.ObjectId, ref: 'Form', unique: false, required: [true, 'No form found']},
    sortOrder:{type:Number,default:0}
});

formSectionSchema.methods.serialize = function(){
	return{
		name: this.name || '',
        fields:this.fields ? this.fields.map(field => field.serialize()) : [],
        owner:this.owner ? this.owner.serialize() : null,
        ancestorSections: this.ancestorSections,
        parentSection: this.parentSection,
        sortOrder: this.sortOrder,
        parentForm: this.parentForm ? this.parentForm.serialize() : null,
        createdAt: new Date(this.createdAt),
        id:this._id
	};
}

/**
 * model a form section
 */
 const FormSection = mongoose.model('FormSection',formSectionSchema);

 module.exports = {FormSection};