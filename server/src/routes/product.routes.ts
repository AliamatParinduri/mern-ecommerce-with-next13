import { ProductController } from '@/controller'
import { BaseRoutes } from './base.route'
import { requireAdmin } from '@/middlewares'

class ProductRoutes extends BaseRoutes {
  async routes() {
    const productController = new ProductController()

    this.router.post('/', requireAdmin, productController.createProduct)
  }
}

export const productRoutes = new ProductRoutes().router
