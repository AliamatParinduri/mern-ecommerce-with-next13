/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useEffect, useState, useMemo, Fragment } from 'react'
import Layout from '@/components/Layout'
import {
  formatAliasesNumber,
  formatRupiah,
  getPercentage,
  isUserLogin,
  userDTO,
} from '@/validations/shared'
import { useRouter } from 'next/navigation'
import { UserState, userContextType } from '@/context/userContext'
import Chart from '@/components/Chart'
import HappySvg from '../../../public/svg/happy.svg'
import { FaCheckDouble } from 'react-icons/fa'
import Image from 'next/image'
import axios from 'axios'
import { BaseURLProduct, BaseURLV1 } from '@/config/api'
import Link from 'next/link'
import Datatable from '@/components/Datatable'
import MultipleCharts from '@/components/MultipleChart'
import Carousel from '@/components/Carousel'
import { ToastError } from '@/components/Toast'
import Loading from '@/components/Loading'

const BasketSvg = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='currentColor'
    className='absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 w-8 h-8 bi bi-cart3'
    viewBox='0 0 16 16'
  >
    <path d='M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l.84 4.479 9.144-.459L13.89 4H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z'></path>
  </svg>
)

const WalletSvg = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='currentColor'
    className='absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 w-8 h-8 bi bi-credit-card'
    viewBox='0 0 16 16'
  >
    <path d='M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1H2zm13 4H1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7z'></path>
    <path d='M2 10a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1v-1z'></path>
  </svg>
)

const ProductsSvg = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='currentColor'
    className='absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 w-8 h-8 bi bi-person'
    viewBox='0 0 16 16'
  >
    <path d='M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10z'></path>
  </svg>
)

type ordersType = {
  labels: string[]
  orders: number[]
  totalOrders: string
  ordersPercentage: string
  totalSales?: number[]
}

