/* eslint-disable @next/next/no-sync-scripts */
import 'react-toastify/dist/ReactToastify.css'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import './app.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ToastContainer } from 'react-toastify'

import './globals.css'
import Providers from './providers'
import UserProvider from '@/context/userContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'E-commerce Aliamat Parinduri',
  description: 'E-commerce Aliamat Parinduri',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <UserProvider>
          <Providers>{children}</Providers>
          <ToastContainer
            position='top-right'
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </UserProvider>
      </body>
    </html>
  )
}
