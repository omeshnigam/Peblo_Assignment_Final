import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import authService from './appwrite/auth'
import {login, logout} from "./store/authSlice" 
import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import {Outlet} from 'react-router-dom'

function App() {
 const [ loading, setLoading ] = useState(true)
 const dispatch = useDispatch()

 useEffect(() => {
const savedTheme = localStorage.getItem('theme')
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
  document.documentElement.classList.add('dark')
}
else {
  document.documentElement.classList.remove('dark')
}
 }, [])

 useEffect(() => {
authService.getCurrentUser()
.then((userData) => {
  if ( userData ) {
    dispatch(login({userData}))
  }
  else {
    dispatch(logout())
  }
})
.finally(() => setLoading(false))
 }, [dispatch])

  return !loading ? (
    <div className='relative min-h-screen overflow-hidden bg-slate-100 text-slate-950 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100'>
      <div className='soft-pulse pointer-events-none fixed -left-32 top-24 h-72 w-72 rounded-full bg-blue-300/30 blur-3xl dark:bg-blue-500/10' />
      <div className='soft-pulse pointer-events-none fixed -right-32 top-1/3 h-80 w-80 rounded-full bg-cyan-300/30 blur-3xl dark:bg-cyan-400/10' />
      <div className='relative z-10 flex min-h-screen w-full flex-col'>
        <Header />
        <main className='flex-1'>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  ) : null
}

export default App
