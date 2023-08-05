import axios from 'axios'
import { useEffect, useState } from 'react'

import CardComponent from '@/components/Card'
import { Box, Grid, Typography, useTheme, Button } from '@mui/material'
import { PlayArrow } from '@mui/icons-material'
import { tokens } from '@/theme'
import { BaseURLV1 } from '@/config/api'
import { UserState, userContextType } from '@/context/userContext'

const Dashboard = () => {
  const [products, setProducts] = useState([])
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
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
            src='	https://bazaar.ui-lib.com/assets/images/products/nike-black.png'
            alt='test'
            height='100%'
            style={{
              margin: 'auto',
              maxWidth: '100%',
            }}
          />
        </Box>
      </Box>
      {/* <Box>
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
      </Box> */}

      {/* Big Discount */}

      {/* -------- Content --------- */}

      {/* <Grid container spacing={4}>
        <Grid item xs={6}>
          Top Rating
        </Grid>

        <Grid item xs={6}>
          Featured Brands
        </Grid>
      </Grid> */}

      {/* Disini ada Poster */}

      {/* Disini Categories */}

      {/* -------- End Content --------- */}

      <Box height='90vh' display='flex' alignItems='center'></Box>

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
          {products.map((product: any) => (
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
