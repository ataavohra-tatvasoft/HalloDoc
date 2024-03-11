'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "region",
      [
        { region_id: 1, region_name: 'Gujarat' },
        { region_id: 2, region_name: 'Uttar Pradesh' },
        { region_id: 3, region_name: 'Masharashtra' },
      ],
      {}
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("region", null, {});
  }
};
