const { Folder } = require('../app-models/folder');
const {FirebaseCollection} = require('./fb-collection');

class FolderColleciton extends FirebaseCollection{
    constructor(){
        super();
        //todo get from user settings
        this.collection = 'folders';
    }

    initFolder(folder){
        if(!folder.subFolders){
            folder.subFolders = [];
        }
        if(!folder.files){
            folder.files = [];
        }

        return folder;
    }

    /**
     * create a new folder
     * @param {Folder} folder 
     */
    async createFolder(folder){
        try{
            let data = folder.serialize();
            let newFolder = await this.db.collection(this.collection).add(data);
            data.id = newFolder.id;
            data = this.initFolder(data);

            await this.db.collection(this.collection).doc(data.id).set(data,{merge:true});
            return data;
        }
        catch(e){
            console.log('error creating folder: ',e);
            throw e;
        }
    }
    
    findTargetSubFolder(folder,splitPath,pathIndex){
        if(splitPath.length === 1){
            return folder;
        }
        
        pathIndex = !pathIndex && pathIndex !== 0 ? 0 : pathIndex;
        
        if(pathIndex === splitPath.length -1){
            return folder;
        }
        else{
            pathIndex++
            let currentPath = splitPath[pathIndex];
            let subFolder = folder.subFolders.find(f => f.id === currentPath);
            return this.findTargetSubFolder(subFolder,splitPath,pathIndex);
        }
    }

    /**
     * create a specified sub folder for a folder
     * @param {Folder} subFolder 
     * @param {string} path path to place the folder in format parentId/subfolder1/...
     */
    async createSubFolder(subFolder,path){
        let splitPath = path.split('/');
        let rootFolderId = splitPath[0];
        subFolder = this.initFolder(subFolder);
        try{
            let query = await this.db.collection(this.collection).where('id','==',rootFolderId);
            let folderData = await query.get();
            let rootFolder = folderData.docs[0].data();
            let updatedFolder = new Folder(rootFolder);
            let targetSubfolder = this.findTargetSubFolder(updatedFolder,splitPath,0);
            targetSubfolder.folderCount += 1;
            subFolder.id = this.handleize(`${subFolder.name}::${targetSubfolder.folderCount}`);
            targetSubfolder.subFolders.push(subFolder);

            let updatedFolderData = updatedFolder.serialize();
            updatedFolderData = JSON.parse(JSON.stringify(updatedFolderData));
            await this.db.collection(this.collection).doc(updatedFolderData.id).set(updatedFolderData,{merge:true});
            return updatedFolder;
        }
        catch(e){
            console.log('error creating sub folder: ',e);
            throw e;
        }
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