/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios'
import { useState, useEffect } from 'react'
import {
  Box,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  styled,
  tableCellClasses,
  useTheme,
} from '@mui/material'

import { BaseURLV1 } from '@/config/api'
import { UserState, userContextType } from '@/context/userContext'
import { tokens } from '@/theme'
import MenuUserInfo from '@/components/MenuUserInfo'
import { Delete, Edit } from '@mui/icons-material'
import Loading from '@/assets/svg/Loading'
import ColorButton from '@/components/ColorButton'
import { useNavigate } from 'react-router-dom'
import { ToastSuccess } from '@/components/Toast'

const Addresses = () => {
  const [addresses, setAddresses] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { user }: userContextType = UserState()
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const navigate = useNavigate()

  const getAddresses = async () => {
    try {
      setIsLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user!.token}`,
        },
      }

      const { data } = await axios.get(
        `${BaseURLV1}/address?userId=${user!._id}`,
        config
      )

      setIsLoading(false)
      setAddresses(data.data)
    } catch (e: any) {
      setIsLoading(false)
      return false
    }
  }

  const deleteAddress = async (id: string) => {
    try {
      setIsLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user!.token}`,
        },
      }

      const { data } = await axios.delete(`${BaseURLV1}/address/${id}`, config)

      setAddresses(
        addresses.filter((address: any) => address._id !== data.data._id)
      )
      setIsLoading(false)
      ToastSuccess('Success delete Address')
    } catch (e: any) {
      setIsLoading(false)
      return false
    }
  }

  useEffect(() => {
    getAddresses()
  }, [user])

  const StyledTableCell = styled(TableCell)(({ theme: any }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.primary.main,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }))

  const StyledTableRow = styled(TableRow)(({ theme: any }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }))

  return (
    <Stack p={2} flexDirection={{ sx: 'column', lg: 'row' }} gap={2}>
      <MenuUserInfo />
      <Stack flexGrow={1}>
        <Box
          display='flex'
          justifyContent='space-between'
          mb={1}
          alignItems='center'
        >
          <Typography gutterBottom variant='h3' mb={2}>
            My Address
          </Typography>
          <ColorButton onClick={() => navigate('/addresses/create')}>
            Add New Address
          </ColorButton>
        </Box>
        <Box bgcolor={colors.secondary[500]} p={2} sx={{ borderRadius: '8px' }}>
          <Box>{isLoading && <Loading value='80' />}</Box>
          {!isLoading && addresses.length <= 0 && (
            <Typography gutterBottom variant='h5'>
              No Data
            </Typography>
          )}
          {!isLoading && addresses.length > 0 && (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label='customized table'>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Kecamatan</StyledTableCell>
                    <StyledTableCell>Kab/Kota</StyledTableCell>
                    <StyledTableCell>Provinsi</StyledTableCell>
                    <StyledTableCell>Full Address</StyledTableCell>
                    <StyledTableCell>Actions</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {addresses &&
                    addresses.map((address: any) => (
                      <StyledTableRow key={address.kecamatan}>
                        <StyledTableCell component='th' scope='row'>
                          {address.kecamatan}
                        </StyledTableCell>
                        <StyledTableCell>{address.kabKot}</StyledTableCell>
                        <StyledTableCell>{address.provinsi}</StyledTableCell>
                        <StyledTableCell>{address.fullAddress}</StyledTableCell>
                        <StyledTableCell sx={{ cursor: 'pointer' }}>
                          <Edit
                            onClick={() =>
                              navigate(`/addresses/${address._id}/edit`)
                            }
                          />
                          <Delete
                            onClick={() => {
                              deleteAddress(address._id)
                            }}
                          />
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Stack>
    </Stack>
  )
}

export default Addresses
