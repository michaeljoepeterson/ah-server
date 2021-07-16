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
        this.files = null;
        this.subFolders = null;
        /**
         * track folders added combined with folder handle to get unique id
         */
        this.folderCount = 0;
        /**
         * track files added combined with file handle to get unique id
         */
        this.fileCount = 0;

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
            if(keyLookup[key] && data[key]){
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

    /**
     * update a folder from the provided folder
     * @param {Folder} newFolder 
     */
    updateFolder(newFolder){
        this.initFolder(newFolder);
    }

    /**
     * 
     * @param {PatientFile} newFile 
     */
    updateFile(newFile){
        let fileIndex = this.files.findIndex((file) => file.id === newFile.id);
        if(fileIndex >= 0){
            this.files[fileIndex] = newFile;
        }
    }

    /**
     * delete a sub folder
     * @param {string} id 
     */
    deleteSubFolder(id){
        this.subFolders = this.subFolders.filter(folder => folder.id !== id);
    }

    /**
     * delete a file
     * @param {string} id 
     */
    deleteFile(id){
        this.files = this.files.filter(file => file.id !== id);
    }
}

module.exports = {Folder};