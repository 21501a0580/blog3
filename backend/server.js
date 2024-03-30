const express=require('express')
const app =express();
const mongoClient=require('mongodb').MongoClient;
const userApp=require('./APIs/usersapi');

const path=require('path');
const cors=require('cors')
app.use(express.json());
app.use(express.static(path.join(__dirname,'../demo1/build')))

app.use(cors())
const dbUrl='mongodb://localhost:27017';
mongoClient.connect(dbUrl)
.then(client=>{
    const dbObj=client.db('Store');
    const usersCollection=dbObj.collection('users');
    app.set('usersCollection',usersCollection);
    console.log('connected to DataBase Successfully');
})

app.use('/usersapi',userApp);

app.use((err,req,res,next)=>{
    res.send({message:"ERROR Caught",payload:err});
})

const port=4000;
app.listen(port,console.log(`http://localhost:${port}`))