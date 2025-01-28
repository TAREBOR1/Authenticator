const Users = require('../model/user')
const bcrypt=require('bcryptjs')
const jwt = require('jsonwebtoken');
const transporter  = require('../config/nodemailer');
const {EMAIL_VERIFY_TEMPLATE,PASSWORD_RESET_TEMPLATE}= require('../config/emailtemplate')

exports.signup= async (req,res)=>{
 const {username,email,password}= req.body;
 if(!username||!email||!password){
    return res.status(400).json({
        message:"missing details",
        success:false
    })
 }
 try {
    const existingUser= await Users.findOne({email})
    if(existingUser){
       return res.status(400).json({
           message:"user already exist",
           success:false
       })
    }
    const hashedpassword= await bcrypt.hash(password,10)
     const user = new Users({
        username,
        password:hashedpassword,
        email
     })

     await user.save()

     const token= jwt.sign({id:user._id},process.env.SECRET_KEY,{expiresIn:'7d'})
     res.status(200).cookie("token",token,{
        httpOnly:true,
        secure:process.env.NODE_ENV==="production",
        sameSite:process.env.NODE_ENV==="production" ? 'none' : 'strict',
        maxAge: 7*24*60*60*1000
     })

// SENDING WELCOME EMAIL
  const mailOptions={
    from: process.env.SENDER_EMAIL, // sender address
    to: email, // list of receivers
    subject: "WELCOME TO AUTHENTICATOR ", // Subject line
    text: `Welcome to authenticator website.your account has been created with email id: ${email}`
  }
   await transporter.sendMail(mailOptions);


     return res.json({success:true})
 } catch (error) {
    res.status(400).json({
        message:error.message,
        success:false
    })
 }
}

exports.login= async(req,res)=>{
    const {email,password}= req.body;
    if(!email||!password){
        return res.status(400).json({
            message:"email and password required",
            success:false
        })
    }
    try {
        const validUser= await Users.findOne({email})
        if(!validUser){
            return res.status(400).json({
                message:"User does not exist",
                success:false
            })}
        const validatePassword= await bcrypt.compare(password,validUser.password);
        if(!validatePassword){
            return res.status(400).json({
                message:"invalid password",
                success:false
            })
        }

        // const {password:pass,...rest}=validUser._doc;

      const token= jwt.sign({id:validUser._id},process.env.SECRET_KEY,{expiresIn:'7d'})
     
        res.status(200).cookie("token",token,{
           httpOnly:true,
           secure:process.env.NODE_ENV==="production",
           sameSite:process.env.NODE_ENV==="production" ? 'none' : 'strict',
           maxAge: 7*24*60*60*1000
        })
        return res.json({success:true})
    } catch (error) {
        res.status(400).json({
            message:error.message,
            success:false  
    })
}
}


exports.logout= async(req,res)=>{
    try {
        res.clearCookie('token',{
            httpOnly:true,
            secure:process.env.NODE_ENV==="production",
            sameSite:process.env.NODE_ENV==="production" ? 'none' : 'strict',
        })
        return res.status(200).json({
            success:true,
            message:"Logged out successfully"
        })
    } catch (error) {
        res.status(400).json({
            message:error.message,
            success:false  
    })
    }
}


exports.sendVerifyOtp=async(req,res)=>{
    try {
         const {userId}=req.body
         const User= await Users.findById(userId)
         if(User.isAccountVerified){
            return res.status(400).json({
                success:false,
                message:"account already verified"
            })
         }
     const  otp= Math.random().toString().slice(2,8)
      User.verifyOTP=otp,
      User.verifyOTPexpiresAt= Date.now() + 24*60*60*1000   
   await User.save()

   const mailOptions={
    from: process.env.SENDER_EMAIL, // sender address
    to: User.email, // list of receivers
    subject: "ACCOUNT OTP VERIFICATION", // Subject line
    // text: `your OTP verification code is : ${otp}`, 
    html:EMAIL_VERIFY_TEMPLATE.replace('{{otp}}',otp).replace('{{email}}',User.email)

  }
   await transporter.sendMail(mailOptions);

   res.status(200).json({
    success:true,
    message:"otp verification code sent"
   })
       } catch (error) {
        res.status(400).json({
            message:error.message,
            success:false  
    })
    }
}

exports.verifyOTP=async(req,res)=>{
    const{ userId,otp}=req.body;
    if(!userId || !otp){
        return res.status(400).json({
            success:false,
            message:"missing details"
        })
    }
    try {
        const user = await Users.findById(userId)
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User does not exist"
            })
        }
        if(user.verifyOTP===''||user.verifyOTP!==otp){
            return  res.status(400).json({
                success:false,
                message:"invalid otp"
            })
        }
        if(user.verifyOTPexpiresAt < Date.now()){  
            return  res.status(400).json({
                success:false,
                message:"otp has expired"
            })
        }

        user.isAccountVerified=true,
        user.verifyOTP='',
        user.verifyOTPexpiresAt=0

        await user.save();

        return  res.status(200).json({
            success:true,
            message:"Email verified successfully"
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:error.message
        })
    }
}

exports.isAuthenticated=async(req,res)=>{
    try {
        return res.status(200).json({
            success:true
        })
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:error.message
        })
    }
}

exports.resetPasswordOtp=async(req,res)=>{
    const {email}=req.body
    if(!email){
        return res.status(400).json({
            success:false,
            message:"provide a valid email address"
        })
    }
    try {
        const user = await Users.findOne({email})
        if(!user){
            res.status(200).json({
                success:false,
                message:"user does not exist"
            })
        }
   const otp = Math.random().toString().slice(2,8);
   user.resetOTP=otp,
   user.resetOTPexpiresAt= Date.now() + 15*60*1000

   await user.save();

   const mailOptions={
    from: process.env.SENDER_EMAIL, // sender address
    to: user.email, // list of receivers
    subject: "PASSWORD OTP VERIFICATION", // Subject line
    // text: `your OTP verification code is : ${otp}, use this otp to reset your password`, 
    html:PASSWORD_RESET_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)

  }
   await transporter.sendMail(mailOptions);

   res.status(200).json({
    success:true,
    message:"check your email to see the otp , use to reset your password"
   })
        
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:error.message
        })
    }
}

exports.resetPassword= async(req,res)=>{
    const {email,otp,newPassword}= req.body;
    if(!email||!otp||!newPassword){
        return res.status(400).json({
            success:false,
            message:"email,otp and password required"
        })
    }
    try {
        const user = await Users.findOne({email})
        if(!user){
            return  res.status(400).json({
                success:false,
                message:"User does not exist"
            })
        }
        if(user.resetOTP===''||user.resetOTP!==otp){
           return  res.status(400).json({
                success:false,
                message:"invalid otp"
            })
        }
        if(user.resetOTPexpiresAt < Date.now()){
            return  res.status(400).json({
                success:false,
                message:"otp has expired"
            })
        }

        const hashedpassword = await bcrypt.hash(newPassword,10);

        user.password=hashedpassword;
        user.resetOTP=''
        user.resetOTPexpiresAt=0;

        await user.save()

        return res.status(200).json({
            success:true,
            message:'password reset successfully'
        })
        
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:error.message
        })
    }
}