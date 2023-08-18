import { Schema, model } from 'mongoose'

import { ProductDTO } from '@/dto'

export const ProductSchema = new Schema(
  {
    nmProduct: { type: String, trim: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', trim: true, required: true },
    subCategory: { type: String, trim: true, required: true },
    pic: { type: [], default: [], trim: true },
    details: {
      type: [
        {
          price: { type: Number, trim: true, required: true },
          stock: { type: Number, trim: true, required: true },
          size: { type: String, trim: true, required: true },
          rating: { type: String, default: '0', trim: true, required: true },
          totalRating: { type: Number, default: 0, trim: true, required: true },
          totalOrder: { type: Number, default: 0, trim: true, required: true },
          color: { type: String, trim: true },
          hexColor: { type: String, trim: true }
        }
      ],
      default: [],
      trim: true
    },
    description: { type: String, trim: true, required: true }
  },
  { timestamps: true }
)

export const Product = model<ProductDTO>('Product', ProductSchema)
