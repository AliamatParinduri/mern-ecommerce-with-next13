import axios from 'axios'
import { useEffect, useState } from 'react'

import CardComponent from '@/components/Card'
import { Box, Grid, Typography, useTheme, Button } from '@mui/material'
import { PlayArrow } from '@mui/icons-material'
import { tokens } from '@/theme'
import Landing1 from '@/assets/img/Landing1.png'
import Landing2 from '@/assets/img/Landing2.png'
import Landing3 from '@/assets/img/Landing3.png'
import { BaseURLV1 } from '@/config/api'
import { UserState, userContextType } from '@/context/userContext'
import { ProductsContextType, ProductsState } from '@/context/productContext'

const Dashboard = () => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const { products, setProducts }: ProductsContextType = ProductsState()
  const { user }: userContextType = UserState()

  const getproducts = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user!.token}`,
        },
      }

      const { data } = await axios.get(`${BaseURLV1}/product`, config)
      setProducts(data.data.products)
    } catch (e: any) {
      return false
    }
  }

  useEffect(() => {
    getproducts()
  }, [user])

  return (
    <Box py={2} px={4}>
      <Box
        height='90vh'
        display='flex'
        alignItems='center'
        bgcolor={colors.secondary[500]}
        my={-2}
        mx={-4}
        mb={1}
      >
        <Box
          display='flex'
          flexDirection='column'
          py={2}
          px={4}
          minWidth='50%'
          maxWidth='50%'
          gap={3}
        >
          <Typography variant='h1' sx={{ fontSize: '50px' }}>
            50% Off For Your First Shopping
          </Typography>
          <Typography variant='subtitle1'>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis
            lobortis consequat eu, quam etiam at quis ut convalliss.
          </Typography>
          <Button
            variant='contained'
            sx={{
              paddingY: 1,
              paddingX: 2,
              maxWidth: 'inherit',
            }}
          >
            Contained
          </Button>
        </Box>
        <Box>
          <img
            src={Landing1}
            alt='test'
            height='100%'
            style={{
              margin: 'auto',
              maxWidth: '100%',
            }}
          />
        </Box>
      </Box>
      <Box>
        <Box display='flex' justifyContent='space-between' py={1}>
          <Typography gutterBottom variant='headline' component='h1'>
            New Arrival
          </Typography>
          <Typography
            gutterBottom
            component='a'
            href='#'
            color='inherit'
            display='flex'
            justifyItems='center'
            gap={1}
            justifyContent='center'
            sx={{ textDecoration: 'none' }}
          >
            View All <PlayArrow />
          </Typography>
        </Box>
        <Grid container spacing={4}>
          {products.map((product: any) => (
            <Grid item xs={4} md={3} key={product._id}>
              <CardComponent product={product} />
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box
        height='60vh'
        display='flex'
        alignItems='center'
        my={3}
        gap={4}
        flexGrow={1}
      >
        <Box
          component='img'
          sx={{
            maxWidth: '100%',
            objectFit: 'fill',
            bgcolor: 'red',
          }}
          alt='The house from the offer.'
          src={Landing3}
        />
        <Box
          flexGrow={1}
          bgcolor='red'
          component='img'
          sx={{
            maxHeight: '345px',
          }}
          alt='The house from the offer.'
          src={Landing2}
        />
      </Box>

      <Box>
        <Box display='flex' justifyContent='space-between' py={1}>
          <Typography gutterBottom variant='headline' component='h1'>
            More For You
          </Typography>
          <Typography
            gutterBottom
            component='a'
            href='#'
            color='inherit'
            display='flex'
            justifyItems='center'
            gap={1}
            justifyContent='center'
            sx={{ textDecoration: 'none' }}
          >
            View All <PlayArrow />
          </Typography>
        </Box>
        <Grid container spacing={4}>
          {products!.map((product: any) => (
            <Grid item xs={4} md={3} key={product._id}>
              <CardComponent product={product} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  )
}

export default Dashboard
