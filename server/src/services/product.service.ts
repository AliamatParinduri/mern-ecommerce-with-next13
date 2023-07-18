import { ProductDTO } from '@/dto'
import { ProductRepository } from '@/repository'
import { UnprocessableEntityError } from '@/utils'

class ProductService {
  productRepository = new ProductRepository()

  // getCategoryById = async (categoryId: string) => {
  //   const result = await this.productRepository.findById(categoryId)

  //   if (!result) {
  //     throw new UnprocessableEntityError('Failed create data category')
  //   }
  //   return result
  // }

  createProduct = async (payload: ProductDTO, files: Express.Multer.File[]) => {
    if (typeof payload.details === 'string') {
      payload.details = JSON.parse(payload.details)
    }

    const productImages = files.map((file) => {
      const ext = file.mimetype.split('/')[1]
      return `${file.fieldname}-${Date.now()}.${ext}`
    })

    const result = await this.productRepository.createProduct(payload, productImages)

    if (!result) {
      throw new UnprocessableEntityError('Failed create data category')
    }
    return result
  }

  // updateCategory = async (categoryId: string, payload: ProductDTO) => {
  //   const category = await this.productRepository.findById(categoryId)

  //   if (!category) {
  //     throw new UnprocessableEntityError('Category not found')
  //   }

  //   const result = await this.productRepository.updateProduct(category, payload)

  //   if (!result) {
  //     throw new UnprocessableEntityError('Failed update data category')
  //   }
  //   return result
  // }

  // deleteCategory = async (categoryId: string) => {
  //   const result = await this.productRepository.deleteProduct(categoryId)

  //   if (!result) {
  //     throw new UnprocessableEntityError('Failed delete data category')
  //   }
  //   return result
  // }
}

export default ProductService
