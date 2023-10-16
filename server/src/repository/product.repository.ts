/* eslint-disable no-unreachable */
import fs from 'fs'
import path from 'path'

import { ProductDTO } from '@/dto'
import { Product } from '@/models'
import { InternalServerError, logger } from '@/utils'

class ProductRepository {
  getProducts = async (keyword: any, page: number, limit: number, sort: any) => {
    try {
      const products = await Product.find(keyword)
        .populate('category')
        .limit(limit * 1)
        .skip((page - 1) * limit)
        .sort(sort)
        .exec()

      const count = await Product.count()

      return {
        products,
        totalPages: Math.ceil(count / limit),
        currentPage: page
      }
    } catch (err: any) {
      logger.error('ERR = get products ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  getDifferentProductsThanBefore = async (dates: any[], keyword: any, type: string) => {
    try {
      let products: any[] = []
      let labels: any[] = []
      let label

      for (const [i, date] of dates.entries()) {
        const product = await Product.find({
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

        products = [...products, product]
        labels = [...labels, label]
      }

      return { labels, products }
    } catch (err: any) {
      logger.error('ERR = Get Order ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  getProductDetailsById = async (keyword: any) => {
    try {
      return await Product.find(keyword)
    } catch (err: any) {
      logger.error('ERR = Get Product Details By ID ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  createProduct = async (payload: ProductDTO, pic: string[]) => {
    try {
      return await Product.create({
        nmProduct: payload.nmProduct,
        category: payload.category,
        description: payload.description,
        rating: 0,
        subCategory: payload.subCategory,
        pic,
        details: payload.details
      }).then((result) => {
        if (!result) {
          throw new InternalServerError('Failed create data product')
        }

        return result
      })
    } catch (err: any) {
      logger.error('ERR = Create new product ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  findOne = async (attr: object) => {
    try {
      return await Product.findOne(attr)
    } catch (err: any) {
      logger.error('ERR = Find one product ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  findById = async (userId: string) => {
    try {
      return await Product.findById(userId)
        .populate('category')
        .then((result) => {
          if (!result) {
            throw new InternalServerError('Failed get data product, Data not found')
          }

          return result
        })
    } catch (err: any) {
      logger.error('ERR = Find product by id ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  findDetailsProduct = async (detailsId: string) => {
    try {
      return await Product.findOne({
        details: {
          $elemMatch: { _id: detailsId }
        }
      }).then((result) => {
        if (!result) {
          throw new InternalServerError('Product Not Found')
        }

        return result
      })
    } catch (err: any) {
      logger.error('ERR = Find user by id ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  updateProduct = async (category: ProductDTO, payload: ProductDTO, productImages: string[]) => {
    try {
      category.nmProduct = payload.nmProduct
      category.category = payload.category
      category.subCategory = payload.subCategory
      category.details = payload.details
      category.price = payload.price
      category.description = payload.description
      category.rating = payload.rating
      category.stock = payload.stock
      category.size = payload.size
      category.colors = payload.colors

      if (productImages.length > 0) {
        category.pic = [...category.pic, ...productImages]
      }

      return await category.save().then((result) => {
        if (!result) {
          throw new InternalServerError('Failed update data product')
        }

        return result
      })
    } catch (err: any) {
      logger.error('ERR = Update data product ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  deleteProductImage = async (product: ProductDTO, picId: string) => {
    try {
      const picIndex = product.pic.findIndex((pic) => pic === picId)

      if (picIndex >= 0) {
        const pathImage = path.resolve(__dirname, '..', 'public', 'assets', 'product', picId)
        if (fs.existsSync(pathImage)) {
          fs.unlinkSync(pathImage)
        }

        product.pic = product.pic.filter((pic) => pic !== picId)
      }

      return await product.save().then((result) => {
        if (!result) {
          throw new InternalServerError('Failed delete data product')
        }

        return result
      })
    } catch (err: any) {
      logger.error('ERR = Delete data product ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  deleteProduct = async (product: ProductDTO) => {
    try {
      if (product.pic.length > 0) {
        for (const pic of product.pic) {
          const pathImage = path.resolve(__dirname, '..', 'public', 'assets', 'product', pic)
          if (fs.existsSync(pathImage)) {
            fs.unlinkSync(pathImage)
          }
        }
      }

      return await product.deleteOne().then((result) => {
        if (!result) {
          throw new InternalServerError('Failed delete data product')
        }

        return result
      })
    } catch (err: any) {
      logger.error('ERR = Delete data product ', err.message)
      throw new InternalServerError(err.message)
    }
  }
}

export default ProductRepository
