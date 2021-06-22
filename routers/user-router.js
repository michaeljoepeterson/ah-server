const express = require('express');
const router = express.Router();
const {auth} = require('../middleware/auth');
const {User} = require('../db-models/user');

router.get('/:email',auth ,async (req,res) => {
    let {email} = req.params;
    try{
        let user = await User.findByEmail(email);
        let message = user ? 'Found User' : 'No User';
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
    let {email,role} = req.body;
    try{
        await User.create({
            email            
        });
        
        let user = await User.findByEmail(email);
        res.status(200);
        return res.json({
            message:'User created',
            user:user
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