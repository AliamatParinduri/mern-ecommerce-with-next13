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
      className={`flex sticky top-0 py-2 justify-between z-50 ${
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
        <Image
          src={`${BaseURLUsers}/${user?.userPic}`}
          width={35}
          height={35}
          alt='bg left'
          className='bg-inherit rounded-full object-contain'
        />
      </div>
    </nav>
  )
}

export default Navbar
