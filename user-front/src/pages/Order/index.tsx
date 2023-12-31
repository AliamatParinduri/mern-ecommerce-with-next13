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
import { formatRupiah, isUserLogin } from '@/validations/shared'
import { ArrowRightAlt } from '@mui/icons-material'
import Loading from '@/assets/svg/Loading'
import { useNavigate } from 'react-router-dom'
import { ToastError } from '@/components/Toast'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const { setUser }: userContextType = UserState()
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const navigate = useNavigate()
  let { user }: userContextType = UserState()

  const getOrders = async () => {
    try {
      setIsLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user!.token}`,
        },
      }

      const { data } = await axios.get(
        `${BaseURLV1}/order?user=${user!._id}`,
        config
      )

      setIsLoading(false)
      setOrders(data.data)
    } catch (e: any) {
      setIsLoading(false)
      if (
        e.message === `Cannot read properties of undefined (reading 'token')` ||
        e.response?.data?.message === 'jwt expired' ||
        e.response?.data?.message === 'invalid signature'
      ) {
        localStorage.removeItem('userLogin')
        setUser(null)
        ToastError('Your session has ended, Please login again')
        navigate('/login')
      } else {
        ToastError(e.response?.data?.description)
      }
      return false
    }
  }

  useEffect(() => {
    if (isUserLogin(user)) {
      user = isUserLogin(user)
    }

    getOrders()
  }, [])

  const StyledTableCell = styled(TableCell)(() => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.primary.main,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }))

  const StyledTableRow = styled(TableRow)(() => ({
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
        <Typography gutterBottom variant='h3' mb={2}>
          My Orders
        </Typography>
        <Box bgcolor={colors.secondary[500]} p={2} sx={{ borderRadius: '8px' }}>
          <Box>{isLoading && <Loading value='80' />}</Box>
          {!isLoading && orders.length <= 0 && (
            <Typography gutterBottom variant='h5'>
              No Data
            </Typography>
          )}
          {!isLoading && orders.length > 0 && (
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label='customized table'>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Order</StyledTableCell>
                    <StyledTableCell>Status</StyledTableCell>
                    <StyledTableCell>Date Purchased</StyledTableCell>
                    <StyledTableCell>Total Order</StyledTableCell>
                    <StyledTableCell>Actions</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders &&
                    orders.map((order: any) => (
                      <StyledTableRow key={order._id}>
                        <StyledTableCell component='th' scope='row'>
                          {order._id}
                        </StyledTableCell>
                        <StyledTableCell>{order.paymentOrder}</StyledTableCell>
                        <StyledTableCell>{order.createdAt}</StyledTableCell>
                        <StyledTableCell>
                          {formatRupiah(order.totalPrice, 'Rp. ')}
                        </StyledTableCell>
                        <StyledTableCell
                          onClick={() => navigate(`/orders/${order._id}`)}
                          sx={{ cursor: 'pointer' }}
                        >
                          {<ArrowRightAlt />}
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

export default Orders
