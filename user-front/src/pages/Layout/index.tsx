import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'

import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const Layout = () => {
  return (
    <Box width='100%' display='flex'>
      <Box
        display='flex'
        flexDirection='column'
        justifyContent='space-between'
        height='100vh'
        flexGrow={1}
      >
        <Box>
          <Navbar />
          <Outlet />
        </Box>
        {/* <Footer /> */}
      </Box>
    </Box>
  )
}

export default Layout
