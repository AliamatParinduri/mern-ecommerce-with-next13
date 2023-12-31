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
import { CategorySchema } from '@/validations/categoryValidation'
import { CategoriesDTO, isUserLogin, ucWords } from '@/validations/shared'
import { ToastError, ToastSuccess } from '@/components/Toast'

type Props = {
  params: { id: string }
}

const EditCategory = ({ params: { id } }: Props) => {
  const [buttonClick, setButtonClick] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { setUser }: userContextType = UserState()
  const router = useRouter()
  let { user }: userContextType = UserState()

  const initialValues: CategoriesDTO = {
    category: '',
    subCategory: [],
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const category = ucWords(formik.values.category)
      const subCategory = formik.values.subCategory.toString().split(',')

      const config = {
        headers: {
          Authorization: `Bearer ${user!.token}`,
        },
      }

      const payload = {
        category,
        subCategory,
      }

      await axios.put(`${BaseURLV1}/category/${id}`, payload, config)

      setIsLoading(false)
      ToastSuccess('success update categories')
      router.push('/categories')
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
    validationSchema: CategorySchema,
  })

  const getCategoryById = async () => {
    setIsLoading(true)
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user!.token}`,
        },
      }

      const { data } = await axios.get(`${BaseURLV1}/category/${id}`, config)

      formik.setFieldValue('category', data.data.category)
      formik.setFieldValue('subCategory', [data.data.subCategory.toString()])

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

    getCategoryById()
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
                Update Category
              </span>
              <small className='text-xs'>update category</small>
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
                    title='Category'
                    placeholder='Ex: Handphone'
                    formik={formik}
                    name='category'
                    buttonClick={buttonClick}
                  />
                  <ErrorInputMessage
                    errorMessage={formik.errors.category}
                    buttonClick={buttonClick}
                  />
                  <InputType
                    type='text'
                    title='Sub Category'
                    placeholder='Ex: Samsung,Iphone,Vivo'
                    formik={formik}
                    name='subCategory'
                    buttonClick={buttonClick}
                  />
                  <ErrorInputMessage
                    errorMessage={formik.errors.subCategory}
                    buttonClick={buttonClick}
                  />
                  <Button
                    title='Update Category'
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

export default EditCategory
