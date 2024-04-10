"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("documents", {
      request_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
      },
      document_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      document_name: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      },
      document_path: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        onUpdate: "CASCADE",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('documents');

  },
};
