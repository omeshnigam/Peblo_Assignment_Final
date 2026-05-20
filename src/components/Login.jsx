import {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {login as authLogin} from '../store/authSlice'
import {Button, Input, Logo} from "./index"
import {useDispatch} from 'react-redux'
import authService from '../appwrite/auth'
import {useForm} from 'react-hook-form'

function Login() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const {register, handleSubmit} = useForm()
    const [error, setError] = useState("")
    
    const login = async(data) => {
        setError("")
        try {
            const session = await authService.login(data)
            if (session) {
                const userData = await authService.getCurrentUser()
                if (userData) dispatch(authLogin({userData}));
                navigate("/")
            } 
        } catch (error) {
            setError(error.message)
        }
    }
  return (
    <div className={`animate-fade-up mx-auto w-full max-w-lg rounded-2xl border border-black/10 bg-white/85 p-10 text-slate-950 shadow-xl shadow-slate-200/70 backdrop-blur transition duration-300 dark:border-slate-800 dark:bg-slate-900/85 dark:text-slate-100 dark:shadow-slate-950/40`}>
        <div className='mb-6 flex justify-center'>
            <div className='p-2'>
                <Logo width='80%' />
                </div>
        </div>

        <h2 className='text-center text-3xl font-black leading-tight'> Sign in to your account</h2>

        <p className='mt-2 text-center text-base text-black/60 dark:text-slate-400'>
        Don&apos;t have any account?&nbsp;
        <Link to="/signup" className='font-medium text-blue-700 transition-all duration-200 hover:underline dark:text-blue-300'>Sign Up</Link>
        </p>

        <div>
            {error && ( <p className='text-red-500 text-center mt-4'> {error} </p> )}

            <form onSubmit={handleSubmit(login)} className='mt-8'>
                <div className='space-y-5'>
                    <Input label="Email: " placeholder="Enter your email" type="email" {...register("email", {
                        required: true,
                        validate: {
                            matchPattern: (value) =>  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                            "Email address must be a valid address",
                        }
                    })}/>
                     <Input
                label="Password: "
                type="password"
                placeholder="Enter your password"
                {...register("password", {
                    required: true,
                })}
                />
                <Button
                type="submit"
                className="w-full"
                >Sign in</Button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default Login
