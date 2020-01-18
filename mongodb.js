// Perform basic CRUD operation in mongodb

const mongodb = require('mongodb');

const mongoClient = mongodb.MongoClient;
const ObjectId = mongodb.ObjectId

//two params one is connectionUrl and dbName
const connectionUrl = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

///print unqiue objectId(primaryKey) and timestamp
console.log(ObjectId.ObjectId())
console.log(ObjectId.ObjectId().getTimestamp())

///connection to  
//@params
//connectionUrl: url of db
//options userNewUrlParser: to stop the default parser and new parser
//callbacks: to handle the success/failure of connectiong to mongodb
mongoClient.connect(connectionUrl, {
    useNewUrlParser: true
}, (error, client) => {
    if (error) {
        return console.log('Unable to connect to db')
    }

    ///( Create)
    //inserting into documents
    //insertOne will only insert one into document
    // client.db(databaseName).collection('users').insertOne({
    //     name: 'Jay',
    //     age: 25
    // }, (error, result) => {
    //     if (error) {
    //         return console.log('Unable to insert the user');
    //     }
    //     console.log(result.ops);
    // })


    // //for multiple insertion in a single time
    // client.db(databaseName).collection('users').insertMany([{
    //         name: 'Alex',
    //         age: 25,

    //     },
    //     {
    //         name: 'Cherry',
    //         age: 27,

    //     },
    //     {
    //         name: 'Kalie',
    //         age: 24,
    //     }
    // ], (error, result) => {
    //     if (error) {
    //         return console.log('Unable to install to insertMany into documents')
    //     }
    //     console.log(result.ops)
    // })

    ///Read from db (Using findOne to findOnly one item in document)
    // client.db(databaseName).collection('users').findOne({
    //     name: 'Alex',
    //     age: 21
    // }, (error, user) => {
    //     if (error)
    //         return console.log('Unable to fetch');

    //     return console.log(user);

    //     // client.close()

    // })

    /// this will find all the documents having same value as field (:FIND RETURNS A CURSOR DO NOT USE CALLBACK HERE)
    // client.db(databaseName).collection('users').find({age: 25}).toArray((error, users) => {
    //     if(error){
    //         return console.log(error)
    //     }
    //     console.log(users)

    // })

    ///updateOne only update the selected document 
    //updating on basis of _id

    /// some feature of update
    // $set to set the value to field, 
    // $rename to rename the field, 
    // $unset to remove the field from document, 
    // $inc to increment the value of field by given amt

    // const updatePromise1 = client.db(databaseName).collection('users').updateOne({
    //     _id: new ObjectId('5e0127d99ebf0b0d4ca96e9d')
    // }, {
    //     $set: {
    //         name: 'Ellish'
    //     },
    //     $inc: {
    //         age: 1
    //     }
    // })

    // updatePromise1.then((result) => {
    //     console.log(result)
    // }).catch((e) => {
    //     console.log(e)
    // })


    ///updatedMany will update all the document satisfying condition
    const updatedManyPromise = client.db(databaseName).collection('users').updateMany({
        age: 26
    }, {
        $inc: {
            age: 2
        }
    })

    updatedManyPromise.then((result) => {
        console.log('Success: ' + result)
    }).catch((e) => {
        console.log('Error: ' + e)
    })

    /// deleteOne and deleteMany will delete the documents on basis of condition
    const deletedOnePromise1 = client.db(databaseName).collection('users').deleteOne({
        _id: new ObjectId('5e0127d99ebf0b0d4ca96e9d')
    })

    deletedOnePromise1.then((result) => {
        console.log(`deletedOnePromise1 result: ${result}`)
    }).catch((e) => {
        console.log(`deletedOnePromise1 result: ${e}`)
    })

})