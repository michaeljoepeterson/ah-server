const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    email:{type:String,required:true,unique:true},
    lastAccess:{type:Date},
    lastLogin:{type:Date},
    lastLoginAttempt:{type:Date}
});

userSchema.methods.serialize = function(){
	return{
		email: this.email || '',
        id:this._id
	};
};

/**
 * find a user by email
 * @email string email to find user 
 */
 userSchema.statics.findByEmail = async function(email){
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
    }
};

/**
 * @User base model representing a app user
 * static methods
 * @findByEmail find a user by email
 */
const User = mongoose.model('User',userSchema);

module.exports = {User};