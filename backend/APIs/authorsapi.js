const express = require('express');
const authorApp = express.Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
let verifyToken=require('../verifytoken')
let authorsCollection;
let articlesCollection;
authorApp.use((req, res, next) => {
    authorsCollection = req.app.get('authorsCollection');
    articlesCollection = req.app.get('articlesCollection');
    next();
});

authorApp.get('/get-author', async (req, res) => {
    let authors = await authorsCollection.find().toArray();
    res.send({ message: "ALL Authors", payload: authors });
})


authorApp.post('/register', async (req, res) => {
    let newAuthor = req.body;
    let name = newAuthor.name;
    let user = await authorsCollection.findOne({ name: name });
    if (user!== null) {
        return res.send({message:"Author already exists"});
    }
    else {
        let hashedPassword = await bcryptjs.hash(newAuthor.password, 6);
        newAuthor.password = hashedPassword;
        await authorsCollection.insertOne(newAuthor);
        res.send({ message: "Author Added." })
    }
})


authorApp.post('/article', async (req, res) => {
    const newArticle = req.body;
    console.log(newArticle)
    await articlesCollection.insertOne(newArticle);
    res.send({ message: "Article added" });
});
//login author
authorApp.post('/login',async (req, res) => {
    const credObj = req.body;
    let dbAuthor = await authorsCollection.findOne({ name: credObj.name })
    if (dbAuthor === null) {
        res.send({ message: "Invalid Username" })
    }
    else {
        let result = await bcryptjs.compare(credObj.password, dbAuthor.password)
        if (result === false) {
            res.send({ message: "Invalid Password" })
        }
        else {
            let signedToken = jwt.sign({ name: dbAuthor.name }, 'abcdef', { expiresIn: 30 });
            res.send({ message: "Login Successfull", token: signedToken, author: dbAuthor });
        }
    }
})

authorApp.delete('/delete-author/:id', async (req, res) => {
    let id = Number(req.params.id);
    await authorsCollection.deleteOne({ id: id });
    res.send({message:"Author deleted"});
});
authorApp.put("/article", verifyToken, async (req, res) => {
    //get modified article from req
    let modifiedArticle = req.body;
    //update article by its id
    let articleModification = await articlesCollection.findOneAndUpdate(
      { articleId: modifiedArticle.articleId },
      { $set: { ...modifiedArticle } },
      { returnDocument: "after" }
    );
  
    //send res
    res.send({ message: "Article updated", payload: articleModification });
  });
// get articles of author
authorApp.get('/articles/:name', async (req, res) => {
    let authorName = req.params.name;
    let articlesList = await articlesCollection.find({ username: authorName }).toArray();
    res.send({ message: "Article found", payload: articlesList });
});


// update articles satatus
authorApp.put('/articles/:username/:articleId', async (req, res) => {
    let articleIdOfUrl = req.params.articleId;
    //get status from request
    let currentStatus = req.body.status;
    console.log(currentStatus)
    if (currentStatus === true) {
        let removedArticle = await articlesCollection.findOneAndUpdate(
            { articleId: articleIdOfUrl },
            { $set: { status: false } },
            { returnDocument: "after" }
        );
        res.send({ message: "article removed", payload:removedArticle })
    }
    if (currentStatus === false) {

        let restoresArticle = await articlesCollection.findOneAndUpdate(
            { articleId: articleIdOfUrl },
            { $set: { status: true } },
            { returnDocument: "after" }
        );
        res.send({ message: "articel restored", payload: restoresArticle })
    }
})
module.exports = authorApp;




