import { Schema, model } from 'mongoose'

import { UserDTO } from '@/dto'

const UserSchema = new Schema(
  {
    fullName: { type: String, trim: true, required: true },
    username: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true },
    password: { type: String, trim: true, required: true },
    noHP: { type: String, trim: true, required: true },
    userPic: { type: String, default: 'user-default.png', trim: true },
    isAdmin: { type: Boolean, default: false },
    isActive: { type: Boolean, default: false },
    cart: { type: [], default: [], trim: true },
    wishlist: [{ type: [], default: [], trim: true }]
  },
  { timestamps: true }
)

export const User = model<UserDTO>('User', UserSchema)
