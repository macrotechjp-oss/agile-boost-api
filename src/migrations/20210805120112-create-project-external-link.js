'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('project_external_links', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      projectId: {
        allowNull: false,
        type: Sequelize.STRING,
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
        type: Sequelize.STRING,
        field: 'service_name'
      },
      iconPath: {
        allowNull: false,
        type: Sequelize.STRING,
        field: 'icon_path'
      },
      accessUrl: {
        allowNull: false,
        type: Sequelize.STRING,
        field: 'access_url'
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
    await queryInterface.dropTable('project_external_links');
  }
};