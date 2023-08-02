import { NextFunction, Request, Response } from 'express'

import { UnauthorizedError, UserToken, logger, verifyToken } from '@/utils'

export const CheckToken = async (req: Request, next: NextFunction) => {
  try {
    const accessToken = req.headers.authorization

    if (!accessToken) {
      logger.error('ERR = Auth - check authorization headers')
      throw new UnauthorizedError('Request token not send by user!')
    }
    const [isBearer, token] = accessToken.split(' ')

    if (isBearer !== 'Bearer') {
      logger.error('ERR = Auth - check type Bearer')
      throw new UnauthorizedError('unAuthorized!')
    }

    if (!token) {
      logger.error('ERR = Auth - check Token')
      throw new UnauthorizedError('unAuthorized!')
    }

    const user: UserToken = verifyToken(token)
    if (!user) {
      logger.error('ERR = Auth - user not found')
      throw new UnauthorizedError('user not found!')
    }

    return user
  } catch (err: any) {
    logger.error('ERR = Auth - ', err.message)
    next(err)
  }
}

export const requireLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await CheckToken(req, next)
    res.locals.user = user
    next()
  } catch (err: any) {
    logger.error('ERR = Auth Require Login - ', err.message)
    next(err)
  }
}

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await CheckToken(req, next)

    if (!user!.isAdmin) {
      logger.error(`ERR = Auth - Access Denied, you're not admin!`)
      next({ statusCode: 401, message: 'Unauthorized', description: `Access Denied, you're not admin!` })
    }
    res.locals.user = user
    next()
  } catch (err: any) {
    logger.error('ERR = Auth Require Admin - ', err.message)
    next(err)
  }
}
