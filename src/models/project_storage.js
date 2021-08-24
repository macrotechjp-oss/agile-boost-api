'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProjectStorage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ProjectStorage.belongsTo(models.Project, { foreignKey: 'projectId' });
      ProjectStorage.belongsTo(models.Storage, { foreignKey: 'storageId' });
      ProjectStorage.belongsTo(models.User, { foreignKey: 'userId' });
    }
  };
  ProjectStorage.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
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
    storageId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      field: 'storage_id',
      references: {
        model: {
          tableName: 'storages',
        },
        key: 'storage_id'
      }
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
    modelName: 'ProjectStorage',
    tableName: 'project_storages'
  });
  return ProjectStorage;
};