import { useEffect, useState } from 'react'
import { BaseURLProduct, BaseURLV1 } from '@/config/api'
import { UserState, userContextType } from '@/context/userContext'
import {
  Box,
  Button,
  CardMedia,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import axios from 'axios'
import { formatRupiah } from '@/validations/shared'
import { HighlightOff } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { tokens } from '@/theme'
import { ToastError, ToastSuccess } from '@/components/Toast'

const Cart = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { user, setUser }: userContextType = UserState()
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const navigate = useNavigate()
  let totalOrder = 0
  let subTotal = 0
  let totalWeight = 0

  useEffect(() => {
    if (user && user.cart.length < 1) {
      ToastError('Cart Product empty!')
      navigate(-1)
    }
  }, [user])

  user &&
    user.cart.map((cart: any) => {
      {
        totalWeight += parseInt(cart.details.weight) * parseInt(cart.qty)
        subTotal += parseInt(cart.qty)
        totalOrder += parseInt(cart.subTotal)
      }
    })

  const handleUpdateCart = async (detailsId: string, qty: number) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user!.token}`,
        },
      }

      const { data } = await axios.put(
        `${BaseURLV1}/users/${user!._id}/addToCart`,
        { detailsId, qty },
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
    } catch (e: any) {
      return false
    }
  }

  const handleDeleteCart = async (detailsId: string) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user!.token}`,
        },
      }

      const { data } = await axios.put(
        `${BaseURLV1}/users/${user!._id}/removeFromCart`,
        { detailsId },
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

      ToastSuccess('Success delete cart')
    } catch (e: any) {
      return false
    }
  }

  const handleCheckout = async () => {
    const userOrders = {
      products: user?.cart,
      discount: 0,
      totalPriceProduct: totalOrder,
      totalWeight,
      subtotal: subTotal + ' Item',
    }

    navigate('/shipping', {
      state: {
        orders: userOrders,
      },
    })
  }

  return (
    <Stack
      p={2}
      flexDirection={{ xs: 'column', md: 'row' }}
      justifyContent='space-around'
      gap={2}
    >
      <Box sx={{ width: { xs: '100%', md: 1 / 2 } }}>
        <Typography gutterBottom variant='h3' fontWeight='bold' mb={2}>
          Shopping Cart
        </Typography>
        {user &&
          user.cart.map((cart: any) => (
            <Box
              key={cart._id}
              bgcolor={colors.secondary[500]}
              width='100%'
              p={2}
              mt={1}
              display='flex'
              alignItems='flex-start'
              justifyContent='space-between'
              borderRadius='8px'
            >
              <Box display='flex' gap={2}>
                <CardMedia
                  crossOrigin='anonymous'
                  component='img'
                  image={`${BaseURLProduct}/${cart.product.pic[0]}`}
                  alt='Paella dish'
                  sx={{
                    borderRadius: '8px',
                    margin: '.25rem',
                    cursor: 'pointer',
                    backgroundRepeat: 'no-repeat',
                    objectFit: 'fill',
                    width: '100px',
                  }}
                />
                <Stack>
                  <Typography
                    gutterBottom
                    variant='h5'
                    fontWeight='bold'
                    sx={{
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: '1',
                      WebkitBoxOrient: 'vertical',
                    }}
                  >
                    {cart.product.nmProduct}
                  </Typography>
                  <Typography gutterBottom variant='subtitle1' component='h5'>
                    type: <b>{cart.details.size}</b>
                  </Typography>
                  <Typography gutterBottom variant='subtitle1' component='h5'>
                    <span>
                      {formatRupiah(cart.details.price, 'Rp. ')} x {cart.qty}{' '}
                    </span>{' '}
                    <span
                      style={{
                        marginLeft: '8px',
                        color: '#787eff',
                        fontWeight: 'bold',
                      }}
                    >
                      {formatRupiah(cart.subTotal, 'Rp. ')}
                    </span>
                  </Typography>
                  <Box
                    display='flex'
                    alignItems='center'
                    textAlign='center'
                    gap={1}
                  >
                    <Button
                      onClick={() => handleUpdateCart(cart.details._id, -1)}
                      disabled={cart.qty <= 1}
                      color='primary'
                      sx={{
                        width: '5px',
                        backgroundColor: '#787eff',
                        '&:hover': {
                          backgroundColor: '#484c99',
                        },
                      }}
                    >
                      -
                    </Button>
                    <Typography gutterBottom variant='subtitle1' component='h5'>
                      {cart.qty}
                    </Typography>
                    <Button
                      onClick={() => handleUpdateCart(cart.details._id, 1)}
                      sx={{
                        width: '5px',
                        backgroundColor: '#787eff',
                        '&:hover': {
                          backgroundColor: '#484c99',
                        },
                      }}
                    >
                      +
                    </Button>
                  </Box>
                </Stack>
              </Box>
              <IconButton onClick={() => handleDeleteCart(cart.details._id)}>
                <HighlightOff />
              </IconButton>
            </Box>
          ))}
      </Box>
      <Box sx={{ width: { xs: '100%', md: 1 / 3 } }}>
        <Typography gutterBottom variant='h3' fontWeight='bold' mb={2}>
          Order Information
        </Typography>
        <Stack
          bgcolor={colors.secondary[500]}
          width='100%'
          p={2}
          mt={1}
          gap={3}
          display='flex'
          alignItems='flex-start'
          justifyContent='space-between'
          borderRadius='8px'
        >
          <table cellPadding={4} style={{ fontSize: '16px' }}>
            <tr>
              <td>Sub Total</td>
              <td>:</td>
              <td style={{ fontWeight: 'bold' }}>{`${subTotal} Item (${(
                totalWeight / 1000
              ).toFixed(2)} KG)`}</td>
            </tr>
            <tr>
              <td>Order Total</td>
              <td>:</td>
              <td style={{ fontWeight: 'bold' }}>
                {formatRupiah(totalOrder.toString(), 'Rp. ')}
              </td>
            </tr>
          </table>

          <Button
            fullWidth
            onClick={handleCheckout}
            type='button'
            variant='contained'
          >
            {isLoading ? 'loading...' : 'Checkout'}
          </Button>
        </Stack>
      </Box>
    </Stack>
  )
}

export default Cart
