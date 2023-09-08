'use client'

import { useState } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa'

type Props = {
  type: string
  title: string
  placeholder: string
  passwordIcon?: boolean
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
  passwordIcon = false,
  formik,
  setValue,
  value,
  error,
  name,
  readonly = false,
  buttonClick,
}: Props) => {
  const [show, setShow] = useState(false)

  return (
    <div className='flex flex-col relative text-start justify-start gap-2'>
      <span className='font-semibold dark:text-white'>{title}</span>
      <input
        value={formik ? formik.values[name.toString()] : value}
        type={show ? 'text' : type}
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
      {passwordIcon && (
        <div className='absolute bottom-3 right-0 pr-3 flex items-center text-sm leading-5'>
          {!show && (
            <FaRegEye
              className='w-5 h-5 cursor-pointer'
              onClick={() => setShow(true)}
            />
          )}
          {show && (
            <FaRegEyeSlash
              className='w-5 h-5 cursor-pointer'
              onClick={() => setShow(false)}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default InputType
