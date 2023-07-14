import jwt from 'jsonwebtoken'

import { UserDTO } from '@/dto'
import { privateKey, publicKey } from '@config/index'

export const generateToken = (user: UserDTO, options?: jwt.SignOptions | undefined) => {
  return jwt.sign(user, privateKey, {
    ...(options && options)
  })
}

export const verifyToken = (token: string) => {
  return jwt.verify(token, publicKey)
}
