"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("access", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
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

      /**Admin */
      regions: {
        type: Sequelize.ENUM("yes", "no"),
        allowNull: true,
        defaultValue: null,
      },

      scheduling: {
        type: Sequelize.ENUM("yes", "no"),
        allowNull: true,
        defaultValue: null,
      },

      history: {
        type: Sequelize.ENUM("yes", "no"),
        allowNull: true,
        defaultValue: null,
      },

      accounts: {
        type: Sequelize.ENUM("yes", "no"),
        allowNull: true,
        defaultValue: null,
      },

      role: {
        type: Sequelize.ENUM("yes", "no"),
        allowNull: true,
        defaultValue: null,
      },

      provider: {
        type: Sequelize.ENUM("yes", "no"),
        allowNull: true,
        defaultValue: null,
      },

      request_data: {
        type: Sequelize.ENUM("yes", "no"),
        allowNull: true,
        defaultValue: null,
      },

      vendorship: {
        type: Sequelize.ENUM("yes", "no"),
        allowNull: true,
        defaultValue: null,
      },

      profession: {
        type: Sequelize.ENUM("yes", "no"),
        allowNull: true,
        defaultValue: null,
      },

      email_logs: {
        type: Sequelize.ENUM("yes", "no"),
        allowNull: true,
        defaultValue: null,
      },

      halo_administrators: {
        type: Sequelize.ENUM("yes", "no"),
        allowNull: true,
        defaultValue: null,
      },

      halo_users: {
        type: Sequelize.ENUM("yes", "no"),
        allowNull: true,
        defaultValue: null,
      },

      cancelled_history: {
        type: Sequelize.ENUM("yes", "no"),
        allowNull: true,
        defaultValue: null,
      },

      provider_location: {
        type: Sequelize.ENUM("yes", "no"),
        allowNull: true,
        defaultValue: null,
      },

      halo_employee: {
        type: Sequelize.ENUM("yes", "no"),
        allowNull: true,
        defaultValue: null,
      },

      halo_work_place: {
        type: Sequelize.ENUM("yes", "no"),
        allowNull: true,
        defaultValue: null,
      },

      patient_records: {
        type: Sequelize.ENUM("yes", "no"),
        allowNull: true,
        defaultValue: null,
      },

      blocked_history: {
        type: Sequelize.ENUM("yes", "no"),
        allowNull: true,
        defaultValue: null,
      },

      sms_logs: {
        type: Sequelize.ENUM("yes", "no"),
        allowNull: true,
        defaultValue: null,
      },

      /**Physician */
      my_schedule: {
        type: Sequelize.ENUM("yes", "no"),
        allowNull: true,
        defaultValue: null,
      },

      /**Common Admin and Physician */
      dashboard: {
        type: Sequelize.ENUM("yes", "no"),
        allowNull: true,
        defaultValue: null,
      },

      my_profile: {
        type: Sequelize.ENUM("yes", "no"),
        allowNull: true,
        defaultValue: null,
      },

      send_order: {
        type: Sequelize.ENUM("yes", "no"),
        allowNull: true,
        defaultValue: null,
      },

      chat: {
        type: Sequelize.ENUM("yes", "no"),
        allowNull: true,
        defaultValue: null,
      },
      invoicing: {
        type: Sequelize.ENUM("yes", "no"),
        allowNull: true,
        defaultValue: null,
      },

      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
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
