let express = require('express')
let app = express();             // app is an object of express() 
let port = process.env.PORT||1320
let Mongo =require ('mongodb')
const bodyParser = require('body-parser');
const cors = require('cors');
let {dbConnect, getData, postData, updateOrder, deleteOrder} = require ('./controller/dbController')     
//importing dbConnect and getData function from   dbController.js


// middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors())


// This is how we create routes app.get()
app.get('/' , (req,res) => {
    res.send('Hello Welcome to Express')
})


// This is how we create category routes app.get()
app.get('/categories' , async (req,res) => {
    
    let query = {}
    let collection = "categories"
    let output = await getData ( collection , query)   
    res.send(output)

})

// This is for categoryType(QuickSearch)
app.get('/quickSearch' , async (req,res) => {
    
    let query = {}
    let collection = "categoryType"
    let output = await getData ( collection , query)   
    res.send(output)

})


// This is how we create product routes app.get()
app.get('/product', async(req,res) => {

    let query = {}

    if(req.query.category_id && req.query.id){
        query={category_id: Number(req.query.category_id) , id: Number(req.query.id)}
    }

    else if(req.query.category_id){
        query={category_id : Number(req.query.category_id)}
    }

    else if(req.query.id){
        query={id: Number(req.query.id)}
    }

    else{
        query = {}
    }

    let collection = "product";
    let output = await getData(collection,query);
    res.send(output)
})


// Filters
app.get('/filter/:category_id', async(req,res) => {
   
    let categoryId = Number(req.params.category_id);
    let productId = Number(req.query.id)

    let lprice = Number(req.query.price)
    let hprice= Number(req.query.price)

    if(categoryId){
        query = {
            category_id:categoryId,
             id:productId
        }
    }
    else if(lprice && hprice){
        query = {
            category_id:categoryId,
            $and:[{cost:{$gt:lprice,$lt:hprice}}]
        }
    }  
    else{
        query = {}
    }

    let collection = "product";
    let output = await getData(collection,query);
    res.send(output)
})


// details
app.get('/details/:id', async(req,res) => {

    // for getting Details by using "_id"
    // let id = new Mongo.ObjectId(req.params.id)
    // let query = {_id:id}

    let Id = Number(req.params.id);
    let query = {id:Id}
    let collection = "product";
    let output = await getData(collection,query);
    res.send(output)
})



//orders
app.get('/orders', async(req,res) => {
    
    let query = {};

    if(req.query.email){
        query={email:req.query.email}
    }else{
        query = {}
    }  
    let collection = "orders";
    let output = await getData(collection,query);
    res.send(output)
})


//placeOrder
app.post('/placeOrder',async(req,res) => {
    let data = req.body;
    let collection = "orders";
    console.log(">>>",data)
    let response = await postData(collection,data)
    res.send(response)
})


//menu details {"id":[4,8,21]}
app.post('/menuDetails',async(req,res) => {
    if(Array.isArray(req.body.id)){
        let query = {id:{$in:req.body.id}};
        let collection = 'product';
        let output = await getData(collection,query);
        res.send(output)
    }
    else{
        res.send('Please enter data in the form of array')
    }
})


// Update
app.put('/updateOrder',async(req,res) => {
    let collection = 'orders';
    let condition = {"_id":new Mongo.ObjectId(req.body._id)}
    let data = {
        $set:{
            "status":req.body.status
        }
    }
    let output = await updateOrder(collection,condition,data)
    res.send(output)
})


//delete order
app.delete('/deleteOrder',async(req,res) => {
    let collection = 'orders';
    let condition = {"_id":new Mongo.ObjectId(req.body._id)}
    let output = await deleteOrder(collection,condition)
    res.send(output)
})






// This is how we create data server app.listen()
app.listen( port , (error) => {
   
    dbConnect()                   //calling dbConnect function when server starts loading 
    if (error) throw error
    console.log(`Server is running on port ${port}`)   

})
