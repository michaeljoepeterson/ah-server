const {BaseModel} = require('./base-model');
const { PatientFile } = require('./patientFile');

/**
 * base model to represent the folder data
 */
class Folder extends BaseModel{
    constructor(data){
        super();
        this.name = null;
        this.owner = null;
        this.id = null;
        this.files = [];
        this.subFolders = [];

        if(data){
            this.initFolder(data);
        }
    }

    /**
     * create folders and child files and folders
     * @param {*} data 
     */
    initFolder(data){
        const subFolderName = 'subFolders';
        const fileName = 'files';
        
        let keys = Object.keys(this);
        let dataKeys = Object.keys(data);
        let keyLookup = {};
        dataKeys.forEach(key => {
            if(key !== subFolderName && key !== fileName){
                keyLookup[key] = key;
            }
        });

        keys.forEach(key => {
            if(keyLookup[key]){
                this[key] = data[key];
            }
        });

        if(data[subFolderName]){
            this.subFolders = data[subFolderName].map(folder => new Folder(folder));
        }

        if(data[fileName]){
            this.files = data[fileName].map(file => new PatientFile(file)); 
        }
    }
}

module.exports = {Folder};