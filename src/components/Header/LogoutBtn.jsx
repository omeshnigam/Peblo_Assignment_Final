import {useDispatch} from 'react-redux'
import authService from '../../appwrite/auth'
import { logout } from '../../store/authSlice'

function LogoutBtn() {
    const dispatch = useDispatch()
    const logoutHandler = () => {
        authService.logout().then(() => {
            dispatch(logout())
        })
    }
  return (
    <button
    className='inline-block rounded-full px-5 py-2 text-sm font-medium duration-200 hover:-translate-y-0.5 hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 dark:hover:bg-red-950/40 dark:hover:text-red-300' onClick={logoutHandler}>Logout</button>
  )
}

export default LogoutBtn
