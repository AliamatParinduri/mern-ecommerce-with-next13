import { ReactNode } from 'react'
import ThemeSwitcher from './ThemeSwitcher'
import Image from 'next/image'
import bgLeft from 'public/image/auth-left-shape.png'
import bgRight from 'public/image/auth-right-shape.png'

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main className='flex flex-col min-h-screen overflow-hidden bg-white dark:bg-dark-500'>
      <div className='flex justify-end w-full pt-8 -pb-8 px-20'>
        <ThemeSwitcher />
      </div>
      <div className='flex w-full mt-8'>
        <div className='min-h-screen hidden md:flex w-2/5 relative'>
          <Image src={bgLeft} alt='bg left' className='absolute top-20' />
        </div>
        <div className='min-h-screen flex items-center w-full justify-center my-4'>
          {children}
        </div>
        <div className='min-h-screen hidden md:flex w-2/5 relative'>
          <Image src={bgRight} alt='bg Right' className='absolute top-20' />
        </div>
      </div>
    </main>
  )
}

export default AuthLayout
