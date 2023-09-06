import { ReactNode } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Footer from './Footer'

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className='flex h-screen bg-light-500 dark:bg-dark-500'>
      <Sidebar />
      <div className='flex flex-col flex-grow overflow-y-auto px-2 md:px-3 lg:px-4 gap-4 transform transition duration-200 ease-in-out'>
        <Navbar />
        {children}
        <Footer />
      </div>
    </main>
  )
}

export default Layout
