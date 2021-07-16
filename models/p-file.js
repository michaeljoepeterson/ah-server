const mongoose = require('mongoose');

const pFileSchema = mongoose.Schema({
    name:{type:String,required:true,unique:true},
    ancestors:{type:Array,default:[]},
    parent:{type:String,default:null},
    sortOrder:{type:Number,default:0}
});

pFileSchema.methods.serialize = function(){
	return{
		name: this.name || '',
        id:this._id,
        ancestors:this.ancestors,
        parent:this.parent,
        sortOrder:this.sortOrder
	};
}

/**
 * represent a single p file
 */
const Pfile = mongoose.model('PFile',pFileSchema);

module.exports = {Pfile};