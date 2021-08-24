const db = require('../../models/index');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const projectsController = {
  /**
   * 【取得】プロジェクト一覧
   * @param {*} req
   * @param {*} res
   */
  index: async (req, res) => {
    let where = {}  // フィルタリング条件
    if (req.query.projectId) where['id'] = { [Op.like]: '%'+req.query.projectId+'%' }
    await db.Project.findAll({ where }
    ).then(projects => { res.status(200).json({ result: 'success', projects: projects }); }
      ).catch((error) => { res.status(200).json({ result: 'error', error_message: error }); });
  },

  create: (req, res) => {
    res.send('respond with a new');
  },

  /**
   * 【取得】プロジェクト詳細
   * @param {*} req
   * @param {*} res
   */
  show: (req, res) => {
    // TODO：アクセス認可チェック
    // プロジェクトID
    const projectId = req.params.projectId
    // プロジェクト検索
    db.Project.findOne({
      where: { id: [projectId] }
    }).then((project) => {
      if (project) {                                  // プロジェクト存在
        res.status(200).json({ result: 'success', project: project });
      } else {                                        // プロジェクト未存在
        res.status(200).json({ result: 'error', error_message: 'Project did not exist' });
      }
    }).catch((error) => {                             // 検索失敗
      console.log(error)
      res.status(200).json({ result: 'error', error_message: error });
    });
  },

  /**
   * プロジェクト詳細更新
   * @param {*} req
   * @param {*} res
   */
  update: (req, res) => {
    // TODO：アクセス認可チェック
    // プロジェクトID
    const projectId = req.params.projectId
    // 更新データ
    const updateData = {
      projectName: req.body.projectName,
      isPrivate: req.body.isPrivate,
      seacretCode: req.body.seacretCode
    }
    // プロジェクト情報更新
    db.Project.update(updateData, { where: { id: projectId } }
    ).then((result) => {
      if(result) {                          // 更新成功
        db.Project.findByPk(projectId).then(project => {  // メモ情報取得（更新後データ）
          res.status(200).json({ result: 'success', project: project });
        }).catch((error) => {                                 // メモ情報取得失敗
          res.status(200).json({ result: 'error', error_message: error });
        });
      } else {                              // 更新失敗
        res.status(200).json({ result: 'error', error_message: 'Project update failed' });
      }
    }).catch((error) => {                   // 更新失敗
      res.status(200).json({ result: 'error', error_message: error });
    });
  }
}

module.exports = projectsController;