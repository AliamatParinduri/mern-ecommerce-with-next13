import { RatingController } from '@/controller'

import { BaseRoutes } from './base.route'
import { requireLogin } from '@/middlewares'

class RatingRoutes extends BaseRoutes {
  async routes() {
    const ratingController = new RatingController()

    this.router.get('/', requireLogin, ratingController.getRatings)
    this.router.get('/:id', requireLogin, ratingController.getRatingById)
    this.router.post('/', requireLogin, ratingController.addRating)
  }
}

export const ratingRoutes = new RatingRoutes().router
