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

const Profile = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [orders, setOrders] = useState([])
  const router = useRouter()
  const { user }: userContextType = UserState()

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
                Profile
              </span>
            </div>
          </div>
          <div className='relative mt-4 shadow-md sm:rounded-lg p-4 bg-white dark:bg-boxDark-500'>
            {!user && <div>No Data</div>}
            {user && (
              <div className='grid md:grid-cols-2 text-sm'>
                <div className='grid grid-cols-2'>
                  <div className='px-4 py-2 font-semibold'>Full Name</div>
                  <div className='px-4 py-2'>{user.fullName}</div>
                </div>
                <div className='grid grid-cols-2'>
                  <div className='px-4 py-2 font-semibold'>Contact No.</div>
                  <div className='px-4 py-2'>{user.noHP}</div>
                </div>
                <div className='grid grid-cols-2'>
                  <div className='px-4 py-2 font-semibold'>Email.</div>
                  <div className='px-4 py-2'>
                    <a
                      className='text-blue-800'
                      href='mailto:jane@example.com'
                      target='_blank'
                    >
                      {user.email}
                    </a>
                  </div>
                </div>
                <div className='grid grid-cols-2'>
                  <div className='px-4 py-2 font-semibold'>Birthday</div>
                  <div className='px-4 py-2'>{user.dateOfBirth}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Layout>
  )
}

export default Profile
