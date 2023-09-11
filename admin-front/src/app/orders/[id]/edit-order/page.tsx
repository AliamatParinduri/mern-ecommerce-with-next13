/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import { useFormik } from 'formik'
import { useRouter } from 'next/navigation'
import { FaArrowLeft } from 'react-icons/fa'

import Layout from '@/components/Layout'
import Loading from '@/components/Loading'
import Button from '@/components/Button'
import ErrorInputMessage from '@/components/ErrorInputMessage'
import { BaseURLV1 } from '@/config/api'
import { UserState, userContextType } from '@/context/userContext'
import { OrderSchema } from '@/validations/orderValidation'
import { isUserLogin } from '@/validations/shared'
import { ToastError, ToastSuccess } from '@/components/Toast'

type Props = {
  params: { id: string }
}

const EditOrder = ({ params: { id } }: Props) => {
  const { setUser }: userContextType = UserState()
  const [buttonClick, setButtonClick] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  let { user }: userContextType = UserState()

  const initialValues: any = {
    order: {},
    paymentOrder: '',
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const order = formik.values.order
      const paymentOrder = formik.values.paymentOrder

      const config = {
        headers: {
          Authorization: `Bearer ${user!.token}`,
        },
      }

      const payload = {
        ...order,
        paymentOrder,
      }

      await axios.put(`${BaseURLV1}/order/${id}`, payload, config)

      setIsLoading(false)
      ToastSuccess('success update orders')
      router.push('/orders')
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
        ToastError(e.response?.data?.message)
      }
    }
  }

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    onSubmit: handleSubmit,
    validationSchema: OrderSchema,
  })

  const getOrderById = async () => {
    setIsLoading(true)
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user!.token}`,
        },
      }

      const { data } = await axios.get(`${BaseURLV1}/order/${id}`, config)

      delete data.data._id
      delete data.data.createdAt
      delete data.data.updatedAt
      delete data.data.__v

      formik.setFieldValue('order', data.data)
      formik.setFieldValue('paymentOrder', data.data.paymentOrder)

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
        ToastError(e.response?.data?.message)
      }
    }
  }

  useEffect(() => {
    isUserLogin(user) ? (user = isUserLogin(user)) : router.push('/login')

    getOrderById()
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
                Update Order
              </span>
              <small className='text-xs'>update order</small>
            </div>
          </div>
          <div className='mt-8'>
            <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
              <div className='flex flex-col p-4 bg-white dark:bg-boxDark-500'>
                <form
                  onSubmit={formik.handleSubmit}
                  className='flex flex-col gap-5'
                >
                  <label>Payment Order</label>
                  <select
                    value={formik.values['paymentOrder']}
                    name='paymentOrder'
                    onChange={(e) => {
                      formik.setFieldValue(e.target.name, e.target.value)
                    }}
                    className='inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-4 dark:bg-boxDark-500 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 cursor-pointer'
                  >
                    {['Process', 'Delivery', 'Done'].map((pageSize) => (
                      <option key={pageSize} value={pageSize}>
                        {pageSize}
                      </option>
                    ))}
                  </select>
                  <ErrorInputMessage
                    errorMessage={formik.errors.paymentOrder}
                    buttonClick={buttonClick}
                  />
                  <Button
                    title='Update Order'
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

export default EditOrder
