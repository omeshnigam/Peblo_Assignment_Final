import {useSelector} from 'react-redux'
import { Navigate } from 'react-router-dom'

export default function Protected({children, authentication = true}) {
const authStatus = useSelector(state => state.auth.status)
const redirectPath = authentication ? '/login' : '/'

if (authStatus !== authentication) {
  return <Navigate to={redirectPath} replace />
}

  return <>{children}</>
}
