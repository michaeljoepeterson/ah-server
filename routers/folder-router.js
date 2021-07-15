const express = require('express');
const router = express.Router();
const {auth} = require('../middleware/auth');
const {Folder} = require('../app-models/folder');
const {FolderColleciton} = require('../fb-models/folder-collection');
const { PatientFile } = require('../app-models/patientFile');

router.use(auth);
//get folders for the provided user
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
        let newFolder = new Folder(folder);
        newFolder.owner = req.userData.email;
        let folderDb = new FolderColleciton();
        createdFolder = await folderDb.createRootFolder(newFolder);
        res.status(200);
        return res.json({
            message:'Folder created',
            folder:createdFolder
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
    let {folder,path} = req.body; 

    try{
        let newFolder = new Folder(folder);
        newFolder.owner = req.userData.email;
        let folderDb = new FolderColleciton();
        createdFolder = await folderDb.createSubFolder(newFolder,path);
        res.status(200);
        return res.json({
            message:'Sub Folder created',
            folder:createdFolder
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
    let {file,path} = req.body; 

    try{
        let newFile = new PatientFile(file);
        let folderDb = new FolderColleciton();
        createdFolder = await folderDb.createFile(newFile,path);
        res.status(200);
        return res.json({
            message:'File created',
            folder:createdFolder
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

router.put('/folder/:id',async (req,res,next) => {
    let {folder} = req.body; 
    let {id} = req.params;

    try{
        let newFolder = new Folder(folder);
        newFolder.owner = req.userData.email;
        let folderDb = new FolderColleciton();
        createdFolder = await folderDb.updateRootFolder(newFolder,id);
        res.status(200);
        return res.json({
            message:'Folder updated',
            folder:createdFolder
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

router.put('/subfolder',async (req,res,next) => {
    let {folder,path} = req.body; 

    try{
        let newFolder = new Folder(folder);
        newFolder.owner = req.userData.email;
        let folderDb = new FolderColleciton();
        createdFolder = await folderDb.updateSubFolder(newFolder,path);
        res.status(200);
        return res.json({
            message:'Sub Folder updated',
            folder:createdFolder
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

router.put('/file',async (req,res,next) => {
    let {file,path} = req.body; 

    try{
        let newFile = new PatientFile(file);
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