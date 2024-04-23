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
      request_status: {
        type: Sequelize.ENUM(
          "unassigned",
          "assigned",
          "accepted",
          "md_on_route",
          "md_on_site",
          "closed",
          "conclude",
          "blocked",
          "clear",
          "cancelled by admin",
          "cancelled by provider"
        ),
        defaultValue: "unassigned",

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
      relation_with_patient: {
        type: Sequelize.STRING,
        allowNull: true,
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

      street: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      city: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      state: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      zip: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      block_reason: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      agreement_status: {
        type: Sequelize.ENUM("pending", "accepted", "rejected"),
        defaultValue: "pending",
        allowNull: false,
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
        type: Sequelize.INTEGER,
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
    await queryInterface.dropTable("request");
  },
};
