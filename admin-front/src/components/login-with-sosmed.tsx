import { FcGoogle } from 'react-icons/fc'

import React, { Fragment } from 'react'

const LoginWithSosmed = () => {
  return (
    <Fragment>
      <button className='flex gap-2 justify-center items-center ring ring-slate-300 hover:ring-slate-400 ring-1 text-black py-3 rounded-lg'>
        <FcGoogle fontSize='24px' />
        <span className='font-medium'>Continue With Google</span>
      </button>
      <div className='flex'>
        <p className='JSSUM'>
          <span>or sign in with email</span>
        </p>
      </div>
    </Fragment>
  )
}

export default LoginWithSosmed
