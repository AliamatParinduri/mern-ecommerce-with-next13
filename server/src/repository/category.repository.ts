/* eslint-disable no-unreachable */
import { CategoryDTO } from '@/dto'
import { Category } from '@/models'
import { InternalServerError, logger } from '@/utils'

class CategoryRepository {
  getCategories = async () => {
    try {
      return await Category.find()
    } catch (err: any) {
      logger.error('ERR = Get Categories ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  createCategory = async (payload: CategoryDTO) => {
    try {
      return await Category.create({
        category: payload.category,
        subCategory: payload.subCategory
      })
    } catch (err: any) {
      logger.error('ERR = Create new category ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  findOne = async (attr: object) => {
    try {
      return await Category.findOne(attr)
    } catch (err: any) {
      logger.error('ERR = Find one category ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  findById = async (userId: string) => {
    try {
      return await Category.findById(userId)
    } catch (err: any) {
      logger.error('ERR = Find by category id ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  updateCategory = async (category: CategoryDTO, payload: CategoryDTO) => {
    try {
      category.category = payload.category
      category.subCategory = payload.subCategory ?? []

      return await category.save()
    } catch (err: any) {
      logger.error('ERR = Update data category ', err.message)
      throw new InternalServerError(err.message)
    }
  }

  deleteCategory = async (categoryId: string) => {
    try {
      return await Category.findByIdAndRemove(categoryId)
    } catch (err: any) {
      logger.error('ERR = Delete data category ', err.message)
      throw new InternalServerError(err.message)
    }
  }
}

export default CategoryRepository
