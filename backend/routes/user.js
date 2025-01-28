const express= require('express');
const userRouter= express.Router();
const authMiddleware=require("../middleware/userAuth")
const userController=require("../controllers/user")

userRouter.get('/getUser',authMiddleware.VerifyToken,userController.getUser);

module.exports=userRouter