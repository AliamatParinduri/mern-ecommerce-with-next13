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
import { CategoriesDTO } from '@/validations/shared'
import { ToastError, ToastSuccess } from '@/components/Toast'

const Categories = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState<CategoriesDTO[]>([])
  const { user }: userContextType = UserState()

  const fetchCategories = async () => {
    setIsLoading(true)
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user!.token}`,
        },
      }

      const { data } = await axios.get(`${BaseURLV1}/category`, config)

      setIsLoading(false)
      setCategories(data.data)
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

      await axios.delete(`${BaseURLV1}/category/${id}`, config)

      const newCategory = categories.filter((category) => category._id !== id)
      setCategories(newCategory)

      setIsLoading(false)
      ToastSuccess('success delete category')
    } catch (e: any) {
      setIsLoading(false)
      ToastError(e.response.data.description)
      return false
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [user])

  const columns = useMemo(
    () => [
      {
        Header: 'Category',
        accessor: 'category',
      },
      {
        Header: 'Sub Category',
        accessor: 'subCategory',
      },
      {
        Header: 'Action',
        accessor: 'Action',
        Cell: ({ row }: any) => (
          <div className='flex items-center gap-2'>
            <Link
              href={`categories/${row.original._id}/edit-category`}
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
                Categories ({categories.length})
              </span>
              <small className='text-xs'>
                Manage categories for your store
              </small>
            </div>
            <Link
              href='/categories/add-category'
              className='flex items-center text-white gap-1 bg-ActiveMenu-500 rounded py-2 px-5'
            >
              <FaPlus />
              <span>Add New</span>
            </Link>
          </div>
          <div className='mt-8'>
            <div className='relative shadow-md sm:rounded-lg bg-white dark:bg-boxDark-500'>
              <Datatable
                columns={columns}
                data={categories.map((category: any) => {
                  return {
                    ...category,
                    subCategory: category.subCategory.toString(),
                  }
                })}
                title='Categories'
              />
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default Categories
