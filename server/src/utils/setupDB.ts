import mongoose from 'mongoose'

import { DBUri } from '@config/index'

import { logger } from '.'

export const connectDB = async () => {
  try {
    await mongoose.connect(DBUri)
    logger.info('Success - connect to database mongoose')
  } catch (err) {
    logger.error('Error - connect to database mongoose ', err)
    // process.exit()
    await closeDB()
  }
}

export const closeDB = async () => {
  await mongoose.connection.close()
}
