'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Project extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Project.hasMany(models.UserProject, { foreignKey: 'id' });
      Project.hasMany(models.ProjectExternalLink, { foreignKey: 'id' });
      Project.hasMany(models.ProjectTag, {foreignKey: 'id'});
    }
  };
  Project.init({
    id: {
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
      type: DataTypes.STRING,
      field: 'project_id'
    },
    projectName: {
      allowNull: false,
      type: DataTypes.STRING,
      field: 'project_name'
    },
    projectIconPath: {
      allowNull: false,
      type: DataTypes.STRING,
      field: 'project_icon_path'
    },
    isPrivate: {
      allowNull: false,
      type: DataTypes.BOOLEAN,
      field: 'is_private'
    },
    seacretCode: {
      type: DataTypes.STRING,
      field: 'seacret_code'
    },
    seacretCodeExpair: {
      type: DataTypes.DATE,
      field: 'seacret_code_expair'
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
    modelName: 'Project',
    tableName: 'projects'
  });
  return Project;
};