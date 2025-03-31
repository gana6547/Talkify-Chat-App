import { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'

import Setting from './pages/Setting'
import Profile from './pages/Profile'
import Navbar from './components/Navbar'
import Homepage from './pages/Homepage'
import Signup from './pages/Signup'
import Login from './pages/Login'
import { useAuthStore } from './store/useAuthStore'
import { Loader } from "lucide-react"
import { Toaster } from 'react-hot-toast'
import { useThemeStore } from './store/useThemestore'


const App = () => {
  const {authUser,checkAuth,isCheckingAuth,onlineUsers}=useAuthStore();///sate varibles;
  const {theme}=useThemeStore();

  console.log({onlineUsers});
  
  useEffect(()=>{
    checkAuth()
  },[checkAuth])

  console.log(authUser);
  
  if(isCheckingAuth && authUser){ ///for loader
    return<div className='flex justify-center items-center h-screen'>
      <Loader className='class-10 animate-spin'/>
    </div>
  }
  
  return<div data-theme={theme}>
      <Navbar/>
      
      <Routes>
        <Route path='/' element={authUser?<Homepage/>:<Navigate to="/login"/>}/>
        <Route path='/signup' element={!authUser ? <Signup/>:<Navigate to="/"/>}/>
        <Route path='/login' element={!authUser ? <Login/>:<Navigate to="/"/>}/>
        <Route path='/logout' element={!authUser ?<Login/> : <Navigate to="/login"/>}/>
        <Route path='/settings' element={<Setting/>}/>
        <Route path='/profile' element={authUser?<Profile/>:<Navigate to="/login"/>}/>
      </Routes>

      <Toaster/>
    </div>
};

export default App