let mongo = require ('mongodb')
let {MongoClient} = require ('mongodb')
let mongoUrl = "mongodb+srv://shiv-amazon_13:c34i8xusS5JQsS6e@cluster0.t95hps5.mongodb.net/?retryWrites=true&w=majority"
let client = new MongoClient(mongoUrl)


async function dbConnect(){
    await client.connect()
}


let db = client.db('amazon')


// Function to get(Read) the data 
async function getData (colName, query){
    let output = []
    try {
        const cursor = db.collection(colName).find(query)
        for await ( const data of cursor){
            output.push(data)
        }
        cursor.closed
    }
    catch(err){
        output.push({"Error":"Error in getData"})
    }
    return output
}


// Function to post(Enter) the data 
async function postData(colName,data){
    let output;
    try{
        output = await db.collection(colName).insertOne(data)
    }
    catch(err){
        output = {"response":"Error in postData"}
    }
    return output
}


// Function to update the data 
async function updateOrder(colName,condition,data){
    let output;
    try{
        output = await db.collection(colName).updateOne(condition,data)
    } catch(err){
        output = {"response":"Error in update data"}
    }
    return output
}


// Function to delete(Remove) the data 
async function deleteOrder(colName,condition){
    let output;
    try{
        output = await db.collection(colName).deleteOne(condition)
    } catch(err){
        output = {"response":"Error in delete data"}
    }
    return output
}




module.exports = {
    dbConnect,
    getData,
    postData,
    updateOrder,
    deleteOrder
}