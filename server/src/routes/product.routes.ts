import { ProductController } from '@/controller'
import { requireAdmin, requireLogin } from '@/middlewares'
import { upload } from '@/utils'
import { BaseRoutes } from './base.route'

class ProductRoutes extends BaseRoutes {
  async routes() {
    const productController = new ProductController()

    this.router.get('/', requireLogin, productController.getProducts)
    this.router.get('/:id', requireLogin, productController.getProductById)
    this.router.post('/', requireAdmin, upload.array('images'), productController.createProduct)
    this.router.put('/:id', requireAdmin, upload.array('images'), productController.updateProduct)
    this.router.put('/:id/deleteProductImage', requireAdmin, productController.deleteProductImage)
    this.router.delete('/:id', requireAdmin, productController.deleteProduct)
  }
}

export const productRoutes = new ProductRoutes().router
