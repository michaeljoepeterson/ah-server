const { BaseModel } = require("../base-model");

/**
 * app model for a form field
 */
class IFormField extends BaseModel{

    constructor(data){
        super();
        this.name = null;
        this.id = null;
        this.owner = null;
        this.createdAt = null;
        this.ancestorSections = [];
        this.parentSection = null;
        this.parentForm = null;
        this.sortOrder = 0;
        this.fieldType = null;
        this.fieldOptions = null;
        this.min = null;
        this.max = null;
        
        if(data){
            this.init(data);
        }
    }
}

module.exports = {IFormField};