'use client'

import { useState } from 'react'
import axios from 'axios'
import Layout from '@/components/Layout'
import { useRouter } from 'next/navigation'
import { useFormik } from 'formik'
import { FaArrowLeft } from 'react-icons/fa'

import InputType from '@/components/InputType'
import ErrorInputMessage from '@/components/ErrorInputMessage'
import Button from '@/components/Button'
import { BaseURLV1 } from '@/config/api'
import { RegisterUserByAdminSchema } from '@/validations/userValidation'
import { RegisterDTO } from '@/validations/shared'
import { ToastError, ToastSuccess } from '@/components/Toast'
import { UserState, userContextType } from '@/context/userContext'

const AddUser = () => {
  const [buttonClick, setButtonClick] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { setUser }: userContextType = UserState()

  const handleSubmit = async () => {
    setIsLoading(true)
    const payload = {
      fullName: formik.values.fullName,
      username: formik.values.username.toLowerCase(),
      email: formik.values.email.toLowerCase(),
      dateOfBirth: formik.values.birthday,
      noHP: formik.values.noHP,
      password: 'Password123.',
      isActive: true,
    }
    try {
      const {
        data: { message },
      } = await axios.post(`${BaseURLV1}/auth/register`, payload)
      ToastSuccess(message)
      setIsLoading(false)
      router.push('/users')
    } catch (e: any) {
      setIsLoading(false)
      if (
        e.message === `Cannot read properties of undefined (reading 'token')` ||
        e.response?.data?.message === 'jwt expired' ||
        e.response?.data?.message === 'invalid signature'
      ) {
        localStorage.removeItem('userInfo')
        setUser(null)
        ToastError('Your session has ended, Please login again')
        router.push('/login')
      } else {
        ToastError(e.response?.data?.description)
      }
    }
  }

  const initialValues: RegisterDTO = {
    fullName: '',
    username: '',
    birthday: '',
    email: '',
    noHP: '',
  }

  const formik = useFormik({
    initialValues,
    onSubmit: handleSubmit,
    validationSchema: RegisterUserByAdminSchema,
  })

  return (
    <Layout>
      <div className='flex flex-col'>
        <div className='flex justify-start gap-3 items-center'>
          <div className='flex items-start mt-3 cursor-pointer h-full'>
            <FaArrowLeft size={18} onClick={() => router.back()} />
          </div>
          <div className='flex flex-col gap-1 '>
            <span className='text-2xl font-semibold tracking-wide'>
              Create User
            </span>
            <small className='text-xs'>Add a new user</small>
          </div>
        </div>
        <div className='mt-8'>
          <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
            <div className='flex flex-col p-4 bg-white dark:bg-boxDark-500'>
              <form
                onSubmit={formik.handleSubmit}
                className='flex flex-col gap-5'
              >
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
                  type='date'
                  title='Birthday'
                  placeholder='Birthday'
                  formik={formik}
                  name='birthday'
                  buttonClick={buttonClick}
                />
                <ErrorInputMessage
                  errorMessage={formik.errors.birthday}
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
                <Button
                  title='Register'
                  isLoading={isLoading}
                  setButtonClick={setButtonClick}
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AddUser
