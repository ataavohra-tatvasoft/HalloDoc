"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const dob = new Date("2001-07-20");
    await queryInterface.bulkInsert(
      "business-vendor",
      [
        {
          business_id: 1,
          business_name: "Business 1",
          business_website: "business_1.com",
          profession: "Profession 1",
          fax_number: 455445,
          mobile_no: 5279861230,
          email: "business_1@gmail.com",
          business_contact: 5279861230,
          street: "Street_1",
          city: "City 1",
          state: "Virginia",
          zip: 994512,
        }
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("business", null, {});
  },
};
