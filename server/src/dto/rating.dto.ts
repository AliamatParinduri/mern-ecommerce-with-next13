/* eslint-disable prefer-regex-literals */
import Joi from 'joi'
import { Document } from 'mongoose'
import { UserDTO } from './user.dto'
import { ProductDTO } from './product.dto'
import { OrderDTO } from './order.dto'

export interface RatingDTO extends Document {
  userId: UserDTO
  orderId: OrderDTO
  productId: ProductDTO
  detailsId: string
  rating: number
  komentar: string
}

export const RatingSchema = Joi.object({
  userId: Joi.string().required(),
  orderId: Joi.string().required(),
  productId: Joi.string().required(),
  detailsId: Joi.string().required(),
  rating: Joi.number().required(),
  komentar: Joi.string()
})
