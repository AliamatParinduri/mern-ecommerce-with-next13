import { PORT as port } from '@config/index'

import app from './app'
import { logger, connectDB } from './utils'

const server = app.listen(port)
connectDB()
  .then(() => {
    logger.info(`Server running on http:localhost:${port}`)
  })
  .catch((err) => {
    logger.error('Error - connect to Server ', err)
    server.close()
  })
