const express = require('express');
const router = express.Router();
const {auth} = require('../middleware/auth');
//const {User} = require('../db-models/user');
const {User} = require('../app-models/user');
const {UserColleciton} = require('../fb-models/user-collection');

router.get('/:email',auth ,async (req,res) => {
    let {email} = req.params;
    try{
        let users = new UserColleciton();
        let user = await users.getUserByEmail(email);
        let message = user ? 'Found User' : 'No User';
        res.status(200);
        return res.json({
            message,
            user:user.serialize()
        });
    }
    catch(e){
        let message = 'Error retrieving user';
        console.warn(message,e);
        res.err = e;
        res.errMessage = message;
        next();
    }
});

router.post('/',async (req,res,next) => {
    let {user} = req.body;
    let newUser = new User(user);
    let users = new UserColleciton();
    try{
        /*
        await User.create({
            email            
        });
        */
        await users.createUser(newUser);
        let createdUser = await users.getUserByEmail(newUser.email);
        res.status(200);
        return res.json({
            message:'User created',
            user:createdUser.serialize()
        });
    }
    catch(e){
        let message = 'Error creating user';
        console.warn(message,e);
        res.err = e;
        res.errMessage = message;
        next();
    }
});

module.exports = {router};