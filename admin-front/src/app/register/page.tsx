'use client'

/* eslint-disable react/no-unescaped-entities */
import { Metadata } from 'next'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useFormik } from 'formik'

import bgLeft from 'public/image/auth-left-shape.png'
import bgRight from 'public/image/auth-right-shape.png'
import InputType from '@/components/InputType'
import LoginWithSosmed from '@/components/LoginWithSosmed'
import { RegisterDTO } from '@/validations/shared'
import { RegisterSchema } from '@/validations/userValidation'
import Button from '@/components/Button'

export const metadata: Metadata = {
  title: 'Register Page',
}

export default function Register() {
  const [buttonClick, setButtonClick] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const initialValues: RegisterDTO = {
    fullName: '',
    username: '',
    email: '',
    noHP: '',
    password: '',
    confirmPassword: '',
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    const payload = {
      fullName: formik.values.fullName,
      username: formik.values.username,
      email: formik.values.email,
      noHP: formik.values.noHP,
      password: formik.values.password,
    }
    try {
      const {
        data: { data, token, message },
      } = await axios.post(
        'http://localhost:5000/api/v1/auth/register',
        payload
      )
      alert(message)
      setIsLoading(false)
      router.push('/')
    } catch (e: any) {
      setIsLoading(false)
      alert(e.response.data.description)
    }
  }

  const formik = useFormik({
    initialValues,
    onSubmit: handleSubmit,
    validationSchema: RegisterSchema,
  })

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
          <form onSubmit={formik.handleSubmit} className='flex flex-col gap-5'>
            <InputType
              type='text'
              title='Full Name'
              placeholder='Full Name'
              formik={formik}
              name='fullName'
              error={formik.errors.fullName}
              buttonClick={buttonClick}
            />
            {formik.errors.fullName && buttonClick && (
              <span className='text-sm text-red-500 -mt-3 text-start'>
                {formik.errors.fullName}
              </span>
            )}
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
              type='email'
              title='Email'
              placeholder='Enter your email'
              formik={formik}
              name='email'
              error={formik.errors.email}
              buttonClick={buttonClick}
            />
            {formik.errors.email && buttonClick && (
              <span className='text-sm text-red-500 -mt-3 text-start'>
                {formik.errors.email}
              </span>
            )}
            <InputType
              type='text'
              title='No Handphone'
              placeholder='No Handphone'
              formik={formik}
              name='noHP'
              error={formik.errors.noHP}
              buttonClick={buttonClick}
            />
            {formik.errors.noHP && buttonClick && (
              <span className='text-sm text-red-500 -mt-3 text-start'>
                {formik.errors.noHP}
              </span>
            )}
            <InputType
              type='password'
              title='Password'
              placeholder='Enter your password'
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
            <InputType
              type='password'
              title='Confirm Password'
              placeholder='Enter your confirm password'
              formik={formik}
              name='confirmPassword'
              error={formik.errors.confirmPassword}
              buttonClick={buttonClick}
            />
            {formik.errors.confirmPassword && buttonClick && (
              <span className='text-sm text-red-500 -mt-3 text-start'>
                {formik.errors.confirmPassword}
              </span>
            )}
            <Button
              title='Register'
              isLoading={isLoading}
              setButtonClick={setButtonClick}
            />
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
