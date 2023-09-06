import { NextFunction, Request, Response } from 'express'

import { AddressDTO, AddressSchema } from '@/dto'
import { AddressService } from '@/services'
import { logger, validate } from '@/utils'

class AddressController {
  addressService = new AddressService()

  getAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.addressService.getAddress(req)

      const message = 'Success get data address'
      logger.info(message)
      return res.status(200).json({ message, data: result })
    } catch (err: any) {
      next(err)
    }
  }

  getAddressById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const addressId = req.params.id

      const result = await this.addressService.getAddressById(addressId)

      const message = 'Success get data address by id'
      logger.info(message)
      return res.status(200).json({ message, data: result })
    } catch (err: any) {
      next(err)
    }
  }

  createAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body

      validate(body, AddressSchema)

      const result = await this.addressService.createAddress(body as AddressDTO)

      const message = 'Success create data address'
      logger.info(message)
      return res.status(200).json({ message, data: result })
    } catch (err: any) {
      next(err)
    }
  }

  updateAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body
      const { id } = req.params

      validate(body, AddressSchema)

      const result = await this.addressService.updateAddress(body as AddressDTO, id)

      const message = 'Success update data address'
      logger.info(message)
      return res.status(200).json({ message, data: result })
    } catch (err: any) {
      next(err)
    }
  }

  deleteAddress = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const result = await this.addressService.deleteAddress(id)

      const message = 'Success delete address data'
      logger.info(message)
      return res.status(200).json({ message, data: result })
    } catch (err: any) {
      next(err)
    }
  }
}

export default AddressController
