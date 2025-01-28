const Users= require('../model/user');

exports.getUser=async(req,res)=>{
    const {userId}=req.body;
    try {
         const user=await Users.findById(userId)
         if(!user){
            return res.status(400).json({
                success:false,
                message:"user not found"
            })
         }
         return res.status(200).json({
            success:true,
            userData:{
                name:user.username,
                isAccountVerified:user.isAccountVerified
            }
         })
        
    } catch (error) {
        return res.status(400).json({
            success:false,
            message:error.message
        })
    }
}