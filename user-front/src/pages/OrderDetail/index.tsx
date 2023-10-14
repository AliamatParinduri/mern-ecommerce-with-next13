/* eslint-disable @typescript-eslint/no-unused-vars */
import axios from 'axios'
import { useState, useEffect } from 'react'
import {
  Box,
  Divider,
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
  CardMedia,
  Modal,
  Rating,
  Fade,
  Backdrop,
  TextField,
  Button,
  IconButton,
} from '@mui/material'

import { BaseURLProduct, BaseURLV1 } from '@/config/api'
import { UserState, userContextType } from '@/context/userContext'
import { tokens } from '@/theme'
import MenuUserInfo from '@/components/MenuUserInfo'
import {
  CheckCircleOutlineOutlined,
  Close,
  Inventory2Outlined,
  LocalShippingOutlined,
} from '@mui/icons-material'
import Loading from '@/assets/svg/Loading'
import { useNavigate, useParams } from 'react-router-dom'
import {
  OrderDTO,
  RatingsDTO,
  formatRupiah,
  getDates,
  isUserLogin,
} from '@/validations/shared'
import { ToastError, ToastSuccess } from '@/components/Toast'
import ColorButton from '@/components/ColorButton'

const OrderDetail = () => {
  const [order, setOrder] = useState<OrderDTO>()
  const [ratings, setRatings] = useState<RatingsDTO[]>([])
  const [ratingExists, setRatingExists] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const { id } = useParams()
  const navigate = useNavigate()
  const { setUser }: userContextType = UserState()
  let { user }: userContextType = UserState()
  let subTotal = 0
  const [open, setOpen] = useState(false)
  const [open2, setOpen2] = useState(false)
  const [userId, setUserId] = useState('')
  const [orderId, setOrderId] = useState('')
  const [productId, setProductId] = useState('')
  const [detailsId, setDetailsId] = useState('')
  const [comment, setComment] = useState('')
  const [rating, setRating] = useState('0')

  const handleClose = () => {
    setOpen(false)
    setOpen2(false)
  }

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
      setUserId(data.data.user._id)
      setOrderId(data.data._id)
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

  const getRatingProducts = async () => {
    try {
      setIsLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user!.token}`,
        },
      }

      const { data } = await axios.get(
        `${BaseURLV1}/rating?user=${userId}&order=${orderId}`,
        config
      )

      const ratings = data.data.map((data: RatingsDTO) => {
        return {
          detailsId: data.detailsId,
          komentar: data.komentar,
          rating: data.rating,
        }
      })
      const detailsId = data.data.map((data: RatingsDTO) => data.detailsId)

      setRatings(ratings)
      setRatingExists(detailsId)
      setIsLoading(false)
    } catch (e: any) {
      setIsLoading(false)
      const description = e.response?.data?.description
      ToastError(
        description ? description : 'Failed get Rating Product Details'
      )
      return false
    }
  }

  const writeReview = (productId: string, detailsId: string) => {
    setProductId(productId)
    setDetailsId(detailsId)
    setComment('')
    setRating('0')

    setOpen(true)
  }

  const seeReview = (detailsId: string) => {
    ratings?.map((rating: RatingsDTO) => {
      if (rating.detailsId === detailsId) {
        setComment(rating.komentar)
        setRating(rating.rating)
      }
    })
    setOpen2(true)
  }

  const handleCreateRating = async () => {
    try {
      setIsLoading(true)
      const config = {
        headers: {
          Authorization: `Bearer ${user!.token}`,
        },
      }

      const payload = {
        user: userId,
        order: orderId,
        product: productId,
        detailsId,
        rating,
        komentar: comment,
      }

      await axios.post(`${BaseURLV1}/rating`, payload, config)

      const newRatings = [
        ...ratings,
        {
          detailsId,
          komentar: comment,
          rating,
        },
      ]

      const newRatingExists = [...ratingExists, detailsId]
      setRatings(newRatings)
      setRatingExists(newRatingExists)
      setIsLoading(false)
      setProductId('')
      setDetailsId('')
      setRating('0')
      setComment('')
      setOpen(false)
      ToastSuccess('Success write Review')
    } catch (e: any) {
      setIsLoading(false)
      const description = e.response?.data?.description
      ToastError(description ? description : 'Failed Create Rating Product')
      return false
    }
  }

  useEffect(() => {
    if (isUserLogin(user)) {
      user = isUserLogin(user)
    }

    getOrderById()
  }, [])

  useEffect(() => {
    if (order && order.paymentOrder === 'Done') {
      getRatingProducts()
    }
  }, [order])

  const updateOrderReceived = async () => {
    const text = 'Are you sure update your payment order ?'
    if (confirm(text) == true) {
      updatePaymentOrder()
    }
  }

  const updatePaymentOrder = async () => {
    setIsLoading(true)

    try {
      const paymentOrder = 'Done'

      const config = {
        headers: {
          Authorization: `Bearer ${user!.token}`,
        },
      }

      delete order!._id
      delete order!.createdAt
      delete order!.updatedAt
      delete order!.__v

      const payload = {
        ...order,
        user: order!.user._id,
        paymentOrder,
        deliveredOrder: new Date(),
      }

      const { data } = await axios.put(
        `${BaseURLV1}/order/${id}`,
        payload,
        config
      )
      setOrder(data.data)

      setIsLoading(false)
      ToastSuccess('success update status order')
    } catch (e: any) {
      setIsLoading(false)
      const description = e.response?.data?.description
      ToastError(description ? description : 'Failed Update Status Order')
      return false
    }
  }

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
          Order Detail
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
          <Stack gap={4}>
            <Stack
              bgcolor={colors.secondary[500]}
              gap={3}
              py={4}
              sx={{
                borderRadius: '8px',
              }}
            >
              <Box
                display='flex'
                alignItems='center'
                justifyContent='center'
                mx={{ xs: 2, md: 1, lg: 0 }}
              >
                <Box
                  display='flex'
                  justifyContent='center'
                  alignItems='center'
                  bgcolor='#787eff'
                  p={2}
                  sx={{ borderRadius: '100%' }}
                >
                  <Inventory2Outlined fontSize='large' />
                </Box>
                <Divider
                  component='div'
                  sx={{
                    bgcolor:
                      order.paymentOrder === 'Delivery' ||
                      order.paymentOrder === 'Done'
                        ? '#787eff'
                        : colors.grey[500],
                    borderWidth: 4,
                    height: '4px',
                    width: { xs: '30%', md: '35%', lg: '40%' },
                  }}
                />
                <Box
                  display='flex'
                  justifyContent='center'
                  alignItems='center'
                  bgcolor={
                    order.paymentOrder === 'Delivery' ||
                    order.paymentOrder === 'Done'
                      ? '#787eff'
                      : colors.grey[500]
                  }
                  p={2}
                  sx={{ borderRadius: '100%' }}
                >
                  <LocalShippingOutlined fontSize='large' />
                </Box>
                <Divider
                  component='div'
                  sx={{
                    bgcolor:
                      order.paymentOrder === 'Done'
                        ? '#787eff'
                        : colors.grey[500],
                    borderWidth: 4,
                    height: '4px',
                    width: { xs: '30%', md: '35%', lg: '40%' },
                  }}
                />
                <Box
                  display='flex'
                  justifyContent='center'
                  alignItems='center'
                  bgcolor={
                    order.paymentOrder === 'Done' ? '#787eff' : colors.grey[500]
                  }
                  p={2}
                  sx={{ borderRadius: '100%' }}
                >
                  <CheckCircleOutlineOutlined fontSize='large' />
                </Box>
              </Box>
              <Stack flexDirection='row' justifyContent='space-between' mx={2}>
                <Box>
                  {order.paymentOrder === 'Delivery' && (
                    <ColorButton onClick={updateOrderReceived}>
                      <Typography
                        color={
                          theme.palette.mode === 'dark' ? 'white' : 'black'
                        }
                      >
                        order received
                      </Typography>
                    </ColorButton>
                  )}
                  {order.paymentOrder === 'Done' && (
                    <Button
                      href={`/invoice/${id}`}
                      target='_blank'
                      variant='contained'
                      sx={{
                        width: '150px',
                        fontWeight: 'bold',
                        color:
                          theme.palette.mode === 'dark' ? 'white' : 'black',
                        backgroundColor: '#787eff',
                        '&:hover': {
                          backgroundColor: '#484c99',
                        },
                      }}
                    >
                      See Invoice
                    </Button>
                  )}
                </Box>
                <Box
                  display='flex'
                  justifyContent='flex-end'
                  p={0.5}
                  borderRadius='4px'
                  bgcolor='#787eff'
                >
                  Estimated Delivery Date:{' '}
                  <b>&nbsp;{getDates(order.estimatedDeliveryDate, true)}</b>
                </Box>
              </Stack>
            </Stack>

            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 700 }} aria-label='customized table'>
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Order ID: {order._id}</StyledTableCell>
                    <StyledTableCell>
                      Ordered on: {getDates(order!.createdAt!)}
                    </StyledTableCell>
                    {order.deliveredOrder && order.paymentOrder === 'Done' && (
                      <StyledTableCell>
                        Delivered on {getDates(order.deliveredOrder)}
                      </StyledTableCell>
                    )}
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
                                    {formatRupiah(
                                      product.details.price,
                                      'Rp. '
                                    )}{' '}
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
                        {order.deliveredOrder &&
                          order.paymentOrder === 'Done' && (
                            <StyledTableCell>
                              <Box
                                onClick={() => {
                                  ratingExists &&
                                  ratingExists.includes(product.details._id)
                                    ? seeReview(product.details._id)
                                    : writeReview(
                                        product.product._id,
                                        product.details._id
                                      )
                                }}
                                sx={{
                                  cursor: 'pointer',
                                  textDecoration: 'underline',
                                  color: '#787eff',
                                }}
                              >
                                {ratingExists &&
                                ratingExists.includes(product.details._id)
                                  ? 'See a Review'
                                  : 'Write a Review'}
                              </Box>
                            </StyledTableCell>
                          )}
                      </StyledTableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box display='flex' justifyContent='space-between' gap={2}>
              <Stack
                bgcolor={colors.secondary[500]}
                gap={1}
                py={4}
                p={2}
                width={2 / 3}
                sx={{
                  borderRadius: '8px',
                }}
              >
                <Typography gutterBottom variant='h5' fontWeight='bold'>
                  Shipping Address
                </Typography>
                {order.address && (
                  <Stack>
                    <Box>
                      {`${order.address.kecamatan} -
                      ${order.address.kabKot} -
                      ${order.address.provinsi}`}
                    </Box>
                    <Typography gutterBottom variant='subtitle2'>
                      {order.address.fullAddress}
                    </Typography>
                  </Stack>
                )}
              </Stack>
              <Stack
                bgcolor={colors.secondary[500]}
                gap={1}
                p={2}
                width={1 / 3}
                sx={{
                  borderRadius: '8px',
                }}
              >
                <Typography gutterBottom variant='h5' fontWeight='bold'>
                  Total Summary
                </Typography>

                <Stack
                  flexDirection='row'
                  justifyContent='space-between'
                  gap={1}
                >
                  <span>SubTotal</span>
                  <span>
                    <b>{formatRupiah(subTotal.toString())}</b>
                  </span>
                </Stack>
                <Stack
                  flexDirection='row'
                  justifyContent='space-between'
                  gap={1}
                >
                  <span>Shipping fee</span>
                  <span>
                    <b>{formatRupiah(order.ongkir.toString())}</b>
                  </span>
                </Stack>
                <Stack
                  flexDirection='row'
                  justifyContent='space-between'
                  gap={1}
                >
                  <span>Discount</span>
                  <span>
                    <b>{formatRupiah(order.discount.toString())}</b>
                  </span>
                </Stack>
                <Divider
                  component='div'
                  sx={{
                    borderWidth: 2,
                    height: '2px',
                    width: '100%',
                  }}
                />
                <Stack
                  flexDirection='row'
                  justifyContent='space-between'
                  gap={1}
                >
                  <span>Total Order</span>
                  <span>
                    <b>{formatRupiah(order.totalPrice.toString(), 'Rp. ')}</b>
                  </span>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        )}
      </Stack>

      <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 24,
              p: 4,
            }}
          >
            <Box
              display='flex'
              justifyContent='space-between'
              alignItems='center'
            >
              <Typography
                id='transition-modal-title'
                variant='h5'
                component='h2'
                mb={1}
              >
                Product Rating
              </Typography>
              <IconButton onClick={handleClose}>
                <Close />
              </IconButton>
            </Box>
            <Divider
              component='div'
              sx={{
                borderWidth: 2,
                height: '4px',
                mb: 3,
                width: '100%',
              }}
            />
            <Stack gap={2}>
              <Stack>
                <label>Rating : </label>
                <Rating
                  name='size-large'
                  size='large'
                  defaultValue={Number(rating)}
                  onChange={(e: any) => setRating(e.target.value)}
                />
              </Stack>
              <Box>
                <TextField
                  fullWidth
                  autoComplete='Name'
                  type='text'
                  label='Write a Review'
                  onChange={(e) => setComment(e.target.value)}
                  value={comment}
                />
              </Box>
              <Button
                fullWidth
                type='button'
                onClick={handleCreateRating}
                variant='contained'
              >
                {isLoading ? 'loading...' : 'Create Review'}
              </Button>
            </Stack>
          </Box>
        </Fade>
      </Modal>
      <Modal
        aria-labelledby='transition-modal-title'
        aria-describedby='transition-modal-description'
        open={open2}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open2}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 24,
              p: 4,
            }}
          >
            <Box
              display='flex'
              justifyContent='space-between'
              alignItems='center'
            >
              <Typography
                id='transition-modal-title'
                variant='h5'
                component='h2'
                mb={1}
              >
                Product Rating
              </Typography>
              <IconButton onClick={handleClose}>
                <Close />
              </IconButton>
            </Box>
            <Divider
              component='div'
              sx={{
                borderWidth: 2,
                height: '4px',
                mb: 3,
                width: '100%',
              }}
            />
            <Stack gap={2}>
              <Stack>
                <label>Rating : </label>
                <Rating
                  name='size-large'
                  size='large'
                  readOnly={true}
                  defaultValue={Number(rating)}
                  onChange={(e: any) => setRating(e.target.value)}
                />
              </Stack>
              <Stack gap={1}>
                <label>Comment : </label>
                <Typography gutterBottom variant='subtitle2'>
                  {comment}
                </Typography>
              </Stack>
            </Stack>
          </Box>
        </Fade>
      </Modal>
    </Stack>
  )
}

export default OrderDetail
