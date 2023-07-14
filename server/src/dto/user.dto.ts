/* eslint-disable prefer-regex-literals */
import Joi from 'joi'
import { Document } from 'mongoose'

export interface UserDTO extends Document {
  fullName: string
  username: string
  email: string
  password: string
  userPic: string
  isAdmin: boolean
  isActive: boolean
  cart: []
  wishlist: []
}

export const UserValidate = Joi.object({
  fullName: Joi.string().pattern(new RegExp('^[a-zA-Z ]{3,75}$')).required(),
  username: Joi.string().min(3).max(20).alphanum().required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: false }).required(),
  password: Joi.string().min(8).max(20).required(),
  userPic: Joi.string()
})
