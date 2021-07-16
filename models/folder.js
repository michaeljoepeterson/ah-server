const mongoose = require('mongoose');

const folderSchema = mongoose.Schema({
    name:{type:String,required:true,unique:true},
    ancestors:{type:Array,default:[]},
    parent:{type:String,default:null},
    sortOrder:{type:Number,default:0},
    owner:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: false, required: [true, 'No owner found']}
});

folderSchema.methods.serialize = function(){
	return{
		name: this.name || '',
        id:this._id,
        ancestors:this.ancestors,
        parent:this.parent,
        sortOrder:this.sortOrder,
        owner:this.owner
	};
}

/**
 * represent a user folder
 */
const Folder = mongoose.model('Folder',folderSchema);

module.exports = {Folder};