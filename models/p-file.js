const mongoose = require('mongoose');

const pFileSchema = mongoose.Schema({
    patientId:{type:String,required:true, unique:true},
    name:{type:String,required:true},
    ancestors:{type:Array,default:[]},
    parent:{type:String,default:null},
    sortOrder:{type:Number,default:0},
    activityLevel:{type:String,default:null},
    height:{type:Number,default:null},
    weight:{type:Number,default:null},
    heightString:{type:String,default:null},
    weightString:{type:String,default:null}
});

pFileSchema.methods.serialize = function(){
	return{
		name: this.name || '',
        id:this._id,
        ancestors:this.ancestors,
        parent:this.parent,
        sortOrder:this.sortOrder,
        height:this.height,
        weight:this.weight,
        heightString:this.heightString,
        weightString:this.weightString
	};
}

/**
 * represent a single p file
 */
const Pfile = mongoose.model('PFile',pFileSchema);

module.exports = {Pfile};