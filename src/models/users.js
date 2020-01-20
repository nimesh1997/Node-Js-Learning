const mongoose = require('mongoose')
const validator = require('validator')
const CryptoJs = require('crypto-js')
const crypto = require('crypto')
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);
var SimpleCrypto = require("simple-crypto-js").default;
/// new model
/// here we create the model to store the data in structured-way
/**
 * {
 * name: alex,
 * age: 26,
 * email: alex@gmail.com
 * password: dfni3nfn
 * }
 * 
 * 
 */

var Schema = mongoose.Schema

/// secret key
// const key = 'testing-node'
// var simpleCrypto = new crypto(key);

/// we have to build schema for to store data in more structured way and after that create model
var userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        default: 1,
        validate(value) { // validation 
            if (value < 1) {
                throw new Error('Age must be positive number')
            }
        }
    },
    email: {
        required: true,
        type: String,
        lowercase: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('EmailId is invalid')
            }
        }
    },
    password: {
        type: String,
        // trim: true,
        lowercase: true,
        required: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contains "password"')
            }
            if (value.length < 6) {
                throw new Error('Password length must be greater than 5')
            }
        }
    }
})


/// mongoose middleware 
/// pre means an event runs before doing anything
/// this will run before saving the data
/// hash the plain password before saving
userSchema.pre('save', async function (next) {
    var self = this
    console.log('pre saving 1')

    // run when user created or updated
    // if (self.isModified('password')) {

    //     self.password = 



    // }

    next()

})

/// we can also create custom function in schema file also
userSchema.statics.findByLoginCredentials = async function (emailId, password) {
    console.log('findByLoginCredentials Called')
    var user = await User.findOne({
        email: emailId
    })

    console.log(user['password'])

    if (!user) {
        console.log('user is null')
        throw new Error('Unable to login')
    }

    if (password != user.password) {
        throw new Error('Unable to login')
    }

    return user


}


const User = mongoose.model('User', userSchema)




module.exports = User