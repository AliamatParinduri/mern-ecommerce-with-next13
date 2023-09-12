import { RatingController } from '@/controller'

import { BaseRoutes } from './base.route'
import { requireLogin } from '@/middlewares'

class RatingRoutes extends BaseRoutes {
  async routes() {
    const ratingController = new RatingController()

    this.router.get('/', ratingController.getRatings)
    this.router.get('/:id', ratingController.getRatingById)
    this.router.post('/', requireLogin, ratingController.addRating)
  }
}

export const ratingRoutes = new RatingRoutes().router