type multipleOrdersType = {
  labels: string[]
  totalSales1: number[]
  totalSales2: number[]
  todaySales: string
}

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [users, setUsers] = useState<userDTO[]>([])
  const [orders, setOrders] = useState<any[]>([])
  const [dailyOrders, setdailyOrders] = useState<ordersType>()
  const [weeklyOrders, setWeeklyOrders] = useState<ordersType>()
  const [monthlyOrders, setMonthlyOrders] = useState<ordersType>()
  const [weeklyUserTopPurchases, setWeeklyUserTopPurchases] = useState<any>([])
  const [weeklyTopCategorySales, setWeeklyTopCategorySales] = useState<any>([])
  const [weeklyTopProducts, setWeeklyTopProducts] = useState<any>([])
  const [totalSales, setTotalSales] = useState<any>()
  const [totalProfit, setTotalProfit] = useState<any>()
  const [newUsers, setNewUsers] = useState<any>()
  const [newProducts, setNewProducts] = useState<any>()
  const [weeklyTotalSales, setWeeklyTotalSales] = useState<multipleOrdersType>()
  const [weeklyDetailsAgeUsers, setWeeklyDetailsAgeUsers] = useState<any>()
  const { setUser }: userContextType = UserState()

  let { user }: userContextType = UserState()
  const router = useRouter()

  const getUsers = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user!.token}`,
        },
      }

      const { data } = await axios.get(`${BaseURLV1}/users`, config)

      setUsers(data.data.users)
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

  const getRekapOrders = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user!.token}`,
        },
      }

      const { data } = await axios.get(`${BaseURLV1}/order/rekapOrders`, config)
      const daily = data.data.dailyOrders
      const weekly = data.data.weeklyOrders
      const monthly = data.data.monthlyOrders
      const weeklyUsrTopPurchases = data.data.weeklyUserTopPurchases
      const weeklyTopCtgrSales = data.data.weeklyTopCategorySales
      const weeklyTopProducts = data.data.weeklyTopSalesProducts
      const totSales = data.data.totalSales
      const totProfit = data.data.getDifferentProfit
      const totNewUsers = data.data.getDifferentNewUsers
      const totNewProducts = data.data.getDifferentProducts
      const weeklyTotSales1 = data.data.getDifferentTotalSales[0]
      const weeklyTotSales2 = data.data.getDifferentTotalSales[1]
      const WeeklyDtlAgeUsers = data.data.getDetailsAgeUsersPurchases

      const resultDailyPercentage = getPercentage(
        daily.orders[daily.orders.length - 1],
        daily.orders[daily.orders.length - 2]
      )

      const resultWeeklyPercentage = getPercentage(
        weekly.orders[weekly.orders.length - 1],
        weekly.orders[weekly.orders.length - 2]
      )
      const resultMonthlyPercentage = getPercentage(
        monthly.orders[monthly.orders.length - 1],
        monthly.orders[monthly.orders.length - 2]
      )

      setdailyOrders({
        ...dailyOrders,
        labels: daily.labels,
        orders: daily.orders,
        totalOrders: daily.orders[daily.orders.length - 1].toString(),
        ordersPercentage: resultDailyPercentage!,
      })

      setWeeklyOrders({
        ...weeklyOrders,
        labels: weekly.labels,
        orders: weekly.orders,
        totalOrders: weekly.orders[weekly.orders.length - 1].toString(),
        ordersPercentage: resultWeeklyPercentage!,
      })

      setMonthlyOrders({
        ...monthlyOrders,
        labels: monthly.labels,
        orders: monthly.orders,
        totalOrders: monthly.orders[monthly.orders.length - 1].toString(),
        ordersPercentage: resultMonthlyPercentage!,
      })

      // Weekly top users
      setWeeklyUserTopPurchases(weeklyUsrTopPurchases)
      // Weekly top categories
      setWeeklyTopCategorySales(weeklyTopCtgrSales)
      // Weekly top products
      setWeeklyTopProducts(weeklyTopProducts)

      // total sales
      const totalSalesPercentage = getPercentage(
        totSales.totalSales[totSales.totalSales.length - 1],
        totSales.totalSales[totSales.totalSales.length - 2]
      )

      setTotalSales({
        ...totalSales,
        salesPercentage: totalSalesPercentage!,
        sales: totSales.totalSales[totSales.totalSales.length - 1],
      })

      // total profit
      const totalProfitPercentage = getPercentage(
        totProfit[totProfit.length - 1],
        totProfit[totProfit.length - 2]
      )

      setTotalProfit({
        ...totalProfit,
        profitPercentage: totalProfitPercentage!,
        profit: totProfit[totProfit.length - 1]!,
      })

      // new users
      const totalUsersPercentage = getPercentage(
        totNewUsers.users[totNewUsers.users.length - 1],
        totNewUsers.users[totNewUsers.users.length - 2]
      )

      setNewUsers({
        ...newUsers,
        usersPercentage: totalUsersPercentage!,
        users: totNewUsers.users[totNewUsers.users.length - 1]!,
      })

      // new products
      const totalProductsPercentage = getPercentage(
        totNewProducts.products[totNewProducts.products.length - 1],
        totNewProducts.products[totNewProducts.products.length - 2]
      )

      setNewProducts({
        ...newProducts,
        productsPercentage: totalProductsPercentage!,
        products: totNewProducts.products[totNewProducts.products.length - 1]!,
      })

      // weekly sales
      const d = new Date().getDay()
      setWeeklyTotalSales({
        ...weeklyTotalSales,
        labels: weeklyTotSales1.labels,
        totalSales1: weeklyTotSales1.totalSales,
        totalSales2: weeklyTotSales2.totalSales,
        todaySales: weeklyTotSales1.totalSales[d === 0 ? 6 : d - 1],
      })

      setWeeklyDetailsAgeUsers({
        ...setWeeklyDetailsAgeUsers,
        labels: WeeklyDtlAgeUsers.labels,
        detailsAges: WeeklyDtlAgeUsers.detailsAges,
      })

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
      return false
    }
  }

  useEffect(() => {
    isUserLogin(user) ? (user = isUserLogin(user)) : router.push('/login')

    if (user) {
      getUsers()
      getRekapOrders()
    }
  }, [user])

  const columns = useMemo(
    () => [
      {
        Header: 'Full Name',
        accessor: 'fullName',
      },
      {
        Header: 'Email',
        accessor: 'email',
      },
      {
        Header: 'Phone Number',
        accessor: 'noHP',
      },
      {
        Header: 'Action',
        accessor: 'Action',
        Cell: ({ row }: any) => (
          <div className='flex items-center gap-2'>
            <Link
              href={`users/${row.original._id}/edit-user`}
              className='font-medium text-white no-underline bg-ActiveMenu-500 px-3 py-1.5 rounded'
            >
              Edit
            </Link>
            <Link
              href='#'
              onClick={() => alert('delete')}
              className='font-medium text-white no-underline bg-red-500 px-3 py-1.5 rounded'
            >
              Delete
            </Link>
          </div>
        ),
      },
    ],
    []
  )

  type Props = {
    type: string
    title: string
    title2: string
    elId: any
    data: any
  }

  const Card1 = ({ type, title, title2, elId, data }: Props) => {
    return (
      <div className='relative flex flex-col overflow-x-auto justify-around bg-clip-border rounded-xl w-full lg:w-1/5 bg-white dark:bg-boxDark-500 text-gray-700 shadow-md'>
        <div className='flex'>
          <div className='p-4 w-3/5'>
            <p className='block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600 dark:text-white'>
              {title}
            </p>
            <h4 className='block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900 dark:text-white'>
              {data && formatAliasesNumber(data.totalOrders, 'Trx')}
            </h4>
          </div>
          <div className='flex-shrink w-2/5 pt-2'>
            {data && data.labels.length > 0 && (
              <Chart
                type={type}
                value={data.orders}
                labels={data.labels}
                diffPercentage={data.ordersPercentage}
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
                  data.ordersPercentage.charAt(0) === '+' ? 'green' : 'red'
                }-500`}
              >
                {data.ordersPercentage}
              </strong>
            )}
            &nbsp; than {title2}
          </p>
        </div>
      </div>
    )
  }

  type Props2 = {
    title: string
    svg: any
    data: any
    dataPercentage: any
    dataPrimary: any
  }
  const Card2 = ({ title, data, svg, dataPercentage, dataPrimary }: Props2) => {
    return (
      <div className='relative flex flex-col justify-around gap-4 py-3 bg-clip-border rounded-xl w-1/2 bg-white dark:bg-boxDark-500 text-gray-700 shadow-md'>
        <div className='flex px-6 justify-between'>
          <p className='block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600 dark:text-white'>
            {title}
          </p>
          <p className='block antialiased font-sans text-base leading-relaxed font-normal t-blue-gray-600 dark:text-white'>
            {data && (
              <strong
                className={`text-${
                  dataPercentage.charAt(0) === '+' ? 'green' : 'red'
                }-500`}
              >
                {dataPercentage}
              </strong>
            )}
          </p>
        </div>
        <div className='flex flex-row justify-between px-6'>
          <div className='self-center w-14 h-14 rounded-full text-green-500 bg-green-100 dark:bg-green-900 dark:bg-opacity-40 relative text-center'>
            {svg}
          </div>
          <h2 className='block antialiased font-sans self-center text-3xl leading-normal font-normal text-blue-gray-600 dark:text-white'>
            {data &&
              formatAliasesNumber(
                dataPrimary,
                title === 'Total Sales' || title === 'Total Profit'
                  ? 'Rp. '
                  : ''
              )}
          </h2>
        </div>
        <div className='px-6'>
          <a
            className='antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600 dark:text-white'
            href='#'
          >
            View more...
          </a>
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
          <div className='flex flex-col lg:flex-row gap-2'>
            <div className='relative flex flex-col bg-clip-border rounded-xl w-full lg:w-2/5 bg-white dark:bg-boxDark-500 text-gray-700 shadow-md'>
              <div className='p-4'>
                <div className='card-body flex flex-row'>
                  <div className='img-wrapper relative w-40 h-40 flex justify-center items-center'>
                    <Image
                      src={HappySvg.src}
                      alt='Picture of the author'
                      width={150}
                      height={150}
                      priority={true}
                      style={{
                        objectFit: 'cover',
                      }}
                      className='absolute left-0'
                    />
                  </div>

                  <div className='flex flex-col flex-grow py-2'>
                    <h1 className='h6 truncate text-black dark:text-white'>
                      Good Job, {user?.fullName}
                    </h1>
                    <p className='text-xs mt-1 text-black dark:text-white'>
                      {`You've finished all of your tasks for this week.`}
                    </p>

                    <ul className='mt-4 text-black dark:text-white'>
                      <li className='flex text-sm font-light'>
                        <FaCheckDouble className='mr-2 mb-2' />
                        <span>Finish Dashboard Design</span>
                      </li>
                      <li className='flex text-sm font-light'>
                        <FaCheckDouble className='mr-2 mb-2' />
                        <span>Fix Issue #74</span>
                      </li>
                      <li className='flex text-sm font-light'>
                        <FaCheckDouble className='mr-2 mb-2' />
                        <span>Publish Version 1.0.6</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <Card1
              type='line'
              title='Daily Orders'
              title2='yesterday'
              elId='dailyOrder'
              data={dailyOrders}
            />

            <Card1
              type='line'
              title='Weekly Orders'
              title2='last week'
              elId='weeklyOrder'
              data={weeklyOrders}
            />

            <Card1
              type='line'
              title='Monthly Orders'
              title2='last month'
              elId='monthlyOrder'
              data={monthlyOrders}
            />
          </div>

          <div className='flex flex-col lg:flex-row gap-3 w-full'>
            {weeklyUserTopPurchases.length === 0 && (
              <div className='bg-white dark:bg-boxDark-500 p-4 w-full lg:w-[37.5%] rounded-lg shadow-lg'>
                <h3 className='text-base font-bold'>No Data</h3>
              </div>
            )}
            {weeklyUserTopPurchases.length > 0 && (
              <div className='w-full lg:w-[37.5%]'>
                <Carousel
                  title='Weekly top users purchases'
                  datas={weeklyUserTopPurchases}
                  from='user'
                />
              </div>
            )}

            {weeklyTopCategorySales.length === 0 && (
              <div className='bg-white dark:bg-boxDark-500 p-4 w-full lg:w-[37.5%] rounded-lg shadow-lg'>
                <h3 className='text-base font-bold'>No Data</h3>
              </div>
            )}
            {weeklyTopCategorySales.length > 0 && (
              <div className='w-full lg:w-[37.5%]'>
                <Carousel
                  title='Weekly top categories sales'
                  datas={weeklyTopCategorySales}
                  from='category'
                />
              </div>
            )}

            <div className='bg-white flex flex-col dark:bg-boxDark-500 p-4 w-full lg:w-1/4 rounded-lg shadow-lg gap-2'>
              <div className='flex justify-between'>
                <div>Weekly Top Products</div>
                <div>Quantity</div>
              </div>
              {weeklyTopProducts.length === 0 && (
                <div className='mt-2 font-bold'>No Data</div>
              )}
              {weeklyTopProducts.length > 0 &&
                weeklyTopProducts.map((product: any) => (
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

          <div className='flex flex-col lg:flex-row gap-3'>
            <div className='flex gap-3 w-full lg:w-1/2'>
              {totalSales && (
                <Card2
                  title='Total Sales'
                  svg={<BasketSvg />}
                  data={totalSales}
                  dataPercentage={totalSales.salesPercentage}
                  dataPrimary={totalSales.sales}
                />
              )}
              {totalProfit && (
                <Card2
                  title='Total Profit'
                  svg={<WalletSvg />}
                  data={totalProfit}
                  dataPercentage={totalProfit.profitPercentage}
                  dataPrimary={totalProfit.profit}
                />
              )}
            </div>
            <div className='flex gap-3 w-full lg:w-1/2'>
              {newUsers && (
                <Card2
                  title='New Users'
                  svg={<ProductsSvg />}
                  data={newUsers}
                  dataPercentage={newUsers.usersPercentage}
                  dataPrimary={newUsers.users}
                />
              )}
              {newProducts && (
                <Card2
                  title='New Products'
                  svg={<ProductsSvg />}
                  data={newProducts}
                  dataPercentage={newProducts.productsPercentage}
                  dataPrimary={newProducts.products}
                />
              )}
            </div>
          </div>

          <div className='flex flex-row gap-3'>
            <div className='flex-shrink max-w-full w-full lg:w-1/2 mb-6'>
              <div className='p-6 bg-white dark:bg-boxDark-500 rounded-lg shadow-lg h-full'>
                <div className='flex flex-row justify-between pb-6'>
                  <div className='flex flex-col'>
                    <h3 className='text-base font-bold'>
                      Weekly Sales Overview
                    </h3>
                    <span className='text-gray-500 font-semibold text-sm'>
                      {`Today's Earning: `}
                      <span className='text-green-500'>
                        {weeklyTotalSales &&
                          formatRupiah(weeklyTotalSales.todaySales, 'Rp. ')}
                      </span>
                    </span>
                  </div>
                </div>
                <div className='relative'>
                  {weeklyTotalSales && (
                    <MultipleCharts
                      type='line'
                      value1={weeklyTotalSales.totalSales1}
                      value2={weeklyTotalSales.totalSales2}
                      labels={weeklyTotalSales.labels}
                      elId='dailytest'
                    />
                  )}
                </div>
              </div>
            </div>

            <div className='flex-shrink max-w-full w-full lg:w-1/2  mb-6'>
              <div className='p-6 bg-white dark:bg-boxDark-500 rounded-lg shadow-lg h-full'>
                <div className='flex flex-row justify-between pb-6'>
                  <div className='flex flex-col'>
                    <h3 className='text-base font-bold'>
                      Weekly Description Users
                    </h3>
                    <span className='text-gray-500 font-semibold text-sm'>
                      Users already have purchased in this week
                    </span>
                  </div>
                </div>
                <div className='relative'>
                  {weeklyOrders && weeklyOrders.orders.length > 0 && (
                    <Chart
                      type='pie'
                      value={weeklyDetailsAgeUsers.detailsAges}
                      labels={weeklyDetailsAgeUsers.labels}
                      elId='weekly top users'
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className='flex flex-col lg:flex-row gap-3'>
            <div className='bg-white dark:bg-boxDark-500 p-6 w-full rounded-lg shadow-lg'>
              <h2 className='text-xl font-bold mb-2'>Order Transactions</h2>
              <div className='relative left-0 shadow-md sm:rounded-lg bg-white dark:bg-boxDark-500'>
                <Datatable columns={columns} data={orders} title='Order' />
              </div>
            </div>
          </div>

          <div className='flex gap-3'>
            <div className='bg-white dark:bg-boxDark-500 p-2 h-full w-1/3 rounded-lg shadow-lg'>
              {dailyOrders && dailyOrders.orders.length > 0 && (
                <Chart
                  type='bar'
                  value={dailyOrders.orders}
                  labels={dailyOrders.labels}
                  elId='daily order (trx)'
                />
              )}
            </div>
            <div className='bg-white dark:bg-boxDark-500 p-2 h-full w-1/3 rounded-lg shadow-lg'>
              {weeklyOrders && weeklyOrders.orders.length > 0 && (
                <Chart
                  type='bar'
                  value={weeklyOrders.orders}
                  labels={weeklyOrders.labels}
                  elId='weekly order (trx)'
                />
              )}
            </div>
            <div className='bg-white dark:bg-boxDark-500 p-2 h-full w-1/3 rounded-lg shadow-lg'>
              {monthlyOrders && monthlyOrders.orders.length > 0 && (
                <Chart
                  type='bar'
                  value={monthlyOrders.orders}
                  labels={monthlyOrders.labels}
                  elId='monthly order (trx)'
                />
              )}
            </div>
          </div>
        </Fragment>
      )}
    </Layout>
  )
}

export default Dashboard
