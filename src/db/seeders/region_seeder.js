const { Sequelize } = require('sequelize');
const Region = require('../models/region'); 

const regions = [
    { region_id: 1, region_name: 'Maryland' },
    { region_id: 2, region_name: 'Virginia' },
    { region_id: 3, region_name: 'New York' },
    { region_id: 4, region_name: 'District of Columbia' },
  ];
  
  async function seed() {
    try {

      await Sequelize.authenticate();
      console.log('Connection has been established successfully.');

      // Bulk create regions
      await Region.bulkCreate(regions);
      console.log('Regions seeded successfully.');
    } catch (error) {
      console.error('Error seeding data:', error);
    } finally {
      // Close database connection
      await Sequelize.close();
    }
  }
  
seed();
  