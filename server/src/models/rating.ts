import { Schema, model } from 'mongoose'

import { RatingDTO } from '@/dto'

const RatingSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', trim: true },
    order: { type: Schema.Types.ObjectId, ref: 'Order', trim: true },
    product: { type: Schema.Types.ObjectId, ref: 'Product', trim: true },
    detailsId: { type: String, trim: true, required: true },
    rating: { type: Number, trim: true, required: true },
    komentar: { type: String, trim: true }
  },
  { timestamps: true }
)

export const Rating = model<RatingDTO>('Rating', RatingSchema)
