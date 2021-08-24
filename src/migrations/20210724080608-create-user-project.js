'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_projects', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        field: 'user_id',
        references: {
          model: {
            tableName: 'users',
          },
          key: 'user_id'
        }
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
      deletedAt: {
        type: Sequelize.DATE,
        field: 'deleted_at'
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
        UserProjectIndex: {
          fields: ['user_id', 'project_id']
        }
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_projects');
  }
};