'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Memo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Memo.hasMany(models.ProjectMemo, {foreignKey: 'id'});
    }
  };
  Memo.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      field: 'memo_id'
    },
    memoTitle: {
      allowNull: false,
      type: DataTypes.STRING,
      field: 'memo_title'
    },
    memoDetail: {
      allowNull: false,
      type: DataTypes.STRING,
      field: 'memo_detail'
    },
    memoIcon: {
      allowNull: false,
      type: DataTypes.STRING,
      field: 'memo_icon'
    },
    authorUserId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      field: 'author_user_id',
      references: {
        model: {
          tableName: 'users',
        },
        key: 'user_id'
      }
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      field: 'created_at'
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      field: 'updated_at'
    }
  }, {
    sequelize,
    modelName: 'Memo',
    tableName: 'memos'
  });
  return Memo;
};