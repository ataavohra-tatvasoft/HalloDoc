"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "access",
      [
        { access_id: 1, access_name: "regions", account_type: "admin" },
        { access_id: 2, access_name: "scheduling", account_type: "admin" },
        { access_id: 3, access_name: "history", account_type: "admin" },
        { access_id: 4, access_name: "accounts", account_type: "admin" },
        { access_id: 5, access_name: "my_profile", account_type: "admin" },
        { access_id: 6, access_name: "dashboard", account_type: "admin" },
        { access_id: 8, access_name: "role", account_type: "admin" },
        { access_id: 9, access_name: "provider", account_type: "admin" },
        { access_id: 10, access_name: "request_data", account_type: "admin" },
        { access_id: 11, access_name: "send_order", account_type: "admin" },
        { access_id: 12, access_name: "vendors_info", account_type: "admin" },
        { access_id: 13, access_name: "profession", account_type: "admin" },
        { access_id: 14, access_name: "email_logs", account_type: "admin" },
        { access_id: 15, access_name: "halo_administrators", account_type: "admin" },
        { access_id: 16, access_name: "halo_users", account_type: "admin" },
        { access_id: 17, access_name: "cancelled_history", account_type: "admin" },
        { access_id: 18, access_name: "provider_location", account_type: "admin" },
        { access_id: 19, access_name: "halo_employee", account_type: "admin" },
        { access_id: 20, access_name: "halo_workplace", account_type: "admin" },
        { access_id: 21, access_name: "chat", account_type: "admin" },
        { access_id: 22, access_name: "patient_records" , account_type: "admin"},
        { access_id: 23, access_name: "blocked_history", account_type: "admin" },
        { access_id: 24, access_name: "invoicing" , account_type: "admin"},
        { access_id: 25, access_name: "sms_logs", account_type: "admin" },

        { access_id: 7, access_name: "dashboard" , account_type: "physician"},
        { access_id: 26, access_name: "my_schedule", account_type: "physician" },
        { access_id: 27, access_name: "my_profile", account_type: "physician" },
        { access_id: 28, access_name: "send_order", account_type: "physician" },
        { access_id: 29, access_name: "chat", account_type: "physician" },
        { access_id: 30, access_name: "invoicing", account_type: "physician" },
        
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("access", null, {});
  },
};
