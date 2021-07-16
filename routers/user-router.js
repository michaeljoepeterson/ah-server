const express = require('express');
const router = express.Router();
const {auth} = require('../middleware/auth');
//const {User} = require('../app-models/user');
//const {UserColleciton} = require('../fb-models/user-collection');
const {User} = require('../models/user');

router.get('/:email',auth ,async (req,res,next) => {
    let {email} = req.params;
    try{
        let user = await User.getUserByEmail(email);
        let message = user && user.email ? 'Found User' : 'No User';
        user = user && user.email ? user : null; 
        res.status(200);
        return res.json({
            message,
            user
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
    try{
        await User.create(user);
        let createdUser = await User.getUserByEmail(user.email);
        res.status(200);
        return res.json({
            message:'User created',
            user:createdUser
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