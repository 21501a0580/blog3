const express=require('express')
const userApp = express.Router()
const bcryptjs=require('bcryptjs')
const jwt =require('jsonwebtoken');
const verifyToken = require('../verifytoken');

let usersCollection;
let articlesCollection
//export default autorCollection;
userApp.use((req,res,next)=>{
    usersCollection = req.app.get('usersCollection')
    articlesCollection=req.app.get('articlesCollection')
    next();
});


userApp.get('/test-user',async(req,res)=>{
    let usersList=await usersCollection.find().toArray();
    res.send({message:"All users",payload:usersList});
});


userApp.post(('/register'),async(req,res)=>{
    let newUser=req.body;
    let dbUser = await usersCollection.findOne({name:newUser.name})
    if (dbUser !== null){
        return res.send({message:"User already exists"})
    }  
    let hashedPassword=await bcryptjs.hash(newUser.password,6);
    newUser.password=hashedPassword;
    await usersCollection.insertOne(newUser);
    res.send({message:"User created"})
});

//login author
userApp.post('/login',async(req,res)=>{
    const credObj = req.body;
    let dbuser = await usersCollection.findOne({name:credObj.username})
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
            let signedToken=jwt.sign({name:dbuser.name},'abcdef',{expiresIn:30});
            res.send({message:"Login Successfull",token:signedToken,user:dbuser});
        }
    }
})

userApp.put('/update-user',async(req,res)=>{
    let modifiedUser=req.body;
    let newUser=await usersCollection.findOneAndUpdate(
        {id:modifiedUser.id},
        {$set:{...modifiedUser}},
        {returnDocument:"after"});
    res.send({message:"User Details Updated",payload:newUser});
});

userApp.put('/article/:articleId/comment',async(req,res)=>{
    let comment=req.body;
    let newarticleId=req.params.articleId;
    let modifiedArticle=await articlesCollection.findOneAndUpdate(
        {articleId:newarticleId},
        {$addToSet:{comments:comment}},
        {returnDocument:"after"}
    )
    res.send({message:"comment updated",payload:modifiedArticle})
})

userApp.delete('/delete-user/:id',async(req,res)=>{
    let id=Number(req.params.id);
    await usersCollection.deleteOne({id:id});
    res.send("User deleted");
});

userApp.get('/articles',verifyToken,async(req,res)=>{
    let articleList=await articlesCollection.find().toArray();
    res.send({message:"articles list",payload:articleList})
})



module.exports=userApp;