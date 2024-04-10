"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("order", {
      order_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      request_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "request",
          key: "request_id",
          onDelete: "SET NULL",
          onUpdate: "CASCADE",
        },
      },
      business_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "business-vendor",
          key: "business_id",
          onDelete: "SET NULL",
          onUpdate: "CASCADE",
        },
      },
      request_state: {
        type: Sequelize.ENUM("active", "conclude", "toclose"),
        allowNull: false,
      },
      order_details: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      number_of_refill: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
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
    await queryInterface.dropTable('order');

  },
};
