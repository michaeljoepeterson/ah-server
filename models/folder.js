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
 * represent a user folder
 */
const Folder = mongoose.model('Folder',folderSchema);

module.exports = {Folder};