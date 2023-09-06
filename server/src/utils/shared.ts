/* eslint-disable no-unneeded-ternary */
import { ProductDTO } from '@/dto'
import { BaseURL, LinkForgotPassword } from '@config/index'

export type UserToken = {
  _id: string
  isAdmin: boolean
  username: string
  password: string
  iat: number
  exp: number
}

export type Cart = {
  product: ProductDTO
  qty: number
}

export type Wishlist = {
  product: ProductDTO
}

export const SendEmail = (userId: string, info: string) => {
  return `
  ${HeaderEmail()}
  ${Content(
    info === 'verify user' ? 'Confirm your email address' : 'Create new Password',
    info === 'verify user' ? `didn't create an account` : 'not forgot your password',
    info === 'verify user' ? `${BaseURL}/api/v1/auth/${userId}/verifyAccount` : `${LinkForgotPassword}/reset/${userId}`,
    info === 'verify user' ? 'Activate your Account' : 'Create new Password'
  )}  
  ${FooterEmail()}
  `
}

export const getDates = (diff: number, type: string, diff2?: number) => {
  const daysIndex: any = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 }
  const weekend = 7

  let dates: any[] = []
  let index
  const d = diff2 ? diff2 : 0

  switch (type) {
    case 'daily':
      for (let i = 0; i < diff; i++) {
        const date = new Date()

        const firstDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() - i + d)
        const lastDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() - i + d)
        firstDay.setUTCHours(17, 0, 0, 0)
        lastDay.setUTCHours(40, 59, 59, 999)

        dates = [
          {
            start: firstDay.toString(),
            end: lastDay.toString()
          },
          ...dates
        ]
      }

      break
    case 'weekly':
      for (let i = 0; i < diff; i++) {
        const date = new Date()
        const day = date.toString().split(' ')[0]
        index = daysIndex[day]

        const firstDay = new Date(date.getFullYear(), date.getMonth(), date.getDate() - (index + i * weekend) + d)
        const lastDay = new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate() + (weekend - index - 1) - i * weekend + d
        )

        firstDay.setUTCHours(17, 0, 0, 0)
        lastDay.setUTCHours(40, 59, 59, 999)

        dates = [
          {
            start: firstDay.toString(),
            end: lastDay.toString()
          },
          ...dates
        ]
      }
      break
    case 'monthly':
      for (let i = 0; i < diff; i++) {
        const date = new Date()
        const firstDay = new Date(date.getFullYear(), date.getMonth() - i + d, 1)
        const lastDay = new Date(date.getFullYear(), date.getMonth() + 1 - i + d, 0)
        firstDay.setUTCHours(17, 0, 0, 0)
        lastDay.setUTCHours(40, 59, 59, 999)

        dates = [
          {
            start: firstDay.toString(),
            end: lastDay.toString()
          },
          ...dates
        ]
      }
      break
    default:
      for (let i = 0; i < diff; i++) {
        const date = new Date()
        const firstDay = new Date(date.getFullYear() - i + d, 1)
        const lastDay = new Date(date.getFullYear() + 1 - i + d, 0)
        firstDay.setUTCHours(17, 0, 0, 0)
        lastDay.setUTCHours(40, 59, 59, 999)

        dates = [
          {
            start: firstDay.toString(),
            end: lastDay.toString()
          },
          ...dates
        ]
      }
      break
  }

  return dates
}

export const containsDuplicates = (array: string[]) => {
  if (array.length !== new Set(array).size) {
    return true
  }

  return false
}

export const ucWords = (text: string) => {
  const words = text.split(' ')

  for (let i = 0; i < words.length; i++) {
    words[i] = words[i][0].toUpperCase() + words[i].substr(1)
  }

  return words.join(' ')
}

export function formatRupiah(angka: string, prefix?: string) {
  let separator
  const numberString = angka.toString().replace(/[^,\d]/g, '')
  const split = numberString.split(',')
  const sisa = split[0].length % 3
  let rupiah = split[0].substr(0, sisa)
  const ribuan = split[0].substr(sisa).match(/\d{3}/gi)

  // tambahkan titik jika yang di input sudah menjadi angka ribuan
  if (ribuan) {
    separator = sisa ? '.' : ''
    rupiah += separator + ribuan.join('.')
  }

  rupiah = split[1] !== undefined ? rupiah + ',' + split[1] : rupiah
  return prefix === undefined || prefix === '' ? rupiah : rupiah ? prefix + rupiah : ''
}
export function formatAliasesNumber(angka: string, prefix: string) {
  let aliases
  let total

  const angkaAliases = formatRupiah(angka)
  const split = angkaAliases.split('.')

  if (split.length > 1) {
    const decimal = (Number(split[1]) / 1000).toFixed(2)
    total = Number(split[0]) + Number(decimal)
  }

  switch (split.length) {
    case 2:
      aliases = `${total}K`
      break
    case 3:
      aliases = `${total}M`
      break
    case 4:
      aliases = `${total}T`
      break
    case 5:
      aliases = `${total}${'.' + split[1]}T`
      break
    default:
      aliases = `${split[0]}`
      break
  }

  if (prefix === 'Trx') {
    return `${aliases} ${prefix}`
  }

  return prefix === undefined || prefix === '' ? aliases : aliases ? prefix + aliases : ''
}

export const HeaderEmail = () => {
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="x-ua-compatible" content="ie=edge" />
    <title>Email Confirmation</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style type="text/css">
      body,
      table,
      td,
      a {
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
      }
      table,
      td {
        mso-table-rspace: 0pt;
        mso-table-lspace: 0pt;
      }
      a[x-apple-data-detectors] {
        font-family: inherit !important;
        font-size: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
        color: inherit !important;
        text-decoration: none !important;
      }
      div[style*='margin: 16px 0;'] {
        margin: 0 !important;
      }
      body {
        width: 100% !important;
        height: 100% !important;
        padding: 0 !important;
        margin: 0 !important;
      }
      table {
        border-collapse: collapse !important;
      }
      a {
        color: #1a82e2;
      }
    </style>
  </head>
  <body style="background-color: #e9ecef">
  `
}

