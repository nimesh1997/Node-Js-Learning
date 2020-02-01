const mongoose = require('mongoose')

/// here we create the model to store the data in structured-way
/**
 * {
 * description : 'asdjasd jdnasjbdjasd',
 * completed: true/false
 * }
 * 
 */
const Task = mongoose.model('Task', {
    'description': {
        type: String,
        required: true,
    },
    'completed': {
        type: Boolean,
        default: false
    },
    'userDetails' :{
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required: true
    }
})

///export it so that access by other files also
module.exports = Task