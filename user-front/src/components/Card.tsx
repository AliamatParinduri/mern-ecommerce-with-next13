import axios from 'axios'
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Checkbox,
} from '@mui/material'

import { Favorite, FavoriteBorder } from '@mui/icons-material'
import { BaseURLProduct, BaseURLV1 } from '@/config/api'
import { UserState, userContextType } from '@/context/userContext'
import { sortPriceList } from '@/validations/shared'
import { useNavigate } from 'react-router-dom'

type Props = {
  product: any
}

const CardComponent = ({ product }: Props) => {
  const { user, setUser }: userContextType = UserState()
  const navigate = useNavigate()

  const handleWishlish = async (e: any, productId: string) => {
    e.stopPropagation()

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

      const newUserWishlist = {
        ...user,
        wishlist: data.data.wishlist,
      }

      localStorage.setItem('userLogin', JSON.stringify(newUserWishlist))

      setUser({
        ...newUserWishlist,
      })

      alert('success update wishlist')
    } catch (e: any) {
      return false
    }
  }

  return (
    <Card
      sx={{ maxWidth: 345, cursor: 'pointer' }}
      onClick={() => navigate(`/product/${product._id}/details`)}
    >
      <Box position='relative'>
        <CardMedia
          crossOrigin='anonymous'
          component='img'
          height='194'
          image={`${BaseURLProduct}/${product.pic[0]}`}
          alt='Paella dish'
          sx={{
            backgroundRepeat: 'no-repeat',
            objectFit: 'contain',
            background: 'white',
          }}
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
            onClick={(e) => handleWishlish(e, product._id)}
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
          <Typography gutterBottom component='h4' fontWeight='bold'>
            {sortPriceList(product.details)}
          </Typography>
          <Typography gutterBottom component='h4'>
            Terjual 0
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default CardComponent