export const Content = (mainTitle: string, p1: string, link: string, pLink: string) => {
  return ` 
  <table border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center" bgcolor="#e9ecef">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px">
            <tr>
              <td
                align="left"
                bgcolor="#ffffff"
                style="
                  padding: 36px 24px 0;
                  font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                  border-top: 3px solid #d4dadf;
                "
              >
                <h1 style="margin: 0; font-size: 32px; font-weight: 700; letter-spacing: -1px; line-height: 48px">
                  ${mainTitle}
                </h1>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <tr>
        <td align="center" bgcolor="#e9ecef">
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px">
            <tr>
              <td
                align="left"
                bgcolor="#ffffff"
                style="
                  padding: 24px;
                  font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                  font-size: 16px;
                  line-height: 24px;
                "
              >
                <p style="margin: 0">
                  Tap the button below to ${mainTitle}. If you ${p1}, you can safely delete this email.
                </p>
              </td>
            </tr>
            <tr>
              <td align="left" bgcolor="#ffffff">
                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td align="center" bgcolor="#ffffff" style="padding: 12px">
                      <table border="0" cellpadding="0" cellspacing="0">
                        <tr>
                          <td align="center" bgcolor="#1a82e2" style="border-radius: 6px">
                            <a
                              href="${link}"
                              target="_blank"
                              style="
                                display: inline-block;
                                padding: 16px 36px;
                                font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                                font-size: 16px;
                                color: #ffffff;
                                text-decoration: none;
                                border-radius: 6px;
                              "
                              >${pLink}</a
                            >
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td
                align="left"
                bgcolor="#ffffff"
                style="
                  padding: 24px;
                  font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                  font-size: 16px;
                  line-height: 24px;
                "
              >
                <p style="margin: 0">If that doesn't work, Please click the link below:</p>
                <p style="margin: 0">
                  <a href="${link}" target="_blank">Click in Here!</a>
                </p>
              </td>
            </tr>
            <tr>
              <td
                align="left"
                bgcolor="#ffffff"
                style="
                  padding: 24px;
                  font-family: 'Source Sans Pro', Helvetica, Arial, sans-serif;
                  font-size: 16px;
                  line-height: 24px;
                  border-bottom: 3px solid #d4dadf;
                "
              >
                <p style="margin: 0">
                  Cheers,<br /><br /><br />
                  Aliamat Parinduri
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
 `
}

export const FooterEmail = () => {
  return ` 
  </body>
</html>
 `
}
