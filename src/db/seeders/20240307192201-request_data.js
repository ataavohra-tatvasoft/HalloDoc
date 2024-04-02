"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const date_of_request = new Date("2024-11-20");
    const date_of_service = new Date("2024-12-30");

    await queryInterface.bulkInsert(
      "request",
      [
        {
          request_id: 1,
          confirmation_no: "Gu240307PaRo0001",
          request_state: "new",
          patient_id: "2",
          requestor_id: "1",
          requested_by: "family/friend",
          requested_date: date_of_request,
        },
        {
          request_id: 2,
          confirmation_no: "Ma240307RaRu0002",
          request_state: "new",
          patient_id: "3",
          requestor_id: "2",
          requested_by: "concierge",
          requested_date: date_of_request,
        },
        {
          request_id: 3,
          confirmation_no: "Gu240307VoAt0003",
          request_state: "new",
          patient_id: "4",
          requested_by: "business",
          requestor_id: "3",
          requested_date: date_of_request,
        },
        {
          request_id: 4,
          confirmation_no: "Te240307TeSa0004",
          request_state: "new",
          patient_id: "5",
          requested_by: "vip",
          requestor_id: "4",
          requested_date: date_of_request,
        },
        // {
        //   request_id: 5,
        //   confirmation_no: " Ma240307ShRo0005",
        //   request_state: "new",
        //   patient_id: "6",
        //   requestor_id: "5",
        //   requested_by: "patient",
        //   requested_date: date_of_request,
        // },
        {
          request_id: 6,
          confirmation_no: "Ut240307GaBi0006",
          request_state: "new",
          patient_id: "7",
          requestor_id: "6",
          requested_by: "patient",
          requested_date: date_of_request,
        },
        {
          request_id: 7,
          confirmation_no: "Gu240307PaRo0007",
          request_state: "active",
          patient_id: "2",
          physician_id: "8",
          requestor_id: "1",
          requested_by: "family/friend",
          requested_date: date_of_request,
          date_of_service: date_of_service,
          is_assigned: "yes"
        },
        {
          request_id: 8,
          confirmation_no: "Gu240307PaRo0008",
          request_state: "pending",
          patient_id: "2",
          physician_id: "8",
          requestor_id: "1",
          requested_by: "family/friend",
          requested_date: date_of_request,
          date_of_service: date_of_service,
          is_assigned: "yes"

        },
        {
          request_id: 9,
          confirmation_no: "Gu240307PaRo0009",
          request_state: "conclude",
          patient_id: "2",
          physician_id: "8",
          requestor_id: "1",
          requested_by: "family/friend",
          requested_date: date_of_request,
          date_of_service: date_of_service,
          is_assigned: "yes"

        },
        {
          request_id: 10,
          confirmation_no: "Gu240307PaRo0010",
          request_state: "toclose",
          patient_id: "2",
          physician_id: "8",
          requestor_id: "1",
          requested_by: "family/friend",
          requested_date: date_of_request,
          date_of_service: date_of_service,
          is_assigned: "yes"

        },
        {
          request_id: 11,
          confirmation_no: "Gu240307PaRo0011",
          request_state: "unpaid",
          patient_id: "2",
          physician_id: "8",
          requestor_id: "1",
          requested_by: "family/friend",
          requested_date: date_of_request,
          date_of_service: date_of_service,
        },
        {
          request_id: 12,
          confirmation_no: "Ma240307RaRu0012",
          request_state: "active",
          patient_id: "3",
          physician_id: "8",
          requestor_id: "2",
          requested_by: "concierge",
          requested_date: date_of_request,
          date_of_service: date_of_service,
          is_assigned: "yes"

        },
        {
          request_id: 13,
          confirmation_no: "Ma240307RaRu0013",
          request_state: "pending",
          patient_id: "3",
          physician_id: "8",
          requestor_id: "2",
          requested_by: "concierge",
          requested_date: date_of_request,
          date_of_service: date_of_service,
          is_assigned: "yes"

        },
        {
          request_id: 14,
          confirmation_no: "Ma240307RaRu0014",
          request_state: "conclude",
          patient_id: "3",
          physician_id: "8",
          requestor_id: "2",
          requested_by: "concierge",
          requested_date: date_of_request,
          date_of_service: date_of_service,
        },
        {
          request_id: 15,
          confirmation_no: "Ma240307RaRu0015",
          request_state: "toclose",
          patient_id: "3",
          physician_id: "8",
          requestor_id: "2",
          requested_by: "concierge",
          requested_date: date_of_request,
          date_of_service: date_of_service,
          is_assigned: "yes"

        },
        {
          request_id: 16,
          confirmation_no: "Ma240307RaRu0016",
          request_state: "unpaid",
          patient_id: "3",
          physician_id: "8",
          requestor_id: "2",
          requested_by: "concierge",
          requested_date: date_of_request,
          date_of_service: date_of_service,
        },
        {
          request_id: 17,
          confirmation_no: "Gu240307VoAt0017",
          request_state: "active",
          patient_id: "4",
          physician_id: "9",
          requested_by: "business",
          requestor_id: "3",
          requested_date: date_of_request,
          date_of_service: date_of_service,
          is_assigned: "yes"

        },
        {
          request_id: 18,
          confirmation_no: "Gu240307VoAt0018",
          request_state: "pending",
          patient_id: "4",
          physician_id: "9",
          requested_by: "business",
          requestor_id: "3",
          requested_date: date_of_request,
          date_of_service: date_of_service,
          is_assigned: "yes"

        },
        {
          request_id: 19,
          confirmation_no: "Gu240307VoAt0019",
          request_state: "conclude",
          patient_id: "4",
          physician_id: "9",
          requested_by: "business",
          requestor_id: "3",
          requested_date: date_of_request,
          date_of_service: date_of_service,
        },
        {
          request_id: 20,
          confirmation_no: "Gu240307VoAt0020",
          request_state: "toclose",
          patient_id: "4",
          physician_id: "9",
          requested_by: "business",
          requestor_id: "3",
          requested_date: date_of_request,
          date_of_service: date_of_service,
          is_assigned: "yes"

        },
        {
          request_id: 21,
          confirmation_no: "Gu240307VoAt0021",
          request_state: "unpaid",
          patient_id: "4",
          physician_id: "9",
          requested_by: "business",
          requestor_id: "3",
          requested_date: date_of_request,
          date_of_service: date_of_service,
        },
        {
          request_id: 22,
          confirmation_no: "Te240307TeSa0022",
          request_state: "active",
          patient_id: "5",
          physician_id: "9",
          requested_by: "vip",
          requestor_id: "4",
          requested_date: date_of_request,
          date_of_service: date_of_service,
          is_assigned: "yes"

        },
        {
          request_id: 23,
          confirmation_no: "Te240307TeSa0023",
          request_state: "pending",
          patient_id: "5",
          physician_id: "9",
          requested_by: "vip",
          requestor_id: "4",
          requested_date: date_of_request,
          date_of_service: date_of_service,
          is_assigned: "yes"

        },
        {
          request_id: 24,
          confirmation_no: "Te240307TeSa0024",
          request_state: "conclude",
          patient_id: "5",
          physician_id: "9",
          requested_by: "vip",
          requestor_id: "4",
          requested_date: date_of_request,
          date_of_service: date_of_service,
        },
        {
          request_id: 25,
          confirmation_no: "Te240307TeSa0025",
          request_state: "toclose",
          patient_id: "5",
          physician_id: "9",
          requested_by: "vip",
          requestor_id: "4",
          requested_date: date_of_request,
          date_of_service: date_of_service,
          is_assigned: "yes"

        },
        {
          request_id: 26,
          confirmation_no: "Te240307TeSa0026",
          request_state: "unpaid",
          patient_id: "5",
          physician_id: "9",
          requested_by: "vip",
          requestor_id: "4",
          requested_date: date_of_request,
          date_of_service: date_of_service,
        },
        {
          request_id: 27,
          confirmation_no: " Ma240307ShRo0027",
          request_state: "active",
          patient_id: "6",
          physician_id: "10",
          requestor_id: "5",
          requested_by: "patient",
          requested_date: date_of_request,
          date_of_service: date_of_service,
          is_assigned: "yes"

        },
        {
          request_id: 28,
          confirmation_no: " Ma240307ShRo0028",
          request_state: "pending",
          patient_id: "6",
          physician_id: "10",
          requestor_id: "5",
          requested_by: "patient",
          requested_date: date_of_request,
          date_of_service: date_of_service,
          is_assigned: "yes"

        },
        {
          request_id: 29,
          confirmation_no: " Ma240307ShRo0029",
          request_state: "conclude",
          patient_id: "6",
          physician_id: "10",
          requestor_id: "5",
          requested_by: "patient",
          requested_date: date_of_request,
          date_of_service: date_of_service,
        },
        {
          request_id: 30,
          confirmation_no: " Ma240307ShRo0030",
          request_state: "toclose",
          patient_id: "6",
          physician_id: "10",
          requestor_id: "5",
          requested_by: "patient",
          requested_date: date_of_request,
          date_of_service: date_of_service,
          is_assigned: "yes"

        },
        {
          request_id: 31,
          confirmation_no: " Ma240307ShRo0031",
          request_state: "unpaid",
          patient_id: "6",
          physician_id: "10",
          requestor_id: "5",
          requested_by: "patient",
          requested_date: date_of_request,
          date_of_service: date_of_service,
        },
        {
          request_id: 32,
          confirmation_no: "Ut240307GaBi0032",
          request_state: "active",
          patient_id: "7",
          physician_id: "10",
          requestor_id: "6",
          requested_by: "patient",
          requested_date: date_of_request,
          date_of_service: date_of_service,
          is_assigned: "yes"

        },
        {
          request_id: 33,
          confirmation_no: "Ut240307GaBi0033",
          request_state: "pending",
          patient_id: "7",
          physician_id: "10",
          requestor_id: "6",
          requested_by: "patient",
          requested_date: date_of_request,
          date_of_service: date_of_service,
          is_assigned: "yes"

        },
        {
          request_id: 34,
          confirmation_no: "Ut240307GaBi0034",
          request_state: "conclude",
          patient_id: "7",
          physician_id: "10",
          requestor_id: "6",
          requested_by: "patient",
          requested_date: date_of_request,
          date_of_service: date_of_service,
        },
        {
          request_id: 35,
          confirmation_no: "Ut240307GaBi0035",
          request_state: "toclose",
          patient_id: "7",
          physician_id: "10",
          requestor_id: "6",
          requested_by: "patient",
          requested_date: date_of_request,
          date_of_service: date_of_service,
          is_assigned: "yes"

        },
        {
          request_id: 36,
          confirmation_no: "Ut240307GaBi0036",
          request_state: "unpaid",
          patient_id: "7",
          physician_id: "10",
          requestor_id: "6",
          requested_by: "patient",
          requested_date: date_of_request,
          date_of_service: date_of_service,
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("request", null, {});
  },
};
