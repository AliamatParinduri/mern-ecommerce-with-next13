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
