import { ProductController } from '@/controller'
import { requireAdmin } from '@/middlewares'
import { upload } from '@/utils'
import { BaseRoutes } from './base.route'

class ProductRoutes extends BaseRoutes {
  async routes() {
    const productController = new ProductController()

    this.router.get('/', requireAdmin, productController.getProducts)
    this.router.get('/:id', requireAdmin, productController.getProductById)
    this.router.post('/', requireAdmin, upload.array('images'), productController.createProduct)
    this.router.put('/:id', requireAdmin, upload.array('images'), productController.updateProduct)
    this.router.delete('/:id/deleteProductImage', requireAdmin, productController.deleteProductImage)
    this.router.delete('/:id', requireAdmin, productController.deleteProduct)
  }
}

export const productRoutes = new ProductRoutes().router
