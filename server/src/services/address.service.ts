import { AddressDTO } from '@/dto'
import { AddressRepository } from '@/repository'
import { UnprocessableEntityError } from '@/utils'

class AddressService {
  addressRepository = new AddressRepository()

  getAddress = async (keyword: any) => {
    const result = await this.addressRepository.getAddress(keyword)

    if (result.length < 0) {
      throw new UnprocessableEntityError('Failed get data address, Data not found')
    }
    return result
  }

  getAddressById = async (addressId: string) => {
    const result = await this.addressRepository.findById(addressId)

    if (!result) {
      throw new UnprocessableEntityError('Failed get data address, Data not found')
    }
    return result
  }

  createAddress = async (payload: AddressDTO) => {
    const result = await this.addressRepository.createAddress(payload)

    if (!result) {
      throw new UnprocessableEntityError('Failed create data address')
    }
    return result
  }

  updateAddress = async (payload: AddressDTO, addressId: string) => {
    const address = await this.addressRepository.findById(addressId)

    if (!address) {
      throw new UnprocessableEntityError('User not found')
    }
    const result = await this.addressRepository.updateAddress(address, payload)

    if (!result) {
      throw new UnprocessableEntityError('Failed update data address')
    }
    return result
  }

  deleteAddress = async (addressId: string) => {
    const result = await this.addressRepository.deleteAddress(addressId)

    if (!result) {
      throw new UnprocessableEntityError('Failed update data address')
    }
    return result
  }
}

export default AddressService
