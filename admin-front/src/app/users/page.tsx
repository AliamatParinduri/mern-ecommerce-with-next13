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
import { userDTO } from '@/validations/shared'
import { ToastError, ToastSuccess } from '@/components/Toast'

const Users = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [users, setUsers] = useState<userDTO[]>([])
  const { user }: userContextType = UserState()

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

  const handleDelete = async (id: any) => {
    setIsLoading(true)
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user!.token}`,
        },
      }

      await axios.delete(`${BaseURLV1}/users/${id}`, config)

      const newUsers = users.filter((user) => user._id !== id)

      setUsers(newUsers)
      setIsLoading(false)
      ToastSuccess('success delete user')
    } catch (e: any) {
      setIsLoading(false)
      ToastError(e.response.data.description)
      return false
    }
  }

  useEffect(() => {
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
                Users ({users.length})
              </span>
              <small className='text-xs'>Manage users for your store</small>
            </div>
            <Link
              href='/users/add-user'
              className='flex items-center text-white gap-1 bg-ActiveMenu-500 rounded py-2 px-5'
            >
              <FaPlus />
              <span>Add New</span>
            </Link>
          </div>
          <div className='mt-8'>
            <div className='relative shadow-md sm:rounded-lg bg-white dark:bg-boxDark-500'>
              <Datatable columns={columns} data={users} title='Users' />
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default Users
