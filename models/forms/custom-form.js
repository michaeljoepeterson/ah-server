const mongoose = require('mongoose');

const formSchema = mongoose.Schema({
    name:{type:String,required:true,unique:true},
    sections:[{ type: mongoose.Schema.Types.ObjectId, ref: 'FormSection', unique: false, required: [false, 'No sections found']}],
    createdAt:{type:Date},
    owner:{ type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: false, required: true}
});

formSchema.methods.serialize = function(){
	return{
		name: this.name || '',
        sections:this.sections ? this.sections.map(section => section.serialize()) : [],
        owner:this.owner ? this.owner.serialize() : null,
        id:this._id
	};
}

/**
 * model a form
 */
 const Form = mongoose.model('Form',formSchema);

 module.exports = {Form};