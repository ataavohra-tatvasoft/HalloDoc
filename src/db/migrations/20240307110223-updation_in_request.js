'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn(
      'request', // Replace with your actual table name
      'physician_id', // Replace with your new column name
      {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "User",
          key: "user_id",
          onDelete: "SET NULL",
          onUpdate: "CASCADE",
        },
      }
    );
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('request', 'physician_id');
  }
};
