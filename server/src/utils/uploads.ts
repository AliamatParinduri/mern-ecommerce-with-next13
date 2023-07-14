import multer from 'multer'

// File Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'src/public/assets')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

exports.upload = multer({ storage })
