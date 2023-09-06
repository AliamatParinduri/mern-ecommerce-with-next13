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

  const testing = () => {
    const a = document.getElementById('dropdownAvatar')
    a?.classList.toggle('hidden')
  }

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
      className={`flex top-0 py-2 justify-between z-99 ${
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
        <div>
          <button
            onClick={testing}
            data-dropdown-toggle='dropdownAvatar'
            className='flex text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600'
            type='button'
          >
            <span className='sr-only'>Open user menu</span>
            <div className='h-8 w-8 relative'>
              {user && (
                <Image
                  src={`${BaseURLUsers}/${user.userPic}`}
                  alt='Picture of the author'
                  layout='fill'
                  objectFit='cover'
                  className='rounded-full'
                />
              )}
            </div>
          </button>

          <div
            id='dropdownAvatar'
            className='z-10 hidden absolute mt-2 right-4 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600'
          >
            <div className='px-4 py-3 text-sm text-gray-900 dark:text-white'>
              <div className='truncate'>{user?.fullName}</div>
              <div className='font-medium truncate'>{user?.email}</div>
            </div>
            <ul
              className='py-2 text-sm text-gray-700 dark:text-gray-200 gap-2'
              aria-labelledby='dropdownUserAvatarButton'
            >
              <li>
                <a
                  href='#'
                  className='block px-4 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'
                >
                  Profile
                </a>
              </li>
              <li>
                <a
                  href='#'
                  className='block px-4 py-1 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white'
                >
                  Settings
                </a>
              </li>
            </ul>
            <div className='py-2'>
              <a
                href='#'
                className='block px-4 py-1 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white'
              >
                Sign out
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
