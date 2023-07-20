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
import { NewPasswordSchema } from '@/validations/userValidation'
import { useState } from 'react'
import Button from '@/components/Button'

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
      router.push('/')
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
    <main className='flex min-h-screen items-center justify-between overflow-hidden bg-white'>
      <div className='min-h-screen flex w-2/5 relative'>
        <Image src={bgLeft} alt='bg left' className='absolute top-24' />
      </div>
      <div className='min-h-screen flex items-center w-full justify-center my-8'>
        <div className='flex flex-col w-3/4 justify-center text-center gap-3 align-middle'>
          <span className='flex font-semibold text-2xl justify-center '>
            Create New Password
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
              title='Submit'
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
