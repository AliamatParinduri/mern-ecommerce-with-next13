import 'dotenv/config'

const images = 'user-default.png'

export const PORT = process.env.PORT ?? 8000
export const BaseURL = process.env.BASE_URL ?? `http://localhost:${PORT}`
export const DefaultPicture = process.env.DefaultPicture ?? images
export const DBUri = process.env.DBUri ?? 'your uri'
export const privateKey = process.env.privateKey ?? 'your key'
export const publicKey = process.env.publicKey ?? 'your key'
export const LinkForgotPasswordUser = process.env.LinkForgotPasswordUser ?? 'http://localhost'
export const LinkForgotPasswordAdmin = process.env.LinkForgotPasswordAdmin ?? 'http://localhost'

export const SMTP_HOST = process.env.SMTP_HOST ?? 'your host'
export const SMTP_PORT = process.env.SMTP_PORT ?? 587
export const SMTP_MAIL = process.env.SMTP_MAIL ?? 'your mail'
export const SMTP_PASSWORD = process.env.SMTP_PASSWORD ?? 'your password'

export const serverKey = process.env.serverKey ?? 'your key'
export const clientKey = process.env.clientKey ?? 'your key'

export const RAJAONGKIR_ENDPOINT = process.env.RAJAONGKIR_ENDPOINTAPI ?? 'your uri'
export const RAJAONGKIR_APIKEY = process.env.RAJAONGKIR_APIKEY ?? 'your key'
export const originKecamatanId = '1062'
export const originKecamatanType = 'subdistrict'
