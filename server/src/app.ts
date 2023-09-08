import path from 'path'

import express, { Application, NextFunction, Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'

import { BaseError, NotFoundError, logger } from './utils'
import routes from './routes'

const app: Application = express()

app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: 'cross-origin'
    }
  })
)
app.use(express.json())
app.use(express.urlencoded({ limit: '30mb', extended: true }))
app.use(cors())
app.use('/assets', express.static(path.join(__dirname, 'public/assets')))

routes(app)

app.get('/app-version', (req: Request, res: Response, next: NextFunction) => {
  return res.json({
    author: 'Aliamat Parinduri',
    version: '0.1.0'
  })
})

app.use((req: Request, res: Response, next: NextFunction) => {
  throw new NotFoundError('Page Not Found!')
})

app.use((err: BaseError, req: Request, res: Response, next: NextFunction) => {
  const message: string = err.message
  const description: string = err.description
  const statusCode: number = err.statusCode ?? 500

  logger.error(`ERR = ${description ?? message}`)

  return res.status(statusCode).json({ status: 'error', message, description })
})

export default app
