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
import { countTotalOrder, sortPriceList } from '@/validations/shared'
import { useNavigate } from 'react-router-dom'
import { ToastError, ToastSuccess } from './Toast'

type Props = {
  product: any
}

const CardComponent = ({ product }: Props) => {
  const { user, setUser }: userContextType = UserState()
  const navigate = useNavigate()

  const handleWishlist = async (e: any, productId: string) => {
    e.stopPropagation()

    const isAddToWishlist = e.target.checked

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

      let newWishlist
      if (isAddToWishlist) {
        newWishlist = [
          ...user!.wishlist,
          data.data.wishlist[data.data.wishlist.length - 1],
        ]
      } else {
        newWishlist = [
          ...user!.wishlist.filter(
            (wishlist: any) =>
              String(wishlist.product._id) !== String(productId)
          ),
        ]
      }

      const newUserWishlist = {
        ...user,
        wishlist: newWishlist,
      }

      localStorage.setItem('userLogin', JSON.stringify(newUserWishlist))

      setUser({
        ...newUserWishlist,
      })

      ToastSuccess(
        `Success ${isAddToWishlist ? 'add' : 'remove'} product ${
          isAddToWishlist ? 'to' : 'from'
        } Wishlist`
      )
    } catch (e: any) {
      const description = e.response?.data?.description
      ToastError(description ? description : 'Failed update Wishlist')
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
          {user && (
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
                user &&
                user!.wishlist.findIndex(
                  (wishlist: any) => wishlist.product._id === product._id
                ) >= 0
                  ? true
                  : false
              }
              checkedIcon={<Favorite sx={{ color: 'red', fontSize: '26px' }} />}
              onClick={(e) => handleWishlist(e, product._id)}
            />
          )}
        </Box>
      </Box>
      <CardContent sx={{ width: '100%' }}>
        <Typography
          gutterBottom
          variant='h5'
          sx={{
            fontWeight: 'bold',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: '2',
            WebkitBoxOrient: 'vertical',
          }}
        >
          {product.nmProduct}
        </Typography>
        <Typography mb={1} variant='subtitle2'>
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
            {'Sold ' + countTotalOrder(product.details)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default CardComponent
