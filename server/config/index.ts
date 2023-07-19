import 'dotenv/config'

const images = 'user-default.png'

export const PORT = process.env.PORT ?? 8000
export const BaseURL = `http://localhost:${PORT}`
export const DefaultPicture = process.env.DefaultPicture ?? images
export const DBUri = process.env.DBUri ?? 'your uri'
export const privateKey = process.env.privateKey ?? 'your key'
export const publicKey = process.env.publicKey ?? 'your key'
export const LinkForgotPassword = process.env.LinkForgotPassword ?? 'http://localhost'

export const SMTP_HOST = process.env.SMTP_HOST ?? 'your host'
export const SMTP_PORT = process.env.SMTP_PORT ?? 587
export const SMTP_MAIL = process.env.SMTP_MAIL ?? 'your mail'
export const SMTP_PASSWORD = process.env.SMTP_PASSWORD ?? 'your password'
