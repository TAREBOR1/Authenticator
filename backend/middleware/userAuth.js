const jwt = require('jsonwebtoken');


exports.VerifyToken=(req,res,next)=>{
    const {token}=req.cookies;
    if(!token){
        return res.status(401).json({
            success:false,
            message:"not authorised , login again 1"
        })
    }
    try {
        const tokenDecode= jwt.verify(token,process.env.SECRET_KEY)
        if(tokenDecode.id){
            req.body.userId=tokenDecode.id;
        }else{
           return res.status(401).json({
                success:false,
                message:"not authorised , login again 2"
            })
        }
        next();
    } catch (error) {
        res.status(400).json({
            message:error.message,
            success:false  
    })
    }
}





