/* eslint-disable array-callback-return */
import { RatingDTO } from '@/dto'
import { ProductRepository, RatingRepository } from '@/repository'
import { UnprocessableEntityError } from '@/utils'
import { Request } from 'express'

class RatingService {
  ratingRepository = new RatingRepository()
  productRepository = new ProductRepository()

  getRatings = async (req: Request) => {
    const keyword = { ...req.query }

    const result = await this.ratingRepository.getRatings(keyword)

    if (result.length < 0) {
      throw new UnprocessableEntityError('Failed get data ratings, Data not found')
    }
    return result
  }

  getRatingById = async (ratingId: string) => {
    const result = await this.ratingRepository.findById(ratingId)

    if (!result) {
      throw new UnprocessableEntityError('Failed get data address, Data not found')
    }
    return result
  }

  createRating = async (payload: RatingDTO) => {
    const isRatingExist = await this.ratingRepository.findOne({
      order: payload.order,
      user: payload.user,
      detailsId: payload.detailsId
    })

    if (isRatingExist) {
      throw new UnprocessableEntityError('rating already exist')
    }

    const product: any = await this.productRepository.findOne({
      _id: payload.product,
      'details._id': payload.detailsId
    })

    if (!product) {
      throw new UnprocessableEntityError('Product details not found')
    }

    const result = await this.ratingRepository.createRating(payload)

    if (!result) {
      throw new UnprocessableEntityError('Failed create rating')
    }

    const productRating = await this.ratingRepository.getRatings({
      detailsId: payload.detailsId
    })

    let sumRating = 0
    productRating.map((prod: any) => {
      sumRating += prod.rating
    })

    const index = product.details.findIndex((details: any) => details._id.equals(payload.detailsId))

    const avgRating = sumRating / productRating.length

    product.details[index].rating = avgRating
    product.details[index].totalRating = productRating.length
    product.save()

    return result
  }
}

export default RatingService
