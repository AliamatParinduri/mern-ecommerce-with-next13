import Loading from '@/assets/svg/Loading'
import ColorButton from '@/components/ColorButton'
import { ToastError, ToastSuccess } from '@/components/Toast'
import { BaseURLProduct, BaseURLUsers, BaseURLV1 } from '@/config/api'
import { UserState, userContextType } from '@/context/userContext'
import { tokens } from '@/theme'
import {
  ProductsDTO,
  RatingsDTO,
  formatRupiah,
  isUserLogin,
} from '@/validations/shared'
import { Star } from '@mui/icons-material'
import {
  Box,
  Button,
  CardMedia,
  Grid,
  Rating,
  Stack,
  Tab,
  Tabs,
  Typography,
  useTheme,
} from '@mui/material'
import parse from 'html-react-parser'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import CardComponent from '@/components/Card'

const ProductDetails = () => {
  const [product, setProduct] = useState<any>()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState('')
  const [detailIndex, setDetailIndex] = useState(0)
  const [ratings, setRatings] = useState<RatingsDTO[]>()
  const [productsRelevant, setProductsRelevant] = useState<ProductsDTO[]>([])
  const [value, setValue] = useState(0)

  const { setUser }: userContextType = UserState()
  const { id } = useParams()
  const theme = useTheme()
  const navigate = useNavigate()
  const colors = tokens(theme.palette.mode)
  let { user }: userContextType = UserState()

  const getProduct = async () => {
    try {
      setIsLoading(true)

      const { data } = await axios.get(`${BaseURLV1}/product/${id}`)

      setProduct(data.data)
      setSelectedImage(data.data.pic[0])

      setIsLoading(false)
    } catch (e: any) {
      setIsLoading(false)
      const description = e.response?.data?.description
      ToastError(description ? description : 'Failed get Product Data')
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

        ToastSuccess('Success Add Product to Cart')
      } catch (e: any) {
        if (
          e.message ===
            `Cannot read properties of undefined (reading 'token')` ||
          e.response?.data?.message === 'jwt expired' ||
          e.response?.data?.message === 'invalid signature'
        ) {
          localStorage.removeItem('userLogin')
          setUser(null)
          ToastError('Your session has ended, Please login again')
          navigate('/login')
        } else {
          ToastError(e.response?.data?.description)
        }
        return false
      }
    }
  }

  useEffect(() => {
    if (isUserLogin(user)) {
      user = isUserLogin(user)
    }
  }, [user])

  useEffect(() => {
    getProduct()
  }, [id])

  useEffect(() => {
    if (product) {
      getProductsRelevant(product.category._id)
      getProductReviews(detailIndex, product)
    }
  }, [product])

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

  const getProductsRelevant = async (categoryId: string) => {
    try {
      const { data } = await axios.get(
        `${BaseURLV1}/product?categories=${categoryId}`
      )

      setProductsRelevant(data.data.products)
    } catch (e: any) {
      const description = e.response?.data?.description
      ToastError(description ? description : 'Failed get Products Relevant')
      return false
    }
  }

  const getProductReviews = async (i: number, product: any) => {
    setDetailIndex(i)

    try {
      const { data } = await axios.get(
        `${BaseURLV1}/rating?detailsId=${product.details[i]._id}`
      )

      setRatings(data.data)
    } catch (e: any) {
      const description = e.response?.data?.description
      ToastError(description ? description : 'Failed get Products Ratings')
      return false
    }
  }

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
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
              <Typography
                gutterBottom
                variant='h3'
                fontWeight='bold'
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: '2',
                  WebkitBoxOrient: 'vertical',
                }}
              >
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
                        onClick={() => getProductReviews(i, product)}
                      >
                        <Typography>{`${detail.color} - ${detail.size}`}</Typography>
                      </ColorButton>
                    ) : (
                      <Button
                        key={detail._id}
                        variant='contained'
                        color='secondary'
                        onClick={() => getProductReviews(i, product)}
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
                <Typography variant='h3' fontWeight='bold' color='#787eff'>
                  {formatRupiah(product.details[detailIndex].price, 'Rp. ')}
                </Typography>
                <Typography variant='h6'>
                  Stock Available: {product.details[detailIndex].stock}
                </Typography>
              </Stack>
              {user && (
                <ColorButton
                  onClick={() =>
                    handleAddToCart(product.details[detailIndex]._id)
                  }
                >
                  <Typography variant='h6' fontWeight='bold'>
                    Add To Cart
                  </Typography>
                </ColorButton>
              )}
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
              <Box>{parse(product.description)} </Box>
            </CustomTabPanel>
            <CustomTabPanel value={value} index={1}>
              {product.details[detailIndex].totalRating < 1 ? (
                <Typography variant='h5' ml={-0.9}>
                  No Review
                </Typography>
              ) : (
                <Box>
                  {ratings &&
                    ratings.map((rating) => {
                      return (
                        <Stack key={rating._id} mb={2}>
                          <Box display='flex' gap={1} alignItems='flex-start'>
                            <CardMedia
                              crossOrigin='anonymous'
                              component='img'
                              image={
                                product &&
                                `${BaseURLUsers}/${rating!.user!.userPic}`
                              }
                              alt='Paella dish'
                              sx={{
                                borderRadius: '50%',
                                margin: '.25rem',
                                cursor: 'pointer',
                                width: '40px',
                                height: '40px',
                              }}
                            />
                            <Stack>
                              <Typography variant='h6'>
                                {rating!.user!.fullName}
                              </Typography>
                              <Rating
                                name='half-rating-read'
                                defaultValue={Number(rating.rating)}
                                precision={0.1}
                                readOnly
                                size='small'
                              />
                            </Stack>
                          </Box>
                          <Typography variant='subtitle2' fontWeight='medium'>
                            {rating.komentar}
                          </Typography>
                        </Stack>
                      )
                    })}
                </Box>
              )}
            </CustomTabPanel>
          </Box>

          <Stack p={2} sx={{ borderRadius: '8px' }} gap={1}>
            <Typography variant='h5'>Product Relavant</Typography>
            <Grid container spacing={4}>
              {productsRelevant.map((product: any) => {
                return (
                  <Grid item xs={4} md={3} key={product._id}>
                    <CardComponent product={product} />
                  </Grid>
                )
              })}
            </Grid>
          </Stack>
        </Stack>
      )}
    </Box>
  )
}

export default ProductDetails
