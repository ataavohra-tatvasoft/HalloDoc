"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("notes", {
      request_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Request",
          key: "request_id",
          onDelete: "SET NULL",
          onUpdate: "CASCADE",
        },
      },
      note_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      physician_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      reason: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      type_of_note: {
        type: Sequelize.ENUM(
          "transfer_notes",
          "admin_notes",
          "physician_notes",
          "patient_notes",
          "admin_cancellation_notes",
          "physician_cancellation_notes",
          "patient_cancellation_notes"
        ),
        allowNull: false,
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
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
