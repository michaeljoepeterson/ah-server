const mongoose = require('mongoose');

const folderSchema = mongoose.Schema({
    name:{type:String,required:true},
    ancestors:{type:Array,default:[]},
    parent:{type:String,default:null},
    sortOrder:{type:Number,default:0},
    owner:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: false, required: [true, 'No owner found']},
    files:[{ type: mongoose.Schema.Types.ObjectId, ref: 'PFile', unique: false, required: [true, 'No files found']}]
});

folderSchema.methods.serialize = function(){
	return{
		name: this.name || '',
        id:this._id,
        ancestors:this.ancestors,
        parent:this.parent,
        sortOrder:this.sortOrder,
        owner:this.owner,
        files:this.files.map(file => file.serialize())
	};
}

/**
 * add subfolders to a root folder
 * @param {*} rootFolder 
 * @param {*} subFolders 
 * @param {*} ancestorLength 
 */
folderSchema.statics.buildSubFolderTree = function(rootFolder,subFolders,ancestorLength){
    try{
        if(!ancestorLength){
            ancestorLength = 1;
        }
        let rootFolderId = rootFolder.id;
        let addedFolders = {};
        let currentSubfolders = subFolders.filter(folder => {
            if(folder.ancestors.length === ancestorLength && folder.ancestors.includes(rootFolderId)){
                addedFolders[folder.id] = folder.id;
                return true
            }
        });
        rootFolder.subFolders = currentSubfolders;
        let leftOverSubFolders = subFolders.filter(folder => !addedFolders[folder]);
        if(leftOverSubFolders.length > 0){
            ancestorLength++;
            currentSubfolders.forEach(folder => {
                this.buildSubFolderTree(folder,leftOverSubFolders,ancestorLength);
            });
        }
        return rootFolder;
    }
    catch(e){
        console.log('error building sub tree',e);
        throw e;
    };
};

/**
 * 
 * @param {IFolder[]} folders 
 * @returns 
 */
folderSchema.statics.buildFolderTree = function(folders){
    try{
        let rootFolders = folders.filter(folder => !folder.parent);
        let subFolders = folders.filter(folder => folder.parent);
        rootFolders.forEach(folder => {
            this.buildSubFolderTree(folder,subFolders,1);
        })
        return rootFolders.filter(folder => !folder.parent);
    }
    catch(e){
        console.log('error building tree',e);
        throw e;
    };
};

/**
 * find folders for a user from the provided id
 * @param {string} user 
 * @returns 
 */
folderSchema.statics.getFoldersForUser = async function(user){
    try{
        let query = {
            owner:user
        };
        console.log('query',query);
        let folders = await this.find(query).populate('files');
        if(folders){
            return folders.map(folder => folder.serialize());
        }
        else{
            return [];
        }
    }
    catch(e){
        console.log('error finding folders for user',e);
        throw e;
    };
};

/**
 * add the newly created file to a folder
 * @param {*} file 
 * @returns 
 */
folderSchema.statics.addFileToFolder = async function(file){
    try{
        let query = {
            _id:file.parent
        };
        if(file.id){
            console.log('query',file);
            let folder = await this.findOneAndUpdate(query,{
                $push:{'files':file.id}
            });
            return folder;
        }
        return null;
    }
    catch(e){
        console.log('error finding folders for user',e);
        throw e;
    };
};

/**
 * represent a user folder
 * @method buildFolderTree - build a tree structure from the provided folders
 * @method addFileToFolder - add a file to a folder after the file is created
 */
const Folder = mongoose.model('Folder',folderSchema);

module.exports = {Folder};