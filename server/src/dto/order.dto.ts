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
      qty: number
      discount: number
    }
  ]
  ongkir: number
  totalPrice: number
}

export const OrderValidate = Joi.object({
  userId: Joi.string(),
  addressId: Joi.string().required(),
  products: Joi.required(),
  ongkir: Joi.number().required(),
  totalPrice: Joi.number().required()
})
