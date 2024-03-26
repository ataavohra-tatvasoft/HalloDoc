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
      patient_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "user",
          key: "user_id",
          onDelete: "SET NULL",
          onUpdate: "CASCADE",
        },
      },
      physician_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "user",
          key: "user_id",
          onDelete: "SET NULL",
          onUpdate: "CASCADE",
        },
      },
      provider_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "user",
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
      concluded_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      date_of_service: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      closed_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      request_status: {
        type: Sequelize.ENUM(
          "new",
          "accepted",
          "closed",
          "conclude",
          "blocked",
          "clear",
          "cancelled by admin",
          "cancelled by provider"
        ),
        defaultValue: "new",
        allowNull: false,
      },
      block_reason: {
        type: Sequelize.STRING,
        allowNull: true,
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
      notes_symptoms: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      assign_req_description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      final_report: {
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
