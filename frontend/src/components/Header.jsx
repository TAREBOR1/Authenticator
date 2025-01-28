import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { appContext } from '../context/appContext'

const Header = () => {
    const {userData}=useContext(appContext)


  return (
    <div className='flex items-center px-4 mt-20 flex-col  text-center   text-gray-800 '>
      <img src={assets.header_img} className='w-36 h-36 rounded-full mb-1'/>
      <h1 className='text-xl sm:text-3xl py-2 px-4 flex items-center  '> hey {userData?userData.name:'developer'}  <img src={assets.hand_wave} className='w-8 aspect-square'/></h1>
      <h2 className=' text-3xl sm:text-5xl font-semibold mb-3'> welcome to our app</h2>
      <p className=' mb-3 max-w-md '>Lets start with a quick product tour and we will have you up and running in no time</p>
      <button className='px-8 py-2.5 bg-gray-200    border border-gray-500 hover:bg-gray-100  rounded-full transition-all '>Get started</button>
    </div>
  )
}

export default Header
