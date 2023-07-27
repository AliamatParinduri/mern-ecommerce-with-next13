import ThemeSwitcher from './ThemeSwitcher'
import { FaRegBell, FaBars, FaSearch } from 'react-icons/fa'

const Navbar = () => {
  return (
    <nav className='flex sticky flex-grow-1 py-3 bg-inherit justify-between'>
      <div className='flex items-center gap-3 md:gap-1'>
        <FaBars size={18} opacity={0.7} className='block md:hidden' />
        <div className='relative'>
          <div className='absolute inset-y-0 left-0 flex items-center py-3 pointer-events-none'>
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
        {/* <Image  /> */}
      </div>
    </nav>
  )
}

export default Navbar
