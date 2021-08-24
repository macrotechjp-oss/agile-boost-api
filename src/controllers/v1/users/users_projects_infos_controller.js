const db = require('../../../models/index');

const usersProjectsInfosController = {
  /**
   * プロジェクト > お知らせ一覧取得[受信者(ログインユーザー)]
   * @param {*} req
   * @param {*} res
   */
  index: (req, res) => {
    /** TODO：受信お知らせのみ取得。現況は全て取得している。 */
    // ユーザーID
    const userId = req.user.id
    // プロジェクトID
    const projectId = req.params.projectId
    // プロジェクトお知らせ検索
    db.ProjectInfo.findAll({
      where: {
        projectId: [projectId]
      },
      include: [{ model: db.Info }],
      order: [
        [db.Info, 'infoPostTime', 'DESC']
      ]
    }).then((projectInfos) => {                          // 検索成功
      res.status(200).json({ result: 'success', projectInfos: projectInfos });
    }).catch((error) => {                             // 検索失敗
      console.log(error)
      res.status(200).json({ result: 'error', error_message: error });
    });
  },

  /**
   * プロジェクト > お知らせ作成[作成者(ログインユーザー)]
   * @param {*} req
   * @param {*} res
   */
  create: (req, res) => {
    // 登録データ
    const registData = {
      userId: req.user.id,
      projectId: req.params.projectId,
      infoTitle: req.body.infoTitle,
      infoDetail: req.body.infoDetail,
      infoPostTime: new Date()
    }
    // お知らせ追加
    db.Info.create({
      infoTitle: registData.infoTitle,
      infoDetail: registData.infoDetail,
      infoPostTime: registData.infoPostTime,
      authorUserId: registData.userId,
      createdAt: new Date(),
      updatedAt: new Date()
    }).then(info => {
      if (info) {                           // お知らせ追加成功
        // プロジェクトお知らせ追加
        db.ProjectInfo.create({
          projectId: registData.projectId,
          infoId: info.id,
          createdAt: new Date(),
          updatedAt: new Date()
        }).then(projectInfo => {            // プロジェクトお知らせ追加成功
          if (projectInfo) {
            res.status(200).json({ result: 'success', info: info });
          } else {                          // プロジェクトお知らせ追加失敗
            res.status(200).json({ result: 'error', error_message: 'Failed to add project info' });
          }
        }).catch((error) => {               // プロジェクトお知らせ追加失敗
          res.status(200).json({ result: 'error', error_message: error });
        });
      } else {                              // お知らせ追加失敗
        res.status(200).json({ result: 'error', error_message: 'Failed to add info' });
      }
    }).catch((error) => {                   // お知らせ追加失敗
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

module.exports = usersProjectsInfosController;