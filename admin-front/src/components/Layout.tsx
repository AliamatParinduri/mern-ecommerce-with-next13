import { ReactNode } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import Footer from './Footer'

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className='flex min-h-screen w-screen'>
      <Sidebar />
      <div className='flex flex-col justify-between grow-1 px-5 bg-light-500 dark:bg-dark-500 gap-2'>
        <div className='flex flex-col w-full gap-4 '>
          <Navbar />
          {children}
        </div>
        <Footer />
      </div>
    </main>
  )
}

export default Layout
