/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios'
import { useState, useEffect } from 'react'
import {
  Box,
  Stack,
  Typography,
  useTheme,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
  tableCellClasses,
  Card,
  CardContent,
} from '@mui/material'

import { BaseURLV1 } from '@/config/api'
import { UserState, userContextType } from '@/context/userContext'
import { tokens } from '@/theme'
import MenuUserInfo from '@/components/MenuUserInfo'
import AdbIcon from '@mui/icons-material/Adb'
import Loading from '@/assets/svg/Loading'
import { useNavigate, useParams } from 'react-router-dom'
import {
  OrderDTO,
  formatRupiah,
  getDates,
  isUserLogin,
} from '@/validations/shared'
import { ToastError } from '@/components/Toast'

const Invoice = () => {
  const [order, setOrder] = useState<OrderDTO>()
  const [isLoading, setIsLoading] = useState(false)
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const { id } = useParams()
  const navigate = useNavigate()
  const { setUser }: userContextType = UserState()
  let { user }: userContextType = UserState()
  let subTotal = 0

  const getOrderById = async () => {
    try {
      setIsLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user!.token}`,
        },
      }

      const { data } = await axios.get(`${BaseURLV1}/order/${id}`, config)

      setIsLoading(false)
      setOrder(data.data)
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

    getOrderById()
  }, [])

  order &&
    order.products.map(
      (product: any) => (subTotal += parseInt(product.subTotal))
    )

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
          Invoice
        </Typography>
        <Box>{isLoading && <Loading value='80' />}</Box>
        {!isLoading && !order && (
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
        {!isLoading && order && (
          <Stack
            bgcolor={colors.secondary[500]}
            gap={3}
            p={2}
            sx={{
              borderRadius: '8px',
            }}
          >
            <Box display='flex' justifyContent='space-between'>
              <AdbIcon
                sx={{
                  fontSize: '50px',
                }}
              />
              <Stack>
                <Typography
                  bgcolor={order.paymentStatus === 'Paid' ? 'green' : 'red'}
                  p={0.5}
                  borderRadius='4px'
                  margin='auto'
                >
                  {order.paymentStatus}
                </Typography>
                <Typography>Date : {getDates(order!.createdAt!)}</Typography>
              </Stack>
            </Box>
            <Box display='flex' justifyContent='space-between' gap={2}>
              <Card sx={{ minWidth: '48%', maxWidth: '48%' }}>
                <CardContent>
                  <Typography variant='h3' gutterBottom>
                    FROM
                  </Typography>
                  <Typography variant='h5' component='div'>
                    My E-Commerce Store
                  </Typography>
                  <Typography color='text.secondary'>
                    Ciomas - Kab. Bogor - Jawa Barat
                  </Typography>
                  <Typography
                    variant='body2'
                    sx={{ mb: 1.5 }}
                    color='text.secondary'
                  >
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Similique repellat odio, ducimus quia aperiam facere dolorem
                    est debitis nihil pariatur?
                  </Typography>
                  <Typography variant='body1'>
                    089708970897
                    <br />
                    ecommerce@gmail.com
                  </Typography>
                </CardContent>
              </Card>
              <Card sx={{ minWidth: '48%', maxWidth: '48%' }}>
                <CardContent>
                  <Typography variant='h3' gutterBottom>
                    TO
                  </Typography>
                  <Typography variant='h5' component='div'>
                    {order.user.fullName}
                  </Typography>
                  <Typography color='text.secondary'>
                    {`${order.address.kecamatan} -
                      ${order.address.kabKot} -
                      ${order.address.provinsi}`}
                  </Typography>
                  <Typography
                    variant='body2'
                    sx={{ mb: 1.5 }}
                    color='text.secondary'
                  >
                    {order.address.fullAddress}
                  </Typography>
                  <Typography variant='body1'>
                    {order.user.noHP}
                    <br />
                    {order.user.email}
                  </Typography>
                </CardContent>
              </Card>
            </Box>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label='customized table'>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Name</StyledTableCell>
                    <StyledTableCell>Qty</StyledTableCell>
                    <StyledTableCell>Price</StyledTableCell>
                    <StyledTableCell>Amount</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.products &&
                    order.products.map((product: any) => (
                      <StyledTableRow key={product._id}>
                        <StyledTableCell component='th' scope='row'>
                          <Box
                            key={order._id}
                            width='100%'
                            display='flex'
                            alignItems='flex-start'
                            justifyContent='space-between'
                            borderRadius='8px'
                          >
                            <Box display='flex' gap={2}>
                              <Stack>
                                <Typography
                                  gutterBottom
                                  component='h5'
                                  sx={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    display: '-webkit-box',
                                    WebkitLineClamp: '2',
                                    WebkitBoxOrient: 'vertical',
                                  }}
                                >
                                  {product.product.nmProduct}
                                </Typography>
                              </Stack>
                            </Box>
                          </Box>
                        </StyledTableCell>
                        <StyledTableCell>
                          {formatRupiah(product.details.price, 'Rp. ')}
                        </StyledTableCell>
                        <StyledTableCell>{product.qty}</StyledTableCell>
                        <StyledTableCell>
                          {formatRupiah(product.subTotal, 'Rp. ')}
                        </StyledTableCell>
                      </StyledTableRow>
                    ))}
                  <StyledTableRow>
                    <StyledTableCell></StyledTableCell>
                    <StyledTableCell>Sub Total</StyledTableCell>
                    <StyledTableCell
                      colSpan={2}
                      sx={{
                        textAlign: 'right',
                      }}
                    >
                      <b>{formatRupiah(subTotal.toString(), 'Rp. ')}</b>
                    </StyledTableCell>
                  </StyledTableRow>
                  <StyledTableRow>
                    <StyledTableCell></StyledTableCell>
                    <StyledTableCell>Shipping Fee</StyledTableCell>
                    <StyledTableCell
                      colSpan={2}
                      sx={{
                        textAlign: 'right',
                      }}
                    >
                      <b>{formatRupiah(order.ongkir.toString(), 'Rp. ')}</b>
                    </StyledTableCell>
                  </StyledTableRow>
                  <StyledTableRow>
                    <StyledTableCell></StyledTableCell>
                    <StyledTableCell>Discount</StyledTableCell>
                    <StyledTableCell
                      colSpan={2}
                      sx={{
                        textAlign: 'right',
                      }}
                    >
                      <b>{formatRupiah(order.discount.toString(), 'Rp. ')}</b>
                    </StyledTableCell>
                  </StyledTableRow>
                  <StyledTableRow>
                    <StyledTableCell></StyledTableCell>
                    <StyledTableCell>Total Order</StyledTableCell>
                    <StyledTableCell
                      colSpan={2}
                      sx={{
                        textAlign: 'right',
                      }}
                    >
                      <b>{formatRupiah(order.totalPrice.toString(), 'Rp. ')}</b>
                    </StyledTableCell>
                  </StyledTableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <span>
              Extra note: Please send all items at the same time to the shipping
              address. Thanks in advance.
            </span>
          </Stack>
        )}
      </Stack>
    </Stack>
  )
}

export default Invoice
