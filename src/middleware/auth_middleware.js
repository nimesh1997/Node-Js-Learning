const jwt = require('jsonwebtoken')

exports.auth = function (req, res, next) {
    console.log('auth middleware called...');

    try {
        let token = req.header('Authorization');
        console.log(`token: ${token}`);
        return res.status(200).send('success');
        next();

    } catch (err) {
        console.log(`err message: ${err['message']}`);
        let message = {
            status: 505,
            message: 'Please authenticate',
        }
        return res.status(200).send(message)
    }

}