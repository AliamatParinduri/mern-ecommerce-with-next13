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
import { UserState, userContextType } from '@/context/userContext'
import { CategorySchema } from '@/validations/categoryValidation'
import { CategoriesDTO, ucWords } from '@/validations/shared'

const AddCategory = () => {
  const [buttonClick, setButtonClick] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { user }: userContextType = UserState()
  const router = useRouter()

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

      await axios.post(`${BaseURLV1}/category`, payload, config)

      setIsLoading(false)
      alert('success add categories')
      router.push('/categories')
    } catch (e: any) {
      setIsLoading(false)
      alert(e.response.data.description)
      return false
    }
  }

  const initialValues: CategoriesDTO = {
    category: '',
    subCategory: [],
  }

  const formik = useFormik({
    initialValues,
    onSubmit: handleSubmit,
    validationSchema: CategorySchema,
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
              Create Category
            </span>
            <small className='text-xs'>Add a new category</small>
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
                  title='Add new Category'
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

export default AddCategory
