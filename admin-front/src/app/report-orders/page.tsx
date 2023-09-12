/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { Fragment, useEffect, useState } from 'react'

import Layout from '@/components/Layout'
import {
  formatAliasesNumber,
  getPercentage,
  isUserLogin,
} from '@/validations/shared'
import { useRouter } from 'next/navigation'
import { UserState, userContextType } from '@/context/userContext'
import Chart from '@/components/Chart'

import axios from 'axios'
import { BaseURLV1 } from '@/config/api'
import { ToastError } from '@/components/Toast'
import Loading from '@/components/Loading'

const ReportOrders = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [selectTypeOrders, setSelectTypeOrders] = useState<string>('daily')
  const [selectTypeSales, setSelectTypeSales] = useState<string>('daily')
  const [orders, setOrders] = useState<any>()
  const [ordersDetails, setOrdersDetails] = useState<any>()
  const [sales, setSales] = useState<any>()
  const [salesDetails, setSalesDetails] = useState<any>()
  const { setUser }: userContextType = UserState()
  const router = useRouter()
  let { user }: userContextType = UserState()

  const getReportOrders = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user!.token}`,
        },
      }

      const { data } = await axios.get(
        `${BaseURLV1}/order/reportOrders`,
        config
      )

      setOrders(data.data.orders)
      setSales(data.data.totalSales)

      setIsLoading(false)
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

    getReportOrders()
  }, [user])

  useEffect(() => {
    if (orders) {
      const resultPercentage = getPercentage(
        orders[selectTypeOrders].orders[
          orders[selectTypeOrders].orders.length - 1
        ],
        orders[selectTypeOrders].orders[
          orders[selectTypeOrders].orders.length - 2
        ]
      )

      setOrdersDetails({
        ...ordersDetails,
        labels: orders[selectTypeOrders].labels,
        orders: orders[selectTypeOrders].orders,
        total:
          orders[selectTypeOrders].orders[
            orders[selectTypeOrders].orders.length - 1
          ].toString(),
        percentage: resultPercentage!,
      })
    }
  }, [orders, selectTypeOrders])

  useEffect(() => {
    if (sales) {
      const resultPercentage = getPercentage(
        sales[selectTypeSales].totalSales[
          sales[selectTypeSales].totalSales.length - 1
        ],
        sales[selectTypeSales].totalSales[
          sales[selectTypeSales].totalSales.length - 2
        ]
      )

      setSalesDetails({
        ...salesDetails,
        labels: sales[selectTypeSales].labels,
        orders: sales[selectTypeSales].totalSales,
        total:
          sales[selectTypeSales].totalSales[
            sales[selectTypeSales].totalSales.length - 1
          ].toString(),
        percentage: resultPercentage!,
      })
    }
  }, [sales, selectTypeSales])

  type Props = {
    type: string
    title: string
    title2: string
    elId: any
    data: any
  }

  const Card1 = ({ type, title, title2, elId, data }: Props) => {
    return (
      <div className='relative flex flex-col overflow-x-auto justify-around bg-clip-border rounded-xl w-full lg:w-1/2 bg-white dark:bg-boxDark-500 text-gray-700 shadow-md'>
        <div className='flex'>
          <div className='p-4 w-3/5'>
            <p className='block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600 dark:text-white'>
              {title}
            </p>
            <h4 className='block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900 dark:text-white'>
              {data &&
                formatAliasesNumber(
                  data.total,
                  elId === 'OrdersTrx' ? 'Trx' : 'Rp. '
                )}
            </h4>
          </div>
          <div className='flex-shrink w-2/5 pt-2'>
            {data && data.labels.length > 0 && (
              <Chart
                type={type}
                value={data.orders}
                labels={data.labels}
                diffPercentage={data.percentage}
                elId={elId}
                detail={false}
              />
            )}
          </div>
        </div>
        <div className='p-4'>
          <p className='block antialiased font-sans text-base leading-relaxed font-normal text-blue-gray-600 dark:text-white'>
            {data && (
              <strong
                className={`text-${
                  data.percentage.charAt(0) === '+' ? 'green' : 'red'
                }-500`}
              >
                {data.percentage}
              </strong>
            )}
            &nbsp; than {title2}
          </p>
        </div>
      </div>
    )
  }

  return (
    <Layout>
      {isLoading && (
        <div className='flex items-center justify-center h-screen'>
          <Loading />
        </div>
      )}
      {!isLoading && (
        <Fragment>
          <div className='flex flex-row gap-3'>
            {ordersDetails && (
              <Card1
                type='line'
                title={`${selectTypeOrders
                  .charAt(0)
                  .toUpperCase()}${selectTypeOrders.slice(1)} Orders`}
                title2='yesterday'
                elId='OrdersTrx'
                data={ordersDetails}
              />
            )}
            {salesDetails && (
              <Card1
                type='line'
                title={`${selectTypeSales
                  .charAt(0)
                  .toUpperCase()}${selectTypeSales.slice(1)} Orders`}
                title2='yesterday'
                elId='OrdersSales'
                data={salesDetails}
              />
            )}
          </div>

          <div className='flex gap-3'>
            <div className='flex-shrink max-w-full w-full lg:w-1/2 '>
              <div className='p-6 bg-white dark:bg-boxDark-500 rounded-lg shadow-lg h-full'>
                <div className='flex flex-row justify-between pb-6'>
                  <h3 className='text-base font-bold'>
                    {`${selectTypeOrders
                      .charAt(0)
                      .toUpperCase()}${selectTypeOrders.slice(1)}`}{' '}
                    Orders (Trx)
                  </h3>
                  <div className='flex flex-col'>
                    <select
                      value={selectTypeOrders}
                      onChange={(e) => {
                        setSelectTypeOrders(e.target.value)
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
                {orders && (
                  <div className='relative'>
                    <Chart
                      type='line'
                      value={orders[selectTypeOrders].orders}
                      labels={orders[selectTypeOrders].labels}
                      elId={`${selectTypeOrders} orders (trx)`}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className='flex-shrink max-w-full w-full lg:w-1/2 '>
              <div className='p-6 bg-white dark:bg-boxDark-500 rounded-lg shadow-lg h-full'>
                <div className='flex flex-row justify-between pb-6'>
                  <h3 className='text-base font-bold'>
                    {`${selectTypeSales
                      .charAt(0)
                      .toUpperCase()}${selectTypeSales.slice(1)}`}{' '}
                    Orders
                  </h3>
                  <div className='flex flex-col'>
                    <select
                      value={selectTypeSales}
                      onChange={(e) => {
                        setSelectTypeSales(e.target.value)
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
                {orders && sales && (
                  <div className='relative'>
                    <Chart
                      type='line'
                      value={sales[selectTypeSales].totalSales}
                      labels={orders[selectTypeSales].labels}
                      elId={`${selectTypeSales} orders`}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </Fragment>
      )}
    </Layout>
  )
}

export default ReportOrders
