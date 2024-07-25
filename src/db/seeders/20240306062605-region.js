/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'region',
      [
        {
          region_id: 1,
          region_name: 'District Of Columbia',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          region_id: 2,
          region_name: 'Virginia',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          region_id: 3,
          region_name: 'New York',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          region_id: 4,
          region_name: 'Maryland',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('region', null, {})
  }
}
