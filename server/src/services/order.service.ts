/* eslint-disable multiline-ternary */
/* eslint-disable array-callback-return */
import { Request } from 'express'

import { OrderDTO } from '@/dto'
import { ProductRepository, OrderRepository, UserRepository } from '@/repository'
import { UnprocessableEntityError, getDates } from '@/utils'

class OrderService {
  productRepository = new ProductRepository()
  userRepository = new UserRepository()
  orderRepository = new OrderRepository()

  getOrders = async (req: Request) => {
    const keyword = { ...req.query }
    return await this.orderRepository.getOrders(keyword)
  }

  getRekapOrders = async (req: Request) => {
    const keyword = { ...req.query }

    const daily = getDates(7, 'daily')
    const weekly = getDates(6, 'weekly')
    const monthly = getDates(12, 'monthly')
    const yearly = getDates(6, 'yearly')

    const dailyOrders = await this.orderRepository.getDifferentOrdersThanBefore(daily, keyword, 'daily')
    const weeklyOrders = await this.orderRepository.getDifferentOrdersThanBefore(weekly, keyword, 'weekly')
    const monthlyOrders = await this.orderRepository.getDifferentOrdersThanBefore(monthly, keyword, 'monthly')
    const yearlyOrders = await this.orderRepository.getDifferentOrdersThanBefore(yearly, keyword, 'yearly')

    const w1 = getDates(1, 'weekly')[0]

    const weeklyUserTopPurchases: any = await this.orderRepository.getUserTopPurchases(w1, keyword)
    const weeklyTopCategorySales = await this.orderRepository.getTopCategorySales(w1, keyword)
    const weeklyTopSalesProducts = await this.orderRepository.getTopSalesProduct(w1, keyword)

    const m2 = getDates(2, 'monthly')
    const totalSales = await this.orderRepository.getDifferentTotalSalesThanBefore(m2, keyword)
    const getDifferentNewUsers = await this.userRepository.getDifferentNewUsersThanBefore(m2, keyword, 'monthly')
    const getDifferentProfit = await this.orderRepository.getDifferentProfitThanBefore(m2, keyword)
    const getDifferentProducts = await this.productRepository.getDifferentProductsThanBefore(m2, keyword, 'monthly')

    const newDate1 = new Date()
    const newDate2 = new Date(w1.end)

    const diff = newDate2.getTime() - newDate1.getTime()
    const daydiff = diff / (1000 * 60 * 60 * 24)

    const d1 = getDates(7, 'daily', Math.floor(daydiff))
    const d2 = getDates(7, 'daily', Math.floor(daydiff) - 7)

    const getWeeklyDiffTotalSales = await this.orderRepository.getDifferentTotalSalesThanBefore(d1, keyword)
    const getWeeklyDiffTotalSales2 = await this.orderRepository.getDifferentTotalSalesThanBefore(d2, keyword)
    const getDifferentTotalSales = [getWeeklyDiffTotalSales, getWeeklyDiffTotalSales2]

    let age1: number[] = []
    let age2: number[] = []
    let age3: number[] = []
    for (const userAges of weeklyUserTopPurchases) {
      const userAge = userAges.age.getFullYear()

      const year = new Date().getFullYear()
      const diffAge = year - userAge

      if (diffAge < 18) {
        age1 = [...age1, 1]
      } else if (diffAge >= 18 && diffAge <= 40) {
        age2 = [...age2, 1]
      } else if (diffAge > 40) {
        age3 = [...age3, 1]
      } else {
        throw new UnprocessableEntityError('Failed your age not valid!')
      }
    }
    const getDetailsAgeUsersPurchases = {
      labels: ['<17', '18-40', '>40'],
      detailsAges: [age1.length, age2.length, age3.length]
    }

    return {
      dailyOrders,
      weeklyOrders,
      monthlyOrders,
      yearlyOrders,
      weeklyUserTopPurchases,
      weeklyTopCategorySales,
      weeklyTopSalesProducts,
      totalSales,
      getDifferentNewUsers,
      getDifferentProfit,
      getDifferentProducts,
      getDifferentTotalSales,
      getDetailsAgeUsersPurchases
    }
  }

  getOrderById = async (orderId: string) => {
    const result = await this.orderRepository.findById(orderId)

    return result
  }

  createOrder = async (payload: any) => {
    let tmpProductDetails: any[] = []

    const user: any = await this.userRepository.findById(payload.user)

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
              newStock: details.stock - prod.qty,
              totalOrder: details.totalOrder + 1
            }
          ]
        }
      })
    }

    const result = await this.orderRepository.createOrder(payload)

    for (const tmp of tmpProductDetails) {
      tmp.product.details[tmp.index].stock = tmp.newStock
      tmp.product.details[tmp.index].totalOrder = tmp.totalOrder
      await tmp.product.save()
    }

    user.cart = []
    await user.save()

    return { result, user }
  }

  updateOrder = async (payload: OrderDTO, orderId: string) => {
    const order = await this.orderRepository.findById(orderId)

    return await this.orderRepository.updateOrder(order, payload)
  }

  deleteOrder = async (orderId: string) => {
    return await this.orderRepository.deleteOrder(orderId)
  }
}

export default OrderService
