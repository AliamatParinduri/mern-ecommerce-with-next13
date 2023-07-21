'use client'

/* eslint-disable react/no-unescaped-entities */
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useFormik } from 'formik'

import InputType from '@/components/InputType'
import LoginWithSosmed from '@/components/LoginWithSosmed'
import bgLeft from 'public/image/auth-left-shape.png'
import bgRight from 'public/image/auth-right-shape.png'
import { LoginDTO } from '@/validations/shared'
import Button from '@/components/Button'
import { LoginSchema } from '@/validations/userValidation'

export default function Login() {
  const [buttonClick, setButtonClick] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const payload = {
        username: formik.values.username,
        password: formik.values.password,
      }

      const {
        data: { data, token, message },
      } = await axios.post('http://localhost:5000/api/v1/auth/login', payload)

      alert(message)
      setIsLoading(false)
      localStorage.setItem('userInfo', JSON.stringify(data))
      router.push('/dashboard')
    } catch (e: any) {
      setIsLoading(false)
      alert(e.response.data.description)
    }
  }

  const initialValues: LoginDTO = {
    username: '',
    password: '',
  }

  const formik = useFormik({
    initialValues,
    onSubmit: handleSubmit,
    validationSchema: LoginSchema,
  })

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
          <form onSubmit={formik.handleSubmit} className='flex flex-col gap-5'>
            <InputType
              type='text'
              title='Username'
              placeholder='Enter your username'
              formik={formik}
              name='username'
              error={formik.errors.username}
              buttonClick={buttonClick}
            />
            {formik.errors.username && buttonClick && (
              <span className='text-sm text-red-500 -mt-3 text-start'>
                {formik.errors.username}
              </span>
            )}
            <InputType
              type='password'
              title='Password'
              placeholder='Enter your Password'
              formik={formik}
              name='password'
              error={formik.errors.password}
              buttonClick={buttonClick}
            />
            {formik.errors.password && buttonClick && (
              <span className='text-sm text-red-500 -mt-3 text-start'>
                {formik.errors.password}
              </span>
            )}

            <Link
              href='/forgot-password'
              className='flex justify-end text-blue-500 font-semibold'
            >
              Forgot your password?
            </Link>
            <Button
              title='Login'
              isLoading={isLoading}
              setButtonClick={setButtonClick}
            />
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
