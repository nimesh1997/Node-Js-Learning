const jwt = require('jsonwebtoken')
const User = require('../models/users')

const secrete_key = 'Node-Js-Learning';

exports.auth = async function (req, res, next) {
    console.log('auth middleware called...');

    try {
        let token = req.header('Authorization').replace('Bearer ', '');
        console.log(`token: ${token}`);
        let isJwtVerify =  jwt.verify(token, secrete_key);
        console.log(`isJwtVerify successful: ${JSON.stringify(isJwtVerify)}`);
        let user = await User.findOne({_id : isJwtVerify._id});
        console.log(`user data: ${user}`);
        if(!user){
            throw new Error('user is not exist')
        }
        req.user = user;
        req.token = token;
        return next();

    } catch (err) {
        console.log(`err message: ${err['message']}`);
        let message = {
            status: 505,
            message: 'Please authenticate',
        }
        return res.status(200).send(message)
    }

}