import fs from 'fs'

import multer from 'multer'

// File Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const folder = req.originalUrl.split('/')[3]
    const path = 'src/public/assets/' + folder
    const isExist = fs.existsSync(path)

    if (!isExist) {
      fs.mkdirSync(path)
    }

    cb(null, path)
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split('/')[1]
    const fileName = `${file.fieldname}-${Date.now()}.${ext}`

    cb(null, fileName)
  }
})

export const upload = multer({ storage })
