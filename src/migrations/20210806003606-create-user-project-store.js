'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_project_stores', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userProjectId: {
        allowNull: false,
        type: Sequelize.INTEGER,
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
        type: Sequelize.INTEGER,
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
        UserProjectStoreIndex: {
          fields: ['user_project_id', 'store_id']
        }
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_project_stores');
  }
};