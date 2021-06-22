const { User } = require('../app-models/user');
const {FirebaseCollection} = require('./fb-collection');

class UserColleciton extends FirebaseCollection{
    constructor(){
        super();
        //todo get from user settings
        this.userCollection = 'users';
    }

    /**
     * save a user with the provided user object
     * @param {User} user the provided user object
     */
    async createUser(user){
        try{
            let data = user.serialize();
            await this.db.collection(this.userCollection).doc(user.email).set(data,{merge:true});
        }
        catch(e){
            console.log('error creating user: ',e);
            throw e;
        }
    }

    /**
     * get a user by the provided email
     * @param {string} email 
     * @returns {User}
     */
    async GetUserByEmail(email){
        try{
            let userDoc = await this.db.collection(this.userCollection).doc(email).get();
            let user = new User(userDoc.data());
            return user;
        }
        catch(e){
            console.log('error getting user by email:',e);
            throw e;
        }
    }
}

module.exports = {UserColleciton};