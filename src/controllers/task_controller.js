const Task = require('../models/tasks');

exports.createTask = async function (req, res) {
    console.log('createTask Called...');

    try {

        const requestBody = req.body;
        console.log(`requestBody: ${JSON.stringify(requestBody)}`);

        const isValidRequest = validateCreateTask(req);

        if (!isValidRequest.isValid)
            throw isValidRequest.message;

        let task = new Task({
            ...requestBody,
            userDetails: req.user._id
        });

        console.log(`task data: ${JSON.stringify(task)}`);

        await task.save();
        // const userDetails = task.populate('userDetails');
        // console.log(`userDetails: ${JSON.stringify(userDetails)}`);

        let returnObject = {
            status: 200,
            message: "success",
            data: task
        }

        console.log(`task data: ${JSON.stringify(returnObject)}`);
        return res.status(200).send(returnObject);


    } catch (error) {
        console.log(`createTask error: ${error['message']}`);
        let returnObject = {
            status: 505,
            message: error['message']
        }

        console.log(`task data: ${JSON.stringify(returnObject)}`);
        return res.status(200).send(returnObject);

    }

}

function validateCreateTask(requestData) {
    console.log('validateCreateTask Called...');

    try {

        const numOfKeys = Object.keys(requestData.body).length;
        const keys = Object.keys(requestData.body);
        const requestBody = requestData.body;

        /// keys must be [description], []

        if (requestData.method != 'POST') {
            throw 'In validateCreateUser, method is not POST type'
        }
        if (numOfKeys < 1) {
            throw `In validateCreateUser, num of keys ${numOfKeys} is not equal to 1`
        }

        if (!requestBody.description)
            throw 'In validateCreateUser, description is null or empty'

        return {
            isValid: 1,
            message: `validateCreateTask request is valid`
        }

    } catch (error) {
        console.log(`error: ${error}`)
        return {
            isValid: 0,
            message: error
        }
    }
}

/**************************************************************************************************************************************************** */

exports.getTask = async function (req, res) {
    console.log('getTask Called...');

    const requestBody = req.body;
    console.log(`request body: ${JSON.stringify(requestBody)}`)

    try {

        /// this will populate the single task of authenticated user 
        /// If task Id not match and userId is not present in task collection then result will be error
        let task = await Task.findOne({
            _id: req.body.taskId,
            userDetails: req.user._id
        });

        if (!task) {
            throw new Error("task is not present in db");
        }

        console.log(`task: ${JSON.stringify(task)}`);


        ///details populate with the user details
        const details = await task.populate('userDetails').execPopulate('User');

        console.log(`details: ${JSON.stringify(details)}`);

        /// this will populate all the task
        // let task = await Task.find({
        //     userDetails : req.user._id
        // });

        // /// this will populate all the task of authenticated user (virtual data not stored in user node)
        // const details = await req.user.populate('tasks').execPopulate();


        /// this will hide the tokens and passwords key of user object
        let user = hidePrivateData(details);

        console.log(`hide privatedata: ${JSON.stringify(user)}`);

        let returnObject = {
            status: 200,
            message: "success",
            data: user
        }

        return res.status(200).send(returnObject);


    } catch (error) {
        console.log(`error: ${error['message']}`);

        let returnObject = {
            status: 505,
            message: error['message']
        };

        return res.status(200).send(returnObject);
    }

}


/**************************************************************************************************************************************************** */
function hidePrivateData(details) {
    console.log('hidePrivateData Called...');
    let returnObject = details.toObject();
    let userDetails = details.userDetails.toObject();
    delete returnObject.userDetails;

    console.log(`returnObject: ${JSON.stringify(returnObject)}`)

    delete userDetails.password;
    delete userDetails.tokens;


    console.log(`userDetails: ${JSON.stringify(userDetails)}`)

    returnObject.userDetails = userDetails;

    return returnObject;

}


/***************************************************************************************************************************************************** */

