import { PORT as port } from '@config/index'

import app from './app'
import { logger, connectDB } from './utils'

const setupServer = async () => {
  await connectDB()
  app.listen(port, () => logger.info(`Server running on http:localhost:${port}`))
}

setupServer()
