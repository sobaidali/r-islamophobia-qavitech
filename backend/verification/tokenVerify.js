const jwt = require('jsonwebtoken');

const validateToken = (req, res, next) => {
    var token = req.headers['authorization'];
    if(!token){
        return res.status(401).send({ auth: false, message: 'No token provided.' });
    }
    else{
        try {
            jwt.verify(token, process.env.REACT_APP_JWT_KEY || require('../constants/constants').jwtKey, async function(err,result) {
            if (err) {
              return res.status(403).send({message: 'Failed to authenticate token.' });
            }
        req.decoded = result;
        next();
        })
    }catch(err){
        return res.status(500).send({message: 'Request failed.' });
        }
    }
}
module.exports = validateToken;
