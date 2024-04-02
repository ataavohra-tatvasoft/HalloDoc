"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "role",
      [
        { role_id: 1, role_name: "dashboard", account_type: "all" },
        { role_id: 2, role_name: "my_profile", account_type: "all" },
        { role_id: 3, role_name: "send_order", account_type: "all" },
        { role_id: 4, role_name: "my_schedule", account_type: "all" },
      ],
      {}
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("role", null, {});
  },
};
