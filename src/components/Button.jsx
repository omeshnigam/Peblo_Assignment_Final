import React from 'react'

function Button({
    children,
    type = 'button',
    bgColor = 'bg-blue-600',
    textColor = 'text-white',
    className = '',
    ...props
}) {
  return (
    <button className={`rounded-lg px-4 py-2 font-medium shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-white active:translate-y-0 dark:focus:ring-offset-slate-950 ${bgColor} ${textColor} ${className}`} {...props}>{children}</button>
  )
}

export default Button
