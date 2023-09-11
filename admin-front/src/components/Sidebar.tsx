/* eslint-disable react-hooks/exhaustive-deps */
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import {
  FaHome,
  FaFileInvoiceDollar,
  FaFileImage,
  FaUsers,
  FaDollarSign,
} from 'react-icons/fa'
import { BiCategoryAlt, BiExit } from 'react-icons/bi'

const sidebarItems = [
  {
    text: 'Users',
    menu: [
      {
        text: 'Users',
        link: 'users',
        icon: <FaUsers />,
      },
    ],
  },
  {
    text: 'Master Data',
    menu: [
      {
        text: 'Categories',
        link: 'categories',
        icon: <BiCategoryAlt />,
      },
      {
        text: 'Products',
        link: 'products',
        icon: <FaFileImage />,
      },
    ],
  },
  {
    text: 'Transactions',
    menu: [
      {
        text: 'Orders',
        link: 'orders',
        icon: <FaDollarSign />,
      },
    ],
  },
  {
    text: 'Reports',
    menu: [
      {
        text: 'Report Users',
        link: 'report-users',
        icon: <FaFileInvoiceDollar />,
      },
      {
        text: 'Report Products',
        link: 'report-products',
        icon: <FaFileInvoiceDollar />,
      },
      {
        text: 'Report Orders',
        link: 'report-orders',
        icon: <FaFileInvoiceDollar />,
      },
    ],
  },
]

const Sidebar = () => {
  const pathname = usePathname()
  const [active, setActive] = useState('')

  useEffect(() => {
    setActive(pathname.substring(1))
  }, [])

  return (
    <aside
      className='bg-white dark:bg-boxDark-500 overflow-y-auto text-blue-100 space-y-6 py-7 px-2 flex-col border-r-2 dark:border-r-0 inset-y-0 left-0 transform hidden md:flex -translate-x-full md:translate-x-0 transition duration-100 ease-in-out z-3'
      style={{
        minWidth: '200px',
        maxWidth: '200px',
      }}
    >
      <a
        href='#'
        className='text-black dark:text-white flex items-center space-x-2 justify-center'
      >
        <svg
          className='w-7 h-7'
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth='2'
            d='M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z'
          />
        </svg>
        <span className='text-xl font-extrabold'>E-Commerce</span>
      </a>
      <nav>
        <Link
          className={`flex items-center px-3 py-2 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-boxDark-400 dark:hover:text-gray-200 hover:text-gray-700 mb-3 ${
            (pathname === '/' && active === '') || active === 'dashboard'
              ? 'bg-ActiveMenu-500 text-white'
              : 'text-black'
          }`}
          href={'/'}
          onClick={() => {
            setActive('')
          }}
        >
          <FaHome />
          <span className='mx-2 text-sm font-normal '>Dashboard</span>
        </Link>
        <div className=' space-y-5'>
          {sidebarItems.map(({ text, menu }) => {
            return (
              <div key={text} className='text-black'>
                <label className='px-3 text-xs text-gray-500 font-bold uppercase dark:text-gray-400'>
                  {text}
                </label>
                {menu.length > 0 &&
                  menu.map(({ text, icon, link }) => {
                    return (
                      <Link
                        key={text}
                        className={`flex items-center mt-1 px-3 py-2 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-boxDark-400 dark:hover:text-gray-200 hover:text-gray-700 hover:cursor-pointer ${
                          active === link ? 'bg-ActiveMenu-500 text-white' : ''
                        }`}
                        href={'/' + link}
                        onClick={() => {
                          setActive(link)
                        }}
                      >
                        {icon}
                        <span className='mx-2 text-sm font-normal truncate'>
                          {text}
                        </span>
                      </Link>
                    )
                  })}
              </div>
            )
          })}
        </div>
      </nav>
    </aside>
  )
}

export default Sidebar
