import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { appContext } from '../context/appContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const NavBar = () => {

    const navigate= useNavigate()
    const {userData,backendUrl,setIsLoggedIn,setUserData}=useContext(appContext)

    const sendVerificationOtp=async()=>{
      try {
        const response=  await axios.post(`${backendUrl}/api/auth/sendotp`,{
          withCredentials:true
       })
       const Data= response.data;
      if(Data.success){
        navigate('/email-verify')
        toast.success(Data.message)
      }
       toast.error(Data.message)
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
        toast.error(errorMessage);
      }
    }
    
    const Logout=async()=>{
      try {
          const response= await axios.post(`${backendUrl}/api/auth/logout`,{
              withCredentials:true
           })
           const Data=response.data
           Data.success && setIsLoggedIn(false)
           Data.success && setUserData(false)
           navigate('/')
      } catch (error) {
          const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
          toast.error(errorMessage);
      }
   }
  return (

    <div className='w-full flex items-center justify-between absolute top-0 p-4 sm:p-6 '>
         <img src={assets.logo} className='w-28 sm:w-32'/>
         {userData?<div className='w-8 h-8 flex justify-center rounded-full bg-black text-white items-center relative group'>
            {userData.name.charAt(0).toUpperCase()}
            <div className='absolute hidden group-hover:block top-0 right-0 text-black rounded pt-10'>
               <ul className='list-none m-0 p-2 bg-gray-100 text-sm'>
                {!userData.isAccountVerified && <li onClick={sendVerificationOtp} className='py-1 px-2 hover:bg-gray-200 cursor-pointer'>Verify email</li>
                }
                 <li onClick={Logout} className='py-1 px-2 pr-10 hover:bg-gray-200 cursor-pointer'>Logout</li>
               </ul>
            </div>
         </div>: <button onClick={()=>{
         navigate("/login")
         }} className=' rounded-full px-6 py-2 gap-2 text-gray-800 border flex items-center  border-gray-400 bg-gray-200 hover:bg-gray-100 transition-all'>Login <img src={assets.arrow_icon} /></button>}
        
    </div>
  )
}

export default NavBar
