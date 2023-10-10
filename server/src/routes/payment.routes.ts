import { PaymentController } from '@/controller'

import { BaseRoutes } from './base.route'
import { requireLogin } from '@/middlewares'

class PaymentRoutes extends BaseRoutes {
  async routes() {
    const paymentController = new PaymentController()

    this.router.post('/process-transaction', requireLogin, paymentController.createPayment)
  }
}

export const paymentRoutes = new PaymentRoutes().router
