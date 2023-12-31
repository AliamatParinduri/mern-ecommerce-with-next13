/* eslint-disable react-hooks/exhaustive-deps */
import 'core-js/stable'
import 'regenerator-runtime/runtime'
import { useMemo } from 'react'

import {
  useTable,
  useGlobalFilter,
  useFilters,
  useSortBy,
  usePagination,
} from 'react-table'
import { GlobalFilter } from './GlobalFilter'

type Props = {
  columns: any
  data: any
  title: string
}

const btnClasses =
  'flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-boxDark-500 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'

const Datatable = ({ columns, data, title }: Props) => {
  let initialState: object = {
    pageSize: 10,
    pageIndex: 0,
  }

  data = useMemo(() => data, [data])
  columns = useMemo(() => columns, [columns])
  initialState = useMemo(() => initialState, [])

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    preGlobalFilteredRows,
    setGlobalFilter,
    state: { pageIndex, pageSize, globalFilter },
  }: any = useTable(
    {
      columns,
      data,
      initialState,
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    usePagination
  )

  return (
    <div className='flex flex-col justify-between py-4 px-2 bg-white dark:bg-boxDark-500'>
      <div className='flex justify-between mb-5 w-full'>
        <select
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value))
          }}
          className='inline-flex items-center text-gray-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-3 py-2 dark:bg-boxDark-500 dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700 cursor-pointer'
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </select>

        <GlobalFilter
          preGlobalFilteredRows={preGlobalFilteredRows}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          title={title}
        />
      </div>
      <div className='overflow-x-auto '>
        <table
          {...getTableProps()}
          className='w-full text-sm text-left text-gray-500 dark:text-gray-400'
        >
          <thead className='text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400'>
            {headerGroups.map((headerGroup: any) => (
              <tr
                key={Math.random() * 10}
                {...headerGroup.getHeaderGroupProps()}
              >
                {headerGroup.headers.map((column: any) => (
                  <th
                    key={Math.random() * 100}
                    {...column.getHeaderProps()}
                    className='text-center px-6 py-3'
                  >
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.length < 1 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className='py-4 text-center border-b border-slate-50/10'
                >
                  No Data
                </td>
              </tr>
            )}
            {page.map((row: any) => {
              prepareRow(row)
              return (
                <tr
                  key={Math.random() * 5}
                  {...row.getRowProps()}
                  className='bg-white border-b dark:bg-boxDark-500 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'
                >
                  {row.cells.map((cell: any) => {
                    return (
                      <td
                        key={Math.random() * 50}
                        {...cell.getCellProps()}
                        className='px-6 py-4'
                      >
                        {cell.render('Cell')}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className='flex items-center justify-between w-full mt-5'>
        <span>
          Page{' '}
          <strong>
            {pageOptions.length > 0 ? pageIndex + 1 : 0} of {pageOptions.length}
          </strong>{' '}
        </span>
        <span>
          Go to page:{' '}
          <input
            type='number'
            min={pageOptions.length > 0 ? 1 : 0}
            max={pageOptions.length}
            placeholder='Ex: 1'
            onChange={(e) => {
              if (e.target.value > pageOptions.length) {
                e.target.value = '1'
              }
              const page = e.target.value ? Number(e.target.value) - 1 : 0
              gotoPage(page)
            }}
            className='py-1 pl-3 w-28 text-sm text-gray-900 border border-gray-300 rounded-lg  bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
          />
        </span>
        <div className='flex gap-2'>
          <button
            className={btnClasses}
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
          >
            {'<<'}
          </button>
          <button
            className={btnClasses}
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          >
            {'<'}
          </button>
          <button
            className={btnClasses}
            onClick={() => nextPage()}
            disabled={!canNextPage}
          >
            {'>'}
          </button>
          <button
            className={btnClasses}
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            {'>>'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Datatable
