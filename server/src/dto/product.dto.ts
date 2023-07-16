/* eslint-disable prefer-regex-literals */
import Joi from 'joi'
import { Document } from 'mongoose'
import { CategoryDTO } from './category.dto'

export interface ProductDTO extends Document {
  nmProduct: string
  category: CategoryDTO
  subCategory: string
  details: []
  price: number
  stock: number
  size: []
  colors: []
  pic: string
}

export const ProductSchema = Joi.object({
  nmProduct: Joi.string().pattern(new RegExp('^[a-zA-Z 0-9]{3,75}$')).required(),
  subCategory: Joi.string().pattern(new RegExp('^[a-zA-Z 0-9]{3,75}$')).required(),
  category: Joi.string().required(),
  details: Joi.required()
})
