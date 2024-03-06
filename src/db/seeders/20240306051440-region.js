'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "region",
      [
        { region_id: 1, region_name: 'Maryland' },
        { region_id: 2, region_name: 'Virginia' },
        { region_id: 3, region_name: 'New York' },
        { region_id: 4, region_name: 'District of Columbia' },
      ],
      {}
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("region", null, {});
  }
};
