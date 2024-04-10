"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("logs", {
      log_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },

      type_of_log: {
        type: Sequelize.ENUM("SMS", "Email"),
        allowNull: false,
      },

      recipient: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      action: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      role_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      email: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      mobile_no: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },
      sent: {
        type: Sequelize.STRING,
        allowNull: true,
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
    await queryInterface.dropTable("logs");
  },
};
