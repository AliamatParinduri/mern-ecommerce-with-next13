'use client'

/* eslint-disable react/no-unescaped-entities */
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from 'axios'

import bgLeft from 'public/image/auth-left-shape.png'
import bgRight from 'public/image/auth-right-shape.png'
import InputType from '@/components/input-type'
import LoginWithSosmed from '@/components/login-with-sosmed'

export default function Register() {
  const [fullName, setFullName] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [noHP, setNoHP] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      return alert('password not match')
    }

    const payload = {
      fullName,
      username,
      email,
      noHP,
      password,
    }
    try {
      const {
        data: { data, token, message },
      } = await axios.post(
        'http://localhost:5000/api/v1/auth/register',
        payload
      )
      router.push('/')
    } catch (e) {
      alert('gagal')
    }
  }

  return (
    <main className='flex min-h-screen items-center justify-between overflow-hidden bg-white'>
      <div className='min-h-screen flex w-2/5 relative'>
        <Image src={bgLeft} alt='bg left' className='absolute top-24' />
      </div>
      <div className='min-h-screen flex items-center w-full justify-center my-8'>
        <div className='flex flex-col w-3/4 justify-center text-center gap-3 align-middle'>
          <span className='flex font-semibold text-2xl justify-center '>
            Hi
            {/* <Image
              src='https://twemoji.maxcdn.com/v/13.1.0/72x72/1f44b.png'
              width={12}
              height={4}
              alt=''
              className='ml-2 mr-1'
            /> */}
            , let’s get familiar.
          </span>
          <span className='text-gray-500 mb-5'>
            Let's create forms and collect submissions
          </span>
          <LoginWithSosmed />
          <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
            <InputType
              type='text'
              title='Full Name'
              placeholder='Full Name'
              setInputType={setFullName}
            />
            <InputType
              type='text'
              title='Username'
              placeholder='Enter your username'
              setInputType={setUsername}
            />
            <InputType
              type='email'
              title='Email'
              placeholder='Enter your email'
              setInputType={setEmail}
            />
            <InputType
              type='text'
              title='No Handphone'
              placeholder='No Handphone'
              setInputType={setNoHP}
            />
            <InputType
              type='password'
              title='Password'
              placeholder='Enter your password'
              setInputType={setPassword}
            />
            <InputType
              type='password'
              title='Confirm Password'
              placeholder='Enter your confirm password'
              setInputType={setConfirmPassword}
            />
            <button className='flex gap-2 justify-center items-center bg-slate-900 py-3 rounded-lg text-white'>
              Register
            </button>
            <Link href='/' className='text-blue-500 font-semibold'>
              I have an account
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
