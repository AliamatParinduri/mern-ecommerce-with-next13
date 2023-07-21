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
          qty: { type: Number, default: 0 },
          discount: { type: Number, default: 0 }
        }
      ],
      ref: 'Address',
      trim: true
    },
    ongkir: { type: Number, default: 0, trim: true },
    totalPrice: { type: Number, trim: true, required: true },
    paymentType: { type: String, trim: true, required: true },
    paymentStatus: { type: String, enum: ['New Order', 'Pending', 'Approved', 'Rejected'], trim: true, required: true },
    status: { type: String, enum: ['Pending', 'Process', 'On Going', 'Done', 'Cancel'], trim: true, required: true }
  },
  { timestamps: true }
)

export const Order = model<OrderDTO>('Order', OrderSchema)
