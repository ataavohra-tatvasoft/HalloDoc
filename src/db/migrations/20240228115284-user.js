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
        type: Sequelize.ENUM("admin", "patient", "provider"),
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
  
      // Admin-specific fields
      billing_mobile_no: {
        type: Sequelize.INTEGER,
        allowNull: true,
        unique: true,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      role: {
        type: Sequelize.STRING,
        allowNull: true // Removed redundant "admin" role field
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
      //Common attributes between Patient and Provider
      business_name: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      street: {
        type: Sequelize.STRING,
        allowNull: true,
      },
  
      // Additional attributes
      tax_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      profile_picture: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      // business_name: { type: DataTypes.STRING, allowNull: false },
      business_website: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      on_call_status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      scheduled_status: {
        type: Sequelize.STRING,
        allowNull: true,
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
