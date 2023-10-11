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
import { BaseURLV1 } from '@/config/api'
import axios from 'axios'
import { formatRupiah } from '@/validations/shared'
import Loading from '@/assets/svg/Loading'

const Shipping = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [address, setAddress]: any = useState({})
  const [provinsi, setProvinsi] = useState('#')
  const [kabKot, setKabKot] = useState('#')
  const [kecamatan, setKecamatan] = useState('#')
  const [kurir, setKurir] = useState('#')
  const [kurirType, setKurirType] = useState('#')
  const [ongkir, setOngkir] = useState('#')
  const [provinsiId, setProvinsiId] = useState('')
  const [kabKotId, setKabKotId] = useState('')
  const [kecamatanId, setKecamatanId] = useState('')
  const [detailKurir, setDetailKurir] = useState('')
  const [fullAddress, setFullAddress] = useState('')
  const [listOfProvinsi, setListOfProvinsi] = useState([])
  const [listOfKabKot, setListOfKabKot] = useState([])
  const [listOfKecamatan, setListOfKecamatan] = useState([])
  const [listOfOngkir, setListOfOngkir] = useState([])
  const { user }: userContextType = UserState()
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const navigate = useNavigate()
  const { state } = useLocation()

  const getAddress = async () => {
    if (state.shippingAddress || state.kurirDetails) {
      if (state.shippingAddress) {
        setProvinsi(state.shippingAddress.provinsi)
        setProvinsiId(state.shippingAddress.provinsiId)
        setKabKot(state.shippingAddress.kabKot)
        setKabKotId(state.shippingAddress.kabKotId)
        setKecamatan(state.shippingAddress.kecamatan)
        setKecamatanId(state.shippingAddress.kecamatanId)
        setFullAddress(state.shippingAddress.fullAddress)
      }

      if (state.kurirDetails) {
        setKurir(state.kurirDetails.kurir)
        setKurirType(state.kurirDetails.kurirType)
        setOngkir(state.kurirDetails.ongkir)
        setListOfOngkir(state.kurirDetails.listOfOngkir)
      }
    } else {
      setIsLoading(true)
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
          setKecamatanId(data.data[0].kecamatanId)
          setKabKotId(data.data[0].kabKotId)
          setProvinsi(data.data[0].provinsi)
          setFullAddress(data.data[0].fullAddress)

          getListOfKabKot(data.data[0].provinsiId)
          getListOfKecamatan(data.data[0].kabKotId)
        }
        setIsLoading(false)
      } catch (e: any) {
        return false
      }
    }
  }

  const getListOfProvinsi = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user!.token}`,
        },
      }

      const { data } = await axios.get(
        `${BaseURLV1}/rajaongkir/provinsi`,
        config
      )

      setListOfProvinsi(data.data)
    } catch (e: any) {
      return false
    }
  }

  const getListOfKabKot = async (provinsi: string) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user!.token}`,
        },
      }

      const { data } = await axios.get(
        `${BaseURLV1}/rajaongkir/kabkot?province=${provinsi}`,
        config
      )

      setListOfKabKot(data.data)
    } catch (e: any) {
      return false
    }
  }

  const getListOfKecamatan = async (kabkot: string) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user!.token}`,
        },
      }

      const { data } = await axios.get(
        `${BaseURLV1}/rajaongkir/kecamatan?city=${kabkot}`,
        config
      )

      setListOfKecamatan(data.data)
    } catch (e: any) {
      return false
    }
  }

  const getListOfOngkir = async (kurir: string) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user!.token}`,
        },
      }

      const payload = {
        destination: kecamatanId,
        destinationType: 'subdistrict',
        weight: state.orders.totalWeight,
        courier: kurir,
      }

      const { data } = await axios.post(
        `${BaseURLV1}/rajaongkir/ongkir`,
        payload,
        config
      )

      setDetailKurir(data.data[0].name)
      setListOfOngkir(data.data[0].costs)
    } catch (e: any) {
      return false
    }
  }

  const confirmOrder = async () => {
    const totalPrice =
      state.orders.totalPriceProduct - state.orders.discount + Number(ongkir)

    delete address.user
    delete address.__v
    delete address._id
    const payload = {
      shippingAddress: {
        isAddress: Object.keys(address).length > 0 ? true : false,
        address,
        provinsi,
        provinsiId,
        kabKot,
        kabKotId,
        kecamatan,
        kecamatanId,
        fullAddress,
      },
      orders: {
        ...state.orders,
        totalPrice: totalPrice.toString(),
      },
      kurirDetails: {
        kurir,
        kurirType,
        listOfProvinsi,
        listOfKabKot,
        listOfKecamatan,
        listOfOngkir,
        ongkir,
        detailKurir,
      },
    }

    navigate('/confirm', {
      state: {
        ...payload,
      },
    })
  }

  useEffect(() => {
    getAddress()

    if (state.kurirDetails && state.kurirDetails.listOfProvinsi) {
      setListOfProvinsi(state.kurirDetails.listOfProvinsi)
      setListOfKabKot(state.kurirDetails.listOfKabKot)
      setListOfKecamatan(state.kurirDetails.listOfKecamatan)
    } else {
      getListOfProvinsi()
    }
  }, [])

  return (
    <Stack
      p={2}
      flexDirection={{ xs: 'column', md: 'row' }}
      justifyContent='space-around'
      gap={2}
    >
      <Box sx={{ width: { xs: '100%', md: 1 / 2 } }}>
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
            Shipping Details
          </Typography>
          {isLoading && <Loading value='80' />}
          {!isLoading && (
            <Stack gap={2} width='100%'>
              <FormControl fullWidth>
                <InputLabel id='demo-simple-select-label'></InputLabel>
                <Select
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  value={provinsi}
                  placeholder='Provinsi'
                  onChange={(e) => {
                    setKabKot('#')
                    setKecamatan('#')
                    setKurir('#')
                    setKurirType('#')
                    setProvinsi(e.target.value)
                  }}
                >
                  <MenuItem value='#'>--- Choose Provinsi ---</MenuItem>
                  {listOfProvinsi.length > 0 &&
                    listOfProvinsi.map((list: any) => (
                      <MenuItem
                        onClick={() => {
                          setProvinsiId(list.province_id)
                          getListOfKabKot(list.province_id)
                        }}
                        value={list.province}
                        key={list.province_id}
                      >
                        {list.province}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id='demo-simple-select-label'></InputLabel>
                <Select
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  value={kabKot}
                  placeholder='Kabupaten/Kota'
                  onChange={(e) => {
                    setKecamatan('#')
                    setKurir('#')
                    setKurirType('#')
                    setKabKot(e.target.value)
                  }}
                >
                  <MenuItem value='#'>--- Choose Kabupaten/Kota ---</MenuItem>
                  {listOfKabKot.length > 0 &&
                    listOfKabKot.map((list: any) => (
                      <MenuItem
                        onClick={() => {
                          setKabKotId(list.city_id)
                          getListOfKecamatan(list.city_id)
                        }}
                        value={`${list.type} ${list.city_name}`}
                        key={list.city_id}
                      >{`${list.type} ${list.city_name}`}</MenuItem>
                    ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id='demo-simple-select-label'></InputLabel>
                <Select
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  value={kecamatan}
                  placeholder='Kecamatan'
                  onChange={(e) => {
                    setKurir('#')
                    setKurirType('#')
                    setKecamatan(e.target.value)
                  }}
                >
                  <MenuItem value='#'>--- Choose Kecamatan ---</MenuItem>
                  {listOfKecamatan.length > 0 &&
                    listOfKecamatan.map((list: any) => (
                      <MenuItem
                        onClick={() => setKecamatanId(list.subdistrict_id)}
                        value={list.subdistrict_name}
                        key={list.subdistrict_id}
                      >
                        {list.subdistrict_name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id='demo-simple-select-label'></InputLabel>
                <Select
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  value={kurir}
                  placeholder='Kurir'
                  onChange={(e) => {
                    {
                      setKurir(e.target.value)
                      setKurirType('#')
                      getListOfOngkir(e.target.value)
                    }
                  }}
                >
                  <MenuItem value='#'>--- Choose Kurir ---</MenuItem>
                  <MenuItem selected={kurir === 'jne'} value='jne'>
                    JNE
                  </MenuItem>
                  <MenuItem selected={kurir === 'jnt'} value='jnt'>
                    J&T
                  </MenuItem>
                  <MenuItem selected={kurir === 'sicepat'} value='sicepat'>
                    Sicepat
                  </MenuItem>
                  <MenuItem selected={kurir === 'pos'} value='pos'>
                    POS
                  </MenuItem>
                  <MenuItem selected={kurir === 'tiki'} value='tiki'>
                    TIKI
                  </MenuItem>
                  <MenuItem selected={kurir === 'wahana'} value='wahana'>
                    Wahana
                  </MenuItem>
                  <MenuItem selected={kurir === 'anteraja'} value='anteraja'>
                    Anter Aja
                  </MenuItem>
                  <MenuItem selected={kurir === 'ninja'} value='ninja'>
                    Ninja
                  </MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id='demo-simple-select-label'></InputLabel>
                <Select
                  labelId='demo-simple-select-label'
                  id='demo-simple-select'
                  value={kurirType}
                  placeholder='Courier Type'
                  onChange={(e) => {
                    const val: any = e.target.value

                    setKurirType(val)
                    setOngkir(val.cost[0].value)
                  }}
                >
                  <MenuItem value='#'>--- Choose Ongkir ---</MenuItem>
                  {listOfOngkir.length > 0 &&
                    listOfOngkir.map((list: any) => {
                      let etd = list.cost[0].etd

                      if (etd === '') {
                        etd = ''
                      } else {
                        etd = etd.split(' ')[0]
                        etd = `Estimasi ${etd} day,`
                      }
                      return (
                        <MenuItem value={list} key={list.service}>
                          {`Layanan ${
                            list.service
                          }, ${etd} Ongkir: ${formatRupiah(
                            list.cost[0].value,
                            'Rp. '
                          )}`}
                        </MenuItem>
                      )
                    })}
                </Select>
              </FormControl>
            </Stack>
          )}
        </Box>
      </Box>
      <Box sx={{ width: { xs: '100%', md: 1 / 2 } }}>
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
            Delivery Address Details
          </Typography>
          {isLoading && <Loading value='80' />}
          {!isLoading && (
            <Stack gap={2} width='100%'>
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
                value={fullAddress}
              />
              <Button
                fullWidth
                onClick={confirmOrder}
                type='submit'
                variant='contained'
              >
                {isLoading ? 'loading...' : 'Confirmation of Order'}
              </Button>
            </Stack>
          )}
        </Box>
      </Box>
    </Stack>
  )
}

export default Shipping
