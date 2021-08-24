const passport = require('passport');
const { v4: uuidv4 } = require('uuid');
const Sequelize = require('sequelize');
const db = require('../../models/index');
const Op = Sequelize.Op;
const genPassword = require('../../utils/passwordUtils').genPassword;
const mailSend = require('../../utils/mailSendUtils').mailSend;
const formatDate = require('../../utils/dateUtils').formatDate;

const authController = {

  /**
   * 新規会員登録
   * @param {*} req リクエスト
   * @param {*} res レスポンス
   */
  signUp: async (req, res) => {
    // パスワード/ハッシュ 取得
    const saltHash = genPassword(req.body.userPassword);
    // ユーザー登録用データ
    const registData = {
      userPassword: saltHash.hash,
      passwordSalt: saltHash.salt,
      isActive: false,
      userEmail: req.body.userEmail,
      userIconPath: req.protocol+'://'+req.get('Host')+'/images/user-icon-random'+Math.floor( Math.random()*12)+'.png',
      activeTokenCode: uuidv4()
    }
    // ユーザー検索
    let findUser = null
    await db.User.findOne({ where: { userEmail: [registData.userEmail] } }).then(resultUser => {
      findUser = resultUser
    }).catch((error) => { res.status(200).json({ result: 'error', error_message: error }); });
    // ユーザーが存在する場合
    if (findUser) return res.status(200).json({ result: 'error', error_message: 'This email address already exists' });
    // ユーザーが存在しない場合 + ユーザー登録
    let createUser = null
    await db.User.create({
      userEmail: registData.userEmail,
      userPassword: registData.userPassword,
      passwordSalt: registData.passwordSalt,
      isActive: registData.isActive,
      activeTokenCode: registData.activeTokenCode,
      userName: registData.userEmail,
      userIconPath: registData.userIconPath,
      createdAt: new Date(),
      updatedAt: new Date()
    }).then(resultUser => { createUser = resultUser; }
      ).catch((error) => { res.status(200).json({ result: 'error', error_message: error }); });
    // ユーザー登録失敗
    if (!createUser) return res.status(200).json({ result: 'error', error_message: 'Create failed' });
    // 新規会員登録完了メール送信
    const mailSendResult = await mailSend({
      subject: '【Agile Boost】新規会員登録完了のお知らせ',
      to: createUser.userEmail
    }, 'sign-up', { activeTokenCode: registData.activeTokenCode })
    if(mailSendResult) {
      res.status(200).json({ result: 'success', user:createUser });
    } else {
      res.status(200).json({ result: 'error', error_message: 'Failed to send email' });
    }
  },

  /**
   * 会員ログイン
   * @param {*} req リクエスト
   * @param {*} res レスポンス
   */
  signIn: (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) {                  // エラー時処理
        res.status(200).json({ result: 'error', error_message: err });
      } else if (!user) {         // エラー時処理
        res.status(200).json({ result: 'error', error_message: info });
      } else {
        req.login(user, (error) => {
          if (error) {              // エラー時処理
            res.status(200).json({ result: 'error', error_message: error });
          } else {                // 成功時処理
            res.status(200).json({ result: 'success', user: user });
          }
        })
      }
    })(req, res, next)
  },

  /**
   * 会員ログアウト
   * @param {*} req リクエスト
   * @param {*} res レスポンス
   */
  signOut: (req, res) => {
    res.status(204).json();
  },

  /**
   * アカウント有効化（メール送信）
   * * 脆弱性対策としてユーザー未存在時も`success`とする
   * @param {*} req
   * @param {*} res
   */
  sendAccountActivation: async (req, res) => {
    // アカウント有効化の対象メールアドレス
    const userEmail = req.body.userEmail
    // ユーザー更新用データ
    const updateData = {
      activeTokenCode: uuidv4()
    }
    // ユーザー検索
    let user = null
    await db.User.findOne({ where: { userEmail: [userEmail] } }).then(resultUser => {
      user = resultUser
    }).catch((error) => {         // ユーザー情報取得失敗
      res.status(200).json({ result: 'error', error_message: error });
    });
    // ユーザーが存在しない場合
    if (!user) return res.status(200).json({ result: 'success' });
    // ユーザーが存在する場合 + ユーザー情報更新
    let userUpdate = null
    await db.User.update(
      { activeTokenCode: updateData.activeTokenCode },
      { where: { id: user.id } }
    ).then((result) => { userUpdate = result }
    ).catch((error) => { res.status(200).json({ result: 'error', error_message: error }); });
    // ユーザー情報更新の失敗
    if (!userUpdate) return res.status(200).json({ result: 'error', error_message: "Update failed" });
    // アカウント有効化メール送信
    const mailSendResult = await mailSend({
      subject: '【Agile Boost】アカウント有効化のお知らせ',
      to: user.userEmail
    }, 'account-activation', {
      activeTokenCode: updateData.activeTokenCode
    })
    if(mailSendResult) {
      res.status(200).json({ result: 'success' });
    } else {
      res.status(200).json({ result: 'error', error_message: 'Failed to send email' });
    }
  },

  /**
   * アカウント有効化（ユーザー情報更新）
   * * ユーザーTB更新 → パスワード再設定TB更新
   * @param {*} req
   * @param {*} res
   */
  beginAccountActivation: async (req, res) => {
    const activeTokenCode = req.body.activeTokenCode
    // ユーザー検索
    let user = null
    await db.User.findOne({ where: { activeTokenCode: [activeTokenCode] } }).then(resultUser => {
      user = resultUser
    }).catch((error) => {         // ユーザー情報取得失敗
      res.status(200).json({ result: 'error', error_message: error });
    });
    // ユーザーが存在しない場合
    if (!user) return res.status(200).json({ result: 'error', error_message: 'User does not exist' });
    // ユーザーが存在する場合 + ユーザー情報更新
    await db.User.update( { isActive: true }, { where: { id: user.id } }
    ).then((result) => {                                    // ユーザー情報更新成功
      if (result) { res.status(200).json({ result: 'success' }); }
      else { res.status(200).json({ result: 'error', error_message: 'Failed to update user information' }); }
    }).catch((error) => {                                   // ユーザー情報更新失敗
      res.status(200).json({ result: 'error', error_message: error });
    });
  },

  /**
   * パスワード再設定（メール送信）
   * * 脆弱性対策としてユーザー未存在時も`success`とする
   * @param {*} req リクエスト
   * @param {*} res レスポンス
   */
  sendPasswordReset: async (req, res) => {
    // パスワード再設定の対象メールアドレス
    const userEmail = req.body.userEmail
    // パスワード再設定トークン期限（1時間）
    const resetPasswordTokenExpair = new Date()
    resetPasswordTokenExpair.setHours(resetPasswordTokenExpair.getHours() + 1);
    // ユーザーパスワード登録用データ
    const registData = {
      resetPasswordToken: uuidv4(),
      resetPasswordTokenExpair: resetPasswordTokenExpair
    }
    // ユーザー検索
    let user = null
    await db.User.findOne({ where: { userEmail: [userEmail] } }).then(resultUser => {
      user = resultUser
    }).catch((error) => {         // ユーザー情報取得失敗
      res.status(200).json({ result: 'error', error_message: error });
    });
    // ユーザーが存在しない場合
    if (!user) return res.status(200).json({ result: 'success' });
    // ユーザーが存在する場合 + ユーザーパスワード登録
    let userPassword = null
    await db.UserPassword.create({
      userId: user.id,
      resetPasswordToken: registData.resetPasswordToken,
      resetPasswordTokenExpair: registData.resetPasswordTokenExpair,
      isUsed: false,
      usedAt: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }).then(resultUserPassword  => {
      userPassword = resultUserPassword
    }).catch((error) => {         // ユーザー情報取得失敗
      res.status(200).json({ result: 'error', error_message: error });
    });
    // パスワード再設定メール送信
    const mailSendResult = await mailSend({
      subject: '【Agile Boost】パスワード再設定のお知らせ',
      to: user.userEmail
    }, 'password-reset', {
      resetPasswordToken: userPassword.resetPasswordToken,
      resetPasswordTokenExpair: formatDate(userPassword.resetPasswordTokenExpair, 'yyyy/MM/dd HH:mm:ss')
    })
    if(mailSendResult) {
      res.status(200).json({ result: 'success' });
    } else {
      res.status(200).json({ result: 'error', error_message: 'Failed to send email' });
    }
  },

  /**
   * パスワード再設定（ユーザー情報更新）
   * * ユーザーTB更新 → パスワード再設定TB更新
   * @param {*} req リクエスト
   * @param {*} res レスポンス
   */
  beginPasswordReset: (req, res) => {
    // パスワード再設定トークン
    const resetPasswordToken = req.body.resetPasswordToken
    // パスワード再設定トークン検索
    db.UserPassword.findOne({
      where: {
      [Op.and]: {
        resetPasswordToken: resetPasswordToken,
        resetPasswordTokenExpair: {
          [Op.gte]: new Date()
          },
        isUsed: false
      }
    }}).then(userPassword => {
      if (userPassword) {         // パスワード再設定トークン存在時
        // パスワード/ハッシュ 取得
        const saltHash = genPassword(req.body.userPassword);
        console.log(saltHash)
        // ユーザー情報更新処理
        db.User.update(
          { userPassword: saltHash.hash, passwordSalt: saltHash.salt },
          { where: { id: userPassword.userId } }
        ).then(() => {            // 更新処理成功時
          // パスワード再設定レコード更新処理
          db.UserPassword.update(
            { isUsed: true, usedAt: new Date(), },
            { where: { id: userPassword.id } }
          ).then(() => {          // 更新処理成功時
            res.status(200).json({ result: 'success' });
          }).catch((error) => {   // 更新処理失敗時
            res.status(200).json({ result: 'error', error_message: error });
          });
        }).catch((error) => {     // 更新処理失敗時
          res.status(200).json({ result: 'error', error_message: error });
        });
      } else {                    // パスワード再設定トークン未存在時
        res.status(200).json({ result: 'error', error_message: "No Valid Reset Password Token Exists" });
      }
    }).catch((error) => {         // ユーザー情報取得失敗
      res.status(200).json({ result: 'error', error_message: error });
    });
  },
}

module.exports = authController;