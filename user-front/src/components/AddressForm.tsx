import { useState, useEffect } from 'react'
import axios from 'axios'

import { UserState, userContextType } from '@/context/userContext'
import { BaseURLV1 } from '@/config/api'
import { Box, Button, FormLabel, Stack, TextField } from '@mui/material'
import { ToastError, ToastSuccess } from './Toast'
import { useNavigate, useParams } from 'react-router-dom'
import { isUserLogin } from '@/validations/shared'

type Props = {
  title: string
}

const AddressForm = ({ title }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [kecamatan, setKecamatan] = useState('')
  const [kabKot, setKabKot] = useState('')
  const [provinsi, setProvinsi] = useState('')
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
      setFullAddress(data.data.fullAddress)
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
        kabKot,
        provinsi,
      }

      const { data } = await axios.post(`${BaseURLV1}/address`, payload, config)

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
        kabKot,
        provinsi,
      }

      const { data } = await axios.put(
        `${BaseURLV1}/address/${id}`,
        payload,
        config
      )

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

  useEffect(() => {
    if (isUserLogin(user)) {
      user = isUserLogin(user)
    }

    if (id) getAddress(id)
  }, [])

  return (
    <form onSubmit={title == 'Create Address' ? createAddress : updateAddress}>
      <Stack flexDirection='row' justifyContent='space-between' mb={1}>
        <Box width='30%'>
          <FormLabel>Kecamatan</FormLabel>
          <TextField
            fullWidth
            type='text'
            onChange={(e) => setKecamatan(e.target.value)}
            value={kecamatan}
          />
        </Box>
        <Box width='30%'>
          <FormLabel>Kab / Kota</FormLabel>
          <TextField
            fullWidth
            type='text'
            onChange={(e) => setKabKot(e.target.value)}
            value={kabKot}
          />
        </Box>
        <Box width='30%'>
          <FormLabel>Provinsi</FormLabel>
          <TextField
            fullWidth
            type='text'
            onChange={(e) => setProvinsi(e.target.value)}
            value={provinsi}
          />
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
