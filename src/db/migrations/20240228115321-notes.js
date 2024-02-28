'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('notes', {
      noteId: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      requestId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Request",
          key: 'request_id',
        },
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      typeOfNote: {
        type: Sequelize.ENUM('transfer', 'admin', 'physician'),
        allowNull: false,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
