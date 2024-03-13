"use strict";

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("request", {
      request_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      confirmation_no: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      request_state: {
        type: Sequelize.ENUM(
          "new",
          "active",
          "pending",
          "conclude",
          "toclose",
          "unpaid"
        ),
        allowNull: false,
      },
      provider_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "User",
          key: "user_id",
          onDelete: "SET NULL",
          onUpdate: "CASCADE",
        },
      },
      physician_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "User",
          key: "user_id",
          onDelete: "SET NULL",
          onUpdate: "CASCADE",
        },
      },
      patient_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "User",
          key: "user_id",
          onDelete: "SET NULL",
          onUpdate: "CASCADE",
        },
      },
      requested_by: {
        type: Sequelize.ENUM(
          "family/friend",
          "concierge",
          "business",
          "vip",
          "admin",
          "patient",
          "provider"
        ),
        allowNull: false,
      },
      requestor_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      requested_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      notes_symptoms: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      date_of_service: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      block_status: {
        type: Sequelize.ENUM("yes", "no"),
        defaultValue: "no",
        allowNull: false,
      },
      block_status_reason: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      cancellation_status: {
        type: Sequelize.ENUM("yes", "no"),
        defaultValue: "no",
        allowNull: false,
      },
      close_case_status: {
        type: Sequelize.ENUM("yes", "no"),
        defaultValue: "no",
        allowNull: false,
      },
      transfer_request_status: {
        type: Sequelize.ENUM("pending", "accepted", "rejected"),
        defaultValue: null,
        allowNull: true,
      },
      agreement_status: {
        type: Sequelize.ENUM("pending", "accepted", "rejected"),
        defaultValue: null,
        allowNull: true,
      },
      assign_req_description: {
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
};
