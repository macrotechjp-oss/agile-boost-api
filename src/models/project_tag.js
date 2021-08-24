'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProjectTag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ProjectTag.belongsTo(models.Project, { foreignKey: 'projectId' });
      ProjectTag.belongsTo(models.Tag, { foreignKey: 'tagId' });
    }
  };
  ProjectTag.init({
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
    tagId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      field: 'tag_id',
      references: {
        model: {
          tableName: 'tags',
        },
        key: 'tag_id'
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
    modelName: 'ProjectTag',
    tableName:"project_tags"
  });
  return ProjectTag;
};