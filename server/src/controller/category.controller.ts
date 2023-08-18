import { NextFunction, Request, Response } from 'express'

import { CategoryService } from '@/services'
import { logger, validate } from '@/utils'
import { CategoryDTO, CategorySchema } from '@/dto'

class CategoryController {
  categoryService = new CategoryService()

  getCategories = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.categoryService.getCategories()

      const message = 'Success get data categories'
      logger.info(message)
      return res.status(200).json({ message, data: result })
    } catch (err: any) {
      next(err)
    }
  }

  getCategoryById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categoryId = req.params.id

      const result = await this.categoryService.getCategoryById(categoryId)

      const message = 'Success get data category by id'
      logger.info(message)
      return res.status(200).json({ message, data: result })
    } catch (err: any) {
      next(err)
    }
  }

  createCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body

      validate(body, CategorySchema)

      const result = await this.categoryService.createCategory(body as CategoryDTO)

      const message = 'Success create data category'
      logger.info(message)
      return res.status(200).json({ message, data: result })
    } catch (err: any) {
      next(err)
    }
  }

  updateCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categoryId = req.params.id
      const body = req.body

      validate(body, CategorySchema)

      const result = await this.categoryService.updateCategory(categoryId, body as CategoryDTO)

      const message = 'Success update data category'
      logger.info(message)
      return res.status(200).json({ message, data: result })
    } catch (err: any) {
      next(err)
    }
  }

  deleteCategory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const categoryId = req.params.id

      const result = await this.categoryService.deleteCategory(categoryId)

      const message = 'Success delete data category'
      logger.info(message)
      return res.status(200).json({ message, data: result })
    } catch (err: any) {
      next(err)
    }
  }
}

export default CategoryController
