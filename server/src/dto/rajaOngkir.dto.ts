import Joi from 'joi'
import { Document } from 'mongoose'

export interface RajaOngkirDTO extends Document {
  destination: number
  destinationType: Text
  weight: number
  courier: string
}

export const RajaOngkirSchema = Joi.object({
  destination: Joi.number().required(),
  destinationType: Joi.string().required(),
  weight: Joi.number().required(),
  courier: Joi.string().required()
})
