/* eslint-disable prefer-regex-literals */
import Joi from 'joi'
import { Document } from 'mongoose'
import { UserDTO } from './user.dto'

export interface AddressDTO extends Document {
  user: UserDTO
  fullAddress: Text
  kecamatan: string
  kabKot: string
  provinsi: string
  isPrimary: boolean
}

export const AddressSchema = Joi.object({
  userId: Joi.string(),
  fullAddress: Joi.string().required(),
  kecamatan: Joi.string().required(),
  kabKot: Joi.string().required(),
  provinsi: Joi.string().required(),
  isPrimary: Joi.boolean().required()
})
