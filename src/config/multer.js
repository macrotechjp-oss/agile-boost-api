const multer = require('multer')

/**
 * --------------- ファイルアップロードの設定 ---------------
 */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    var mimeType = {
      "image/png": "png",
      "image/jpeg": "jpeg",
      "image/gif": "gif",
      "video/mp4": "mp4"
    }
    cb(null, Date.now() + "." + mimeType[file.mimetype])
  }
})

/**
 * --------------- multerのエクスポート ---------------
 */
exports.upload = multer({ storage: storage });