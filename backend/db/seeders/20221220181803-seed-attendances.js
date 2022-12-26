'use strict';

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}
options.tableName = 'Attendances';

const { Event, User } = require('../models')

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let users = await User.findAll();
    let event = await Event.findAll();

    const data = [
      {
        eventId: 1,
        userId: 1,
        status: "attending"
      },
      {
        eventId: 1,
        userId: 2,
        status: "waitlist"
      },
      {
        eventId: 2,
        userId: 2,
        status: "attending"
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
        status: "attending"
      },
      {
        eventId: 5,
        userId: 1,
        status: "pending"
      },
      {
        eventId: 5,
        userId: 2,
        status: "attending"
      }
    ]
    await queryInterface.bulkInsert(options, data);
  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.bulkDelete(options);
  }
};
