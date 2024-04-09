"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("user", {
      user_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      type_of_user: {
        type: Sequelize.ENUM("admin", "patient", "physician"),
        allowNull: false,
      },

      // Common fields
      firstname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      mobile_no: {
        type: Sequelize.BIGINT,
        allowNull: true,
        unique: true,
      },
      reset_token: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      reset_token_expiry: {
        type: Sequelize.BIGINT,
        allowNull: true,
      },
      address_1: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      address_2: {
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
      country_code: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      zip: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      role_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: null,
        references: {
          model: "role",
          key: "role_id",
          onDelete: "SET NULL",
          onUpdate: "CASCADE",
        },
      },
      status: {
        type: Sequelize.ENUM("active", "pending", "in-active"),
        allowNull: false,
        defaultValue: "pending",
      },

      // Admin-specific fields
      billing_mobile_no: {
        type: Sequelize.BIGINT,
        allowNull: true,
        unique: true,
      },

      // Patient-specific fields
      dob: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      // Provider-specific fields
      medical_licence: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      NPI_no: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      alternative_mobile_no: {
        type: Sequelize.BIGINT,
        allowNull: true,
        unique: true,
      },

      stop_notification_status: {
        type: Sequelize.ENUM("yes", "no"),
        allowNull: true,
        defaultValue: "no",
      },

      synchronization_email: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true,
      },

      admin_notes: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      //Common attributes between Patient and Provider (optional)
      street: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      //Common attributes between Admin and Provider
      open_requests: {
        type: Sequelize.INTEGER,
        allowNull: true,
        defaultValue: 0,
      },

      // Common attributes between Patient and Provider
      business_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      // Additional attributes
      tax_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      business_website: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      profile_picture: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      signature_photo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      on_call_status: {
        type: Sequelize.ENUM("yes", "no"),
        allowNull: true,
        defaultValue: null,
      },
      support_message: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        default: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: true,
        onUpdate: "CASCADE",
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("user");
  },
};
