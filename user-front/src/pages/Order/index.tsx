/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios'
import { useState, useEffect } from 'react'
import {
  Box,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
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
import { formatRupiah } from '@/validations/shared'
import { ArrowRightAlt } from '@mui/icons-material'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const { user }: userContextType = UserState()
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  const getOrders = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user!.token}`,
        },
      }

      const { data } = await axios.get(
        `${BaseURLV1}/order?userId=${user!._id}`,
        config
      )

      setOrders(data.data)
    } catch (e: any) {
      return false
    }
  }

  useEffect(() => {
    getOrders()
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
    <Box p={2} display='flex' flexDirection='column' gap={2}>
      <Box display='flex' gap={2}>
        <Stack
          width={{ minWidth: '250px', maxWidth: '250px' }}
          bgcolor={colors.secondary[500]}
          p={2}
          gap={3}
          sx={{ borderRadius: '8px' }}
        >
          <MenuUserInfo />
        </Stack>
        <Box
          bgcolor={colors.secondary[500]}
          p={2}
          sx={{ borderRadius: '8px' }}
          flexGrow={1}
        >
          <Typography gutterBottom variant='h3' mb={2}>
            My Orders
          </Typography>

          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label='customized table'>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Order</StyledTableCell>
                  <StyledTableCell>Status</StyledTableCell>
                  <StyledTableCell>Date Purchased</StyledTableCell>
                  <StyledTableCell>Total</StyledTableCell>
                  <StyledTableCell></StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders &&
                  orders.map((order: any) => (
                    <StyledTableRow key={order.name}>
                      <StyledTableCell component='th' scope='row'>
                        {order._id}
                      </StyledTableCell>
                      <StyledTableCell>{order.paymentOrder}</StyledTableCell>
                      <StyledTableCell>{order.createdAt}</StyledTableCell>
                      <StyledTableCell>
                        {formatRupiah(order.totalPrice, 'Rp. ')}
                      </StyledTableCell>
                      <StyledTableCell
                        onClick={() => {}}
                        sx={{ cursor: 'pointer' }}
                      >
                        {<ArrowRightAlt />}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    </Box>
  )
}

export default Orders
