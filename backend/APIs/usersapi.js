const express=require('express')
const userApp = express.Router()
const bcryptjs=require('bcryptjs')
const jwt =require('jsonwebtoken');
const verifyToken = require('../verifytoken');

let usersCollection;
//export default autorCollection;
userApp.use((req,res,next)=>{
    usersCollection = req.app.get('usersCollection')
    next();
});

userApp.post(('/register'),async(req,res)=>{
    let newUser=req.body;
    newUser.status=true
    newUser.inventory=[];
    let dbUser = await usersCollection.findOne({username:newUser.username})
    if (dbUser !== null){
        return res.send({message:"Username already taken"})
    }  
    let hashedPassword=await bcryptjs.hash(newUser.password,6);
    newUser.password=hashedPassword;
    await usersCollection.insertOne(newUser);
    res.send({message:"Signup Successfull"})
});

userApp.post('/login',async(req,res)=>{
    const credObj = req.body;
    let dbuser = await usersCollection.findOne({username:credObj.username})
    if(dbuser === null){
        res.send({message:"Invalid Username"})
    }
    else
    {
        let result = await bcryptjs.compare(credObj.password,dbuser.password)
        if(result === false)
        {
            res.send({message:"Invalid Password"})
        }
        else
        {
            let signedToken=jwt.sign({username:dbuser.username},'abcdef',{expiresIn:30});
            res.send({message:"Login Successfull",token:signedToken,user:dbuser});
        }
    }
})

userApp.put('/update-inventory',async(req,res)=>{
    let modifiedUser=req.body;
    let user=await usersCollection.findOne({username:modifiedUser.username})
    if(user){
    let newInventory=modifiedUser.inventory
    let newUser=await usersCollection.findOneAndUpdate(
        {username:modifiedUser.username},
        {$set:{inventory:newInventory}},
        {returnDocument:"after"});
    res.send({message:"Inventory Updated",payload:newUser});
    }
});

userApp.get('/inventory/:username',async(req,res)=>{
    let username=req.params.username;
    let user=await  usersCollection.findOne({username:username})
    res.send(user)
})

module.exports=userApp;