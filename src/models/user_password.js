'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserPassword extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserPassword.belongsTo(models.User, {
        foreignKey: 'userId'
      });
    }
  };
  UserPassword.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    userId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      field: 'user_id',
      references: {
        model: {
          tableName: 'users',
        },
        key: 'user_id'
      }
    },
    resetPasswordToken: {
      allowNull: false,
      type: DataTypes.STRING,
      field: 'reset_password_token'
    },
    resetPasswordTokenExpair: {
      allowNull: false,
      type: DataTypes.DATE,
      field: 'reset_password_token_expair'
    },
    isUsed: {
      allowNull: false,
      type: DataTypes.STRING,
      field: 'is_used'
    },
    usedAt: {
      type: DataTypes.DATE,
      field: 'used_at'
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
    modelName: 'UserPassword',
    tableName:"user_passwords"
  });
  return UserPassword;
};