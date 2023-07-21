import { CategoryDTO } from '@/dto'
import { CategoryRepository } from '@/repository'
import { UnprocessableEntityError } from '@/utils'

class CategoryService {
  categoryRepository = new CategoryRepository()

  getCategoryById = async (categoryId: string) => {
    const result = await this.categoryRepository.findById(categoryId)

    if (!result) {
      throw new UnprocessableEntityError('Failed get data category, Data not found')
    }
    return result
  }

  createCategory = async (payload: CategoryDTO) => {
    const result = await this.categoryRepository.createCategory(payload)

    if (!result) {
      throw new UnprocessableEntityError('Failed create data category')
    }
    return result
  }

  updateCategory = async (categoryId: string, payload: CategoryDTO) => {
    const category = await this.categoryRepository.findById(categoryId)

    if (!category) {
      throw new UnprocessableEntityError('Category not found')
    }

    const result = await this.categoryRepository.updateCategory(category, payload)

    if (!result) {
      throw new UnprocessableEntityError('Failed update data category')
    }
    return result
  }

  deleteCategory = async (categoryId: string) => {
    const result = await this.categoryRepository.deleteCategory(categoryId)

    if (!result) {
      throw new UnprocessableEntityError('Failed delete data category')
    }
    return result
  }
}

export default CategoryService
