const { Folder } = require('../app-models/folder');
const {FirebaseCollection} = require('./fb-collection');

class FolderColleciton extends FirebaseCollection{
    constructor(){
        super();
        //todo get from user settings
        this.collection = 'folders';
    }

    /**
     * create a new folder
     * @param {*} folder 
     */
    async createFolder(folder){
        try{
            let data = folder.serialize();
            let handle = this.handleize(data.name);
            data.id = handle;
            await this.db.collection(this.collection).doc(handle).set(data,{merge:true});
        }
        catch(e){
            console.log('error creating user: ',e);
            throw e;
        }
    }

    async createSubFolder(folder){

    }
    
    async createFile(file){

    }

    async getFolder(handle){

    }

    /**
     * get folders for the provided owner
     * @param {string} email 
     * @returns folder array
     */
    async getFolders(email){
        try{
            let query = this.db.collection(this.collection).where('owner','==',email);
            let folderData = await query.get();
            let folders = [];
            folderData.forEach(doc =>{
                let docData = doc.data();
                docData.id = doc.id;
                let folder = new Folder(docData);
                folders.push(folder);
            });
            return folders;
        }
        catch(e){
            console.log('error getting user by email:',e);
            throw e;
        }
    }
}

module.exports = {FolderColleciton};