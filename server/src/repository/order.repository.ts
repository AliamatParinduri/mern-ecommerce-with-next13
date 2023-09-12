/* eslint-disable no-unreachable */
import mongoose from 'mongoose'

import { OrderDTO } from '@/dto'
import { Order } from '@/models'
import { InternalServerError, UnprocessableEntityError, logger } from '@/utils'

class OrderRepository {
  getOrders = async (keyword: any) => {
    try {
      return await Order.find(keyword)
        .sort({ createdAt: 'desc' })
        .populate('products.product')
        .populate('address')
        .then((result) => {
          if (result.length < 0) {
            throw new InternalServerError('Failed get data order, Data not found')
          }

          return result
        })
    } catch (err: any) {
      logger.error('ERR = Get Order ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  getDifferentOrdersThanBefore = async (dates: any[], keyword: any, type: string) => {
    try {
      let orders: any[] = []
      let labels: any[] = []
      let label

      for (const [i, date] of dates.entries()) {
        const order = await Order.find({
          ...keyword,
          createdAt: { $gte: dates[i].start, $lte: dates[i].end }
        })
          .sort({ createdAt: 'desc' })
          .countDocuments()

        const dateSplit = date.start.split(' ')
        const dateSplit2 = date.end.split(' ')
        switch (type) {
          case 'daily':
            label = `${dateSplit[1]} ${dateSplit[2]} ${dateSplit[3]}`
            break
          case 'weekly':
            label = `${dateSplit[1]} ${dateSplit[2]} - ${dateSplit2[1]} ${dateSplit2[2]}`
            break
          case 'monthly':
            label = `${dateSplit[1]} ${dateSplit[3]}`
            break

          default:
            label = dateSplit[3]
            break
        }

        orders = [...orders, order]
        labels = [...labels, label]
      }

      return { labels, orders }
    } catch (err: any) {
      logger.error('ERR = Get Order ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  getUserTopPurchases = async (date: any, keyword: any) => {
    let result: any[] = []

    const aggregatorOpts: any = [
      {
        $match: {
          $and: [
            {
              ...keyword,
              createdAt: { $gte: new Date(date.start), $lte: new Date(date.end) }
            }
          ]
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $group: {
          _id: '$user._id',
          fullName: { $first: '$user.fullName' },
          age: { $first: '$user.dateOfBirth' },
          userPic: { $first: '$user.userPic' },
          count: { $sum: '$totalPrice' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 3 }
    ]

    const getRankUserPurchases = await Order.aggregate(aggregatorOpts).exec()

    for (const data of getRankUserPurchases) {
      keyword = { ...keyword, user: data._id[0] }
      const getCategoryPurchasesByUser = await this.getTopCategorySales(date, keyword)

      result = [
        ...result,
        {
          fullName: data.fullName[0],
          age: data.age[0],
          count: data.count,
          pic: data.userPic[0],
          category: getCategoryPurchasesByUser
        }
      ]
    }

    return result
  }

  getUserTopDescriptionPurchases = async (date: any, keyword: any) => {
    let age1 = 0
    let age2 = 0
    let age3 = 0

    const aggregatorOpts: any = [
      {
        $match: {
          $and: [
            {
              ...keyword,
              createdAt: { $gte: new Date(date.start), $lte: new Date(date.end) }
            }
          ]
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'user',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $group: {
          _id: '$user._id',
          fullName: { $first: '$user.fullName' },
          age: { $first: '$user.dateOfBirth' },
          userPic: { $first: '$user.userPic' },
          count: { $sum: '$totalPrice' }
        }
      },
      { $sort: { count: -1 } }
    ]

    const getRankUserPurchases = await Order.aggregate(aggregatorOpts).exec()

    for (const data of getRankUserPurchases) {
      const userAge = data.age[0].getFullYear()

      const year = new Date().getFullYear()
      const diffAge = year - userAge

      if (diffAge < 18) {
        age1 += 1
      } else if (diffAge >= 18 && diffAge <= 40) {
        age2 += 1
      } else if (diffAge > 40) {
        age3 += 1
      } else {
        throw new UnprocessableEntityError('Failed your age not valid!')
      }
    }

    return {
      labels: ['<17', '18-40', '>40'],
      data: [
        Number(((age1 / getRankUserPurchases.length) * 100).toFixed(2)),
        Number(((age2 / getRankUserPurchases.length) * 100).toFixed(2)),
        Number(((age3 / getRankUserPurchases.length) * 100).toFixed(2))
      ]
    }
  }

  getTopCategorySales = async (date: any, keyword: any) => {
    let result: any[] = []

    const aggregatorOpts: any = [
      {
        $unwind: '$products'
      },
      {
        $match: {
          $and: [
            {
              ...keyword,
              createdAt: { $gte: new Date(date.start), $lte: new Date(date.end) }
            }
          ]
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: 'products.product',
          foreignField: '_id',
          as: 'products'
        }
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'products.category',
          foreignField: '_id',
          as: 'products.category'
        }
      },
      {
        $group: {
          _id: '$products.category._id',
          count: { $sum: 1 },
          category: { $first: '$products.category.category' },
          productPic: { $first: '$products.product.pic' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 3 }
    ]

    const getRankUserPurchases = await Order.aggregate(aggregatorOpts).exec()

    for (const data of getRankUserPurchases) {
      const aggregatorOpts2: any = [
        {
          $unwind: '$products'
        },
        {
          $lookup: {
            from: 'products',
            localField: 'products.product',
            foreignField: '_id',
            as: 'products.product'
          }
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'products.category',
            foreignField: '_id',
            as: 'products.category'
          }
        },
        {
          $match: {
            $and: [
              {
                ...keyword,
                'products.product.category': {
                  $eq: new mongoose.Types.ObjectId(data._id[0])
                },
                createdAt: { $gte: new Date(date.start), $lte: new Date(date.end) }
              }
            ]
          }
        },
        {
          $group: {
            _id: '$products.product.subCategory',
            count: { $sum: 1 }
          }
        }
      ]
      const getRankUserPurchases2 = await Order.aggregate(aggregatorOpts2).exec()

      result = [
        ...result,
        {
          category: data.category[0],
          count: data.count,
          pic: data.productPic,
          subCategory: getRankUserPurchases2
        }
      ]
    }

    return result
  }

  getTopSalesProduct = async (date: any, keyword: any) => {
    try {
      const aggregatorOpts: any = [
        {
          $unwind: '$products'
        },
        {
          $match: {
            $and: [
              {
                ...keyword,
                createdAt: { $gte: new Date(date.start), $lte: new Date(date.end) }
              }
            ]
          }
        },
        {
          $lookup: {
            from: 'products',
            localField: 'products.product',
            foreignField: '_id',
            as: 'products.product'
          }
        },
        {
          $group: {
            _id: '$products.product._id',
            nmProduct: { $first: '$products.product.nmProduct' },
            subCategory: { $first: '$products.product.subCategory' },
            price: { $sum: '$products.subTotal' },
            count: { $sum: '$products.qty' },
            pic: { $first: '$products.product.pic' }
          }
        },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]

      const getRankUserPurchases = await Order.aggregate(aggregatorOpts).exec()
      return getRankUserPurchases
    } catch (err: any) {
      logger.error('ERR = Create new Order ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  getDifferentTotalSalesThanBefore = async (dates: any, keyword: any) => {
    let labels: any[] = []
    let totalSales: any[] = []

    for (const date of dates) {
      const aggregatorOpts: any = [
        {
          $match: {
            $and: [
              {
                ...keyword,
                createdAt: { $gte: new Date(date.start), $lte: new Date(date.end) }
              }
            ]
          }
        },
        {
          $group: {
            _id: null,
            count: { $sum: '$totalPrice' }
          }
        }
      ]

      const getRankUserPurchases = await Order.aggregate(aggregatorOpts).exec()

      totalSales = [...totalSales, getRankUserPurchases.length === 0 ? 0 : getRankUserPurchases[0].count]
      const dateSplit = date.start.split(' ')
      labels = [...labels, dateSplit[0]]
    }
    return { labels, totalSales }
  }

  getDifferentProfitThanBefore = async (dates: any, keyword: any) => {
    let totalProfit: any[] = []
    for (const date of dates) {
      const aggregatorOpts: any = [
        {
          $match: {
            $and: [
              {
                ...keyword,
                createdAt: { $gte: new Date(date.start), $lte: new Date(date.end) }
              }
            ]
          }
        },
        {
          $group: {
            _id: null,
            count: { $sum: '$totalProfit' }
          }
        }
      ]

      const getRankUserPurchases = await Order.aggregate(aggregatorOpts).exec()
      totalProfit = [...totalProfit, getRankUserPurchases.length === 0 ? 0 : getRankUserPurchases[0].count]
    }
    return totalProfit
  }

  createOrder = async (payload: OrderDTO) => {
    try {
      return await Order.create({
        user: payload.user,
        address: payload.address,
        products: payload.products,
        paymentStatus: payload.paymentStatus,
        estimatedDeliveryDate: payload.estimatedDeliveryDate,
        totalProfit: payload.totalProfit,
        discount: payload.discount,
        ongkir: payload.ongkir,
        totalPrice: payload.totalPrice
      }).then((result) => {
        if (!result) {
          throw new InternalServerError('Failed create data prder')
        }

        return result
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
        .populate('address')
        .populate('user')
        .populate('products.product')
        .then((result) => {
          if (!result) {
            throw new InternalServerError('Failed get data order, Data not found')
          }

          return result
        })
    } catch (err: any) {
      logger.error('ERR = Find Order by id ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  updateOrder = async (order: OrderDTO, payload: OrderDTO) => {
    try {
      order.products = payload.products
      order.discount = payload.discount
      order.paymentStatus = payload.paymentStatus
      order.paymentOrder = payload.paymentOrder
      order.deliveredOrder = payload.deliveredOrder
      order.totalProfit = payload.totalProfit
      order.ongkir = payload.ongkir
      order.totalPrice = payload.totalPrice
      return await order.save().then((result) => {
        if (!result) {
          throw new InternalServerError('Failed update data order')
        }

        return result
      })
    } catch (err: any) {
      logger.error('ERR = Update data category ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  deleteOrder = async (OrderId: string) => {
    try {
      return await Order.findByIdAndRemove(OrderId).then((result) => {
        if (!result) {
          throw new InternalServerError('Failed update data order')
        }

        return result
      })
    } catch (err: any) {
      logger.error('ERR = Update data category ', err.message)
      throw new InternalServerError(err.message)
    }
  }
}

export default OrderRepository
