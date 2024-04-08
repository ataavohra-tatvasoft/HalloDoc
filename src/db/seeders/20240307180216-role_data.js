"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "role",
      [
        { role_id: 1, role_name: "dashboard", account_type: "admin" },
        { role_id: 2, role_name: "dashboard", account_type: "physician"},
        { role_id: 3, role_name: "my_profile", account_type: "admin" },
        { role_id: 4, role_name: "my_profile", account_type: "physician" },
        { role_id: 5, role_name: "send_order", account_type: "admin" },
        { role_id: 6, role_name: "send_order", account_type: "physician" },
        { role_id: 7, role_name: "my_schedule", account_type: "physician" },
        { role_id: 8, role_name: "dashboard", account_type: "patient" },

      ],
      {}
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("role", null, {});
  },
};
