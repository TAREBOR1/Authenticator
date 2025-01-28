const express= require('express');
const Router= express.Router();
const authController= require('../controllers/auth')
const authMiddleware= require('../middleware/userAuth')

Router.post('/signup',authController.signup);
Router.post('/login',authController.login);
Router.post('/logout',authController.logout)
Router.post('/sendotp',authMiddleware.VerifyToken,authController.sendVerifyOtp)
Router.post('/verifyotp',authMiddleware.VerifyToken,authController.verifyOTP)
Router.get('/isAuth',authMiddleware.VerifyToken,authController.isAuthenticated)
Router.post('/send-reset-password',authController.resetPasswordOtp)
Router.post('/reset-password',authController.resetPassword)

module.exports=Router