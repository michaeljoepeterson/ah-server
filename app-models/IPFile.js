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
        this.customFields = [];
        this.sortOrder = null;
        this.patientId = null;
        this.weight = null;
        this.height = null;
        this.activityLevel = null;
        this.formType = null;
        
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