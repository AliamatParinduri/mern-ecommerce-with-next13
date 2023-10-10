import { Schema, model } from 'mongoose'

import { OrderDTO } from '@/dto'

const OrderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', trim: true },
    address: { type: Object, trim: true },
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
    paymentStatus: {
      type: String,
      enum: ['UnPaid', 'Paid'],
      default: 'UnPaid'
    },
    paymentOrder: {
      type: String,
      enum: ['Process', 'Delivery', 'Done'],
      default: 'Process'
    },
    estimatedDeliveryDate: { type: Date },
    deliveredOrder: { type: Date },
    discount: { type: Number, default: 0 },
    ongkir: { type: Number, default: 0, trim: true },
    totalPrice: { type: Number, trim: true, required: true },
    totalProfit: { type: Number, trim: true }
  },
  { timestamps: true }
)

export const Order = model<OrderDTO>('Order', OrderSchema)
