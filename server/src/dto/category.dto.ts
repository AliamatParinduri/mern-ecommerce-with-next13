/* eslint-disable prefer-regex-literals */
import Joi from 'joi'
import { Document } from 'mongoose'

export interface CategoryDTO extends Document {
  category: string
  subCategory: []
}

export const CategorySchema = Joi.object({
  category: Joi.string().min(3).pattern(new RegExp('^[a-zA-Z ]{3,75}$')).required(),
  subCategory: Joi.array()
})
