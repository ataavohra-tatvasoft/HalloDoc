/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('encounter-form', {
      form_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },

      request_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'request',
          key: 'request_id',
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE'
        }
      },

      first_name: {
        type: Sequelize.STRING,
        allowNull: true
      },

      last_name: {
        type: Sequelize.STRING,
        allowNull: true
      },

      location: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },

      date_of_birth: {
        type: Sequelize.DATE,
        allowNull: true,
        unique: true
      },

      date_of_service: {
        type: Sequelize.DATE,
        allowNull: true,
        unique: true
      },

      phone_no: {
        type: Sequelize.BIGINT,
        allowNull: true,
        unique: true
      },

      email: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },

      history_of_present: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },

      medical_history: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },

      medications: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },

      allergies: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },

      temperature: {
        type: Sequelize.INTEGER,
        allowNull: true,
        unique: true
      },

      heart_rate: {
        type: Sequelize.INTEGER,
        allowNull: true,
        unique: true
      },

      respiratory_rate: {
        type: Sequelize.INTEGER,
        allowNull: true,
        unique: true
      },

      blood_pressure_1: {
        type: Sequelize.INTEGER,
        allowNull: true,
        unique: true
      },

      blood_pressure_2: {
        type: Sequelize.INTEGER,
        allowNull: true,
        unique: true
      },

      o2: {
        type: Sequelize.INTEGER,
        allowNull: true,
        unique: true
      },

      pain: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },

      heent: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },

      cv: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },

      chest: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },

      abd: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },

      extr: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },

      skin: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },

      neuro: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },
      other: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },

      diagnosis: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },

      treatment_plan: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },

      medication_dispensed: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },

      procedures: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },

      follow_up: {
        type: Sequelize.STRING,
        allowNull: true,
        unique: true
      },

      is_finalize: {
        type: Sequelize.ENUM('true', 'false'),
        allowNull: false,
        defaultValue: 'false'
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
    await queryInterface.dropTable('encounter-form')
  }
}
