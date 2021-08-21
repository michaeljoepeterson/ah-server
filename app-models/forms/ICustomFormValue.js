const { BaseModel } = require("../base-model");

class IFormValue extends BaseModel{
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
        this.value = null;
        this.parentField = null;
        this.parentFile = null;
        
        if(data){
            this.init(data);
        }
    }
}

module.exports = {IFormValue};