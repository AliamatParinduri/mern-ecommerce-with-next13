import React from 'react'
import { FaFacebook, FaInstagram, FaGithub } from 'react-icons/fa'

const Footer = () => {
  return (
    <footer className='bg-light-500 dark:bg-inherit'>
      <div className='container flex flex-col items-center justify-between py-4 space-y-4 sm:space-y-0 sm:flex-row'>
        <p className='text-sm text-gray-600 dark:text-gray-300'>
          © Copyright {new Date().getFullYear()}, Made with{' '}
          <span className='MuiBox-root css-1y557pg'>❤️</span> by{' '}
          <a target='_blank' className='css-1los9e9' href='#'>
            Aliamat Parinduri
          </a>
        </p>

        <div className='flex -mx-2'>
          <a
            href='#'
            className='mx-2 text-gray-600 transition-colors duration-300 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400'
            aria-label='Instagram'
          >
            <FaInstagram />
          </a>

          <a
            href='#'
            className='mx-2 text-gray-600 transition-colors duration-300 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400'
            aria-label='Facebook'
          >
            <FaFacebook />
          </a>

          <a
            href='#'
            className='mx-2 text-gray-600 transition-colors duration-300 dark:text-gray-300 hover:text-blue-500 dark:hover:text-blue-400'
            aria-label='Github'
          >
            <FaGithub />
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
