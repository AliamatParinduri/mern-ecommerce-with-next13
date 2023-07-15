import { NextFunction, Request, Response } from 'express'

import { LoginDTO, LoginSchema, RegisterDTO, RegisterSchema } from '@/dto'
import { AuthService } from '@/services'
import { UnprocessableEntityError, generateToken, logger, validate } from '@/utils'

class AuthController {
  authService = new AuthService()

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body

      validate(body, RegisterSchema)

      const result = await this.authService.register(body as RegisterDTO)

      const message = 'Success Registration new user'
      logger.info(message)
      return res.status(200).json({ message, data: result })
    } catch (err: any) {
      next(err)
    }
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body

      validate(body, LoginSchema)

      const result = await this.authService.login(body as LoginDTO)

      const token = generateToken({ _id: result._id, ...body }, { expiresIn: '1d' })
      if (!token) {
        throw new UnprocessableEntityError('failed to generate token')
      }

      const message = 'Success login'
      logger.info(message)
      return res.status(200).json({ message, token, data: result })
    } catch (err: any) {
      next(err)
    }
  }
}

export default AuthController
