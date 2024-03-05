const { Sequelize } = require('sequelize');
const Profession = require('../models/profession'); 

const professions = [
    { profession_id: 1, profession_name: 'Profession 1' },
    { profession_id: 2, profession_name: 'Profession 2' },
    { profession_id: 3, profession_name: 'Profession 3' },
    { profession_id: 4, profession_name: 'Profession 4' },
  ];
  
  async function seed() {
    try {

      await Sequelize.authenticate();
      console.log('Connection has been established successfully.');

      // Bulk create regions
      await Profession.bulkCreate(professions);
      console.log('Professions seeded successfully.');
    } catch (error) {
      console.error('Error seeding data:', error);
    } finally {
      // Close database connection
      await Sequelize.close();
    }
  }
  
seed();
  