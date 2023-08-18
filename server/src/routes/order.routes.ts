import { OrderController } from '@/controller'

import { BaseRoutes } from './base.route'
import { requireAdmin, requireLogin } from '@/middlewares'

class OrderRoutes extends BaseRoutes {
  async routes() {
    const orderController = new OrderController()

    this.router.get('/', requireLogin, orderController.getOrders)
    this.router.get('/:id', requireLogin, orderController.getOrderById)
    this.router.post('/', requireLogin, orderController.createOrder)
    this.router.put('/:id', requireAdmin, orderController.updateOrder)
    this.router.delete('/:id', requireAdmin, orderController.deleteOrder)
  }
}

export const orderRoutes = new OrderRoutes().router
