"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "role-access-mapping",
      [
        { role_id: 1, access_id: 36 },
        { role_id: 2, access_id: 55 },
        { role_id: 3, access_id: 35 },
        { role_id: 4, access_id: 57 },
        { role_id: 5, access_id: 40 },
        { role_id: 6, access_id: 58 },
        { role_id: 7, access_id: 56 },
        { role_id: 8, access_id: 61 },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("role-access-mapping", null, {});
  },
};
