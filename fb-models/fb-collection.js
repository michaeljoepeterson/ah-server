const admin = require('firebase-admin');
const db = admin.firestore();

class FirebaseCollection{
    constructor(){
        this.db = db;
    }

    async testGet(){
        try{
            let docs = await this.db.collection('test').get();
            let documents = [];
            docs.forEach(doc => {
                let document = doc.data();
                document.id = doc.id;
                documents.push(document);
            });
            return documents;
        }
        catch(e){
            console.log('Error getting test',e);
            throw e;
        }
    }

    /**
     * convert provided firestore docs to array of objects
     * @param {*} docs 
     * @returns 
     */
    mapDocumentsToArray(docs){
        let documents = [];
        docs.forEach(doc => {
            let document = doc.data();
            document.id = doc.id;
            documents.push(document);
        });

        return documents;
    }
}

module.exports = {FirebaseCollection};