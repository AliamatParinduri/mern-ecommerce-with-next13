import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import {
  FaHome,
  FaFileInvoiceDollar,
  FaFileImage,
  FaUsers,
} from 'react-icons/fa'
import { BiCategoryAlt } from 'react-icons/bi'

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
    text: 'Title 1',
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
    <aside className='min-h-screen hidden md:block w-72 overscroll-contain border-r-2 dark:border-r-0 bg-light-500 dark:bg-boxDark-500'>
      <div className='py-3 px-5 fixed mb-10'>E-commerce</div>
      <div className='fixed w-56 mt-12 h-screen px-5 overflow-y-auto'>
        <div className='flex flex-col justify-between flex-1 mt-6'>
          <nav className='-mx-3'>
            <Link
              className={`flex items-center px-3 py-2 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-boxDark-400 dark:hover:text-gray-200 hover:text-gray-700 mb-3 ${
                (pathname === '/' && active === '') || active === 'dashboard'
                  ? 'bg-ActiveMenu-500 text-white'
                  : ''
              }`}
              href={'/'}
              onClick={() => {
                setActive('')
              }}
            >
              <FaHome />
              <span className='mx-2 text-sm font-normal '>Dashboard</span>
            </Link>
            <div className=' space-y-6 '>
              {sidebarItems.map(({ text, menu }) => {
                return (
                  <div key={text} className='space-y-3 '>
                    <label className='px-3 text-xs text-gray-500 uppercase dark:text-gray-400'>
                      {text}
                    </label>
                    {menu.length > 0 &&
                      menu.map(({ text, icon, link }) => {
                        return (
                          <Link
                            key={text}
                            className={`flex items-center px-3 py-2 transition-colors duration-300 transform rounded-lg dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-boxDark-400 dark:hover:text-gray-200 hover:text-gray-700 hover:cursor-pointer ${
                              active === link
                                ? 'bg-ActiveMenu-500 text-white'
                                : ''
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
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
