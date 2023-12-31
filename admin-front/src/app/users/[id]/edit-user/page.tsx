/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { useFormik } from 'formik'
import { useRouter } from 'next/navigation'
import { FaArrowLeft } from 'react-icons/fa'

import Layout from '@/components/Layout'
import Loading from '@/components/Loading'
import InputType from '@/components/InputType'
import Button from '@/components/Button'
import ErrorInputMessage from '@/components/ErrorInputMessage'
import { BaseURLV1 } from '@/config/api'
import { UserState, userContextType } from '@/context/userContext'
import { RegisterUserByAdminSchema } from '@/validations/userValidation'
import { RegisterDTO, isUserLogin } from '@/validations/shared'
import { ToastError, ToastSuccess } from '@/components/Toast'

type Props = {
  params: { id: string }
}

const EditUser = ({ params: { id } }: Props) => {
  const [buttonClick, setButtonClick] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { setUser }: userContextType = UserState()
  let { user }: userContextType = UserState()

  const initialValues: RegisterDTO = {
    fullName: '',
    username: '',
    email: '',
    birthday: '',
    noHP: '',
    password: '',
    confirmPassword: '',
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user!.token}`,
        },
      }

      const payload = {
        fullName: formik.values.fullName,
        username: formik.values.username.toLowerCase(),
        email: formik.values.email.toLowerCase(),
        dateOfBirth: formik.values.birthday,
        noHP: formik.values.noHP,
      }

      await axios.put(`${BaseURLV1}/users/${id}`, payload, config)

      setIsLoading(false)
      ToastSuccess('success update user')
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

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: handleSubmit,
    validationSchema: RegisterUserByAdminSchema,
  })

  const handleData = async () => {
    setIsLoading(true)
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user!.token}`,
        },
      }

      const { data } = await axios.get(`${BaseURLV1}/users/${id}`, config)

      formik.setFieldValue('fullName', data.data.fullName)
      formik.setFieldValue('username', data.data.username)
      formik.setFieldValue('email', data.data.email)
      formik.setFieldValue(
        'birthday',
        `${new Date(data.data.dateOfBirth).getDay()}/${new Date(
          data.data.dateOfBirth
        ).getMonth()}/${new Date(data.data.dateOfBirth).getFullYear()}`
      )
      formik.setFieldValue('noHP', data.data.noHP)

      setIsLoading(false)
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

  useEffect(() => {
    isUserLogin(user) ? (user = isUserLogin(user)) : router.push('/login')

    handleData()
  }, [])

  return (
    <Layout>
      {isLoading && (
        <div className='flex items-center justify-center h-screen'>
          <Loading />
        </div>
      )}
      {!isLoading && (
        <div className='flex flex-col'>
          <div className='flex justify-start gap-3 items-center'>
            <div className='flex items-start mt-3 cursor-pointer h-full'>
              <FaArrowLeft size={18} onClick={() => router.back()} />
            </div>
            <div className='flex flex-col gap-1 '>
              <span className='text-2xl font-semibold tracking-wide'>
                Update User
              </span>
              <small className='text-xs'>update user</small>
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
                    readonly={true}
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
                    readonly={true}
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
      )}
    </Layout>
  )
}

export default EditUser
