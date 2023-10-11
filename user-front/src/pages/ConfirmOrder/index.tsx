import { useEffect, useState } from 'react'
import { UserState, userContextType } from '@/context/userContext'
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  styled,
  tableCellClasses,
  Stack,
  Typography,
  useTheme,
  CardMedia,
} from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { tokens } from '@/theme'
import { formatRupiah } from '@/validations/shared'
import { BaseURLProduct } from '@/config/api'

const Confirm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const { user, setUser }: userContextType = UserState()
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const navigate = useNavigate()
  const { state } = useLocation()

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
    <Stack p={2} justifyContent='space-around' gap={4}>
      <Box sx={{ width: '100%' }}>
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
            Purchased Items
          </Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 700 }} aria-label='customized table'>
              <TableHead>
                <TableRow>
                  <StyledTableCell>Product Details:</StyledTableCell>
                  <StyledTableCell>Product Type:</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {state.orders.products &&
                  state.orders.products.map((product: any) => (
                    <StyledTableRow key={product._id}>
                      <StyledTableCell component='th' scope='row'>
                        <Box
                          key={product._id}
                          width='100%'
                          display='flex'
                          alignItems='flex-start'
                          justifyContent='space-between'
                          borderRadius='8px'
                        >
                          <Box display='flex' gap={2}>
                            <CardMedia
                              crossOrigin='anonymous'
                              component='img'
                              image={`${BaseURLProduct}/${product.product.pic[0]}`}
                              alt='Paella dish'
                              sx={{
                                borderRadius: '8px',
                                margin: '.25rem',
                                cursor: 'pointer',
                                backgroundRepeat: 'no-repeat',
                                objectFit: 'fill',
                                width: '100px',
                              }}
                            />
                            <Stack>
                              <Typography
                                gutterBottom
                                component='h5'
                                fontWeight='bold'
                                sx={{
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  display: '-webkit-box',
                                  WebkitLineClamp: '1',
                                  WebkitBoxOrient: 'vertical',
                                }}
                              >
                                {product.product.nmProduct}
                              </Typography>
                              <Typography
                                gutterBottom
                                variant='subtitle1'
                                component='h5'
                              >
                                type: <b>{product.details.size}</b>
                              </Typography>
                              <Typography
                                gutterBottom
                                variant='subtitle1'
                                component='h5'
                              >
                                <span>
                                  {formatRupiah(product.details.price, 'Rp. ')}{' '}
                                  x {product.qty}{' '}
                                </span>{' '}
                                <span
                                  style={{
                                    marginLeft: '8px',
                                    color: '#787eff',
                                    fontWeight: 'bold',
                                  }}
                                >
                                  {formatRupiah(product.subTotal, 'Rp. ')}
                                </span>
                              </Typography>
                            </Stack>
                          </Box>
                        </Box>
                      </StyledTableCell>
                      <StyledTableCell>{`Product properties: ${product.details.size} (${product.details.color})`}</StyledTableCell>
                    </StyledTableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
      <Stack flexDirection={{ xs: 'column', md: 'row' }} gap={2}>
        <Box sx={{ width: { xs: '100%', md: 2 / 3 } }}>
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
            <table cellPadding={4} style={{ fontSize: '16px' }}>
              <tr>
                <td>Name</td>
                <td>:</td>
                <td style={{ fontWeight: 'bold' }}>{user?.fullName}</td>
              </tr>
              <tr>
                <td>No. Handphone</td>
                <td>:</td>
                <td style={{ fontWeight: 'bold' }}>{user?.noHP}</td>
              </tr>
              <tr>
                <td>Kecamatan</td>
                <td>:</td>
                <td style={{ fontWeight: 'bold' }}>
                  {state.shippingAddress.kecamatan}
                </td>
              </tr>
              <tr>
                <td>kabupaten/Kota</td>
                <td>:</td>
                <td style={{ fontWeight: 'bold' }}>
                  {state.shippingAddress.kabKot}
                </td>
              </tr>
              <tr>
                <td>provinsi</td>
                <td>:</td>
                <td style={{ fontWeight: 'bold' }}>
                  {state.shippingAddress.provinsi}
                </td>
              </tr>
              <tr>
                <td>Full Address</td>
                <td>:</td>
                <td
                  style={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: '2',
                    WebkitBoxOrient: 'vertical',
                    fontWeight: 'bold',
                  }}
                >
                  {state.shippingAddress.fullAddress}
                </td>
              </tr>
            </table>
          </Box>
        </Box>
        <Box sx={{ width: { xs: '100%', md: 1 / 3 } }}>
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
              Order Details
            </Typography>
            <table cellPadding={4} style={{ fontSize: '16px' }} width='100%'>
              <tr>
                <td>Quantity Item</td>
                <td>:</td>
                <td style={{ fontWeight: 'bold' }}>{`${
                  state.orders.subtotal
                } (${(state.orders.totalWeight / 1000).toFixed(2)} KG)`}</td>
              </tr>
              <tr>
                <td>Discount</td>
                <td>:</td>
                <td style={{ fontWeight: 'bold', textAlign: 'right' }}>
                  {formatRupiah(state.orders.discount)}
                </td>
              </tr>
              <tr>
                <td>Sub Total</td>
                <td>:</td>
                <td style={{ fontWeight: 'bold', textAlign: 'right' }}>
                  {formatRupiah(state.orders.totalPriceProduct)}
                </td>
              </tr>
              <tr>
                <td>Ongkir</td>
                <td>:</td>
                <td style={{ fontWeight: 'bold', textAlign: 'right' }}>
                  {formatRupiah(state.kurirDetails.ongkir)}
                </td>
              </tr>
              <tr>
                <td>Total Payment</td>
                <td>:</td>
                <td style={{ fontWeight: 'bold', textAlign: 'right' }}>
                  {formatRupiah(state.orders.totalPrice, 'Rp. ')}
                </td>
              </tr>
            </table>
            <Box
              display='flex'
              minWidth='100%'
              justifyContent='space-between'
              gap={2}
            >
              <Button
                fullWidth
                type='button'
                variant='contained'
                onClick={() => navigate('/shipping', { state: { ...state } })}
              >
                Back to Shipping
              </Button>
              <Button
                fullWidth
                type='button'
                variant='contained'
                onClick={() => navigate('/payment', { state: { ...state } })}
              >
                Continue Payment
              </Button>
            </Box>
          </Box>
        </Box>
      </Stack>
    </Stack>
  )
}

export default Confirm
