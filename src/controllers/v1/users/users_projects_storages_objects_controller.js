const db = require('../../../models/index');
const minioClient = require('../../../config/minio').minioClient;
const fs = require('fs')
const upload = require('../../../config/multer').upload;
const uploadSingle = upload.single('file');

const usersProjectsStoragesObjectsController = {
  /**
   * ログインユーザー > プロジェクト > ストレージ[Bucket] > オブジェクト一覧取得
   * @param {*} req
   * @param {*} res
   */
  index: async (req, res) => {
    const projectId = req.params.projectId
    const storageId = req.params.storageId
    const userId = req.user.id
    // プロジェクトストレージ取得
    let storage = null
    await db.ProjectStorage.findOne({
      where: {
        projectId: [projectId],
        storageId: [storageId],
        userId: [userId]
      },
      include: [{ model: db.Storage }]
    }).then((projectStorage) => {           // 検索成功
      if (!projectStorage) { res.status(200).json({ result: 'error', error_message: 'Project storage does not exist' }); }
      else { storage = projectStorage.Storage }
    }).catch((error) => {                   // 検索失敗
      return res.status(200).json({ result: 'error', error_message: error });
    });
    // オブジェクトリスト（レスポンス用）
    let objectList = []
    // 【minio】引数
    const bucketName = storage.bucketName
    const prefix = req.query.currentPath
    // 【minio】オブジェクトリスト取得
    const stream = minioClient.extensions.listObjectsV2WithMetadata(bucketName, prefix, false,'')
    stream.on('data', function (obj) { objectList.push(obj) })
    stream.on('error', function (err) { res.status(200).json({ result: 'error', error_message:err }); })
    stream.on('end', function () { res.status(200).json({ result: 'success', objectList:objectList }); })
  },

  /**
   * ログインユーザー > プロジェクト > ストレージ[Bucket] > オブジェクト追加[フォルダ/ファイル]
   * @param {*} req
   * @param {*} res
   */
  create: async (req, res) => {
    const projectId = req.params.projectId
    const storageId = req.params.storageId
    const userId = req.user.id
    // プロジェクトストレージ取得
    let storage = null
    await db.ProjectStorage.findOne({
      where: {
        projectId: [projectId],
        storageId: [storageId],
        userId: [userId]
      },
      include: [{ model: db.Storage }]
    }).then((projectStorage) => {           // 検索成功
      if (!projectStorage) { res.status(200).json({ result: 'error', error_message: 'Project storage does not exist' }); }
      else { storage = projectStorage.Storage }
    }).catch((error) => {                   // 検索失敗
      return res.status(200).json({ result: 'error', error_message: error });
    });
    // バックアップファイル作成 ※formData取得の為、フォルダ作成の場合も通過
    uploadSingle(req, res, function (err) {
      if (err) return res.status(200).json({ result: 'error', err: err });
      // アップロードタイプ毎の処理
      if (req.body.uploadType == "folder") {          // フォルダ追加の場合
        // 【minio】引数
        const bucketName = storage.bucketName
        const objectName = req.body.currentPath + '.keep'
        const filePath = 'uploads/.keep'
        const metaData = {}
        // 【minio】オブジェクト作成
        minioClient.fPutObject(bucketName, objectName, filePath, metaData, function (err, objInfo) {
          if (err) return res.status(200).json({ result: 'error', error_message: err });
          res.status(200).json({ result: 'success' });
        })
      } else if(req.body.uploadType == "file") {      // ファイル追加の場合
        if (req.file) {                               // バックアップファイル存在時
          // 【minio】引数
          const bucketName = storage.bucketName
          const objectName = req.body.currentPath + req.file.originalname
          const filePath = req.file.path
          const metaData = {}
          // 【minio】オブジェクト作成
          minioClient.fPutObject(bucketName, objectName, filePath, metaData, function (err, objInfo) {
            if (err) return res.status(200).json({ result: 'error', error_message: err });
            fs.unlink(filePath, (err) => {            // バックアップファイル削除
              if (err) return res.status(200).json({ result: 'error', error_message: err });
              res.status(200).json({ result: 'success' });
            })
          })
        } else {                                      // バックアップファイル作成失敗
          res.status(200).json({ result: 'error', error_message: 'Failed to create temporary file' });
        }
      } else {
        res.status(200).json({ result: 'error', error_message: 'Upload type does not exist' });
      }
    })
  },

  /**
   * ログインユーザー > プロジェクト > ストレージ[Bucket] > オブジェクトダウンロード
   * @param {*} req
   * @param {*} res
   */
  show: async (req, res) => {
    const projectId = req.params.projectId
    const storageId = req.params.storageId
    const userId = req.user.id
    // プロジェクトストレージ取得
    let storage = null
    await db.ProjectStorage.findOne({
      where: {
        projectId: [projectId],
        storageId: [storageId],
        userId: [userId]
      },
      include: [{ model: db.Storage }]
    }).then((projectStorage) => {           // 検索成功
      if (!projectStorage) { res.status(200).json({ result: 'error', error_message: 'Project storage does not exist' }); }
      else { storage = projectStorage.Storage }
    }).catch((error) => {                   // 検索失敗
      return res.status(200).json({ result: 'error', error_message: error });
    });
    // 【minio】引数
    console.log(req.params.objectName)
    const bucketName = storage.bucketName
    const objectName = req.params.objectName
    const filePath = 'uploads/tmp/' + objectName
    // 【minio】オブジェクト取得 + Tmp保存
    minioClient.fGetObject(bucketName, objectName, filePath, function(err) {
      if (err) { return res.status(500).json({ result: 'error', error_message: err }); }
      // Tmpファイルレスポンス
      res.download(filePath, (err) => {
        if (err) { return res.status(500).send({ result: 'error', error_message: ["File can not be downloaded", err] }); }
        // Tmpファイル削除
        fs.unlink(filePath, (err) => {
          if (err) { return res.status(500).json({ result: 'error', error_message:err }); }
        })
      });
    })
  },

  /**
   * ログインユーザー > プロジェクト > ストレージ[Bucket] > オブジェクト削除
   * @param {*} req
   * @param {*} res
   */
  destroy: async (req, res) => {
    const projectId = req.params.projectId
    const storageId = req.params.storageId
    const userId = req.user.id
    // プロジェクトストレージ取得
    let storage = null
    await db.ProjectStorage.findOne({
      where: {
        projectId: [projectId],
        storageId: [storageId],
        userId: [userId]
      },
      include: [{ model: db.Storage }]
    }).then((projectStorage) => {           // 検索成功
      if (!projectStorage) { res.status(200).json({ result: 'error', error_message: 'Project storage does not exist' }); }
      else { storage = projectStorage.Storage }
    }).catch((error) => {                   // 検索失敗
      return res.status(200).json({ result: 'error', error_message: error });
    });
    // 【minio】引数
    const bucketName = storage.bucketName
    const prefix = req.params.objectName
    const objectsList = []
    // 【minio】オブジェクトリスト取得
    const stream = minioClient.extensions.listObjectsV2WithMetadata(bucketName, prefix, false,'')
    stream.on('data', function (obj) { objectsList.push(obj.name); })
    stream.on('error', function (err) { res.status(200).json({ result: 'error', error_message:err }); })
    stream.on('end', function () {
      // 【minio】オブジェクト削除
      minioClient.removeObjects(bucketName, objectsList, function(e) {
        if (e) { return res.status(200).json({ result: 'error', error_message:e }); }
        res.status(200).json({ result: 'success' });
      })
    })
  }
}

module.exports = usersProjectsStoragesObjectsController;