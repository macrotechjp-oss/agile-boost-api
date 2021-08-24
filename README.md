# Agile Boost API

# Tools
- Docker

# Start Up
```
$ docker exec agileboostapi_app_1 npm install
$ docker-compose up -d
```

# Usage
>API/MySQL 起動
```
$ docker-compose up -d
```
>API/MySQL ダウン
```
$ docker-compose down
```
# Pluginの不具合修正
## minio
src\node_modules\minio\dist\main\xml-parsers.js
バケット内のファイルが1つの時にlistObjectsで不具合発生。
```js
// 修正前
xmlobj.Contents.forEach(function (content) {
// 修正後
toArray(xmlobj.Contents).forEach(function (content) {
```

# Access Point
| ポート(+α) | 名前 | 概要 |
| -- | -- | -- |
| 3306 | MySQL | RDBMS |
| 4200 | API | APIアクセス情報 |
| 4200/test | Jest | 単体テストの集計結果 |
| 4200/api/docs | Swagger | API設計に利用 |
| 8088 | wwwsqldesigner | DB設計に利用 |
| 8888 | phpmyadmin | DBクライアント用 |
| 9000 | minio | オブジェクトストレージサーバー |

# ディレクトリ構成
```
├── minio                   .. minio[docker]のマウントボリューム
├── mysql                   .. mysql[docker]のマウントボリューム
│   ├── conf
│   │   └── my.conf         .. mysql[docker]の上書き設定ファイル
│   └── data                .. mysql[docker]のマウントボリューム
├── src                     .. expressのソース郡
│   ├── __tests__           ..
│   ├── bin                 ..
│   ├── config              ..
│   ├── controllers         ..
│   ├── coverage            ..
│   ├── lib                 ..
│   ├── dist                ..
│   ├── migrations          ..
│   ├── models              ..
│   ├── node_modules        ..
│   ├── public              ..
│   ├── routes              ..
│   ├── seeders             .. 初期データ
│   ├── uploads             .. ファイルアップロード用のディレクトリ
│   ├── utils               .. 
│   ├── app.js              .. 
│   ├── package-lock.json   .. 
│   ├── package.json        ..
│   ├── postman.json        .. 
│   ├── sqldesign.xml       .. 
│   └── swagger.json        ..
├── .gitignore              .. コミット対象外ファイルを設定
├── docker-compose.yml      .. dockerコンテナ設定ファイル
└── README.md               ..
```
# Another Info
### sequelize
```
### pwd：ルートディレクトリ
## sequelize
# DB作成
$ docker exec agileboostapi_app_1 sequelize db:create
# DB削除
$ docker exec agileboostapi_app_1 sequelize db:drop
# migrate実行
$ docker exec agileboostapi_app_1 sequelize db:migrate
# 実行済みmigrateを全て取り消し
$ docker exec agileboostapi_app_1 sequelize db:migrate:undo:all
# 設定されていたseedファイルをmigrate
$ docker exec agileboostapi_app_1 sequelize db:seed:all
# seedファイルのmigrateを全て取り消し
$ docker exec agileboostapi_app_1 seqeulize db:seed:undo:all
# テーブル定義作成
$ docker exec agileboostapi_app_1 sequelize model:generate --name [table] --attributes [column]:[型],[column]:[型]
ex) sequelize model:generate --name User --attributes firstName:string,lastName:string,email:string
```

# リファレンス
- express
  - 公式：https://expressjs.com/
- passport
  - 公式：http://www.passportjs.org/
- sequelize
  - 使い方：https://blog.capilano-fw.com/?p=5582
- Nodemailer
  - 公式：https://nodemailer.com/about/
- Swagger
  - 使い方：https://techblog.zozo.com/entry/swagger_yaml
- アイコン作成
  - Iconpon：https://www.iconpon.com/