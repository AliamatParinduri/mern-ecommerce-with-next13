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
import { NewPasswordSchema } from '@/validations/userValidation'

export const metadata: Metadata = {
  title: 'Create New Password',
}

type Props = {
  params: {
    id: string
  }
}

export default function ForgotPassword({ params: { id } }: Props) {
  const [buttonClick, setButtonClick] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const initialValues: { password: string; confirmPassword: string } = {
    password: '',
    confirmPassword: '',
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const {
        data: { data, token, message },
      } = await axios.put(
        `http://localhost:5000/api/v1/auth/${id}/createNewPassword`,
        {
          password: formik.values.password,
        }
      )
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
    validationSchema: NewPasswordSchema,
  })

  return (
    <AuthLayout>
      <div className='flex flex-col w-3/4 justify-center text-center gap-3 align-middle'>
        <span className='flex font-semibold text-2xl justify-center '>
          Reset Password
        </span>
        <span className='text-gray-500 mb-5'>
          Please enter a new password, so you can log in again
        </span>
        <form onSubmit={formik.handleSubmit} className='flex flex-col gap-5'>
          <InputType
            type='password'
            title='Password'
            placeholder='Enter your password'
            formik={formik}
            name='password'
            error={formik.errors.password}
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
            error={formik.errors.confirmPassword}
            buttonClick={buttonClick}
          />
          <ErrorInputMessage
            errorMessage={formik.errors.confirmPassword}
            buttonClick={buttonClick}
          />
          <Button
            title='Reset Password'
            isLoading={isLoading}
            setButtonClick={setButtonClick}
          />
          <Link href='/' className='text-blue-500 font-semibold'>
            I think, I remember my password
          </Link>
        </form>
      </div>
    </AuthLayout>
  )
}
