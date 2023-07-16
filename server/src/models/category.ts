import { Schema, model } from 'mongoose'

import { CategoryDTO } from '@/dto'

const CategorySchema = new Schema(
  {
    category: { type: String, trim: true, required: true },
    subCategory: { type: [], default: [], trim: true }
  },
  { timestamps: true }
)

export const Category = model<CategoryDTO>('Category', CategorySchema)
