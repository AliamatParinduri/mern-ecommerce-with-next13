import { useState, useEffect } from 'react'
import axios from 'axios'

import { UserState, userContextType } from '@/context/userContext'
import { BaseURLV1 } from '@/config/api'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material'
import { ToastError, ToastSuccess } from './Toast'
import { useNavigate, useParams } from 'react-router-dom'
import { isUserLogin } from '@/validations/shared'

type Props = {
  title: string
}

const AddressForm = ({ title }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [provinsi, setProvinsi] = useState('#')
  const [kabKot, setKabKot] = useState('#')
  const [kecamatan, setKecamatan] = useState('#')
  const [isPrimary, setIsPrimary] = useState<boolean>(false)
  const [provinsiId, setProvinsiId] = useState('')
  const [kabKotId, setKabKotId] = useState('')
  const [kecamatanId, setKecamatanId] = useState('')
  const [listOfProvinsi, setListOfProvinsi] = useState([])
  const [listOfKabKot, setListOfKabKot] = useState([])
  const [listOfKecamatan, setListOfKecamatan] = useState([])
  const [fullAddress, setFullAddress] = useState('')
  const navigate = useNavigate()
  const { id } = useParams()
  let { user }: userContextType = UserState()

  const getAddress = async (id: string) => {
    try {
      setIsLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user!.token}`,
        },
      }

      const { data } = await axios.get(`${BaseURLV1}/address/${id}`, config)

      setIsLoading(false)
      setKecamatan(data.data.kecamatan)
      setKabKot(data.data.kabKot)
      setProvinsi(data.data.provinsi)
      setProvinsiId(data.data.provinsiId)
      setKecamatanId(data.data.kecamatanId)
      setKabKotId(data.data.kabKotId)
      setFullAddress(data.data.fullAddress)
      setIsPrimary(data.data.isPrimary)

      getListOfKabKot(data.data.provinsiId)
      getListOfKecamatan(data.data.kabKotId)
    } catch (e: any) {
      setIsLoading(false)
      const description = e.response?.data?.description
      ToastError(description ? description : 'Failed get Address Data')
      return false
    }
  }

  const createAddress = async (e: any) => {
    e.preventDefault()

    try {
      setIsLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user!.token}`,
        },
      }

      const payload = {
        userId: user!._id,
        fullAddress,
        kecamatan,
        provinsiId,
        kabKotId,
        kecamatanId,
        kabKot,
        provinsi,
        isPrimary,
      }

      await axios.post(`${BaseURLV1}/address`, payload, config)

      setIsLoading(false)
      ToastSuccess('Success create Address')
      navigate('/addresses')
    } catch (e: any) {
      setIsLoading(false)
      const description = e.response?.data?.description
      ToastError(description ? description : 'Failed create Address Data')
      return false
    }
  }
  const updateAddress = async (e: any) => {
    e.preventDefault()

    try {
      setIsLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user!.token}`,
        },
      }

      const payload = {
        userId: user!._id,
        fullAddress,
        kecamatan,
        provinsiId,
        kabKotId,
        kecamatanId,
        kabKot,
        provinsi,
        isPrimary,
      }

      await axios.put(`${BaseURLV1}/address/${id}`, payload, config)

      setIsLoading(false)
      ToastSuccess('Success update Address')
      navigate('/addresses')
    } catch (e: any) {
      setIsLoading(false)
      const description = e.response?.data?.description
      ToastError(description ? description : 'Failed update Address')
      return false
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

  useEffect(() => {
    if (isUserLogin(user)) {
      user = isUserLogin(user)
    }

    if (id) getAddress(id)
    getListOfProvinsi()
  }, [])

  return (
    <form onSubmit={title == 'Create Address' ? createAddress : updateAddress}>
      <Stack flexDirection='row' justifyContent='space-between' mb={1}>
        <Box width='22.5%'>
          <FormLabel>Kecamatan</FormLabel>
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
        </Box>
        <Box width='22.5%'>
          <FormLabel>Kab / Kota</FormLabel>
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'></InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              value={kabKot}
              placeholder='Kabupaten/Kota'
              onChange={(e) => {
                setKecamatan('#')
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
        </Box>
        <Box width='22.5%'>
          <FormLabel>Provinsi</FormLabel>
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'></InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              value={kecamatan}
              placeholder='Kecamatan'
              onChange={(e) => {
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
        </Box>
        <Box width='22.5%'>
          <FormLabel>Primary Address</FormLabel>
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'></InputLabel>
            <Select
              labelId='demo-simple-select-label'
              id='demo-simple-select'
              value={isPrimary}
              placeholder='Primary Address'
              onChange={(e: any) => {
                setIsPrimary(e.target.value)
              }}
            >
              <MenuItem selected={isPrimary === false} value='false'>
                No
              </MenuItem>
              <MenuItem selected={isPrimary === true} value='true'>
                Yes
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Stack>
      <Stack mb={1}>
        <FormLabel>Full Address</FormLabel>
        <TextField
          multiline
          rows={8}
          variant='outlined'
          onChange={(e) => setFullAddress(e.target.value)}
          value={fullAddress}
        />
      </Stack>
      <Button fullWidth type='submit' variant='contained'>
        {isLoading ? 'loading...' : title}
      </Button>
    </form>
  )
}

export default AddressForm
