// eslint-disable-next-line array-callback-return
import { CategoryDTO } from '@/dto'
import { CategoryRepository } from '@/repository'
import { UnprocessableEntityError, containsDuplicates } from '@/utils'

class CategoryService {
  categoryRepository = new CategoryRepository()

  getCategories = async () => {
    return await this.categoryRepository.getCategories()
  }

  getCategoryById = async (categoryId: string) => {
    return await this.categoryRepository.findById(categoryId)
  }

  createCategory = async (payload: CategoryDTO) => {
    const categoryExists = await this.categoryRepository.findOne({ category: payload.category })

    if (categoryExists) {
      throw new UnprocessableEntityError('Category already exists')
    }

    const checkSubCategory = containsDuplicates(payload.subCategory)
    if (checkSubCategory) {
      throw new UnprocessableEntityError(`Sub Category can't have the same value`)
    }

    return await this.categoryRepository.createCategory(payload)
  }

  updateCategory = async (categoryId: string, payload: CategoryDTO) => {
    const categoryExists = await this.categoryRepository.findOne({
      _id: { $ne: categoryId },
      category: payload.category
    })
    if (categoryExists) {
      throw new UnprocessableEntityError(`Category already exists`)
    }

    const category = await this.categoryRepository.findById(categoryId)

    return await this.categoryRepository.updateCategory(category, payload)
  }

  deleteCategory = async (categoryId: string) => {
    return await this.categoryRepository.deleteCategory(categoryId)
  }
}

export default CategoryService
