import { NextFunction, Request, Response } from 'express'

import { UserService } from '@/services'
import { UnprocessableEntityError, logger, validate } from '@/utils'
import { DefaultPicture } from '@config/index'
import { UserUpdateSchema } from '@/dto'

class UserController {
  userService = new UserService()

  getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page = 1, limit = 10 } = req.query
      const result = await this.userService.getUsers(req, page as number, limit as number)

      const message = 'Success get user data'
      logger.info(message)
      return res.status(200).json({ message, data: result })
    } catch (err: any) {
      next(err)
    }
  }

  getCarts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const { page = 1, limit = 10 } = req.query

      const result = await this.userService.getCarts(id, page as number, limit as number)

      const message = 'Success get user carts'
      logger.info(message)
      return res.status(200).json({ message, data: result })
    } catch (err: any) {
      next(err)
    }
  }

  getWishlists = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const { page = 1, limit = 10 } = req.query
      const result = await this.userService.getWishlists(id, page as number, limit as number)

      const message = 'Success get user wishlists'
      logger.info(message)
      return res.status(200).json({ message, data: result })
    } catch (err: any) {
      next(err)
    }
  }

  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const result = await this.userService.getUserById(id)

      const message = 'Success get user By ID'
      logger.info(message)
      return res.status(200).json({ message, data: result })
    } catch (err: any) {
      next(err)
    }
  }

  getReportUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.userService.getReportUsers(req)

      const message = 'Success get user data'
      logger.info(message)
      return res.status(200).json({ message, data: result })
    } catch (err: any) {
      next(err)
    }
  }

  addToCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const body = req.body

      const result = await this.userService.addToCart(body.detailsId, body.qty, id)
      if (!result) {
        throw new UnprocessableEntityError('Failed add product to cart')
      }

      const message = 'Success add product to cart'
      logger.info(message)
      return res.status(200).json({ message, data: result })
    } catch (err: any) {
      next(err)
    }
  }

  removeFromCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const body = req.body

      const result = await this.userService.removeFromCart(body.detailsId, id)
      if (!result) {
        throw new UnprocessableEntityError('Failed remove product from cart')
      }

      const message = 'Success remove product from cart'
      logger.info(message)
      return res.status(200).json({ message, data: result })
    } catch (err: any) {
      next(err)
    }
  }

  productWishlist = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const body = req.body

      const result = await this.userService.productWishlist(body.product, id)
      if (!result.productWishlist) {
        throw new UnprocessableEntityError(
          `Failed ${result.message} product ${result.message === 'add' ? 'to' : 'from'} wishlist`
        )
      }

      const message = `Success ${result.message} product ${result.message === 'add' ? 'to' : 'from'} wishlist`
      logger.info(message)
      return res.status(200).json({ message, data: result.productWishlist })
    } catch (err: any) {
      next(err)
    }
  }

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const body = req.body

      validate(body, UserUpdateSchema)

      const result = await this.userService.updateUser(id, body)

      const message = 'Success update user data'
      logger.info(message)
      return res.status(200).json({ message, data: result })
    } catch (err: any) {
      next(err)
    }
  }

  updateProfileImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const file = req.file

      if (!file) {
        throw new UnprocessableEntityError('Picture not found')
      }

      const result = await this.userService.updateProfilePicture(file.filename, id)
      if (!result) {
        throw new UnprocessableEntityError('Failed update profile picture')
      }

      const message = 'Success update profile picture'
      logger.info(message)
      return res.status(200).json({ message, data: result })
    } catch (err: any) {
      next(err)
    }
  }

  deleteProfileImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params

      const result = await this.userService.updateProfilePicture(DefaultPicture, id)
      if (!result) {
        throw new UnprocessableEntityError('Failed delete profile picture')
      }

      const message = 'Success delete profile picture'
      logger.info(message)
      return res.status(200).json({ message, data: result })
    } catch (err: any) {
      next(err)
    }
  }

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const result = await this.userService.deleteUser(id)

      const message = 'Success delete user data'
      logger.info(message)
      return res.status(200).json({ message, data: result })
    } catch (err: any) {
      next(err)
    }
  }
}

export default UserController
