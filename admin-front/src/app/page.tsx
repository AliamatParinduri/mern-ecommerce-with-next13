'use client'

/* eslint-disable react/no-unescaped-entities */
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from 'axios'

import InputType from '@/components/input-type'
import LoginWithSosmed from '@/components/login-with-sosmed'
import bgLeft from 'public/image/auth-left-shape.png'
import bgRight from 'public/image/auth-right-shape.png'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    try {
      const {
        data: { data, token, message },
      } = await axios.post('http://localhost:5000/api/v1/auth/login', {
        username,
        password,
      })

      router.push('/dashboard')
    } catch (e) {
      alert('gagal')
    }
  }

  return (
    <main className='flex min-h-screen items-center justify-between overflow-hidden bg-white'>
      <div className='min-h-screen flex w-2/5 relative'>
        <Image src={bgLeft} alt='bg left' className='absolute top-20' />
      </div>
      <div className='min-h-screen flex items-center w-full justify-center my-8 '>
        <div className='flex flex-col w-3/4 justify-center text-center gap-3 align-middle'>
          <span className='flex font-semibold text-2xl justify-center '>
            Welcome back
          </span>
          <span className='text-gray-500 mb-5'>It's time to catch-up</span>
          <LoginWithSosmed />
          <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
            <InputType
              type='text'
              title='Username'
              placeholder='Enter your username'
              setInputType={setUsername}
            />
            <InputType
              type='password'
              title='Password'
              placeholder='Enter your Password'
              setInputType={setPassword}
            />

            <Link
              href='/forgot-password'
              className='flex justify-end text-blue-500 font-semibold'
            >
              Forgot your password?
            </Link>
            <button className='flex gap-2 justify-center items-center bg-slate-900 py-3 rounded-lg text-white'>
              Login
            </button>
            <Link href='/register' className='text-blue-500 font-semibold'>
              I don't have an account
            </Link>
          </form>
        </div>
      </div>

      <div className='min-h-screen flex w-2/5 relative'>
        <Image src={bgRight} alt='bg Right' className='absolute top-20' />
      </div>
    </main>
  )
}
