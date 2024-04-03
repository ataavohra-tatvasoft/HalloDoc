"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "access",
      [
        /**All */
        { access_id: 1, access_name: "regions" },
        { access_id: 2, access_name: "scheduling" },
        { access_id: 3, access_name: "history" },
        { access_id: 4, access_name: "accounts" },
        { access_id: 5, access_name: "my_profile" },
        { access_id: 6, access_name: "dashboard" },
        { access_id: 7, access_name: "my_schedule" },
        { access_id: 8, access_name: "role" },
        { access_id: 9, access_name: "provider" },
        { access_id: 10, access_name: "request_data" },
        { access_id: 11, access_name: "send_order" },
        { access_id: 12, access_name: "vendors_info" },
        { access_id: 13, access_name: "profession" },
        { access_id: 14, access_name: "email_logs" },
        { access_id: 15, access_name: "halo_administrators" },
        { access_id: 16, access_name: "halo_users" },
        { access_id: 17, access_name: "cancelled_history" },
        { access_id: 18, access_name: "provider_location" },
        { access_id: 19, access_name: "halo_employee" },
        { access_id: 20, access_name: "halo_workplace" },
        { access_id: 21, access_name: "chat" },
        { access_id: 22, access_name: "patient_records" },
        { access_id: 23, access_name: "blocked_history" },
        { access_id: 24, access_name: "invoicing" },
        { access_id: 25, access_name: "sms_logs" },

        /**Admin */
        { access_id: 26, access_name: "vendorship" },

        /**Physician */
        /** Included in all */

        /**Patient */
        /**Empty */
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("access", null, {});
  },
};
