/* eslint-disable array-callback-return */
import { OrderDTO } from '@/dto'
import { ProductRepository, OrderRepository, UserRepository } from '@/repository'
import { UnprocessableEntityError } from '@/utils'

class OrderService {
  productRepository = new ProductRepository()
  userRepository = new UserRepository()
  orderRepository = new OrderRepository()

  getAddress = async () => {
    const result = await this.orderRepository.getOrders()

    if (result.length < 0) {
      throw new UnprocessableEntityError('Failed get data order, Data not found')
    }
    return result
  }

  getOrderById = async (addressId: string) => {
    const result = await this.orderRepository.findById(addressId)

    if (!result) {
      throw new UnprocessableEntityError('Failed get data address, Data not found')
    }
    return result
  }

  createOrder = async (payload: any) => {
    let tmpProductDetails: any[] = []

    for (const prod of payload.products) {
      const product: any = await this.productRepository.findOne({ _id: prod.product, 'details._id': prod.details._id })

      if (!product) {
        throw new UnprocessableEntityError('Product details not found')
      }

      product.details.map((details: any) => {
        if (details._id.equals(prod.details._id)) {
          if (details.stock === 0) {
            throw new UnprocessableEntityError('Stock product was empty')
          }

          if (details.stock < prod.qty) {
            throw new UnprocessableEntityError('Qty over than stock available')
          }

          tmpProductDetails = [
            ...tmpProductDetails,
            {
              product,
              index: product.details.findIndex((detail: any) => detail._id.equals(prod.details._id)),
              newStock: details.stock - prod.qty
            }
          ]
        }
      })
    }

    const result = await this.orderRepository.createOrder(payload)

    if (!result) {
      throw new UnprocessableEntityError('Failed create data address')
    }

    for (const tmp of tmpProductDetails) {
      tmp.product.details[tmp.index].stock = tmp.newStock
      await tmp.product.save()
    }

    const user: any = await this.userRepository.findById(payload.userId)
    user.cart = []
    await user.save()

    return { result, user }
  }

  updateOrder = async (payload: OrderDTO, addressId: string) => {
    const address = await this.orderRepository.findById(addressId)

    if (!address) {
      throw new UnprocessableEntityError('User not found')
    }
    const result = await this.orderRepository.updateOrder(address, payload)

    if (!result) {
      throw new UnprocessableEntityError('Failed update data address')
    }
    return result
  }

  deleteOrder = async (addressId: string) => {
    const result = await this.orderRepository.deleteOrder(addressId)

    if (!result) {
      throw new UnprocessableEntityError('Failed update data address')
    }
    return result
  }
}

export default OrderService
