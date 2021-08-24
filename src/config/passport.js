const db = require('../models/index');// Sequelize
const LocalStrategy = require('passport-local').Strategy
const validPassword = require('../utils/passwordUtils').validPassword

module.exports = (passport) => {
  /**
 * --------------- ストラテジーの設定 ---------------
 */
  passport.use('local', new LocalStrategy({
      usernameField: 'userEmail',
      passwordField: 'userPassword'
    }, function (userEmail, userPassword, done) {
      db.User.findOne({ where: { userEmail: userEmail } }).then(user => {
        if (user) {       // ユーザー存在時
          // パスワード検証
          if (validPassword(userPassword, user.userPassword, user.passwordSalt)) {
            return done(null, user)
          } else {
            return done(null, false, { message: 'Your password is incorrect' })
          }
        } else {          // ユーザー未存在時
          return done(null, false, { message: 'User does not exist' })
        }
      }).catch(error => {
        console.log(error)
        return done(error)
      })
    }
  ))

  /**
 * --------------- セッション管理に関する設定 ---------------
 */
  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    db.User.findOne({ where: { id: id }}).then(user => {
      done(null, user)
    }).catch(error => {
      done(error, null)
    })
  })
}