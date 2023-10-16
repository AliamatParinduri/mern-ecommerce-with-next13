import Joi from 'joi'
import { Document } from 'mongoose'

export interface PaymentDTO extends Document {
  orderId: string
  total: number
  name: string
  email: string
  noHP: string
}

export interface createTransactionDTO extends Document {
  transaction_details: {
    order_id: string
    gross_amount: number
  }
  customers_details: {
    first_name: string
    email: string
    phone: string
  }
}

export const PaymentSchema = Joi.object({
  orderId: Joi.string().required(),
  total: Joi.number().required(),
  email: Joi.string().email({ minDomainSegments: 2, tlds: false }).required(),
  name: Joi.string().required(),
  noHP: Joi.string().min(11).max(13).required()
})
