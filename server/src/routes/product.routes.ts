import { ProductController } from '@/controller'
import { requireAdmin } from '@/middlewares'
import { upload } from '@/utils'
import { BaseRoutes } from './base.route'

class ProductRoutes extends BaseRoutes {
  async routes() {
    const productController = new ProductController()

    this.router.post('/', requireAdmin, upload.array('images'), productController.createProduct)
  }
}

export const productRoutes = new ProductRoutes().router
