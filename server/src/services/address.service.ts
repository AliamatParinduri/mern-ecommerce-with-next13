import { AddressDTO } from '@/dto'
import { AddressRepository, UserRepository } from '@/repository'
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

    return await this.addressRepository.getAddress(keyword)
  }

  getAddressById = async (addressId: string) => {
    return await this.addressRepository.findById(addressId)
  }

  createAddress = async (payload: AddressDTO) => {
    const result = await this.addressRepository.createAddress(payload)

    const user: any = await this.userRepository.findById(payload.userId)

    user.addresses.push(result._id)
    await user.save()

    return result
  }

  updateAddress = async (payload: AddressDTO, addressId: string) => {
    const address = await this.addressRepository.findById(addressId)

    return await this.addressRepository.updateAddress(address as AddressDTO, payload)
  }

  deleteAddress = async (addressId: string) => {
    const result = await this.addressRepository.deleteAddress(addressId)

    const user: any = await this.userRepository.findById(result.userId)

    const newAddresses = user.addresses.filter((address: AddressDTO) => address._id.toString() !== addressId)

    user.addresses = [...newAddresses]
    await user.save()

    return result
  }
}

export default AddressService
