'use client'
import { Fragment, useEffect, useState } from 'react'
import { MdOutlineDarkMode, MdOutlineLightMode } from 'react-icons/md'
import { useTheme } from 'next-themes'

const ThemeSwitcher = ({ size = 32 }: { size?: number }) => {
  const [userMode, setUserMode] = useState<any>('')
  const [systemMode, setSystemMode] = useState<any>('')
  const { theme = userMode, setTheme } = useTheme()

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (typeof window === 'object') {
      setUserMode(localStorage.getItem('theme'))
      setSystemMode(window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <Fragment>
      <MdOutlineLightMode
        size={size}
        className={`${
          theme === 'light' || (theme === 'system' && systemMode === false)
            ? 'hidden'
            : ''
        } text-black cursor-pointer dark:text-white `}
        onClick={() => {
          localStorage.setItem('theme', 'light')
          return setTheme('light')
        }}
      />
      <MdOutlineDarkMode
        size={size}
        className={`${
          theme === 'dark' || (theme === 'system' && systemMode === true)
            ? 'hidden'
            : ''
        } text-black cursor-pointer dark:text-white`}
        onClick={() => {
          localStorage.setItem('theme', 'dark')
          setTheme('dark')
        }}
      />
    </Fragment>
  )
}

export default ThemeSwitcher
