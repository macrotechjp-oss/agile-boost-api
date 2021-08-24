var db = require('../../../models/index');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const { check, validationResult } = require('express-validator');
const { v4: uuidv4 } = require('uuid');


const projectsUsersController = {

  /**
   * プロジェクト > ユーザー一覧取得
   * @param {*} req
   * @param {*} res
   */
  index: (req, res) => {
    // TODO：アクセス認可チェック
    // プロジェクトID
    const projectId = req.params.projectId
    console.log("検索前")
    console.log(projectId)
    // プロジェクトユーザー検索
    db.UserProject.findAll({
      where: { projectId: [projectId] },
      include: [{ model: db.User }]
    }).then((userProjects) => {                   // 検索成功
      res.status(200).json({ result: 'success', userProjects: userProjects });
    }).catch((error) => {                         // 検索失敗
      console.log(error)
      res.status(200).json({ result: 'error', error_message: error });
    });
  },

  /**
   * プロジェクト > 外部リンク追加
   * @param {*} req
   * @param {*} res
   */
  create: (req, res) => {
    // TODO：アクセス認可チェック
    // プロジェクトID
    const projectId = req.params.projectId
    // 登録用データ
    const registData = {
      serviceName: req.body.serviceName,
      iconPath: req.body.iconPath,
      accessUrl: req.body.accessUrl
    }
    // プロジェクト検索
    db.Project.findOne({ where: { id: [projectId] } }).then(project => {
      if (!project) {                                 // プロジェクト未存在
        res.status(200).json({ result: 'error', error_message: "Project does not exist" });
      } else {                                        // プロジェクト存在
        // プロジェク外部リンク登録
        db.ProjectExternalLink.create({
          projectId: project.id,
          serviceName: registData.serviceName,
          iconPath: registData.iconPath,
          accessUrl: registData.accessUrl,
          createdAt: new Date(),
          updatedAt: new Date()
        }).then(projectExternalLink => {              // 登録成功
          res.status(200).json({ result: 'success', projectExternalLink: projectExternalLink });
        }).catch((error) => {                         // 登録失敗
          res.status(200).json({ result: 'error', error_message: error });
        });
      }
    }).catch((error) => {                             // プロジェクト検索失敗
      res.status(200).json({ result: 'error', error_message: error });
    });
  },

  /**
   * プロジェクト > 外部リンク詳細取得
   * @param {*} req
   * @param {*} res
   */
  show: (req, res) => {
    res.status(200).json({ result: 'WIP:プロジェクト > 外部リンク詳細取得' });
  },

  /**
   * プロジェクト > 外部リンク詳細更新
   * @param {*} req
   * @param {*} res
   */
  update: (req, res) => {
    res.status(200).json({ result: 'WIP:プロジェクト > 外部リンク詳細更新' });
  },

  /**
   * プロジェクト > 外部リンク削除
   * @param {*} req
   * @param {*} res
   */
  destroy: (req, res) => {
    res.status(200).json({ result: 'WIP:プロジェクト > 外部リンク削除' });
  },
}

module.exports = projectsUsersController;