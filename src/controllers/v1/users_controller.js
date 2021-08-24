const db = require('../../models/index');

const usersController = {
  /**
   * 【更新】ユーザー情報
   * @param {*} req
   * @param {*} res
   */
  update: (req, res) => {
    // 更新用データ
    const updateData = {
      userName: req.body.userName,
      userIconPath: req.body.userIconPath
    }
    // ユーザー情報更新
    db.User.update(
      { userName: updateData.userName, userIconPath: updateData.userIconPath },
      { where: { id: req.user.id } }
    ).then((result) => {                                    // ユーザー情報更新成功
      if (result) {                                         // ユーザー情報更新成功
        db.User.findByPk(req.user.id).then(user => {        // ユーザー情報取得（更新後データ）
          res.status(200).json({ result: 'success', user: user });
        }).catch((error) => {                               // ユーザー情報取得失敗
          res.status(200).json({ result: 'error', error_message: error });
        });
      } else {                                              // ユーザー情報更新失敗
        res.status(200).json({ result: 'error', error_message: "Update failed" });
      }
    }).catch((error) => {                                   // ユーザー情報更新失敗
      res.status(200).json({ result: 'error', error_message: error });
    });
  },

  /**
   * 【削除】ユーザー情報
   * * メールアドレスをログイン不可な状態に更新
   * @param {*} req
   * @param {*} res
   */
  destroy: (req, res) => {
    // 更新データ
    const updateData = {
      userEmail: "@delete@"+ req.user.userEmail
    }
    // ユーザー情報更新
    db.User.update(
      { userEmail: updateData.userEmail },
      { where: { id: req.user.id } }
    ).then((result) => {                                    // ユーザー情報更新成功
      if (result) {                                         // ユーザー情報更新成功
        res.status(200).json({ result: 'success' });
      } else {                                              // ユーザー情報更新失敗
        res.status(200).json({ result: 'error', error_message: "Update failed" });
      }
    }).catch((error) => {                                   // ユーザー情報更新失敗
      res.status(200).json({ result: 'error', error_message: error });
    });
  }

}


module.exports = usersController;