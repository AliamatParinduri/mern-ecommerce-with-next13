import React, { ReactNode } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Footer from './Footer'

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className='flex min-h-screen overflow-hidden bg-light-500 dark:bg-dark-500'>
      <Sidebar />
      <div className='flex flex-col justify-between grow-1 px-5 w-full gap-2'>
        {/* navbar */}
        <div className='flex flex-col gap-2'>
          <Navbar />
          {children}
        </div>
        <Footer />
      </div>
    </main>
  )
}

export default Layout
