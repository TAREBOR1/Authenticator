const mongoose=require('mongoose');
const userSChema= new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    verifyOTP:{
        type:String,
        default:''
    },
    verifyOTPexpiresAt:{
        type:Number,
        default:0
    },
    isAccountVerified:{
        type:Boolean,
        default:false
    },
    resetOTP:{
        type:String,
        default:''
    },
    resetOTPexpiresAt:{
        type:Number,
        default:0
    }
})

module.exports= mongoose.model("User",userSChema);

