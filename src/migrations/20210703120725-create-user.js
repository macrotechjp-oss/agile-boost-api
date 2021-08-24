'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
        field: 'user_id'
      },
      userEmail: {
        allowNull: false,
        type: Sequelize.STRING,
        field: 'user_email'
      },
      userPassword: {
        allowNull: false,
        type: Sequelize.STRING,
        field: 'user_password'
      },
      passwordSalt: {
        allowNull: false,
        type: Sequelize.STRING,
        field: 'password_salt'
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        field: 'is_active'
      },
      activeTokenCode: {
        allowNull: false,
        type: Sequelize.STRING,
        field: 'active_token_code'
      },
      activeTokenExpair: {
        type: Sequelize.DATE,
        field: 'active_token_expair'
      },
      userName: {
        allowNull: false,
        type: Sequelize.STRING,
        field: 'user_name'
      },
      userIconPath: {
        allowNull: false,
        type: Sequelize.STRING,
        field: 'user_icon_path'
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
    await queryInterface.dropTable('users');
  }
};