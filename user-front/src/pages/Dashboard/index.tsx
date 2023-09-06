import axios from 'axios'
import { useEffect, useState } from 'react'

import CardComponent from '@/components/Card'
import { Box, Grid, Typography, useTheme, Button, Stack } from '@mui/material'
import { PlayArrow } from '@mui/icons-material'
import { tokens } from '@/theme'
import Landing1 from '@/assets/img/Landing1.png'
import Landing2 from '@/assets/img/Landing2.png'
import Landing3 from '@/assets/img/Landing3.png'
import Loading from '@/assets/svg/Loading'
import { BaseURLV1 } from '@/config/api'
import { ProductsContextType, ProductsState } from '@/context/productContext'
import { useNavigate } from 'react-router-dom'
import { ToastError } from '@/components/Toast'

const Dashboard = () => {
  const theme = useTheme()
  const [isLoading, setIsLoading] = useState(false)
  const colors = tokens(theme.palette.mode)
  const { products, setProducts }: ProductsContextType = ProductsState()
  const navigate = useNavigate()

  const getproducts = async () => {
    try {
      setIsLoading(true)

      const { data } = await axios.get(`${BaseURLV1}/product`)
      setProducts(data.data.products)
      setIsLoading(false)
    } catch (e: any) {
      setIsLoading(false)
      const description = e.response?.data?.description
      ToastError(description ? description : 'Failed get Products Data')
      return false
    }
  }

  useEffect(() => {
    getproducts()
  }, [])

  return (
    <Stack py={2} px={4} gap={2}>
      <Box
        height={{ xs: '70vh', sm: '85vh', md: '90vh' }}
        display='flex'
        alignItems='center'
        bgcolor={colors.secondary[500]}
        my={-2}
        mx={-4}
        mb={0.2}
        flexDirection={{ xs: 'column-reverse', md: 'row' }}
      >
        <Box
          display='flex'
          flexDirection='column'
          py={2}
          px={4}
          textAlign={{ xs: 'center', md: 'left' }}
          minWidth={{ xs: '100%', md: '50%' }}
          maxWidth={{ xs: '100%', md: '50%' }}
          gap={3}
        >
          <Typography
            variant='h1'
            sx={{ fontSize: { xs: '25px', sm: '35px', md: '50px' } }}
          >
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
            onClick={() => navigate('/all-product')}
          >
            View All Products
          </Button>
        </Box>
        <Box textAlign='center'>
          <Box
            component='img'
            sx={{
              maxWidth: { xs: '50%', sm: '75%', md: '100%' },
            }}
            alt='The house from the offer.'
            src={Landing1}
          />
        </Box>
      </Box>
      <Stack>
        <Box display='flex' justifyContent='space-between' py={1}>
          <Typography gutterBottom variant='headline' component='h1'>
            New Arrival {isLoading}
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
            onClick={() => navigate('/all-product')}
          >
            View All <PlayArrow />
          </Typography>
        </Box>
        {isLoading && <Loading value='80' />}
        {!isLoading && products.length <= 0 && (
          <Typography gutterBottom variant='h5'>
            No Data
          </Typography>
        )}
        {!isLoading && products.length > 0 && (
          <Grid container spacing={4}>
            {products.map((product: any, i: number) => {
              if (i < 4) {
                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                    <CardComponent product={product} />
                  </Grid>
                )
              }
            })}
          </Grid>
        )}
      </Stack>

      <Box
        height='60vh'
        alignItems='center'
        my={3}
        gap={4}
        flexGrow={1}
        sx={{
          display: { xs: 'none', md: 'flex' },
        }}
      >
        <Box
          component='img'
          sx={{
            maxHeight: { md: '27vw', lg: '100%' },
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
            maxHeight: { md: '27vw', lg: '345px' },
          }}
          alt='The house from the offer.'
          src={Landing2}
        />
      </Box>

      <Stack>
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
            onClick={() => navigate('/all-product')}
          >
            View All <PlayArrow />
          </Typography>
        </Box>
        {isLoading && <Loading value='80' />}
        {!isLoading && (products.length <= 0 || products.length <= 4) && (
          <Typography gutterBottom variant='h5'>
            No Data
          </Typography>
        )}
        {!isLoading && products.length > 4 && (
          <Grid container spacing={4}>
            {products!.map((product: any, i: number) => {
              if (i > 3) {
                return (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                    <CardComponent product={product} />
                  </Grid>
                )
              }
            })}
          </Grid>
        )}
      </Stack>
    </Stack>
  )
}

export default Dashboard
