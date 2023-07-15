import { Schema, model } from 'mongoose'

import { ProductDTO } from '@/dto'

const ProductSchema = new Schema(
  {
    nmProduct: { type: String, trim: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', trim: true },
    price: { type: Number, trim: true },
    stock: { type: Number, trim: true },
    pic: { type: String, trim: true },
    sizes: { type: [], default: [], trim: true },
    colors: { type: [], default: [], trim: true }
  },
  { timestamps: true }
)

export const Product = model<ProductDTO>('Product', ProductSchema)
