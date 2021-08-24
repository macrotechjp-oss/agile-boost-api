'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('project_tags', {
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
      tagId: {
        allowNull: false,
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable('project_tags');
  }
};