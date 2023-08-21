import Loading from '@/assets/svg/Loading'
import ColorButton from '@/components/ColorButton'
import { ToastError, ToastSuccess } from '@/components/Toast'
import { BaseURLProduct, BaseURLV1 } from '@/config/api'
import { ProductsContextType, ProductsState } from '@/context/productContext'
import { UserState, userContextType } from '@/context/userContext'
import { tokens } from '@/theme'
import { formatRupiah } from '@/validations/shared'
import { Star } from '@mui/icons-material'
import {
  Box,
  Button,
  ButtonProps,
  CardMedia,
  Stack,
  Tab,
  Tabs,
  Typography,
  styled,
  useTheme,
} from '@mui/material'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const ProductDetails = () => {
  const [product, setProduct] = useState<any>()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState('')
  const [detailIndex, setDetailIndex] = useState(0)
  const [value, setValue] = useState(0)

  const { user, setUser }: userContextType = UserState()
  const { products }: ProductsContextType = ProductsState()
  const { id } = useParams()
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  const getProduct = async () => {
    try {
      setIsLoading(true)

      const { data } = await axios.get(`${BaseURLV1}/product/${id}`)

      setProduct(data.data)

      setSelectedImage(data.data.pic[0])
      setIsLoading(false)
    } catch (e: any) {
      setIsLoading(false)
      return false
    }
  }

  const handleAddToCart = async (detailsId: string) => {
    if (!user) {
      ToastError('Login first, if you want add product to cart')
    } else {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${user!.token}`,
          },
        }

        const { data } = await axios.put(
          `${BaseURLV1}/users/${user!._id}/addToCart`,
          { detailsId: detailsId, qty: 1 },
          config
        )

        const newUserCart = {
          ...user,
          cart: data.data.cart,
        }

        localStorage.setItem('userLogin', JSON.stringify(newUserCart))

        setUser({
          ...newUserCart,
        })

        ToastSuccess('Success Add to Cart')
      } catch (e: any) {
        return false
      }
    }
  }

  useEffect(() => {
    getProduct()
  }, [])

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    }
  }

  function CustomTabPanel(props: {
    children?: React.ReactNode
    index: number
    value: number
  }) {
    const { children, value, index, ...other } = props

    return (
      <div
        role='tabpanel'
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    )
  }

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  return (
    <Box p={2} display='flex' flexDirection='column' gap={2}>
      {isLoading && <Loading value='80' />}
      {!isLoading && !product && (
        <Typography gutterBottom variant='h5'>
          No Data
        </Typography>
      )}
      {!isLoading && product && (
        <Stack gap={2}>
          <Box
            display='flex'
            flexDirection={{ xs: 'column', md: 'row' }}
            gap={4}
          >
            <Box
              minWidth={{ xs: '100%', md: '35vw' }}
              maxWidth={{ xs: '100%', md: '35vw' }}
              bgcolor={colors.secondary[500]}
              p={2}
              sx={{ borderRadius: '8px' }}
            >
              <CardMedia
                crossOrigin='anonymous'
                component='img'
                height='425'
                image={product && `${BaseURLProduct}/${selectedImage}`}
                alt='Paella dish'
                sx={{
                  borderRadius: '8px',
                  backgroundRepeat: 'no-repeat',
                  objectFit: 'fill',
                }}
              />
              <Box display='flex' mt={2}>
                {product &&
                  product.pic.map((pic: any) => (
                    <CardMedia
                      onClick={() => setSelectedImage(pic)}
                      key={pic}
                      crossOrigin='anonymous'
                      component='img'
                      image={product && `${BaseURLProduct}/${pic}`}
                      alt='Paella dish'
                      sx={{
                        borderRadius: '8px',
                        margin: '.25rem',
                        cursor: 'pointer',
                        width: '50px',
                      }}
                    />
                  ))}
              </Box>
            </Box>
            <Stack flexGrow={1} mt={2} gap={1}>
              <Typography gutterBottom variant='headline' component='h1'>
                {product.nmProduct}
              </Typography>
              <Stack flexDirection={{ xs: 'row', md: 'column' }} gap={2}>
                <Box display='flex' gap={1}>
                  <Typography variant='h5'>Sold </Typography>
                  <Typography variant='h5'>
                    {product.details[detailIndex].totalOrder}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: { xs: 'flex', md: 'none' },
                  }}
                >
                  |
                </Box>
                <Box display='flex' gap={1}>
                  <Typography variant='h5'>Rated </Typography>
                  <Box display='flex' gap={1}>
                    <Star sx={{ color: '#FAAF00' }} />
                    <Typography variant='h5' ml={-0.9}>
                      {product.details[detailIndex].rating}
                    </Typography>
                  </Box>
                  <Typography variant='h5'>
                    ({product.details[detailIndex].totalRating} review)
                  </Typography>
                </Box>
              </Stack>
              <Box mt={2}>
                <Typography variant='h5'>Type</Typography>
                <Box display='flex' gap={1} mt={1}>
                  {product.details.map((detail: any, i: number) => {
                    return i === detailIndex ? (
                      <ColorButton
                        key={detail._id}
                        onClick={() => setDetailIndex(i)}
                      >
                        <Typography>{`${detail.color} - ${detail.size}`}</Typography>
                      </ColorButton>
                    ) : (
                      <Button
                        key={detail._id}
                        variant='contained'
                        color='secondary'
                        onClick={() => setDetailIndex(i)}
                      >
                        <Typography>{`${detail.color} - ${detail.size}`}</Typography>
                      </Button>
                    )
                  })}
                </Box>
              </Box>
              <Stack
                flexDirection={{ xs: 'row', md: 'column' }}
                alignItems={{ xs: 'center', md: 'start' }}
                mt={3}
                justifyContent='space-between'
              >
                <Typography variant='headline' component='h1' color='#787eff'>
                  {formatRupiah(product.details[detailIndex].price, 'Rp. ')}
                </Typography>
                <Typography variant='h6'>
                  Stock Available: {product.details[detailIndex].stock}
                </Typography>
              </Stack>
              <ColorButton
                onClick={() =>
                  handleAddToCart(product.details[detailIndex]._id)
                }
              >
                <Typography variant='headline' component='h3'>
                  Add To Cart
                </Typography>
              </ColorButton>
            </Stack>
          </Box>

          <Box
            bgcolor={colors.secondary[500]}
            p={2}
            sx={{ borderRadius: '8px' }}
          >
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label='basic tabs example'
                sx={{
                  '& button.Mui-selected': {
                    backgroundColor: '#787eff',
                    borderTopRightRadius: '5px',
                    borderTopLeftRadius: '5px',
                  },
                }}
              >
                <Tab label='Description' {...a11yProps(0)} />
                <Tab label='Reviews' {...a11yProps(1)} />
              </Tabs>
            </Box>
            <CustomTabPanel value={value} index={0}>
              <Typography variant='h5' ml={-0.9}>
                {product.description}
              </Typography>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              {product.details[detailIndex].totalRating < 1 ? (
                <Typography variant='h5' ml={-0.9}>
                  No Review
                </Typography>
              ) : (
                <Box>Review</Box>
              )}
            </CustomTabPanel>
          </Box>

          <Box p={2} sx={{ borderRadius: '8px' }}>
            <Typography variant='h5' ml={-0.9}>
              Product Relavant
            </Typography>
            {/* <Grid container spacing={4}>
            {products.map((product: any) => (
              <Grid item xs={4} md={3} key={product._id}>
                <CardComponent product={product} />
              </Grid>
            ))}
          </Grid> */}
          </Box>
        </Stack>
      )}
    </Box>
  )
}

export default ProductDetails
