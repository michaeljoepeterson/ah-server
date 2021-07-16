require('dotenv').config();
const express = require('express');
const {cors} = require('./middleware/cors');
const mongoose = require("mongoose");
const {router} = require('./routers/main-router');
const {PORT,DATABASE_URL} = require('./config');

const app = express();
app.use(express.json());
app.use(cors);
app.use('/api',router);

app.use((req,res,next) => {
    res.status(500);
    let err = res.err ? res.err : 'no error provided';
    let customMessage = res.errMessage ? res.errMessage : '';
    console.error('Error: ',err);
    return res.json({
        message:'An error occured',
        error:err.message ? err.message : err,
        customMessage
    });
});

function runServer( databaseUrl, port = PORT) {
    return new Promise((resolve, reject) => {
      mongoose.connect(databaseUrl,{ useNewUrlParser: true,useUnifiedTopology: true }, err => {
        if (err) {
          return reject(err);
        }
        server = app.listen(port, () => {
          console.log(`Your app is listening on port ${port}`);
          resolve();
        })
          .on('error', err => {
            mongoose.disconnect();
            reject(err);
          });
      });
    });
  }
  
function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
        console.log('Closing server');
        server.close(err => {
            if (err) {
            return reject(err);
            }
            resolve();
        });
        });
    });
}
  
runServer(DATABASE_URL).catch(err => console.error(err));

module.exports = {  runServer, closeServer };