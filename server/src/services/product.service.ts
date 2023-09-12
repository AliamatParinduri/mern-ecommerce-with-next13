import { Request } from 'express'

import { ProductDTO } from '@/dto'
import { OrderRepository, ProductRepository } from '@/repository'
import { UnprocessableEntityError, getDates } from '@/utils'

class ProductService {
  orderRepository = new OrderRepository()
  productRepository = new ProductRepository()

  getProducts = async (req: Request, page: number, limit: number) => {
    const categories = req.query.categories
    const subCategory = req.query.subCategory
    const price = req.query.price as string
    const rating = req.query.rating
    const displayOrder = req.query.displayOrder
    let categoryRegex: any[] = []

    const splitCategory = categories?.toString().split('-')
    if (splitCategory) {
      for (const categoryId of splitCategory) {
        categoryRegex = [...categoryRegex, { category: categoryId }]
      }
    }

    const keywordCategories = categories
      ? {
          $or: [...categoryRegex]
        }
      : {}

    const keywordSubCategory = subCategory
      ? {
          $or: [{ subCategory: { $regex: subCategory, $options: 'i' } }]
        }
      : {}

    let keywordPrice = {}
    if (price) {
      const splitPrice = price.split('-')

      if (splitPrice) {
        keywordPrice = {
          $or: [
            {
              details: {
                $gte: { price: splitPrice[0] },
                $lte: { price: splitPrice[1] }
              }
            }
          ]
        }
      }
    }

    let keywordRating = {}
    if (rating) {
      keywordRating = {
        $or: [
          {
            'details.rating': { $gte: rating }
          }
        ]
      }
    }

    const keyword = {
      $and: [keywordCategories, keywordSubCategory, keywordPrice, keywordRating]
    }

    let sort
    switch (displayOrder) {
      case 'Low-High':
        sort = {
          'details.price': 'asc'
        }
        break
      case 'High-Low':
        sort = {
          'details.price': 'desc'
        }
        break
      case 'A-Z':
        sort = {
          nmProduct: 'asc'
        }
        break
      case 'Z-A':
        sort = {
          nmProduct: 'desc'
        }
        break

      default:
        sort = { createdAt: 'desc' }
        break
    }

    const result = await this.productRepository.getProducts(keyword, page, limit, sort)

    if (!result) {
      throw new UnprocessableEntityError('Failed get products data')
    }
    return result
  }

  getProductById = async (productId: string) => {
    return await this.productRepository.findById(productId)
  }

  getReportProducts = async (req: Request) => {
    const keyword = { ...req.query }

    const daily = getDates(7, 'daily')
    const weekly = getDates(6, 'weekly')
    const monthly = getDates(12, 'monthly')
    const yearly = getDates(6, 'yearly')

    const dailyDifferentProducts: any = await this.productRepository.getDifferentProductsThanBefore(
      daily,
      keyword,
      'daily'
    )

    const weeklyDifferentProducts: any = await this.productRepository.getDifferentProductsThanBefore(
      weekly,
      keyword,
      'weekly'
    )

    const monthlyDifferentProducts: any = await this.productRepository.getDifferentProductsThanBefore(
      monthly,
      keyword,
      'monthly'
    )

    const yearlyDifferentProducts: any = await this.productRepository.getDifferentProductsThanBefore(
      yearly,
      keyword,
      'yearly'
    )

    const labelsDaily: string[] = dailyDifferentProducts.labels
    const dataDaily: number[] = dailyDifferentProducts.products
    const labelsWeekly: string[] = weeklyDifferentProducts.labels
    const dataWeekly: number[] = weeklyDifferentProducts.products
    const labelsMonthly: string[] = monthlyDifferentProducts.labels
    const dataMonthly: number[] = monthlyDifferentProducts.products
    const labelsYearly: string[] = yearlyDifferentProducts.labels
    const dataYearly: number[] = yearlyDifferentProducts.products

    const d1 = getDates(1, 'daily')[0]
    const w1 = getDates(1, 'weekly')[0]
    const m1 = getDates(1, 'monthly')[0]
    const y1 = getDates(1, 'yearly')[0]
    const dailyTopSalesProducts = await this.orderRepository.getTopSalesProduct(d1, keyword)
    const weeklyTopSalesProducts = await this.orderRepository.getTopSalesProduct(w1, keyword)
    const monthlyTopSalesProducts = await this.orderRepository.getTopSalesProduct(m1, keyword)
    const yearlyTopSalesProducts = await this.orderRepository.getTopSalesProduct(y1, keyword)

    return {
      newProducts: {
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
      topSalesProducts: {
        daily: dailyTopSalesProducts,
        weekly: weeklyTopSalesProducts,
        monthly: monthlyTopSalesProducts,
        yearly: yearlyTopSalesProducts
      }
    }
  }

  createProduct = async (payload: ProductDTO, files: Express.Multer.File[]) => {
    const productExists = await this.productRepository.findOne({
      nmProduct: payload.nmProduct
    })
    if (productExists) {
      throw new UnprocessableEntityError(`Product name already exists`)
    }

    if (typeof payload.details === 'string') {
      payload.details = JSON.parse(payload.details)
    }

    let productImages
    if (files.length > 0) {
      productImages = files.map((file) => {
        return file.filename
      })
    } else {
      productImages = ['product.png']
    }

    return await this.productRepository.createProduct(payload, productImages)
  }

  updateProduct = async (productId: string, payload: ProductDTO, files: Express.Multer.File[]) => {
    const productExists = await this.productRepository.findOne({
      _id: { $ne: productId },
      nmProduct: payload.nmProduct
    })
    if (productExists) {
      throw new UnprocessableEntityError(`Product name already exists`)
    }

    if (typeof payload.details === 'string') {
      payload.details = JSON.parse(payload.details)
    }

    const product = await this.productRepository.findById(productId)

    let productImages: string[] = []
    if (files.length > 0) {
      productImages = files.map((file) => {
        return file.filename
      })
    }

    return await this.productRepository.updateProduct(product, payload, productImages)
  }

  deleteProductImage = async (productId: string, picId: string) => {
    const product = await this.productRepository.findById(productId)

    return await this.productRepository.deleteProductImage(product, picId)
  }

  deleteProduct = async (productId: string) => {
    const product = await this.productRepository.findById(productId)

    return await this.productRepository.deleteProduct(product)
  }
}

export default ProductService
