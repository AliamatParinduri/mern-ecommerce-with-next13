/* eslint-disable prefer-regex-literals */
import Joi from 'joi'
import { Document } from 'mongoose'
import { UserDTO } from './user.dto'
import { ProductDTO } from './product.dto'
import { OrderDTO } from './order.dto'

export interface RatingDTO extends Document {
  user: UserDTO
  order: OrderDTO
  product: ProductDTO
  detailsId: string
  rating: number
  komentar: string
}

export const RatingSchema = Joi.object({
  user: Joi.string().required(),
  order: Joi.string().required(),
  product: Joi.string().required(),
  detailsId: Joi.string().required(),
  rating: Joi.number().required(),
  komentar: Joi.string()
})
