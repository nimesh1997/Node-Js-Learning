const express = require('express');
require('./db/mongoose');
const User = require('./models/users');
const Task = require('./models/tasks');
const middleware = require('./middleware/middleware');
const userController = require('./controllers/user_controller');
const auth = require('./middleware/auth_middleware');
const taskController = require('./controllers/task_controller');

const app = express()
const portNumber = process.env.PORT || 3100


//automatically parsing JSON in express
app.use(express.json())

/// using middleware (this will run in all the routes and show message)
// app.use(middleware)

/******************************************************CREATE USER************************************************************************************* */
/// Users creation endpoint (apiUrl: localhost:3100/users)
app.post('/createUser', [userController.createUser])

/****************************************************************************************************************************************************** */

/*******************************************************LOGIN USER **************************************************************************************/

app.post('/loginUser', [
    userController.loginUser
])


/******************************************************************************************************************************************************* */

/********************************************************GET USER************************************************************************************** */

app.get('/user/me', [
    auth.auth,
    userController.getUser
])

/****************************************************************************************************************************************************** */


/********************************************************LOGUT USER*************************************************************************************** */

app.post('/logOutUser', [
    auth.auth,
    userController.logOutUser
])



/*******************************************************READ USER************************************************************************************** */


/// reading end point task (apiUrl: localhost:3100/tasks)
/// Goal
//  1. Read a data from database using mongoose methdo(similar to mongodb method) 
//  2. Test it from the postman for result and error

app.post('/readAllUsers', async (req, res) => {
    try {

        let isValid = validateReadAllUser(req)

        if (!isValid.isValid) {
            throw new Error(isValid.message)
        }

        // this will fetch all the users from the db
        const allUsers = await User.find({})
        if (!allUsers) {
            const message = {
                'status': 404,
                'message': 'No User availabale'
            }
            res.status(200).send(message)
        }
        const message = {
            'status': 200,
            'message': allUsers
        }

        console.log(JSON.stringify(message))
        res.send(message)
    } catch (error) {
        console.log(error)
        var message = {
            'status': 505,
            'message': error['message'],
        }
        res.status(505).send(message)
    }


    // const allUsers = User.find({})

    // allUsers.then((result) => {
    //     if (!result)
    //         res.status(404).send('No User Available')
    //     res.send(result)
    // }).catch((error) => {
    //     res.status(500).send()
    // })


})

function validateReadAllUser(requestData) {
    console.log('validateReadAllUser Called...')

    try {
        const numOfKeys = Object.keys(requestData.body).length
        const keys = Object.keys(requestData.body)

        if (requestData.method != 'POST') {
            throw 'In validateReadAllUser, method is not POST type'
        } else if (numOfKeys < 1 || numOfKeys > 1) {
            throw `num of keys ${numOfKeys} is not equal to 1`
        } else if (!requestData.body.id) {
            throw new Error(`id is null. id param cannot be empty`)
        }

        return {
            isValid: 1,
            message: `validateReadAllUser request is valid`
        }

    } catch (err) {
        return {
            isValid: 0,
            message: err['message']
        };
    }
}

/// for getting specific user on basis of its _id

// app.post('/readSpecificUser', (req, res) => {
//     const id = req.body.id
//     const allUsers = User.findById(id)

//     allUsers.then((result) => {
//         if (!result)
//             res.status(404).send('No User Available')
//         res.send(result)
//     }).catch((error) => {
//         res.status(500).send()
//     })
// })




/****************************************************************************************************************************************************** */


/********************************************************************UPDATE USER************************************************************************ */

app.post('/updateUserProfile', [
    auth.auth,
    userController.updateUserProfile
])
/******************************************************************************************************************************************************* */


/********************************************************************CREATE TASK************************************************************************ */

app.post('/createTask', [
    auth.auth,
    taskController.createTask
])

/********************************************************************FETCH TASK DETAILS************************************************************************ */

app.post('/getTask', [
    auth.auth,
    taskController.getTask
])


/********************************************************************UPDATE TASK DETAILS BY ID****************************************************************** */

app.post('/updateTask', [
    auth.auth,
    taskController.updateTask
])

/********************************************************************DELETE TASK DETAILs BY ID****************************************************************** */

app.post('/deleteTask', [
    auth.auth,
    taskController.deleteTaskById
])


/************************************************************************************************************************************************************** */


