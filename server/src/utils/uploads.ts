import multer from 'multer'

// File Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/public/assets')
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split('/')[1]
    cb(null, `${file.fieldname}-${Date.now()}.${ext}`)
  }
})

export const upload = multer({ storage })
