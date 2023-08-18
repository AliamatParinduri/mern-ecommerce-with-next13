import { AddressController } from '@/controller'

import { BaseRoutes } from './base.route'
import { requireLogin } from '@/middlewares'

class AddressRoutes extends BaseRoutes {
  async routes() {
    const addressController = new AddressController()

    this.router.get('/', requireLogin, addressController.getAddress)
    this.router.get('/:id', requireLogin, addressController.getAddressById)
    this.router.post('/', requireLogin, addressController.createAddress)
    this.router.put('/:id', requireLogin, addressController.updateAddress)
    this.router.delete('/:id', requireLogin, addressController.deleteAddress)
  }
}

export const addressRoutes = new AddressRoutes().router
