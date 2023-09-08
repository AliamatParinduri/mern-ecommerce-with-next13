'use client'

import { userLogin } from '@/validations/shared'
import { usePathname, useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'

export type userContextType = {
  user?: userLogin
  setUser?: any
}

const UserContext = createContext({})

const UserProvider = (props: any) => {
  const [user, setUser] = useState()
  const router = useRouter()
  const pathname = usePathname()

  const userLogin = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo')!)
    if (!userInfo) {
      // router.push('/login')
    } else {
      setUser({ ...userInfo })
    }
  }

  useEffect(() => {
    userLogin()
  }, [pathname])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {props.children}
    </UserContext.Provider>
  )
}

export const UserState = () => {
  return useContext(UserContext)
}

export default UserProvider
