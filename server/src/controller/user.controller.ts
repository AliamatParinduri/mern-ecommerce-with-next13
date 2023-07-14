import { NextFunction, Request, Response } from 'express'

import { UserService } from '@/services'
import { logger } from '@/utils'

class UserController {
  userService = new UserService()

  getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = res.locals.user
      const result = await this.userService.getUsers(req.query.search as string, user)

      const message = 'Success get user data'
      logger.info(message)
      return res.status(200).json({ message, data: result })
    } catch (err: any) {
      next(err)
    }
  }
}

export default UserController
