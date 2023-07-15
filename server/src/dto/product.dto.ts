/* eslint-disable prefer-regex-literals */
import Joi from 'joi'
import { Document } from 'mongoose'
import { CategoryDTO } from './category.dto'

export interface ProductDTO extends Document {
  nmProduct: string
  category: CategoryDTO
  price: number
  stock: number
  sizes: []
  colors: []
  pic: string
}

export const ProductValidate = Joi.object({
  nmProduct: Joi.string().pattern(new RegExp('^[a-zA-Z ]{3,75}$')).required(),
  categoryId: Joi.string().required(),
  price: Joi.number().required(),
  stock: Joi.number().required(),
  pic: Joi.required()
})
