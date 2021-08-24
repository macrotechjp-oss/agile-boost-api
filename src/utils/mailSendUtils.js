const fs = require('fs');
const mjml = require('mjml');
const mustache = require('mustache');
const nodemailer = require('nodemailer');
const path = require('path');
const express = require('express');
const app = express();
const config = require('../config/config.json')[app.get('env')];

/**
 * --------------- CONST ---------------
 */
const transporter = nodemailer.createTransport({
  service: config.appConf.mail.service_name,
  auth: {
    user: config.appConf.mail.user.email,
    pass: config.appConf.mail.user.password
  }
});
const tmpTypeList = {
  'sign-up': fs.readFileSync(path.join(__dirname, '../mails/sign-up.mjml'), 'utf8'),
  'account-activation': fs.readFileSync(path.join(__dirname, '../mails/account-activation.mjml'), 'utf8'),
  'password-reset': fs.readFileSync(path.join(__dirname, '../mails/password-reset.mjml'), 'utf8'),
  'request-defect': fs.readFileSync(path.join(__dirname, '../mails/request-defect.mjml'), 'utf8')
}

/**
 * --------------- FUNCTION ---------------
 */
/**
 * メール送信実行
 * @param {Map}     options メールオプション
 * @param {String}  tmpType メールテンプレートタイプ
 * @param {Map}     tmpData メールテンプレートデータ
 * @returns true:送信成功、false:送信失敗
 */
function mailSend(options, tmpType, tmpData) {

  // 共通メールテンプレートデータセット
  tmpData['clientHost'] = config.appConf.clientHost

  // メール本文
  const html =  mjml(mustache.render(tmpTypeList[tmpType], tmpData)).html;

  // メールオプション
  const mailOptions = {
    from: 'Agile Boost <noreply@gmail.com>',
    subject: options['subject'],
    to: options['to'],
    html : html
  };

  return new Promise(resolve => {
    // メール送信
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {        // メール送信失敗時
        resolve(false);
      } else {          // メール送信成功時
        resolve(true);
      }
    })
  });
}

module.exports.mailSend = mailSend;
