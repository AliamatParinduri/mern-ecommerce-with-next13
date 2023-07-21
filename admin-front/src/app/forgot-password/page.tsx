'use client'

/* eslint-disable react/no-unescaped-entities */
import { Metadata } from 'next'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

import InputType from '@/components/InputType'
import bgLeft from 'public/image/auth-left-shape.png'
import bgRight from 'public/image/auth-right-shape.png'
import axios from 'axios'
import { useFormik } from 'formik'
import { ForgotPasswordSchema } from '@/validations/userValidation'
import { useState } from 'react'
import Button from '@/components/Button'

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
        data: { data, token, message },
      } = await axios.post(`http://localhost:5000/api/v1/auth/forgotPassword`, {
        email: formik.values.email,
      })
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
    validationSchema: ForgotPasswordSchema,
  })

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
          <form onSubmit={formik.handleSubmit} className='flex flex-col gap-5'>
            <InputType
              type='email'
              title='Email Address'
              placeholder='Enter your email address'
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
            <Button
              title='Send Recovery Email'
              isLoading={isLoading}
              setButtonClick={setButtonClick}
            />
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
