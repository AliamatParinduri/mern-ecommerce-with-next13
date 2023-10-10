import { useEffect, useState } from 'react'
import { UserState, userContextType } from '@/context/userContext'
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { tokens } from '@/theme'
import { AddressDTO } from '@/validations/shared'
import { BaseURLV1 } from '@/config/api'
import axios from 'axios'

const Shipping = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [address, setAddress]: any = useState({})
  const [kecamatan, setKecamatan] = useState('')
  const [kabKot, setKabKot] = useState('')
  const [provinsi, setProvinsi] = useState('')
  const [kurir, setKurir] = useState(0)
  const [fullAddress, setFullAddress] = useState('')
  const { user, setUser }: userContextType = UserState()
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const navigate = useNavigate()
  const { state } = useLocation()

  const getAddress = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user!.token}`,
        },
      }

      const { data } = await axios.get(
        `${BaseURLV1}/address?userId=${user?._id}&isPrimary=true`,
        config
      )

      if (data.data.length > 0) {
        setAddress(data.data[0])
        setKecamatan(data.data[0].kecamatan)
        setKabKot(data.data[0].kabKot)
        setProvinsi(data.data[0].provinsi)
        setFullAddress(data.data[0].fullAddress)
      }
    } catch (e: any) {
      return false
    }
  }

  const confirmOrder = async () => {
    const totalPrice =
      state.orders.totalPriceProduct - state.orders.discount - kurir

    delete address.user
    delete address.__v
    delete address._id
    const payload = {
      shippingAddress: {
        isAddress: Object.keys(address).length > 0 ? true : false,
        address,
        provinsi,
        kabKot,
        kecamatan,
        fullAddress,
      },
      orders: {
        ...state.orders,
        totalPrice: totalPrice.toString(),
      },
      kurir,
    }

    navigate('/confirm', {
      state: {
        ...payload,
      },
    })
  }

  useEffect(() => {
    getAddress()
  }, [])

  return (
    <Stack
      p={2}
      flexDirection={{ xs: 'column', md: 'row' }}
      justifyContent='space-around'
      gap={2}
    >
      <Box sx={{ width: { xs: '100%', md: 1 / 2 } }}>
        <Typography gutterBottom variant='h3' fontWeight='bold' mb={2}>
          Shipping Details
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
          flexDirection='column'
          gap={2}
        >
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>Provinsi</InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              value={provinsi}
              placeholder='Provinsi'
              onChange={(e) => setProvinsi(e.target.value)}
            >
              <MenuItem value=''>--- Choose Provinsi ---</MenuItem>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>
              Kabupaten/Kota
            </InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              value={kabKot}
              placeholder='Kabupaten/Kota'
              onChange={(e) => setKabKot(e.target.value)}
            >
              <MenuItem value=''>--- Choose Kabupaten/Kota ---</MenuItem>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>Kecamatan</InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              value={kecamatan}
              placeholder='Kecamatan'
              onChange={(e) => setKecamatan(e.target.value)}
            >
              <MenuItem value=''>--- Choose Kecamatan ---</MenuItem>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>Kurir</InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              value={kurir}
              placeholder='Kurir'
              onChange={(e) => setKurir(Number(e.target.value))}
            >
              <MenuItem value=''>--- Choose Kurir ---</MenuItem>
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Box sx={{ width: { xs: '100%', md: 1 / 2 } }}>
        <Typography gutterBottom variant='h3' fontWeight='bold' mb={2}>
          Delivery Address Details
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
          flexDirection='column'
          gap={2}
        >
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
            autoComplete='noHP'
            type='text'
            placeholder='No. Handphone'
            value={user && user.noHP}
          />
          <TextField
            fullWidth
            autoComplete='fullAddress'
            type='text'
            placeholder='Full Address'
            onChange={(e) => setFullAddress(e.target.value)}
            value={
              address
                ? address.fullAddress
                : state.shipping.fullAddress !== ''
                ? state.shipping.fullAddress
                : fullAddress
            }
          />
          <Button
            fullWidth
            onClick={confirmOrder}
            type='submit'
            variant='contained'
          >
            {isLoading ? 'loading...' : 'Confirmation of Order'}
          </Button>
        </Box>
      </Box>
    </Stack>
  )
}

export default Shipping
