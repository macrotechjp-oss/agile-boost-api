'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProjectExternalLink extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ProjectExternalLink.belongsTo(models.Project, { foreignKey: 'projectId' });
    }
  };
  ProjectExternalLink.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
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
    serviceName: {
      allowNull: false,
      type: DataTypes.STRING,
      field: 'service_name'
    },
    iconPath: {
      allowNull: false,
      type: DataTypes.STRING,
      field: 'icon_path'
    },
    accessUrl: {
      allowNull: false,
      type: DataTypes.STRING,
      field: 'access_url'
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
    modelName: 'ProjectExternalLink',
    tableName: 'project_external_links'
  });
  return ProjectExternalLink;
};