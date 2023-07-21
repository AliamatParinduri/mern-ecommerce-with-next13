import { UserDTO } from '@/dto'
import { ProductRepository, UserRepository } from '@/repository'
import { NotFoundError } from '@/utils'
import { Request } from 'express'

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

    if (!user) {
      throw new NotFoundError('Users Not Found')
    }

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
    const result = await this.userRepository.findById(id)

    if (!result) {
      throw new NotFoundError('Users Not Found')
    }
    return result
  }

  updateUser = async (id: string, payload: UserDTO) => {
    const user = await this.userRepository.findById(id)

    if (!user) {
      throw new NotFoundError('Users Not Found')
    }

    const result = await this.userRepository.updateUser(user, payload)

    return result
  }

  addToCart = async (product: string, qty: number, userId: string) => {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new NotFoundError('User Not Found')
    }

    const prod = await this.productRepository.findById(product)
    if (!prod) {
      throw new NotFoundError('Product Not Found')
    }

    const result = await this.userRepository.addToCart(user, prod, qty)

    return result
  }

  removeFromCart = async (product: string, userId: string) => {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new NotFoundError('User Not Found')
    }

    const prod = await this.productRepository.findById(product)
    if (!prod) {
      throw new NotFoundError('Product Not Found')
    }

    const result = await this.userRepository.removeFromCart(user, prod)

    return result
  }

  productWishlist = async (product: string, userId: string) => {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new NotFoundError('User Not Found')
    }

    const prod = await this.productRepository.findById(product)
    if (!prod) {
      throw new NotFoundError('Product Not Found')
    }

    const result = await this.userRepository.productWishlist(user, prod)

    return result
  }

  updateProfilePicture = async (fileName: string, userId: string) => {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new NotFoundError('User Not Found')
    }

    const result = await this.userRepository.updateProfilePicture(user, fileName)

    return result
  }

  deleteUser = async (id: string) => {
    const result = await this.userRepository.deleteUser(id)

    if (!result) {
      throw new NotFoundError('Users Not Found')
    }
    return result
  }
}

export default UserService
