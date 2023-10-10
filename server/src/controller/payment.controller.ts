import { PaymentService } from '@/services'
import { logger } from '@/utils'
import { NextFunction, Request, Response } from 'express'

class PaymentController {
  paymentService = new PaymentService()

  createPayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body

      // validate(body, CategorySchema)

      const result = await this.paymentService.createPayment(body)

      const message = 'Success create payment gateway'
      logger.info(message)
      return res.status(200).json({ message, data: result })
    } catch (err: any) {
      next(err)
    }
  }
}

export default PaymentController
