import { ProductDTO } from '@/dto'

export type UserToken = {
  _id: string
  isAdmin: boolean
  username: string
  password: string
  iat: number
  exp: number
}

export type Cart = {
  product: ProductDTO
  qty: number
}

export type Wishlist = {
  product: ProductDTO
}
