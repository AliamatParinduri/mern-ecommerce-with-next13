import { UserController } from '@/controller'

import { BaseRoutes } from './base.route'
import { requireLogin } from '@/middlewares'
import { upload } from '@/utils/uploads'

class UserRoutes extends BaseRoutes {
  async routes() {
    const userController = new UserController()

    this.router.get('/', userController.getUsers)
    this.router.get('/:id', requireLogin, userController.getUserById)
    this.router.put('/:id/updateProfileImage', requireLogin, upload.single('image'), userController.updateProfileImage)
    this.router.put('/:id', requireLogin, userController.updateUser)
    this.router.delete('/:id/updateProfileImage', requireLogin, userController.deleteProfileImage)
    this.router.delete('/:id', requireLogin, userController.deleteUser)
  }
}

export const userRoutes = new UserRoutes().router
