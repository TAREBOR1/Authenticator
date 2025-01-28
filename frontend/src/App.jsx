import React from 'react'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Login from './pages/Login'
import Home from './pages/Home'
import EmailVerify from './pages/EmailVerify'
import ResetPassword from './pages/ResetPassword'
import { ToastContainer } from 'react-toastify';

const App = () => {
  return (
    <BrowserRouter>
    <ToastContainer/>
    <Routes>
      <Route path='/'  element={<Home/>} />
      <Route path='/login'  element={<Login/>} />
      <Route path='/email-verify'  element={<EmailVerify/>} />
      <Route path='/reset-password'  element={<ResetPassword/>} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
