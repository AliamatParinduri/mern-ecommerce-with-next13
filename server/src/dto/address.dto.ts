/* eslint-disable prefer-regex-literals */
import Joi from 'joi'
import { Document } from 'mongoose'

export interface AddressDTO extends Document {
  userId: string
  fullAddress: Text
  kecamatan: string
  kabKot: string
  provinsi: string
  isPrimary: boolean
}

export const AddressSchema = Joi.object({
  userId: Joi.string().required(),
  fullAddress: Joi.string().required(),
  kecamatan: Joi.string().required(),
  kabKot: Joi.string().required(),
  provinsi: Joi.string().required()
})
