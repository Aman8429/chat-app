import React from 'react'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ProfilePage from './pages/ProfilePage'
import SettingsPage from './pages/SettingsPage'
import SignUpPage from './pages/SignUpPage'
import { useAuthStore } from './store/useAuthStore'
import { Routes,Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import { Loader } from 'lucide-react'
import { Toaster } from 'react-hot-toast'
import { useThemeStore } from './store/useThemeStore'
import Verify from './pages/Verify'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

const App = () => {
  const {authUser,checkAuth,isCheckingAuth,onlineUsers} = useAuthStore();
  const {theme}=useThemeStore()
  console.log(onlineUsers) 
  useEffect(()=>{
    checkAuth();

  },[checkAuth]);
  console.log({authUser})
  if(isCheckingAuth && !authUser) return (
   <div className='flex items-center justify-center h-screen'>
    <Loader className ="size-10 animate-spin"/>
   </div>
  )
  return (
    <div data-theme={theme}>
      <Navbar/>
      <Toaster/>
      <Routes>
        <Route path='/' element={authUser ? <HomePage/>:<Navigate to="/login"/>} />
        <Route path='/signup' element={!authUser ? <SignUpPage/>:<Navigate to="/"/>} />
        <Route path='/verify-email' element={<Verify/>} />
        <Route path='/forgot-password' element={<ForgotPassword/>} />
        <Route path='/reset-password/:token' element={<ResetPassword/>} />
        <Route path='/login' element={authUser ? <Navigate to="/" /> : <LoginPage />} />
        <Route path='/settings' element={<SettingsPage/>} />
        <Route path='/profile' element={authUser ? <ProfilePage/>:<Navigate to="/login"/>} />
      </Routes>
    </div>
  )
}

export default App
