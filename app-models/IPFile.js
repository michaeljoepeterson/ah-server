const {BaseModel} = require('./base-model');

/**
 * base model to represent the patient file data
 */
class IPFile extends BaseModel{
    constructor(data){
        super();
        this.name = null;
        this.id = null;
        this.ancestors = null;
        this.parent = null;
        /**
         * hold any custom fields
         */
        this.customFields = [];
        this.sortOrder = null;

        if(data){
            this.init(data);
        }
    }

    /**
     * 
     * @param {PatientFile} file 
     */
    updateFile(file){
        this.init(file)
    }
}

module.exports = {IPFile};