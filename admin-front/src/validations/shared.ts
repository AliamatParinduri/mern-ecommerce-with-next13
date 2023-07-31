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
