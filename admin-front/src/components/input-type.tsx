import React from 'react'

type Props = {
  type: string
  title: string
  placeholder: string
  setInputType: (val: string) => void
}

const InputType = ({ type, title, placeholder, setInputType }: Props) => {
  return (
    <div className='flex flex-col text-start justify-start gap-2'>
      <span className='font-semibold'>{title}</span>
      <input
        type={type}
        placeholder={placeholder}
        onChange={(e) => setInputType(e.target.value)}
        className='ring ring-slate-300 hover:ring-gray-800 active:ring-gray-800 active:shadow active:shadow-gray-500 ring-1 py-2 px-4 rounded-lg'
      />
    </div>
  )
}

export default InputType
