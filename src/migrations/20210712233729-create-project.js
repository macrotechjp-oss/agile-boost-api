'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('projects', {
      id: {
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        type: Sequelize.STRING,
        field: 'project_id'
      },
      projectName: {
        allowNull: false,
        type: Sequelize.STRING,
        field: 'project_name'
      },
      projectIconPath: {
        allowNull: false,
        type: Sequelize.STRING,
        field: 'project_icon_path'
      },
      isPrivate: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        field: 'is_private'
      },
      seacretCode: {
        type: Sequelize.STRING,
        field: 'seacret_code'
      },
      seacretCodeExpair: {
        type: Sequelize.DATE,
        field: 'seacret_code_expair'
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
    await queryInterface.dropTable('projects');
  }
};