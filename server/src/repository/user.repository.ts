/* eslint-disable no-unreachable */
import fs from 'fs'
import path from 'path'

import { ProductDTO, RegisterDTO, UserDTO } from '@/dto'
import { User } from '@/models'
import { Cart, InternalServerError, Wishlist, logger } from '@/utils'
import { DefaultPicture } from '@config/index'

class UserRepository {
  getUsers = async (keyword: any, page: number, limit: number) => {
    try {
      const users = await User.find(keyword)
        .find()
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .exec()

      const count = await User.count()

      return {
        users,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      }
    } catch (err: any) {
      logger.error('ERR = get users ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  getCarts = async (user: UserDTO, page: number, limit: number) => {
    try {
      const carts = user.cart
      // .find()
      // .limit(limit * 1)
      // .skip((page - 1) * limit)
      // .exec()

      const count = carts.length

      return {
        carts,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      }
    } catch (err: any) {
      logger.error('ERR = get carts ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  getWishlists = async (user: UserDTO, page: number, limit: number) => {
    try {
      const wishlists = user.wishlist
      // .find()
      // .limit(limit * 1)
      // .skip((page - 1) * limit)
      // .exec()

      const count = wishlists.length

      return {
        wishlists,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      }
    } catch (err: any) {
      logger.error('ERR = get wishlists ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  createUser = async (payload: RegisterDTO) => {
    try {
      return await User.create({
        fullName: payload.fullName,
        username: payload.username,
        email: payload.email,
        noHP: payload.noHP,
        password: payload.password
      })
    } catch (err: any) {
      logger.error('ERR = Registration new user ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  findOne = async (attr: object) => {
    try {
      return await User.findOne(attr)
    } catch (err: any) {
      logger.error('ERR = Find one product ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  findById = async (userId: string) => {
    try {
      return await User.findById(userId)
    } catch (err: any) {
      logger.error('ERR = Find user by id ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  updateUser = async (user: UserDTO, payload: UserDTO) => {
    try {
      user.fullName = payload.fullName
      user.username = payload.username
      user.noHP = payload.noHP

      return await user.save()
    } catch (err: any) {
      logger.error('ERR = update user data ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  addToCart = async (user: UserDTO, product: ProductDTO, qty: number) => {
    try {
      const cartIndex = user.cart.findIndex((cart) => cart.product.equals(product._id))

      if (cartIndex >= 0) {
        user.cart[cartIndex].qty += qty
      } else {
        const newProductToCart = {
          product,
          qty
        }
        user.cart.push(newProductToCart)
      }

      return await user.save()
    } catch (err: any) {
      logger.error('ERR = Add to cart ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  removeFromCart = async (user: any, product: ProductDTO) => {
    try {
      const newCart = user.cart.filter((cart: Cart) => String(cart.product) !== String(product._id))
      user.cart = newCart

      return await user.save()
    } catch (err: any) {
      logger.error('ERR = Remove from cart ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  productWishlist = async (user: any, product: ProductDTO) => {
    try {
      const isProductExist = user.wishlist.findIndex((wishlist: Wishlist) => wishlist.product.equals(product._id))
      let message

      if (isProductExist >= 0) {
        message = 'remove'
        user.wishlist = user.wishlist.filter((wishlist: Wishlist) => String(wishlist.product) !== String(product._id))
      } else {
        message = 'add'
        user.wishlist.push({ product })
      }

      return { message, productWishlist: await user.save() }
    } catch (err: any) {
      logger.error('ERR = update product wishlist ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  updateProfilePicture = async (user: UserDTO, fileName: string) => {
    try {
      const pathImage = path.resolve(__dirname, '..', 'public', 'assets', 'users', user.userPic)
      if (fs.existsSync(pathImage) && user.userPic !== DefaultPicture) {
        fs.unlinkSync(pathImage)
      }

      user.userPic = fileName
      return await user.save()
    } catch (err: any) {
      logger.error('ERR = Update Profile Picture user ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  createNewPassword = async (user: UserDTO, newPassword: string) => {
    try {
      user.password = newPassword
      return await user.save()
    } catch (err: any) {
      logger.error('ERR = Create new password user ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  deleteUser = async (userId: string) => {
    try {
      return await User.findByIdAndRemove(userId)
    } catch (err: any) {
      logger.error('ERR = Delete user data ', err.message)
      throw new InternalServerError(err.message)
    }
  }
}

export default UserRepository
