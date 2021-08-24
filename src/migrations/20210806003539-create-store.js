'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('stores', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        field: 'store_id'
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
        field: 'name'
      },
      description: {
        allowNull: false,
        type: Sequelize.STRING,
        field: 'description'
      },
      iconPath: {
        allowNull: false,
        type: Sequelize.STRING,
        field: 'icon_path'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'created_at'
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'updated_at'
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('stores');
  }
};