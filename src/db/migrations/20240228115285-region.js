/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('region', {
      region_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true
      },

      region_name: {
        type: Sequelize.STRING,
        allowNull: false
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
    await queryInterface.dropTable('region')
  }
}
