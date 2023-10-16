/* eslint-disable no-unreachable */

import { AddressDTO } from '@/dto'
import { Address } from '@/models'
import { InternalServerError, logger } from '@/utils'

class AddressRepository {
  getAddress = async (keyword: any) => {
    try {
      return await Address.find(keyword).then((result) => {
        if (result.length < 0) {
          throw new InternalServerError('Failed get data address, Data not found')
        }

        return result
      })
    } catch (err: any) {
      logger.error('ERR = Get address ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  createAddress = async (payload: AddressDTO) => {
    try {
      return await Address.create({
        userId: payload.userId,
        fullAddress: payload.fullAddress,
        kecamatan: payload.kecamatan,
        kecamatanId: payload.kecamatanId,
        kabKot: payload.kabKot,
        kabKotId: payload.kabKotId,
        provinsi: payload.provinsi,
        provinsiId: payload.provinsiId,
        isPrimary: payload.isPrimary
      }).then((result) => {
        if (!result) {
          throw new InternalServerError('Failed create data address')
        }

        return result
      })
    } catch (err: any) {
      logger.error('ERR = Create new address ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  findById = async (addressId: string) => {
    try {
      return await Address.findById(addressId).then((result) => {
        if (!result) {
          throw new InternalServerError('Failed get data address, Data not found')
        }

        return result
      })
    } catch (err: any) {
      logger.error('ERR = Find address by id ', err.description)
      throw new InternalServerError(err.description)
    }
  }

  updateAddress = async (address: AddressDTO, payload: AddressDTO) => {
    try {
      address.userId = payload.userId
      address.fullAddress = payload.fullAddress
      address.kecamatan = payload.kecamatan
      address.kecamatanId = payload.kecamatanId
      address.kabKot = payload.kabKot
      address.kabKotId = payload.kabKotId
      address.provinsi = payload.provinsi
      address.provinsiId = payload.provinsiId
      address.isPrimary = payload.isPrimary

      return await address.save().then((result) => {
        if (!result) {
          throw new InternalServerError('Failed update data address')
        }

        return result
      })
    } catch (err: any) {
      logger.error('ERR = Update data address ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  deleteAddress = async (addressId: string) => {
    try {
      return await Address.findByIdAndRemove(addressId).then((result) => {
        if (!result) {
          throw new InternalServerError('Failed update data address')
        }

        return result
      })
    } catch (err: any) {
      logger.error('ERR = Delete data address ', err.message)
      throw new InternalServerError(err.message)
    }
  }
}

export default AddressRepository
