import { Schema, model } from 'mongoose'

import { ProductDTO } from '@/dto'

const ProductSchema = new Schema(
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
          colors: {
            type: [
              {
                color: { type: String, trim: true },
                hexColor: { type: String, trim: true }
              }
            ],
            default: [],
            trim: true
          }
        }
      ],
      default: [],
      trim: true
    }
  },
  { timestamps: true }
)

export const Product = model<ProductDTO>('Product', ProductSchema)
