import { Schema, model } from 'mongoose'

import { UserDTO } from '@/dto'
import { DefaultPicture } from '@config/index'

const UserSchema = new Schema(
  {
    fullName: { type: String, trim: true, required: true },
    username: { type: String, trim: true, required: true, unique: true },
    email: { type: String, trim: true, required: true, unique: true },
    password: { type: String, trim: true, required: true },
    noHP: { type: String, trim: true, required: true },
    userPic: { type: String, default: DefaultPicture, trim: true },
    isAdmin: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    cart: {
      type: [
        {
          product: { type: Schema.Types.ObjectId, ref: 'Product', trim: true },
          details: { type: Object, trim: true },
          subTotal: { type: Number, trim: true, default: 0 },
          qty: { type: Number, trim: true, default: 0 }
        }
      ],
      default: [],
      trim: true
    },
    wishlist: {
      type: [
        {
          product: { type: Schema.Types.ObjectId, ref: 'Product', trim: true }
        }
      ],
      default: [],
      trim: true
    },
    addresses: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Address',
        trim: true
      }
    ]
  },
  { timestamps: true }
)

export const User = model<UserDTO>('User', UserSchema)
