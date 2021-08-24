const db = require('../../../models/index');

const projectsTagsController = {
  /**
   * 【取得】プロジェクト > タグ一覧
   * @param {*} req
   * @param {*} res
   */
  index: (req, res) => {
    // TODO：アクセス認可チェック
    const projectId = req.params.projectId
    // プロジェクトタグ検索
    db.ProjectTag.findAll({
      where: { projectId: [projectId] },
      include: [{ model: db.Tag }]
    }).then((projectTags) => { res.status(200).json({ result: 'success', projectTags: projectTags }); }
      ).catch((error) => { res.status(200).json({ result: 'error', error_message: error }); });
  }
}

module.exports = projectsTagsController;