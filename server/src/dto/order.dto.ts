/* eslint-disable prefer-regex-literals */
import Joi from 'joi'
import { Document } from 'mongoose'
import { UserDTO } from './user.dto'
import { ProductDTO } from './product.dto'

export interface OrderDTO extends Document {
  user: UserDTO
  address: object
  products: [
    {
      product: ProductDTO
      subTotal: number
      qty: number
    }
  ]
  estimatedDeliveryDate: Date
  deliveredOrder: Date
  paymentStatus: string
  paymentOrder: string
  totalProfit: number
  discount: number
  ongkir: number
  totalPrice: number
}

export const OrderSchema = Joi.object({
  user: Joi.string(),
  address: Joi.object().required(),
  products: Joi.required(),
  paymentStatus: Joi.string(),
  paymentOrder: Joi.string(),
  estimatedDeliveryDate: Joi.date(),
  deliveredOrder: Joi.date(),
  totalProfit: Joi.number().required(),
  discount: Joi.number().required(),
  ongkir: Joi.number().required(),
  totalPrice: Joi.number().required()
})
