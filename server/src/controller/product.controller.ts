import { NextFunction, Request, Response } from 'express'

import { ProductService } from '@/services'
import { logger, validate } from '@/utils'
import { ProductDTO, ProductSchema } from '@/dto'

class ProductController {
  productService = new ProductService()

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
}

export default ProductController