/// creation end point task (apiUrl: localhost:3100/tasks)
/// Goal
//  1. Create a separate file for task model and import in index.js
//  2. Create the task creation endpoint (handle result and error)
//  3. Test it from the postman for result and error


app.post('/createTasks', async (req, res) => {

    const createTask = new Task(req.body)

    try {
        await createTask.save()
        res.status(201).send(createTask)
    } catch (error) {
        console.log(error)
        res.status(505).send(error)
    }

    ///new async await

    /// Old method then catch
    // createTask.save().then((result) => {
    //     console.log(result)
    //     res.send(result)
    // }).catch((error) => {
    //     console.log(error)
    //     res.send(error)
    // })

})


/// reading task endpoint
/// Goal
//  1. Create a end point for reading all task
//  2. Create a end point for reading a task by its id
//  3. Test it on postman

app.post('/fetchAllTasks', async (req, res) => {


    try {
        const allTask = await Task.find({})

        console.log(`task result: ${allTask}`)
        if (!allTask) {
            res.status(404).send('No task available')
        }


        return res.send(allTask)
    } catch (error) {
        res.status(505).send(error)
    }




    /// Old Way
    // const allTask = Task.find({})
    // allTask.then((result) => {
    //     if (!result) {
    //         res.status(404).send('No task is present')
    //     }
    //     res.send(result)
    // }).catch((error) => {
    //     res.status(505).send(error)
    // })

})

app.post('/fetchSpecificTask', async (req, res) => {

    try {
        const taskId = req.body.id
        console.log(`taskId: ${taskId}`)

        /// New way
        const task = await Task.findById(taskId)
        if (!task)
            res.status(404).send(`No task is availbale for this time`)
        console.log(`task result: ${task}`)
        res.send(task)
    } catch (error) {
        res.status(505).send(error)
    }



    /// Old way
    // const allTask = Task.findById(taskId)

    // allTask.then((result) => {
    //     if (!result) {
    //         res.status(404).send('No task is present')
    //     }
    //     res.send(result)
    // }).catch((error) => {
    //     res.status(505).send(error)
    // })

})


/// resource updating end point
app.post('/updateUserById', async (req, res) => {

    const body = req.body
    const updates = Object.keys(req.body).reduce((object, key) => {
        if (key != 'id') {
            object[key] = body[key]
        }
        return object
    }, {})

    const keysValue = Object.keys(updates)

    console.log('updates: ', keysValue)


    const allowedUpdateKey = ['name', 'age', 'email', 'password']

    const isValid = keysValue.every((value) => {
        return allowedUpdateKey.includes(value)
    })

    console.log(`isValid: ${isValid}`)

    if (!isValid)
        return res.status(404).send('Invalid request for update')

    try {
        const id = req.body.id
        // while we dont need to add set parameter as like in mongodb
        // mongoose handle all that by himself 

        const updatedUser = await User.findById(id)

        keysValue.forEach(function (update) {
            updatedUser[update] = req.body[update]
        })

        const user = await updatedUser.save()

        /// old way
        /// below method bypasses the middleware in user.js
        // const user = await User.findByIdAndUpdate(id, req.body, {
        //     new: true,
        //     runValidators: true
        // })

        console.log('users: ' + user)

        if (!user)
            res.status(404).send(`No id is present with ${id}`);
        res.send(user);

    } catch (error) {
        console.log(error);
        res.status(505).send(error);
    }


});

app.patch('/updateTask/:_id', async (req, res) => {
    console.log('body:' + req.body)
    const body = req.body
    // const updates = Object.keys(req.body).reduce((object, key) => {
    //     if (key != '_id') {
    //         object[key] = body[key]
    //     }
    //     return object
    // }, {})

    // const keysValue = Object.keys(updates)

    // console.log('params want to update: ', keysValue)


    // const allowedUpdateKey = ['description', 'completed']

    // const isValid = keysValue.every((value) => {
    //     return allowedUpdateKey.includes(value)
    // })

    // console.log(`isValid: ${isValid}`)

    // if (!isValid)
    //     return res.status(404).send('Invalid request for update')

    try {
        const id = req.body._id
        // while we dont need to add set parameter as like in mongodb
        // mongoose handle all that by himself 
        const user = await User.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        })

        console.log(`users: ${user}`)

        if (!user)
            return res.status(404).send(`No id is present with ${id}`)
        res.send(user)

    } catch (error) {
        console.log(error)
        return res.status(505).send(error)
    }


});


//listening
app.listen(portNumber, () => {
    console.log(`listening on port ${portNumber}`)
});