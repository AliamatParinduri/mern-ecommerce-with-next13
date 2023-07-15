import { Schema, model } from 'mongoose'

import { AddressDTO } from '@/dto'

const AddressSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', trim: true },
    fullAddress: { type: String, trim: true },
    homeNumber: { type: String, trim: true },
    kecamatan: { type: String, trim: true },
    kabKot: { type: String, trim: true },
    provinsi: { type: String, trim: true },
    isPrimary: { type: Boolean, default: false, trim: true }
  },
  { timestamps: true }
)

export const Address = model<AddressDTO>('Address', AddressSchema)
