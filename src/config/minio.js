const Minio = require('minio')

/**
 * --------------- minioのエクスポート ---------------
 */
exports.minioClient = new Minio.Client({
  endPoint: 'minio',
  port: 9000,
  useSSL: false,
  accessKey: 'access_key',
  secretKey: 'secret_key'
});