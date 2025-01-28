import React from 'react'
import NavBar from '../components/NavBar'
import Header from '../components/Header'

const Home = () => {
  return (
    <div className='flex justify-center flex-col min-h-screen bg-[url("/bg_img.png")] bg-cover bg-center'>
      <NavBar/>
      <Header/>
    </div>
  )
}

export default Home
