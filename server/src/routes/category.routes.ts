import { CategoryController } from '@/controller'
import { BaseRoutes } from './base.route'
import { requireAdmin } from '@/middlewares'

class CategoryRoutes extends BaseRoutes {
  async routes() {
    const categoryController = new CategoryController()

    this.router.get('/', categoryController.getCategories)
    this.router.post('/', categoryController.createCategory)
    this.router.get('/:id', requireAdmin, categoryController.getCategoryById)
    this.router.put('/:id', requireAdmin, categoryController.updateCategory)
    this.router.delete('/:id', requireAdmin, categoryController.deleteCategory)
  }
}

export const categoryRoutes = new CategoryRoutes().router
