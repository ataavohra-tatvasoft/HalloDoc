'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "role-access-mapping",
      [
        { role_id: 2, access_id: 21 },
        { role_id: 2, access_id: 22 },
        { role_id: 2, access_id: 23 },
        { role_id: 2, access_id: 24 },
      ],
      {}
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("role-access-mapping", null, {});

  }
};
