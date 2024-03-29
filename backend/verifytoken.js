const { ModuleDetectionKind }=require('typescript');
const jwt=require('jsonwebtoken')
const verifyToken=(req,res,next)=>{
    let bearerToken=req.headers.authorization;
    if(bearerToken===undefined){
        return res.send("Unauthorized Access");
    }
    let token=bearerToken.split(' ')[1];
    try{
        let decodedToken=jwt.verify(token,'abcdef');
        next();
    }
    catch(err){
        console.log("jwt Token Expired")
    }
}
module.exports=verifyToken