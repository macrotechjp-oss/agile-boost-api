'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProjectMemo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ProjectMemo.belongsTo(models.Project, { foreignKey: 'projectId' });
      ProjectMemo.belongsTo(models.Memo, { foreignKey: 'memoId' });
    }
  };
  ProjectMemo.init({
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
    memoId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      field: 'memo_id',
      references: {
        model: {
          tableName: 'memos',
        },
        key: 'memo_id'
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
    modelName: 'ProjectMemo',
    tableName: 'project_memos'
  });
  return ProjectMemo;
};