import { NextFunction, Request, Response } from 'express'

import { LoginDTO, LoginSchema, RegisterDTO, RegisterSchema } from '@/dto'
import { AuthService } from '@/services'
import { logger, validate } from '@/utils'

class AuthController {
  authService = new AuthService()

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body

      validate(body, RegisterSchema)

      const result = await this.authService.register(body as RegisterDTO)

      logger.info('Success Registration new user')
      return res.status(200).json({ message: 'Success Registration new user', data: result })
    } catch (err: any) {
      next(err)
    }
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body

      validate(body, LoginSchema)

      const result = await this.authService.login(body as LoginDTO)

      logger.info('Success login')
      return res.status(200).json({ message: 'Success login', data: result })
    } catch (err: any) {
      next(err)
    }
  }
}

export default AuthController
