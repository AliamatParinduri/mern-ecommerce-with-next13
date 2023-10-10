import { Application } from 'express'
import { authRoutes } from './auth.routes'
import { categoryRoutes } from './category.routes'
import { userRoutes } from './user.routes'
import { productRoutes } from './product.routes'
import { paymentRoutes } from './payment.routes'
import { addressRoutes } from './address.routes'
import { ratingRoutes } from './rating.routes'
import { orderRoutes } from './order.routes'

const routes = (app: Application) => {
  const v1 = '/api/v1'

  app.use(`${v1}/auth`, authRoutes)
  app.use(`${v1}/address`, addressRoutes)
  app.use(`${v1}/category`, categoryRoutes)
  app.use(`${v1}/product`, productRoutes)
  app.use(`${v1}/payment`, paymentRoutes)
  app.use(`${v1}/order`, orderRoutes)
  app.use(`${v1}/rating`, ratingRoutes)
  app.use(`${v1}/users`, userRoutes)
}

export default routes
