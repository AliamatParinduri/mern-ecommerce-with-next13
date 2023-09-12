/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useEffect, useState } from 'react'

import Layout from '@/components/Layout'
import { isUserLogin } from '@/validations/shared'
import { useRouter } from 'next/navigation'
import { UserState, userContextType } from '@/context/userContext'
import Chart from '@/components/Chart'

import axios from 'axios'
import { BaseURLV1 } from '@/config/api'
import { ToastError } from '@/components/Toast'
import Loading from '@/components/Loading'

const ReportUsers = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [selectTypePurchases, setSelectTypePurchases] =
    useState<string>('daily')
  const [selectTypeDescription, setSelectTypeDescription] =
    useState<string>('daily')
  const [purchases, setPurchases] = useState<any>()
  const [description, setDescription] = useState<any>()
  const { setUser }: userContextType = UserState()
  const router = useRouter()
  let { user }: userContextType = UserState()

  const getReportUsers = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user!.token}`,
        },
      }

      const { data } = await axios.get(`${BaseURLV1}/users/reportUsers`, config)

      setIsLoading(false)
      setDescription(data.data.topDescriptionUsers)
      setPurchases(data.data.topUserPurchases)
    } catch (e: any) {
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

    getReportUsers()
  }, [user])

  return (
    <Layout>
      {isLoading && (
        <div className='flex items-center justify-center h-screen'>
          <Loading />
        </div>
      )}
      {!isLoading && (
        <div className='flex flex-row gap-3'>
          <div className='flex-shrink max-w-full w-full lg:w-1/2 mb-6'>
            <div className='p-6 bg-white dark:bg-boxDark-500 rounded-lg shadow-lg h-full'>
              <div className='flex flex-row justify-between pb-6'>
                <h3 className='text-base font-bold'>
                  Weekly Purchases Overview
                </h3>
                <div className='flex flex-col'>
                  <select
                    value={selectTypePurchases}
                    onChange={(e) => {
                      setSelectTypePurchases(e.target.value)
                    }}
                    className='inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-2 dark:bg-boxDark-500 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 cursor-pointer'
                  >
                    {['daily', 'weekly', 'monthly', 'yearly'].map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {purchases && (
                <div className='relative'>
                  <Chart
                    type='pie'
                    value={purchases[selectTypePurchases].data}
                    labels={purchases[selectTypePurchases].labels}
                    elId='weekly top users'
                  />
                </div>
              )}
            </div>
          </div>

          <div className='flex-shrink max-w-full w-full lg:w-1/2  mb-6'>
            <div className='p-6 bg-white dark:bg-boxDark-500 rounded-lg shadow-lg h-full'>
              <div className='flex flex-row justify-between pb-6'>
                <h3 className='text-base font-bold'>
                  Weekly Description Users
                </h3>
                <div className='flex flex-col'>
                  <select
                    value={selectTypeDescription}
                    onChange={(e) => {
                      setSelectTypeDescription(e.target.value)
                    }}
                    className='inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-2 dark:bg-boxDark-500 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 cursor-pointer'
                  >
                    {['daily', 'weekly', 'monthly', 'yearly'].map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {description && (
                <div className='relative'>
                  <Chart
                    type='pie'
                    value={description[selectTypeDescription].data}
                    labels={description[selectTypeDescription].labels}
                    elId='weekly top description users'
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default ReportUsers
