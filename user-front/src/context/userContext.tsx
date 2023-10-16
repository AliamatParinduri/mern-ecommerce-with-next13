'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export type userContextType = {
  user?: any
  setUser?: any
}

const UserContext = createContext({})

const UserProvider = ({ children }: any) => {
  const [user, setUser] = useState()
  const navigate = useNavigate()

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userLogin')!)
    if (!userInfo) {
      // navigate('/login')
    } else {
      setUser({ ...userInfo })
    }
  }, [navigate])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

export const UserState = () => {
  return useContext(UserContext)
}

export default UserProvider
