'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('project_storages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
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
      storageId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        field: 'storage_id',
        references: {
          model: {
            tableName: 'storages',
          },
          key: 'storage_id'
        }
      },
      userId: {
        type: Sequelize.INTEGER,
        field: 'user_id',
        references: {
          model: {
            tableName: 'users',
          },
          key: 'user_id'
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
    }, {
      // 一意制約
      uniqueKeys: {
        ProjectUserIndex: {
          fields: ['project_id', 'user_id']
        }
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('project_storages');
  }
};