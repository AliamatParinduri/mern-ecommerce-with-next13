import { ProductDTO } from '@/dto'
import { ProductRepository } from '@/repository'
import { UnprocessableEntityError } from '@/utils'

class ProductService {
  productRepository = new ProductRepository()

  getProducts = async (page: number, limit: number) => {
    const result = await this.productRepository.getProducts(page, limit)

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
