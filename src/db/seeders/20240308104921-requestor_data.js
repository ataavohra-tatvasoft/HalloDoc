/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
'use strict'

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const dob = new Date('2001-07-20')
    await queryInterface.bulkInsert(
      'requestor',
      [
        {
          user_id: 1,
          first_name: 'Gabriel',
          last_name: 'Martin',
          email: 'gabrielmartin@yopmail.com',
          mobile_number: 919201152758,
          house_name: 'House 1',
          city: 'Annapolis',
          createdAt: new Date(),
          updatedAt: new Date(),
          state: 'Maryland'
        },
        {
          user_id: 2,
          first_name: 'John',
          last_name: 'Lewis',
          email: 'johnlewis@yopmail.com',
          mobile_number: 918201152758,
          house_name: 'House 2',
          city: 'Fredericksburg',
          createdAt: new Date(),
          updatedAt: new Date(),
          state: 'Virginia'
        },
        {
          user_id: 3,
          first_name: 'Caleb',
          last_name: 'Thomas',
          email: 'calebthomas@yopmail.com',
          mobile_number: 917201152758,
          house_name: 'House 3',
          city: 'Annapolis',
          createdAt: new Date(),
          updatedAt: new Date(),
          state: 'Maryland'
        },
        {
          user_id: 4,
          first_name: 'Benjamin',
          last_name: 'Clark',
          email: 'benjaminclark@yopmail.com',
          mobile_number: 916201152758,
          house_name: 'House 4',
          city: 'Fredericksburg',
          createdAt: new Date(),
          updatedAt: new Date(),
          state: 'Virgnia'
        },
        {
          user_id: 5,
          first_name: 'Robert',
          last_name: 'Brown',
          email: 'robertbrown@yopmail.com',
          mobile_number: 915201152758,
          house_name: 'House 5',
          city: 'Annapolis',
          createdAt: new Date(),
          updatedAt: new Date(),
          state: 'Maryland'
        },
        {
          user_id: 6,
          first_name: 'Robin',
          last_name: 'Parker',
          email: 'robinparker@yopmail.com',
          mobile_number: 914201152758,
          house_name: 'House 6',
          city: 'Fredericksburg',
          createdAt: new Date(),
          updatedAt: new Date(),
          state: 'Virginia'
        }
      ],
      {}
    )
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('requestor', null, {})
  }
}