/// this method will update the task details by id
exports.updateTask = async function (req, res) {
    console.log('updateTask Called...');

    let requestBody = req.body;
    console.log(`requestBody: ${JSON.stringify(requestBody)}`);

    try {

        const isValidRequest = validateUpdateTask(req);

        if (!isValidRequest.isValid) {
            throw isValidRequest.message
        };

        let keysValue = Object.keys(requestBody);

        console.log(`keysValue: ${JSON.stringify(keysValue)}`);

        let task = await Task.findOne({
            _id: requestBody.taskId,
            userDetails: req.user._id
        });

        if (!task) {
            throw new Error('task is not exist');
        }

        console.log(`task: ${JSON.stringify(task)}`);

        keysValue.forEach(function (update) {
            if (update != 'taskId') {
                task[update] = requestBody[update];
            }
        })

        console.log(`task: ${JSON.stringify(task)}`);

        ///save the updated details
        await task.save();

        let returnObject = {
            status: 200,
            message: 'success',
            data: task
        }

        console.log(`returnObject: ${JSON.stringify(returnObject)}`);
        return res.status(200).send(returnObject);



    } catch (error) {
        console.log(`updateTask catchError: ${error}`);

        let returnObject = {
            status: 505,
            message: 'fail'
        }

        console.log(`returnObject: ${JSON.stringify(returnObject)}`);

        return res.status(200).send(returnObject);
    }


}

function validateUpdateTask(requestData) {
    console.log('validateUpdateTask Called...');

    const numOfKeys = Object.keys(requestData.body).length;
    try {

        if (requestData.method != 'POST') {
            throw 'In validateUpdateTask, method is not POST type'
        }

        if (numOfKeys < 1) {
            throw `In validateUpdateTask, number of keys ${numOfKeys} is not less than  1`
        }

        if (!requestData.body.taskId) {
            throw `In validateUpdateTask, taskId is null or empty`
        }

        return {
            isValid: 1,
            message: `validateUpdateTask request is valid`
        };

    } catch (error) {
        console.log(`InValidateUpdateTask catch error: ${error['message']}`);

        return {
            isValid: 0,
            message: `validateUpdateTask request is invalid`
        };

    }

}

/****************************************************************************************************************************************************** */

exports.deleteTaskById = async function (req, res) {
    console.log('deleteTaskById Called...');

    let requestBody = req.body;
    console.log(`requestBody: ${JSON.stringify(requestBody)}`);

    try {

        const isValidRequest = validateDeleteTaskById(req)

        if (!isValidRequest.isValid) {
            throw isValidRequest.message;
        }

        const task = await Task.findOneAndDelete({
            _id: requestBody.taskId,
            userDetails: req.user._id
        });

        console.log(`delete task: ${JSON.stringify(task)}`);

        if (!task) {
            throw new Error(`task is not exist`);
        }

        let returnObject = {
            status: 200,
            message: 'successful',
            data: task
        }
        return res.status(200).send(returnObject);



    } catch (err) {
        console.log(`deleteTaskById catchError: ${err}`);

        let returnObject = {
            status: 505,
            message: err['message'],
        };

        return res.status(200).send(returnObject);

    }
}

function validateDeleteTaskById(req) {
    console.log('validateDeleteTaskById Called...');

    const numOfKeys = Object.keys(req.body).length;
    console.log(`requestBody: ${JSON.stringify(req.body)}`);
    try {

        if (req.method != 'POST') {
            throw new Error('In validateDeleteTaskById method is not POST type');
        }

        if (numOfKeys < 1) {
            throw new Error('In validateDeleteTaskById, num ');
        }

        if (!req.body.taskId) {
            throw new Error('In validateDeleteTaskById, taskId cannot be null');
        }

        return {
            isValid: 1,
            message: 'validateDeleteTaskById request is valid'
        };

    } catch (err) {
        console.log(`validateDeleteTaskById: ${err['message']}`);
        return {
            isValid: 0,
            message: 'validateDeleteTaskById request is invalid'
        };

    }

}