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

export type ProductsDTO = {
  _id?: string
  nmProduct: string
  category: string
  subCategory: string
  pic: []
  details: []
}

export const ucWords = (text: string) => {
  const words = text.split(' ')

  for (let i = 0; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].substr(1)
  }

  return words.join(' ')
}

export const isUserLogin = (user: any) => {
  let userLogin
  if (!user) {
    const userInfo = JSON.parse(localStorage.getItem('userInfo')!)
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

export function getPercentage(now: number, past: number) {
  let result

  if (now === 0 && past === 0) {
    result = '0%'
  } else if (now > 0 && past === 0) {
    result = '+ꝏ%'
  } else if (now === 0 && past > 0) {
    result = '-ꝏ%'
  } else if (now > 0 && past > 0) {
    const res = (now / past - 1) * 100

    result = `${res > 0 ? '+' : ''}${
      res.toString().split('.').length > 1 ? res.toFixed(2) : res
    }%`
  } else {
    alert('not valid')
  }

  return result
}

export function formatRupiah(angka: string, prefix?: string) {
  let separator

  const numberString = angka.toString().replace(/[^,\d]/g, '')
  const split = numberString.split(',')
  const sisa = split[0].length % 3
  let rupiah = split[0].substr(0, sisa)
  const ribuan = split[0].substr(sisa).match(/\d{3}/gi)

  // tambahkan titik jika yang di input sudah menjadi angka ribuan
  if (ribuan) {
    separator = sisa ? '.' : ''
    rupiah += separator + ribuan.join('.')
  }

  rupiah = split[1] !== undefined ? rupiah + ',' + split[1] : rupiah
  return prefix === undefined || prefix === ''
    ? rupiah
    : rupiah
    ? prefix + rupiah
    : ''
}
export function formatAliasesNumber(angka: string, prefix: string) {
  let aliases
  let total

  const angkaAliases = formatRupiah(angka)
  const split = angkaAliases.split('.')

  if (split.length > 1) {
    const decimal = (Number(split[1]) / 1000).toFixed(2)
    total = Number(split[0]) + Number(decimal)
  }

  switch (split.length) {
    case 2:
      aliases = `${total}K`
      break
    case 3:
      aliases = `${total}M`
      break
    case 4:
      aliases = `${total}T`
      break
    case 5:
      aliases = `${total}${'.' + split[1]}T`
      break
    default:
      aliases = `${split[0]}`
      break
  }

  if (prefix === 'Trx') {
    return `${aliases} ${prefix}`
  }

  return prefix === undefined || prefix === ''
    ? aliases
    : aliases
    ? prefix + aliases
    : ''
}
