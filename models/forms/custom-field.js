const mongoose = require('mongoose');
const { IFormField } = require('../../app-models/forms/ICustomFormField');
const {User} = require('../../app-models/user');
const {IForm} = require('../../app-models/forms/ICustomForm');

//act as template for field value
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
    parentForm:{ type: mongoose.Schema.Types.ObjectId, ref: 'Form', unique: false, required: [true, 'No form found']},
    visible:{type:Boolean,default:true}
});
//to do deprecate serialize move to interfaces
formFieldSchema.methods.serialize = function(){
    let owner = new User(this.owner);
    let parentForm = new IForm(this.parentForm);
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
        id:this._id
	};
}

formFieldSchema.statics.getFieldsByForm = async function(id){
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
        return fields.map(field => new IFormField(field.serialize()));
    }
    catch(e){
        throw e;
    }
}

/**
 * model a form field
 * @method getFieldsByForm get the fields for a form
 */
 const FormField = mongoose.model('FormField',formFieldSchema);

 module.exports = {FormField};