const db = require('../../../models/index');
const { check, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');

const usersProjectsMemosController = {
  /**
   * ログインユーザー > プロジェクト > メモ一覧取得
   * @param {*} req
   * @param {*} res
   */
  index: (req, res) => {
    // ユーザーID
    const userId = req.user.id
    // プロジェクトID
    const projectId = req.params.projectId
    // プロジェクトメモ検索
    db.ProjectMemo.findAll({
      where: {
        projectId: [projectId]
      },
      include: [{
        model: db.Memo,
        where: { authorUserId: [userId] }
      }]
    }).then((projectMemos) => {                          // 検索成功
      res.status(200).json({ result: 'success', projectMemos: projectMemos });
    }).catch((error) => {                             // 検索失敗
      console.log(error)
      res.status(200).json({ result: 'error', error_message: error });
    });
  },

  /**
   * ログインユーザー > プロジェクト > メモ追加
   * @param {*} req
   * @param {*} res
   */
  create: (req, res) => {
    // ユーザーID
    const userId = req.user.id
    // プロジェクトID
    const projectId = req.params.projectId
    // メモ追加
    db.Memo.create({
      memoTitle: 'NEW',
      memoDetail: '',
      memoIcon: 'account',
      authorUserId: userId,
      createdAt: new Date(),
      updatedAt: new Date()
    }).then(memo => {
      if (memo) {                           // メモ追加成功
        // プロジェクトメモ追加
        db.ProjectMemo.create({
          projectId: projectId,
          memoId: memo.id,
          createdAt: new Date(),
          updatedAt: new Date()
        }).then(projectMemo => {            // プロジェクトメモ追加成功
          if (projectMemo) {
            res.status(200).json({ result: 'success', memo: memo });
          } else {                          // プロジェクトメモ追加失敗
            res.status(200).json({ result: 'error', error_message: 'Failed to add project memo' });
          }
        }).catch((error) => {               // プロジェクトメモ追加失敗
          res.status(200).json({ result: 'error', error_message: error });
        });
      } else {                              // メモ追加失敗
        res.status(200).json({ result: 'error', error_message: 'Failed to add memo' });
      }
    }).catch((error) => {                   // メモ追加失敗
      res.status(200).json({ result: 'error', error_message: error });
    });
  },

  /**
   * ログインユーザー > プロジェクト > メモ詳細取得
   * @param {*} req
   * @param {*} res
   */
  show: (req, res) => {
    res.status(200).json({ result: 'success' });
  },

  /**
   * ログインユーザー > プロジェクト > メモ詳細更新
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
   * ログインユーザー > プロジェクト > メモ詳細削除
   * @param {*} req
   * @param {*} res
   */
  destroy: (req, res) => {
    console.log(8989)
    // ユーザーID
    const userId = req.user.id
    // 削除用データ
    const deleteData = {
      projectId: req.params.projectId,
      memoId: req.params.memoId
    }
    // プロジェクトID
    db.ProjectMemo.findOne({
      where: {
        projectId: [deleteData.projectId],
        memoId: [deleteData.memoId]
      },
      include: [{
        model: db.Memo,
        where: { authorUserId: [userId] }
      }]
    }).then((projectMemo) => {
      if(!projectMemo) {          // プロジェクトメモが存在しない為、削除しない
        res.status(200).json({ result: 'error', error_message: 'The memo to be deleted does not exist' });
      } else {                    // プロジェクトメモが存在する為、削除実行
        projectMemo.destroy();
        res.status(200).json({ result: 'success' });
      }
    }).catch((error) => {               // 更新失敗
      res.status(200).json({ result: 'error', error_message: error });
    });
  }
}

module.exports = usersProjectsMemosController;