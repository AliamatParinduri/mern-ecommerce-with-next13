import { UserController } from '@/controller'

import { BaseRoutes } from './base.route'
import { requireLogin } from '@/middlewares'
import { upload } from '@/utils/uploads'

class UserRoutes extends BaseRoutes {
  async routes() {
    const userController = new UserController()

    this.router.get('/', userController.getUsers)
    this.router.post('/updateProfileImage', requireLogin, upload.single('image'), userController.updateProfileImage)
  }
}

export const userRoutes = new UserRoutes().router
