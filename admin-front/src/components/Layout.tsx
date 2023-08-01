import { ReactNode } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Footer from './Footer'

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className='flex min-h-screen w-screen'>
      <Sidebar />
      <div className='flex flex-col ml-0 md:ml-56 lg:ml-64 justify-between grow-1 px-2 md:px-3 lg:px-5 w-screen bg-light-500 dark:bg-dark-500 gap-2 '>
        <div className='flex flex-col w-[screen-1rem)] md:w-[calc(100vw-16rem)] lg:w-[calc(100vw-18.5rem)] gap-4 transform transition duration-200 ease-in-out'>
          <Navbar />
          {children}
        </div>
        <Footer />
      </div>
    </main>
  )
}

export default Layout
