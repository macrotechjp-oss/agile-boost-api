const db = require('../../../models/index');
const minioClient = require('../../../config/minio').minioClient;

const usersProjectsStoragesController = {
  /**
   * ログインユーザー > プロジェクト > ストレージ取得
   * @param {*} req
   * @param {*} res
   */
  index: (req, res) => {
    // ユーザーID
    const userId = req.user.id
    // プロジェクトID
    const projectId = req.params.projectId
    // プロジェクトストレージ検索
    // let storage = null
    db.ProjectStorage.findOne({
      where: {
        projectId: [projectId],
        userId: [userId]
      },
      include: [{ model: db.Storage }]
    }).then((projectStorage) => {           // 検索成功
      // バケットサイズ
      let bucketSize = 0
      if (!projectStorage) {                // プロジェクトストレージ未存在
        res.status(200).json({ result: 'success', projectStorage: projectStorage });
      } else {                              // プロジェクトストレージ存在
        // 【minio】引数
        const bucketName = projectStorage.Storage.bucketName
        // 【minio】オブジェクトリスト取得
        const stream = minioClient.listObjects(bucketName, '', true)
        stream.on('data', function(obj) { bucketSize += obj.size } )
        stream.on('error', function (err) { res.status(200).json({ result: 'error', error_message: err }); })
        stream.on('end', function () {
          const bucketInfo = {
            size: bucketSize
          }
          res.status(200).json({ result: 'success', projectStorage: projectStorage, bucketInfo:bucketInfo });
        })
      }
    }).catch((error) => {                   // 検索失敗
      res.status(200).json({ result: 'error', error_message: error });
    });
  },

  /**
   * ログインユーザー > プロジェクト > ストレージ追加
   * @param {*} req
   * @param {*} res
   */
  create: (req, res) => {
    // ユーザーID
    const userId = req.user.id
    // プロジェクトID
    const projectId = req.params.projectId
    // バケット名（プロジェクID + 作成日時）
    const bucketName = projectId + "." + new Date().getTime().toString()
    // minioバケット作成
    minioClient.makeBucket(bucketName, 'ap-northeast-1', function(err) {
      if (err) return res.status(200).json({ result: 'error', error_message: err });
    })
    // ストレージ追加
    db.Storage.create({
      bucketName: bucketName,
      createdAt: new Date(),
      updatedAt: new Date()
    }).then(storage => {
      if (!storage) {                       // ストレージ追加失敗
        res.status(200).json({ result: 'error', error_message: 'Failed to add storage' });
      } else {                              // ストレージ追加成功
        // プロジェクトストレージ追加
        db.ProjectStorage.create({
          projectId: projectId,
          storageId: storage.id,
          userId: userId,
          createdAt: new Date(),
          updatedAt: new Date()
        }).then(projectStorage => {
          if (!projectStorage) {            // プロジェクトストレージ追加失敗
            res.status(200).json({ result: 'error', error_message: 'Failed to add project storage' });
          } else {                          // プロジェクトストレージ追加成功
            res.status(200).json({ result: 'success', storage: storage });
          }
        }).catch((error) => {               // プロジェクトストレージ追加失敗
          console.log(error)
          res.status(200).json({ result: 'error', error_message: error });
        });
      }
    }).catch((error) => {                   // ストレージ追加失敗
      console.log(error)
      res.status(200).json({ result: 'error', error_message: error });
    });
  },

  /**
   * プロジェクト > お知らせ詳細取得[受信者(ログインユーザー)]
   * @param {*} req
   * @param {*} res
   */
  show: (req, res) => {
    res.status(200).json({ result: 'success' });
  },

  /**
   * プロジェクト > お知らせ詳細更新[作成者(ログインユーザー)]
   * @param {*} req
   * @param {*} res
   */
  update: (req, res) => {
    // 検索用データ
    const searchData = {
      userId: req.user.id,
      projectId: req.params.projectId,
      memoId: req.params.memoId
    }
    // 更新データ
    const updateData = {
      memoTitle: req.body.memoTitle,
      memoDetail: req.body.memoDetail,
      memoIcon: req.body.memoIcon
    }
    // 更新対象メモ情報取得
    db.ProjectMemo.findOne({
      where: {
        projectId: [searchData.projectId],
        memoId: [searchData.memoId]
      },
      include: [{
        model: db.Memo,
        where: { authorUserId: [searchData.userId] }
      }]
    }).then((projectMemo) => {
      if(!projectMemo) {                    // メモ情報が存在しない
        res.status(200).json({ result: 'error', error_message: "Not not found memo to be updated" });
      } else {                              // メモ情報が存在する
        // メモ情報更新
        db.Memo.update(updateData, { where: { id: projectMemo.Memo.id } }
        ).then((result) => {
          if(result) {                        // 更新成功
            db.Memo.findByPk(projectMemo.Memo.id).then(memo => {  // メモ情報取得（更新後データ）
              res.status(200).json({ result: 'success', memo: memo });
            }).catch((error) => {                                 // メモ情報取得失敗
              res.status(200).json({ result: 'error', error_message: error });
            });
          } else {                          // 更新失敗
            res.status(200).json({ result: 'error', error_message: 'Memo update failed' });
          }
        }).catch((error) => {               // 更新失敗
          res.status(200).json({ result: 'error', error_message: error });
        });
      }
    }).catch((error) => {                   // メモ情報取得失敗
      res.status(200).json({ result: 'error', error_message: error });
    });
  },

  /**
   * プロジェクト > お知らせ削除[作成者(ログインユーザー)]
   * @param {*} req
   * @param {*} res
   */
  destroy: (req, res) => {
    // ユーザーID
    const userId = req.user.id
    // 削除用データ
    const deleteData = {
      projectId: req.params.projectId,
      infoId: req.params.infoId
    }
    // プロジェクトお知らせ検索
    db.ProjectInfo.findOne({
      where: {
        projectId: [deleteData.projectId],
        infoId: [deleteData.infoId]
      },
      include: [{
        model: db.Info,
        where: { authorUserId: [userId] }
      }]
    }).then((projectInfo) => {
      if(!projectInfo) {          // プロジェクトお知らせが存在しない為、削除しない
        res.status(200).json({ result: 'error', error_message: 'The info to be deleted does not exist' });
      } else {                    // プロジェクトお知らせが存在する為、削除実行
        projectInfo.destroy();
        res.status(200).json({ result: 'success' });
      }
    }).catch((error) => {         // 検索失敗
      res.status(200).json({ result: 'error', error_message: error });
    });
  }
}

module.exports = usersProjectsStoragesController;