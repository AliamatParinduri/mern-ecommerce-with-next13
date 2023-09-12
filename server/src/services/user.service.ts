import { Request } from 'express'

import { UserDTO } from '@/dto'
import { OrderRepository, ProductRepository, UserRepository } from '@/repository'
import { NotFoundError, UnprocessableEntityError, getDates } from '@/utils'

class UserService {
  orderRepository = new OrderRepository()
  productRepository = new ProductRepository()
  userRepository = new UserRepository()

  getUsers = async (req: Request, page: number, limit: number) => {
    const keyword = req.query.search
      ? {
          $or: [
            { fullName: { $regex: req.query.search, $options: 'i' } },
            { username: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } }
          ]
        }
      : {}

    const result = await this.userRepository.getUsers(keyword, page, limit)

    if (!result) {
      throw new NotFoundError('Users Not Found')
    }
    return result
  }

  getCarts = async (id: string, page: number, limit: number) => {
    const user = await this.userRepository.findById(id)

    const result = await this.userRepository.getCarts(user, page, limit)

    if (!result) {
      throw new NotFoundError('Users Not Found')
    }
    return result
  }

  getWishlists = async (id: string, page: number, limit: number) => {
    const user = await this.userRepository.findById(id)

    if (!user) {
      throw new NotFoundError('Users Not Found')
    }

    const result = await this.userRepository.getWishlists(user, page, limit)

    if (!result) {
      throw new NotFoundError('Users Not Found')
    }
    return result
  }

  getUserById = async (id: string) => {
    return await this.userRepository.findById(id)
  }

  getReportUsers = async (req: Request) => {
    let labelsDaily: string[] = []
    let dataDaily: number[] = []
    let labelsWeekly: string[] = []
    let dataWeekly: number[] = []
    let labelsMonthly: string[] = []
    let dataMonthly: number[] = []
    let labelsYearly: string[] = []
    let dataYearly: number[] = []
    const keyword = { ...req.query }

    const d1 = getDates(1, 'daily')[0]
    const w1 = getDates(1, 'weekly')[0]
    const m1 = getDates(1, 'monthly')[0]
    const y1 = getDates(1, 'yearly')[0]

    const dailyUserTopPurchases: any = await this.orderRepository.getUserTopPurchases(d1, keyword)
    const weeklyUserTopPurchases: any = await this.orderRepository.getUserTopPurchases(w1, keyword)
    const monthlyUserTopPurchases: any = await this.orderRepository.getUserTopPurchases(m1, keyword)
    const yearlyUserTopPurchases: any = await this.orderRepository.getUserTopPurchases(y1, keyword)

    if (dailyUserTopPurchases.length > 0) {
      for (const daily of dailyUserTopPurchases) {
        labelsDaily = [daily.fullName, ...labelsDaily]
        dataDaily = [daily.count, ...dataDaily]
      }
    }

    if (weeklyUserTopPurchases.length > 0) {
      for (const weekly of weeklyUserTopPurchases) {
        labelsWeekly = [weekly.fullName, ...labelsWeekly]
        dataWeekly = [weekly.count, ...dataWeekly]
      }
    }

    if (monthlyUserTopPurchases.length > 0) {
      for (const monthly of monthlyUserTopPurchases) {
        labelsMonthly = [monthly.fullName, ...labelsMonthly]
        dataMonthly = [monthly.count, ...dataMonthly]
      }
    }

    if (yearlyUserTopPurchases.length > 0) {
      for (const yearly of yearlyUserTopPurchases) {
        labelsYearly = [yearly.fullName, ...labelsYearly]
        dataYearly = [yearly.count, ...dataYearly]
      }
    }

    const dailyUserTopDescriptionPurchases: any = await this.orderRepository.getUserTopDescriptionPurchases(d1, keyword)
    const weeklyUserTopDescriptionPurchases: any = await this.orderRepository.getUserTopDescriptionPurchases(
      w1,
      keyword
    )
    const monthlyUserTopDescriptionPurchases: any = await this.orderRepository.getUserTopDescriptionPurchases(
      m1,
      keyword
    )
    const yearlyUserTopDescriptionPurchases: any = await this.orderRepository.getUserTopDescriptionPurchases(
      y1,
      keyword
    )

    return {
      topUserPurchases: {
        daily: {
          labels: labelsDaily,
          data: dataDaily
        },
        weekly: {
          labels: labelsWeekly,
          data: dataWeekly
        },
        monthly: {
          labels: labelsMonthly,
          data: dataMonthly
        },
        yearly: {
          labels: labelsYearly,
          data: dataYearly
        }
      },
      topDescriptionUsers: {
        daily: dailyUserTopDescriptionPurchases,
        weekly: weeklyUserTopDescriptionPurchases,
        monthly: monthlyUserTopDescriptionPurchases,
        yearly: yearlyUserTopDescriptionPurchases
      }
    }
  }

  updateUser = async (id: string, payload: UserDTO) => {
    const emailExists = await this.userRepository.findOne({
      _id: { $ne: id },
      email: payload.email
    })
    const userExists = await this.userRepository.findOne({
      _id: { $ne: id },
      username: payload.username
    })
    if (emailExists || userExists) {
      throw new UnprocessableEntityError(`${emailExists ? 'Email' : 'Username'} already exists`)
    }

    const user = await this.userRepository.findById(id)

    return await this.userRepository.updateUser(user, payload)
  }

  addToCart = async (detailsId: string, qty: number, userId: string) => {
    const user = await this.userRepository.findById(userId)

    const prod = await this.productRepository.findDetailsProduct(detailsId)

    const newProductDetail = prod.details.filter((detail: any) => detail._id.equals(detailsId)) as []
    prod.details = [...newProductDetail]

    const result = await this.userRepository.addToCart(user, prod, detailsId, qty)
    return result
  }

  removeFromCart = async (detailsId: string, userId: string) => {
    const user = await this.userRepository.findById(userId)

    const prod = await this.productRepository.findDetailsProduct(detailsId)

    const result = await this.userRepository.removeFromCart(user, prod, detailsId)
    return result
  }

  productWishlist = async (product: string, userId: string) => {
    const user = await this.userRepository.findById(userId)

    const prod = await this.productRepository.findById(product)

    const result = await this.userRepository.productWishlist(user, prod)

    return result
  }

  updateProfilePicture = async (fileName: string, userId: string) => {
    const user = await this.userRepository.findById(userId)

    const result = await this.userRepository.updateProfilePicture(user, fileName)

    return result
  }

  deleteUser = async (id: string) => {
    return await this.userRepository.deleteUser(id)
  }
}

export default UserService
