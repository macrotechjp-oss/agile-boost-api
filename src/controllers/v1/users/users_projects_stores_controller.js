const db = require('../../../models/index');

const usersProjectsStoresController = {
  /**
   * ログインユーザー > プロジェクト > ストア一覧取得
   * @param {*} req
   * @param {*} res
   */
  index: (req, res) => {
    // ユーザーID
    const userId = req.user.id
    // プロジェクトID
    const projectId = req.params.projectId
    // プロジェクトお知らせ検索
    db.UserProjectStore.findAll({
      where: {},
      include: [
        {
          model: db.UserProject,
          where: { userId: [userId], projectId: [projectId] }
        },{
          model: db.Store
        }
      ]
    }).then((userProjectStores) => {                          // 検索成功
      res.status(200).json({ result: 'success', userProjectStores: userProjectStores });
    }).catch((error) => {                             // 検索失敗
      console.log(error)
      res.status(200).json({ result: 'error', error_message: error });
    });
  },

  /**
   * ログインユーザー > プロジェクト > ストア追加
   * @param {*} req
   * @param {*} res
   */
  create: (req, res) => {
    // ユーザーID
    const userId= req.user.id
    // プロジェクトID
    const projectId= req.params.projectId
    // ストアID
    const storeId= req.body.storeId
    // ユーザープロジェクト検索
    db.UserProject.findOne({
      where: {
        userId: [userId],
        projectId: [projectId]
      }
    }).then((userProject) => {
      if(!userProject){             // ユーザープロジェクト未存在
        res.status(200).json({ result: 'error', error_message: "Not not found user project to be created" });
      }else{                        // ユーザープロジェクト存在
        // ユーザープロジェクトストア登録
        db.UserProjectStore.create({
          userProjectId: userProject.id,
          storeId: storeId,
          createdAt: new Date(),
          updatedAt: new Date()
        }).then(userProjectStore => {
          if (userProjectStore) {               // 登録成功
            res.status(200).json({ result: 'success', userProjectStore: userProjectStore });
          } else {                  // 登録失敗
            res.status(200).json({ result: 'error', error_message: 'Failed to add user project store' });
          }
        }).catch((error) => {       // 登録失敗
          res.status(200).json({ result: 'error', error_message: error });
        });
      }
    }).catch((error) => {           // ユーザープロジェクト検索失敗
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
    res.status(200).json({ result: 'success' });
  },

  /**
   * ログインユーザー > プロジェクト > ストア削除
   * @param {*} req
   * @param {*} res
   */
  destroy: (req, res) => {
    console.log("削除")
    // ユーザーID
    const userId = req.user.id
    // プロジェクトID
     const projectId = req.params.projectId
    // ストアID
    const storeId = req.params.storeId
    // プロジェクトストア検索
    db.UserProjectStore.findOne({
      where: { storeId: [storeId] },
      include: [{
        model: db.UserProject,
        where: { 
          userId: [userId],
          projectId: [projectId]
        }
      }]
    }).then((userProjectStore) => {
      if(!userProjectStore) {          // プロジェクトお知らせが存在しない為、削除しない
        res.status(200).json({ result: 'error', error_message: 'The user project store to be deleted does not exist' });
      } else {                    // プロジェクトお知らせが存在する為、削除実行
        userProjectStore.destroy();
        res.status(200).json({ result: 'success' });
      }
    }).catch((error) => {         // 検索失敗
      res.status(200).json({ result: 'error', error_message: error });
    });
  }
}

module.exports = usersProjectsStoresController;