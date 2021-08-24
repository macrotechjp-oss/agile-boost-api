'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Store extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Store.hasMany(models.UserProjectStore, { foreignKey: 'id' });
    }
  };
  Store.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
      field: 'store_id'
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
      field: 'name'
    },
    description: {
      allowNull: false,
      type: DataTypes.STRING,
      field: 'description'
    },
    iconPath: {
      allowNull: false,
      type: DataTypes.STRING,
      field: 'icon_path'
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
    modelName: 'Store',
    tableName: 'stores'
  });
  return Store;
};