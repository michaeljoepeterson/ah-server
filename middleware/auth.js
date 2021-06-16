const admin = require('firebase-admin');
const {User} = require('../db-models/user');

const auth = async (req, res, next) => {
    let {authtoken} = req.headers;

    if(authtoken){
        try{
            const decodedToken = await admin.auth().verifyIdToken(authtoken);
            let {email,name} = decodedToken;
            console.log(email,name);
            let user = await User.findByEmail(email);
            req.userData = {
                email,
                name,
                id:user ? user.id : null
            };
            next();
        }
        catch(e){
            console.log('error: ',e);
            res.status(422);
            return res.json({
                message:'Unauthorized'
            });
        }
    }
    else{
        res.status(422);
        return res.json({
            message:'Unauthorized'
        });
    }
}

module.exports = {auth};