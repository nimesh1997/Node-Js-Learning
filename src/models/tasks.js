const mongoose = require('mongoose')

/// here we create the model to store the data in structured-way
/**
 * {
 * description : 'asdjasd jdnasjbdjasd',
 * completed: true/false
 * }
 * 
 */

var Schema = mongoose.Schema;

const secrete_key = 'Node-Js-Learning';

var taskSchema = new Schema({
    'description': {
        type: String,
        required: true,
    },
    'completed': {
        type: Boolean,
        default: false
    },
    'userDetails': {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

// const Task = mongoose.model('Task', {
//     'description': {
//         type: String,
//         required: true,
//     },
//     'completed': {
//         type: Boolean,
//         default: false
//     },
//     'userDetails': {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: 'User',
//         required: true
//     }
// })

///export it so that access by other files also

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;