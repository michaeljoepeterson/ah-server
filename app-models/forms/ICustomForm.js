const { BaseModel } = require("../base-model");

/**
 * app model for a form
 */
class IForm extends BaseModel{

    constructor(data){
        super();
        this.name = null;
        this.id = null;
        this.owner = null;
        this.createdAt = null;
        
        if(data){
            this.init(data);
        }
    }
}

module.exports = {IForm};