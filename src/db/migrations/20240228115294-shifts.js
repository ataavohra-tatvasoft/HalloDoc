"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("shifts", {
      shift_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "user",
          key: "user_id",
          onDelete: "SET NULL",
          onUpdate: "CASCADE",
        },
      },
      region: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      physician: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("approved", "pending"),
        allowNull: false,
        defaultValue: "pending",
      },
      shift_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      start: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      end: {
        type: Sequelize.TIME,
        allowNull: true,
      },
      repeat_end: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      repeat_days: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        default: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        onUpdate: "CASCADE",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('shifts');

  },
};
