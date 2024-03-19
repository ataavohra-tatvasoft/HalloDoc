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
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      type_of_user: {
        type: Sequelize.ENUM("admin", "patient", "provider", "vendor"),
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
        allowNull: false,
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
      role: {
        type: Sequelize.ENUM(
          "admin",
          "patient",
          "physician",
          "clinical",
          "vendor"
        ),
        allowNull: true,
        defaultValue: null,
      },

      // Admin-specific fields
      billing_mobile_no: {
        type: Sequelize.BIGINT,
        allowNull: true,
        unique: true,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: true,
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

      // Vendors-specific fields
      profession: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      // business_contact: {
      //   type: Sequelize.BIGINT,
      //   allowNull: true,
      //   unique: true,
      // },

      fax_number: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      //Common attributes between Patient and Provider
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

      // Common attributes between Patient and Provider and Vendor
      business_id:{
        type: DataType.NUMBER,
        allowNull: true,
        defaultValue: null,
        references: {
          model: "Business",
          key: "business_id",
          onDelete: "SET NULL",
          onUpdate: "CASCADE",
        },
      },
      // business_name: {
      //   type: Sequelize.STRING,
      //   allowNull: true,
      // },

      //Regions of service
      district_of_columbia: {
        type: Sequelize.ENUM("yes", "no"),
        allowNull: false,
        defaultValue: "no",
      },
      new_york: {
        type: Sequelize.ENUM("yes", "no"),
        allowNull: false,
        defaultValue: "no",
      },
      virginia: {
        type: Sequelize.ENUM("yes", "no"),
        allowNull: false,
        defaultValue: "no",
      },
      maryland: {
        type: Sequelize.ENUM("yes", "no"),
        allowNull: false,
        defaultValue: "no",
      },

      // Additional attributes
      tax_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      // business_website: {
      //   type: Sequelize.STRING,
      //   allowNull: true,
      // },
      profile_picture: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      signature_photo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      on_call_status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      scheduled_status: {
        type: Sequelize.ENUM("yes", "no"),
        allowNull: false,
        defaultValue: "no",
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
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
