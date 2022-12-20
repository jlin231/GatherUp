'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'groupImages';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const data = [
      {
        groupId: 1,
        imageId: 1,
      },
      {
        groupId: 1,
        imageId: 2,
      },
      {
        groupId: 2,
        imageId: 2,
      },
      {
        groupId: 2,
        imageId: 3,
      },
      {
        groupId: 3,
        imageId: 5,
      },
      {
        groupId: 3,
        imageId: 4,
      },
      {
        groupId: 3,
        imageId: 3,
      }
    ]
    await queryInterface.bulkInsert(options, data);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete(options);
  }
};
