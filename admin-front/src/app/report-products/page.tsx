/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { Fragment, useEffect, useState } from 'react'

import Layout from '@/components/Layout'
import { formatAliasesNumber, isUserLogin } from '@/validations/shared'
import { useRouter } from 'next/navigation'
import { UserState, userContextType } from '@/context/userContext'
import Chart from '@/components/Chart'

import axios from 'axios'
import { BaseURLProduct, BaseURLV1 } from '@/config/api'
import Image from 'next/image'
import { ToastError } from '@/components/Toast'
import Loading from '@/components/Loading'

const ReportProducts = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [selectTypeProducts, setSelectTypeProducts] = useState<string>('daily')
  const [selectTopProducts, setSelectTopProducts] = useState<string>('daily')
  const [newProducts, setNewProducts] = useState<any>()
  const [topSalesProducts, setTopSalesProducts] = useState<any>()
  const { setUser }: userContextType = UserState()
  const router = useRouter()
  let { user }: userContextType = UserState()

  const getReportProducts = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user!.token}`,
        },
      }

      const { data } = await axios.get(
        `${BaseURLV1}/product/reportProducts`,
        config
      )

      setIsLoading(false)
      setNewProducts(data.data.newProducts)
      setTopSalesProducts(data.data.topSalesProducts)
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

    getReportProducts()
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
          <div className='flex-shrink max-w-full w-full lg:w-1/2 '>
            <div className='p-6 bg-white dark:bg-boxDark-500 rounded-lg shadow-lg h-full'>
              <div className='flex flex-row justify-between pb-6'>
                <h3 className='text-base font-bold'>New Products</h3>
                <div className='flex flex-col'>
                  <select
                    value={selectTypeProducts}
                    onChange={(e) => {
                      setSelectTypeProducts(e.target.value)
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
              {newProducts && (
                <div className='relative'>
                  <Chart
                    type='line'
                    value={newProducts[selectTypeProducts].data}
                    labels={newProducts[selectTypeProducts].labels}
                    elId={`${selectTypeProducts} new products`}
                  />
                </div>
              )}
            </div>
          </div>

          <div className='bg-white flex flex-col dark:bg-boxDark-500 p-4 w-full lg:w-1/2 rounded-lg shadow-lg gap-2'>
            <div className='text-right'>
              <select
                value={selectTopProducts}
                onChange={(e) => {
                  setSelectTopProducts(e.target.value)
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
            <div className='flex justify-between'>
              <div>Weekly Top Products</div>
              <div>Quantity</div>
            </div>
            {topSalesProducts &&
              topSalesProducts[selectTopProducts].length === 0 && (
                <div className='mt-2 font-bold'>No Data</div>
              )}
            {topSalesProducts &&
              topSalesProducts[selectTopProducts].length > 0 &&
              topSalesProducts[selectTopProducts].map((product: any) => (
                <div key={product._id[0]} className='flex justify-between'>
                  <div className='flex items-center w-4/5'>
                    <div className='flex-shrink-0 h-10 w-10'>
                      <Image
                        src={`${BaseURLProduct}/${product.pic[0][0]}`}
                        alt='product images'
                        width={0}
                        height={0}
                        objectFit='cover'
                        className='h-10 w-10 rounded-full'
                      />
                    </div>
                    <div className='ml-2'>
                      <div
                        className='leading-5 text-sm'
                        style={{
                          fontWeight: 'bold',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: '1',
                          WebkitBoxOrient: 'vertical',
                        }}
                      >
                        {product.nmProduct[0]}
                      </div>
                      <div className='text-xs leading-5 text-gray-500'>
                        {product.subCategory[0]}
                      </div>
                    </div>
                  </div>
                  <div className='leading-5 w-1/5 text-right text-green-700'>
                    {formatAliasesNumber(product.count, '')}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </Layout>
  )
}

export default ReportProducts
