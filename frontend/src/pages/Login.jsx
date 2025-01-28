import React, { useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useContext } from 'react'
import { appContext } from '../context/appContext'
import axios from 'axios'
import {  toast } from 'react-toastify';

const Login = () => {
  const navigate= useNavigate()
  const [state,setState]=useState("sign up")
  const[show,setShow]=useState(true)
  const [formData,setFormData]=useState({
     username:'',
     email:"",
     password:""
  })

  const handleChange =(e)=>{
        setFormData((prev)=>({
          ...prev,
          [e.target.name]:e.target.value
        }))
  }
  const {backendUrl,setIsLoggedIn,getUserData}=useContext(appContext)

  const handleSubmit=async(e)=>{
    const {email,password}=formData
     try {
      e.preventDefault();
      axios.defaults.withCredentials=true;


  //  const url=`${backendUrl}/api/auth/${state==='sign up'?'signup':'login'}`
  //  const payload=state==='sign up'?formData:{email,password}

  //     const response = await axios.post(url,payload)
  //     const Data=response.data
  //     if(Data.success){
  //       setIsLoggedIn(true)
  //       navigate('/')
  //     }else{
  //      toast.error(Data.message)
  //     }




    
      if(state==='sign up'){
            const response = await axios.post(backendUrl+'/api/auth/signup',formData)
            const Data=response.data
            if(Data.success){
              setIsLoggedIn(true)
              getUserData()
              navigate('/')
            }else{
             toast.error(Data.message)
            }
      }else{
        const response = await axios.post(backendUrl+'/api/auth/login',{email,password})
        const Data=response.data
        if(Data.success){
          setIsLoggedIn(true)
          getUserData()
          navigate('/')
        }else{
         toast.error(Data.message)
        }
      }
     } catch (error) {
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
      toast.error(errorMessage);
    }

 
  }

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
      <img onClick={()=>{
        navigate('/')
      }} src={assets.logo} alt="" className='absolute left-4 top-5 w-28 sm:w-32 cursor-pointer sm:left-20 ' />
      <div className='p-10 bg-slate-900 text-indigo-300 rounded-lg shadow-lg w-full sm:w-96 text-sm'>
        <h2 className='text-3xl mb-6 text-white text-center font-semibold'>{state==="sign up"? "Create Account":"Login"}</h2>
        <p className='text-center mb-3 text-sm'>{state==="sign up"? "Create your account":"Login to your account"}</p>
        <form onSubmit={handleSubmit} >
          { state==="sign up" && <div className='flex items-center gap-3 mb-3 bg-[#333a5c] px-6 py-2.5 w-full rounded-full'>
            <img src={assets.person_icon}/>
            <input type="text" name="username" value={formData.username} placeholder='full name' onChange={handleChange} className='outline-none bg-transparent'/>
          </div>}
          <div className='flex items-center gap-3 mb-3 bg-[#333a5c] px-6 py-2.5 w-full rounded-full'>
            <img src={assets.mail_icon}/>
            <input type="text" name="email" value={formData.email} placeholder='email address' onChange={handleChange} className='outline-none bg-transparent'/>
          </div>
          <div className='flex items-center gap-3 mb-3 bg-[#333a5c] px-6 py-2.5 w-full rounded-full'>
            <img onClick={()=>{
              setShow((prev)=>!prev)
            }} 
            
            src={assets.lock_icon}/>
            <input type={show?"text":"password"} name="password" value={formData.password} placeholder='password' onChange={handleChange} className='outline-none bg-transparent'/>
          </div>
          <p onClick={()=>{
            navigate('/reset-password')
          }} className='mb-5 cursor-pointer text-indigo-300'>Forgot password?</p>
          <button className='w-full py-2.5 text-white font-medium rounded-full bg-gradient-to-br from-indigo-500 to-indigo-900 '>{state==='sign up'?'Sign up':'Login'}</button>
        </form>
        <p className='text-gray-400 text-center text-xs mt-4'>{state==="sign up"?"Already have an account?":"Don't have an account?"} {''}
          <span className='cursor-pointer text-blue-400 underline' onClick={()=>{
            setState((prev)=>(prev==="sign up"?"login":"sign up"))
          }}>{state==="sign up"?"Login here":"Sign up"}</span>
        </p>
        </div>
    </div>
  )
}

export default Login
