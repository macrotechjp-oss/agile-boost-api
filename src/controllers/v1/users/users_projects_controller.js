const db = require('../../../models/index');

const usersProjectsController = {
  /**
   * 【取得】ログインユーザー > プロジェクト一覧
   * @param {*} req
   * @param {*} res
   */
  index: (req, res) => {
    // ユーザーID
    const userId = req.user.id
    // ユーザープロジェクト検索
    db.UserProject.findAll({
      where: { userId: [userId] },
      include: [{ model: db.Project }]
    }).then((userProject)=>{                          // 検索成功
      res.status(200).json({ result: 'success', userProject: userProject });
    }).catch((error) => {                             // 検索失敗
      res.status(200).json({ result: 'error', error_message: error });
    });
  },

  /**
   * 【作成】ログインユーザー > プロジェクト
   * @param {*} req
   * @param {*} res
   */
  create: (req, res) => {
    // リクエストパラメーター
    const projectId = req.body.projectId
    const seacretCode = req.body.seacretCode
    // プロジェクト検索
    db.Project.findOne({ where: { id: [projectId] } }).then(project => {
      if (project && !project.isPrivate) {            // プロジェクト存在 and 公開プロジェクト
        /** 処理を進める */
      } else if(project && project.isPrivate) {       // プロジェクト存在 and 非公開プロジェクト
        // 認証コード判定（※TODO 認証コード有効期限判定）
        if (project.seacretCode == seacretCode) {     // 非公開プロジェクト認証成功時
          /** 処理を進める */
        } else {                                      // 非公開プロジェクト認証失敗時
          return res.status(200).json({ result: 'error', error_message: "Project authentication failed" });
        }
      } else {                                        // プロジェクト未存在
        return res.status(200).json({ result: 'error', error_message: "Project does not exist" });
      }
      // ユーザープロジェクト登録
      db.UserProject.create({
        userId: req.user.id,
        projectId: projectId,
        createdAt: new Date(),
        updatedAt: new Date()
      }).then(userProject => {                        // 登録成功
        res.status(200).json({ result: 'success', userProject: userProject });
      }).catch((error) => {                           // 登録失敗
        res.status(200).json({ result: 'error', error_message: error });
      });
    }).catch((error) => {                             // プロジェクト検索失敗
      res.status(200).json({ result: 'error', error_message: error });
    });
  },

  /**
   * 【取得】ログインユーザー > プロジェクト詳細
   * @param {*} req
   * @param {*} res
   */
  show: (req, res) => {
    // ユーザーID
    const userId = req.user.id
    // プロジェクトID
    const projectId = req.params.projectId
    // ユーザープロジェクト検索
    db.UserProject.findOne({
      where: {
        userId: [userId],
        projectId: [projectId]
      },
      include: [{ model: db.Project }]
    }).then((userProject)=>{                          // 検索成功
      res.status(200).json({ result: 'success', userProject: userProject });
    }).catch((error) => {                             // 検索失敗
      res.status(200).json({ result: 'error', error_message: error });
    });
  },

  /**
   * 【更新】ログインユーザー > プロジェクト詳細
   * @param {*} req
   * @param {*} res
   */
  update: (req, res) => {
    res.status(200).json({ result: '【WIP】ログインユーザー > プロジェクト詳細更新' });
  },

  /**
   * 【削除】ログインユーザー > プロジェクト
   * @param {*} req
   * @param {*} res
   */
  destroy: (req, res) => {
    // ユーザーID
    const userId = req.user.id
    // プロジェクトID
    const projectId = req.params.projectId
    // ユーザープロジェクト検索
    db.UserProject.findOne({
      where: {
        userId: [userId],
        projectId: [projectId]
      }
    }).then((userProject) => {
      if(!userProject) {          // ユーザープロジェクトが存在しない為、削除しない
        res.status(200).json({ result: 'error', error_message: 'The user project to be deleted does not exist' });
      } else {                    // ユーザープロジェクトが存在する為、削除実行
        userProject.destroy();
        res.status(200).json({ result: 'success' });
      }
    }).catch((error) => {         // 検索失敗
      res.status(200).json({ result: 'error', error_message: error });
    });
  },
}

module.exports = usersProjectsController;