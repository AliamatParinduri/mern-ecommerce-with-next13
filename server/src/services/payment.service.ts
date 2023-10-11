// eslint-disable-next-line array-callback-return
import { PaymentDTO, createTransactionDTO } from '@/dto'
import { PaymentRepository } from '@/repository'

class PaymentService {
  paymentRepository = new PaymentRepository()

  createPayment = async (payload: PaymentDTO) => {
    const params = {
      transaction_details: {
        order_id: payload.orderId,
        gross_amount: payload.total
      },
      customers_details: {
        first_name: payload.name,
        email: payload.email,
        phone: payload.noHP
      }
    }

    return await this.paymentRepository.createPayment(params as createTransactionDTO)
  }
}

export default PaymentService
