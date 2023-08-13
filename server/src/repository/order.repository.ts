/* eslint-disable no-unreachable */

import { OrderDTO } from '@/dto'
import { Order } from '@/models'
import { InternalServerError, logger } from '@/utils'

class OrderRepository {
  getOrders = async () => {
    try {
      return await Order.find()
    } catch (err: any) {
      logger.error('ERR = Get Order ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  createOrder = async (payload: OrderDTO) => {
    try {
      return await Order.create({
        user: payload.user,
        address: payload.address,
        products: payload.products,
        discount: payload.discount,
        ongkir: payload.ongkir,
        totalPrice: payload.totalPrice
      })
    } catch (err: any) {
      logger.error('ERR = Create new Order ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  findOne = async (attr: object) => {
    try {
      return await Order.findOne(attr)
    } catch (err: any) {
      logger.error('ERR = Find one Order ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  findById = async (OrderId: string) => {
    try {
      return await Order.findById(OrderId)
    } catch (err: any) {
      logger.error('ERR = Find Order by id ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  updateOrder = async (order: OrderDTO, payload: OrderDTO) => {
    try {
      order.address = payload.address
      order.products = payload.products
      order.discount = payload.discount
      order.ongkir = payload.ongkir
      order.totalPrice = payload.totalPrice
      return await order.save()
    } catch (err: any) {
      logger.error('ERR = Update data category ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  deleteOrder = async (OrderId: string) => {
    try {
      return await Order.findByIdAndRemove(OrderId)
    } catch (err: any) {
      logger.error('ERR = Update data category ', err.message)
      throw new InternalServerError(err.message)
    }
  }
}

export default OrderRepository
