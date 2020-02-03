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
        let task = await Task.findOne({
            _id: req.body.taskId,
            userDetails: req.user._id
        });

        if (!task) {
            throw new Error("task is not present in db");
        }

        console.log(`task: ${JSON.stringify(task)}`);


        ///details with the task details and also user details
        const details = await task.populate('userDetails').execPopulate('User');

        console.log(`details: ${JSON.stringify(details)}`);

        // let task = await Task.find({
        //     userDetails : req.user._id
        // });

        // /// this will populate all the task of authenticated user
        // const details = await req.user.populate('tasks').execPopulate();

        let user = hidePrivateData(details);

        console.log(`hide privatedata: ${JSON.stringify(user)}`);
        // details.userDetails = user;

        // console.log(`details: ${JSON.stringify(details)}`);
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

function hidePrivateData(details){
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