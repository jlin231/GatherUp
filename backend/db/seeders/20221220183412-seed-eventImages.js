'use strict';
let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'eventImages';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const data = [
      {
        eventId: 1,
        imageId: 1,
      },
      {
        eventId: 1,
        imageId: 2,
      },
      {
        eventId: 2,
        imageId: 3,
      },
      {
        eventId: 2,
        imageId: 2,
      },
      {
        eventId: 3,
        imageId: 3,
      },
      {
        eventId: 3,
        imageId: 4,
      },
      {
        eventId: 3,
        imageId: 5,
      },
    ]
    await queryInterface.bulkInsert(options, data);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete(options);
  }
};
