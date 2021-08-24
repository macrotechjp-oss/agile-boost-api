'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserProject extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserProject.belongsTo(models.User, { foreignKey: 'userId' });
      UserProject.belongsTo(models.Project, {foreignKey: 'projectId'});
      UserProject.hasMany(models.UserProjectStore, { foreignKey: 'id' });
    }
  };
  UserProject.init({
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
    projectId: {
      allowNull: false,
      type: DataTypes.STRING,
      field: 'project_id',
      references: {
        model: {
          tableName: 'projects',
        },
        key: 'project_id'
      }
    },
    deletedAt: {
      type: DataTypes.DATE,
      field: 'deleted_at'
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
    modelName: 'UserProject',
    tableName: 'user_projects',
    paranoid: true
  });
  return UserProject;
};