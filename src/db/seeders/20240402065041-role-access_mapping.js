/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'role-access-mapping',
      [
        {
          role_id: 1,
          access_id: 36,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          role_id: 2,
          access_id: 55,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          role_id: 3,
          access_id: 35,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          role_id: 4,
          access_id: 57,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          role_id: 5,
          access_id: 40,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          role_id: 6,
          access_id: 58,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          role_id: 7,
          access_id: 56,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          role_id: 8,
          access_id: 61,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('role-access-mapping', null, {})
  }
}
