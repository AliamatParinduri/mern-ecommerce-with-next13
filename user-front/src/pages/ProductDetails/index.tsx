import { BaseURLProduct, BaseURLV1 } from '@/config/api'
import { ProductsContextType, ProductsState } from '@/context/productContext'
import { UserState, userContextType } from '@/context/userContext'
import { tokens } from '@/theme'
import { ProductsDTO, formatRupiah } from '@/validations/shared'
import { Star } from '@mui/icons-material'
import {
  Box,
  Button,
  ButtonProps,
  CardMedia,
  Stack,
  Typography,
  styled,
  useTheme,
} from '@mui/material'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const ProductDetails = () => {
  const [product, setProduct] = useState<any>()
  const [selectedImage, setSelectedImage] = useState('')
  const [detailIndex, setDetailIndex] = useState(0)

  const { user, setUser }: userContextType = UserState()
  const { products }: ProductsContextType = ProductsState()
  const { id } = useParams()
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  const ColorButton = styled(Button)<ButtonProps>(({ theme }) => ({
    // color: theme.palette.getContrastText(purple[500]),
    backgroundColor: '#787eff',
    '&:hover': {
      backgroundColor: '#484c99',
    },
  }))

  const getProducts = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user!.token}`,
        },
      }

      const { data } = await axios.get(`${BaseURLV1}/product/${id}`, config)

      setProduct(data.data)

      setSelectedImage(data.data.pic[0])
    } catch (e: any) {
      return false
    }
  }

  const handleAddToCart = async (detailsId: string) => {
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

      alert('success Add to Cart')
    } catch (e: any) {
      return false
    }
  }

  useEffect(() => {
    getProducts()
  }, [user])

  return (
    <Box p={2} display='flex' flexDirection='column' gap={2}>
      {product && (
        <Box display='flex' gap={4}>
          <Box
            minWidth='35vw'
            maxWidth='35vw'
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
            <Box display='flex' gap={1}>
              <Typography variant='h5'>Rated :</Typography>
              <Box display='flex' gap={1}>
                <Star sx={{ color: '#FAAF00' }} />
                <Typography variant='h5' ml={-1}>
                  4.6
                </Typography>
              </Box>
              <Typography variant='h5'>(80 ulasan)</Typography>
            </Box>
            <Box mt={2}>
              <Typography variant='h5'>Type</Typography>
              <Box display='flex' gap={1} mt={1}>
                {product.details.map((detail: any, i: number) => {
                  return i === detailIndex ? (
                    <ColorButton key={i} onClick={() => setDetailIndex(i)}>
                      <Typography>{`${detail.color} - ${detail.size}`}</Typography>
                    </ColorButton>
                  ) : (
                    <Button
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
            <Typography
              variant='headline'
              component='h1'
              mt={3}
              color='#787eff'
            >
              {formatRupiah(product.details[detailIndex].price, 'Rp. ')}
            </Typography>
            <Typography variant='h6'>
              Stock Available: {product.details[detailIndex].stock}
            </Typography>
            <ColorButton
              onClick={() => handleAddToCart(product.details[detailIndex]._id)}
            >
              <Typography>Add To Cart</Typography>
            </ColorButton>
          </Stack>
        </Box>
      )}
    </Box>
  )
}

export default ProductDetails
