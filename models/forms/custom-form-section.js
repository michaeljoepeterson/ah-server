const mongoose = require('mongoose');
const { IFormSection } = require('../../app-models/forms/ICustomFormSection');

const formSectionSchema = mongoose.Schema({
    name:{type:String,required:true},
    createdAt:{type:Date},
    owner:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: false, required: [true, 'No owner found']},
    ancestorSections:{type:Array,default:[]},
    parentSection:{type:String,default:null},
    parentForm:{ type: mongoose.Schema.Types.ObjectId, ref: 'Form', unique: false, required: [true, 'No form found']},
    sortOrder:{type:Number,default:0},
    visible:{type:Boolean,default:true}
});

formSectionSchema.methods.serialize = function(){
	return{
		name: this.name || '',
        owner:this.owner ? this.owner.serialize() : null,
        ancestorSections: this.ancestorSections,
        parentSection: this.parentSection,
        sortOrder: this.sortOrder,
        parentForm: this.parentForm ? this.parentForm.serialize() : null,
        createdAt: new Date(this.createdAt),
        id:this._id
	};
}

formSectionSchema.statics.getSectionsByForm = async function(id){
	try{
        let query = {
            parentForm:id
        };
        let fields = await this.find(query).populate('owner').populate('parentForm').populate({
            path:'parentForm',
            populate:{
                path:'owner'
            }
        });
        return fields.map(field => new IFormSection(field.serialize()));
    }
    catch(e){
        throw e;
    }
}

/**
 * model a form section
 * @method getSectionsByForm find all fields for the specified form
 */
 const FormSection = mongoose.model('FormSection',formSectionSchema);

 module.exports = {FormSection};