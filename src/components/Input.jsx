import { forwardRef, useId } from 'react'

const Input = forwardRef( function Input({
    label,
    type = "text",
    className = "",
    ...props
}, ref)

// HW: Study about forwardRef

{
    const id = useId()
    return (
        <div className='w-full'>
            {label && <label className='inline-block mb-1 pl-1 text-slate-800 dark:text-slate-200' htmlFor={id}>
                {label}
                </label>
                }
                <input type={type} className={`w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-black outline-none duration-200 placeholder:text-slate-400 focus:border-blue-400 focus:bg-gray-50 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-blue-500 dark:focus:bg-slate-800 dark:focus:ring-blue-500/20 ${className}`}
                ref={ref}
                {...props}
                id={id} />
        </div>
    )
})

export default Input
