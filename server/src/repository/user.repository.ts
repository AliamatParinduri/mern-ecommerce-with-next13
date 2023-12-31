/* eslint-disable no-unreachable */
import fs from 'fs'
import path from 'path'

import { ProductDTO, RegisterDTO, UserDTO } from '@/dto'
import { User } from '@/models'
import { InternalServerError, Wishlist, logger } from '@/utils'
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
        username: payload.username.toLowerCase(),
        email: payload.email.toLowerCase(),
        noHP: payload.noHP,
        dateOfBirth: payload.dateOfBirth,
        password: payload.password
      })
    } catch (err: any) {
      logger.error('ERR = Registration new user ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  findOne = async (attr: object) => {
    try {
      return await User.findOne(attr).populate('cart.product').populate('wishlist.product')
    } catch (err: any) {
      logger.error('ERR = Find one product ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  findById = async (userId: string) => {
    try {
      return await User.findById(userId)
        .populate('cart.product')
        .populate('wishlist.product')
        .then((result) => {
          if (!result) {
            throw new InternalServerError('User not found')
          }

          return result
        })
    } catch (err: any) {
      logger.error('ERR = Find user by id ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  getDifferentNewUsersThanBefore = async (dates: any[], keyword: any, type: string) => {
    try {
      let users: any[] = []
      let labels: any[] = []
      let label

      for (const [i, date] of dates.entries()) {
        const user = await User.find({
          ...keyword,
          createdAt: { $gte: dates[i].start, $lte: dates[i].end }
        })
          .sort({ createdAt: 'desc' })
          .countDocuments()

        const dateSplit = date.start.split(' ')
        switch (type) {
          case 'daily':
            label = `${dateSplit[1]} ${dateSplit[2]} ${dateSplit[3]}`
            break
          case 'weekly':
            label = `${dateSplit[1]} ${dateSplit[2]} ${dateSplit[3]}`
            break
          case 'monthly':
            label = `${dateSplit[1]} ${dateSplit[3]}`
            break

          default:
            label = dateSplit[3]
            break
        }
        users = [...users, user]
        labels = [...labels, label]
      }

      return { labels, users }
    } catch (err: any) {
      logger.error('ERR = Get Order ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  updateUser = async (user: UserDTO, payload: UserDTO) => {
    try {
      user.fullName = payload.fullName
      user.username = payload.username
      user.email = payload.email
      user.noHP = payload.noHP
      user.dateOfBirth = payload.dateOfBirth

      return await user.save().then((result) => {
        if (!result) {
          throw new InternalServerError('Failed update data user')
        }

        return result
      })
    } catch (err: any) {
      logger.error('ERR = update user data ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  addToCart = async (user: UserDTO, product: ProductDTO, detailsId: string, qty: number) => {
    try {
      const detailsInProductCart = user.cart.find(
        (cart: any) => cart.product.equals(product._id) && cart.details._id.equals(detailsId)
      )

      const newDetails: any = [...product.details]

      if (!detailsInProductCart) {
        const newProductToCart = {
          product,
          details: newDetails[0],
          subTotal: newDetails[0].price * qty,
          qty
        }
        user.cart.push(newProductToCart)
        return await user.save()
      }

      const cartIndex = user.cart.findIndex((product: any) => product.details._id.equals(detailsId))

      user.cart[cartIndex].details = newDetails[0]
      user.cart[cartIndex].subTotal = newDetails[0].price * (user.cart[cartIndex].qty + qty)
      user.cart[cartIndex].qty += qty
      return await user.save()
    } catch (err: any) {
      logger.error('ERR = Add to cart ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  removeFromCart = async (user: any, product: ProductDTO, detailsId: string) => {
    try {
      const newCart = user.cart.filter(
        (cart: any) =>
          String(cart.product._id) !== String(product._id) || String(cart.details._id) !== String(detailsId)
      )

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
        user.wishlist = user.wishlist.filter(
          (wishlist: Wishlist) => String(wishlist.product._id) !== String(product._id)
        )
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
      return await User.findByIdAndRemove(userId).then((result) => {
        if (!result) {
          throw new InternalServerError('Users Not Found')
        }

        return result
      })
    } catch (err: any) {
      logger.error('ERR = Delete user data ', err.message)
      throw new InternalServerError(err.message)
    }
  }
}

export default UserRepository
