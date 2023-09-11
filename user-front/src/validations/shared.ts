export type LoginDTO = {
  username: string
  password?: string
}

export type RegisterDTO = LoginDTO & {
  fullName: string
  email: string
  noHP: string
  confirmPassword?: string
}

export type userDTO = RegisterDTO & {
  _id?: string
  userPic: string
  isAdmin: boolean
  isActive: boolean
  cart: []
  wishlist: []
}

export type userLogin = userDTO & {
  token: string
}

export type CategoriesDTO = {
  _id?: string
  category: string
  subCategory: string[]
}

export type AddressDTO = {
  _id?: string
  fullAddress: string
  isPrimary: boolean
  kabKot: string
  kecamatan: string
  provinsi: string
  updatedAt: string
}

export type ProductsDTO = {
  _id?: string
  nmProduct: string
  category: string
  subCategory: string
  pic: []
  details: []
}

export type RatingsDTO = {
  _id?: string
  user?: userDTO
  komentar: string
  rating: string
  detailsId: string
}

export type OrderDTO = {
  _id?: string
  user: userDTO
  address: AddressDTO
  products: [
    {
      product: ProductsDTO
      subTotal: number
      qty: number
    }
  ]
  estimatedDeliveryDate: string
  deliveredOrder: string
  paymentStatus: string
  paymentOrder: string
  discount: number
  ongkir: number
  totalPrice: number
  createdAt?: string
  updatedAt?: string
  __v?: string
}

export const ucWords = (text: string) => {
  const words = text.split(' ')

  for (let i = 0; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].substr(1)
  }

  return words.join(' ')
}

export const sortPriceList = (prices: any) => {
  if (prices.length <= 1) {
    return formatRupiah(prices[0].price, 'Rp. ')
  }

  const sorter = (a: { price: number }, b: { price: number }) => {
    return +a.price - +b.price
  }
  const sortbyPrice = prices.sort(sorter)
  return `${formatRupiah(prices[0].price, 'Rp. ')} - ${formatRupiah(
    prices[sortbyPrice.length - 1].price,
    'Rp. '
  )}`
}

export const countTotalOrder = (details: any) => {
  let total = 0

  for (const detail of details) {
    total += detail.totalOrder
  }

  return total
}

export const isUserLogin = (user: any) => {
  let userLogin
  if (!user) {
    const userInfo = JSON.parse(localStorage.getItem('userLogin')!)
    if (userInfo) {
      userLogin = userInfo
    } else {
      return undefined
    }
  } else {
    userLogin = user
  }
  return userLogin
}

export function formatRupiah(angka: string, prefix: string) {
  let separator
  const number_string = angka.toString().replace(/[^,\d]/g, '')
  const split = number_string.split(',')
  const sisa = split[0].length % 3
  let rupiah = split[0].substr(0, sisa)
  const ribuan = split[0].substr(sisa).match(/\d{3}/gi)

  // tambahkan titik jika yang di input sudah menjadi angka ribuan
  if (ribuan) {
    separator = sisa ? '.' : ''
    rupiah += separator + ribuan.join('.')
  }

  rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah
  return prefix == undefined ? rupiah : rupiah ? 'Rp. ' + rupiah : ''
}

export function onlyGetNumberValue(value: string) {
  return Number(value.replace(/[^0-9]/g, ''))
}

export function getDates(date: string) {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]

  const newDate = new Date(date)

  const y = newDate.getFullYear()
  const m = newDate.getMonth() + 1
  const d = newDate.getDate().toString()
  const h = newDate.getHours().toString()
  const i = newDate.getMinutes().toString()
  const s = newDate.getSeconds().toString()

  return `${d.length === 1 ? '0' + d : d} ${monthNames[m]} ${y} ${
    h.length === 1 ? '0' + h : h
  }:${i.length === 1 ? '0' + i : i}:${s.length === 1 ? '0' + s : s}`
}
