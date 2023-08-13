import { Application } from 'express'
import { authRoutes } from './auth.routes'
import { categoryRoutes } from './category.routes'
import { userRoutes } from './user.routes'
import { productRoutes } from './product.routes'
import { addressRoutes } from './address.routes'
import { orderRoutes } from './order.routes'

const routes = (app: Application) => {
  app.use('/api/v1/auth', authRoutes)
  app.use('/api/v1/address', addressRoutes)
  app.use('/api/v1/category', categoryRoutes)
  app.use('/api/v1/product', productRoutes)
  app.use('/api/v1/order', orderRoutes)
  app.use('/api/v1/users', userRoutes)
}

export default routes
