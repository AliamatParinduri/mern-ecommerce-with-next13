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

  createProduct = async (payload: ProductDTO, pic: string[]) => {
    try {
      return await Product.create({
        nmProduct: payload.nmProduct,
        category: payload.category,
        subCategory: payload.subCategory,
        pic,
        details: payload.details
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
      category.stock = payload.stock
      category.size = payload.size
      category.colors = payload.colors

      if (productImages.length > 0) {
        category.pic = [...category.pic, ...productImages]
      }

      return await category.save()
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

      return await product.save()
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

      return await product.deleteOne()
    } catch (err: any) {
      logger.error('ERR = Delete data product ', err.message)
      throw new InternalServerError(err.message)
    }
  }
}

export default ProductRepository
