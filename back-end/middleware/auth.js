const jwt = require('jsonwebtoken');
const { error } = require('../utils/common');
const JWT_SECRET = process.env.JWT_SECRET || 'TEMP_KEY';



function auth(req, res, next) {
    // get token from the Authorization header
    const authHeader = req.header('Authorization');

    // check if the header starts with "Bearer "
    if (!authHeader || !authHeader.startsWith('Bearer '))
        return error(res, 401, 'No token, authorization denied');

    try {
        // extract the actual token string
        const token = authHeader.split(' ')[1];
        // verify the token
        const decoded = jwt.verify(token, JWT_SECRET);
        // attach the user data (id and role) from the payload to the request object
        req.user = decoded;
        next();
    } catch (err) {
        error(res, 401, 'Token is not valid');
    }
}

module.exports = auth;