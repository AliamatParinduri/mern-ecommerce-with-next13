import { serverKey, clientKey } from '@config/index'

/* eslint-disable @typescript-eslint/no-var-requires */
const midtransClient = require('midtrans-client')

export const setupMidtrans = new midtransClient.Snap({
  isProduction: false,
  serverKey,
  clientKey
})
