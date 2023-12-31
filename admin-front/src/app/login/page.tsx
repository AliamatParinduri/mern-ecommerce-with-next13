'use client'

/* eslint-disable react/no-unescaped-entities */
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useFormik } from 'formik'

import InputType from '@/components/InputType'
import LoginWithSosmed from '@/components/LoginWithSosmed'

import { LoginDTO } from '@/validations/shared'
import Button from '@/components/Button'
import { LoginSchema } from '@/validations/userValidation'
import AuthLayout from '@/components/AuthLayout'
import ErrorInputMessage from '@/components/ErrorInputMessage'
import { UserState, userContextType } from '@/context/userContext'
import { BaseURLV1 } from '@/config/api'
import { ToastError, ToastSuccess } from '@/components/Toast'

export default function Login() {
  const [buttonClick, setButtonClick] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { setUser }: userContextType = UserState()

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const payload = {
        username: formik.values.username,
        password: formik.values.password,
      }

      const {
        data: { data, token, message },
      } = await axios.post(`${BaseURLV1}/auth/login`, payload)

      ToastSuccess(message)
      setIsLoading(false)
      localStorage.setItem('userInfo', JSON.stringify({ ...data, token }))
      setUser({ ...data, token })
      router.push('/')
    } catch (e: any) {
      setIsLoading(false)
      ToastError(e.response.data.description)
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
    <AuthLayout>
      <div className='flex flex-col w-3/4 justify-center text-center gap-3 align-middle'>
        <span className='flex font-semibold text-2xl justify-center dark:text-white'>
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
            buttonClick={buttonClick}
          />
          <ErrorInputMessage
            errorMessage={formik.errors.username}
            buttonClick={buttonClick}
          />
          <InputType
            type='password'
            title='Password'
            passwordIcon={true}
            placeholder='Enter your Password'
            formik={formik}
            name='password'
            buttonClick={buttonClick}
          />
          <ErrorInputMessage
            errorMessage={formik.errors.password}
            buttonClick={buttonClick}
          />
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
    </AuthLayout>
  )
}
