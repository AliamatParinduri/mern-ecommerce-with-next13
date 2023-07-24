import Image from 'next/image'
import ThemeSwitcher from './ThemeSwitcher'
import { FaRegBell, FaBars, FaSearch } from 'react-icons/fa'

const Navbar = () => {
  return (
    <nav className='flex sticky flex-grow-1 py-3 bg-inherit justify-between'>
      {/* Left */}
      <div className='flex items-center gap-3 md:gap-1'>
        <FaBars size={18} opacity={0.7} className='block md:hidden' />
        <FaSearch
          size={18}
          opacity={0.7}
          className='hidden md:block cursor-pointer'
        />
        <input
          type='text'
          className=' border-inherit bg-inherit py-2 px-1 focus:outline-none placeholder:opacity-70'
          placeholder='Click for Search..'
        />
      </div>

      {/* Right */}
      <div className='flex items-center gap-3'>
        <ThemeSwitcher size={22} />
        <div className='relative'>
          <FaRegBell size={18} className='relative' />
          <div className='absolute flex justify-center items-center rounded-full w-2 h-2 -top-0.5 right-0 bg-red-500'></div>
        </div>
        {/* <Image  /> */}
      </div>
    </nav>
  )
}

export default Navbar
