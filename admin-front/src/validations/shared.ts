export type LoginDTO = {
  username: string
  password: string
}

export type RegisterDTO = {
  fullName: string
  username: string
  email: string
  noHP: string
  password: string
  confirmPassword: string
}

export type userDTO = {
  fullName: string
  username: string
  email: string
  noHP: string
  password: string
  userPic: string
  isAdmin: boolean
  isActive: boolean
  cart: []
  wishlist: []
}