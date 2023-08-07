import axios from 'axios'
import {
  Box,
  Card,
  IconButton,
  CardMedia,
  CardContent,
  Typography,
  Checkbox,
} from '@mui/material'

import {
  Favorite,
  FavoriteBorder,
  ShoppingCartCheckoutOutlined,
} from '@mui/icons-material'
import { BaseURLProduct, BaseURLV1 } from '@/config/api'
import { UserState, userContextType } from '@/context/userContext'
import { sortPriceList } from '@/validations/shared'

type Props = {
  product: any
}

const CardComponent = ({ product }: Props) => {
  const { user, setUser }: userContextType = UserState()

  const handleWishlish = async (productId: string) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user!.token}`,
        },
      }

      const { data } = await axios.put(
        `${BaseURLV1}/users/${user!._id}/wishlist`,
        { product: productId },
        config
      )

      alert('success update wishlist')
    } catch (e: any) {
      return false
    }
  }

  const handleAddToCart = async (productId: string) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user!.token}`,
        },
      }

      const { data } = await axios.put(
        `${BaseURLV1}/users/${user!._id}/addToCart`,
        { product: productId, qty: 1 },
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

  return (
    <Card sx={{ maxWidth: 345 }}>
      <Box position='relative'>
        <CardMedia
          crossOrigin='anonymous'
          component='img'
          height='194'
          image={`${BaseURLProduct}/${product.pic[0]}`}
          alt='Paella dish'
        />
        <Box
          p={1}
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            zIndex: 10,
          }}
        >
          <Checkbox
            icon={
              <FavoriteBorder
                sx={{
                  color: 'red',
                  fontWeight: 'bold',
                  fontSize: '26px',
                }}
              />
            }
            checked={
              user!.wishlist.findIndex(
                (wishlist: { product: string }) =>
                  wishlist.product === product._id
              ) >= 0
                ? true
                : false
            }
            checkedIcon={<Favorite sx={{ color: 'red', fontSize: '26px' }} />}
            onClick={() => handleWishlish(product._id)}
          />
        </Box>
      </Box>
      <CardContent>
        <Typography gutterBottom variant='headline' component='h2'>
          {product.nmProduct}
        </Typography>
        <Typography mb={2} component='p'>
          {`${product.category.category} / ${product.subCategory}`}
        </Typography>
        <Box
          display='flex'
          justifyContent='space-between'
          alignItems='center'
          justifyItems='center'
        >
          <Typography gutterBottom component='h4'>
            {sortPriceList(product.details)}
          </Typography>
          <IconButton onClick={() => handleAddToCart(product._id)}>
            <ShoppingCartCheckoutOutlined />
          </IconButton>
        </Box>
      </CardContent>
    </Card>
  )
}

export default CardComponent
