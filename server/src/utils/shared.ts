export type UserToken = {
  _id: string
  isAdmin: boolean
  username: string
  password: string
  iat: number
  exp: number
}
