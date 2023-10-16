import { RajaOngkirController } from '@/controller'

import { BaseRoutes } from './base.route'
import { requireLogin } from '@/middlewares'

class RajaOngkirRoutes extends BaseRoutes {
  async routes() {
    const rajaOngkirController = new RajaOngkirController()

    this.router.get('/provinsi', requireLogin, rajaOngkirController.getProvinsi)
    this.router.get('/kabkot', requireLogin, rajaOngkirController.getKabKot)
    this.router.get('/kecamatan', requireLogin, rajaOngkirController.getKecamatan)
    this.router.post('/ongkir', requireLogin, rajaOngkirController.getOngkir)
  }
}

export const rajaOngkirRoutes = new RajaOngkirRoutes().router
