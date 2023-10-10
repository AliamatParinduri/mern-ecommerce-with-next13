/* eslint-disable no-unreachable */
import { InternalServerError, logger, setupMidtrans } from '@/utils'

class PaymentRepository {
  createPayment = async (params: any) => {
    try {
      return await setupMidtrans.createTransaction(params)
    } catch (err: any) {
      logger.error('ERR = Create new category ', err.message)
      throw new InternalServerError(err.message)
    }
  }
}

export default PaymentRepository
