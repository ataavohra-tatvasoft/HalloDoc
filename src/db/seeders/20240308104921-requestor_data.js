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
          email: "rahulkapoor@outlook.com",
          mobile_number: 9201152758,
          house_name: "House 1",
          city: "Ahmedabad",
          state: "Gujarat",
        },
        {
          user_id: 2,
          first_name: "Vijay",
          last_name: "Singh",
          email: "vijaysingh@outlook.com",
          mobile_number: 8201152758,
          house_name: "House 2",
          city: "Ahmedabad",
          state: "Gujarat",
        },
        {
          user_id: 3,
          first_name: "Amit",
          last_name: "Patel",
          email: "amitpatel@outlook.com",
          mobile_number: 7201152758,
          house_name: "House 3",
          city: "Ahmedabad",
          state: "Gujarat",
        },
        {
          user_id: 4,
          first_name: "Darshan",
          last_name: "Desai",
          email: "darshandesai@outlook.com",
          mobile_number: 6201152758,
          house_name: "House 4",
          city: "Ahmedabad",
          state: "Gujarat",
        },
        {
          user_id: 5,
          first_name: "Sushant",
          last_name: "Mehta",
          email: "sushantsharma@outlook.com",
          mobile_number: 5201152758,
          house_name: "House 5",
          city: "Ahmedabad",
          state: "Gujarat",
        },
        {
          user_id: 6,
          first_name: "Arjun",
          last_name: "Sharma",
          email: "arjunsharma@outlook.com",
          mobile_number: 4201152758,
          house_name: "House 6",
          city: "Ahmedabad",
          state: "Gujarat",
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("requestor", null, {});
  },
};
