/* eslint-disable no-unreachable */

import { RatingDTO } from '@/dto'
import { Rating } from '@/models'
import { InternalServerError, logger } from '@/utils'

class RatingRepository {
  getRatings = async (keyword: any) => {
    try {
      return await Rating.find(keyword).populate('user').populate('order').populate('product').sort({
        createdAt: 'desc'
      })
    } catch (err: any) {
      logger.error('ERR = Get rating ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  createRating = async (payload: RatingDTO) => {
    try {
      return await Rating.create({
        user: payload.user,
        order: payload.order,
        product: payload.product,
        detailsId: payload.detailsId,
        rating: payload.rating,
        komentar: payload.komentar
      })
    } catch (err: any) {
      logger.error('ERR = Create new address ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  findOne = async (attr: object) => {
    try {
      return await Rating.findOne(attr)
    } catch (err: any) {
      logger.error('ERR = Find one rating ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  findById = async (ratingId: string) => {
    try {
      return await Rating.findById(ratingId)
    } catch (err: any) {
      logger.error('ERR = Find rating by id ', err.message)
      throw new InternalServerError(err.message)
    }
  }
}

export default RatingRepository
