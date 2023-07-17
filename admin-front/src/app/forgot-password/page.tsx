'use client'

/* eslint-disable react/no-unescaped-entities */
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import InputType from '@/components/input-type'
import bgLeft from 'public/image/auth-left-shape.png'
import bgRight from 'public/image/auth-right-shape.png'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')

  const handleSubmit = async (e: any) => {
    e.preventDefault()
  }

  return (
    <main className='flex min-h-screen items-center justify-between overflow-hidden bg-white'>
      <div className='min-h-screen flex w-2/5 relative'>
        <Image src={bgLeft} alt='bg left' className='absolute top-24' />
      </div>
      <div className='min-h-screen flex items-center w-full justify-center my-8'>
        <div className='flex flex-col w-3/4 justify-center text-center gap-3 align-middle'>
          <span className='flex font-semibold text-2xl justify-center '>
            Forgot password? No worries
          </span>
          <span className='text-gray-500 mb-5'>
            You'll get an email to reset your password
          </span>
          <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
            <InputType
              type='text'
              title='Email Address'
              placeholder='Enter your email address'
              setInputType={setEmail}
            />
            <button className='flex gap-2 justify-center items-center bg-slate-900 py-3 rounded-lg text-white'>
              Send Recovery Email
            </button>
            <Link href='/' className='text-blue-500 font-semibold'>
              I think, I remember my password
            </Link>
          </form>
        </div>
      </div>

      <div className='min-h-screen flex w-2/5 relative'>
        <Image src={bgRight} alt='bg Right' className='absolute top-24' />
      </div>
    </main>
  )
}
