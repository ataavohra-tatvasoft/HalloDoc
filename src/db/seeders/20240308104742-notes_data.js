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
          reason: "reason 3",
          description: "Description 3",
          typeOfNote: "admin_notes"
        },
        {
          requestId: 4,
          noteId: 4,
          reason: "reason 4",
          description: "Description 4",
          typeOfNote: "admin_notes"
        },
        {
          requestId: 5,
          noteId: 5,
          reason: "reason 5",
          description: "Description 5",
          typeOfNote: "admin_notes"
        },
        {
          requestId: 6,
          noteId: 6,
          reason: "reason 6",
          description: "Description 6",
          typeOfNote: "admin_notes"
        },
        {
          requestId: 7,
          noteId: 7,
          reason: "reason 7",
          description: "Description 7",
          typeOfNote: "admin_notes"
        },
        {
          requestId: 8,
          noteId: 8,
          reason: "reason 8",
          description: "Description 8",
          typeOfNote: "admin_notes"
        },
        {
          requestId: 9,
          noteId: 9,
          reason: "reason 9",
          description: "Description 9",
          typeOfNote: "admin_notes"
        },
        {
          requestId: 10,
          noteId: 10,
          reason: "reason 10",
          description: "Description 10",
          typeOfNote: "admin_notes"
        },
        {
          requestId: 11,
          noteId: 11,
          reason: "reason 11",
          description: "Description 11",
          typeOfNote: "admin_notes"
        },
        {
          requestId: 12,
          noteId: 12,
          reason: "reason 12",
          description: "Description 12",
          typeOfNote: "admin_notes"
        },
        {
          requestId: 13,
          noteId: 13,
          reason: "reason 13",
          description: "Description 13",
          typeOfNote: "admin_notes"
        },
        {
          requestId: 14,
          noteId: 14,
          reason: "reason 14",
          description: "Description 14",
          typeOfNote: "admin_notes"
        },
        {
          requestId: 15,
          noteId: 15,
          reason: "reason 15",
          description: "Description 15",
          typeOfNote: "admin_notes"
        },
        {
          requestId: 16,
          noteId: 16,
          reason: "reason 16",
          description: "Description 16",
          typeOfNote: "admin_notes"
        },
        {
          requestId: 17,
          noteId: 17,
          reason: "reason 17",
          description: "Description 17",
          typeOfNote: "admin_notes"
        },
        {
          requestId: 18,
          noteId: 18,
          reason: "reason 18",
          description: "Description 18",
          typeOfNote: "admin_notes"
        },
        {
          requestId: 19,
          noteId: 19,
          reason: "reason 19",
          description: "Description 19",
          typeOfNote: "admin_notes"
        },
        {
          requestId: 20,
          noteId: 20,
          reason: "reason 20",
          description: "Description 20",
          typeOfNote: "admin_notes"
        },
        {
          requestId: 21,
          noteId: 21,
          reason: "reason 21",
          description: "Description 21",
          typeOfNote: "admin_notes"
        },
        {
          requestId: 22,
          noteId: 22,
          reason: "reason 22",
          description: "Description 22",
          typeOfNote: "admin_notes"
        },
        {
          requestId: 23,
          noteId: 23,
          reason: "reason 23",
          description: "Description 23",
          typeOfNote: "admin_notes"
        },
        {
          requestId: 24,
          noteId: 24,
          reason: "reason 24",
          description: "Description 24",
          typeOfNote: "admin_notes"
        },
        {
          requestId: 25,
          noteId: 25,
          reason: "reason 25",
          description: "Description 25",
          typeOfNote: "admin_notes"
        },
        {
          requestId: 26,
          noteId: 26,
          reason: "reason 26",
          description: "Description 26",
          typeOfNote: "admin_notes"
        },
        {
          requestId: 27,
          noteId: 27,
          reason: "reason 27",
          description: "Description 27",
          typeOfNote: "admin_notes"
        },
        {
          requestId: 28,
          noteId: 28,
          reason: "reason 28",
          description: "Description 28",
          typeOfNote: "admin_notes"
        },
        {
          requestId: 29,
          noteId: 29,
          reason: "reason 29",
          description: "Description 29",
          typeOfNote: "admin_notes"
        },
        {
          requestId: 30,
          noteId: 30,
          reason: "reason 30",
          description: "Description 30",
          typeOfNote: "admin_notes"
        },
        {
          requestId: 31,
          noteId: 31,
          reason: "reason 31",
          description: "Description 31",
          typeOfNote: "admin_notes"
        },
        {
          requestId: 32,
          noteId: 32,
          reason: "reason 32",
          description: "Description 32",
          typeOfNote: "admin_notes"
        },
        {
          requestId: 33,
          noteId: 33,
          reason: "reason 33",
          description: "Description 33",
          typeOfNote: "admin_notes"
        },
        {
          requestId: 34,
          noteId: 34,
          reason: "reason 34",
          description: "Description 34",
          typeOfNote: "admin_notes"
        },
        {
          requestId: 35,
          noteId: 35,
          reason: "reason 35",
          description: "Description 35",
          typeOfNote: "admin_notes"
        },
        {
          requestId: 36,
          noteId: 36,
          reason: "reason 36",
          description: "Description 36",
          typeOfNote: "admin_notes"
        },
        {
          requestId: 1,
          noteId: 37,
          reason: "reason 1",
          description: "Description 1",
          typeOfNote: "patient_notes"
        },
        {
          requestId: 2,
          noteId: 38,
          reason: "reason 2",
          description: "Description 2",
          typeOfNote: "patient_notes"
        },
        {
          requestId: 3,
          noteId: 39,
          reason: "reason 3",
          description: "Description 3",
          typeOfNote: "patient_notes"
        },
        {
          requestId: 4,
          noteId: 40,
          reason: "reason 4",
          description: "Description 4",
          typeOfNote: "patient_notes"
        },
        {
          requestId: 5,
          noteId: 41,
          reason: "reason 5",
          description: "Description 5",
          typeOfNote: "patient_notes"
        },
        {
          requestId: 6,
          noteId: 42,
          reason: "reason 6",
          description: "Description 6",
          typeOfNote: "patient_notes"
        },
        {
          requestId: 7,
          noteId: 43,
          reason: "reason 7",
          description: "Description 7",
          typeOfNote: "patient_notes"
        },
        {
          requestId: 8,
          noteId: 44,
          reason: "reason 8",
          description: "Description 8",
          typeOfNote: "patient_notes"
        },
        {
          requestId: 9,
          noteId: 45,
          reason: "reason 9",
          description: "Description 9",
          typeOfNote: "patient_notes"
        },
        {
          requestId: 10,
          noteId: 46,
          reason: "reason 10",
          description: "Description 10",
          typeOfNote: "patient_notes"
        },
        {
          requestId: 11,
          noteId: 47,
          reason: "reason 11",
          description: "Description 11",
          typeOfNote: "patient_notes"
        },
        {
          requestId: 12,
          noteId: 48,
          reason: "reason 12",
          description: "Description 12",
          typeOfNote: "patient_notes"
        },
        {
          requestId: 13,
          noteId: 49,
          reason: "reason 13",
          description: "Description 13",
          typeOfNote: "patient_notes"
        },
        {
          requestId: 14,
          noteId: 50,
          reason: "reason 14",
          description: "Description 14",
          typeOfNote: "patient_notes"
        },
        {
          requestId: 15,
          noteId: 51,
          reason: "reason 15",
          description: "Description 15",
          typeOfNote: "patient_notes"
        },
        {
          requestId: 16,
          noteId: 52,
          reason: "reason 16",
          description: "Description 16",
          typeOfNote: "patient_notes"
        },
        {
          requestId: 17,
          noteId: 53,
          reason: "reason 17",
          description: "Description 17",
          typeOfNote: "patient_notes"
        },
        {
          requestId: 18,
          noteId: 54,
          reason: "reason 18",
          description: "Description 18",
          typeOfNote: "patient_notes"
        },
        {
          requestId: 19,
          noteId: 55,
          reason: "reason 19",
          description: "Description 19",
          typeOfNote: "patient_notes"
        },
        {
          requestId: 20,
          noteId: 56,
          reason: "reason 20",
          description: "Description 20",
          typeOfNote: "patient_notes"
        },
        {
          requestId: 21,
          noteId: 57,
          reason: "reason 21",
          description: "Description 21",
          typeOfNote: "patient_notes"
        },
        {
          requestId: 22,
          noteId: 58,
          reason: "reason 22",
          description: "Description 22",
          typeOfNote: "patient_notes"
        },
        {
          requestId: 23,
          noteId: 59,
          reason: "reason 23",
          description: "Description 23",
          typeOfNote: "patient_notes"
        },
        {
          requestId: 24,
          noteId: 60,
          reason: "reason 24",
          description: "Description 24",
          typeOfNote: "patient_notes"
        },
        {
          requestId: 25,
          noteId: 61,
          reason: "reason 25",
          description: "Description 25",
          typeOfNote: "patient_notes"
        },
        {
          requestId: 26,
          noteId: 62,
          reason: "reason 26",
          description: "Description 26",
          typeOfNote: "patient_notes"
        },
        {
          requestId: 27,
          noteId: 63,
          reason: "reason 27",
          description: "Description 27",
          typeOfNote: "patient_notes"
        },
        {
          requestId: 28,
          noteId: 64,
          reason: "reason 28",
          description: "Description 28",
          typeOfNote: "patient_notes"
        },
        {
          requestId: 29,
          noteId: 65,
          reason: "reason 29",
          description: "Description 29",
          typeOfNote: "patient_notes"
        },
        {
          requestId: 30,
          noteId: 66,
          reason: "reason 30",
          description: "Description 30",
          typeOfNote: "patient_notes"
        },
        {
          requestId: 31,
          noteId: 67,
          reason: "reason 31",
          description: "Description 31",
          typeOfNote: "patient_notes"
        },
        {
          requestId: 32,
          noteId: 68,
          reason: "reason 32",
          description: "Description 32",
          typeOfNote: "patient_notes"
        },
        {
          requestId: 33,
          noteId: 69,
          reason: "reason 33",
          description: "Description 33",
          typeOfNote: "patient_notes"
        },
        {
          requestId: 34,
          noteId: 70,
          reason: "reason 34",
          description: "Description 34",
          typeOfNote: "patient_notes"
        },
        {
          requestId: 35,
          noteId: 71,
          reason: "reason 35",
          description: "Description 35",
          typeOfNote: "patient_notes"
        },
        {
          requestId: 36,
          noteId: 72,
          reason: "reason 36",
          description: "Description 36",
          typeOfNote: "patient_notes"
        }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("notes", null, {});
  },
};
