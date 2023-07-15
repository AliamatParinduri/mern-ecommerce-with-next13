import { Schema, model } from 'mongoose'

import { OrderDTO } from '@/dto'

const OrderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', trim: true },
    address: { type: Schema.Types.ObjectId, ref: 'Address', trim: true },
    products: {
      type: [
        {
          product: { type: Schema.Types.ObjectId, ref: 'Product' },
          qty: { type: Number },
          discount: { type: Number }
        }
      ],
      ref: 'Address',
      trim: true
    },
    ongkir: { type: Number, trim: true },
    totalPrice: { type: Number, trim: true }
  },
  { timestamps: true }
)

export const Order = model<OrderDTO>('Order', OrderSchema)
