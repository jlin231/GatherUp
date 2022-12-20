'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'groupUsers';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = [
      {
        groupId: 1,
        userId: 1,
        status: "Pending"
      },
      {
        groupId: 1,
        userId: 2,
        status: "Pending"
      },
      {
        groupId: 2,
        userId: 3,
        status: "Pending"
      },
      {
        groupId: 2,
        userId: 1,
        status: "Pending"
      },
      {
        groupId: 3,
        userId: 1,
        status: "Pending"
      },
      {
        groupId: 3,
        userId: 3,
        status: "Pending"
      }
    ]
    await queryInterface.bulkInsert(options, data);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(options);
  }
};
