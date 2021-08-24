'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProjectInfo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ProjectInfo.belongsTo(models.Project, { foreignKey: 'projectId' });
      ProjectInfo.belongsTo(models.Info, { foreignKey: 'infoId' });
    }
  };
  ProjectInfo.init({
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
    infoId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      field: 'info_id',
      references: {
        model: {
          tableName: 'infos',
        },
        key: 'info_id'
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
    modelName: 'ProjectInfo',
    tableName: 'project_infos'
  });
  return ProjectInfo;
};