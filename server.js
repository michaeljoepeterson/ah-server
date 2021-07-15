require('dotenv').config();
const express = require('express');
const {cors} = require('./middleware/cors');
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

async function runServer( port = PORT) {
    server = app.listen(port, () => {
        console.log(`Your app is listening on port ${port}`);
    });
}

function closeServer() {
    return new Promise((resolve, reject) => {
        console.log('Closing server');
        server.close(err => {
            if (err) {
            return reject(err);
            }
            resolve();
        });
    });
}
runServer().catch(err => console.error(err));

module.exports = {  runServer, closeServer };