import { Request } from 'express'

import { ProductDTO } from '@/dto'
import { ProductRepository } from '@/repository'
import { UnprocessableEntityError } from '@/utils'

class ProductService {
  productRepository = new ProductRepository()

  getProducts = async (req: Request, page: number, limit: number) => {
    const categories = req.query.categories
    const subCategory = req.query.subCategory
    const price = req.query.price as string
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

    let keywordPrice
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
      } else {
        keywordPrice = {}
      }
    } else {
      keywordPrice = {}
    }

    const keyword = {
      $and: [keywordCategories, keywordSubCategory, keywordPrice]
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
        sort = {}
        break
    }

    const result = await this.productRepository.getProducts(keyword, page, limit, sort)

    if (!result) {
      throw new UnprocessableEntityError('Failed get products data')
    }
    return result
  }

  getProductById = async (productId: string) => {
    const result = await this.productRepository.findById(productId)

    if (!result) {
      throw new UnprocessableEntityError('Failed create data product')
    }
    return result
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

    const productImages = files.map((file) => {
      return file.filename
    })

    const result = await this.productRepository.createProduct(payload, productImages)

    if (!result) {
      throw new UnprocessableEntityError('Failed create data product')
    }
    return result
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

    if (!product) {
      throw new UnprocessableEntityError('Product not found')
    }

    let productImages: string[] = []
    if (files.length > 0) {
      productImages = files.map((file) => {
        return file.filename
      })
    }

    const result = await this.productRepository.updateProduct(product, payload, productImages)

    if (!result) {
      throw new UnprocessableEntityError('Failed update data product')
    }
    return result
  }

  deleteProductImage = async (productId: string, picId: string) => {
    const product = await this.productRepository.findById(productId)

    if (!product) {
      throw new UnprocessableEntityError('Product not found')
    }
    const result = await this.productRepository.deleteProductImage(product, picId)

    if (!result) {
      throw new UnprocessableEntityError('Failed delete data product')
    }
    return result
  }

  deleteProduct = async (productId: string) => {
    const product = await this.productRepository.findById(productId)

    if (!product) {
      throw new UnprocessableEntityError('Product not found')
    }
    const result = await this.productRepository.deleteProduct(product)

    if (!result) {
      throw new UnprocessableEntityError('Failed delete data product')
    }
    return result
  }
}

export default ProductService
