/* eslint-disable prefer-regex-literals */
import Joi from 'joi'
import { Document } from 'mongoose'

export interface CategoryDTO extends Document {
  category: string
  subCategory: []
}

export const CategoryValidate = Joi.object({
  category: Joi.string().pattern(new RegExp('^[a-zA-Z ]{3,75}$')).required()
})
