import { ReactNode, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

import ThemeSwitcher from './ThemeSwitcher'
import bgLeft from 'public/image/auth-left-shape.png'
import bgRight from 'public/image/auth-right-shape.png'
import { isUserLogin } from '@/validations/shared'
import { UserState, userContextType } from '@/context/userContext'

const AuthLayout = ({ children }: { children: ReactNode }) => {
  let { user }: userContextType = UserState()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      if (isUserLogin(user)) {
        router.push('/')
      }
    }
  }, [])

  return (
    <main className='flex flex-col min-h-screen overflow-hidden bg-white dark:bg-dark-500'>
      <div className='flex justify-end w-full pt-8 -pb-8 px-20'>
        <ThemeSwitcher />
      </div>
      <div className='flex w-full mt-8'>
        <div className='min-h-screen hidden md:flex w-2/5 relative'>
          <Image
            src={bgLeft}
            alt='bg left'
            className='absolute top-20'
            placeholder='blur'
            blurDataURL={'public/image/auth-left-shape.png'}
          />
        </div>
        <div className='min-h-screen flex items-center w-full justify-center my-4'>
          {children}
        </div>
        <div className='min-h-screen hidden md:flex w-2/5 relative'>
          <Image
            src={bgRight}
            alt='bg Right'
            className='absolute top-20'
            placeholder='blur'
            blurDataURL={'public/image/auth-right-shape.png'}
          />
        </div>
      </div>
    </main>
  )
}

export default AuthLayout
