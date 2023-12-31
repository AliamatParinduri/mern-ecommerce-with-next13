/* eslint-disable no-useless-escape */
/* eslint-disable prefer-regex-literals */
import Joi from 'joi'
import { Document } from 'mongoose'
import { CategoryDTO } from './category.dto'

export interface ProductDTO extends Document {
  nmProduct: string
  category: CategoryDTO
  subCategory: string
  details: []
  rating: string
  description: string
  price: number
  stock: number
  size: []
  colors: []
  pic: string[]
}

export const ProductSchema = Joi.object({
  nmProduct: Joi.string().pattern(new RegExp('^[a-zA-Z 0-9-/_&()]{3,75}$')).required().messages({
    'string.pattern.base': 'Format Product Name Invalid.'
  }),
  subCategory: Joi.string().pattern(new RegExp('^[a-zA-Z 0-9]{3,75}$')).required(),
  category: Joi.string().required(),
  details: Joi.required(),
  description: Joi.required()
})
