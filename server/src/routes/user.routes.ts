import { UserController } from '@/controller'

import { BaseRoutes } from './base.route'

class UserRoutes extends BaseRoutes {
  async routes() {
    const userController = new UserController()

    this.router.get('/', userController.getUsers)
  }
}

export const userRoutes = new UserRoutes().router
