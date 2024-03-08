"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      "notes",
      [
        {
          requestId: 1,
          noteId: 1,
          reason: "reason 1",
          description: "Description 1",
          typeOfNote: "admin_notes"
        },
        {
          requestId: 2,
          noteId: 2,
          reason: "reason 2",
          description: "Description 2",
          typeOfNote: "admin_notes"
        },
        {
          requestId: 3,
          noteId: 3,
          physician_name: "Physician 3",
          reason: "reason 3",
          description: "Description 3",
          typeOfNote: "physician_notes"
        },
        {
          requestId: 1,
          noteId: 4,
          physician_name: "Physician 4",
          reason: "reason 4",
          description: "Description 4",
          typeOfNote: "physician_notes"
        },
        {
          requestId: 2,
          noteId: 5,
          reason: "reason 5",
          description: "Description 5",
          typeOfNote: "patient_notes"
        },
        {
          requestId: 3,
          noteId: 6,
          reason: "reason 6",
          description: "Description 6",
          typeOfNote: "patient_notes"
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("notes", null, {});
  },
};
