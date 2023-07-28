'use client'

/* eslint-disable react/no-unescaped-entities */
import { Metadata } from 'next'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useFormik } from 'formik'

import InputType from '@/components/InputType'
import LoginWithSosmed from '@/components/LoginWithSosmed'
import Button from '@/components/Button'
import AuthLayout from '@/components/AuthLayout'
import ErrorInputMessage from '@/components/ErrorInputMessage'
import { RegisterDTO } from '@/validations/shared'
import { RegisterSchema } from '@/validations/userValidation'
import { BaseURLV1 } from '@/config/api'

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
      } = await axios.post(`${BaseURLV1}/auth/register`, payload)
      alert(message)
      setIsLoading(false)
      router.push('/login')
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
    <AuthLayout>
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
            buttonClick={buttonClick}
          />
          <ErrorInputMessage
            errorMessage={formik.errors.fullName}
            buttonClick={buttonClick}
          />
          <InputType
            type='text'
            title='Username'
            placeholder='Enter your username'
            formik={formik}
            name='username'
            buttonClick={buttonClick}
          />
          <ErrorInputMessage
            errorMessage={formik.errors.username}
            buttonClick={buttonClick}
          />
          <InputType
            type='email'
            title='Email'
            placeholder='Enter your email'
            formik={formik}
            name='email'
            buttonClick={buttonClick}
          />
          <ErrorInputMessage
            errorMessage={formik.errors.email}
            buttonClick={buttonClick}
          />
          <InputType
            type='text'
            title='No Handphone'
            placeholder='No Handphone'
            formik={formik}
            name='noHP'
            buttonClick={buttonClick}
          />
          <ErrorInputMessage
            errorMessage={formik.errors.noHP}
            buttonClick={buttonClick}
          />
          <InputType
            type='password'
            title='Password'
            placeholder='Enter your password'
            formik={formik}
            name='password'
            buttonClick={buttonClick}
          />
          <ErrorInputMessage
            errorMessage={formik.errors.password}
            buttonClick={buttonClick}
          />
          <InputType
            type='password'
            title='Confirm Password'
            placeholder='Enter your confirm password'
            formik={formik}
            name='confirmPassword'
            buttonClick={buttonClick}
          />
          <ErrorInputMessage
            errorMessage={formik.errors.confirmPassword}
            buttonClick={buttonClick}
          />
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
    </AuthLayout>
  )
}
