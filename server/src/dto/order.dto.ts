/* eslint-disable prefer-regex-literals */
import Joi from 'joi'
import { Document } from 'mongoose'
import { UserDTO } from './user.dto'
import { AddressDTO } from './address.dto'
import { ProductDTO } from './product.dto'

export interface OrderDTO extends Document {
  user: UserDTO
  address: AddressDTO
  products: [
    {
      product: ProductDTO
      subTotal: number
      qty: number
    }
  ]
  discount: number
  ongkir: number
  totalPrice: number
}

export const OrderSchema = Joi.object({
  user: Joi.string(),
  address: Joi.string().required(),
  products: Joi.required(),
  discount: Joi.number().required(),
  ongkir: Joi.number().required(),
  totalPrice: Joi.number().required()
})
