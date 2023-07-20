import { SMTP_HOST, SMTP_MAIL, SMTP_PASSWORD, SMTP_PORT } from '@config/index'
import nodemailer from 'nodemailer'
import { SendEmail } from './shared'

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT),
  secure: false,
  auth: {
    user: SMTP_MAIL,
    pass: SMTP_PASSWORD
  }
})

export const sendEmail = async (userId: string, email: string, info: string) => {
  const mailOptions = {
    from: SMTP_MAIL,
    to: email,
    subject: info === 'verify user' ? 'Verify Registration User' : 'Forgot Password',
    html: SendEmail(userId, info)
  }

  return await transporter.sendMail(mailOptions)
}
