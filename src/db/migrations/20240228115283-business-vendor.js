/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('business-vendor', {
      business_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },

      business_name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },

      business_website: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      profession: {
        type: Sequelize.STRING,
        allowNull: true
      },
      fax_number: {
        type: Sequelize.BIGINT,
        allowNull: true
      },
      mobile_no: {
        type: Sequelize.BIGINT,
        allowNull: true
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      business_contact: {
        type: Sequelize.BIGINT,
        allowNull: true
      },
      street: {
        type: Sequelize.STRING,
        allowNull: true
      },
      city: {
        type: Sequelize.STRING,
        allowNull: true
      },
      state: {
        type: Sequelize.STRING,
        allowNull: true
      },
      zip: {
        type: Sequelize.INTEGER,
        allowNull: true
      },

      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        onUpdate: 'CASCADE'
      }
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('business-vendor')
  }
}
