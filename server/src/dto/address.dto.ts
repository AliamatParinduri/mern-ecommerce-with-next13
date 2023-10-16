/* eslint-disable prefer-regex-literals */
import Joi from 'joi'
import { Document } from 'mongoose'

export interface AddressDTO extends Document {
  userId: string
  fullAddress: Text
  kecamatan: string
  kecamatanId: string
  kabKot: string
  kabKotId: string
  provinsi: string
  provinsiId: string
  isPrimary: boolean
}

export const AddressSchema = Joi.object({
  userId: Joi.string().required(),
  fullAddress: Joi.string().required(),
  kecamatan: Joi.string().required(),
  kecamatanId: Joi.string().required(),
  kabKot: Joi.string().required(),
  kabKotId: Joi.string().required(),
  provinsi: Joi.string().required(),
  provinsiId: Joi.string().required(),
  isPrimary: Joi.boolean().required()
})
