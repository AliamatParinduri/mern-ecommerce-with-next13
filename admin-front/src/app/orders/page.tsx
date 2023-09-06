'use client'

import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { FaPlus } from 'react-icons/fa'

import Datatable from '@/components/Datatable'
import Layout from '@/components/Layout'
import Loading from '@/components/Loading'
import { BaseURLV1 } from '@/config/api'
import { UserState, userContextType } from '@/context/userContext'
import { formatRupiah, isUserLogin } from '@/validations/shared'
import { useRouter } from 'next/navigation'

const Orders = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [orders, setOrders] = useState([])
  const router = useRouter()
  let { user }: userContextType = UserState()

  const fetchOrders = async () => {
    setIsLoading(true)
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user!.token}`,
        },
      }

      const { data } = await axios.get(`${BaseURLV1}/order`, config)

      setIsLoading(false)
      setOrders(data.data)
    } catch (e: any) {
      setIsLoading(false)
      return false
    }
  }

  const handleDelete = async (id: any) => {
    setIsLoading(true)
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user!.token}`,
        },
      }

      await axios.delete(`${BaseURLV1}/order/${id}`, config)

      const newOrder = orders.filter((order: any) => order._id !== id)
      setOrders(newOrder)

      setIsLoading(false)
      alert('success delete order')
    } catch (e: any) {
      setIsLoading(false)
      alert(e.response.data.description)
      return false
    }
  }

  useEffect(() => {
    isUserLogin(user) ? (user = isUserLogin(user)) : router.push('/login')

    fetchOrders()
  }, [])

  const columns = useMemo(
    () => [
      {
        Header: 'Order',
        accessor: '_id',
      },
      {
        Header: 'Payment Status',
        accessor: 'paymentStatus',
        Cell: ({ row }: any) => {
          const color =
            row.original.paymentStatus === 'UnPaid' ? 'red' : 'green'
          return (
            <span
              className={`bg-${color}-100 text-white text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-${color}-900 dark:text-white`}
            >
              {row.original.paymentStatus}
            </span>
          )
        },
      },
      {
        Header: 'Payment Order',
        accessor: 'paymentOrder',
        Cell: ({ row }: any) => {
          let color
          if (row.original.paymentOrder === 'Process') {
            color = 'blue'
          } else if (row.original.paymentOrder === 'Delivery') {
            color = 'gray'
          } else {
            color = 'green'
          }
          return (
            <span
              className={`bg-${color}-100 text-white text-xs font-medium mr-2 px-2.5 py-0.5 rounded dark:bg-${color}-900 dark:text-white`}
            >
              {row.original.paymentOrder}
            </span>
          )
        },
      },
      {
        Header: 'Total Order',
        accessor: 'totalPrice',
        Cell: ({ row }: any) => {
          return <span>{formatRupiah(row.original.totalPrice, 'Rp. ')}</span>
        },
      },
      {
        Header: 'Action',
        accessor: 'Action',
        Cell: ({ row }: any) => (
          <div className='flex items-center gap-2'>
            <Link
              href={`orders/${row.original._id}/edit-order`}
              className='font-medium text-white no-underline bg-ActiveMenu-500 px-3 py-1.5 rounded'
            >
              Edit
            </Link>
            <Link
              href='#'
              onClick={() => handleDelete(row.original._id)}
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

  return (
    <Layout>
      {isLoading && (
        <div className='flex items-center justify-center h-screen'>
          <Loading />
        </div>
      )}
      {!isLoading && (
        <div className='flex flex-col'>
          <div className='flex justify-between items-center'>
            <div className='flex flex-col gap-1 '>
              <span className='text-2xl font-semibold tracking-wide'>
                Order ({orders.length})
              </span>
              <small className='text-xs'>Manage orders for your store</small>
            </div>
          </div>
          <div className='mt-8'>
            <div className='relative shadow-md sm:rounded-lg bg-white dark:bg-boxDark-500'>
              <Datatable
                columns={columns}
                data={orders.map((order: any) => {
                  return {
                    ...order,
                  }
                })}
                title='Orders'
              />
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default Orders
