'use client'

import { useState, useEffect, useMemo } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { FaPlus } from 'react-icons/fa'

import Datatable from '@/components/Datatable'
import Layout from '@/components/Layout'
import Loading from '@/components/Loading'
import { BaseURLProduct, BaseURLV1 } from '@/config/api'
import { UserState, userContextType } from '@/context/userContext'
import { ProductsDTO } from '@/validations/shared'
import Image from 'next/image'
import { ToastError, ToastSuccess } from '@/components/Toast'

const Products = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [products, setProducts] = useState<ProductsDTO[]>([])
  const { user }: userContextType = UserState()

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user!.token}`,
        },
      }

      const { data } = await axios.get(`${BaseURLV1}/product`, config)

      setIsLoading(false)
      setProducts(data.data.products)
    } catch (e: any) {
      setIsLoading(false)
      return false
    }
  }

  const handleDelete = async (id: any) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user!.token}`,
        },
      }
      await axios.delete(`${BaseURLV1}/product/${id}`, config)
      const newProducts = products.filter((product) => product._id !== id)
      setProducts(newProducts)
      ToastSuccess('success delete product')
    } catch (e: any) {
      ToastError(e.response.data.description)
      return false
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const columns = useMemo(
    () => [
      {
        Header: 'Product Name',
        accessor: 'nmProduct',
      },
      {
        Header: 'Category',
        accessor: 'category.category',
      },
      {
        Header: 'Sub Category',
        accessor: 'subCategory',
      },
      {
        Header: 'Product Picture',
        accessor: 'pic',
        Cell: ({ row }: any) => (
          <Image
            src={`${BaseURLProduct}/${row.original.pic[0]}`}
            width={35}
            height={35}
            alt='bg left'
            className='mx-auto'
          />
        ),
      },
      {
        Header: 'Action',
        accessor: 'Action',
        Cell: ({ row }: any) => (
          <div className='flex items-center gap-2'>
            <Link
              href={`products/${row.original._id}/edit-product`}
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
                Products ({products.length})
              </span>
              <small className='text-xs'>Manage products for your store</small>
            </div>
            <Link
              href='/products/add-product'
              className='flex items-center text-white gap-1 bg-ActiveMenu-500 rounded py-2 px-5'
            >
              <FaPlus />
              <span>Add New</span>
            </Link>
          </div>
          <div className='mt-8'>
            <div className='relative shadow-md sm:rounded-lg bg-white dark:bg-boxDark-500'>
              <Datatable columns={columns} data={products} title='Products' />
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default Products
