import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { useAsyncDebounce } from 'react-table'

type Props = {
  preGlobalFilteredRows: any
  globalFilter: string
  setGlobalFilter: any
}

export const GlobalFilter = ({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}: Props) => {
  const [value, setValue] = useState(globalFilter)
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined)
  }, 1000)
  return (
    <div className='relative'>
      <div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none'>
        <FaSearch size={16} opacity={0.7} />
      </div>
      <input
        type='text'
        id='table-search-users'
        className='block p-2 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-80 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
        placeholder='Search for users'
        value={value || ''}
        onChange={(e) => {
          setValue(e.target.value)
          onChange(e.target.value)
        }}
      />
    </div>
  )
}
