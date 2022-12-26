'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'venueGroups';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const data = [
      {
        venueId: 1,
        groupId: 1,
      },
      {
        venueId: 2,
        groupId: 2,
      },
      {
        venueId: 3,
        groupId: 3,
      }
    ]
    await queryInterface.bulkInsert(options, data);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete(options);
  }
};
