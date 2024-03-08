"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const date_of_request = new Date("2024-11-20");
    await queryInterface.bulkInsert(
      "request",
      [
        {
          request_id: 1,
          confirmation_no: "Gu240307PaRo0001",
          request_state: "new",
          patient_id: "2",
          physician_id: "8",
          requestor_id: "1",
          requested_by: "family/friend",
          requested_date: date_of_request,
        },
        {
          request_id: 2,
          confirmation_no: "Ma240307RaRu0002",
          request_state: "active",
          patient_id: "3",
          physician_id: "8",
          requestor_id: "2",
          requested_by: "concierge",
          requested_date: date_of_request,
        },
        {
          request_id: 3,
          confirmation_no: "Gu240307VoAt0003",
          request_state: "pending",
          patient_id: "4",
          physician_id: "9",
          requested_by: "business",
          requestor_id: "3",
          requested_date: date_of_request,
        },
        {
          request_id: 4,
          confirmation_no: "Te240307TeSa0004",
          request_state: "conclude",
          patient_id: "5",
          physician_id: "9",
          requested_by: "vip",
          requestor_id: "4",
          requested_date: date_of_request,
        },
        {
          request_id: 5,
          confirmation_no: " Ma240307ShRo0005",
          request_state: "toclose",
          patient_id: "6",
          physician_id: "10",
          requestor_id: "5",
          requested_by: "patient",
          requested_date: date_of_request,
        },
        {
          request_id: 6,
          confirmation_no: "Ut240307GaBi0006",
          request_state: "unpaid",
          patient_id: "7",
          physician_id: "10",
          requestor_id: "6",
          requested_by: "patient",
          requested_date: date_of_request,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("request", null, {});
  },
};
