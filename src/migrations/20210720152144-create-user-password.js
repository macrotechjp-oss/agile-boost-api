'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('user_passwords', {
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
      resetPasswordToken: {
        allowNull: false,
        type: Sequelize.STRING,
        field: 'reset_password_token'
      },
      resetPasswordTokenExpair: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'reset_password_token_expair'
      },
      isUsed: {
        allowNull: false,
        type: Sequelize.STRING,
        field: 'is_used'
      },
      usedAt: {
        type: Sequelize.DATE,
        field: 'used_at'
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
    await queryInterface.dropTable('user_passwords');
  }
};