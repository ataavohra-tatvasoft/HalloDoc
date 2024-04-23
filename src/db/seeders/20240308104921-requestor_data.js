"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const dob = new Date("2001-07-20");
    await queryInterface.bulkInsert(
      "requestor",
      [
        {
          user_id: 1,
          first_name: "Rahul",
          last_name: "Kapoor",
          email: "rahulkapoor@yopmail.com",
          mobile_number: 919201152758,
          house_name: "House 1",
          city: "City 1",
          createdAt:  new Date(),updatedAt:  new Date(),
          state: "Maryland",
        },
        {
          user_id: 2,
          first_name: "Vijay",
          last_name: "Singh",
          email: "vijaysingh@yopmail.com",
          mobile_number: 918201152758,
          house_name: "House 2",
          city: "City 2",
          createdAt:  new Date(),updatedAt:  new Date(),
          state: "Virginia",
        },
        {
          user_id: 3,
          first_name: "Amit",
          last_name: "Patel",
          email: "amitpatel@yopmail.com",
          mobile_number: 917201152758,
          house_name: "House 3",
          city: "City 3",
          createdAt:  new Date(),updatedAt:  new Date(),
          state: "Maryland",
        },
        {
          user_id: 4,
          first_name: "Darshan",
          last_name: "Desai",
          email: "darshandesai@yopmail.com",
          mobile_number: 916201152758,
          house_name: "House 4",
          city: "City 4",
          createdAt:  new Date(),updatedAt:  new Date(),
          state: "Virgnia",
        },
        {
          user_id: 5,
          first_name: "Sushant",
          last_name: "Mehta",
          email: "sushantsharma@yopmail.com",
          mobile_number: 915201152758,
          house_name: "House 5",
          city: "City 5",
          createdAt:  new Date(),updatedAt:  new Date(),
          state: "Maryland",
        },
        {
          user_id: 6,
          first_name: "Arjun",
          last_name: "Sharma",
          email: "arjunsharma@yopmail.com",
          mobile_number: 914201152758,
          house_name: "House 6",
          city: "City 6",
          createdAt:  new Date(),updatedAt:  new Date(),
          state: "Virginia",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("requestor", null, {});
  },
};
