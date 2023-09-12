/* eslint-disable prefer-regex-literals */
import Joi from 'joi'
import { Document } from 'mongoose'

export interface CategoryDTO extends Document {
  category: string
  subCategory: []
}

export const CategorySchema = Joi.object({
  category: Joi.string().min(3).pattern(new RegExp('^[a-zA-Z-_& ]{3,75}$')).required().messages({
    'string.pattern.base': 'Format Category Name Invalid.'
  }),
  subCategory: Joi.array()
})
