const { Folder } = require('../app-models/IFolder');
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
    async createRootFolder(folder){
        try{
            let data = folder.serialize();
            let newFolder = await this.db.collection(this.collection).add(data);
            data.id = newFolder.id;
            data = this.initFolder(data);

            await this.db.collection(this.collection).doc(data.id).set(data,{merge:true});
            return data;
        }
        catch(e){
            console.error('error creating folder: ',e);
            throw e;
        }
    }
    
    /**
     * find the target sub folder from the provided path
     * @param {Folder} folder 
     * @param {string[]} splitPath 
     * @param {number} pathIndex 
     * @returns 
     */
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
     * get the root folder from the provided id
     * @param {string} id 
     * @returns 
     */
    async getRootFolder(id){
        try{
            let query = await this.db.collection(this.collection).where('id','==',id);
            let folderData = await query.get();
            let rootFolder = folderData.docs[0].data();
            let updatedFolder = new Folder(rootFolder);
            return updatedFolder;
        }
        catch(e){
            console.error('error getting root folder');
            throw e;
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
            let rootFolder = await this.getRootFolder(rootFolderId);
            let targetSubfolder = this.findTargetSubFolder(rootFolder,splitPath,0);
            targetSubfolder.folderCount += 1;
            subFolder.id = this.handleize(`${subFolder.name}::${targetSubfolder.folderCount}`);
            targetSubfolder.subFolders.push(subFolder);

            let rootFolderData = rootFolder.serialize();
            rootFolderData = JSON.parse(JSON.stringify(rootFolderData));
            await this.db.collection(this.collection).doc(rootFolderData.id).set(rootFolderData,{merge:true});
            return rootFolder;
        }
        catch(e){
            console.error('error creating sub folder: ',e);
            throw e;
        }
    }
    
    /**
     * add a file to the specified folder
     * @param {PatientFile} file 
     * @param {string} path 
     * @returns 
     */
    async createFile(file,path){
        let splitPath = path.split('/');
        let rootFolderId = splitPath[0];
        try{
            let rootFolder = await this.getRootFolder(rootFolderId);
            let targetSubfolder = this.findTargetSubFolder(rootFolder,splitPath,0);
            targetSubfolder.fileCount += 1;
            file.id = this.handleize(`${file.name}::${targetSubfolder.fileCount}`);
            targetSubfolder.files.push(file);

            let rootFolderData = rootFolder.serialize();
            rootFolderData = JSON.parse(JSON.stringify(rootFolderData));
            await this.db.collection(this.collection).doc(rootFolderData.id).set(rootFolderData,{merge:true});
            return rootFolder;
        }
        catch(e){
            console.error('error creating sub folder: ',e);
            throw e;
        }
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
            console.error('error getting user by email:',e);
            throw e;
        }
    }

    /**
     * update a root folder
     * @param {Folder} newFolder 
     * @param {string} id 
     * @returns 
     */
    async updateRootFolder(newFolder,id){
        try{
            let rootFolder = await this.getRootFolder(id);
            rootFolder.updateFolder(newFolder);
            let rootFolderData = rootFolder.serialize();
            rootFolderData = JSON.parse(JSON.stringify(rootFolderData));

            await this.db.collection(this.collection).doc(id).set(rootFolderData,{merge:true});
            return rootFolder;
        }
        catch(e){
            console.error('error updating root folder:',e);
            throw e;
        }
    }

    /**
     * update the target subfolder
     * @param {Folder} newFolder 
     * @param {string} path 
     * @returns 
     */
    async updateSubFolder(newFolder,path){
        let splitPath = path.split('/');
        let id = splitPath[0];
        try{
            let rootFolder = await this.getRootFolder(id);
            let targetSubfolder = this.findTargetSubFolder(rootFolder,splitPath,0);
            targetSubfolder.updateFolder(newFolder)
            let rootFolderData = rootFolder.serialize();
            rootFolderData = JSON.parse(JSON.stringify(rootFolderData));

            await this.db.collection(this.collection).doc(id).set(rootFolderData,{merge:true});
            return rootFolder;
        }
        catch(e){
            console.error('error updating sub folder:',e);
            throw e;
        }
    }

    /**
     * update the target file
     * @param {PatientFile} newFile 
     * @param {string} path 
     * @returns 
     */
    async updateFile(newFile,path){
        let splitPath = path.split('/');
        let id = splitPath[0];
        try{
            let rootFolder = await this.getRootFolder(id);
            let targetSubfolder = this.findTargetSubFolder(rootFolder,splitPath,0);
            targetSubfolder.updateFile(newFile);
            
            let rootFolderData = rootFolder.serialize();
            rootFolderData = JSON.parse(JSON.stringify(rootFolderData));

            await this.db.collection(this.collection).doc(id).set(rootFolderData,{merge:true});
            return rootFolder;
        }
        catch(e){
            console.error('error updating sub folder:',e);
            throw e;
        }
    }

    /**
     * delete the root based off id
     * @param {string} id 
     */
    async deleteRootFolder(id){
        try{

        }
        catch(e){
            console.error('error deleting folder:',e);
            throw e;
        }
    }

    /**
     * delete the subfolder based off id
     * @param {string} id 
     */
    async deleteSubFolder(id){

    }

    /**
     * delete the file based off id
     * @param {string} id 
     */
    async deleteFile(id){

    }
}

module.exports = {FolderColleciton};