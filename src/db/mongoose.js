const mongoose = require('mongoose')
const validator = require('validator')


//db-name: task-application
/// connecting to mongo db
mongoose.connect('mongodb://127.0.0.1:27017/task-application', {
    useNewUrlParser: true,
    // userCreateIndex: true, //index create to quickly access the data
}, )





///// Old code 'User' model shifts to models/users.js
// // instance of model
// const person = new User({
//     name: 'Alex',
//     age: 25,
//     email: 'ALex@gmail.com',
//     password: 'alex@123'
// })

// /// saving to db
// // save() method returns the promise
// person.save()
//     .then((result) => {
//         console.log(`Result: ${result}`)
//     }).catch((e) => {
//         console.log(`Error: ${e}`)
//     })

/// Challenge 1: Create model for storing data in db
// const Task = mongoose.model('Task', {
//     description: {
//         type: String,
//         required: true
//     },
//     completed: {
//         type: Boolean,
//         default: false
//     }
// })

// const taskInstance = new Task({
//     description: 'Reading a book',
//     completed: true
// })

// taskInstance.save().then((result) => {
//     console.log(`Result: ${result}`)
// }).catch((e) => {
//     console.log(`Error: ${e}`)
// })