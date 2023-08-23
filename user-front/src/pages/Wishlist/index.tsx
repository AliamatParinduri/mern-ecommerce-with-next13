/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios'
import { useState, useEffect } from 'react'
import { Box, Grid, Stack, Typography, useTheme } from '@mui/material'

import { BaseURLV1 } from '@/config/api'
import { UserState, userContextType } from '@/context/userContext'
import { tokens } from '@/theme'
import MenuUserInfo from '@/components/MenuUserInfo'
import Loading from '@/assets/svg/Loading'
import CardComponent from '@/components/Card'

const Wishlist = () => {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { user }: userContextType = UserState()
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  const getOrders = async () => {
    try {
      setIsLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user!.token}`,
        },
      }

      const { data } = await axios.get(
        `${BaseURLV1}/order?userId=${user!._id}`,
        config
      )

      setIsLoading(false)
      setOrders(data.data)
    } catch (e: any) {
      setIsLoading(false)
      return false
    }
  }

  useEffect(() => {
    getOrders()
  }, [user])

  return (
    <Stack p={2} flexDirection={{ sx: 'column', lg: 'row' }} gap={2}>
      <MenuUserInfo />
      <Stack flexGrow={1}>
        <Typography gutterBottom variant='h3' mb={2}>
          My Wishlist
        </Typography>
        <Box bgcolor={colors.secondary[500]} p={2} sx={{ borderRadius: '8px' }}>
          <Box>{isLoading && <Loading value='80' />}</Box>
          {!isLoading && orders.length <= 0 && (
            <Typography gutterBottom variant='h5'>
              No Data
            </Typography>
          )}
          {!isLoading && orders.length > 0 && (
            <Grid container spacing={4}>
              {user?.wishlist.map(({ product }: any) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
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
