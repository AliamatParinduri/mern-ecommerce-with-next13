import React from 'react'

type Props = {
  type: string
  title: string
  placeholder: string
  formik?: any
  setValue?: any
  value?: any
  error?: any
  name: string
  readonly?: boolean
  buttonClick?: boolean
}

const InputType = ({
  type,
  title,
  placeholder,
  formik,
  setValue,
  value,
  error,
  name,
  readonly = false,
  buttonClick,
}: Props) => {
  return (
    <div className='flex flex-col text-start justify-start gap-2'>
      <span className='font-semibold dark:text-white'>{title}</span>
      <input
        value={formik ? formik.values[name.toString()] : value}
        type={type}
        placeholder={placeholder}
        readOnly={readonly}
        onChange={(e) =>
          formik
            ? formik.setFieldValue(e.target.name, e.target.value)
            : setValue(e.target.value)
        }
        name={name}
        className={`ring ${
          formik
            ? formik.errors[name.toString()]
            : error && buttonClick
            ? 'ring-red-500 focus:outline-red-500'
            : 'ring-slate-300 hover:ring-gray-800 dark:hover:ring-slate-100'
        }  
        text-gray-900 border rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ring-1 py-2 px-4 `}
      />
    </div>
  )
}

export default InputType
