/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'user-region-mapping',
      [
        {
          user_id: 2,
          region_id: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 2,
          region_id: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 2,
          region_id: 3,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 2,
          region_id: 4,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 3,
          region_id: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 3,
          region_id: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 3,
          region_id: 3,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 3,
          region_id: 4,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 4,
          region_id: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 4,
          region_id: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 4,
          region_id: 3,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 4,
          region_id: 4,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 5,
          region_id: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 5,
          region_id: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 5,
          region_id: 3,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 5,
          region_id: 4,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 6,
          region_id: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 6,
          region_id: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 6,
          region_id: 3,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 6,
          region_id: 4,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 7,
          region_id: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 7,
          region_id: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 7,
          region_id: 3,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 7,
          region_id: 4,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 8,
          region_id: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 8,
          region_id: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 8,
          region_id: 3,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 8,
          region_id: 4,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 9,
          region_id: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 9,
          region_id: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 9,
          region_id: 3,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 9,
          region_id: 4,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 10,
          region_id: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 10,
          region_id: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 10,
          region_id: 3,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 10,
          region_id: 4,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 21,
          region_id: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 21,
          region_id: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 21,
          region_id: 3,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 21,
          region_id: 4,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 22,
          region_id: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 22,
          region_id: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 22,
          region_id: 3,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 22,
          region_id: 4,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 23,
          region_id: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 23,
          region_id: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 23,
          region_id: 3,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 23,
          region_id: 4,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 24,
          region_id: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 24,
          region_id: 2,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 24,
          region_id: 3,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          user_id: 24,
          region_id: 4,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user-region-mapping', null, {})
  }
}
