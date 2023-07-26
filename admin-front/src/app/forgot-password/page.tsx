'use client'

/* eslint-disable react/no-unescaped-entities */
import { useState } from 'react'
import { Metadata } from 'next'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import { useFormik } from 'formik'

import InputType from '@/components/InputType'
import Button from '@/components/Button'
import AuthLayout from '@/components/AuthLayout'
import ErrorInputMessage from '@/components/ErrorInputMessage'
import { ForgotPasswordSchema } from '@/validations/userValidation'

export const metadata: Metadata = {
  title: 'Forgot Password Page',
}

export default function ForgotPassword() {
  const [buttonClick, setButtonClick] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const initialValues: { email: string } = {
    email: '',
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const {
        data: { message },
      } = await axios.post(`http://localhost:5000/api/v1/auth/forgotPassword`, {
        email: formik.values.email,
      })
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
    validationSchema: ForgotPasswordSchema,
  })

  return (
    <AuthLayout>
      <div className='flex flex-col w-3/4 justify-center text-center gap-3 align-middle'>
        <span className='flex font-semibold text-2xl justify-center '>
          Forgot password? No worries
        </span>
        <span className='text-gray-500 mb-5'>
          You'll get an email to reset your password
        </span>
        <form onSubmit={formik.handleSubmit} className='flex flex-col gap-5'>
          <InputType
            type='email'
            title='Email Address'
            placeholder='Enter your email address'
            formik={formik}
            name='email'
            buttonClick={buttonClick}
          />
          <ErrorInputMessage
            errorMessage={formik.errors.email}
            buttonClick={buttonClick}
          />
          <Button
            title='Send Recovery Email'
            isLoading={isLoading}
            setButtonClick={setButtonClick}
          />
          <Link href='/login' className='text-blue-500 font-semibold'>
            I think, I remember my password
          </Link>
        </form>
      </div>
    </AuthLayout>
  )
}
