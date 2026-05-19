import React, {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function Protected({children, authentication = true}) {
const navigate = useNavigate()
const [loader, setLoader] = useState(true)
const authStatus = useSelector(state => state.auth.status)

useEffect(() => {
    // if (authStatus === true) {
    // navigate("/")}
    // else if (authStatus === false) {
    //     navigate("/login")
    // }

    // HW: Try to explain or learn about this code by taking true/false values
if(authentication && authStatus !== authentication) {
navigate("/login")
} else if(!authentication && authStatus !== authentication) {
navigate("/")
}
setLoader(false)
}, [authStatus, navigate, authentication])

  return loader ? (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600 dark:border-slate-800 dark:border-t-blue-400" />
    </div>
  ) : <>{children}</>
}
