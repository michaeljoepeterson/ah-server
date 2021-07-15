const {BaseModel} = require('./base-model');

/**
 * base model to represent the patient file data
 */
class PatientFile extends BaseModel{
    constructor(data){
        super();
        this.name = null;
        this.id = null;
        /**
         * hold any custom fields
         */
        this.customFields = [];

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

module.exports = {PatientFile};