const {DOMAINS} = require('../config');
/**
 * handle cors and check if domain has access
 * @returns 
 */
const cors = function (req, res, next) {
    let origin = req.headers.origin;
    let allowedOrigins = DOMAINS.split(',');
    console.log('origin: ',origin);
    if(allowedOrigins.indexOf(origin) > -1){
      console.log('origin found: ',origin);
       res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,Accept,authtoken');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }
    next();
}

module.exports = {cors};