import jwt from 'jsonwebtoken'

import { UserDTO } from '@/dto'
import { privateKey, publicKey } from '@config/index'
import { UserToken } from './shared'

export const generateToken = (user: UserDTO, options?: jwt.SignOptions | undefined) => {
  return jwt.sign(user, privateKey, {
    ...(options && options)
  })
}

export const verifyToken = (token: string) => {
  return jwt.verify(token, publicKey) as UserToken
}
