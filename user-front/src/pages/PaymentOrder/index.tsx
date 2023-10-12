import { useEffect, useState } from 'react'
import { UserState, userContextType } from '@/context/userContext'
import {
  Box,
  Button,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { tokens } from '@/theme'
import axios from 'axios'
import { BaseURLV1, SnapMidtrans } from '@/config/api'
import { formatRupiah } from '@/validations/shared'

declare const window: any

const Payment = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [token, setToken] = useState('')
  const { user, setUser }: userContextType = UserState()
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const navigate = useNavigate()
  const { state } = useLocation()

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    handleOrders()
  }

  const handleOrders = async () => {
    setIsLoading(true)
    try {
      let newAddress
      const config = {
        headers: {
          Authorization: `Bearer ${user!.token}`,
        },
      }

      if (!state.shippingAddress.isAddress) {
        const payload = {
          userId: user!._id,
          fullAddress: state.shippingAddress.fullAddress,
          provinsi: state.shippingAddress.provinsi.toString(),
          provinsiId: state.shippingAddress.provinsiId.toString(),
          kabKot: state.shippingAddress.kabKot.toString(),
          kabKotId: state.shippingAddress.kabKotId.toString(),
          kecamatan: state.shippingAddress.kecamatan.toString(),
          kecamatanId: state.shippingAddress.kecamatanId.toString(),
          isPrimary: true,
        }

        const { data } = await axios.post(
          `${BaseURLV1}/address`,
          payload,
          config
        )

        delete data.data.user
        delete data.data.__v
        delete data.data._id
        newAddress = data.data
      }

      let totalProfit = 0
      const products = state.orders.products.map((cart: any) => {
        totalProfit +=
          (cart.details.price - cart.details.capitalPrice) * cart.qty

        return {
          product: cart.product._id,
          details: cart.details,
          subTotal: cart.subTotal,
          qty: cart.qty,
        }
      })

      const today = new Date()
      let etd = state.kurirDetails.kurirType.cost[0].etd
      if (etd === '') {
        etd = 7
      }
      etd = etd.split(' ')[0]
      etd = etd.split('-')

      const estimatedDeliveryDate = new Date(
        today.setDate(today.getDate() + Number(etd[etd.length - 1]))
      )

      const payload = {
        user: user!._id,
        address: newAddress ?? state.shippingAddress.address,
        products,
        totalProfit,
        discount: 0,
        estimatedDeliveryDate,
        ongkir: state.kurirDetails.ongkir,
        totalPrice: state.orders.totalPrice,
      }

      const { data } = await axios.post(`${BaseURLV1}/order`, payload, config)

      const updateUser = {
        ...user,
        ...data.data.user,
      }
      setUser(updateUser)
      localStorage.setItem('userLogin', JSON.stringify(updateUser))

      handlePayment(data.data.order._id)
      return false
    } catch (e: any) {
      setIsLoading(false)
      return false
    }
  }

  const handlePayment = async (orderId: string) => {
    try {
      const payload = {
        orderId,
        name: user?.fullName,
        total: state.orders.totalPrice,
      }
      const config = {
        headers: {
          Authorization: `Bearer ${user!.token}`,
        },
      }

      const { data } = await axios.post(
        `${BaseURLV1}/payment/process-transaction`,
        payload,
        config
      )

      setToken(data.data.token)
    } catch (e: any) {
      return false
    }
  }

  useEffect(() => {
    if (token) {
      window.snap.pay(token, {
        onSuccess: (result: any) => {
          localStorage.setItem('Pembayaran', JSON.stringify(result))
          navigate('/success')
          setToken('')
        },
        onPending: (result: any) => {
          localStorage.setItem('Pembayaran', JSON.stringify(result))
          navigate('/success')
          setToken('')
        },
        onError: (err: any) => {
          console.log(err)
          setToken('')
        },
        onClose: () => {
          console.log('Anda belum menyelesaikan pembayaran')
          setToken('')
        },
      })
    }
  }, [token])

  useEffect(() => {
    const midtransUrl = SnapMidtrans

    const scriptTag = document.createElement('script')
    scriptTag.src = midtransUrl

    const midtransClientKey = 'SB-Mid-client-RGH1GALHJSYF5uma'
    scriptTag.setAttribute('data-client-key', midtransClientKey)

    document.body.appendChild(scriptTag)

    return () => {
      document.body.removeChild(scriptTag)
    }
  }, [])

  return (
    <Stack
      p={2}
      flexDirection={{ xs: 'column', md: 'row' }}
      justifyContent='space-around'
      gap={2}
      my={3}
    >
      <Box sx={{ width: { xs: '100%', md: 1 / 2 } }}>
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
            <Typography gutterBottom variant='h3' fontWeight='bold'>
              Payment Process
            </Typography>
            <TextField
              fullWidth
              autoComplete='Name'
              type='text'
              placeholder='Full Name'
              value={user && user.fullName}
            />
            <TextField
              fullWidth
              autoComplete='email'
              type='text'
              placeholder='Email'
              value={user && user.email}
            />
            <TextField
              fullWidth
              autoComplete='Total Orders'
              type='text'
              placeholder='Total Orders'
              value={state && formatRupiah(state.orders.totalPrice, 'Rp. ')}
            />
            <Button fullWidth type='submit' variant='contained'>
              {isLoading ? 'loading...' : 'Create Payment Orders'}
            </Button>
          </Box>
        </form>
      </Box>
    </Stack>
  )
}

export default Payment
