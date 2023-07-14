import { Application } from 'express'
import { authRoutes } from './auth.routes'
import { userRoutes } from './user.routes'

const routes = (app: Application) => {
  app.use('/api/v1/auth', authRoutes)
  app.use('/api/v1/users', userRoutes)
}

export default routes
