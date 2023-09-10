/* eslint-disable @typescript-eslint/no-unused-vars */
import {  useEffect } from 'react'
import { Box, Grid, Stack, Typography, useTheme } from '@mui/material'

import { UserState, userContextType } from '@/context/userContext'
import { tokens } from '@/theme'
import MenuUserInfo from '@/components/MenuUserInfo'
import CardComponent from '@/components/Card'
import { ToastError } from '@/components/Toast'
import { useNavigate } from 'react-router-dom'

const Wishlist = () => {
  const { user, setUser }: userContextType = UserState()
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const navigate = useNavigate()

  useEffect(() => {
    const userLogin = localStorage.getItem('userLogin')

    if (!user && !userLogin) {
      setUser(null)
      ToastError('Your session has ended, Please login again')
      navigate('/login')
    }
  }, [user])

  return (
    <Stack p={2} flexDirection={{ sx: 'column', lg: 'row' }} gap={2}>
      <MenuUserInfo />
      <Stack flexGrow={1}>
        <Typography gutterBottom variant='h3' mb={2}>
          My Wishlist
        </Typography>
        <Box bgcolor={colors.secondary[500]} p={2} sx={{ borderRadius: '8px' }}>
          {user && user.wishlist.length <= 0 && (
            <Typography gutterBottom variant='h5'>
              No Data
            </Typography>
          )}
          {user && user.wishlist.length > 0 && (
            <Grid container spacing={4}>
              {user?.wishlist.map(({ product }: any) => (
                <Grid item xs={12} sm={6} md={4} key={product._id}>
                  <CardComponent product={product} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Stack>
    </Stack>
  )
}

export default Wishlist
