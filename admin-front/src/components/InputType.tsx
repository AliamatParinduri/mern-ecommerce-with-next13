import React from 'react'

type Props = {
  type: string
  title: string
  placeholder: string
  formik: any
  name: string
  error: any
  buttonClick: boolean
}

const InputType = ({
  type,
  title,
  placeholder,
  formik,
  name,
  error,
  buttonClick,
}: Props) => {
  return (
    <div className='flex flex-col text-start justify-start gap-2'>
      <span className='font-semibold'>{title}</span>
      <input
        type={type}
        placeholder={placeholder}
        onChange={(e) => formik.setFieldValue(e.target.name, e.target.value)}
        name={name}
        className={`ring ${
          error && buttonClick
            ? 'ring-red-500 focus:ring-red-500 focus:border-red-500'
            : 'ring-slate-300 hover:ring-gray-800'
        }  active:shadow active:shadow-gray-500 ring-1 py-2 px-4 rounded-lg`}
      />
    </div>
  )
}

export default InputType
