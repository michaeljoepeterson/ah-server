const mongoose = require('mongoose');
const { IForm } = require('../../app-models/forms/ICustomForm');
const { IFormField } = require('../../app-models/forms/ICustomFormField');
const { IFormSection } = require('../../app-models/forms/ICustomFormSection');

const formSchema = mongoose.Schema({
    name:{type:String,required:true,unique:true},
    createdAt:{type:Date},
    owner:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: false, required: true}
});

formSchema.methods.serialize = function(){
	return{
		name: this.name || '',
        owner:this.owner ? this.owner.serialize() : null,
        id:this._id
	};
}

/**
 * 
 * @param {IForm | IFormSection} rootSection 
 * @param {IFormSection[]} subSections 
 * @param {string} parentId 
 */
formSchema.statics.buildFormSectionTree = function(rootSection,subSections,ancestorLength){
    if(!ancestorLength){
        ancestorLength = 0;
    }
    let targetSectionMap = {};
    let rootSectionId = rootSection.id;
	let targetChildSections = subSections.filter(section => {
        if(section.ancestorSections.length === ancestorLength){
            if(ancestorLength > 0 && section.ancestorSections.includes(rootSectionId) || section.ancestorSections.length === 0){
                targetSectionMap[section.id] = section.id;
                return true;
            }
        }
    });
    rootSection.sections = targetChildSections;
    let leftOverSections = subSections.filter(section => !targetSectionMap[section.id]);
    if(leftOverSections.length > 0){
        ancestorLength++;
        targetChildSections.forEach(section => {
            this.buildFormSectionTree(section,leftOverSections,ancestorLength);
        });
    }

    return rootSection;
}

/**
 * 
 * @param {IFormSection} rootSection 
 * @param {IFormField[]} fields 
 * @returns 
 */
formSchema.statics.addFieldsToSection = function(rootSection,fields){
    let rootSectionId = rootSection.id;
    let foundFields = fields.filter(field => field.parentSection == rootSectionId);
    rootSection.fields = foundFields.sort((fieldA, fieldB) => {
        if(fieldA.sortOrder < fieldB.sortOrder){
            return -1;
        }
        else if(fieldA.sortOrder > fieldB.sortOrder){
            return  1;
        }
        else{
            return 0;
        }
    });

    return rootSection;
}


/**
 * build out the form tree structure
 * @param {IFormSection[]} sections 
 * @param {IFormField[]} fields 
 */
formSchema.statics.buildFormTree = function(form,sections,fields){
	try{
        let formFields = fields.filter(field => !field.parentSection);
        form.fields = formFields;
        let sectionFields = fields.filter(field => field.parentSection);
        sections.forEach(section => {
            this.addFieldsToSection(section,sectionFields);
        });
        this.buildFormSectionTree(form,sections,0);
        return form;
    }
    catch(e){
        throw e;
    }
}

/**
 * model a form
 * @methods buildFormTree build out the form tree structure 
 */
 const Form = mongoose.model('Form',formSchema);

 module.exports = {Form};