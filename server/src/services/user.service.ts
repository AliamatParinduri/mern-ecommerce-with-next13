import { Request } from 'express'

import { UserDTO } from '@/dto'
import { ProductRepository, UserRepository } from '@/repository'
import { NotFoundError, UnprocessableEntityError } from '@/utils'

class UserService {
  userRepository = new UserRepository()
  productRepository = new ProductRepository()

  getUsers = async (req: Request, page: number, limit: number) => {
    const keyword = req.query.search
      ? {
          $or: [
            { fullName: { $regex: req.query.search, $options: 'i' } },
            { username: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } }
          ]
        }
      : {}

    const result = await this.userRepository.getUsers(keyword, page, limit)

    if (!result) {
      throw new NotFoundError('Users Not Found')
    }
    return result
  }

  getCarts = async (id: string, page: number, limit: number) => {
    const user = await this.userRepository.findById(id)

    const result = await this.userRepository.getCarts(user, page, limit)

    if (!result) {
      throw new NotFoundError('Users Not Found')
    }
    return result
  }

  getWishlists = async (id: string, page: number, limit: number) => {
    const user = await this.userRepository.findById(id)

    if (!user) {
      throw new NotFoundError('Users Not Found')
    }

    const result = await this.userRepository.getWishlists(user, page, limit)

    if (!result) {
      throw new NotFoundError('Users Not Found')
    }
    return result
  }

  getUserById = async (id: string) => {
    return await this.userRepository.findById(id)
  }

  updateUser = async (id: string, payload: UserDTO) => {
    const emailExists = await this.userRepository.findOne({
      _id: { $ne: id },
      email: payload.email
    })
    const userExists = await this.userRepository.findOne({
      _id: { $ne: id },
      username: payload.username
    })
    if (emailExists || userExists) {
      throw new UnprocessableEntityError(`${emailExists ? 'Email' : 'Username'} already exists`)
    }

    const user = await this.userRepository.findById(id)

    return await this.userRepository.updateUser(user, payload)
  }

  addToCart = async (detailsId: string, qty: number, userId: string) => {
    const user = await this.userRepository.findById(userId)

    const prod = await this.productRepository.findDetailsProduct(detailsId)

    const newProductDetail = prod.details.filter((detail: any) => detail._id.equals(detailsId)) as []
    prod.details = [...newProductDetail]

    const result = await this.userRepository.addToCart(user, prod, detailsId, qty)
    return result
  }

  removeFromCart = async (detailsId: string, userId: string) => {
    const user = await this.userRepository.findById(userId)

    const prod = await this.productRepository.findDetailsProduct(detailsId)

    const result = await this.userRepository.removeFromCart(user, prod, detailsId)
    return result
  }

  productWishlist = async (product: string, userId: string) => {
    const user = await this.userRepository.findById(userId)

    const prod = await this.productRepository.findById(product)

    const result = await this.userRepository.productWishlist(user, prod)

    return result
  }

  updateProfilePicture = async (fileName: string, userId: string) => {
    const user = await this.userRepository.findById(userId)

    const result = await this.userRepository.updateProfilePicture(user, fileName)

    return result
  }

  deleteUser = async (id: string) => {
    return await this.userRepository.deleteUser(id)
  }
}

export default UserService
