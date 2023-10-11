import { RajaOngkirSchema } from '@/dto'
import { RajaOngkirService } from '@/services'
import { logger, validate } from '@/utils'
import { NextFunction, Request, Response } from 'express'

class RajaOngkirController {
  rajaOngkirService = new RajaOngkirService()

  getProvinsi = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.rajaOngkirService.getProvinsi(req)

      const message = 'Success get data provinsi'
      logger.info(message)
      return res.status(200).json({ message, data: result })
    } catch (err: any) {
      next(err)
    }
  }

  getKabKot = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.rajaOngkirService.getKabKot(req)

      const message = 'Success get data Kabupaten/Kota'
      logger.info(message)
      return res.status(200).json({ message, data: result })
    } catch (err: any) {
      next(err)
    }
  }

  getKecamatan = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.rajaOngkirService.getKecamatan(req)

      const message = 'Success get data Kecamatan'
      logger.info(message)
      return res.status(200).json({ message, data: result })
    } catch (err: any) {
      next(err)
    }
  }

  getOngkir = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body
      const token = res.locals.user.token

      validate(body, RajaOngkirSchema)

      const result = await this.rajaOngkirService.getOngkir(body, token)

      const message = 'Success get data Ongkir'
      logger.info(message)
      return res.status(200).json({ message, data: result })
    } catch (err: any) {
      next(err)
    }
  }
}

export default RajaOngkirController
