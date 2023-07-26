import { ReactNode } from 'react'
import { FaSearch } from 'react-icons/fa'

type Props = {
  title: string[]
  children: ReactNode
}

const Datatable = ({ title, children }: Props) => {
  return (
    <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
      <div className='flex items-center justify-between py-4 px-2 bg-white dark:bg-boxDark-500'>
        <div>
          <select
            name=''
            id=''
            className='inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-2 dark:bg-boxDark-500 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 cursor-pointer'
          >
            <option value='10'>10</option>
            <option value='25'>25</option>
            <option value='50'>50</option>
            <option value='100'>100</option>
          </select>
        </div>
        <label className='sr-only'>Search</label>
        <div className='relative'>
          <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
            <FaSearch size={16} opacity={0.7} />
          </div>
          <input
            type='text'
            id='table-search-users'
            className='block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
            placeholder='Search for users'
          />
        </div>
      </div>
      <table className='w-full text-sm text-left text-gray-500 dark:text-gray-400'>
        <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
          <tr>
            {title.map((title) => (
              <th scope='col' key={title} className='text-center px-6 py-3'>
                {title}
              </th>
            ))}
          </tr>
        </thead>
        {children}
      </table>
      <nav
        className='flex items-center justify-between py-4 px-2 bg-white dark:bg-boxDark-500'
        aria-label='Table navigation'
      >
        <span className='text-sm font-normal text-gray-500 dark:text-gray-400'>
          Showing{' '}
          <span className='font-semibold text-gray-900 dark:text-white'>
            1-10
          </span>{' '}
          of{' '}
          <span className='font-semibold text-gray-900 dark:text-white'>
            1000
          </span>
        </span>
        <ul className='inline-flex -space-x-px text-sm h-8'>
          <li>
            <a
              href='#'
              className='flex items-center justify-center px-3 h-8 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-boxDark-500 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
            >
              Previous
            </a>
          </li>
          <li>
            <a
              href='#'
              aria-current='page'
              className='flex items-center justify-center px-3 h-8 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white'
            >
              1
            </a>
          </li>
          <li>
            <a
              href='#'
              className='flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-boxDark-500 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
            >
              2
            </a>
          </li>
          <li>
            <a
              href='#'
              className='flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-boxDark-500 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
            >
              3
            </a>
          </li>
          <li>
            <a
              href='#'
              className='flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-boxDark-500 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
            >
              Next
            </a>
          </li>
        </ul>
      </nav>
    </div>
  )
}

export default Datatable
