'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const Dashboard = () => {
  const router = useRouter()

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo')!)

    if (!userInfo) router.push('/')
  }, [router])

  return <div>Dashboard</div>
}

export default Dashboard
