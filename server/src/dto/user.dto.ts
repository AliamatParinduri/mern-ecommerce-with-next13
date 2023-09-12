/* eslint-disable prefer-regex-literals */
import Joi from 'joi'
import { Document } from 'mongoose'
import { ProductDTO } from './product.dto'

export interface UserDTO extends Document {
  fullName: string
  username: string
  email: string
  noHP: string
  dateOfBirth: Date
  password: string
  userPic: string
  isAdmin: boolean
  isActive: boolean
  cart: [
    {
      product: ProductDTO
      subTotal: number
      qty: number
    }
  ]
  wishlist: [
    {
      product: ProductDTO
    }
  ]
}

export const UserSchema = Joi.object({
  fullName: Joi.string().pattern(new RegExp('^[a-zA-Z ]{3,75}$')).required(),
  username: Joi.string().min(3).max(20).alphanum().required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: false }).required(),
  password: Joi.string()
    .min(8)
    .max(20)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$.%^&*])(?=.{8,})'))
    .required(),
  noHP: Joi.string().min(11).max(13).required(),
  dateOfBirth: Joi.date().required(),
  isActive: Joi.boolean(),
  userPic: Joi.string()
})

export const UserUpdateSchema = Joi.object({
  fullName: Joi.string().pattern(new RegExp('^[a-zA-Z ]{3,75}$')).required(),
  username: Joi.string().min(3).max(20).alphanum().required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: false }).required(),
  password: Joi.string()
    .min(8)
    .max(20)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})')),
  noHP: Joi.string().min(11).max(13).required(),
  dateOfBirth: Joi.date().required(),
  isActive: Joi.boolean(),
  userPic: Joi.string()
})
