import { Schema, model } from 'mongoose'

import { AddressDTO } from '@/dto'

const AddressSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', trim: true },
    fullAddress: { type: String, trim: true, required: true },
    kecamatan: { type: String, trim: true, required: true },
    kecamatanId: { type: String, trim: true, required: true },
    kabKot: { type: String, trim: true, required: true },
    kabKotId: { type: String, trim: true, required: true },
    provinsi: { type: String, trim: true, required: true },
    provinsiId: { type: String, trim: true, required: true },
    isPrimary: { type: Boolean, default: false, trim: true }
  },
  { timestamps: true }
)

export const Address = model<AddressDTO>('Address', AddressSchema)
