'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('memos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        field: 'memo_id'
      },
      memoTitle: {
        allowNull: false,
        type: Sequelize.STRING,
        field: 'memo_title'
      },
      memoDetail: {
        allowNull: false,
        type: Sequelize.STRING,
        field: 'memo_detail'
      },
      memoIcon: {
        allowNull: false,
        type: Sequelize.STRING,
        field: 'memo_icon'
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
    await queryInterface.dropTable('memos');
  }
};