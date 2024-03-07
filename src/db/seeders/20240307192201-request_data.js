"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "request",
      [
        {
          confirmation_no: "Gu240307PaRo0001",
          request_state: "new",
          patient_id: "2",
          physician_id: "8",
          requested_by: "family/friend",
        },
        {
          confirmation_no: "Ma240307RaRu0002",
          request_state: "active",
          patient_id: "3",
          physician_id: "8",
          requested_by: "concierge",
        },
        {
          confirmation_no: "Gu240307VoAt0003",
          request_state: "pending",
          patient_id: "4",
          physician_id: "9",

          requested_by: "business",
        },
        {
          confirmation_no: "Te240307TeSa0004",
          request_state: "conclude",
          patient_id: "5",
          physician_id: "9",
          requested_by: "vip",
        },
        {
          confirmation_no: " Ma240307ShRo0005",
          request_state: "toclose",
          patient_id: "6",
          physician_id: "10",
          requested_by: "patient",
        },
        {
          confirmation_no: "Ut240307GaBi0006",
          request_state: "unpaid",
          patient_id: "7",
          physician_id: "10",
          requested_by: "patient",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("request", null, {});
  },
};
