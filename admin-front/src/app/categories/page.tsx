'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { FaPlus } from 'react-icons/fa'

import Datatable from '@/components/Datatable'
import Layout from '@/components/Layout'
import Loading from '@/components/Loading'
import { BaseURLV1 } from '@/config/api'
import { UserState, userContextType } from '@/context/userContext'
import { CategoriesDTO } from '@/validations/shared'

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
      alert('success delete category')
    } catch (e: any) {
      setIsLoading(false)
      alert(e.response.data.description)
      return false
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [user])

  const title = ['CATEGORY', 'SUB CATEGORY', 'ACTION']

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
            <Datatable title={title}>
              <tbody>
                {categories.length === 0 && (
                  <tr className='text-center bg-white border-b dark:bg-boxDark-500 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'>
                    <th className='py-3' colSpan={title.length}>
                      no data
                    </th>
                  </tr>
                )}
                {categories.length > 0 &&
                  categories.map((category, i) => (
                    <tr
                      key={i}
                      className='bg-white border-b dark:bg-boxDark-500 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                    >
                      <th
                        scope='row'
                        className='px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'
                      >
                        {category.category}
                      </th>
                      <td className='px-6 py-4'>
                        {category.subCategory.toString()}
                      </td>
                      <td className='flex items-center px-6 py-4 gap-2'>
                        <Link
                          href={`categories/${category._id}/edit-category`}
                          className='font-medium text-white no-underline bg-green-500 px-3 py-1.5 rounded'
                        >
                          Edit
                        </Link>
                        <Link
                          href='#'
                          onClick={() => handleDelete(category._id)}
                          className='font-medium text-white no-underline bg-red-500 px-3 py-1.5 rounded'
                        >
                          Delete
                        </Link>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </Datatable>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default Categories
