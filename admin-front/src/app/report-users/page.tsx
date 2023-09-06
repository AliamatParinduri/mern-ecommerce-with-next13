'use client'

import { useEffect, useState, useMemo } from 'react'

import Layout from '@/components/Layout'
import { isUserLogin, userDTO } from '@/validations/shared'
import { useRouter } from 'next/navigation'
import { UserState, userContextType } from '@/context/userContext'
import Chart from '@/components/Chart'
import HappySvg from '../../../public/svg/happy.svg'
import { FaCheckDouble } from 'react-icons/fa'
import Image from 'next/image'
import axios from 'axios'
import { BaseURLV1 } from '@/config/api'
import Link from 'next/link'
import Datatable from '@/components/Datatable'

const ReportUsers = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [users, setUsers] = useState<userDTO[]>([])
  let { user }: userContextType = UserState()
  const router = useRouter()

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user!.token}`,
        },
      }

      const { data } = await axios.get(`${BaseURLV1}/users`, config)

      setIsLoading(false)
      setUsers(data.data.users)
    } catch (e: any) {
      setIsLoading(false)
      return false
    }
  }

  useEffect(() => {
    isUserLogin(user) ? (user = isUserLogin(user)) : router.push('/login')

    fetchUsers()
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
              // onClick={() => handleDelete(row.original._id)}
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

  return (
    <Layout>
      <div className='flex flex-col lg:flex-row gap-2'>
        <div className='relative flex flex-col bg-clip-border rounded-xl w-full lg:w-2/5 bg-white dark:bg-boxDark-500 text-gray-700 shadow-md'>
          <div className='p-4'>
            <div className='card-body flex flex-row'>
              <div className='img-wrapper w-40 h-40 flex justify-center items-center'>
                <Image
                  src={HappySvg.src}
                  alt='Picture of the author'
                  width={0}
                  height={0}
                  style={{ width: '100%', height: '100%' }}
                  objectFit='cover'
                  className='rounded-full'
                />
              </div>

              <div className='py-2 ml-10'>
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

        <div className='relative flex flex-col justify-around bg-clip-border rounded-xl w-full lg:w-1/5 bg-white dark:bg-boxDark-500 text-gray-700 shadow-md'>
          <div className='flex '>
            <div className='p-4 w-1/2'>
              <p className='block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600 dark:text-white'>
                Daily Order
              </p>
              <h4 className='block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900 dark:text-white'>
                $53k
              </h4>
            </div>
            <div className='flex-shrink w-1/2 px-4 pt-3 -mb-40'>
              <Chart
                type='line'
                value={[106, 107, 111, 133, 86, 114, 106]}
                elId='dailyOrder'
                detail={false}
              />
            </div>
          </div>
          <div className='p-4'>
            <p className='block antialiased font-sans text-base leading-relaxed font-normal text-blue-gray-600 dark:text-white'>
              <strong className='text-green-500'>+55%</strong>&nbsp;than
              yesterday
            </p>
          </div>
        </div>

        <div className='relative flex flex-col justify-around bg-clip-border rounded-xl w-full lg:w-1/5 bg-white dark:bg-boxDark-500 text-gray-700 shadow-md'>
          <div className='flex'>
            <div className='p-4 w-1/2'>
              <p className='block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600 dark:text-white'>
                Weekly Order
              </p>
              <h4 className='block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900 dark:text-white'>
                $53k
              </h4>
            </div>
            <div className='flex-shrink w-1/2 px-4 pt-3 -mb-40'>
              <Chart
                type='line'
                value={[133, 86, 114, 106, 106, 107, 111]}
                elId='monthlyOrder'
                detail={false}
              />
            </div>
          </div>
          {/* <div className='border-t border-blue-gray-50 p-4'> */}
          <div className='p-4'>
            <p className='block antialiased font-sans text-base leading-relaxed font-normal text-blue-gray-600 dark:text-white'>
              <strong className='text-green-500'>+55%</strong>&nbsp;than last
              week
            </p>
          </div>
        </div>

        <div className='relative flex flex-col justify-around bg-clip-border rounded-xl w-full lg:w-1/5 bg-white dark:bg-boxDark-500 text-gray-700 shadow-md'>
          <div className='flex'>
            <div className='p-4 w-1/2'>
              <p className='block antialiased font-sans text-sm leading-normal font-normal text-blue-gray-600 dark:text-white'>
                Monthly Order
              </p>
              <h4 className='block antialiased tracking-normal font-sans text-2xl font-semibold leading-snug text-blue-gray-900 dark:text-white'>
                $53k
              </h4>
            </div>
            <div className='flex-shrink w-1/2 px-4 pt-3 -mb-40'>
              <Chart
                type='line'
                value={[111, 133, 86, 106, 107, 114, 106]}
                elId='yearlyOrder'
                detail={false}
              />
            </div>
          </div>
          <div className='p-4'>
            <p className='block antialiased font-sans text-base leading-relaxed font-normal text-blue-gray-600 dark:text-white'>
              <strong className='text-green-500'>+55%</strong>&nbsp;than last
              month
            </p>
          </div>
        </div>
      </div>

      <div className='flex flex-col lg:flex-row gap-3'>
        <div className='bg-white dark:bg-boxDark-500 p-6 w-full lg:w-1/2 rounded-lg shadow-lg'>
          <h2 className='text-xl font-bold mb-2'>user terbanyak beli</h2>
          <div className='relative left-0 shadow-md sm:rounded-lg bg-white dark:bg-boxDark-500'>
            <Datatable columns={columns} data={users} title='Users' />
          </div>
        </div>
        <div className='bg-white dark:bg-boxDark-500 p-6 w-full lg:w-1/2 rounded-lg shadow-lg'>
          <h2 className='text-xl font-bold mb-2'>product paling terjual</h2>
        </div>
      </div>
      <div className='flex gap-3'>
        <div className='bg-white dark:bg-boxDark-500 p-2 h-full w-1/3 rounded-lg shadow-lg'>
          <h2 className='text-xl font-bold mb-2'>
            <Chart
              type='bar'
              value={[86, 114, 106, 106, 107, 111, 133]}
              elId='daily'
            />
          </h2>
        </div>
        <div className='bg-white dark:bg-boxDark-500 p-2 h-full w-1/3 rounded-lg shadow-lg'>
          <h2 className='text-2xl font-bold mb-2 text-gray-800'>
            <Chart
              type='line'
              value={[106, 107, 111, 133, 86, 114, 106]}
              elId='monthly'
            />
          </h2>
        </div>
        <div className='bg-white dark:bg-boxDark-500 p-2 h-full w-1/3 rounded-lg shadow-lg'>
          <h2 className='text-2xl font-bold mb-2 text-gray-800'>
            <Chart
              type='pie'
              value={[111, 133, 86, 114, 106, 106, 107]}
              elId='yearly'
            />
          </h2>
        </div>
      </div>
    </Layout>
  )
}

export default ReportUsers
