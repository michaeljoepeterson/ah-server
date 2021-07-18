const express = require('express');
const router = express.Router();
const {auth} = require('../middleware/auth');
const {IFolder} = require('../app-models/IFolder');
const {FolderColleciton} = require('../fb-models/folder-collection');
const { IPFile } = require('../app-models/IPFile');
const { User } = require('../models/user');
const { Folder } = require('../models/folder');
const { Pfile } = require('../models/p-file');

router.use(auth);
//get folders for the provided user
router.get('/:user',async (req,res,next) => {
    let {user} = req.params;
    try{
        let message = 'found folders';
        let folders  = await Folder.getFoldersForUser(user);
        folders = Folder.buildFolderTree(folders);
        res.status(200);
        return res.json({
            message,
            folders
        });
    }
    catch(e){
        let message = 'Error retrieving folders';
        console.error(message,e);
        res.err = e;
        res.errMessage = message;
        next();
    }
});
//create a new root folder
router.post('/folder',async (req,res,next) => {
    let {folder} = req.body;
    try{
        let newFolder = new IFolder(folder);
        let user = await User.getUserByEmail(req.userData.email);
        newFolder.owner = user.id;
        let folderData = newFolder.serialize();
        createdFolder = await Folder.create(folderData);
        res.status(200);
        return res.json({
            message:'Folder created',
            folder:createdFolder.serialize()
        });
    }
    catch(e){
        let message = 'Error creating folder';
        console.error(message,e);
        res.err = e;
        res.errMessage = message;
        next();
    }
});
//create a new subfolder
router.post('/subfolder',async (req,res,next) => {
    let {folder} = req.body; 

    try{
        let newFolder = new IFolder(folder);
        let user = await User.getUserByEmail(req.userData.email);
        newFolder.owner = user.id;
        let folderData = newFolder.serialize();
        createdFolder = await Folder.create(folderData);
        res.status(200);
        return res.json({
            message:'Sub Folder created',
            folder:createdFolder.serialize()
        });
    }
    catch(e){
        let message = 'Error creating subfolder';
        console.error(message,e);
        res.err = e;
        res.errMessage = message;
        next();
    }
});
//create a new file for a folder
router.post('/file',async (req,res,next) => {
    let {file} = req.body; 

    try{
        let newFile = new IPFile(file);
        let fileData = newFile.serialize();
        createdFile = await Pfile.create(fileData);
        createdFile = createdFile.serialize();
        await Folder.addFileToFolder(createdFile);
        res.status(200);
        return res.json({
            message:'File created',
            folder:createdFile
        });
    }
    catch(e){
        let message = 'Error creating file';
        console.error(message,e);
        res.err = e;
        res.errMessage = message;
        next();
    }
});
//update a folder
//will not return full populated tree
router.put('/folder/:id',async (req,res,next) => {
    let {folder} = req.body; 
    let {id} = req.params;

    try{
        let createdFolder = await Folder.findOneAndUpdate({_id:id},{
            $set:folder
        },{new:true}).populate('files');
        res.status(200);
        return res.json({
            message:'Folder updated',
            folder:createdFolder.serialize()
        });
    }
    catch(e){
        let message = 'Error updating folder';
        console.error(message,e);
        res.err = e;
        res.errMessage = message;
        next();
    }
});

//update a subfolder
router.put('/subfolder/:id',async (req,res,next) => {
    let {folder} = req.body; 
    let {id} = req.params;

    try{
        let createdFolder = await Folder.findOneAndUpdate({_id:id},{
            $set:folder
        },{new:true}).populate('files');
        res.status(200);
        return res.json({
            message:'Sub Folder updated',
            folder:createdFolder.serialize()
        });
    }
    catch(e){
        let message = 'Error updating sub folder';
        console.error(message,e);
        res.err = e;
        res.errMessage = message;
        next();
    }
});
//update a file
router.put('/file/:id',async (req,res,next) => {
    let {file} = req.body; 
    let {id} = req.params;

    try{
        let createdFile = await Pfile.findOneAndUpdate({_id:id},{
            $set:file
        },{new:true})
        res.status(200);
        return res.json({
            message:'File updated',
            folder:createdFile
        });
    }
    catch(e){
        let message = 'Error updating file';
        console.error(message,e);
        res.err = e;
        res.errMessage = message;
        next();
    }
});

router.delete('/folder/:id',async (req,res,next) => {
    let {file,path} = req.body; 

    try{
        let newFile = new IPFile(file);
        let folderDb = new FolderColleciton();
        createdFolder = await folderDb.updateFile(newFile,path);
        res.status(200);
        return res.json({
            message:'File updated',
            folder:createdFolder
        });
    }
    catch(e){
        let message = 'Error updating file';
        console.error(message,e);
        res.err = e;
        res.errMessage = message;
        next();
    }
});


module.exports = {router};