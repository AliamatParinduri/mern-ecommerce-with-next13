/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios'
import { useState, useEffect } from 'react'
import {
  Avatar,
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

import { BaseURLUsers, BaseURLV1 } from '@/config/api'
import { UserState, userContextType } from '@/context/userContext'
import { tokens } from '@/theme'
import MenuUserInfo from '@/components/MenuUserInfo'
import Loading from '@/assets/svg/Loading'
import ColorButton from '@/components/ColorButton'
import { OrderDTO, isUserLogin } from '@/validations/shared'
import { useNavigate } from 'react-router-dom'
import { ToastError } from '@/components/Toast'

const Profile = () => {
  const [orders, setOrders] = useState<OrderDTO[]>([])
  const [ordersProcess, setOrdersProcess] = useState<any[]>([])
  const [ordersDelivery, setOrdersDelivery] = useState<any[]>([])
  const [ordersDone, setOrdersDone] = useState<any[]>([])
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

      let ordersProcess: OrderDTO[] = []
      let ordersDelivery: OrderDTO[] = []
      let ordersDone: OrderDTO[] = []

      for (const order of data.data) {
        switch (order.paymentOrder) {
          case 'Process':
            ordersProcess = [...ordersProcess, order]
            break
          case 'Delivery':
            ordersDelivery = [...ordersDelivery, order]
            break

          default:
            ordersDone = [...ordersDone, order]
            break
        }
      }

      setIsLoading(false)
      setOrders(data.data)

      setOrdersProcess(ordersProcess)
      setOrdersDelivery(ordersDelivery)
      setOrdersDone(ordersDone)
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
        ToastError(e.response?.data?.message)
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
            My Profile
          </Typography>
          {user && (
            <ColorButton onClick={() => navigate('/profile/edit-profile')}>
              Edit Profile
            </ColorButton>
          )}
        </Box>
        <Box>{isLoading && <Loading value='80' />}</Box>
        {!isLoading && !user && (
          <Box
            bgcolor={colors.secondary[500]}
            p={2}
            sx={{ borderRadius: '8px' }}
          >
            <Typography gutterBottom variant='h5'>
              No Data
            </Typography>
          </Box>
        )}
        {!isLoading && user && (
          <Stack gap={4}>
            <Box display='flex' justifyContent='space-between' gap={3}>
              <Box
                bgcolor={colors.secondary[500]}
                py={4}
                display='flex'
                alignItems='center'
                width={2 / 6}
                pl={3}
                sx={{
                  borderRadius: '8px',
                }}
              >
                <Box display='flex' gap={2}>
                  <Avatar
                    alt={user.fullName}
                    src={`${BaseURLUsers}/${user.userPic}`}
                  />
                  <Stack>
                    <Typography variant='h6'>{user.fullName}</Typography>
                    <Typography variant='body2'>{user.email}</Typography>
                  </Stack>
                </Box>
              </Box>
              <Box
                bgcolor={colors.secondary[500]}
                display='flex'
                justifyContent='center'
                alignItems='center'
                flexDirection='column'
                width={1 / 6}
                py={1}
                sx={{
                  borderRadius: '8px',
                }}
              >
                <Typography variant='h3' color='#787eff' mb={1}>
                  {orders.length > 0 ? orders.length : 0}
                </Typography>
                <Typography variant='h5'>All Orders</Typography>
              </Box>
              <Box
                bgcolor={colors.secondary[500]}
                display='flex'
                justifyContent='center'
                alignItems='center'
                flexDirection='column'
                width={1 / 6}
                py={1}
                sx={{
                  borderRadius: '8px',
                }}
              >
                <Typography variant='h3' color='#787eff' mb={1}>
                  {ordersProcess.length > 0 ? ordersProcess.length : 0}
                </Typography>
                <Typography variant='h5'> Process Orders</Typography>
              </Box>
              <Box
                bgcolor={colors.secondary[500]}
                display='flex'
                justifyContent='center'
                alignItems='center'
                flexDirection='column'
                width={1 / 6}
                py={1}
                sx={{
                  borderRadius: '8px',
                }}
              >
                <Typography variant='h3' color='#787eff' mb={1}>
                  {ordersDelivery.length > 0 ? ordersDelivery.length : 0}
                </Typography>
                <Typography variant='h5'>Delivered Orders</Typography>
              </Box>
              <Box
                bgcolor={colors.secondary[500]}
                display='flex'
                justifyContent='center'
                alignItems='center'
                flexDirection='column'
                width={1 / 6}
                py={1}
                sx={{
                  borderRadius: '8px',
                }}
              >
                <Typography variant='h3' color='#787eff' mb={1}>
                  {ordersDone.length > 0 ? ordersDone.length : 0}
                </Typography>
                <Typography variant='h5'>Done Orders</Typography>
              </Box>
            </Box>

            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label='customized table'>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Full Name</StyledTableCell>
                    <StyledTableCell>Username</StyledTableCell>
                    <StyledTableCell>Email</StyledTableCell>
                    <StyledTableCell>Phone</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <StyledTableRow>
                    <StyledTableCell component='th' scope='row'>
                      {user.fullName}
                    </StyledTableCell>
                    <StyledTableCell>{user.username}</StyledTableCell>
                    <StyledTableCell>{user.email}</StyledTableCell>
                    <StyledTableCell>{user.noHP}</StyledTableCell>
                  </StyledTableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Stack>
        )}
      </Stack>
    </Stack>
  )
}

export default Profile
