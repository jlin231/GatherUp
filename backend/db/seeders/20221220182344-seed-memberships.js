'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'Memberships';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const data = [
      {
        groupId: 1,
        userId: 1,
        status: "pending"
      },
      {
        groupId: 1,
        userId: 2,
        status: "co-host"
      },
      {
        groupId: 2,
        userId: 3,
        status: "member"
      },
      {
        groupId: 2,
        userId: 1,
        status: "co-host"
      },
      {
        groupId: 2,
        userId: 2,
        status: "pending"
      },
      {
        groupId: 3,
        userId: 1,
        status: "member"
      },
      {
        groupId: 3,
        userId: 3,
        status: "pending"
      }
    ]
    await queryInterface.bulkInsert(options, data);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete(options);
  }
};
