import { forwardRef, useId } from 'react'

function Select({ options = [], label, className = '', ...props }, ref) {
  const id = useId()

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="inline-block mb-1 pl-1 text-slate-800 dark:text-slate-200">
          {label}
        </label>
      )}

      <select
        id={id}
        ref={ref}
        {...props}
        className={`w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-black outline-none duration-200 focus:border-blue-400 focus:bg-gray-50 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:border-blue-500 dark:focus:bg-slate-800 dark:focus:ring-blue-500/20 ${className}`}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}

export default forwardRef(Select)
