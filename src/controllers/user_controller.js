const crypto = require('crypto');
const User = require('../models/users');
const jwt = require('jsonwebtoken')

exports.createUser = async (req, res) => {
    console.log('request params: ', req.body)


    // keys are ['name', 'age', 'email', 'password']

    try {

        let isValid = validateCreateUser(req)
        console.log(`isValid request: ` + JSON.stringify(isValid))

        if (!isValid.isValid) {
            throw isValid.message
        }

        const newUser = new User(req.body)

        ///using async and await
        const user = await newUser.save()

        let jwtToken = await newUser.generateAuthToken()
        console.log(jwtToken)

        console.log(`savingData: ${JSON.stringify(user)}`)
        /// response
        const message = {
            status: 200,
            message: 'success',
            data: {
                user,
                jwtToken
            }
        }
        console.log(JSON.stringify(message))
        res.status(200).send(message)

    } catch (error) {
        console.log(error['message'])
        var message = {
            status: 505,
            message: error['message'],
        }
        res.status(505).send(message)
    }

    /// old way of saving data
    // newUser.save().then((result) => {
    //     res.send(result)
    // }).catch((error) => {
    //     res.status(400).send(error)
    // })
}


function validateCreateUser(requestData) {
    console.log('validateCreateUser Called...')

    try {

        const numOfKeys = Object.keys(requestData.body).length
        const keys = Object.keys(requestData.body)

        if (requestData.method != 'POST') {
            throw 'In validateCreateUser, method is not POST type'
        } else if (numOfKeys < 4 || numOfKeys > 4) {
            throw `num of keys ${numOfKeys} is not equal to 4`
        } else {
            keys.forEach((key) => {
                let value = requestData.body[key];

                if (key != 'age' && (value == null || value.trim().length == 0)) {
                    throw `${key} is null. ${key} param cannot be empty`
                }
            })
        }

        return {
            isValid: 1,
            message: `validateCreateUser request is valid`
        }

    } catch (error) {
        console.log(`error: ${error}`)
        return {
            isValid: 0,
            message: error
        }
    }
}


exports.loginUser = async (req, res) => {

    try {
        const isValid = validateLoginUser(req);

        if (!isValid.isValid) {
            throw new Error(isValid.message)
        }

        const user = await User.findByEmail(req.body.email);

        const isMatch = await isUserPasswordMatch(user, req);

        if (!isMatch) {
            throw new Error('Unable to login');
        }

        let jwtToken = await user.generateAuthToken()

        /// response
        const message = {
            status: 200,
            message: 'success',
            data: {
                user,
                jwtToken
            }
        }
        console.log(JSON.stringify(message))
        res.status(200).send(message)

    } catch (error) {
        const message = {
            status: 505,
            message: error['message']
        }
        console.log(JSON.stringify(message))
        res.status(200).send(message)
    }

}


function validateLoginUser(requestData) {
    console.log('validateLoginUser Called...')


    try {
        const numOfKeys = Object.keys(requestData.body).length

        const keys = Object.keys(requestData.body)

        if (requestData.method != 'POST') {
            throw new Error('In validateLoginUser, method is not POST type')
        }

        if (numOfKeys != 2) {
            throw new Error(`In validateLoginUser, keys given ${numOfKeys} is not equal to 2`)
        }

        if (!requestData.body.email) {
            throw new Error(`In validateLoginUser, email is empty or null`)
        }

        if (!requestData.body.password) {
            throw new Error(`In validateLoginUser, password is empty or null`)
        }

        return {
            isValid: 1,
            message: `validateLoginUser request is valid`
        }
    } catch (error) {
        console.log(`validateLoginUser catchError: ${error['message']}`)
        return {
            isValid: 0,
            message: error['message']
        }
    }


}


function isUserPasswordMatch(user, req) {
    console.log('isUserPasswordMatch Called...');

    if (!user) {
        console.log('User is null or not exist')
        return false;
    }

    let passwordField = user.password.split('$');
    let salt = passwordField[0];
    let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
    console.log(`hash ${hash}`);
    console.log(`body password ${passwordField[1]}`);
    if (hash === passwordField[1]) {
        console.log('success');
        return true;
    }
    return false;

}