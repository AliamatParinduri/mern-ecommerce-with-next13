import { NextFunction, Request, Response } from 'express'

import { RegisterSchema, LoginDTO, LoginSchema, RegisterDTO } from '@/dto'
import { AuthService } from '@/services'
import { UnprocessableEntityError, generateToken, logger, validate } from '@/utils'
import { sendEmail } from '@/utils/sendEmail'

class AuthController {
  authService = new AuthService()

  verifyAccount = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params

      const result = await this.authService.verifyAccount(id)

      const message = 'Success activated user'
      logger.info(message)
      return res.status(200).json({ message, data: result })
    } catch (err: any) {
      next(err)
    }
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body

      validate(body, RegisterSchema)

      const result = await this.authService.register(body as RegisterDTO)

      await this.sendEmail(result._id, result.email, 'verify user', next)

      const message = 'Success Registration new user, please check email for verify user'
      logger.info(message)
      return res.status(201).json({ message, data: result })
    } catch (err: any) {
      next(err)
    }
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body

      validate(body, LoginSchema)

      const user = await this.authService.login(body as LoginDTO)

      const token = generateToken({ _id: user._id, isAdmin: user.isAdmin, ...body }, { expiresIn: '1d' })
      if (!token) {
        throw new UnprocessableEntityError('Failed to generate token')
      }

      const message = 'Success login'
      logger.info(message)
      return res.status(200).json({ message, token, data: user })
    } catch (err: any) {
      next(err)
    }
  }

  forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email } = req.body

      const user = await this.authService.forgotPassword(email)

      await this.sendEmail(user._id, user.email, 'forgot password', next)

      const message = 'Success send email, please check email for update your password'
      logger.info(message)
      return res.status(200).json({ message })
    } catch (err: any) {
      next(err)
    }
  }

  sendEmail = async (userId: string, email: string, info: string, next: NextFunction) => {
    try {
      await sendEmail(userId, email, info)

      logger.info(`Success send ${info} Email`)
    } catch (err: any) {
      next(err)
    }
  }

  createNewPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const { password } = req.body

      const user = await this.authService.createNewPassword(id, password)

      await this.sendEmail(user._id, user.email, 'forgot password', next)

      const message = 'Success create new password user'
      logger.info(message)
      return res.status(200).json({ message })
    } catch (err: any) {
      next(err)
    }
  }
}

export default AuthController
