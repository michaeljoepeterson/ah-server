const {BaseModel} = require('./base-model');

/**
 * base model to represent a user
 */
class IUser extends BaseModel{
    constructor(data){
        super();
        this.email = null;
        this.lastAccess = null;
        this.lastLogin = null;
        this.lastLoginAttempt = null;
        if(data){
            this.initUser(data);
        }
    }

    initUser(data){
        this.init(data)
    }

    initFromProps(){
        
    }
}

module.exports = {IUser};