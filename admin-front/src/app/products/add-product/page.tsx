'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import Layout from '@/components/Layout'
import { useRouter } from 'next/navigation'
import { FaArrowLeft, FaTrash } from 'react-icons/fa'

import InputType from '@/components/InputType'
import Button from '@/components/Button'
import { BaseURLV1 } from '@/config/api'
import InputFile from '@/components/InputFile'
import { UserState, userContextType } from '@/context/userContext'
import { isUserLogin } from '@/validations/shared'

const AddProduct = () => {
  let { user }: userContextType = UserState()
  const [buttonClick, setButtonClick] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [nmProduct, setNmProduct] = useState('')
  const [category, setCategory] = useState('')
  const [subCategory, setSubCategory] = useState('')
  const [files, setFiles] = useState([])
  const [price, setPrice] = useState('')
  const [stock, setStock] = useState('')
  const [size, setSize] = useState('')
  const [color, setColor] = useState('')
  const [productDetails, setProductDetails] = useState<any[]>([])
  const router = useRouter()

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData()
      for (const file of files) {
        formData.append('images', file)
      }

      formData.append('nmProduct', nmProduct)
      formData.append('category', category)
      formData.append('subCategory', subCategory)
      formData.append('details', JSON.stringify(productDetails))

      const config = {
        headers: {
          Authorization: `Bearer ${user!.token}`,
        },
      }

      const {
        data: { data, token, message },
      } = await axios.post(`${BaseURLV1}/product`, formData, config)
      alert(message)
      setIsLoading(false)
      router.push('/products')
    } catch (e: any) {
      setIsLoading(false)
      alert(e.response.data.description)
    }
  }

  const handleDetailProduct = async (e: any) => {
    let tampunganDetails: any[] = []
    const productColor = color.split(',')
    const details = {
      price,
      stock,
      size,
      color: productColor[0],
      hexColor: productColor[1],
    }

    tampunganDetails = [...productDetails, details]
    setProductDetails(tampunganDetails)

    setPrice('')
    setStock('')
    setSize('')
    setColor('')
  }

  const getCategories = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user!.token}`,
        },
      }
      const { data } = await axios.get(`${BaseURLV1}/category`, config)

      setCategories(data.data)
    } catch (e: any) {
      return false
    }
  }

  const handleCategory = async (e: any) => {
    const category: any = categories.find(
      (category: any) => category._id === e.target.value
    )

    if (category) {
      setCategory(e.target.value)
      setSubCategories(category.subCategory)
    } else {
      alert(`didn't have sub category`)
    }
  }

  const handleDeleteProductDetail = async (id: string) => {
    if (productDetails.length === 1) {
      alert('failed, product detail minimal 1 record')
      return false
    }

    const newProductDetails: any = productDetails.filter(
      (product) => product._id !== id
    )
    setProductDetails(newProductDetails)
  }

  useEffect(() => {
    isUserLogin(user) ? (user = isUserLogin(user)) : router.push('/login')
    getCategories()
  }, [])

  return (
    <Layout>
      <div className='flex flex-col'>
        <div className='flex justify-start gap-3 items-center'>
          <div className='flex items-start mt-3 cursor-pointer h-full'>
            <FaArrowLeft size={18} onClick={() => router.back()} />
          </div>
          <div className='flex flex-col gap-1 '>
            <span className='text-2xl font-semibold tracking-wide'>
              Create Product
            </span>
            <small className='text-xs'>Add a new product</small>
          </div>
        </div>
        <div className='mt-8'>
          <div className='flex flex-col bg-white dark:bg-boxDark-500'>
            <div className='relative overflow-x-auto  p-4 shadow-md sm:rounded-lg'>
              <form
                onSubmit={handleSubmit}
                encType='multipart/form-data'
                className='flex flex-col gap-5'
              >
                <InputType
                  type='text'
                  title='Product Name'
                  placeholder='Enter your Product Name'
                  name='nmProduct'
                  value={nmProduct}
                  setValue={setNmProduct}
                  buttonClick={buttonClick}
                />
                <div className='flex gap-2'>
                  <div className='w-1/2'>
                    <div className='flex flex-col text-start justify-start gap-2'>
                      <span className='font-semibold dark:text-white'>
                        Category
                      </span>

                      <select
                        onChange={(e) => handleCategory(e)}
                        className={`text-gray-900 border rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ring-1 py-2 px-4 `}
                      >
                        <option value='#' disabled selected={true}>
                          --- Choose your Category ---
                        </option>
                        {categories.map((dt: any) => (
                          <option key={dt._id} value={dt._id}>
                            {dt.category}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className='w-1/2'>
                    <div className='flex flex-col text-start justify-start gap-2'>
                      <span className='font-semibold dark:text-white'>
                        Sub Category
                      </span>

                      <select
                        onChange={(e) => setSubCategory(e.target.value)}
                        className={`text-gray-900 border rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ring-1 py-2 px-4 `}
                      >
                        <option value='#' disabled selected={true}>
                          --- Choose your Sub Category ---
                        </option>
                        {subCategories.length > 0 &&
                          subCategories.map((dt: any, i: number) => (
                            <option key={i} value={dt}>
                              {dt}
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>
                <InputFile
                  title='Upload Product Photos'
                  name='images'
                  multiple={true}
                  setFile={setFiles}
                />
                <div className='flex gap-4'>
                  <div className='w-1/5'>
                    <InputType
                      type='text'
                      title='Price'
                      placeholder='Enter your Price'
                      name='price'
                      value={price}
                      setValue={setPrice}
                      buttonClick={buttonClick}
                    />
                  </div>
                  <div className='w-1/5'>
                    <InputType
                      type='text'
                      title='Stock'
                      placeholder='Enter your Stock'
                      name='stock'
                      value={stock}
                      setValue={setStock}
                      buttonClick={buttonClick}
                    />
                  </div>
                  <div className='w-1/5'>
                    <InputType
                      type='text'
                      title='Size/Type'
                      placeholder='Ex: 128GB/M/L/XL'
                      name='size'
                      value={size}
                      setValue={setSize}
                      buttonClick={buttonClick}
                    />
                  </div>
                  <div className='w-1/5'>
                    <InputType
                      type='text'
                      title='Color&HexColor'
                      placeholder='Ex: red,#880808'
                      name='color'
                      value={color}
                      setValue={setColor}
                      buttonClick={buttonClick}
                    />
                  </div>
                  <div className='flex w-1/5 flex-col gap-2'>
                    <span className='text-transparent'>A</span>
                    <button
                      type='button'
                      onClick={handleDetailProduct}
                      className='bg-ActiveMenu-500 w-12 py-2 rounded-lg'
                    >
                      {' '}
                      +{' '}
                    </button>
                  </div>
                </div>
                {productDetails.length > 0 && (
                  <fieldset className='border border-solid border-gray-300 p-3'>
                    <legend className='text-sm'>
                      &nbsp; Product Details: &nbsp;
                    </legend>

                    <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
                      <thead className='text-xs uppercase bg-gray-50 dark:bg-gray-700'>
                        <tr>
                          <th className='text-center px-6 py-3'>Price</th>
                          <th className='text-center px-6 py-3'>Stock</th>
                          <th className='text-center px-6 py-3'>Size</th>
                          <th className='text-center px-6 py-3'>color</th>
                          <th className='text-center px-6 py-3'>Hex Color</th>
                          <th className='text-center px-6 py-3'>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productDetails.map((detail) => (
                          <tr
                            key={detail._id}
                            className='bg-white border-b dark:bg-boxDark-500 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                          >
                            <td className='px-6 py-4'>{detail.price}</td>
                            <td className='px-6 py-4'>{detail.stock}</td>
                            <td className='px-6 py-4'>{detail.size}</td>
                            <td className='px-6 py-4'>{detail.color}</td>
                            <td className='px-6 py-4'>{detail.hexColor}</td>
                            <td className='flex gap-2 px-6 py-4'>
                              <div
                                className='p-3 bg-red-500 text-white rounded cursor-pointer'
                                onClick={() =>
                                  handleDeleteProductDetail(detail._id)
                                }
                              >
                                <FaTrash />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </fieldset>
                )}
                <Button
                  title='Add Product'
                  isLoading={isLoading}
                  setButtonClick={setButtonClick}
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AddProduct
