'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('infos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        field: 'info_id'
      },
      infoTitle: {
        allowNull: false,
        type: Sequelize.STRING,
        field: 'info_title'
      },
      infoDetail: {
        allowNull: false,
        type: Sequelize.STRING,
        field: 'info_detail'
      },
      infoPostTime: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'info_post_time'
      },
      authorUserId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        field: 'author_user_id',
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
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('infos');
  }
};