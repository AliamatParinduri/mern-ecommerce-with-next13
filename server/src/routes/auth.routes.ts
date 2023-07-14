import { AuthController } from '@/controller'

import { BaseRoutes } from './base.route'

class AuthRoutes extends BaseRoutes {
  async routes() {
    const authController = new AuthController()

    this.router.post('/register', authController.register)
    this.router.post('/login', authController.login)
  }
}

export const authRoutes = new AuthRoutes().router
