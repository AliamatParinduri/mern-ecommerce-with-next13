import { AddressDTO } from '@/dto'
import { AddressRepository, UserRepository } from '@/repository'
import { UnprocessableEntityError } from '@/utils'
import { Request } from 'express'

class AddressService {
  addressRepository = new AddressRepository()
  userRepository = new UserRepository()

  getAddress = async (req: Request) => {
    const { isPrimary, userId }: any = req.params
    let keyword = {}

    if (userId) {
      keyword = { ...keyword, user: userId }
    } else if (isPrimary) {
      keyword = { ...keyword, isPrimary }
    }

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

    const user: any = await this.userRepository.findById(payload.userId)

    if (!user) {
      throw new UnprocessableEntityError('User not Found')
    }

    user.addresses.push(result._id)
    await user.save()

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

    const user: any = await this.userRepository.findById(result.userId)

    if (!user) {
      throw new UnprocessableEntityError('User not Found')
    }

    const newAddresses = user.addresses.filter((address: AddressDTO) => address._id.toString() !== addressId)

    user.addresses = [...newAddresses]
    await user.save()

    return result
  }
}

export default AddressService
