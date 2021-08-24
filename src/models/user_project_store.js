'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserProjectStore extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserProjectStore.belongsTo(models.UserProject, { foreignKey: 'userProjectId' });
      UserProjectStore.belongsTo(models.Store, { foreignKey: 'storeId' });
    }
  };
  UserProjectStore.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    userProjectId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      field: 'user_project_id',
      references: {
        model: {
          tableName: 'user_projects',
        },
        key: 'id'
      }
    },
    storeId: {
      allowNull: false,
      type: DataTypes.INTEGER,
      field: 'store_id',
      references: {
        model: {
          tableName: 'stores',
        },
        key: 'store_id'
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
    modelName: 'UserProjectStore',
    tableName: 'user_project_stores'
  });
  return UserProjectStore;
};