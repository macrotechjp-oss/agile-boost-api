'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('project_infos', {
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
      infoId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        field: 'info_id',
        references: {
          model: {
            tableName: 'infos',
          },
          key: 'info_id'
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
        ProjectInfoIndex: {
          fields: ['project_id', 'info_id']
        }
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('project_infos');
  }
};