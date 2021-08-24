const crypto = require('crypto');

/**
 * 暗号化パスワード/ソルト 取得
 * @param {*} password 平文パスワード
 * @returns
 */
function genPassword(password) {
  var salt = crypto.randomBytes(32).toString('hex');
  var genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

  return {
    salt: salt,
    hash: genHash
  }
}

/**
 * 暗号化パスワード/ソルト 検証
 * @param {*} password
 * @param {*} hash
 * @param {*} salt
 * @returns 検証結果：True or False
 */
function validPassword(password, hash, salt) {
  var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return hash == hashVerify;
}

module.exports.genPassword = genPassword;
module.exports.validPassword = validPassword;
