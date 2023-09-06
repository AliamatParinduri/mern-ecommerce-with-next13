import { NextFunction, Request, Response } from 'express'

import { RatingDTO, RatingSchema } from '@/dto'
import { RatingService } from '@/services'
import { logger, validate } from '@/utils'

class RatingController {
  ratingService = new RatingService()

  getRatings = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.ratingService.getRatings(req)

      const message = 'Success get data ratings'
      logger.info(message)
      return res.status(200).json({ message, data: result })
    } catch (err: any) {
      next(err)
    }
  }

  getRatingById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ratingId = req.params.id

      const result = await this.ratingService.getRatingById(ratingId)

      const message = 'Success get data rating by id'
      logger.info(message)
      return res.status(200).json({ message, data: result })
    } catch (err: any) {
      next(err)
    }
  }

  addRating = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body

      validate(body, RatingSchema)

      const result = await this.ratingService.createRating(body as RatingDTO)

      const message = 'Success create rating'
      logger.info(message)
      return res.status(200).json({ message, data: result })
    } catch (err: any) {
      next(err)
    }
  }
}

export default RatingController
