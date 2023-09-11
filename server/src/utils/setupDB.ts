import mongoose from 'mongoose'

import { DBUri } from '@config/index'

import { InternalServerError, logger } from '.'

export const connectDB = async () => {
  try {
    await mongoose.connect(DBUri)
    logger.info('Success - connect to database mongoose')
  } catch (err) {
    logger.error('Error - connect to database mongoose ', err)
    await closeDB()
    throw new InternalServerError('Error - connect to database mongoose')
  }
}

export const closeDB = async () => {
  await mongoose.connection.close()
}
