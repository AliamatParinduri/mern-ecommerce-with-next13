'use client'

import { useEffect, useState } from 'react'

import Layout from '@/components/Layout'
import { isUserLogin, userDTO } from '@/validations/shared'
import { useRouter } from 'next/navigation'
import { UserState, userContextType } from '@/context/userContext'
import Chart from '@/components/Chart'

import axios from 'axios'
import { BaseURLV1 } from '@/config/api'

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

    // fetchUsers()
  }, [user])

  return (
    <Layout>
      <div className='flex-shrink max-w-full w-full lg:w-1/2  mb-6'>
        <div className='p-6 bg-white dark:bg-boxDark-500 rounded-lg shadow-lg h-full'>
          <div className='flex flex-row justify-between pb-6'>
            <div className='flex flex-col'>
              <h3 className='text-base font-bold'>Weekly Description Users</h3>
              <span className='text-gray-500 font-semibold text-sm'>
                Users already have purchased in this week
              </span>
            </div>
          </div>
          <div className='relative'>
            <Chart
              type='pie'
              value={[90, 23, 44]}
              labels={['satu', 'dua', 'tiga']}
              elId='weekly top users'
            />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default ReportUsers
