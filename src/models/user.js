'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.UserProject, { foreignKey: 'id' });
      User.hasMany(models.ProjectStorage, {foreignKey: 'id'});
    }
  };
  User.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      field: 'user_id'
    },
    userEmail: {
      allowNull: false,
      type: DataTypes.STRING,
      field: 'user_email'
    },
    userPassword: {
      allowNull: false,
      type: DataTypes.STRING,
      field: 'user_password'
    },
    passwordSalt: {
      allowNull: false,
      type: DataTypes.STRING,
      field: 'password_salt'
    },
    isActive: {
      allowNull: false,

      type: DataTypes.BOOLEAN,
      field: 'is_active'
    },
    activeTokenCode: {
      type: DataTypes.STRING,
      field: 'active_token_code'
    },
    activeTokenExpair: {
      type: DataTypes.DATE,
      field: 'active_token_expair'
    },
    userName: {
      allowNull: false,
      type: DataTypes.STRING,
      field: 'user_name'
    },
    userIconPath: {
      allowNull: false,
      type: DataTypes.STRING,
      field: 'user_icon_path'
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
    modelName: 'User',
    tableName: 'users'
  });
  return User;
};