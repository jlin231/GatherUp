'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'eventAttendees';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const data = [
      {
        eventId: 1,
        userId: 1,
        status: "member"
      },
      {
        eventId: 1,
        userId: 2,
        status: "waitlist"
      },
      {
        eventId: 2,
        userId: 2,
        status: "pending"
      },
      {
        eventId: 2,
        userId: 1,
        status: "pending"
      },
      {
        eventId: 3,
        userId: 1,
        status: "pending"
      },
      {
        eventId: 3,
        userId: 3,
        status: "pending"
      }
    ]
    await queryInterface.bulkInsert(options, data);
  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.bulkDelete(options);
  }
};
