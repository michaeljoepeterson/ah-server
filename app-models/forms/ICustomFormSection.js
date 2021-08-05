const { BaseModel } = require("../base-model");

/**
 * app model for a form section
 */
class IFormSection extends BaseModel{

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
        
        if(data){
            this.init(data);
        }
    }
}

module.exports = {IFormSection};