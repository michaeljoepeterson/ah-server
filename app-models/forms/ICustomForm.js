const { BaseModel } = require("../base-model");

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