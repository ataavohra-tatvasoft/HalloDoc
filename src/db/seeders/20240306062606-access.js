"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "access",
      [
        { access_id: 1, access_name: "regions", account_type: "all" },
        { access_id: 2, access_name: "scheduling", account_type: "all" },
        { access_id: 3, access_name: "history", account_type: "all" },
        { access_id: 4, access_name: "accounts", account_type: "all" },
        { access_id: 5, access_name: "my_profile", account_type: "all" },
        { access_id: 6, access_name: "dashboard", account_type: "all" },
        { access_id: 8, access_name: "role", account_type: "all" },
        { access_id: 9, access_name: "provider", account_type: "all" },
        { access_id: 10, access_name: "request_data", account_type: "all" },
        { access_id: 11, access_name: "send_order", account_type: "all" },
        { access_id: 12, access_name: "vendors_info", account_type: "all" },
        { access_id: 13, access_name: "profession", account_type: "all" },
        { access_id: 14, access_name: "email_logs", account_type: "all" },
        {
          access_id: 15,
          access_name: "halo_administrators",
          account_type: "all",
        },
        { access_id: 16, access_name: "halo_users", account_type: "all" },
        {
          access_id: 17,
          access_name: "cancelled_history",
          account_type: "all",
        },
        {
          access_id: 18,
          access_name: "provider_location",
          account_type: "all",
        },
        { access_id: 19, access_name: "halo_employee", account_type: "all" },
        { access_id: 20, access_name: "halo_workplace", account_type: "all" },
        { access_id: 21, access_name: "chat", account_type: "all" },
        { access_id: 22, access_name: "patient_records", account_type: "all" },
        { access_id: 23, access_name: "blocked_history", account_type: "all" },
        { access_id: 24, access_name: "invoicing", account_type: "all" },
        { access_id: 25, access_name: "sms_logs", account_type: "all" },
        { access_id: 26, access_name: "my_schedule", account_type: "all" },

        { access_id: 31, access_name: "regions", account_type: "admin" },
        { access_id: 32, access_name: "scheduling", account_type: "admin" },
        { access_id: 33, access_name: "history", account_type: "admin" },
        { access_id: 34, access_name: "accounts", account_type: "admin" },
        { access_id: 35, access_name: "my_profile", account_type: "admin" },
        { access_id: 36, access_name: "dashboard", account_type: "admin" },
        { access_id: 37, access_name: "role", account_type: "admin" },
        { access_id: 38, access_name: "provider", account_type: "admin" },
        { access_id: 39, access_name: "request_data", account_type: "admin" },
        { access_id: 40, access_name: "send_order", account_type: "admin" },
        { access_id: 41, access_name: "vendors_info", account_type: "admin" },
        { access_id: 42, access_name: "profession", account_type: "admin" },
        { access_id: 43, access_name: "email_logs", account_type: "admin" },
        {
          access_id: 44,
          access_name: "halo_administrators",
          account_type: "admin",
        },
        { access_id: 45, access_name: "halo_users", account_type: "admin" },
        {
          access_id: 46,
          access_name: "cancelled_history",
          account_type: "admin",
        },
        {
          access_id: 47,
          access_name: "provider_location",
          account_type: "admin",
        },
        { access_id: 48, access_name: "halo_employee", account_type: "admin" },
        { access_id: 49, access_name: "halo_workplace", account_type: "admin" },
        { access_id: 50, access_name: "chat", account_type: "admin" },
        {
          access_id: 51,
          access_name: "patient_records",
          account_type: "admin",
        },
        {
          access_id: 52,
          access_name: "blocked_history",
          account_type: "admin",
        },
        { access_id: 53, access_name: "invoicing", account_type: "admin" },
        { access_id: 54, access_name: "sms_logs", account_type: "admin" },

        { access_id: 55, access_name: "dashboard", account_type: "physician" },
        {
          access_id: 56,
          access_name: "my_schedule",
          account_type: "physician",
        },
        { access_id: 57, access_name: "my_profile", account_type: "physician" },
        { access_id: 58, access_name: "send_order", account_type: "physician" },
        { access_id: 59, access_name: "chat", account_type: "physician" },
        { access_id: 60, access_name: "invoicing", account_type: "physician" },

        { access_id: 61, access_name: "dashboard", account_type: "patient" },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("access", null, {});
  },
};
