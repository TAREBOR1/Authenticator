import React, { useState ,useRef} from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { appContext } from '../context/appContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const ResetPassword = () => {
  const {backendUrl}=useContext(appContext)


  const [formData,setFormData]=useState({
    email:"",
    newPassword:""
 }) 
    const handleChange =(e)=>{
          setFormData((prev)=>({
            ...prev,
            [e.target.name]:e.target.value
          }))
    }
  const navigate= useNavigate()

   const inputRefs= useRef([])
    const handleInput=(e,index)=>{
      if(e.target.value.length>0 && index <inputRefs.current.length-1){
        inputRefs.current[index+1].focus()
      }
    }
    const handleKeyDown=(e,index)=>{
      if(e.key==='Backspace' && e.target.value==='' && index>0){
        inputRefs.current[index-1].focus()
      }
    }
    const handlePaste=(e)=>{
      const paste = e.clipboardData.getData('text')
      const pasteArray= paste.split('')
   pasteArray.forEach((char,index)=>{
   inputRefs.current[index].value=char
   })
    }

    const [isEmailSent,setIsEmailSent]=useState(false)
    const [otp,setOtp]=useState(0)
    const [isOtpSubmited,setIsOtpSubmited]=useState(false)

    const onSubmitEmail=async(e)=>{
      e.preventDefault()
      try {
        const {email}=formData
        const response=  await axios.post(`${backendUrl}/api/auth/send-reset-password`,{
          email
        },{
          withCredentials:true
       })
       const Data= response.data;
       if(Data.success){
        toast.success(Data.message)
        setIsEmailSent(true)
       }else{
        toast.error(Data.message)
       }
      } catch (error) {
                   const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
                      toast.error(errorMessage);
      }
    }
    const onSubmitOtp=async(e)=>{
      e.preventDefault()
      const otpArray=inputRefs.current.map(e=>e.value)
    const otpValue=otpArray.join('')
      setOtp(otpValue)
      console.log("otpvalue"+otpValue)
      setIsOtpSubmited(true)
    }
const onSubmitNewPassword=async(e)=>{
  e.preventDefault()
  try {
    const {email,newPassword}=formData 
    const response=  await axios.post(`${backendUrl}/api/auth/reset-password`,{
      email,otp,newPassword
    },{
      withCredentials:true
   })
   const Data= response.data;
   if(Data.success){
    toast.success(Data.message)
    navigate('/login')
   }else{
    toast.error(Data.message)
   }

  } catch (error) {
        const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
                  toast.error(errorMessage);
  }
}
  return (
    <div className='flex items-center justify-center min-h-screen  bg-gradient-to-br from-blue-200 to-purple-400'>
      <img onClick={()=>{
              navigate('/')
            }} src={assets.logo} alt="" className='absolute left-4 top-5 w-28 sm:w-32 cursor-pointer sm:left-20 ' />

            {/* enter email address */}
            {!isEmailSent &&
            <form onSubmit={onSubmitEmail} className='bg-slate-500 p-8 rounded-lg shadow-lg w-96 text-sm'>
            <h1 className='text-2xl mb-4 text-white text-center font-semibold'> Reset Password</h1>
            <p  className='text-center mb-6 text-indigo-300 text-sm'>Enter your registered email address</p>
              <div className='flex items-center gap-3 mb-3 bg-[#333a5c] px-6 py-2.5 w-full rounded-full'>
                        <img src={assets.mail_icon} className='w-3 h-3'/>
                        <input type="email" name="email" onChange={handleChange}  value={formData.email}  placeholder='email address'   className='outline-none text-white bg-transparent'/>
                      </div>
                      <button className='w-full py-2.5 text-white mt-3 font-medium rounded-full bg-gradient-to-br from-indigo-500 to-indigo-900 '>Submit</button>
            </form>
}

            {/* enter password OTP */}
{!isOtpSubmited && isEmailSent && 
            <form onSubmit={onSubmitOtp} className='bg-slate-500 p-8 rounded-lg shadow-lg w-96 text-sm'>
              <h1 className='text-2xl mb-4 text-white text-center font-semibold'> Reset password OTP</h1>
              <p  className='text-center mb-6 text-indigo-300 text-sm'>Enter the 6-digit code sent to your email address</p>
              <div className='flex mb-8 justify-between' onPaste={handlePaste}>
                  {Array(6).fill(0).map((_,index)=>{
                    return  <input type='text' key={index} className='h-12 w-12 bg-[#333A5C] text-white text-center text-xl rounded-md' maxLength='1' required
                    ref={e=>inputRefs.current[index]=e}
                    onInput={(e)=>{
                      handleInput(e,index)
                    }}
                    onKeyDown={(e)=>{
                      handleKeyDown(e,index)
                    }}
           
                    />
                  })}
              </div>
              <button   className='w-full py-2.5 text-white font-medium rounded-full bg-gradient-to-br from-indigo-500 to-indigo-900 '>Submit</button>
            </form>
}
            {/* enter new password */}
 {isOtpSubmited && isEmailSent &&
            <form onSubmit={onSubmitNewPassword} className='bg-slate-500 p-8 rounded-lg shadow-lg w-96 text-sm'>
            <h1 className='text-2xl mb-4 text-white text-center font-semibold'> New Password</h1>
            <p  className='text-center mb-6 text-indigo-300 text-sm'>Enter the new password below</p>
              <div className='flex items-center gap-3 mb-3 bg-[#333a5c] px-6 py-2.5 w-full rounded-full'>
                        <img src={assets.lock_icon} className='w-3 h-3'/>
                        <input type="password" name="newPassword" onChange={handleChange}  value={formData.newPassword}  placeholder=' password'   className='outline-none text-white bg-transparent'/>
                      </div>
                      <button className='w-full py-2.5 text-white mt-3 font-medium rounded-full bg-gradient-to-br from-indigo-500 to-indigo-900 '>Submit</button>
            </form>

 }
    </div>
  )
}

export default ResetPassword
