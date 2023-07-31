import { FcGoogle } from 'react-icons/fc'

import React, { Fragment } from 'react'

const LoginWithSosmed = () => {
  // const colorSchema = window.matchMedia('(prefers-color-scheme: dark)').matches

  return (
    <Fragment>
      <button
        onClick={() => alert('Very soon.')}
        className='flex gap-2 justify-center items-center ring ring-slate-300 hover:ring-slate-400 ring-1 text-black py-3 rounded-lg px-2'
      >
        <FcGoogle fontSize='24px' />
        <span className='font-medium dark:text-white text-xs md:text-base'>
          Continue With Google
        </span>
      </button>
      <div className='flex '>
        <p className={`JSSUM`}>
          <span className='px-2 bg-white text-inherit dark:bg-dark-500 dark:text-white'>
            or sign in with email
          </span>
        </p>
      </div>
    </Fragment>
  )
}

export default LoginWithSosmed
