'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Info extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Info.hasMany(models.ProjectInfo, {foreignKey: 'id'});
    }
  };
  Info.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      field: 'info_id'
    },
    infoTitle: {
      allowNull: false,
      type: DataTypes.STRING,
      field: 'info_title'
    },
    infoDetail: {
      allowNull: false,
      type: DataTypes.STRING,
      field: 'info_detail'
    },
    infoPostTime: {
      allowNull: false,
      type: DataTypes.DATE,
      field: 'info_post_time'
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
    modelName: 'Info',
    tableName: 'infos'
  });
  return Info;
};