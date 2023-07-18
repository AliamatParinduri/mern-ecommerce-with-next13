import { NextFunction, Request, Response } from 'express'

import { UserService } from '@/services'
import { UnprocessableEntityError, logger } from '@/utils'
import { DefaultPicture } from '@config/index'

class UserController {
  userService = new UserService()

  getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page = 1, limit = 10 } = req.query
      const result = await this.userService.getUsers(page as number, limit as number)

      const message = 'Success get user data'
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

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const data = req.body
      const result = await this.userService.updateUser(id, data)

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
        throw new UnprocessableEntityError('Failed update profile picture')
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
