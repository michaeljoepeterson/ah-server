const mongoose = require('mongoose');

const folderSchema = mongoose.Schema({
    name:{type:String,required:true,unique:true},
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
 * 
 * @param {IFolder[]} folders 
 * @returns 
 */
folderSchema.statics.buildFolderTree = function(folders){
    try{
        return [];
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
 * represent a user folder
 * @method buildFolderTree - build a tree structure from the provided folders
 */
const Folder = mongoose.model('Folder',folderSchema);

module.exports = {Folder};