import { AuthController } from '@/controller'

import { BaseRoutes } from './base.route'

class AuthRoutes extends BaseRoutes {
  async routes() {
    const authController = new AuthController()

    this.router.get('/:id/verifyAccount', authController.verifyAccount)
    this.router.post('/register', authController.register)
    this.router.post('/login', authController.login)
    this.router.post('/forgotPassword', authController.forgotPassword)
  }
}

export const authRoutes = new AuthRoutes().router
