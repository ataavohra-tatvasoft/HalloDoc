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
          mobile_no: 915279861230,
          email: "business_1@gmail.com",
          business_contact: 915279861230,
          street: "Street_1",
          city: "City_1",
          state: "Virginia",
          zip: 994512,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          business_id: 2,
          business_name: "Business 2",
          business_website: "business_2.com",
          profession: "Profession 1",
          fax_number: 455546,
          mobile_no: 915289861230,
          email: "business_2@gmail.com",
          business_contact: 915279961230,
          street: "Street_2",
          city: "City_2",
          state: "Virginia",
          zip: 996512,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          business_id: 3,
          business_name: "Business 3",
          business_website: "business_3.com",
          profession: "Profession 3",
          fax_number: 452545,
          mobile_no: 915215661230,
          email: "business_3@gmail.com",
          business_contact: 915124861230,
          street: "Street_3",
          city: "City_3",
          state: "District Of Columbia",
          zip: 992312,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          business_id: 4,
          business_name: "Business 4",
          business_website: "business_4.com",
          profession: "Profession 4",
          fax_number: 453245,
          mobile_no: 915265261230,
          email: "business_4@gmail.com",
          business_contact: 915212861230,
          street: "Street_4",
          city: "City_4",
          state: "DIstrict Of Columbia",
          zip: 990212,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("business-vendor", null, {});
  },
};
