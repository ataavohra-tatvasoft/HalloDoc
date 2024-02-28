'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('admin', {
      adminid: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      status: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      firstname: { type: Sequelize.STRING, allowNull: false },
      lastname: { type: Sequelize.STRING, allowNull: false },
      role: { type: Sequelize.STRING, allowNull: false },
      mobile_no: { type:  Sequelize.BIGINT, allowNull: false, unique: true },
      address_1: { type: Sequelize.STRING, allowNull: false },
      address_2: { type: Sequelize.STRING, allowNull: true },
      city: { type: Sequelize.STRING, allowNull: false },
      state: { type: Sequelize.STRING, allowNull: false },
      country_code: { type: Sequelize.STRING, allowNull: false },
      zip: { type:  Sequelize.INTEGER, allowNull: false },
      billing_mobile_no: {
        type:  Sequelize.INTEGER,
        allowNull: false,
        unique: true,
      },
      // reset_token: { type: DataTypes.UUIDV4, allowNull:true},
      reset_token: { type: Sequelize.STRING, allowNull:true},
      reset_token_expiry:{type: Sequelize.BIGINT, allowNull:true},
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
