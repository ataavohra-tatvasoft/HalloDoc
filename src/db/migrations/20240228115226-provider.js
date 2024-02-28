'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('provider', {
      provider_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      firstname: { type: Sequelize.STRING, allowNull: false },
      lastname: { type: Sequelize.STRING, allowNull: false },
      role: { type: Sequelize.ENUM("physician"), allowNull: false },
      mobile_no: { type: Sequelize.BIGINT, allowNull: false, unique: true },
      medical_licence: { type: Sequelize.STRING, allowNull: false },
      NPI_no: { type: Sequelize.INTEGER, allowNull: false },
      address_1: { type: Sequelize.STRING, allowNull: false },
      address_2: { type: Sequelize.STRING, allowNull: true },
      region: { type: Sequelize.STRING, allowNull: true },
      city: { type: Sequelize.STRING, allowNull: false },
      state: { type: Sequelize.STRING, allowNull: false },
      country_code: { type: Sequelize.STRING, allowNull: false },
      zip: { type: Sequelize.INTEGER, allowNull: false },
      alternative_mobile_no: {
        type: Sequelize.BIGINT,
        allowNull: true,
        unique: true,
      },
      // reset_token: { type: DataTypes.UUIDV4, allowNull:true},
      business_name: { type: Sequelize.STRING, allowNull: false },
      business_website: { type: Sequelize.STRING, allowNull: false },
      on_call_status: { type: Sequelize.STRING, allowNull: false },
      reset_token: { type: Sequelize.STRING, allowNull: true },
      reset_token_expiry: { type: Sequelize.BIGINT, allowNull: true },
      scheduled_status: { type: Sequelize.ENUM("yes", "no"), defaultValue: "no" },
      support_message: { type: Sequelize.STRING, allowNull: true },
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
