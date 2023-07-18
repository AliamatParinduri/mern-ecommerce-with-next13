/* eslint-disable no-unreachable */
import { ProductDTO } from '@/dto'
import { Product } from '@/models'
import { InternalServerError, logger } from '@/utils'

class ProductRepository {
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

  updateProduct = async (category: ProductDTO, payload: ProductDTO) => {
    try {
      return true
    } catch (err: any) {
      logger.error('ERR = Update data product ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  deleteProduct = async (categoryId: string) => {
    try {
      return true
    } catch (err: any) {
      logger.error('ERR = Delete data product ', err.message)
      throw new InternalServerError(err.message)
    }
  }
}

export default ProductRepository
