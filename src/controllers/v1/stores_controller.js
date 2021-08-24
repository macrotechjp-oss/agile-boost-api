var db = require('../../models/index');

const storesController = {
  /**
   * ストア一覧取得
   * @param {*} req
   * @param {*} res
   */
  index: (req, res) => {
    db.Store.findAll({}).then(stores => {        // 取得成功時
      res.status(200).json({ result: 'success', stores: stores });
    }).catch((error) => {                        // 取得失敗時
      res.status(200).json({ result: 'error', error_message: error });
    });
  }
}

module.exports = storesController;