import { NextFunction, Request, Response } from 'express'

import { ProductService } from '@/services'
import { logger, validate } from '@/utils'
import { ProductDTO, ProductSchema } from '@/dto'

class ProductController {
  productService = new ProductService()

  getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page = 1, limit = 10 } = req.query
      const result = await this.productService.getProducts(req, page as number, limit as number)

      const message = 'Success get product data'
      logger.info(message)
      return res.status(200).json({ message, data: result })
    } catch (err: any) {
      next(err)
    }
  }

  getProductById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const result = await this.productService.getProductById(id)

      const message = 'Success get product By ID'
      logger.info(message)
      return res.status(200).json({ message, data: result })
    } catch (err: any) {
      next(err)
    }
  }

  getReportProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.productService.getReportProducts(req)

      const message = 'Success get user data'
      logger.info(message)
      return res.status(200).json({ message, data: result })
    } catch (err: any) {
      next(err)
    }
  }

  createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body
      const files = req.files

      validate(body, ProductSchema)

      const result = await this.productService.createProduct(body as ProductDTO, files as Express.Multer.File[])

      const message = 'Success create data product'
      logger.info(message)
      return res.status(200).json({ message, data: result })
    } catch (err: any) {
      next(err)
    }
  }

  updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const body = req.body
      const files = req.files

      validate(body, ProductSchema)

      const result = await this.productService.updateProduct(id, body as ProductDTO, files as Express.Multer.File[])

      const message = 'Success update product data'
      logger.info(message)
      return res.status(200).json({ message, data: result })
    } catch (err: any) {
      next(err)
    }
  }

  deleteProductImage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const body = req.body
      const result = await this.productService.deleteProductImage(id, body.picId)

      const message = 'Success delete product data'
      logger.info(message)
      return res.status(200).json({ message, data: result })
    } catch (err: any) {
      next(err)
    }
  }

  deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params
      const result = await this.productService.deleteProduct(id)

      const message = 'Success delete product image'
      logger.info(message)
      return res.status(200).json({ message, data: result })
    } catch (err: any) {
      next(err)
    }
  }
}

export default ProductController
