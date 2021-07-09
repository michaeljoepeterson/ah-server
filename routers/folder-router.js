const express = require('express');
const router = express.Router();
const {auth} = require('../middleware/auth');
const {Folder} = require('../app-models/folder');
const {FolderColleciton} = require('../fb-models/folder-collection');

router.use(auth);

router.get('/:user',async (req,res,next) => {
    let {user} = req.params;
    try{
        let message = 'found folders';
        let folderDb = new FolderColleciton();
        let folders  = await folderDb.getFolders(user);
        res.status(200);
        return res.json({
            message,
            folders
        });
    }
    catch(e){
        let message = 'Error retrieving folders';
        console.warn(message,e);
        res.err = e;
        res.errMessage = message;
        next();
    }
});

router.post('/folder',async (req,res,next) => {
    let {folder} = req.body;
    try{
        let newFolder = new Folder(folder);
        newFolder.owner = req.userData.email;
        let folderDb = new FolderColleciton();
        await folderDb.createFolder(newFolder);
        res.status(200);
        return res.json({
            message:'Folder created'
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