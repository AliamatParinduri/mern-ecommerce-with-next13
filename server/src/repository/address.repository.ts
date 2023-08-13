/* eslint-disable no-unreachable */

import { AddressDTO } from '@/dto'
import { Address } from '@/models'
import { InternalServerError, logger } from '@/utils'

class AddressRepository {
  getAddress = async (keyword: any) => {
    try {
      return await Address.find(keyword)
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
        kabKot: payload.kabKot,
        provinsi: payload.provinsi,
        isPrimary: payload.isPrimary
      })
    } catch (err: any) {
      logger.error('ERR = Create new address ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  findOne = async (attr: object) => {
    try {
      return await Address.findOne(attr)
    } catch (err: any) {
      logger.error('ERR = Find one address ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  findById = async (addressId: string) => {
    try {
      return await Address.findById(addressId)
    } catch (err: any) {
      logger.error('ERR = Find address by id ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  updateAddress = async (address: AddressDTO, payload: AddressDTO) => {
    try {
      address.fullAddress = payload.fullAddress
      address.kecamatan = payload.kecamatan
      address.kabKot = payload.kabKot
      address.provinsi = payload.provinsi
      address.isPrimary = payload.isPrimary

      return await address.save()
    } catch (err: any) {
      logger.error('ERR = Update data category ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  deleteAddress = async (addressId: string) => {
    try {
      return await Address.findByIdAndRemove(addressId)
    } catch (err: any) {
      logger.error('ERR = Update data category ', err.message)
      throw new InternalServerError(err.message)
    }
  }
}

export default AddressRepository
