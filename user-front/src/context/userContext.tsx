'use client'

import { userLogin } from '@/validations/shared'
import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export type userContextType = {
  user?: userLogin
  setUser?: any
}

const UserContext = createContext({})

const UserProvider = (props: any) => {
  const [user, setUser] = useState()
  const navigate = useNavigate()

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
