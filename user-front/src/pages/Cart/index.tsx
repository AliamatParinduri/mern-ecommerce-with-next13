import { useEffect, useState } from 'react'
import { BaseURLProduct, BaseURLV1 } from '@/config/api'
import { UserState, userContextType } from '@/context/userContext'
import {
  Box,
  Button,
  CardMedia,
  Checkbox,
  FormControlLabel,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import axios from 'axios'
import { formatRupiah } from '@/validations/shared'
import { HighlightOff } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { tokens } from '@/theme'
import { ToastError, ToastSuccess } from '@/components/Toast'

const Cart = () => {
  const [initialCheckStock, setInitialCheckStock] = useState(false)
  const [totalOrder, setTotalOrder] = useState(0)
  const [subTotalItem, setSubTotalItem] = useState(0)
  const [totalWeight, setTotalWeight] = useState(0)
  const [productActive, setProductActive] = useState<any[]>([])
  const [productEmpty, setProductEmpty] = useState<any[]>([])
  const [checkedProduct, setCheckedProduct] = useState<string[]>([])
  const { user, setUser }: userContextType = UserState()
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const navigate = useNavigate()

  useEffect(() => {
    if (user && user.cart.length < 1) {
      ToastError('Cart Product empty!')
      navigate(-1)
    }

    if (!initialCheckStock && user && user.cart.length > 0) {
      getProductDetails()
      setInitialCheckStock(true)
    }
  }, [user])

  const getProductDetails = async () => {
    try {
      user.cart.map(async (cart: any, i: number) => {
        const { data } = await axios.get(
          `${BaseURLV1}/product/${cart.product._id}/${cart.details._id}`
        )

        const detailsProduct = data.data.map((product: any) =>
          product.details.find((detail: any) => detail._id === cart.details._id)
        )

        const productsFilter = {
          details: detailsProduct[0],
          product: data.data[0],
          subTotal: detailsProduct[0].price * user.cart[i].qty,
          qty: user.cart[i].qty,
        }

        if (detailsProduct[0].stock > 0) {
          setProductActive((prev: any) => {
            return [...prev, productsFilter]
          })
        } else {
          setProductEmpty((prev: any) => {
            return [...prev, productsFilter]
          })
        }

        user.cart[i].product = data.data[0]
        user.cart[i].details = detailsProduct[0]
        user.cart[i].subTotal = detailsProduct[0].price * user.cart[i].qty

        const newUserCart = {
          ...user,
        }
        localStorage.setItem('userLogin', JSON.stringify(newUserCart))
        setUser({
          ...newUserCart,
        })
      })
    } catch (e: any) {
      return false
    }
  }

  const handleUpdateCart = async (detailsId: string, qty: number) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user!.token}`,
        },
      }

      const { data } = await axios.put(
        `${BaseURLV1}/users/${user!._id}/addToCart`,
        { detailsId, qty },
        config
      )

      const newUserCart = {
        ...user,
        cart: data.data.cart,
      }

      localStorage.setItem('userLogin', JSON.stringify(newUserCart))

      const productActiveIndex = productActive.findIndex(
        (cart: any) => cart.details._id === detailsId
      )

      const userCartIndex = data.data.cart.findIndex(
        (cart: any) => cart.details._id === detailsId
      )

      productActive[productActiveIndex].subTotal =
        data.data.cart[userCartIndex].subTotal
      productActive[productActiveIndex].qty = data.data.cart[userCartIndex].qty

      setProductActive(productActive)

      if (checkedProduct.includes(detailsId)) {
        const prod: any = productActive.find(
          (cart: any) => cart.details._id === detailsId
        )

        setTotalOrder((prev) => {
          if (qty > 0) {
            return prev + prod.details.price
          } else {
            return prev - prod.details.price
          }
        })

        setTotalWeight((prev) => {
          if (qty > 0) {
            return prev + prod.details.weight
          } else {
            return prev - prod.details.weight
          }
        })

        setSubTotalItem(checkedProduct.length)
      }

      setUser({
        ...newUserCart,
      })
    } catch (e: any) {
      return false
    }
  }

  const handleDeleteCart = async (detailsId: string) => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user!.token}`,
        },
      }

      const { data } = await axios.put(
        `${BaseURLV1}/users/${user!._id}/removeFromCart`,
        { detailsId },
        config
      )

      const newUserCart = {
        ...user,
        cart: data.data.cart,
      }

      localStorage.setItem('userLogin', JSON.stringify(newUserCart))

      setUser({
        ...newUserCart,
      })

      let tmpProductActive: any[] = []
      let tmpProductEmpty: any[] = []

      data.data.cart.map((cart: any) => {
        if (cart.details.stock > 0) {
          tmpProductActive = [...tmpProductActive, cart]
        } else {
          tmpProductEmpty = [...tmpProductEmpty, cart]
        }
      })

      setProductActive(tmpProductActive)
      setProductEmpty(tmpProductEmpty)

      ToastSuccess('Success delete cart')
    } catch (e: any) {
      return false
    }
  }

  const handleCheckout = async () => {
    if (checkedProduct.length < 1) {
      ToastError('No products have been selected yet')
      return false
    }

    let chooseProductInCart: any[] = []
    productActive.map((cart: any) => {
      if (checkedProduct.includes(cart.details._id)) {
        chooseProductInCart = [...chooseProductInCart, cart]
      }
    })

    const userOrders = {
      products: chooseProductInCart,
      discount: 0,
      totalPriceProduct: totalOrder,
      totalWeight,
      subtotal: subTotalItem + ' Item',
    }

    navigate('/shipping', {
      state: {
        orders: userOrders,
      },
    })
  }

  const handleChooseProductForCheckout = async (e: any, detailsId?: string) => {
    if (e.target.checked && !detailsId) {
      let totalWeight = 0
      let subTotal = 0
      let totalOrder = 0

      productActive.map((cart: any) => {
        {
          totalWeight += parseInt(cart.details.weight) * parseInt(cart.qty)
          subTotal += 1
          totalOrder += parseInt(cart.subTotal)
        }
        setCheckedProduct((prev) => [...prev, cart.details._id])
      })
      setTotalWeight(totalWeight)
      setSubTotalItem(subTotal)
      setTotalOrder(totalOrder)
    }

    if (!e.target.checked && !detailsId) {
      setCheckedProduct([])
      setTotalWeight(0)
      setSubTotalItem(0)
      setTotalOrder(0)
    }

    if (detailsId) {
      const checkIsChecked = checkedProduct.find((id: any) => id === detailsId)
      if (checkIsChecked) {
        setCheckedProduct(checkedProduct.filter((id: any) => id !== detailsId))
      } else {
        setCheckedProduct((prev) => [...prev, detailsId])
      }

      const data = productActive.find(
        (prod: any) => prod.details._id === detailsId
      )

      setTotalWeight((prev) =>
        e.target.checked
          ? prev + data.details.weight * data.qty
          : prev - data.details.weight * data.qty
      )
      setTotalOrder((prev) =>
        e.target.checked
          ? prev + data.details.price * data.qty
          : prev - data.details.price * data.qty
      )

      setSubTotalItem((prev) => (e.target.checked ? (prev += 1) : (prev -= 1)))
    }
  }

  return (
    <Stack
      flexDirection={{ xs: 'column', md: 'row' }}
      justifyContent='space-around'
      p={2}
      gap={2}
    >
      <Stack sx={{ width: { xs: '100%', md: 1 / 2 } }} gap={3}>
        {productActive.length > 0 && (
          <Stack
            bgcolor={colors.secondary[500]}
            width='100%'
            p={2}
            borderRadius='8px'
            gap={2}
          >
            <Box display='flex' alignItems='flex-start'>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={(e) => handleChooseProductForCheckout(e)}
                    checked={checkedProduct.length === productActive.length}
                    name='all'
                    sx={{
                      color: '#787eff',
                      '&.Mui-checked': {
                        color: '#787eff',
                      },
                    }}
                  />
                }
                label=''
              />
              <Typography
                gutterBottom
                variant='h3'
                fontWeight='bold'
                mb={2}
                my='auto'
              >
                Shopping Cart
              </Typography>
            </Box>
            {productActive.map((cart: any) => (
              <Box
                key={cart.details._id}
                display='flex'
                alignItems='flex-start'
                justifyContent='space-between'
                borderRadius='8px'
                py={0.5}
              >
                <Box display='flex' gap={2} alignItems='flex-start'>
                  <FormControlLabel
                    checked={checkedProduct.includes(cart.details._id)}
                    control={
                      <Checkbox
                        onChange={(e) =>
                          handleChooseProductForCheckout(e, cart.details._id)
                        }
                        name='all'
                        sx={{
                          color: '#787eff',
                          '&.Mui-checked': {
                            color: '#787eff',
                          },
                        }}
                      />
                    }
                    label=''
                  />
                  <CardMedia
                    crossOrigin='anonymous'
                    component='img'
                    image={`${BaseURLProduct}/${cart.product.pic[0]}`}
                    alt='Paella dish'
                    sx={{
                      borderRadius: '8px',
                      margin: '.25rem',
                      cursor: 'pointer',
                      backgroundRepeat: 'no-repeat',
                      objectFit: 'fill',
                      width: '100px',
                      height: '100px',
                    }}
                  />
                  <Stack>
                    <Typography
                      gutterBottom
                      variant='h5'
                      fontWeight='bold'
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: '1',
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {cart.product.nmProduct}
                    </Typography>
                    <Typography gutterBottom variant='subtitle1' component='h5'>
                      stock: <b>{cart.details.stock}</b> | type:{' '}
                      <b>{cart.details.size}</b>
                    </Typography>
                    <Typography gutterBottom variant='subtitle1' component='h5'>
                      <span>
                        {formatRupiah(cart.details.price, 'Rp. ')} x {cart.qty}{' '}
                      </span>{' '}
                      <span
                        style={{
                          marginLeft: '8px',
                          color: '#787eff',
                          fontWeight: 'bold',
                        }}
                      >
                        {formatRupiah(cart.subTotal, 'Rp. ')}
                      </span>
                    </Typography>
                    <Box
                      display='flex'
                      alignItems='center'
                      textAlign='center'
                      gap={1}
                    >
                      <Button
                        onClick={() => handleUpdateCart(cart.details._id, -1)}
                        disabled={cart.qty <= 1}
                        color='primary'
                        sx={{
                          width: '5px',
                          backgroundColor: '#787eff',
                          '&:hover': {
                            backgroundColor: '#484c99',
                          },
                        }}
                      >
                        -
                      </Button>
                      <Typography
                        gutterBottom
                        variant='subtitle1'
                        component='h5'
                      >
                        {cart.qty}
                      </Typography>
                      <Button
                        onClick={() => handleUpdateCart(cart.details._id, 1)}
                        sx={{
                          width: '5px',
                          backgroundColor: '#787eff',
                          '&:hover': {
                            backgroundColor: '#484c99',
                          },
                        }}
                      >
                        +
                      </Button>
                    </Box>
                  </Stack>
                </Box>
                <IconButton onClick={() => handleDeleteCart(cart.details._id)}>
                  <HighlightOff />
                </IconButton>
              </Box>
            ))}
          </Stack>
        )}
        {productEmpty.length > 0 && (
          <Stack
            bgcolor={colors.secondary[500]}
            width='100%'
            p={2}
            borderRadius='8px'
            gap={2}
          >
            <Typography gutterBottom variant='h3' fontWeight='bold' mb={2}>
              can't be processed
            </Typography>
            {productEmpty.map((cart: any) => (
              <Box
                key={cart.details._id}
                display='flex'
                alignItems='flex-start'
                justifyContent='space-between'
                borderRadius='8px'
                py={0.5}
              >
                <Box display='flex' gap={2}>
                  <CardMedia
                    crossOrigin='anonymous'
                    component='img'
                    image={`${BaseURLProduct}/${cart.product.pic[0]}`}
                    alt='Paella dish'
                    sx={{
                      borderRadius: '8px',
                      margin: '.25rem',
                      cursor: 'pointer',
                      backgroundRepeat: 'no-repeat',
                      objectFit: 'fill',
                      width: '100px',
                      height: '100px',
                    }}
                  />
                  <Stack>
                    <Typography
                      gutterBottom
                      variant='h5'
                      fontWeight='bold'
                      sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: '1',
                        WebkitBoxOrient: 'vertical',
                      }}
                    >
                      {cart.product.nmProduct}
                    </Typography>
                    <Typography gutterBottom variant='subtitle1' component='h4'>
                      <b style={{ color: 'red' }}>stock was empty</b> | type:{' '}
                      <b>{cart.details.size}</b>
                    </Typography>
                    <Typography gutterBottom variant='subtitle1' component='h5'>
                      <span>{formatRupiah(cart.details.price, 'Rp. ')}</span>
                    </Typography>
                  </Stack>
                </Box>
                <IconButton onClick={() => handleDeleteCart(cart.details._id)}>
                  <HighlightOff />
                </IconButton>
              </Box>
            ))}
          </Stack>
        )}
      </Stack>
      <Box sx={{ width: { xs: '100%', md: 1 / 3 } }}>
        <Stack
          bgcolor={colors.secondary[500]}
          width='100%'
          p={2}
          mt={1}
          gap={3}
          display='flex'
          alignItems='flex-start'
          justifyContent='space-between'
          borderRadius='8px'
        >
          <Typography gutterBottom variant='h3' fontWeight='bold'>
            Order Information
          </Typography>
          <table cellPadding={4} style={{ fontSize: '16px' }}>
            <tr>
              <td>Sub Total</td>
              <td>:</td>
              <td style={{ fontWeight: 'bold' }}>{`${subTotalItem} Item (${(
                totalWeight / 1000
              ).toFixed(2)} KG)`}</td>
            </tr>
            <tr>
              <td>Order Total</td>
              <td>:</td>
              <td style={{ fontWeight: 'bold' }}>
                {formatRupiah(totalOrder.toString(), 'Rp. ')}
              </td>
            </tr>
          </table>

          <Button
            fullWidth
            onClick={handleCheckout}
            type='button'
            variant='contained'
          >
            Checkout
          </Button>
        </Stack>
      </Box>
    </Stack>
  )
}

export default Cart
