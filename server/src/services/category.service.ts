import { CategoryDTO } from '@/dto'
import { CategoryRepository } from '@/repository'
import { UnprocessableEntityError, containsDuplicates } from '@/utils'

class CategoryService {
  categoryRepository = new CategoryRepository()

  getCategories = async () => {
    const result = await this.categoryRepository.getCategories()

    if (result.length < 0) {
      throw new UnprocessableEntityError('Failed get data category, Data not found')
    }
    return result
  }

  getCategoryById = async (categoryId: string) => {
    const result = await this.categoryRepository.findById(categoryId)

    if (!result) {
      throw new UnprocessableEntityError('Failed get data category, Data not found')
    }
    return result
  }

  createCategory = async (payload: CategoryDTO) => {
    const categoryExists = await this.categoryRepository.findOne({ category: payload.category })

    if (categoryExists) {
      throw new UnprocessableEntityError('Category already exists')
    }

    // eslint-disable-next-line array-callback-return
    // check if sub category has same value
    const checkSubCategory = containsDuplicates(payload.subCategory)
    if (checkSubCategory) {
      throw new UnprocessableEntityError(`Sub Category can't have the same value`)
    }

    const result = await this.categoryRepository.createCategory(payload)

    if (!result) {
      throw new UnprocessableEntityError('Failed create data category')
    }
    return result
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
