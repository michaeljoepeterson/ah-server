const mongoose = require('mongoose');
const { isNull } = require('util');
//0 super admin, 1 admin, 2 teacher
//will need to modify schema for regular users
const userSchema = mongoose.Schema({
    email:{type:String,required:true,unique:true},
    lastAccess:{type:Date,default:null},
    lastLogin:{type:Date,default:null},
    lastLoginAttempt:{type:Date,default:null},
    firstName:{type:String, default:null},
    lastName:{type:String, default:null},
});

userSchema.methods.serialize = function(){
	return{
		email: this.email || '',
        id:this._id,
        fullName:this.fullName
	};
}

userSchema.virtual("fullName").get(function(){
    if(this.firstName && this.lastName){
        return this.firstName + ' ' + this.lastName;
    }
    else{
        return null;
    }
})

userSchema.statics.getUserByEmail = async function(email){
    try{
        let query = {
            email
        };
        console.log('query',query);
        let user = await this.findOne(query);
        if(user){
            console.log('g auth user: ',user.serialize())
            return user.serialize();
        }
        else{
            return null;
        }
    }
    catch(e){
        console.log('error finding by email',e);
        throw e;
    };
};

const User = mongoose.model('User',userSchema);

module.exports = {User};