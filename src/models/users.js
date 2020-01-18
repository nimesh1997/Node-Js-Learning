const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
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
        trim: true,
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

/// we can also create custom function in schema file also
userSchema.statics.findByLoginCredentials = async function (emailId, password) {
    console.log('findByLoginCredentials Called')
    const user = await User.findOne({
        email: emailId
    })

    if (!user) {
        console.log('user is null')
        throw new Error('Unable to login')
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password)

    if (!isPasswordMatch) {
        console.log(`Password ${password} is not matched with ${user.password}`)
        throw new Error('Unable to login')
    }

    return user
}

/// mongoose middleware 
/// pre means an event runs before doing anything
/// this will run before saving the data
/// hash the plain password before saving
userSchema.pre('save', async function (next) {
    var self = this
    console.log('pre saving 1')

    // run when user created or updated
    if (self.isModified('password')) {
        self.password = await bcrypt.hash(self.password, 10)
    }

    next()

})



const User = mongoose.model('User', userSchema)


module.exports = User