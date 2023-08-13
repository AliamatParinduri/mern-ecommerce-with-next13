import { useEffect, useState } from 'react'
import { BaseURLProduct, BaseURLV1 } from '@/config/api'
import { UserState, userContextType } from '@/context/userContext'
import {
  Box,
  Button,
  CardMedia,
  IconButton,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import axios from 'axios'
import { formatRupiah } from '@/validations/shared'
import { HighlightOff } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { tokens } from '@/theme'

const Cart = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [address, setAddress]: any = useState({})
  const [kecamatan, setKecamatan] = useState('')
  const [kabKot, setKabKot] = useState('')
  const [provinsi, setProvinsi] = useState('')
  const [fullAddress, setFullAddress] = useState('')
  const { user, setUser }: userContextType = UserState()
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const navigate = useNavigate()
  let orderTotal = 0

  const getAddress = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user!.token}`,
        },
      }

      const { data } = await axios.get(
        `${BaseURLV1}/address?isPrimary=true`,
        config
      )

      if (data.data.length > 0) {
        setAddress(data.data[0])
        setKecamatan(data.data[0].kecamatan)
        setKabKot(data.data[0].kabKot)
        setProvinsi(data.data[0].provinisi)
        setFullAddress(data.data[0].fullAddress)
      }
    } catch (e: any) {
      return false
    }
  }

  useEffect(() => {
    getAddress()
  }, [user])
  user && user.cart.map((cart: any) => (orderTotal += parseInt(cart.subTotal)))

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

      alert('success delete cart')
    } catch (e: any) {
      return false
    }
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()

    setIsLoading(true)
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user!.token}`,
        },
      }

      if (Object.keys(address).length < 1) {
        const payload = {
          userId: user!._id,
          fullAddress,
          kecamatan,
          kabKot,
          provinsi,
          isPrimary: true,
        }

        const { data } = await axios.post(
          `${BaseURLV1}/address`,
          payload,
          config
        )
        setAddress(data.data)
      }

      const products = user?.cart.map((cart: any) => {
        return {
          product: cart.product._id,
          details: cart.details,
          subTotal: cart.subTotal,
          qty: cart.qty,
        }
      })

      const payload = {
        userId: user!._id,
        address: address._id,
        products,
        discount: 0,
        ongkir: 0,
        totalPrice: orderTotal,
      }

      const { data } = await axios.post(`${BaseURLV1}/order`, payload, config)

      const updateUser = {
        ...user,
        ...data.data.user,
      }
      setUser(updateUser)
      localStorage.setItem('userLogin', JSON.stringify(updateUser))

      alert('success create order')
      setIsLoading(false)
      navigate('/dashboard')
    } catch (e: any) {
      setIsLoading(false)
      return false
    }
  }

  return (
    <Box p={2} display='flex' justifyContent='space-around' gap={2}>
      <Box sx={{ width: 1 / 2 }}>
        <Typography gutterBottom variant='headline' component='h1' mb={2}>
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
                  <Typography gutterBottom variant='headline' component='h2'>
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
      <Box sx={{ width: 1 / 3 }}>
        <Typography gutterBottom variant='headline' component='h1' mb={2}>
          Order Information
        </Typography>
        <Box
          bgcolor={colors.secondary[500]}
          width='100%'
          p={2}
          mt={1}
          display='flex'
          alignItems='flex-start'
          justifyContent='space-between'
          borderRadius='8px'
        >
          <Typography variant='h5' fontWeight='bold'>
            Order Total: {formatRupiah(orderTotal.toString(), 'Rp. ')}
          </Typography>
        </Box>
        <form autoComplete='off' noValidate onSubmit={handleSubmit}>
          <Box
            bgcolor={colors.secondary[500]}
            width='100%'
            p={2}
            mt={1}
            display='flex'
            alignItems='flex-start'
            justifyContent='space-between'
            borderRadius='8px'
            flexDirection='column'
            gap={2}
          >
            <TextField
              fullWidth
              autoComplete='Name'
              type='text'
              label=''
              value={user && user.fullName}
            />
            <TextField
              fullWidth
              autoComplete='email'
              type='text'
              label=''
              value={user && user.email}
            />
            <Box display='flex' gap={1}>
              <TextField
                fullWidth
                autoComplete='kecamatan'
                type='text'
                placeholder='Kecamatan'
                onChange={(e) => setKecamatan(e.target.value)}
                value={address ? address.kecamatan : kecamatan}
              />
              <TextField
                fullWidth
                autoComplete='kabupaten/kota'
                type='text'
                placeholder='kabupaten/kota'
                onChange={(e) => setKabKot(e.target.value)}
                value={address ? address.kabKot : kabKot}
              />
              <TextField
                fullWidth
                autoComplete='provinsi'
                type='text'
                placeholder='provinsi'
                onChange={(e) => setProvinsi(e.target.value)}
                value={address ? address.provinsi : provinsi}
              />
            </Box>
            <TextField
              fullWidth
              autoComplete='fullAddress'
              type='text'
              placeholder='full Address'
              onChange={(e) => setFullAddress(e.target.value)}
              value={address ? address.fullAddress : fullAddress}
            />
            <Button fullWidth type='submit' variant='contained'>
              {isLoading ? 'loading...' : 'Create order'}
            </Button>
          </Box>
        </form>
      </Box>
    </Box>
  )
}

export default Cart
