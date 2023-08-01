import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaRegBell, FaBars, FaSearch } from 'react-icons/fa'
import Image from 'next/image'

import ThemeSwitcher from './ThemeSwitcher'
import { UserState, userContextType } from '@/context/userContext'
import { isUserLogin } from '@/validations/shared'
import { BaseURLUsers } from '@/config/api'

const Navbar = () => {
  let { user }: userContextType = UserState()
  const [scrollYPosition, setScrollYPosition] = useState(0)
  const router = useRouter()

  useEffect(() => {
    isUserLogin(user) ? (user = isUserLogin(user)) : router.push('/login')
    const updateScrollDirection = () => {
      const currentScrollYPosition = window.scrollY

      setScrollYPosition(currentScrollYPosition)
    }

    const onScroll = () => window.requestAnimationFrame(updateScrollDirection)

    window.addEventListener('scroll', onScroll)

    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`flex sticky top-0 py-2 justify-between z-2 ${
        scrollYPosition > 10
          ? 'bg-white dark:bg-boxDark-500 rounded-b transition delay-150 duration-150 ease-in-out px-3'
          : 'bg-inherit px-1 transition delay-150 duration-150'
      }`}
    >
      <div className='flex items-center gap-3 md:gap-1'>
        <FaBars
          size={18}
          opacity={0.7}
          className='block md:hidden'
          onClick={() => {}}
        />
        <div className='relative'>
          <div className='hidden md:flex absolute inset-y-0 left-0 items-center py-3 pointer-events-none'>
            <FaSearch size={16} opacity={0.7} />
          </div>
          <input
            type='text'
            id='table-search-users'
            className='block p-2 pl-8 text-sm bg-inherit border-inherit focus:outline-none placeholder:opacity-70 text-gray-900 rounded-lg w-80 dark:text-white'
            placeholder='Search for anything'
          />
        </div>
      </div>

      <div className='flex items-center gap-3'>
        <ThemeSwitcher size={22} />
        <div className='relative'>
          <FaRegBell size={18} className='relative cursor-pointer' />
          <div className='absolute flex justify-center items-center rounded-full w-2 h-2 -top-0.5 right-0 bg-red-500'></div>
        </div>
        {/* <Image
          src={`${BaseURLUsers}/${user?.userPic}`}
          width={35}
          height={35}
          alt='bg left'
          className='bg-inherit rounded-full object-contain'
        /> */}
        <div className='flex items-center md:order-2'>
          <button
            type='button'
            className='flex mr-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600'
            id='user-menu-button'
            aria-expanded='false'
            data-dropdown-toggle='user-dropdown'
            data-dropdown-placement='bottom'
          >
            <span className='sr-only'>Open user menu</span>
            <Image
              src={`${BaseURLUsers}/${user?.userPic}`}
              width={35}
              height={35}
              alt='bg left'
              className='bg-inherit rounded-full object-contain'
            />
          </button>
          {/* Dropdown menu */}
          <div
            className='z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600'
            id='user-dropdown'
          >
            <div className='px-4 py-3'>
              <span className='block text-sm text-gray-900 dark:text-white'>
                Bonnie Green
              </span>
              <span className='block text-sm  text-gray-500 truncate dark:text-gray-400'>
                name@flowbite.com
              </span>
            </div>
            <ul className='py-2' aria-labelledby='user-menu-button'>
              <li>
                <a
                  href='#'
                  className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white'
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white'
                >
                  Settings
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white'
                >
                  Earnings
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white'
                >
                  Sign out
                </a>
              </li>
            </ul>
          </div>
          <button
            data-collapse-toggle='navbar-user'
            type='button'
            className='inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600'
            aria-controls='navbar-user'
            aria-expanded='false'
          >
            <span className='sr-only'>Open main menu</span>
            <svg
              className='w-5 h-5'
              aria-hidden='true'
              xmlns='http://www.w3.org/2000/svg'
              fill='none'
              viewBox='0 0 17 14'
            >
              <path
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M1 1h15M1 7h15M1 13h15'
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
