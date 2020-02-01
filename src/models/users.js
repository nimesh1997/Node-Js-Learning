const mongoose = require('mongoose')
const validator = require('validator')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
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

const secrete_key = 'Node-Js-Learning';

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
        required: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contains "password"')
            }
            if (value.length < 6) {
                throw new Error('Password length must be greater than 5')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            // required: 
        }
    }],
    // task : {
    //     type : Schema.Types.ObjectId,
    //     ref: 'Task'
    // }
})

userSchema.virtual('tasks', {
    ref : 'Task',
    localField : '_id',
    foreignField : 'userDetails'
})

// Ensure virtual fields are serialised.
userSchema.set('toJSON', {
    virtuals: true
});


/// mongoose middleware 
/// pre means an event runs before doing anything
/// this will run before saving the data
/// hash the plain password before saving
userSchema.pre('save', async function (next) {
    var self = this
    console.log('pre saving 1')

    if (self.isModified('password')) {
        let salt = crypto.randomBytes(16).toString('base64');
        let hash = crypto.createHmac('sha512', salt).update(self.password).digest("base64");
        let newPassword = salt + "$" + hash;
        self.password = newPassword;
    }

    next()

})

/// we can also create custom function in schema file also
userSchema.statics.findByLoginCredentials = async function (emailId, password) {
    console.log('findByLoginCredentials Called')
    var user = await User.findOne({
        email: emailId
    })

    // console.log(user['password'])

    if (!user) {
        console.log('user is null')
        throw new Error('Unable to login')
    }

    if (password != user.password) {
        throw new Error('Unable to login')
    }

    return user


}

userSchema.statics.findByEmail = function (emaiId) {
    return User.findOne({
        email: emaiId
    })
}

userSchema.methods.generateAuthToken = async function () {
    console.log('generateAuthToken Called...');

    let self = this

    try {
        const self = this
        let token = jwt.sign({
            _id: self._id
        }, secrete_key)
        console.log(`tken: ${token}`)
        self.tokens = self.tokens.concat({
            token: token
        })
        await self.save()

        return token
    } catch (err) {
        console.log(err['message'])
        throw new Error(err['message'])
    }
}

userSchema.methods.hidePrivateData = function () {
    let self = this;
    let userObject = self.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;

}

const User = mongoose.model('User', userSchema)



module.exports = User;