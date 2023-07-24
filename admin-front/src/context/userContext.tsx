'use client'

import { userDTO } from '@/validations/shared'
import { useRouter } from 'next/navigation'
import { createContext, useContext, useEffect, useState } from 'react'

export type userContextType = {
  user?: userDTO
  setUser?: () => void
}

const UserContext = createContext({})

const UserProvider = (props: any) => {
  const [user, setUser] = useState()
  const router = useRouter()

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo')!)

    if (!userInfo) {
      router.push('/')
    } else {
      setUser({
        ...userInfo.data,
        token: userInfo.token,
      })
    }
  }, [router])

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
