import { NextFunction, Request, Response } from 'express'

import { OrderService } from '@/services'
import { logger, validate } from '@/utils'
import { OrderDTO, OrderSchema } from '@/dto'

class OrderController {
  orderService = new OrderService()

  getOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.orderService.getAddress()

      const message = 'Success get data order'
      logger.info(message)
      return res.status(200).json({ message, data: result })
    } catch (err: any) {
      next(err)
    }
  }

  getOrderById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const addressId = req.params.id

      const result = await this.orderService.getOrderById(addressId)

      const message = 'Success get data order by id'
      logger.info(message)
      return res.status(200).json({ message, data: result })
    } catch (err: any) {
      next(err)
    }
  }

  createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body

      validate(body, OrderSchema)

      const { result, user } = await this.orderService.createOrder(body as OrderDTO)

      const message = 'Success create data order'
      logger.info(message)
      return res.status(200).json({
        message,
        data: {
          order: result,
          user
        }
      })
    } catch (err: any) {
      next(err)
    }
  }

  updateOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body
      const { id } = req.params

      validate(body, OrderSchema)

      const result = await this.orderService.updateOrder(body as OrderDTO, id)

      const message = 'Success update data order'
      logger.info(message)
      return res.status(200).json({ message, data: result })
    } catch (err: any) {
      next(err)
    }
  }

  deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const result = await this.orderService.deleteOrder(id)

      const message = 'Success delete address data'
      logger.info(message)
      return res.status(200).json({ message, data: result })
    } catch (err: any) {
      next(err)
    }
  }
}

export default OrderController
