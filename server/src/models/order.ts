import { Schema, model } from 'mongoose'

import { OrderDTO } from '@/dto'

const OrderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', trim: true },
    address: { type: Schema.Types.ObjectId, ref: 'Address', trim: true, required: true },
    products: {
      type: [
        {
          product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
          details: { type: Object, trim: true },
          subTotal: { type: Number, trim: true, default: 0 },
          qty: { type: Number, default: 0 }
        }
      ],
      ref: 'Address',
      trim: true
    },
    discount: { type: Number, default: 0 },
    ongkir: { type: Number, default: 0, trim: true },
    totalPrice: { type: Number, trim: true, required: true }
  },
  { timestamps: true }
)

export const Order = model<OrderDTO>('Order', OrderSchema)
